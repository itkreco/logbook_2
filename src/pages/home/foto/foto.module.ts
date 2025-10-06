import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FotoPage } from './foto';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    FotoPage,
  ],
  imports: [
    IonicPageModule.forChild(FotoPage),
    ComponentsModule
  ]
})
export class FotoPageModule {}
