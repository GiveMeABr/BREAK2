import { Component, ElementRef, Renderer2, ViewChild } from "@angular/core";
import {
  LoadingController,
  ToastController
} from "ionic-angular";
import { MediaProvider } from "../../providers/media/media";
import { HttpErrorResponse } from "@angular/common/http";
import { Media } from "../../app/interfaces/media";
import { App } from "ionic-angular";

/**
 * class UploadPage:
 * Authors: Mikael Ahlström, Eero Karvonen, Antti Nyman
 *
 * 1. Set file
 * 2. Upload file
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
  file: any;
  canvas: any;
  uploadClicked = false;

  media: Media = {
    title: "",
    description: ""
  };

  loading = this.loadingCtrl.create({
    content: "Uploading, please wait..."
  });

  constructor(
    private app: App,
    private loadingCtrl: LoadingController,
    private mediaProvider: MediaProvider,
    private renderer: Renderer2,
    private toastCtrl: ToastController
  ) {}

  ionViewDidLoad() {
    this.canvas = this.canvasRef.nativeElement;
    this.file = this.renderer.createElement("img");
  }

  // --- 1. Set file / Authors: Eero Karvonen --------------------------------------------------------------------------------------------------

  setFile(evt) {
    this.file = evt.target.files[0];
  }

  // --- 2. Upload File / Authors: Mikael Ahlström, Eero Karvonen, Antti Nyman -------------------------------------------------------------------------------

  uploadFile() {
    this.uploadClicked = true;
    const formData = new FormData();
    formData.append("file", this.file);
    formData.append("title", this.media.title);
    formData.append("description", this.media.description);
    this.mediaProvider
      .upload(formData, localStorage.getItem("token"))
      .subscribe(
        response => {
          const fileId = response["file_id"];
          const tagContent = {
            name: "tag",
            value: "break2"
          };
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
                }, 1000);
              },
              (tagError: HttpErrorResponse) => {
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
}
