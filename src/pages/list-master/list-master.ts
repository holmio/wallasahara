import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { ItemCreatePage } from '../pages';
import { ItemsService, LoadingService } from '../../providers/providers';
import { ItemList } from '../../models/item.entities';
import * as _ from 'lodash';
@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: ItemList[];
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
    this.loadingService.showLoading();
    this.itemsService.getListOfItems().subscribe(
      (itemsList) => {
        this.currentItems = _.reverse(itemsList);
        this.loadingService.showLoading();
      },
      error => console.log(error)
    );
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
  openItem() {
    this.navCtrl.push('ItemDetailPage', {
    });
  }
}
