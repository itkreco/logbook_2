import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchReklamePage } from './search-reklame';
//import { CurrencyPipe } from '@angular/common';
import { ComponentsModule } from '../../../components/components.module';
import { MultiPickerModule } from 'ion-multi-picker';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    SearchReklamePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchReklamePage),
    ComponentsModule,
    MultiPickerModule //Import MultiPickerModule
  ],
  providers:[DatePipe]//,CurrencyPipe]
})
export class SearchReklamePageModule { }
