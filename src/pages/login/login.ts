import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, MenuController, Events } from 'ionic-angular';
import { MainPage } from '../pages';
import { AuthService, ToastService, LoadingService, SettingsServices } from '../../providers/providers';
import { UserDetail } from '../../models/user.entities';

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
    public translateService: TranslateService,
    private events: Events,
    private auth: AuthService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private settingsServices: SettingsServices,
    private menuController: MenuController,
  ) {
    // Disable menu for login page
    this.menuController.enable(false, 'myMenu');
    this.translateService.get(['LOGIN_ERROR', 'LOGIN_SUCCESS']).subscribe((value) => {
      this.loginErrorString = value.LOGIN_ERROR;
      this.loginSuccessString = value.LOGIN_SUCCESS;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.loadingService.showLoading();
    this.auth.signInWithEmail(this.account).subscribe((response) => {
      this.events.publish('user:logged', response);
      this.navCtrl.setRoot(MainPage);
      this.loadingService.hideLoading();
    }, (err) => {
      this.loadingService.hideLoading();
      // Unable to log in
      this.toastService.show(this.loginErrorString, 'error');
    });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
  facebookUp() {
    this.loadingService.showLoading();
    this.auth.signInWithFacebook().subscribe((response: UserDetail) => {
      console.log(response)
      this.events.publish('user:logged', response);
      this.navCtrl.setRoot(MainPage);
      this.loadingService.hideLoading();
    }, (err) => {
      this.loadingService.hideLoading();
      // Unable to log in
      console.log(err);
    });
  }
  // twitterUp() {

  // }
  // googleUp() {

  // }
}
