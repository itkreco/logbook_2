import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FnpwpdPage } from './fnpwpd';


import { ComponentsModule } from '../../components/components.module';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    FnpwpdPage,
  ],
  imports: [
    IonicPageModule.forChild(FnpwpdPage),
    ComponentsModule,
    MultiPickerModule
  ],
})
export class FnpwpdPageModule {}
