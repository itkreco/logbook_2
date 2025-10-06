import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchMapPage } from './search-map';
//import { CurrencyPipe } from '@angular/common';
import { ComponentsModule } from '../../../components/components.module';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    SearchMapPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchMapPage),
    ComponentsModule,
    MultiPickerModule //Import MultiPickerModule
  ],
 // providers:[CurrencyPipe]
})
export class SearchMapPageModule { }
