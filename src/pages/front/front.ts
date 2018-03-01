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

  mediaArray: Array<string>;
  grid: Array<Array<string>>; //array of arrays

  userInfo: User;

  picIndex = 20;
  items = [];
  a = 40;
  rowNum = 0;
  newestMedia: Array<string>;

  constructor(
      public navCtrl: NavController, public navParams: NavParams,
      public mediaProvider: MediaProvider) {

  }

  openSingle(id) {
    this.navCtrl.push(SinglePage, {
      mediaID: id,
    });
  }

  ionViewDidLoad() {
    const userToken = this.mediaProvider.userHasToken();
    if(userToken) {
      this.mediaProvider.getUserData(userToken).subscribe((result: User) => {
        this.mediaProvider.userInfo = result;
        this.userInfo = result;
      });
    }

    this.mediaProvider.getAllMedia().subscribe(data => {
      this.mediaArray = data;
      this.grid = Array(Math.ceil(this.mediaArray.length / 2)); //MATHS!
      let rowNum = 0; //counter to iterate over the rows in the grid

      for (let i = 0; i < this.mediaArray.length; i += 2) { //iterate images

        this.grid[rowNum] = Array(2); //declare two elements per row

        if (this.mediaArray[i]) { //check file URI exists
          this.grid[rowNum][0] = this.mediaArray[i]; //insert image
        }

        if (this.mediaArray[i + 1]) { //repeat for the second image
          this.grid[rowNum][1] = this.mediaArray[i + 1];
        }

        rowNum++; //go on to the next row
      }
    });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      for (this.picIndex; this.picIndex < this.a; this.picIndex++) {
      }
      this.mediaProvider.getMoreMedia(this.picIndex).subscribe(data => {
        console.log(data);
        this.mediaArray = this.mediaArray.concat(data);
        console.log(this.mediaArray);
        this.grid = Array(Math.ceil(this.mediaArray.length /2)); //MATHS!
        console.log(this.grid);

        for (let i = 0; i < this.mediaArray.length; i += 2) { //iterate images

          this.grid[this.rowNum] = Array(2); //declare two elements per row

          if (this.mediaArray[i]) { //check file URI exists
            this.grid[this.rowNum][0] = this.mediaArray[i]; //insert image
          }

          if (this.mediaArray[i + 1]) { //repeat for the second image
            this.grid[this.rowNum][1] = this.mediaArray[i + 1];
          }

          this.rowNum++; //go on to the next row
        }
        console.log(this.grid);

      });
      console.log(this.picIndex);

      this.a = this.a + 20;

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }


}
