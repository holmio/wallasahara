import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoadingService } from '../../providers/providers';

/**
 * Generated class for the TakePictureComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'take-picture',
  templateUrl: 'take-picture.html'
})
export class TakePictureComponent {
  @ViewChild('fileInput') fileInput;

  @Input() profilePic: string;

  @Output() dataToEmmit: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private camera: Camera,
    private loadingService: LoadingService,
  ) {
    console.log('Hello TakePictureComponent Component');
  }
  takePicture(event) {
    if (Camera['installed']()) {
      let configCamera: CameraOptions = {
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96,
        correctOrientation: true,
        quality: 60,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
      this.loadingService.showLoading();
      this.camera.getPicture(configCamera).then((data) => {
        this.loadingService.hideLoading();
        let base64Image = 'data:image/jpeg;base64,' + data;
        this.dataToEmmit.emit(base64Image);
      },
      (error) => {
        this.loadingService.hideLoading();
        this.dataToEmmit.emit(error);
        console.error(error);
      });
    } else {
      this.fileInput.nativeElement.click();
    }
  }
  getProfileImageStyle() {
    return 'url(' + this.profilePic + ')'
  }

  processWebImage(event) {
    if (event.target.files.length !== 0) {
      let reader = new FileReader();
      reader.onload = (readerEvent) => {

        let imageData = (readerEvent.target as any).result;
        this.profilePic = imageData;
        this.dataToEmmit.next({ data: this.profilePic });
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
