import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {User} from '../../app/models/user';
import {MediaProvider} from '../../providers/media/media';
import {HttpErrorResponse} from '@angular/common/http';
import {TabsPage} from "../tabs/tabs";
import {RegisterPage} from '../register/register';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: User = {
    password: '',
    username: ''
  };

  status: string;
  splash = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public mediaProvider: MediaProvider) {
  }

  login () {
    this.mediaProvider.login(this.user).
        subscribe(response => {
          localStorage.setItem('token', response['token']);
          this.navCtrl.setRoot(TabsPage);
          this.mediaProvider.logged = true;
        }, (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.status = error.error.message;
        });
  }

  moveToRegister(){
    this.navCtrl.setRoot(RegisterPage);
  }

  ionViewDidLoad() {
    setTimeout(() => this.splash = false, 8000);

    if (localStorage.getItem('token') !== null) {
      this.mediaProvider.getUserData(localStorage.getItem('token')).subscribe(response => {
        setTimeout(() =>  this.navCtrl.setRoot(TabsPage), 5000);
        this.mediaProvider.logged = true;
      }, (error: HttpErrorResponse) => {
        console.log(error);
      });
    }
  }

}
