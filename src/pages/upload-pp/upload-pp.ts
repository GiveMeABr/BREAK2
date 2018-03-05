import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {
  IonicPage,
  LoadingController, NavController, NavParams,

} from 'ionic-angular';
import {MediaProvider} from '../../providers/media/media';
import {HttpErrorResponse} from '@angular/common/http';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Geolocation} from '@ionic-native/geolocation';
import {DomSanitizer} from '@angular/platform-browser';

import {EditorProvider} from '../../providers/editor/editor';
import {TabsPage} from "../tabs/tabs";
import {App} from "ionic-angular";
/**
 * Generated class for the UploadPpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload-pp',
  templateUrl: 'upload-pp.html',
})
export class UploadPpPage {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  debug: string;
  imageData: string;
  url: string;
  latLon: any;
  file: any;
  canvas: any;
  uploadClicked = false;

  apiUrl = 'http://media.mw.metropolia.fi/wbma';


  loading = this.loadingCtrl.create({
    content: 'Uploading, please wait...',
  });

  constructor(public navCtrl: NavController, public navParams: NavParams,  private app: App,
              private camera: Camera,
              private loadingCtrl: LoadingController,
              private mediaProvider: MediaProvider, private geolocation: Geolocation,
              public sanitizer: DomSanitizer,
              public editorProvider: EditorProvider, private renderer: Renderer2) {
  }

  setFile(evt) {
    console.log(evt.target.files[0]);
    this.file = evt.target.files[0];
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
      // show selected file:

      // console.log(this.file);
      this.editorProvider.setElements(this.canvas, this.file);
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
      // send FormData object to API
      this.mediaProvider.upload(formData, localStorage.getItem('token')).subscribe(response => {
        console.log(response);
        const fileId = response['file_id'];
        const tagContent = {
          name: 'tag',
          value: 'break2PP',
        };
        // const tagAsString = JSON.stringify(tagContent);
        const tag = {
          file_id: fileId,
          tag: tagContent.value,
        };

        this.mediaProvider.postTag(tag, localStorage.getItem('token')).subscribe(response => {
          setTimeout(() => {
            this.loading.dismiss();
            this.navCtrl.last();
          }, 2000);
        }, (tagError: HttpErrorResponse) => {
          console.log(tagError);
          this.loading.dismiss();
        });
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.loading.dismiss();
      });
    }, 'file/jpeg', 0.5);

  }

  uploadFile(){
    this.uploadClicked = true;
    const formData = new FormData();

    formData.append('file', this.file);

    console.log(formData);

    this.mediaProvider.upload(formData, localStorage.getItem('token')).subscribe(response => {
      console.log(response);
      const fileId = response['file_id'];
      const tagContent = {
        name: 'tag',
        value: 'break2PP',
      };
      // const tagAsString = JSON.stringify(tagContent);
      const tag = {
        file_id: fileId,
        tag: tagContent.value,
      };

      this.mediaProvider.postTag(tag, localStorage.getItem('token')).subscribe(response => {
        setTimeout(() => {
          this.loading.dismiss();
          this.app.getRootNav().getActiveChildNav().select(2);
          //location.reload();

        }, 1000);
      }, (tagError: HttpErrorResponse) => {
        console.log(tagError);
        this.loading.dismiss();
      });
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.loading.dismiss();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPpPage');

    this.canvas = this.canvasRef.nativeElement;
    this.file = this.renderer.createElement('img');
  }

}
