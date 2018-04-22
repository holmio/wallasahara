import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectLanguagePage } from './select-language';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    SelectLanguagePage,
  ],
  imports: [
    IonicPageModule.forChild(SelectLanguagePage),
    SharedModule,
  ],
})
export class SelectLanguagePageModule {}
