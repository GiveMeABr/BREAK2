import { Component } from '@angular/core';

import { ProfilePage } from '../profile/profile';
import { FrontPage } from '../front/front';
import {UploadPage} from "../upload/upload";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FrontPage;
  tab2Root = UploadPage;
  tab3Root = ProfilePage;

  constructor() {

  }
}
