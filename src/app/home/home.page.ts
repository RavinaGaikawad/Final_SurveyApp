import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import {Record} from '../models/Record';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  record: Record;
  name: string;

  constructor(
    private router: Router,
    private googlePlus: GooglePlus,
    private nativeStorage: NativeStorage
    ) 
    {
      this.nativeStorage.getItem('record')
      .then((data) => {
        this.record = JSON.parse(data.record);
        console.log("record home name ", this.record.firstName);
        this.name = this.record.firstName;
      })
      .catch((err) => console.log(err));
    }

  openAudio(mood_rating){
    this.record.mood_before = mood_rating;
    this.nativeStorage.setItem('record', {
      record : JSON.stringify(this.record)
    })
    .then(() =>{
      this.router.navigate(['/audio']);
    }, error =>{
      console.log(error);
    })      
  }

  doGoogleLogout() {
    this.googlePlus.trySilentLogin({}).then(res => {
      this.googlePlus.logout().then(res => {
        this.nativeStorage.remove('google_user');
        this.nativeStorage.remove('record');
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
