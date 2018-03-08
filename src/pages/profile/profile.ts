import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
  likesCount: number;
  postsStatus: string = 'active';
  likesStatus: string = 'inactive';


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mediaProvider: MediaProvider, private alertCtrl: AlertController) {
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
    this.likedPosts = [];


    if (this.postsStatus === 'active') {
      this.loadMedia();
    } else {
      this.likesCount = 0;
      this.loadLikes();
    }


  }

  openSingle(id) {
    this.navCtrl.push(SinglePage, {
      mediaID: id,
    });
  }

  changePP() {
    this.navCtrl.push(UploadPpPage);
  }

  postsActive() {
    if (this.postsStatus == 'inactive') {
      this.postsStatus = 'active';
      this.likesStatus = 'inactive';
      this.refresh();
    }
  }

  likesActive() {
    if (this.likesStatus == 'inactive') {
      this.likesStatus = 'active';
      this.postsStatus = 'inactive';
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

    console.log('start picIndex : ', this.picIndex);
    console.log('start loadLimit : ', this.loadLimit);



    if (!this.outOfMedia) {
      let displayArray;

      if (this.postsStatus === 'active') {
        displayArray = this.mediaArray;
      } else {
        displayArray = this.likedPosts;
      }

      console.log('displayArray length: ' ,displayArray.length);

      let remainder = displayArray.length % 10;
      console.log('Remainder: ' ,remainder);

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

      if (this.lastLoad == true) {
        this.outOfMedia = true;
      }

      if (!this.lastLoad) {
        this.picIndex = this.picIndex + 10;
        this.loadLimit = this.picIndex + 10;

      }

      // Prevent crashing when the media runs out
      if (this.loadLimit >= displayArray.length) {
        
        this.loadLimit = displayArray.length;
        console.log('next loadLimit : ', this.loadLimit);
        this.picIndex = this.loadLimit - remainder;
        console.log(' next picIndex : ', this.picIndex);
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
        console.log(this.mediaArray);
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
        this.mediaArray.reverse();

        for (let like of this.userLikes) {
          let subject = this.mediaArray.find(media => like.file_id == media.file_id);
          if (subject != undefined) {
            this.likesCount = this.likedPosts.push(subject);
          }
        }

        console.log(this.likedPosts);
        this.displayedMedia = this.likedPosts.slice(this.picIndex, this.loadLimit);

        this.grid = Array(Math.ceil(this.displayedMedia.length / 2)); //MATHS!
        this.rowNum = 0; //counter to iterate over the rows in the grid
        this.mediaToGrid();
        this.firstOrRefresh = false;
        this.mediaLoaded = true;

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
