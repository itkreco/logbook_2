import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReklameListPage } from './reklame-list';
//import { Ionic2RatingModule } from "ionic2-rating";
//import { CurrencyPipe } from '@angular/common';
//import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ComponentsModule } from '../../../components/components.module';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    ReklameListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReklameListPage),
  //  Ionic2RatingModule, 
  //  IonicImageViewerModule,
    ComponentsModule
  ],
  providers:[DatePipe]
})
export class ReklameListPageModule { }
