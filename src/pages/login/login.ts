import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/models/user';
import { MediaProvider } from '../../providers/media/media';
import { HttpErrorResponse } from '@angular/common/http';
import { TabsPage } from "../tabs/tabs";
import { RegisterPage } from '../register/register';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * class LoginPage:
 * Authors: Mikael Ahlström, Antti Nyman
 * 
 * 1. Login feature
 * 2. Login to Register navigation
 * 
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
  noSplash: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mediaProvider: MediaProvider, private statusBar: StatusBar) {
  }

    // --- 1. Login feature / Authors: Mikael Ahlström, Antti Nyman -------------------------------------------------------------------------------

  login() {
    this.mediaProvider.login(this.user).subscribe(response => {
      localStorage.setItem('token', response['token']);
      this.navCtrl.setRoot(TabsPage);
      this.mediaProvider.logged = true;
    }, (error: HttpErrorResponse) => {
      this.status = error.error.message;
    });
  }

      // --- 2. Login to Register navigation / Authors: Antti Nyman -------------------------------------------------------------------------------

  moveToRegister() {
    this.navCtrl.push(RegisterPage);
  }

  ionViewDidLoad() {
    this.statusBar.styleLightContent();
    if (!this.mediaProvider.splashLoaded) {
      setTimeout(() => this.splash = false, 8000);
      this.mediaProvider.splashLoaded = true;
    } else {
      this.noSplash = true;
    }

    if (localStorage.getItem('token') !== null) {
      this.mediaProvider.getUserData(localStorage.getItem('token')).subscribe(response => {
        setTimeout(() => this.navCtrl.setRoot(TabsPage), 5000);
        this.mediaProvider.logged = true;
      }, (error: HttpErrorResponse) => {
      });
    }
  }
}
