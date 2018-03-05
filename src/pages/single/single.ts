import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MediaProvider} from '../../providers/media/media';
import {HttpErrorResponse} from '@angular/common/http';
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {MapProvider} from '../../providers/map/map';
import {User} from "../../app/interfaces/user";
import {Comment} from '../../app/interfaces/comment';

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
  private commenter: Object = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public mediaProvider: MediaProvider, public mapProvider: MapProvider,
              private photoViewer: PhotoViewer) {
  }

  ionViewDidLoad() {
    console.log(this.navParams.get('mediaID'));
    this.mediaProvider.getSingleMedia(this.navParams.get('mediaID')).subscribe(response => {
      console.log(response);
      this.url = this.mediaProvider.mediaUrl + response['filename'];
      this.title = response['title'];
      this.userid = response['user_id'];
      this.file_id = response['file_id'];
      this.description = response['description'];
      const userToken = this.mediaProvider.userHasToken();

      this.mediaProvider.getUserDataViaId(userToken, this.userid.toString()).subscribe((result: User) => {
        console.log(result);
        this.username = result['username'];
        this.mediaProvider.getAllProfilePics().subscribe(data => {
          console.log(data);
          this.ppArray = data;
          this.getLikes(this.file_id);
        });

      });

    });
  }

  showImage() {
    this.photoViewer.show(this.url, this.title, {share: false});
  }

  addComment() {
    this.commentData.file_id = this.file_id;
    console.log(this.commentData);
    this.mediaProvider.postComment(localStorage.getItem('token'), this.commentData)
      .subscribe(response => {
        console.log(response);
        document.forms["commentForm"].reset();
      }, (error: HttpErrorResponse) => {
        console.log(error);
      });
  }

  getLikes(id: number) {
    this.mediaProvider.getListOfLikes(id).subscribe(data => {
      console.log(data);
      this.likesSet = data;
      this.amountOfLikes = Object.keys(data).length;
      this.getComments(this.file_id);
    });
  }

  getComments(id: number) {
    this.mediaProvider.getCommentsFile(id).subscribe(data => {
      console.log(data);
      this.commentsArray = data;
      this.amountOfComments = Object.keys(data).length;
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
      console.log(this.commenter);
      console.log(this.commenter[0]);
      console.log(this.commenter[0].username);

      return this.commenter[0].username;
    })
  }



}
