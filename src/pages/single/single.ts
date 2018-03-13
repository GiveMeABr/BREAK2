import {Component} from '@angular/core';
import {App, NavController, NavParams} from 'ionic-angular';
import {MediaProvider} from '../../providers/media/media';
import {HttpErrorResponse} from '@angular/common/http';
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {MapProvider} from '../../providers/map/map';
import {User} from "../../app/interfaces/user";
import {Comment} from '../../app/interfaces/comment';
import {ViewProfilePage} from "../view-profile/view-profile";

/**
 * class SinglePage:
 * Authors: Mikael Ahlström, Eero Karvonen, Antti Nyman
 *
 * 1. Refreshers
 * 2. User profile getter
 * 3. Comments
 * 4. Getting and displaying media
 * 5. Add favorite
 * 6. Getters (Comments, likes profile pics)
 */

@Component({
  selector: 'page-single',
  templateUrl: 'single.html',
})
export class SinglePage {
  url: string;
  title: string;
  comment: string;
  description: string;
  mediaType: any;

  commentData: Comment = {
    file_id: "",
    comment: ""
  };

  likeArray: any;
  userLikes: any;
  userid: any;
  current_userid: any;
  file_id: any;
  user: User;
  username: any;
  message = '';
  amountOfLikes: number;
  private likesSet: Object;
  commentsArray: Object;
  amountOfComments: number;
  private ownPicArray: any;
  ppArray: any;
  private newestPicIndex: number;
  private profilePicUrl: string;
  mediaLoaded: boolean;
  commentBtnDisabled: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public mediaProvider: MediaProvider, public mapProvider: MapProvider, private app: App,) {
  }

  ionViewDidLoad() {
    this.refresh();
    const userToken = this.mediaProvider.userHasToken();
    if (userToken) {
      this.mediaProvider.getUserData(userToken).subscribe((result: User) => {
        this.mediaProvider.userInfo = result;
        this.current_userid = result.user_id;
      });
    }
  }

  // --- 1. Refreshers / Authors: Mikael Ahlström, Eero Karvonen -------------------------------------------------------------------------------

  doRefresh(refresher) {
    setTimeout(() => {
      this.refresh();
      refresher.complete();
    }, 2000);
  }

  refresh() {
    this.mediaProvider.getSingleMedia(this.navParams.get('mediaID')).subscribe(response => {
      this.url = this.mediaProvider.mediaUrl + response['filename'];
      this.title = response['title'];
      this.mediaType = response['media_type'];
      this.userid = response['user_id'];
      this.file_id = response['file_id'];
      this.description = response['description'];
      const userToken = this.mediaProvider.userHasToken();

      this.mediaProvider.getUserDataViaId(userToken, this.userid.toString()).subscribe((result: User) => {
        this.username = result['username'];
        this.userid= result['user_id'];
        this.mediaProvider.getAllProfilePics().subscribe(data => {
          this.ppArray = data;
          this.getComments(this.file_id);

        });
      });
    });
  }

  // --- 2. User profile getter / Authors: Eero Karvonen -------------------------------------------------------------------------------

  getUserProfile(id: number) {
    console.log(id);
    let userid: number;
    const userToken = this.mediaProvider.userHasToken();
    this.mediaProvider.getUserData(userToken).subscribe((result: User) => {
      this.mediaProvider.userInfo = result;
      userid = result.user_id;
      if (id == userid){
        this.app.getRootNav().getActiveChildNav().select(2);
      }else{
        this.mediaProvider.getUserId(id);
        this.navCtrl.push(ViewProfilePage);
      }
    });
  }

  // --- 3. Comments / Authors: Mikael Ahlström, Antti Nyman -------------------------------------------------------------------------------

  addComment() {
    this.commentBtnDisabled = true;
    this.commentData.file_id = this.file_id;
    this.mediaProvider.postComment(localStorage.getItem('token'), this.commentData)
      .subscribe(response => {
        this.commentBtnDisabled = false;
        this.refresh();
        document.forms["commentForm"].reset();

      }, (error: HttpErrorResponse) => {
      });
  }

  // --- 4. Add favorite / Authors: Antti Nyman -------------------------------------------------------------------------------

  clickFavorite(fileId: number) {
    const file_id = {
      file_id: fileId
    };

    this.mediaProvider.getListOfLikes(fileId).subscribe(data => {
      this.likeArray = data;
      this.userLikes = this.likeArray.filter(like => like.user_id == this.current_userid);

      if (this.userLikes.length > 0) {
        this.mediaProvider.deleteFavorite(localStorage.getItem('token'), fileId)
        .subscribe(response => {
          this.refresh();
        }, (error: HttpErrorResponse) => {
        });
      } else {
        this.mediaProvider.postFavorite(localStorage.getItem('token'), file_id)
        .subscribe(response => {
          this.refresh();
        }, (error: HttpErrorResponse) => {
        });
      }
    });
  }

  // --- 5. Getters (Comments, likes profile pics) / Authors: Mikael Ahlström, Eero Karvonen, Antti Nyman -------------------------------------------------------------------------------

  getComments(id: number) {
    this.mediaProvider.getCommentsFile(id).subscribe(data => {
      this.commentsArray = data;
      this.amountOfComments = Object.keys(data).length;
      this.getLikes(this.file_id);
    });
  }

  getLikes(id: number) {
    this.mediaProvider.getListOfLikes(id).subscribe(data => {
      this.likesSet = data;
      this.amountOfLikes = Object.keys(data).length;
      this.mediaLoaded = true;
    });
  }

  getProfilePic(id: number) {
    this.ownPicArray = this.ppArray.filter(comment => comment.user_id == id);
    this.newestPicIndex = Object.keys(this.ownPicArray).length - 1;
    if (Object.keys(this.ownPicArray).length > 0) {
      this.profilePicUrl = this.mediaProvider.mediaUrl + this.ownPicArray[this.newestPicIndex].filename;
      return this.profilePicUrl;
    }
  }
}
