import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { ItemsService, LoadingService, UploadService, ToastService, UsersService } from '../../providers/providers';
import { CreateItem } from '../../models/item.entities';
import { TranslateService } from '@ngx-translate/core';
import { UserDetail } from '../../models/user.entities';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {

  isReadyToSave: boolean;

  item: any;

  form: FormGroup;

  // TODO
  categories: any = [
    {value: 'videos', name: 'Videos'},
    {value: 'play', name: 'Play'},
    {value: 'camells', name: 'Camellos'},
    {value: 'cabra', name: 'Cabra'},
    {value: 'melfa', name: 'Melfa'},
    {value: 'coche', name: 'coche'},
    {value: 'otro', name: 'Otro'},
  ]
  currencies: any = [
    {value: 'dza', nameAr: 'دينار', nameEn: 'Dinar'},
    {value: 'eur', nameAr: 'اليورو', nameEn: 'Euro'},
  ]

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
      price: ['', Validators.compose([Validators.required, Validators.pattern(/^\d+.\d{1}$/)])],
      currency: ['dza', Validators.required],
      category: ['', Validators.required],
      about: [''],
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
    this.viewCtrl.dismiss();
  }

  /**
   * The user can create and item and return to the last page
   * back to the presenter.
   */
  createItem() {
    if (!this.form.valid) { return; }
    const dataItem: CreateItem = this.form.value;
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
        this.viewCtrl.dismiss(this.form.value);
      }
    );
  }
}
