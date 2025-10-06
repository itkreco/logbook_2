import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackingPage } from './tracking';
//import { CurrencyPipe } from '@angular/common';
import { ComponentsModule } from '../../../components/components.module';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    TrackingPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackingPage),
    ComponentsModule,
    MultiPickerModule //Import MultiPickerModule
  ],
 // providers:[StreamingMedia]
})
export class TrackingPageModule { }
