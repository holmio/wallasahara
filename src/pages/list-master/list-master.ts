import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { ItemCreatePage, FilterPage } from '../pages';
import { ItemsService, LoadingService, PaginationService } from '../../providers/providers';
import { ItemList } from '../../models/item.entities';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  constructor(
    public navCtrl: NavController,
    public paginationService: PaginationService,
    private modalCtrl: ModalController,
    private itemsService: ItemsService,
    private loadingService: LoadingService,
  ) {

  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.paginationService.init('items', 'timestamp');
  }

  infiniteScrolling (infiniteScroll) {
    this.paginationService.more();
    this.paginationService.stateLoading$.subscribe(data => {
      if (!data) infiniteScroll.complete()
    })
  }

  doRefresh (refresher) {
    this.paginationService.update();
    this.paginationService.stateLoading$.subscribe(data => {
      if (!data) refresher.complete()
    })
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    const addModal = this.modalCtrl.create(ItemCreatePage);
    addModal.present();
  }

  filterItems() {
    this.navCtrl.push(FilterPage);
  }

  /**
   * Navigate to the detail page for this item.
   */
  handleItemBtn(event) {
    this.navCtrl.push('ItemDetailPage', { uuidItem: event.uuidItem });
  }

}
