import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MediaProvider} from '../../providers/media/media';
import {SinglePage} from '../single/single';
import {User} from "../../app/interfaces/user";

/**
 * Generated class for the FrontPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-front',
  templateUrl: 'front.html',
})
export class FrontPage {

  mediaArray: any;
  displayedMedia: Array<string>;
  grid: Array<Array<string>>; //array of arrays
  userInfo: User;
  picIndex = 0;
  items = [];
  loadLimit = 10;
  rowNum = 0;
  firstOrRefresh = true;
  outOfMedia = false;
  lastLoad = false;
  mediaLoaded: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public mediaProvider: MediaProvider) {
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.refresh();
    }, 2000);
  }

  refresh() {
    this.mediaLoaded = false;
    this.firstOrRefresh = true;
    this.picIndex = 0;
    this.loadLimit = 10;
    console.log('refresh');
    this.loadMedia();
  }


  openSingle(id) {
    this.navCtrl.push(SinglePage, {
      mediaID: id,
    });
  }

  ionViewDidEnter() {
    console.log('DidEnter');
    const userToken = this.mediaProvider.userHasToken();
    if (userToken) {
      this.mediaProvider.getUserData(userToken).subscribe((result: User) => {
        this.mediaProvider.userInfo = result;
        this.userInfo = result;
        this.refresh();
      });
    }

  }

  mediaToGrid() {
    if (this.lastLoad == true) {
      this.outOfMedia = true;
    }

    for (let i = 0; i < this.displayedMedia.length; i += 2) { //iterate images
      this.grid[this.rowNum] = Array(2); //declare two elements per row
      if (this.displayedMedia[i]) { //check file URI exists
        this.grid[this.rowNum][0] = this.displayedMedia[i]; //insert image
      }
      if (this.displayedMedia[i + 1]) { //repeat for the second image
        this.grid[this.rowNum][1] = this.displayedMedia[i + 1];
      }
      this.rowNum++; //go on to the next row
    }

    this.picIndex = this.picIndex + 10;
    this.loadLimit = this.picIndex + 10;

    // Prevent crashing when the media runs out
    if (this.loadLimit > this.mediaArray.length) {
      this.loadLimit = this.mediaArray.length;
      this.picIndex = this.mediaArray.length;
      this.lastLoad = true;
    }
  }

  loadMedia() {
    console.log('firstOrRefresh: ', this.firstOrRefresh);
    if (this.firstOrRefresh) {
      this.mediaProvider.getAllMedia().subscribe(data => {
        this.mediaArray = data;
        this.mediaArray.reverse();
        this.displayedMedia = this.mediaArray.slice(this.picIndex, this.loadLimit);
        this.grid = Array(Math.ceil(this.displayedMedia.length / 2)); //MATHS!
        this.rowNum = 0; //counter to iterate over the rows in the grid
        this.mediaToGrid();
        this.firstOrRefresh = false;
        this.mediaLoaded = true;
      });
    } else /* Infinite Scroll */ {
      this.displayedMedia = this.displayedMedia.concat(this.mediaArray.slice(this.picIndex, this.loadLimit));
      this.grid = Array(Math.ceil(this.displayedMedia.length / 2)); //MATHS!
      this.mediaToGrid();
    }
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.loadMedia();
      infiniteScroll.complete();
    }, 500);
  }


}
