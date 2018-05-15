import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemCreatePage } from './item-create';
import { SharedModule } from '../../app/shared/shared.module';

@NgModule({
  declarations: [
    ItemCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ItemCreatePage),
    SharedModule,
  ],
})
export class ItemCreatePageModule {}
