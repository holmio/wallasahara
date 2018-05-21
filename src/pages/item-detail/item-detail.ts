import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ItemsService } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private items: ItemsService
  ) {
    // this.item = navParams.get('item') || items.defaultItem;
  }

}
