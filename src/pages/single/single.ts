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

  user: User;

  username: any;

  message = '';

  constructor(
      public navCtrl: NavController, public navParams: NavParams,
      public mediaProvider: MediaProvider, public mapProvider: MapProvider,
      private photoViewer: PhotoViewer) {
  }

  showImage() {
    this.photoViewer.show(this.url, this.title, {share: false});
  }

  addComment(file_id) {
    const commentData = {
      file_id: file_id,
      comment: this.comment
    };
    console.log(commentData);
    this.mediaProvider.postComment(localStorage.getItem('token'), commentData)
    .subscribe(response => {
      console.log(response);
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }

  ionViewDidLoad() {
    console.log(this.navParams.get('mediaID'));
    this.mediaProvider.getSingleMedia(this.navParams.get('mediaID')).
    subscribe(response => {
      console.log(response);
      this.url = this.mediaProvider.mediaUrl + response['filename'];
      this.title = response['title'];
      this.userid = response['user_id'];
      const userToken = this.mediaProvider.userHasToken();

      this.mediaProvider.getUserDataViaId(userToken, this.userid.toString()).subscribe((result: User) => {
        console.log(result);
        this.username = result['username'];

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
