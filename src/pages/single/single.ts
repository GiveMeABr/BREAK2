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
  latLon: any;
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public mediaProvider: MediaProvider, public mapProvider: MapProvider,
              private photoViewer: PhotoViewer) {
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
      this.likesSet = data;
      this.amountOfLikes = Object.keys(data).length;
    });
  }

  getComments(id: number) {
    this.mediaProvider.getCommentsFile(id).subscribe(data => {
      this.commentsArray = data;
      this.amountOfComments = Object.keys(data).length;
    });
  }


  ionViewDidLoad() {
    console.log(this.navParams.get('mediaID'));
    this.mediaProvider.getSingleMedia(this.navParams.get('mediaID')).subscribe(response => {
      console.log(response);
      this.url = this.mediaProvider.mediaUrl + response['filename'];
      this.title = response['title'];
      this.userid = response['user_id'];
      this.file_id = response['file_id'];
      const userToken = this.mediaProvider.userHasToken();


      this.mediaProvider.getUserDataViaId(userToken, this.userid.toString()).subscribe((result: User) => {
        console.log(result);
        this.username = result['username'];
        this.getLikes(this.file_id);
        this.getComments(this.file_id);
      });


      console.log(typeof this.userid);
      /* this.mediaProvider.getSingleMedia(this.navParams.get('mediaID')).
          subscribe(response => {
            console.log(response);
            this.url = this.mediaProvider.mediaUrl + response['filename'];
            this.title = response['title'];
            this.mediaProvider.getTagByFile(response['file_id']).
                subscribe(response => {
                  console.log(response);
                  if (response.length === 0) this.message = 'No tags';
                  response.forEach(t => {
                    const tag = JSON.parse(t['tag']);
                    console.log(tag);
                    if (tag.name === 'latLon') {
                      this.latLon = tag.value;
                    } else {
                      return;
                    }
                    console.log(this.latLon);
                    if (this.latLon === undefined) {
                      this.message = 'No EXIF data';
                    } else {
                      this.mapProvider.loadMap('map_canvas', this.latLon);
                    }
                  });

                });
          }, (error: HttpErrorResponse) => {
            console.log(error);
          });*/

      this.description = response['description'];

    }, (error: HttpErrorResponse) => {
      console.log(error);
    });
  }

}
