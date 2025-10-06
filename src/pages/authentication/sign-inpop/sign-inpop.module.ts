import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignInPopPage } from './sign-inpop';
import { ComponentsModule } from '../../../components/components.module';
//import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    SignInPopPage,
  ],
  imports: [
    IonicPageModule.forChild(SignInPopPage),
    ComponentsModule,
  //  TextMaskModule,
  ],
  providers: [
  
  ]
})
export class SignInPopPageModule {}
