import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, MenuController } from 'ionic-angular';
import { ItemCreatePage, FilterPage, LoginPage } from '../pages';
import { PaginationService, AuthService } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  constructor(
    private navCtrl: NavController,
    private paginationService: PaginationService,
    private modalCtrl: ModalController,
    private menuController: MenuController,
    private authService: AuthService,
  ) {
    // Enable menu
    this.menuController.enable(true, 'myMenu');
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    if (this.authService.authenticated) {
      this.paginationService.init('items', 'timestamp');
    } else {
      this.navCtrl.setRoot(LoginPage).catch(() => {console.error('Error ´initLoginUser´')});
    }
  }

  infiniteScrolling (infiniteScroll) {
    this.paginationService.more();
    this.paginationService.stateLoading$.subscribe(data => {
      if (!data) infiniteScroll.complete()
    })
  }

  doRefresh (refresher) {
    // this.paginationService.update();
    this.paginationService.init('items', 'timestamp');
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
    addModal.present().catch(() => {console.error('Error ´addItem´')});
  }

  filterItems() {
    this.navCtrl.push(FilterPage).catch(() => {console.error('Error ´filterItems´')});
  }

  /**
   * Navigate to the detail page for this item.
   */
  handleItemBtn(event) {
    this.navCtrl.push('ItemDetailPage', { uuidItem: event.uuidItem }).catch(() => {console.error('Error ´handleItemBtn´')});
  }

}
