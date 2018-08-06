import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// ionic
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Services
import { ItemsService, LoadingService } from '../../providers/providers';

// Lodash
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  currentItems: any = [];

  form: FormGroup;

  statusSearch: boolean = false;

  categories: any = [
    {value: 'videos', name: 'Videos'},
    {value: 'play', name: 'Play'},
    {value: 'camells', name: 'Camellos'},
    {value: 'cabra', name: 'Cabra'},
    {value: 'melfa', name: 'Melfa'},
    {value: 'coche', name: 'coche'},
    {value: 'otro', name: 'Otro'},
  ]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private itemsService: ItemsService,
    private loadingService: LoadingService,
  ) {
    this.form = formBuilder.group({
      name: [''],
      price: ['', Validators.pattern(/^\d+.\d{1}$/)],
      category: [''],
    });
  }

  /**
   * Accept the filter and go to the list of items.
   */
  acceptFilter () {
    this.getListOfItemsByFilter(this.form.value)
  }

  /**
   * Navigate to the detail page for this item.
   */
  handleItemBtn(event) {
    this.navCtrl.push('ItemDetailPage', { uuidItem: event.uuidItem }).catch(() => {console.error('Error ´handleItemBtn´')});
  }

  /**
   * Reset status of showing filter
   */
  backToFilter() {
    this.statusSearch = false;
  }

  private getListOfItemsByFilter(filter?: any) {
    this.loadingService.showLoading();
    this.itemsService.getListOfItemsByFilter(filter).subscribe(
      (itemsList) => {
        console.log(itemsList);
        this.currentItems = _.reverse(itemsList);
        this.statusSearch = true;
        this.loadingService.hideLoading();
      },
      error => {
        console.log(error);
        this.loadingService.hideLoading();
      }
    );
  }

}
