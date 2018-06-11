import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ItemsService, LoadingService } from '../../providers/providers';
import { MainPage } from '../pages';
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
    private viewCtrl: ViewController,
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
    this.navCtrl.push('ItemDetailPage', { uuidItem: event.uuidItem });
  }

  private getListOfItemsByFilter(filter?: any) {
    this.loadingService.showLoading();
    this.itemsService.getListOfItemsByFilter(filter).subscribe(
      (itemsList) => {
        console.log(itemsList);
        this.currentItems = _.reverse(itemsList);
        this.statusSearch = true;
        this.loadingService.showLoading();
      },
      error => console.log(error),
    );
  }

}
