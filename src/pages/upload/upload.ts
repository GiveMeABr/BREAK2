import { Component, ElementRef, Renderer2, ViewChild } from "@angular/core";
import {
  LoadingController,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { MediaProvider } from "../../providers/media/media";
import { HttpErrorResponse } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";

import { EditorProvider } from "../../providers/editor/editor";
import { Media } from "../../app/interfaces/media";
import { TabsPage } from "../tabs/tabs";
import { App } from "ionic-angular";

/**
 * Generated class for the UploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: "page-upload",
  templateUrl: "upload.html"
})
export class UploadPage {
  @ViewChild("myCanvas") canvasRef: ElementRef;
  debug: string;
  imageData: string;
  url: string;
  latLon: any;
  file: any;
  canvas: any;
  uploadClicked = false;

  apiUrl = "http://media.mw.metropolia.fi/wbma";

  media: Media = {
    title: "",
    description: ""
  };

  loading = this.loadingCtrl.create({
    content: "Uploading, please wait..."
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    private loadingCtrl: LoadingController,
    private mediaProvider: MediaProvider,
    public sanitizer: DomSanitizer,
    public editorProvider: EditorProvider,
    private renderer: Renderer2,
    private toastCtrl: ToastController
  ) {}

  setFile(evt) {
    console.log(evt.target.files[0]);
    this.file = evt.target.files[0];
  }

  upload() {
    this.loading.present();
    // convert canvas to blob and upload
    this.canvas.toBlob(
      blob => {
        // create FormData-object
        const formData = new FormData();
        formData.append("file", this.imageData);
        // add title and description to FormData object
        formData.append("title", this.media.title);
        formData.append("description", this.media.description);
        // send FormData object to API
        this.mediaProvider
          .upload(formData, localStorage.getItem("token"))
          .subscribe(
            response => {
              console.log(response);
              const fileId = response["file_id"];
              const tagContent = {
                name: "tag",
                value: "break2"
              };
              // const tagAsString = JSON.stringify(tagContent);
              const tag = {
                file_id: fileId,
                tag: tagContent.value
              };

              this.mediaProvider
                .postTag(tag, localStorage.getItem("token"))
                .subscribe(
                  response => {
                    setTimeout(() => {
                      this.loading.dismiss();
                      this.navCtrl.setRoot(TabsPage);
                    }, 2000);
                  },
                  (tagError: HttpErrorResponse) => {
                    console.log(tagError);
                    this.loading.dismiss();
                  }
                );
            },
            (error: HttpErrorResponse) => {
              console.log(error);
              this.loading.dismiss();
            }
          );
      },
      "file/jpeg",
      0.5
    );
  }

  uploadFile() {
    this.uploadClicked = true;
    const formData = new FormData();

    console.log("this.file: ", this.file);
    formData.append("file", this.file);

    console.log("this.media.title): ", this.media.title);
    formData.append("title", this.media.title);

    console.log("this.media.description: ", this.media.description);
    formData.append("description", this.media.description);

    console.log('localStorage.getItem("token"): ', localStorage.getItem("token"));

    this.mediaProvider
      .upload(formData, localStorage.getItem("token"))
      .subscribe(
        response => {
          console.log(response);
          const fileId = response["file_id"];
          const tagContent = {
            name: "tag",
            value: "break2"
          };
          // const tagAsString = JSON.stringify(tagContent);
          const tag = {
            file_id: fileId,
            tag: tagContent.value
          };

          this.mediaProvider
            .postTag(tag, localStorage.getItem("token"))
            .subscribe(
              response => {
                setTimeout(() => {
                  this.loading.dismiss();
                  document.forms["uploadForm"].reset();
                  this.app
                    .getRootNav()
                    .getActiveChildNav()
                    .select(0);
                  this.uploadClicked = false;
                  //location.reload();
                }, 1000);
              },
              (tagError: HttpErrorResponse) => {
                console.log(tagError);
                this.loading.dismiss();
                this.uploadClicked = false;

                let errorToast = this.toastCtrl.create({
                  message: tagError.error.message.toString(),
                  duration: 3000,
                  position: "middle"
                });
                errorToast.present();
              }
            );
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.loading.dismiss();
          this.uploadClicked = false;

          let errorToast = this.toastCtrl.create({
            message: error.error.message.toString(),
            duration: 3000,
            position: "middle"
          });
          errorToast.present();
        }
      );
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad UploadPage");
    // select element here, when it's ready
    this.canvas = this.canvasRef.nativeElement;
    this.file = this.renderer.createElement("img");
  }
}
