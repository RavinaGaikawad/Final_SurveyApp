import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Router} from '@angular/router';
import {Record} from '../models/Record';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  record: Record = {
    id: "",
    emailID: "",
    firstName: "",
    mood_before: "",
    audio: "",
    mood_after: "",
    recorded_time:""
  };

  constructor(
    private loadingController: LoadingController,
    private googlePlus: GooglePlus,
    private nativeStorage: NativeStorage,
    private router: Router) {}

    ngOnInit(){

    }

  async doGoogleLogin(){
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    
    this.presentLoading(loading);
  
    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '937670774015-vdu76ccq5qceku2rpvrhoqsee9msd7il.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    })
    .then(user =>{
      loading.dismiss();
  
      this.nativeStorage.setItem('google_user', {
        name: user.displayName,
        email: user.email
      })
      
      this.record.emailID = user.email;
      this.record.firstName = user.givenName;

      this.nativeStorage.setItem('record',{
        record : JSON.stringify(this.record)
      })
      .then(() =>{
        this.router.navigate(["/home"]);
      }, error =>{
        console.log(error);
      })
      loading.dismiss();
    }, err =>{
      console.log(err)
      loading.dismiss();
    });
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
