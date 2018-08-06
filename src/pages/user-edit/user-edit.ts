import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Ionic
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';

// Entities
import { UserDetail, UserUpdate } from '../../models/user.entities';

// Services
import { UsersService, LoadingService } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html',
})
export class UserEditPage {

  isReadyToSave: boolean;
  form: FormGroup;
  userInformation: UserDetail;
  isEnabledToEdit: boolean = false;
  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private userService: UsersService,
    private events: Events,
    private loadingService: LoadingService,
  ) {
    this.userInformation = this.navParams.get('userInformation');
    // If the user was created by registration
    this.isEnabledToEdit = this.userInformation.providerUserInfo === 'firebaseAuth';
    this.form = this.formBuilder.group({
      firstName: [this.userInformation.firstName, Validators.required],
      lastName: [this.userInformation.lastName, Validators.required],
      base64Image: [''],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  saveData() {
    const dataUser: UserUpdate = {
      email: this.form.value.email,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      uuid: this.userInformation.uuid,
      pictureURL: {
        base64Image: this.form.value.base64Image,
        pathOfBucketOld: this.userInformation.pictureURL.pathOfBucket,
      }
    }
    this.loadingService.showLoading();
    this.userService.updateUserData(dataUser).subscribe(
      (response) => {
        this.events.publish('user:logged', response);
        this.viewCtrl.dismiss(response).catch(() => {console.error('Error ´saveData´')});
        this.loadingService.hideLoading();
      },
      (error) => {
        console.log(error);
        this.loadingService.hideLoading();
      },
    );
  }

  handlePictureBtn(event) {
    this.form.controls['base64Image'].setValue(event.base64Image);
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss().catch(() => {console.error('Error ´cancel´')});
  }

}
