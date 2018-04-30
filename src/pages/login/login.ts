import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { AuthService, ToastService } from '../../services/services';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'test123456'
  };

  // Our translated text strings
  private loginErrorString: string;
  private loginSuccessString: string;

  constructor(public navCtrl: NavController,
    public auth: AuthService,
    public toastService: ToastService,
    public translateService: TranslateService) {

    this.translateService.get(['LOGIN_ERROR', 'LOGIN_SUCCESS']).subscribe((value) => {
      this.loginErrorString = value.LOGIN_ERROR;
      this.loginSuccessString = value.LOGIN_SUCCESS;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.auth.signInWithEmail(this.account).subscribe((resp) => {
      this.toastService.show(this.loginSuccessString, 'success');
      this.navCtrl.push(MainPage);
    }, (err) => {
      // Unable to log in
      this.toastService.show(this.loginSuccessString, 'error');
    });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
  facebookUp() {

  }
  twitterUp() {

  }
  googleUp() {

  }
}
