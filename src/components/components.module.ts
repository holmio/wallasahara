import { NgModule } from '@angular/core';
import { TakePictureComponent } from './take-picture/take-picture.component';
import { IonicModule, IonicPageModule } from 'ionic-angular';
@NgModule({
	declarations: [TakePictureComponent],
	imports: [
    IonicPageModule.forChild(TakePictureComponent)
  ],
	exports: [TakePictureComponent]
})
export class ComponentsModule {}
