import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../app/shared/shared.module';

import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    SharedModule,
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule { }
