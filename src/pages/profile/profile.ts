import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { SinglePage } from "../single/single";
import { User } from "../../app/interfaces/user";
import { AlertController } from 'ionic-angular';
import { UploadPpPage } from "../upload-pp/upload-pp";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userid: any;
  hasPpic: boolean;
  pPic: any;
  profilePicUrl: string;
  mediaArray: any;
  allMediaArray: any; // For finding likes.
  ppArray: any;
  displayedMedia: Array<string>;
  grid: Array<Array<string>>; //array of arrays
  userInfo: User = { username: null };
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
  likedPosts: Array<string> = [];
  userLikes: any;
  likeArray: any;
  likesCount: number = 0;
  postsStatus: string = 'active';
  postActiveBoolean: boolean = true;
  likesStatus: string = 'inactive';
  likesActiveBoolean: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mediaProvider: MediaProvider, private alertCtrl: AlertController, private toastCtrl: ToastController) {
  }

  ionViewDidEnter() {
    this.postsStatus = 'active';
    this.likesStatus = 'inactive';
    this.likedPosts = [];
    this.userToken = this.mediaProvider.userHasToken();

    if (this.userToken) {
      this.mediaProvider.getAllProfilePics().subscribe(data => {
        this.ppArray = data;
        this.getOwnLikes();
        this.mediaProvider.getUserData(this.userToken).subscribe((result: User) => {
          this.mediaProvider.userInfo = result;
          this.userInfo = result;
          this.loadMedia();
          this.getOwnProfilePic();
        });
      });
      this.mediaProvider.getUserData(this.userToken).subscribe((result: User) => {
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
    this.likedPosts = [];

    if (this.postsStatus === 'active') {
      this.loadMedia();
    } else {
      this.loadLikes();
    }

  }

  openSingle(id) {
    this.navCtrl.push(SinglePage, {
      mediaID: id,
    });
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
      console.log(this.likeArray);
      this.userLikes = this.likeArray.filter(like => like.user_id == this.userid);
      console.log(this.userLikes);

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

  changePP() {
    this.navCtrl.push(UploadPpPage);
  }

  postsActive() {
    if (this.postsStatus == 'inactive') {
      this.postsStatus = 'active';
      this.likesStatus = 'inactive';
      this.postActiveBoolean = true;
      this.likesActiveBoolean = false;
      this.refresh();
    }
  }

  likesActive() {
    if (this.likesStatus == 'inactive') {
      this.likesStatus = 'active';
      this.postsStatus = 'inactive';
      this.postActiveBoolean = false;
      this.likesActiveBoolean = true;
      this.firstOrRefresh = true;
      this.refresh();
    }
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

  getOwnLikes() {
    this.mediaProvider.getYourLikes(this.userToken).subscribe(data => {
      this.userLikes = data;
      this.mediaProvider.getAllMedia().subscribe(data => {
        this.mediaArray = data;
        this.mediaArray.reverse();

        for (let like of this.userLikes) {
          let subject = this.mediaArray.find(media => like.file_id == media.file_id);
          if (subject != undefined) {
            this.likesCount = this.likedPosts.push(subject);
          }
        }

      });
    });
  }

  mediaToGrid() {
    if (!this.outOfMedia) {
      let displayArray;
      

      // Load likes or posts
      if (this.postsStatus === 'active') {
        displayArray = this.mediaArray;
      } else {
        displayArray = this.likedPosts;
      }

      // If the user has less than 10 likes or posts
      if (this.firstOrRefresh && this.loadLimit >= displayArray.length) {
        this.lastLoad = true;
        this.firstOrRefresh = false;
      }

      let remainder = displayArray.length % 10;

      if (this.loadLimit >= displayArray.length) {
        this.loadLimit = displayArray.length;
      }

      if (displayArray.length % 2 && this.lastLoad) {
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

      if (this.firstOrRefresh && this.loadLimit == displayArray.length) {
        this.outOfMedia = true;
      }

      if (!this.lastLoad) {
        this.picIndex = this.picIndex + 10;
        this.loadLimit = this.picIndex + 10;
      }

      // Prevent crashing when the media runs out
      if (this.loadLimit >= displayArray.length) {
        this.loadLimit = displayArray.length;
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

  loadLikes() {

    if (this.firstOrRefresh) {
      this.mediaProvider.getAllMedia().subscribe(data => {
        this.mediaArray = data;

        for (let like of this.userLikes) {
          let subject = this.mediaArray.find(media => like.file_id == media.file_id);
          if (subject != undefined) {
            this.likesCount = this.likedPosts.push(subject);
          }
        }

        this.likedPosts.reverse();
        this.displayedMedia = this.likedPosts.slice(this.picIndex, this.loadLimit);
        this.grid = Array(Math.ceil(this.displayedMedia.length / 2)); //MATHS!
        this.rowNum = 0; //counter to iterate over the rows in the grid
        this.mediaToGrid();
        this.mediaLoaded = true;
        this.firstOrRefresh = false;
      });
    } else /* Infinite Scroll */ {
      this.displayedMedia = this.displayedMedia.concat(this.likedPosts.slice(this.picIndex, this.loadLimit));
      this.grid = Array(Math.ceil(this.displayedMedia.length / 2)); //MATHS!
      this.mediaToGrid();
      this.mediaLoaded = true;
      
    }

  }

  doInfinite(infiniteScroll) {
    if (this.postsStatus === 'active') {
      setTimeout(() => {
        this.loadMedia();
        infiniteScroll.complete();
      }, 500);
    } else if (this.likesStatus === 'active') {
      setTimeout(() => {
        this.loadLikes();
        infiniteScroll.complete();
      }, 500);
    }
  }

}
