import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { AuthService, ToastService } from '../../services/services';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: any = {};

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastService: ToastService,
    public translateService: TranslateService,
    public auth: AuthService,
  ) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
    // Attempt to login in through our User service
    this.auth.signUp(this.account).subscribe((resp) => {
      this.toastService.show(resp, 'success');
      this.navCtrl.push(MainPage);
    }, (err) => {
      // Unable to sign up
      this.toastService.show(this.signupErrorString, 'error');
    });
  }
}
