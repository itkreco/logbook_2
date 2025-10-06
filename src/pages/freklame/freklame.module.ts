import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreklamePage } from './freklame';


import { ComponentsModule } from '../../components/components.module';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    FreklamePage,
  ],
  imports: [
    IonicPageModule.forChild(FreklamePage),
    ComponentsModule,
    MultiPickerModule
  ],
})
export class FreklamePageModule {}
