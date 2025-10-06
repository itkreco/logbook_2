import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReklameListwmapPage } from './reklame-listwmap';
//import { Ionic2RatingModule } from "ionic2-rating";
//import { CurrencyPipe } from '@angular/common';
//import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ReklameListwmapPage,
  ],
  imports: [
    IonicPageModule.forChild(ReklameListwmapPage),
  //  Ionic2RatingModule, 
  //  IonicImageViewerModule,
    ComponentsModule
  ],
//  providers:[CurrencyPipe]
})
export class ReklameListwmapPageModule { }
