import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {
  LoadingController, NavController, NavParams,

} from 'ionic-angular';
import {MediaProvider} from '../../providers/media/media';
import {FrontPage} from '../front/front';
import {HttpErrorResponse} from '@angular/common/http';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Geolocation} from '@ionic-native/geolocation';
import {DomSanitizer} from '@angular/platform-browser';

import {EditorProvider} from '../../providers/editor/editor';

/**
 * Generated class for the UploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {

  @ViewChild('myCanvas') canvasRef: ElementRef;
  debug: string;
  imageData: string;
  url: string;
  latLon: any;
  image: any;
  canvas: any;

  loading = this.loadingCtrl.create({
    content: 'Uploading, please wait...',
  });

  constructor(
      public navCtrl: NavController, public navParams: NavParams,
      private camera: Camera,
      private loadingCtrl: LoadingController,
      private mediaProvider: MediaProvider, private geolocation: Geolocation,
      public sanitizer: DomSanitizer,

      public editorProvider: EditorProvider, private renderer: Renderer2) {
  }

  captureImage() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };
    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);
      /*if (this.platform.is('ios')) {
        this.url = imageData.replace(/^file:\/\//, '');
      } else {
        this.url = imageData;
      }*/
      // show selected image:

      // console.log(this.image);
      this.editorProvider.setElements(this.canvas, this.image);
      this.imageData = imageData;
      this.editorProvider.setFile(this.imageData);

      // get location
      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        console.log('get location');
        console.log(resp);
        this.latLon = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude,
        };
      }).catch((error) => {
        console.log('Error getting location', error);
      });

    }, (err) => {
      // Handle error
      console.error(err);
    });
  }

  upload() {
    this.loading.present();
    // convert canvas to blob and upload
    this.canvas.toBlob(blob => {
      // create FormData-object
      const formData = new FormData();
      formData.append('file', blob);
      // add title and description to FormData object
      formData.append('title', 'HC title');
      formData.append('description', 'HC description');
      // send FormData object to API
      this.mediaProvider.upload(formData, localStorage.getItem('token')).
          subscribe(response => {
            console.log(response);
            const fileId = response['file_id'];
            const tagContent = {
              name: 'latLon',
              value: this.latLon,
            };
            const tagAsString = JSON.stringify(tagContent);
            const tag = {
              file_id: fileId,
              tag: tagAsString,

            };
            this.mediaProvider.postTag(tag, localStorage.getItem('token')).
                subscribe(response => {
                  setTimeout(() => {
                    this.loading.dismiss();
                    this.navCtrl.setRoot(FrontPage);
                  }, 2000);
                }, (tagError: HttpErrorResponse) => {
                  console.log(tagError);
                  this.loading.dismiss();
                });
          }, (error: HttpErrorResponse) => {
            console.log(error);
            this.loading.dismiss();
          });
    }, 'image/jpeg', 0.5);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
    // select element here, when it's ready
    this.canvas = this.canvasRef.nativeElement;
    this.image = this.renderer.createElement('img');
  }

}
