import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchTiangPage } from './search-tiang';
//import { CurrencyPipe } from '@angular/common';
import { ComponentsModule } from '../../../components/components.module';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    SearchTiangPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchTiangPage),
    ComponentsModule,
    MultiPickerModule //Import MultiPickerModule
  ],
 // providers:[CurrencyPipe]
})
export class SearchTiangPageModule { }
