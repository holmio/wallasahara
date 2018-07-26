import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CardItemComponent } from './card-item/card-item.component';
import { GalleryItemComponent } from './gallery-item/gallery-item.component';
import { TakePictureComponent } from './take-picture/take-picture';
@NgModule({
	declarations: [
    GalleryItemComponent,
    CardItemComponent,
    TakePictureComponent
  ],
	imports: [
    IonicModule,
    LazyLoadImageModule,
  ],
	exports: [
    GalleryItemComponent,
    CardItemComponent,
    TakePictureComponent
  ]
})
export class ComponentsModule {}
