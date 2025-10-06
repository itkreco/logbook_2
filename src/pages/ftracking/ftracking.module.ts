import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FtrackingPage } from './ftracking';

import { ComponentsModule } from '../../components/components.module';
import { MultiPickerModule } from 'ion-multi-picker';
@NgModule({
  declarations: [
    FtrackingPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(FtrackingPage),
    MultiPickerModule
  ],
})
export class FtrackingPageModule {}
