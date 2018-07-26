import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserDetail, UserUpdate } from '../../models/user.entities';
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
  private base64Image: string = '';
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

    this.form = this.formBuilder.group({
      firsName: [this.userInformation.firsName, Validators.required],
      lastName: [this.userInformation.lastName, Validators.required],
      email: [this.userInformation.email],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {
    console.log(this.navParams.get('userInformation'));
  }

  saveData() {
    const dataUser: UserUpdate = {
      email: this.form.value.email,
      firsName: this.form.value.firsName,
      lastName: this.form.value.lastName,
      uuid: this.userInformation.uuid,
      pictureURL: {
        base64Image: this.base64Image,
        pathOfBucketOld: this.userInformation.pictureURL.pathOfBucket,
      }
    }
    this.loadingService.showLoading();
    this.userService.updateUserData(dataUser).subscribe(
      (response) => {
        this.events.publish('user:logged', response);
        this.viewCtrl.dismiss(response);
        this.loadingService.hideLoading();
      },
      (error) => {
        console.log(error);
        this.loadingService.hideLoading();
      },
    );
  }

  handlePictureBtn(event) {
    this.base64Image = event.base64Image;
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

}
