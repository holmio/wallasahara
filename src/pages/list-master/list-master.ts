import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Item } from '../../models/item.entities';
import { ItemCreatePage } from '../pages';
import { ItemsService, LoadingService } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public itemsService: ItemsService,
    public loadingService: LoadingService,
  ) {

  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    // this.itemsService.getListOfItems().subscribe((itemsList) => {
    //   console.log(itemsList);
    // });
    // this.currentItems = this.items.query();
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create(ItemCreatePage);

    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    // this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
}
