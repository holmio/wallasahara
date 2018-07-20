import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileUserPage } from './profile-user';
import { SharedModule } from '../../app/shared/shared.module';

@NgModule({
  declarations: [
    ProfileUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileUserPage),
    SharedModule,
  ],
})
export class ProfileUserPageModule {}
