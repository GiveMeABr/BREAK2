import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MediaProvider} from '../../providers/media/media';
import {SinglePage} from '../single/single';
import {User} from "../../app/interfaces/user";

/**
 * Generated class for the FrontPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-front',
  templateUrl: 'front.html',
})
export class FrontPage {

  mediaArray: any;
  slicedMedia: any;
  displayedMedia: Array<string>;
  grid: Array<Array<string>>; //array of arrays


  userInfo: User;

  picIndex = 0;
  items = [];
  loadLimit = 10;
  rowNum = 0;
  newestMedia: Array<string>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public mediaProvider: MediaProvider) {

  }

  doRefresh(refresher) {
    console.log("REFRESH!");
    setTimeout(() => {
      this.picIndex = 0;
      this.loadLimit = 10;
      this.loadMedia();
      refresher.complete();
    }, 2000);
  }

  openSingle(id) {
    this.navCtrl.push(SinglePage, {
      mediaID: id,
    });
  }

  ionViewDidLoad() {

    console.log(this.mediaArray);

    // Check user
    const userToken = this.mediaProvider.userHasToken();
    if (userToken) {
      this.mediaProvider.getUserData(userToken).subscribe((result: User) => {
        this.mediaProvider.userInfo = result;
        this.userInfo = result;
      });
    }
    this.loadMedia();
  }

  loadMedia() {

    if(this.mediaArray == undefined /* First load */){

      this.mediaProvider.getAllMedia().subscribe(data => {
        console.log("First load");
        this.mediaArray = data;
        this.mediaArray.reverse();
        console.log(this.mediaArray);
        this.slicedMedia = this.mediaArray.slice(this.picIndex, this.loadLimit);
        this.displayedMedia = this.slicedMedia;
        this.grid = Array(Math.ceil(this.displayedMedia.length / 2)); //MATHS!
        let rowNum = 0; //counter to iterate over the rows in the grid
        console.log("loading media from index " + this.picIndex, "to " + this.loadLimit);

        for (let i = 0; i < this.displayedMedia.length; i += 2) { //iterate images
          this.grid[rowNum] = Array(2); //declare two elements per row
          if (this.displayedMedia[i]) { //check file URI exists
            this.grid[rowNum][0] = this.displayedMedia[i]; //insert image
          }
          if (this.displayedMedia[i + 1]) { //repeat for the second image
            this.grid[rowNum][1] = this.displayedMedia[i + 1];
          }
          rowNum++; //go on to the next row
        }
        this.picIndex = this.picIndex + 10;
        this.loadLimit = this.picIndex + 10;
        console.log("next media will be from index " + this.picIndex, "to " + this.loadLimit);
      });

    } else /* Infinite Scroll */ {
      console.log("loadMedia case 2");
      this.displayedMedia = this.displayedMedia.concat(this.mediaArray.slice(this.picIndex, this.loadLimit));
      this.grid = Array(Math.ceil(this.displayedMedia.length / 2)); //MATHS!
      console.log("loading media from index " + this.picIndex, "to " + this.loadLimit);

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

      this.picIndex = this.picIndex + 10;
      this.loadLimit = this.picIndex + 10;
      console.log("next media will be from index " + this.picIndex, "to " + this.loadLimit);
    }

  }

  doInfinite(infiniteScroll) {
    console.log("infinite scroll");
    setTimeout(() => {
      this.loadMedia();
      infiniteScroll.complete();
    }, 500);
  }


}
