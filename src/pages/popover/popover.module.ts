import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverPage } from './popover';
import { SharedModule } from '../../app/shared/shared.module';

@NgModule({
  declarations: [
    PopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverPage),
    SharedModule,
  ],
})
export class PopoverPageModule {}
