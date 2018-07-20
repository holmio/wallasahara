import { NgModule } from '@angular/core';
import { TakePictureComponent } from './take-picture/take-picture.component';
import { IonicModule } from 'ionic-angular';
import { CardItemComponent } from './card-item/card-item.component';
import LazyLoadImageModule from 'ng-lazyload-image';
@NgModule({
	declarations: [
    TakePictureComponent,
    CardItemComponent
  ],
	imports: [
    IonicModule,
    LazyLoadImageModule,
  ],
	exports: [
    TakePictureComponent,
    CardItemComponent
  ]
})
export class ComponentsModule {}
