import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {LoginPage} from '../login/login';
import {TabsPage} from '../tabs/tabs';

/**
 * class LogoutPage:
 * Authors: Antti Nyman
 * 
 * 1. Back to home navigation
 * 2. Logout functionality
 * 
 */

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

        // --- 1. Back to home navigation / Authors: Antti Nyman -------------------------------------------------------------------------------

  moveToFront(){
    this.navCtrl.setRoot(TabsPage);
  }
      // --- 2. Logout functionality / Authors: Antti Nyman -------------------------------------------------------------------------------

  logout(){
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage);
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

}
