import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// ionic
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Services
import { ItemsService, LoadingService, PaginationService } from '../../providers/providers';

// Lodash
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

// config
import { categories, wilayas } from '../../app/shared/config';

/**
 * TODO: Page with a form to search items.
 */
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  currentItems = new BehaviorSubject([]);

  form: FormGroup;

  statusSearch: boolean = false;

  categories: any = categories;
  wilayas: any = wilayas;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private paginationService: PaginationService,
  ) {
    this.form = formBuilder.group({
      name: [''],
      priceMin: ['0', Validators.pattern(/^\d+.\d{1}$/)],
      priceMax: ['999999999', Validators.pattern(/^\d+.\d{1}$/)],
      category: [''],
      wilaya: [''],
    });
  }

  /**
   * Navigate to the detail page for this item.
   */
  handleItemBtn(event) {
    this.navCtrl.push('ItemDetailPage', { uuidItem: event.uuidItem }).catch(() => {console.error('Error ´handleItemBtn´')});
  }

  infiniteScrolling (infiniteScroll) {
    const filter = this.form.value;
    filter.priceMin = _.parseInt(filter.priceMin);
    filter.priceMax = _.parseInt(filter.priceMax);
    this.paginationService.more(filter);
    this.paginationService.stateLoading$.subscribe(data => {
      if (!data) infiniteScroll.complete()
    })
  }

  /**
   * Reset status of showing filter
   */
  backToFilter() {
    this.statusSearch = false;
  }

  /**
   * TODO: Waiting for a kind of filter in firebase that can help to search products.
   */
  acceptFilter() {
    const filter = this.form.value;
    // Convert to type number
    filter.priceMin = _.parseInt(filter.priceMin);
    filter.priceMax = _.parseInt(filter.priceMax);
    this.paginationService.init('items', 'timestamp', undefined, filter);
    this.statusSearch = true;
    // this.loadingService.showLoading();
    // this.itemsService.getListOfItemsByFilter(filter).subscribe(
    //   (itemsList) => {
    //     console.log(itemsList);
    //     this.currentItems.next(_.reverse(itemsList));
    //     this.statusSearch = true;
    //     this.loadingService.hideLoading();
    //   },
    //   error => {
    //     console.log(error);
    //     this.loadingService.hideLoading();
    //   }
    // );
  }

}
