import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ItemsService, LoadingService } from '../../providers/providers';
import { DetailsItem } from '../../models/item.entities';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
})
export class ItemDetailPage {
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
  ) {
    console.log(navParams.get('uuidItem'));
    this.itemUuid = navParams.get('uuidItem') || undefined;
  }

    /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.loadingService.showLoading();
    this.itemsService.getItem(this.itemUuid).subscribe(
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

}
