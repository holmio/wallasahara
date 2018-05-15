import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../app/shared/shared.module';

import { ItemDetailPage } from './item-detail';

@NgModule({
  declarations: [
    ItemDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailPage),
    SharedModule,
  ],
  exports: [
    ItemDetailPage
  ]
})
export class ItemDetailPageModule { }
