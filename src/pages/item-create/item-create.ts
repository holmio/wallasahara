import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Ionic
import { IonicPage, NavController, ViewController } from 'ionic-angular';

// Services
import { ItemsService, LoadingService, ToastService } from '../../providers/providers';

// Entities
import { CreateItem } from '../../models/item.entities';

// Ngx-translate
import { TranslateService } from '@ngx-translate/core';

// config
import { categories, currencies, wilayas } from '../../app/shared/config';

// Lodash
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {

  isReadyToSave: boolean;

  item: any;

  form: FormGroup;

  /**
   * Config of diferent categories
   */
  categories = categories;
  currencies = currencies;
  wilayas = wilayas;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    private itemsService: ItemsService,
    private loadingService: LoadingService,
    private translate: TranslateService,
    private toastService: ToastService,
  ) {
    this.form = formBuilder.group({
      imagesItem: [[], Validators.required],
      name: ['', Validators.required],
      about: [''],
      price: ['', Validators.compose([Validators.required, Validators.pattern(/^\d+.\d{1}$/)])],
      currency: ['dza', Validators.required],
      category: ['', Validators.required],
      wilaya:['', Validators.required],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  // ionViewDidLoad() { }

  handlePictureBtn(event) {
    console.log(event)
    this.form.controls['imagesItem'].setValue(event.data);
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss().catch(() => {console.error('Error ´cancel´')});
  }

  /**
   * The user can create and item and return to the last page
   * back to the presenter.
   */
  createItem() {
    if (!this.form.valid) { return; }
    const dataItem: CreateItem = this.form.value;
    // Convert to type number the price
    dataItem.price = _.parseInt(this.form.value.price);
    this.loadingService.showLoading();
    this.itemsService.addItem(dataItem).subscribe(
      data => {
        // TODO: This data not return UNDEFINED
        console.log(data);
      },
      (error) => {
        console.log(error);
        this.loadingService.hideLoading();
        this.toastService.show(this.translate.instant('TAKE_PICTURE_ERROR_CAMERA'), 'error');
      },
      () => {
        this.loadingService.hideLoading();
        this.viewCtrl.dismiss(this.form.value).catch(() => {console.error('Error ´createItem´')});
      }
    );
  }
}
