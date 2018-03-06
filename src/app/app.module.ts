import {BrowserModule} from '@angular/platform-browser';	
import {ErrorHandler, NgModule} from '@angular/core';	
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';	
import {SplashScreen} from '@ionic-native/splash-screen';	
import {StatusBar} from '@ionic-native/status-bar';	
	
import {MyApp} from './app.component';	
import {HttpClientModule} from '@angular/common/http';	
import {MediaProvider} from '../providers/media/media';	
import {LoginPage} from '../pages/login/login';	
import {FrontPage} from '../pages/front/front';	
import {UploadPage} from '../pages/upload/upload';	
import {RegisterPage} from '../pages/register/register';	
import {LogoutPage} from '../pages/logout/logout';	
import {ProfilePage} from '../pages/profile/profile';	
import {SinglePage} from '../pages/single/single';	
import {FormsModule} from '@angular/forms';	
import {PipesModule} from '../pipes/pipes.module';	
import {PhotoViewer} from '@ionic-native/photo-viewer';	
import {Camera} from '@ionic-native/camera';	
import {Geolocation} from '@ionic-native/geolocation';	
import {File} from '@ionic-native/file';	
import {MapProvider} from '../providers/map/map';	
import {EditorProvider} from '../providers/editor/editor';	
import {TabsPageModule} from "../pages/tabs/tabs.module";	
import {TabsPage} from "../pages/tabs/tabs";	
import {UploadPpPage} from "../pages/upload-pp/upload-pp";	
import {UploadPpPageModule} from "../pages/upload-pp/upload-pp.module";	
	
@NgModule({	
  declarations: [	
    MyApp,	
    LoginPage,	
    FrontPage,	
    UploadPage,	
    RegisterPage,	
    LogoutPage,	
    ProfilePage,	
    SinglePage,	
	
  ],	
  imports: [	
    BrowserModule,	
    IonicModule.forRoot(MyApp),	
    FormsModule,	
    PipesModule,	
    HttpClientModule,	
    TabsPageModule,	
    UploadPpPageModule	
  ],	
  bootstrap: [IonicApp],	
  entryComponents: [	
    MyApp,	
    LoginPage,	
    FrontPage,	
    UploadPage,	
    RegisterPage,	
    LogoutPage,	
    ProfilePage,	
    SinglePage,	
    TabsPage,	
    UploadPpPage	
  ],	
  providers: [	
    StatusBar,	
    SplashScreen,	
    {provide: ErrorHandler, useClass: IonicErrorHandler},	
    MediaProvider,	
    PhotoViewer,	
    Camera,	
    Geolocation,	
    File,	
    MapProvider,	
    EditorProvider,	
  ],	
})	
export class AppModule {	
}	
