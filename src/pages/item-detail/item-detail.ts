import { Component, ViewChild } from '@angular/core';

// Ionic
import { IonicPage, NavController, NavParams, Slides, ModalController, PopoverController, AlertController } from 'ionic-angular';

// Services
import { ItemsService, LoadingService, UsersService } from '../../providers/providers';

// Entities
import { DetailsItem } from '../../models/item.entities';

// Pages
import { PopoverPage } from '../pages';

// Ngx-translate
import { TranslateService } from '@ngx-translate/core';

// config
import { wilayas } from '../../app/shared/config';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
})
export class ItemDetailPage {
  @ViewChild(Slides) slidesChild: Slides;

  slides:any[];
  mySlideOptions = {
    pager:true
  };
  itemDetails: DetailsItem;
  isEnabled: boolean = false;
  private itemUuid: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private itemsService: ItemsService,
    private loadingService: LoadingService,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private userService: UsersService,
  ) {
    console.log(navParams.get('event'));
    this.itemUuid = navParams.get('uuidItem') || undefined;
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.loadingService.showLoading();
    this.userService.getUserInformationStorage()
    .concatMap((response) => {
      this.isEnabled = (response.listOfItems.find(o => o.uuid === this.itemUuid) !== undefined) ? true : false;
      return this.itemsService.getItemByUuid(this.itemUuid)
    }).subscribe(
      (data) => {
        console.log(data);
        this.itemDetails = data;
        // Convert to logic text
        wilayas.map( val => { if (val.value === this.itemDetails.wilaya) this.itemDetails.wilaya = val.nameAr });
        // Delete the first element of the array, it is a thumnail.
        this.itemDetails.imagesItem.shift();
      },
      (error) => {
        console.log(error);
        this.loadingService.hideLoading();
      },
      () => {
        this.loadingService.hideLoading();
      }
    );
  }

  goToSlide() {
    const addModal = this.modalCtrl.create('SlideGalleryPage', { gallery: this.itemDetails.imagesItem });
    addModal.present().catch(() => {console.error('Error ´goToSlide´')});
  }


  presentPopover(myEvent) {
    const popover = this.popoverCtrl.create(PopoverPage);
    popover.onWillDismiss((data) => {
      if (data) {
        if (data.event === 'delete') {
          this.showDeleteConfirm()
        }
      }
    });
    popover.present({
      ev: myEvent
    }).catch(() => {console.error('Error ´presentPopover´')});
  }

  private deleteItem() {
    this.itemsService.deleteItem(this.itemDetails).subscribe(
      () => {
        this.navCtrl.pop().catch(() => {console.error('Error ´deleteItem´')});
      },
      (error) => {
        console.error(error);
      }
    );
  }

  private showDeleteConfirm() {
    const confirm = this.alertCtrl.create({
      title: this.translate.instant('CONFIRM_DELETE_ITEM_TITLE'),
      message: this.translate.instant('CONFIRM_DELETE_ITEM_MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('YES'),
          handler: () => {
            this.deleteItem()
          }
        },
        {
          text: this.translate.instant('NO'),
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present().catch(() => {console.error('Error ´showDeleteConfirm´')});
  }

}
