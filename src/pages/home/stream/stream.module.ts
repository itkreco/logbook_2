import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StreamPage } from './stream';
//import { CurrencyPipe } from '@angular/common';
import { ComponentsModule } from '../../../components/components.module';
import { MultiPickerModule } from 'ion-multi-picker';
import { StreamingMedia } from '@ionic-native/streaming-media';

@NgModule({
  declarations: [
    StreamPage,
  ],
  imports: [
    IonicPageModule.forChild(StreamPage),
    ComponentsModule,
    MultiPickerModule //Import MultiPickerModule
  ],
  providers:[StreamingMedia]
})
export class StreamPageModule { }
