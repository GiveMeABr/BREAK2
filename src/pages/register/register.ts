import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {LoginPage} from '../login/login';
import {User} from '../../app/interfaces/user';
import {MediaProvider} from '../../providers/media/media';
import {HttpErrorResponse} from '@angular/common/http';
import {TabsPage} from '../tabs/tabs';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public mediaProvider: MediaProvider) {
  }

  moveToLogin(){
    this.navCtrl.setRoot(LoginPage);
  }

  isUserAvailable (username: string) {

    this.mediaProvider.checkUserName(username).subscribe(response => {
      let available = response['available'];
      console.log(available);

      if (!available == true) {
        this.usrMsg = 'Username is not available!'
      } else {
        this.usrMsg = 'Username is available!'
      }
    });
  }

  register(){
    console.log(this.user);

    this.mediaProvider.register(this.user).
      subscribe(response => {
        console.log(response);
        this.mediaProvider.username = this.user.username;
        this.mediaProvider.password = this.user.password;
        this.mediaProvider.email = this.user.email;
        this.mediaProvider.full_name = this.user.full_name;
        this.mediaProvider.login(this.user);
        this.navCtrl.setRoot(TabsPage);
      }, (error: HttpErrorResponse) => {
        console.log(error.error.message);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}
