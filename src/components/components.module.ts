import { NgModule } from '@angular/core';
import { TakePictureComponent } from './take-picture/take-picture.component';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { CardItemComponent } from './card-item/card-item.component';
@NgModule({
	declarations: [
    TakePictureComponent,
    CardItemComponent
  ],
	imports: [
    IonicPageModule.forChild([CardItemComponent, TakePictureComponent])
  ],
	exports: [
    TakePictureComponent,
    CardItemComponent
  ]
})
export class ComponentsModule {}
