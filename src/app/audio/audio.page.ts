import { Component, OnInit, ViewChild } from '@angular/core';
import { Howl } from 'howler';
import { Track } from '../models/Track';
import { IonRange } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.page.html',
  styleUrls: ['./audio.page.scss'],
})
export class AudioPage implements OnInit {
  activeTrack: Track = null;
  player: Howl;
  isPlaying = false;
  progress = 0;
  @ViewChild('range', { static: false }) range: IonRange;

  audioList: Track[] = [
    {
      name: 'Soothing music',
      path: '../assets/audio/bensound-cute.mp3'
    }
  ]

  constructor(
    private router: Router,
    private googlePlus: GooglePlus,
    private nativeStorage: NativeStorage
    ) { 
    this.load(this.audioList[0]);
  }

  ngOnInit() {
  }

  load(track: Track){
    if (this.player) {
      this.player.stop();
    }
    
    this.player = new Howl({
      src: [track.path],
      html5: true });
      this.isPlaying = false;
      this.activeTrack = track;
  }

  start(track: Track) {
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.path],
      html5: true,
      onplay: () => {
        this.isPlaying = true;
        this.activeTrack = track;
        this.updateProgress();
      },
      onend: () => {
        this.togglePlayer(true);
      }
    });
    this.player.play();
  }

  togglePlayer(pause) {
    this.isPlaying = !pause;
    if (pause) {
      this.player.pause();
    }
    else {
      this.player.play();
    }
  }

  seek() {
    let newValue = +this.range.value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));
  }

  updateProgress() {
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress();
    }, 1000);
  }

  stopMusic(){
    if (this.player) {
      this.player.stop();
    }
  }

  goToFeedback(){
    this.stopMusic();
    this.router.navigate(['/feedback']);
  }

  doGoogleLogout() {

    this.googlePlus.trySilentLogin({}).then(res => {
      this.googlePlus.logout().then(res => {
        this.nativeStorage.remove('google_user');
        if (this.player) {
          this.player.stop();
        }
        this.router.navigate(["/login"])
          .catch(error => {
            // handle error
          });
      }).catch(error => {
        this.googlePlus.disconnect().then(res => {
          this.nativeStorage.remove('google_user');
          this.router.navigate(["/login"])
        }).catch(error => {
          // handle error
        });
      });
    });
  }

}
