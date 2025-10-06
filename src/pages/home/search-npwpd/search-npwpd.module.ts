import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchNpwpdPage } from './search-npwpd';
//import { CurrencyPipe } from '@angular/common';
import { ComponentsModule } from '../../../components/components.module';
//import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    SearchNpwpdPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchNpwpdPage),
    ComponentsModule,
   // MultiPickerModule //Import MultiPickerModule
  ],
 // providers:[CurrencyPipe]
})
export class SearchNpwpdPageModule { }
