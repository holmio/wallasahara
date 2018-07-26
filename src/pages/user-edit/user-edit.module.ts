import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserEditPage } from './user-edit';
import { SharedModule } from '../../app/shared/shared.module';

@NgModule({
  declarations: [
    UserEditPage,
  ],
  imports: [
    IonicPageModule.forChild(UserEditPage),
    SharedModule,
  ],
})
export class UserEditPageModule {}
