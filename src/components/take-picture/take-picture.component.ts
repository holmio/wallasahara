import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoadingService, ToastService } from '../../providers/providers';
import { Platform, ActionSheetController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the TakePictureComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'take-picture',
  templateUrl: 'take-picture.component.html'
})
export class TakePictureComponent {
  @ViewChild('fileInput') fileInput;
  @Input() numberOfPicture?: number = 4;
  @Output() dataToEmmit: EventEmitter<any> = new EventEmitter<any>();

  sourceType: any;
  selectSourceType: any;
  profilePic: Array<string> = ['', '', '', ''];
  constructor(
    private camera: Camera,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService,
  ) {
  }
  takePicture(indx) {
    if ( this.platform.is('android') ) {
      let configCamera: CameraOptions = {
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96,
        correctOrientation: true,
        quality: 60,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.sourceType,
      }
      this.loadingService.showLoading();
      this.camera.getPicture(configCamera).then((data) => {
        this.loadingService.hideLoading();
        let base64Image = 'data:image/jpeg;base64,' + data;
        this.profilePic[indx] = base64Image;
        this.dataToEmmit.emit(base64Image);
      },
      (error) => {
        this.loadingService.hideLoading();
        this.toastService.show(error, 'error');
        this.dataToEmmit.emit(error);
      });
    } else {
      this.fileInput.nativeElement.click();
    }
  }
  presentMethodToUploadPictures(indx) {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant('TAKE_PICTURE_SELECT_METHOD_OF_IMAGE_TITEL'),
      buttons: [
        {
          text: this.translate.instant('TAKE_PICTURE_BUTTON_IMAGE'),
          icon: 'image',
          handler: () => {
            this.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            this.takePicture(indx);
          }
        },
        {
          text: this.translate.instant('TAKE_PICTURE_BUTTON_CAMERA'),
          icon: 'camera',
          handler: () => {
            this.sourceType = this.camera.PictureSourceType.CAMERA;
            this.takePicture(indx);
          }
        },
        {
          text: this.translate.instant('COMMON_BUTTON_CANCEL'),
          role: 'cancel',
          icon: 'close-circle',
        }
      ]
    });
    actionSheet.present();
  }
  // getProfileImageStyle(index: number) {
  //   return 'url(' + this.profilePic + ')'
  // }

  // processWebImage(event) {
  //   if (event.target.files.length !== 0) {
  //     let reader = new FileReader();
  //     reader.onload = (readerEvent) => {
  //       let imageData = (readerEvent.target as any).result;
  //       this.profilePic[this.index] = imageData;
  //       this.dataToEmmit.next({ data: this.profilePic[this.index] });
  //     };

  //     reader.readAsDataURL(event.target.files[this.index]);
  //   }
  // }
}
