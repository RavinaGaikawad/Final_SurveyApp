import { Component, OnInit, ViewChild } from '@angular/core';
import { Howl } from 'howler';
import { Track } from '../models/Track';
import { IonRange } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { Record } from '../models/Record';
import * as firebase from 'firebase';
import * as tracks_json from '../../assets/audio/audioList.json';
import { stringify } from 'querystring';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-audio',
  templateUrl: './audio.page.html',
  styleUrls: ['./audio.page.scss'],
})
export class AudioPage implements OnInit {
  activeTrack: string = null;
  player: Howl;
  isPlaying = false;
  progress = 0;
  @ViewChild('range', { static: false }) range: IonRange;
  record: Record;
  audioURL: string;
  play = false;
  tracks: Track[] = (tracks_json as any).default;

  constructor(
    private router: Router,
    private googlePlus: GooglePlus,
    private nativeStorage: NativeStorage
  ) {
    console.log("json", JSON.stringify(this.tracks));
    this.initial();
  }

  ngOnInit() {
  }

  initial() {
    this.nativeStorage.getItem('record')
      .then((data) => {
        this.record = JSON.parse(data.record);

        this.tracks.forEach(element => {
          if (element.moodID == this.record.mood_before){
            this.record.audio = element.audioURL;
          }
        });

        firebase.storage().ref(this.record.audio).getDownloadURL()
          .then((response) => {
            this.audioURL = response;
            this.load(response);
          })
          .catch((err) => console.log("error", JSON.stringify(err)))
      })
      .catch((err) => console.log("error", JSON.stringify(err)));
  }

  async load(audio_url) {

    //Call firebase to get Audio and save the audio id to record object
    await this.nativeStorage.setItem('record', {
      record: JSON.stringify(this.record)
    })
      .then(() => {
    if (this.player) {
      this.player.stop();
    }

    this.player = new Howl({
      src: [audio_url],
      html5: true
    });

    this.isPlaying = false;
    this.activeTrack = audio_url;

      }, error => {
        console.log(error);
      })
  }

  start() {
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: [this.audioURL],
      html5: true,
      onplay: () => {
        this.play = true;
        this.isPlaying = true;
        this.activeTrack = this.audioURL;
        this.updateProgress();
      },
      onend: () => {
        this.isPlaying = false;
        this.goToFeedback();
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

  stopMusic() {
    if (this.player) {
      this.player.stop();
    }
  }

  goToFeedback() {
    this.stopMusic();
    this.router.navigate(['/feedback']);
  }

  doGoogleLogout() {

    this.googlePlus.trySilentLogin({}).then(res => {
      this.googlePlus.logout().then(res => {
        this.nativeStorage.remove('google_user');
        this.nativeStorage.remove('record');
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
          this.nativeStorage.remove('record');
          this.router.navigate(["/login"])
        }).catch(error => {
          // handle error
        });
      });
    });
  }
}
