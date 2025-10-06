import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FmapPage } from './fmap';

import { ComponentsModule } from '../../components/components.module';
import { MultiPickerModule } from 'ion-multi-picker';
@NgModule({
  declarations: [
    FmapPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(FmapPage),
    MultiPickerModule
  ],
})
export class FmapPageModule {}
