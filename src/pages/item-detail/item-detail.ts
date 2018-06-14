import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController } from 'ionic-angular';

import { ItemsService, LoadingService } from '../../providers/providers';
import { DetailsItem } from '../../models/item.entities';
import { FirstRunPage } from '../pages';

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
  private itemUuid: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private itemsService: ItemsService,
    private loadingService: LoadingService,
    private modalCtrl: ModalController,
  ) {
    console.log(navParams.get('uuidItem'));
    this.itemUuid = navParams.get('uuidItem') || undefined;
  }

    /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.loadingService.showLoading();
    this.itemsService.getItemByUuid(this.itemUuid).subscribe(
      (data) => {
        console.log(data);
        this.itemDetails = data;
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
    addModal.present();
  }

}
