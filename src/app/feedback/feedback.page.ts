import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  constructor(
    private _alertController: AlertController,
    private router: Router,
    private googlePlus: GooglePlus,
    private nativeStorage: NativeStorage) { }

  ngOnInit() {
  }

  async popup() {
    const alert = await this._alertController.create({
      message: "Thank you for your time. You can exit or start again.",
      buttons: [{
        text: "Exit",
        handler: () => {
          navigator['app'].exitApp();
        }
      },
      {
        text: "Start over",
        handler: () => {
          this.router.navigate(['/home']);
        }
      }]
    });
    return await alert.present();
  }

  doGoogleLogout() {

    this.googlePlus.trySilentLogin({}).then(res => {
      this.googlePlus.logout().then(res => {
        this.nativeStorage.remove('google_user');
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
