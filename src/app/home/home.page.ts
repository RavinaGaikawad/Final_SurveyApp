import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private router: Router,
    private googlePlus: GooglePlus,
    private nativeStorage: NativeStorage
    ) {

    }

  openAudio(){
    this.router.navigate(['/audio']);
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
