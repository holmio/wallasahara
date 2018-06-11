import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ListMasterPage } from './list-master';
import { SharedModule } from '../../app/shared/shared.module';

@NgModule({
  declarations: [
    ListMasterPage,
  ],
  imports: [
    IonicPageModule.forChild(ListMasterPage),
    SharedModule,
  ],
  exports: [
    ListMasterPage
  ]
})
export class ListMasterPageModule { }
