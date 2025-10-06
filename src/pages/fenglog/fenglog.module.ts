import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FenglogPage } from './fenglog';


import { ComponentsModule } from '../../components/components.module';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    FenglogPage,
  ],
  imports: [
    IonicPageModule.forChild(FenglogPage),
    ComponentsModule,
    MultiPickerModule
  ],
})
export class FenglogPageModule {}
