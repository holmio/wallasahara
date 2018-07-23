import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger,state, style, transition, animate, keyframes } from '@angular/animations';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoadingService, ToastService } from '../../providers/providers';
import { Platform, ActionSheetController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

// Interfaces
export interface ListPictures { base64Image: string, state?: string, isThumbnail?: boolean };

/**
 * Component to generate a gallery of pictures.
 *
 */
@Component({
  selector: 'gallery-item',
  templateUrl: 'gallery-item.component.html',
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

export class GalleryItemComponent {
  @Input() numberOfPictures?: number = 4;
  @Output() dataToEmmit: EventEmitter<any> = new EventEmitter<any>();

  sourceType: any;
  selectSourceType: any;
  picturesList: Array<ListPictures> = [];
  private imageThumb: string;
  constructor(
    private camera: Camera,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService,
  ) {
  }
  /**
   * Method to take a picture with cordova plugin
   */
  takePicture() {
    if ( this.platform.is('android') ) {
      const configCamera: CameraOptions = {
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 700,
        targetHeight: 700,
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
        this.picturesList.push({base64Image: base64Image, state: 'active'});
        if(this.picturesList.length === 1) {
          this.generateTumbnail(base64Image);
        } else {
          this.setObjectPecures(this.picturesList);
        }
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
    if (this.picturesList.length === 5) {
      this.toastService.show(this.translate.instant('TAKE_PICTURE_MAX_NUMBER_PICTURES'), 'info');
    } else {
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
      actionSheet.present();
    }
  }

  /**
   * Method to delete the picture selected
   * @param index number of picture
   */
  deletePicture (index: number) {
    // If the picture deleted is the thumbnail then we generate a new thumbnail of the second picture of the gallery
    if (index === 1 && this.picturesList.length > 2) {
      this.picturesList.splice(index, 1);
      // Delete first element of array that is thumbnail.
      this.picturesList.shift();
      // Method to generate the thumnail
      this.generateTumbnail(this.picturesList[0].base64Image)
    } else {
      if (this.picturesList.length === 2) {
        this.picturesList = [];
      } else {
        this.picturesList.splice(index, 1);
      }
    }
  }

  /**
   * Parse the objects of the elements to one value
   * @param arrayPictures list of pictures
   */
  private setObjectPecures(arrayPictures: Array<ListPictures>): void {
    const listOfPicture: Array<string> = arrayPictures.map(value => value.base64Image);
    this.dataToEmmit.emit({ data: listOfPicture });
  }

  /**
   * Generate a thumbnail
   * @param base64Image url image
   */
  private generateTumbnail(base64Image) {
    this.generateFromImage(base64Image, 300, 300, 0.5, (data) => {
      this.picturesList.unshift({base64Image: data, isThumbnail: true});
      this.setObjectPecures(this.picturesList);
    })
  }

  /**
   * Set a new image with custom size and quality and generate
   * @param img
   * @param MAX_WIDTH
   * @param MAX_HEIGHT
   * @param quality
   * @param callback
   */
  private generateFromImage(img, MAX_WIDTH: number = 200, MAX_HEIGHT: number = 200, quality: number = 1, callback) {
    const canvas: any = document.createElement('canvas');
    const image = new Image();
    image.onload = () => {
      let width = image.width;
      let height = image.height

      if (width > height) {
        if(width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if(height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(dataUrl);
    }
    image.src = img
  }

  /**
   * Get the size of the image
   * @param data_url data of image
   */
  private getImageSize(data_url) {
    const base64data = 'data:image/jpeg;base64,';
    return ((data_url.length - base64data.length) * 3 / 4 / (1024*1024)).toFixed(4);
  }
}
