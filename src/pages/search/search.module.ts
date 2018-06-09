import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SearchPage } from './search';
import { SharedModule } from '../../app/shared/shared.module';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    SharedModule,
  ],
  exports: [
    SearchPage
  ]
})
export class SearchPageModule { }
