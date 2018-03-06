import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewProfilePage } from './view-profile';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ViewProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewProfilePage),
    PipesModule
  ],
})
export class ViewProfilePageModule {}
