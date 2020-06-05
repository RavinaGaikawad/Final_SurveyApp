import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { Router } from '@angular/router';
import { Record } from '../models/Record';
import * as firebase from 'firebase';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  record: Record;
  ref = firebase.database().ref('records/');
  recordList: any[];
  maxID: number = 0;

  constructor(
    private _alertController: AlertController,
    private router: Router,
    private googlePlus: GooglePlus,
    private nativeStorage: NativeStorage) 
    {
    this.nativeStorage.getItem('record')
      .then((data) => {
        this.record = JSON.parse(data.record);
        var temp_record = JSON.parse(data.record);
        var isFound = false;
      firebase.database().ref('records').once('value').then(function (snapshot) {
      console.log("Snapshot record ", JSON.stringify(snapshot.val()));

      var data = JSON.parse(JSON.stringify(snapshot.val()));
      for (var key in data) {
        console.log("data values", JSON.stringify(data[key]));
        //this.recordList.push(JSON.parse(JSON.stringify(data[key])));
        var temp = data[key];
        for (var rec in temp) {
          console.log("data values inside ", rec);

          if (rec == "emailID"){
            console.log("inside email 1");
            if (temp[rec] == temp_record.record.emailID) {
              console.log("inside email 2");
              isFound = true;
            }
          }
          if(isFound){
            console.log("Found");
            if(rec == "id"){
              console.log("inside id");
              temp_record.id = temp[rec];
              break;
            }
          }
          if(rec == "id"){
            console.log("update max id");
            if(parseInt(temp[rec]) > this.maxID){
              this.maxID = parseInt(temp[rec]);
            }
          }         
        }
        if (isFound) {
          console.log("if found exit");
          break;
        }
      }

      if (!isFound) {
        console.log("not found update max id");
        this.record.id = this.maxID + 1;
      }

    }).catch((err) => {
      console.log("error", JSON.stringify(err.message));
    });

      })
      .catch((err) => console.log(err));
      

  }

  ngOnInit() {
  }

  async popup(mood_rating) {

    this.record.mood_after = mood_rating;

    await this.nativeStorage.setItem('record', {
      record: JSON.stringify(this.record)
    })
      .then(async () => {
        console.log("Final record " + JSON.stringify(this.record));
        await this.saveRecord();
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

      }, error => {
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

  async saveRecord() {
    let newRecord = this.ref.push();
    await newRecord.set(this.record).then(function () { console.log("record added") });
  }

}
