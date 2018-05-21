import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { ItemsService, LoadingService } from '../../providers/providers';

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

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    private itemsService: ItemsService,
    private loadingService: LoadingService,
  ) {
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      about: ['']
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
    this.form.patchValue({ 'profilePic': event.data });
  }

  // processWebImage(event) {
  //   let reader = new FileReader();
  //   reader.onload = (readerEvent) => {

  //     let imageData = (readerEvent.target as any).result;
  //     this.form.patchValue({ 'profilePic': imageData });
  //   };

  //   reader.readAsDataURL(event.target.files[0]);
  // }

  // getProfileImageStyle() {
  //   return 'url(' + this.form.controls['profilePic'].value + ')'
  // }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user can create and item and return to the las page
   * back to the presenter.
   */
  createItem() {
    if (!this.form.valid) { return; }
    this.loadingService.showLoading();
    this.itemsService.addItem(this.form.value).subscribe((data) => {
      this.loadingService.hideLoading();
      this.viewCtrl.dismiss(this.form.value);
    },
    (error) => {
      this.loadingService.hideLoading();
      console.error(error);
    });
  }
}
