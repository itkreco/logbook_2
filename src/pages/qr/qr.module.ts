import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrPage } from './qr';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    QrPage,
  ],
  imports: [
    IonicPageModule.forChild(QrPage),
    ComponentsModule
  ],
})
export class QrPageModule {}
