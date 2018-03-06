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
 * Generated class for the SinglePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
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

  commentData: Comment = {
    file_id: "",
    comment: ""
  };

  userid: any;
  file_id: any;
  user: User;
  username: any;
  message = '';
  private amountOfLikes: number;
  private likesSet: Object;
  private commentsArray: Object;
  private amountOfComments: number;
  private ownPicArray: any;
  private ppArray: any;
  private newestPicIndex: number;
  private profilePicUrl: string;
  private commenter: any;
  private mediaLoaded: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public mediaProvider: MediaProvider, public mapProvider: MapProvider,
              private photoViewer: PhotoViewer, private app: App,) {
  }

  ionViewDidLoad() {
    this.refresh();
  }

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

  showImage() {
    this.photoViewer.show(this.url, this.title, {share: false});
  }

  getUserProfile(id: number) {
    console.log(id);
    let userid: number;
    const userToken = this.mediaProvider.userHasToken();
    this.mediaProvider.getUserData(userToken).subscribe((result: User) => {
      this.mediaProvider.userInfo = result;
      userid = result.user_id;
      console.log(userid);
      if (id == userid){
        this.app.getRootNav().getActiveChildNav().select(2);
      }else{
        this.mediaProvider.getUserId(id);
        this.navCtrl.push(ViewProfilePage);
      }
    });
  }

  addComment() {
    this.commentData.file_id = this.file_id;
    this.mediaProvider.postComment(localStorage.getItem('token'), this.commentData)
      .subscribe(response => {
        document.forms["commentForm"].reset();
        this.refresh();

      }, (error: HttpErrorResponse) => {
        console.log(error);
      });
  }

  addFavorite(id) {
    const file_id = {
      file_id: id
    };
    console.log(file_id);
    this.mediaProvider.postFavorite(localStorage.getItem('token'), file_id)
      .subscribe(response => {
        console.log(response);
        this.refresh();
      }, (error: HttpErrorResponse) => {
        console.log(error)
      });
  }

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

  getUsername(id: number) {
    this.mediaProvider.getUserDataViaId(localStorage.getItem('token'), id).subscribe(data => {
      this.commenter = data;
      return this.commenter.username;
    })
  }



}
