import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

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
        email: user.email,
        picture: user.imageUrl
      })
      .then(() =>{
        this.router.navigate(["/home", {email: user.email}]);
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
