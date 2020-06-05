import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeStorage: NativeStorage,
    private router: Router
  ) {
    this.initializeApp();
    firebase.initializeApp(environment.firebase);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.nativeStorage.getItem('google_user')
      .then( data =>{
        console.log("already logged in "+ data.name);
        this.router.navigate(["/home"]);
        this.splashScreen.hide();
      }, error =>{
        this.router.navigate(["/login"]);
        this.splashScreen.hide();
      });
      this.statusBar.styleDefault();
    });
  }
}
