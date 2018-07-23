import { NgModule } from '@angular/core';
import { GalleryItemComponent } from './gallery-item/gallery-item.component';
import { IonicModule } from 'ionic-angular';
import { CardItemComponent } from './card-item/card-item.component';
import LazyLoadImageModule from 'ng-lazyload-image';
@NgModule({
	declarations: [
    GalleryItemComponent,
    CardItemComponent
  ],
	imports: [
    IonicModule,
    LazyLoadImageModule,
  ],
	exports: [
    GalleryItemComponent,
    CardItemComponent
  ]
})
export class ComponentsModule {}
