import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FrontPage} from '../front/front';
import {LoginPage} from '../login/login';

/**
 * Generated class for the LogoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  moveToFront(){
    this.navCtrl.setRoot(FrontPage);
  }

  logout(){
    localStorage.removeItem('token');
    this.navCtrl.setRoot(LoginPage);
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
  }

}
