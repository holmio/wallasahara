import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SettingsPage } from './settings';
import { SharedModule } from '../../app/shared/shared.module';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage),
    SharedModule,
  ],
  exports: [
    SettingsPage
  ]
})
export class SettingsPageModule { }
