import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UploadPpPage} from "../upload-pp/upload-pp";
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public mediaProvider: MediaProvider, private alertCtrl: AlertController) {
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

  changePP() {
    this.navCtrl.push(UploadPpPage);
  }

  deleteMedia(id) {

    let confirmAlert = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you want to delete the post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.mediaProvider.deleteMedia(this.userToken, id).subscribe(data => {
              console.log(data);
              this.refresh();
              postDeletedAlert.present();
            });
          }
        }
      ]
    });

    let postDeletedAlert = this.alertCtrl.create({
      title: 'Delete',
      subTitle: 'Post successfully deleted',
      buttons: ['Dismiss']
    });

    confirmAlert.present();
  }

  getUserId(id){


  }

  getOwnProfilePic() {
    return this.getProfilePic(this.userInfo.user_id);
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
    if (this.firstOrRefresh) {
      this.mediaProvider.getAllMedia().subscribe(data => {
        this.mediaArray = data;
        this.mediaArray.reverse();
        this.mediaArray = this.mediaArray.filter(media => media.user_id == this.userInfo.user_id);
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
