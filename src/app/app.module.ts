import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';


import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http';

import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { DataProvider } from '../providers/data/data';
import { RestProvider } from '../providers/rest/rest';
import { Device } from '@ionic-native/device';
import { TitleCasePipe } from '@angular/common';
import { QRScanner } from '@ionic-native/qr-scanner';

import { ComponentsModule } from '../components/components.module';
import { HomePageModule } from '../pages/home/home.module';
import { FreklamePageModule } from '../pages/freklame/freklame.module';
import { ReklameListPageModule } from '../pages/home/reklame-list/reklame-list.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';

//import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer } from '@ionic-native/file-transfer';
import { AndroidPermissions } from '@ionic-native/android-permissions';

//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
//import { DatePickerModule } from 'ion-datepicker';

//list reklame n map
//import { Ionic2RatingModule } from 'ionic2-rating';
//import { IonicImageViewerModule } from 'ionic-img-viewer';
import { MultiPickerModule } from 'ion-multi-picker';
import { Geolocation } from '@ionic-native/geolocation';

import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      menuType: 'overlay'
    }),
    ComponentsModule,
    TabsPageModule,
    HomePageModule,
    FreklamePageModule,
    ReklameListPageModule,
    CalendarModule,
  //  DatePickerModule,
    
    MultiPickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    
    Device,
    HttpClient,
    HTTP,
    DataProvider,
    RestProvider,
    TitleCasePipe,
    QRScanner,
    
    FileOpener,
    FileTransfer,
    AndroidPermissions,
//	FileTransfer,
//	FileUploadOptions,
//	FileTransferObject,
	File,
	Camera,
    
    Geolocation,
  //  DatePicker,
 //   Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
