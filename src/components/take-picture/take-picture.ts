import { Component, Output, EventEmitter, Input } from '@angular/core';

// Ionic
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform, ActionSheetController } from 'ionic-angular';

// Services
import { LoadingService, ToastService } from '../../providers/providers';

// Ngx-translate
import { TranslateService } from '@ngx-translate/core';

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

  @Input() urlImage: string;

  @Input() textForEdit?: string = this.translate.instant('TAKE_PICTURE_EDIT_TEXT');

  @Output() dataToEmmit: EventEmitter<any> = new EventEmitter<any>();
  private sourceType: any;

  constructor(
    private camera: Camera,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private translate: TranslateService,
  ) { }

  /**
   * Method to take a picture with cordova plugin
   */
  takePicture() {
    if ( this.platform.is('android') ) {
      const configCamera: CameraOptions = {
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 400,
        targetHeight: 400,
        correctOrientation: true,
        quality: 70,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.sourceType,
      }
      this.loadingService.showLoading();
      this.camera.getPicture(configCamera).then((data) => {
        this.loadingService.hideLoading();
        const base64Image = 'data:image/jpeg;base64,' + data;
        this.urlImage = base64Image;
        this.dataToEmmit.emit({ base64Image: base64Image });
      },
      (error) => {
        this.loadingService.hideLoading();
        this.toastService.show(this.translate.instant('TAKE_PICTURE_ERROR_CAMERA'), 'error');
      });
    }
  }

  /**
   * Present an action sheet to slelect the mode to upload the picture
   */
  presentMethodToUploadPictures() {
    const actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant('TAKE_PICTURE_SELECT_METHOD_OF_IMAGE_TITEL'),
      buttons: [
        {
          text: this.translate.instant('TAKE_PICTURE_BUTTON_IMAGE'),
          icon: 'image',
          handler: () => {
            this.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            this.takePicture();
          }
        },
        {
          text: this.translate.instant('TAKE_PICTURE_BUTTON_CAMERA'),
          icon: 'camera',
          handler: () => {
            this.sourceType = this.camera.PictureSourceType.CAMERA;
            this.takePicture();
          }
        },
        {
          text: this.translate.instant('COMMON_BUTTON_CANCEL'),
          role: 'cancel',
          icon: 'close-circle',
        }
      ]
    });
    actionSheet.present().catch(() => {console.error('Error ´presentMethodToUploadPictures´')});
  }

}
