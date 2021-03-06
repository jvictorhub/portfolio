import { Component, OnInit } from '@angular/core';
import { NavService } from './../../../components/template/nav/nav.service';
import { Observable } from 'rxjs';
import * as moment from 'moment'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.css']
})
export class CountdownTimerComponent implements OnInit {

  interval;
  eventClock = { date: new Date(), minute: 0, second: 0 };
  audioObj = new Audio();
  audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];
  files = [
    {
      url: './../../../assets/audio/air_plane_ding_dong_sound_effect.mp3',
      name: 'Air Plane Ding Dong'
    },
    {
      url: './../../../assets/audio/pplay.mp3',
      name: 'Pplay'
    },
    {
      url: './../../../assets/audio/trim_alarm_clock_analog.mp3',
      name: 'Trim alarm analog'
    },
    {
      url: './../../../assets/audio/alarm-trim-mad.mp3',
      name: 'Trim alarm mad'
    }
  ];
  selectedSoundIndex = 0
  currentTime = '00:00';
  duration = '00:00';
  seek = 0;
  audioMaxLength = 0

  counterTimerSeconds = 0;
  hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
    '51', '52', '53', '54', '55', '56', '57', '58', '59'];
  seconds = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
    '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
    '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
    '51', '52', '53', '54', '55', '56', '57', '58', '59'];

  selectedHours = '00';
  selectedMinutes = '25';
  selectedSeconds = '00';
  clockToShow = '00:00:00';
  bolClockTicking = false;
  bolLoopMode = false;

  constructor(private navService: NavService, private snackBar: MatSnackBar) {
    navService.navData = {
      title: 'Countdown timer',
      icon: 'timer',
      routeUrl: 'countdown-timer'
    }
  }

  ngOnInit(): void {
    this.counterTimerSeconds = this.getTotalTimerSelectionInSeconds();
    //this.stramObserver(this.files[0].url)
    this.openFile(this.files[this.selectedSoundIndex].url)
    this.clockToShow = this.convertSecondsToClock(this.counterTimerSeconds);
  }

  stramObserver(url) {
    return new Observable(observer => {
      this.audioObj.src = url;
      this.audioObj.load();
      // this.audioObj.play();



      //this.play();


      const handler = (event: Event) => {
        console.log(event);
        this.seek = this.audioObj.currentTime;
        this.audioMaxLength = this.audioObj.duration;
        this.duration = this.timeFormat(this.audioObj.duration);
        this.currentTime = this.timeFormat(this.audioObj.currentTime);
        if (event.type === 'ended') {
          //this.clockToShow = '00:00:00'; // this may confuse the clock by change to 00:00:00 in the middle of the next timer loop
          this.showPlayerPlayButtonAndHidePause();
        }
      }

      this.addEvent(this.audioObj, this.audioEvents, handler);
      return () => {
        this.pause();
        this.audioObj.currentTime = 0;
        this.removeEvent(this.audioObj, this.audioEvents, handler)
      }
    });
  }

  addEvent(obj, events, handler) {
    events.forEach(event => {
      obj.addEventListener(event, handler)
    });
  }

  removeEvent(obj, events, handler) {
    events.forEach(event => {
      obj.removeEventListener(event, handler)
    });
  }

  setSeekTo(ev) {
    this.audioObj.currentTime = ev.target.value;
  }

  openFile(url) {
    this.stramObserver(url).subscribe(event => {

    })
    console.log(url);
  }

  play() {
    this.audioObj.play();
    this.hidePlayerPlayButtonAndShowPause();
    // console.log('Clicked Play Button');
  }

  pause() {
    this.audioObj.pause();
    this.showPlayerPlayButtonAndHidePause();
    // console.log('Clicked Pause Button');
  }

  stop() {
    this.audioObj.pause();
    this.audioObj.currentTime = 0;
    console.log('Clicked Stop Button');
  }

  setVolume(ev) {
    //  this.audioObj.volume = ev.target.value;
    //    console.log(ev.target.value);
    this.audioObj.volume = ev.value;
    console.log(ev.value);
  }

  timeFormat(time, format = "mm:ss") {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  convertSecondsToClock(seconds: number) {
    let hh = '' + Math.floor(seconds / 3600);
    let mm = '' + Math.floor((seconds % 3600) / 60);
    let ss = '' + Math.floor(seconds % 60);
    if (hh.length < 2) hh = '0' + hh
    if (mm.length < 2) mm = '0' + mm
    if (ss.length < 2) ss = '0' + ss
    return hh + ":" + mm + ":" + ss;
  }

  setTimer(event) {
    this.counterTimerSeconds = this.getTotalTimerSelectionInSeconds();
    this.clockToShow = this.convertSecondsToClock(this.counterTimerSeconds);
    return this.counterTimerSeconds;
  }

  setSoundFile(event) {
    this.selectedSoundIndex = event.value;
    this.openFile(this.files[this.selectedSoundIndex].url)
    console.log(event);
    this.pause();
  }

  getTotalTimerSelectionInSeconds() {
    return Number(this.selectedSeconds) + Number(this.selectedMinutes) * 60 + Number(this.selectedHours) * 3600;
  }

  startCountDownTimer(): void {
    this.clockToShow = this.convertSecondsToClock(this.counterTimerSeconds);
    this.hideTimerSelectionDiv();
    this.showSnackBarMessage(`Timer set to ${this.selectedHours}:${this.selectedMinutes}:${this.selectedSeconds}`)
    this.interval = setInterval(() => {
      // console.log(this.eventClock.date)
      this.eventClock.date = new Date(this.eventClock.date.getTime() - 1000);
      if (this.counterTimerSeconds === 0) {
        console.log('timer finished')
        // STACKOVERFLOW https://stackoverflow.com/questions/46486202/how-to-pause-setinterval-with-angular
        clearInterval(this.interval) // pauses the setInterval timer
        this.playAlarm();
        this.showTimerSelectionDiv();
        this.counterTimerSeconds = this.getTotalTimerSelectionInSeconds();
        this.showSnackBarMessage(`Timer finished!`)
        //this.clockToShow = '00:00:00';
        if (this.bolLoopMode === true) {
          console.log(`Loop mode === true, starting a new timer...`)
          this.startCountDownTimer();
        }
      } else {
        this.counterTimerSeconds--;
        this.clockToShow = this.convertSecondsToClock(this.counterTimerSeconds);
      }
    }, 1000);
  }

  stopCountDownTimer(): void {
    console.log('timer stopped')
    this.showSnackBarMessage(`Timer stopped`)
    clearInterval(this.interval) // pauses the setInterval timer
    this.showTimerSelectionDiv();
    this.counterTimerSeconds = this.getTotalTimerSelectionInSeconds();
  }

  showTimerSelectionDiv() {
    //document.getElementById('timer-selection-div').style.display = 'inline'; // none OR inline
    document.getElementById('stop-button').style.display = 'none'; // none OR inline
    document.getElementById('start-button').style.display = 'inline'; // none OR inline
    this.bolClockTicking = false;
  }

  hideTimerSelectionDiv() {
    // document.getElementById('timer-selection-div').style.display = 'none'; // none OR inline
    document.getElementById('stop-button').style.display = 'inline'; // none OR inline
    document.getElementById('start-button').style.display = 'none'; // none OR inline
    this.bolClockTicking = true;
  }

  showPlayerPlayButtonAndHidePause() {
    document.getElementById('play-sound-button').style.display = 'inline'; // none OR inline
    document.getElementById('pause-sound-button').style.display = 'none'; // none OR inline
  }

  hidePlayerPlayButtonAndShowPause() {
    document.getElementById('play-sound-button').style.display = 'none'; // none OR inline
    document.getElementById('pause-sound-button').style.display = 'inline'; // none OR inline
  }

  
  switchBolLoopMode(): void {
    //  [(ngModel)]="bolLoopMode" parameter automatically switches the bolLoopMode value
    console.log(`bolLoopMode switched to = ${this.bolLoopMode}`)
  }

  showSnackBarMessage(msg: string) {
    this.snackBar.open(msg, 'X', {
      duration: 3333,
      horizontalPosition: "center",
      verticalPosition: "bottom",
      panelClass: ['msg-default']
    });
  }

  async playAlarm() {
    console.log('Will play alarm sound...')
    // this.stramObserver(this.files[0].url).subscribe(event => { })
    this.play();
    //await this.delay(4555);
    // this.stramObserver(this.files[1].url).subscribe(event => { })
  }

  // STACKOVERFLOW https://medium.com/aprendajs/angular-6-com-uma-fun%C3%A7%C3%A3o-para-delay-192b4562f2b4
  // nossa função delay com suporte a promisse.
  private delay(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => { resolve(true); }, ms);
    });
  }
}
