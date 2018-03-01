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
  a = 10;
  rowNum = 0;
  newestMedia: Array<string>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public mediaProvider: MediaProvider) {

  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.picIndex = 0;
      this.a = 10;
      this.loadMedia();
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  openSingle(id) {
    this.navCtrl.push(SinglePage, {
      mediaID: id,
    });
  }

  loadMedia(){
    this.mediaProvider.getAllMedia().subscribe(data => {
      this.mediaArray = data;
      this.mediaArray.reverse();
      console.log("pic index " + this.picIndex, "a " + this.a);
      this.slicedMedia = this.mediaArray.slice(this.picIndex, this.a);
      this.displayedMedia = this.slicedMedia;
      console.log(this.displayedMedia);
      //console.log(data);
      //console.log(this.mediaArray.slice(0, 10));
      //console.log(this.mediaArray.slice(10, 13));
      this.grid = Array(Math.ceil(this.displayedMedia.length / 2)); //MATHS!
      let rowNum = 0; //counter to iterate over the rows in the grid

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
      this.a = this.picIndex + 10;
      console.log("pic index " + this.picIndex, "a " + this.a);
    });
  }

  ionViewDidLoad() {
    const userToken = this.mediaProvider.userHasToken();
    if (userToken) {
      this.mediaProvider.getUserData(userToken).subscribe((result: User) => {
        this.mediaProvider.userInfo = result;
        this.userInfo = result;
      });
    }
    this.loadMedia();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.displayedMedia = this.displayedMedia.concat(this.mediaArray.slice(this.picIndex, this.a));
      console.log(this.displayedMedia);
      this.grid = Array(Math.ceil(this.displayedMedia.length / 2)); //MATHS!
      console.log(this.grid);

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
      console.log(this.grid);
      console.log(this.picIndex);

      this.picIndex = this.picIndex + 10;
      this.a = this.picIndex + 10;
      console.log("pic index " + this.picIndex, "a " + this.a);

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }


}
