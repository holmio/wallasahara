import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { ItemsService, LoadingService, UploadService } from '../../providers/providers';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { CreateItem } from '../../models/item.entities';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

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

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    private itemsService: ItemsService,
    private loadingService: LoadingService,
    private uploadService: UploadService,
  ) {
    this.form = formBuilder.group({
      imagesItem: [[], Validators.required],
      name: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      about: [''],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }

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
    let dataItem: CreateItem = this.form.value;
    this.loadingService.showLoading();
    this.itemsService.addItem(dataItem).subscribe(
      data => {
        // TODO: This data not return any data
        console.log(data);
      },
      (error) => {
        console.log(error);
        this.loadingService.hideLoading();
      },
      () => {
        this.loadingService.hideLoading();
        this.viewCtrl.dismiss(this.form.value);
      }
    );
  }
}
