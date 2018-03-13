import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {User} from '../../app/interfaces/user';
import {MediaProvider} from '../../providers/media/media';
import {HttpErrorResponse} from '@angular/common/http';
import {TabsPage} from '../tabs/tabs';

/**
 * class RegisterPage:
 * Authors: Mikael Ahlström, Antti Nyman
 * 
 * 1. Move to login navigation
 * 2. Username availability check
 * 3. Register user
 * 
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user: User = {
    username: '',
    password: '',
    email: '',
    full_name: '',
  };

  usrMsg: string;
  availableStatus: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public mediaProvider: MediaProvider, private toastCtrl: ToastController) {
  }

   // --- 1. Move to login navigation / Authors: Antti Nyman -------------------------------------------------------------------------------


  moveToLogin(){
    this.navCtrl.setRoot(LoginPage);
  }

   // --- 2. Username availability check / Authors: Mikael Ahlström, Antti Nyman -------------------------------------------------------------------------------

  isUserAvailable (username: string) {

    this.mediaProvider.checkUserName(username).subscribe(response => {
      let available = response['available'];
      if (!available == true) {
        this.usrMsg = 'Username is not available!';
        this.availableStatus = "unavailable";
      } else {
        this.usrMsg = 'Username is available!';
        this.availableStatus = "available";
      }
    });
  }

   // --- 3. Register user / Authors: Antti Nyman -------------------------------------------------------------------------------

  register(){
    this.mediaProvider.register(this.user).
      subscribe(response => {
        this.mediaProvider.username = this.user.username;
        this.mediaProvider.password = this.user.password;
        this.mediaProvider.email = this.user.email;
        this.mediaProvider.full_name = this.user.full_name;
        this.mediaProvider.login(this.user).
          subscribe(response => {
            localStorage.setItem('token', response['token']);
            this.navCtrl.setRoot(TabsPage);
            this.mediaProvider.logged = true;
          }, (error: HttpErrorResponse) => {
          });
      }, (error: HttpErrorResponse) => {
      let errorToast = this.toastCtrl.create({
        message: error.error.message.toString(),
        duration: 3000,
        position: 'middle'
      });
      errorToast.present();
      });
  }

  ionViewDidLoad() {
  }

}
