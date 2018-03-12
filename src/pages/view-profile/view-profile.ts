import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SinglePage} from "../single/single";
import {MediaProvider} from "../../providers/media/media";
import {User} from "../../app/interfaces/user";

/**
 * Generated class for the ViewProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {

  hasPpic: boolean;
  pPic: string;
  userId: any;
  profilePicUrl: string;
  mediaArray: any;
  ppArray: any;
  displayedMedia: Array<string>;
  grid: Array<Array<string>>; //array of arrays
  userInfo: User = {username: null};
  picIndex = 0;
  items = [];
  loadLimit = 10;
  rowNum = 0;
  firstOrRefresh = true;
  outOfMedia = false;
  lastLoad = false;
  userToken: any;
  mediaLoaded = false;
  newestPicIndex: number;
  ownPicArray: any;
  mediaCount: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public mediaProvider: MediaProvider) {
  }
  ionViewDidEnter() {
    this.userToken = this.mediaProvider.userHasToken();
    this.userId = this.mediaProvider.userId;
    console.log(this.userId);

    if (this.userToken) {
      this.mediaProvider.getUserDataViaId(this.userToken, this.userId.toString()).subscribe((result: User) => {
        this.mediaProvider.userInfo = result;
        this.userInfo = result;
        this.loadMedia();
        console.log(this.userId);

        this.mediaProvider.getAllProfilePics().subscribe(data => {
          this.ppArray = data;
          this.getOwnProfilePic();
        });
      });
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.refresh();
      refresher.complete();
    }, 2000);
  }

  refresh() {
    this.outOfMedia = false;
    this.mediaLoaded = false;
    this.lastLoad = false;
    this.firstOrRefresh = true;
    this.picIndex = 0;
    this.loadLimit = 10;
    this.loadMedia();
  }

  openSingle(id) {
    this.navCtrl.push(SinglePage, {
      mediaID: id,
    });
  }

  getOwnProfilePic() {
    this.pPic = this.getProfilePic(this.userInfo.user_id);
    console.log('this.pPic: ', this.pPic);
    if(this.pPic != undefined) {
    this.hasPpic = true;
  } else {
    this.hasPpic = false;
  }
  }

  getProfilePic(id: number) {
    this.ownPicArray = this.ppArray.filter(media => media.user_id == id);
    this.newestPicIndex = Object.keys(this.ownPicArray).length - 1;
    if (Object.keys(this.ownPicArray).length > 0) {
      this.profilePicUrl = this.mediaProvider.mediaUrl + this.ownPicArray[this.newestPicIndex].filename;
      return this.profilePicUrl;
    }
  }

  mediaToGrid() {
    if (!this.outOfMedia) {

      // If the user has less than 10 likes or posts
      if (this.firstOrRefresh && this.loadLimit >= this.mediaArray.length) {
        this.lastLoad = true;
        this.firstOrRefresh = false;
      }

      let remainder = this.mediaArray.length % 10;

      if (this.loadLimit >= this.mediaArray.length) {
        this.mediaArray.length;
      }

      if (this.mediaArray.length % 2 && this.lastLoad) {
        for (let i = 0; i < this.displayedMedia.length; i += 1) { //iterate images
          this.grid[this.rowNum] = Array(1); //declare two elements per row
          if (this.displayedMedia[i]) { //check file URI exists
            this.grid[this.rowNum][0] = this.displayedMedia[i]; //insert image
          }
          this.rowNum++; //go on to the next row
        }
      } else {
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
      }

      if (this.lastLoad == true) {
        this.outOfMedia = true;
      }

      if (this.firstOrRefresh && this.loadLimit == this.mediaArray.length) {
        this.outOfMedia = true;
      }

      if (!this.lastLoad) {
        this.picIndex = this.picIndex + 10;
        this.loadLimit = this.picIndex + 10;
      }

      // Prevent crashing when the media runs out
      if (this.loadLimit >= this.mediaArray.length) {
        this.loadLimit = this.mediaArray.length;
        this.picIndex = this.loadLimit - remainder;
        this.lastLoad = true;
      }
    }
  }

  loadMedia() {
    if (this.firstOrRefresh) {
      this.mediaProvider.getAllMedia().subscribe(data => {
        this.mediaArray = data;
        this.mediaArray.reverse();
        this.mediaArray = this.mediaArray.filter(media => media.user_id == this.userInfo.user_id);
        this.mediaCount = Object.keys(this.mediaArray).length;
        this.displayedMedia = this.mediaArray.slice(this.picIndex, this.loadLimit);
        this.grid = Array(Math.ceil(this.displayedMedia.length / 2)); //MATHS!
        this.rowNum = 0; //counter to iterate over the rows in the grid
        this.mediaToGrid();
        this.firstOrRefresh = false;
        this.mediaLoaded = true;
      });
    } else /* Infinite Scroll */ {
      this.mediaArray = this.mediaArray.filter(media => media.user_id == this.userInfo.user_id);
      this.displayedMedia = this.displayedMedia.concat(this.mediaArray.slice(this.picIndex, this.loadLimit));
      this.grid = Array(Math.ceil(this.displayedMedia.length / 2)); //MATHS!
      this.mediaToGrid();
      this.mediaLoaded = true;
    }
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.loadMedia();
      infiniteScroll.complete();
    }, 500);
  }

}
