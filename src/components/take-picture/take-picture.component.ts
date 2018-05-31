import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { trigger,state, style, transition, animate, keyframes } from '@angular/animations';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoadingService, ToastService } from '../../providers/providers';
import { Platform, ActionSheetController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

// Interfaces
export interface ListPictures { base64Image: string, state: string };

/**
 * Component to generate a gallery of pictures.
 *
 */
@Component({
  selector: 'take-picture',
  templateUrl: 'take-picture.component.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        animate(300, keyframes([
          style({opacity: 0, transform: 'translateY(100%)', offset: 0}),
          style({opacity: 0.5, transform: 'translateY(50%)',  offset: 0.3}),
          style({opacity: 1, transform: 'translateY(0)',     offset: 1.0})
        ]))
      ]),
      transition('* => void', [
        animate(300, keyframes([
          style({opacity: 1, transform: 'translateY(0)',     offset: 0}),
          style({opacity: 0.5, transform: 'translateY(-50%)', offset: 0.7}),
          style({opacity: 0, transform: 'translateY(-100%)',  offset: 1.0})
        ]))
      ])
    ])
  ]
})

export class TakePictureComponent {
  @Input() numberOfPicture?: number = 4;
  @Output() dataToEmmit: EventEmitter<any> = new EventEmitter<any>();

  sourceType: any;
  selectSourceType: any;
  picturesList: Array<ListPictures> = [];
  constructor(
    private camera: Camera,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService,
  ) {
  }
  /** */
  takePicture() {
    if ( this.platform.is('android') ) {
      let configCamera: CameraOptions = {
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 700,
        correctOrientation: true,
        quality: 70,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.sourceType,
      }
      this.loadingService.showLoading();
      this.camera.getPicture(configCamera).then((data) => {
        this.loadingService.hideLoading();
        let base64Image = 'data:image/jpeg;base64,' + data;
        this.picturesList.push({base64Image: base64Image, state: 'active'});
        this.setObjectPecures(this.picturesList);
      },
      (error) => {
        this.loadingService.hideLoading();
        this.toastService.show(error, 'error');
        this.dataToEmmit.emit(error);
      });
    }
  }

  /**
   * Present an action sheet to slelect the mode to upload the picture
   */
  presentMethodToUploadPictures() {
    if (this.picturesList.length === 4) {
      this.toastService.show(this.translate.instant('TAKE_PICTURE_MAX_NUMBER_PICTURES'), 'info');
    } else {
      let actionSheet = this.actionSheetCtrl.create({
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
      actionSheet.present();
    }
  }

  /**
   * Method to delete the picture selected
   * @param index number of picture
   */
  deletePicture (index: number) {
    this.picturesList.splice(index, 1);
    this.setObjectPecures(this.picturesList);
  }

  /**
   * Parse the objects of the elements to one value
   * @param arrayPictures list of pictures
   */
  private setObjectPecures(arrayPictures: Array<ListPictures>): void {
    let listOfPicture: Array<string> = arrayPictures.map(value => value.base64Image);
    this.dataToEmmit.emit({ data: listOfPicture });
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
