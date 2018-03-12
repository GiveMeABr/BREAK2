import {Component} from '@angular/core';
import {App, NavController, NavParams} from 'ionic-angular';
import {MediaProvider} from '../../providers/media/media';
import {SinglePage} from '../single/single';
import {User} from "../../app/interfaces/user";
import {HttpErrorResponse} from '@angular/common/http';
import {ViewProfilePage} from "../view-profile/view-profile";
import { StatusBar } from '@ionic-native/status-bar';
import { ToastController } from 'ionic-angular';

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
  likeArray: any;
  userLikes: any;
  displayedMedia: Array<string>;
  grid: Array<Array<string>>; //array of arrays
  userInfo: User;
  userid: number;
  picIndex = 0;
  items = [];
  loadLimit = 10;
  rowNum = 0;
  firstOrRefresh = true;
  outOfMedia = false;
  lastLoad = false;
  mediaLoaded: boolean;
  private ownPicArray: any;
  ppArray: any;
  private newestPicIndex: number;
  private profilePicUrl: string;
  private likesNum: number;

  

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App,
              public mediaProvider: MediaProvider, private statusBar: StatusBar, private toastCtrl: ToastController) {
  }

  ionViewDidEnter() {
    this.statusBar.styleLightContent();
    const userToken = this.mediaProvider.userHasToken();
    if (userToken) {
      this.mediaProvider.getUserData(userToken).subscribe((result: User) => {
        this.mediaProvider.userInfo = result;
        this.userInfo = result;
        this.mediaProvider.getAllProfilePics().subscribe(data => {
          this.ppArray = data;
          this.refresh();
        });
      });
      this.mediaProvider.getUserData(userToken).subscribe((result: User) => {
        this.mediaProvider.userInfo = result;
        this.userid = result.user_id;
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

  getProfilePic(id: number) {
    this.ownPicArray = this.ppArray.filter(media => media.user_id == id);
    this.newestPicIndex = Object.keys(this.ownPicArray).length - 1;
    if (Object.keys(this.ownPicArray).length > 0) {
      this.profilePicUrl = this.mediaProvider.mediaUrl + this.ownPicArray[this.newestPicIndex].filename;
      return this.profilePicUrl;
    }
  }

  getUserProfile(id: number) {
    const userToken = this.mediaProvider.userHasToken();
    this.mediaProvider.getUserData(userToken).subscribe((result: User) => {
      this.mediaProvider.userInfo = result;
      this.userid = result.user_id;
      if (id == this.userid){
        this.app.getRootNav().getActiveChildNav().select(2);
      }else{
        this.mediaProvider.getUserId(id);
        this.navCtrl.push(ViewProfilePage);
      }
    });
  }


  openSingle(id) {
    this.navCtrl.push(SinglePage, {
      mediaID: id,
    });
    localStorage.setItem('file_id', id);
  }

  clickFavorite(fileId: number) {
    const file_id = {
      file_id: fileId
    };
    console.log(file_id);

    let likeToast = this.toastCtrl.create({
      message: 'Liked',
      duration: 3000,
      position: 'top'
    });

    let dislikeToast = this.toastCtrl.create({
      message: 'Disliked',
      duration: 3000,
      position: 'top'
    });

    this.mediaProvider.getListOfLikes(fileId).subscribe(data => {
      this.likeArray = data;
      this.userLikes = this.likeArray.filter(like => like.user_id == this.userid);

      if (this.userLikes.length > 0) {
        this.mediaProvider.deleteFavorite(localStorage.getItem('token'), fileId)
        .subscribe(response => {
          dislikeToast.present();
          console.log(response);
        }, (error: HttpErrorResponse) => {
          console.log(error)
        });
      } else {
        this.mediaProvider.postFavorite(localStorage.getItem('token'), file_id)
        .subscribe(response => {
          likeToast.present();
          console.log(response);
        }, (error: HttpErrorResponse) => {
          console.log(error)
        });
      }
    });
  }





  mediaToGrid() {
    if (!this.outOfMedia) {
    if (this.lastLoad == true) {
      console.log('this.lastLoad: ', this.lastLoad);
      this.outOfMedia = true;
      console.log('this.outOfMedia: ', this.outOfMedia);
    }

     // If the user has less than 10 likes or posts
     if (this.firstOrRefresh && this.loadLimit >= this.mediaArray.length) {
      this.lastLoad = true;
      this.firstOrRefresh = false;
    }

    let remainder = this.mediaArray.length % 10;

    if (this.loadLimit >= this.mediaArray.length) {
      this.loadLimit = this.mediaArray.length;
    }

    console.log('this.lastLoad: ', this.lastLoad);


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
        console.log('this.mediaArray: ', this.mediaArray);
        this.mediaArray.reverse();
        console.log('this.mediaArray: ', this.mediaArray);
        this.displayedMedia = this.mediaArray.slice(this.picIndex, this.loadLimit);
        console.log('this.displayedMedia: ', this.displayedMedia);
        this.grid = Array(Math.ceil(this.displayedMedia.length / 2)); //MATHS!
        this.rowNum = 0; //counter to iterate over the rows in the grid
        this.mediaToGrid();
        this.firstOrRefresh = false;
        console.log('this.firstOrRefresh: ', this.firstOrRefresh);
        this.mediaLoaded = true;
        console.log('this.mediaLoaded: ', this.mediaLoaded);
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

  amountOfLikes(id: number) {
    this.mediaProvider.getListOfLikes(id).subscribe(data => {
      this.likesNum = Object.keys(data).length;
    });
  }



}
