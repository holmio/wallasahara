import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Ngx-translate
import { TranslateService } from '@ngx-translate/core';

// Ionic
import { IonicPage, NavController, MenuController, Events } from 'ionic-angular';

// Pages
import { MainPage } from '../pages';

// Services
import { AuthService, ToastService, LoadingService, UsersService } from '../../providers/providers';

// Entities
import { UserDetail } from '../../models/user.entities';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  form: FormGroup;

  constructor(
    private navCtrl: NavController,
    private translateService: TranslateService,
    private events: Events,
    private auth: AuthService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private menuController: MenuController,
    private formBuilder: FormBuilder,
    private userService: UsersService,
  ) {
    // Disable menu for login page
    this.menuController.enable(false, 'myMenu');
  }

  ionViewWillEnter(){
   if (this.auth.authenticated){
    this.loadingService.showLoading();
     this.userService.getUserInformationStorage().subscribe((response) => {
      this.loadingService.hideLoading();
       if (response) {
        this.events.publish('user:logged', response);
        this.navCtrl.setRoot(MainPage).catch(() => {console.error('Error ´doLogin´')});
       } else {
         return;
       }
     });
   }
  }

  ionViewDidLoad(){
    this.form = this.formBuilder.group({
      email: ['test@example.com', [Validators.required, Validators.email]],
      password: ['test123456', [Validators.required, Validators.minLength(8)]],
    });
  }

  // Attempt to login in through our User service
  doLogin() {
    this.loadingService.showLoading();
    this.auth.signInWithEmail(this.form.value).subscribe((response) => {
      this.events.publish('user:logged', response);
      this.navCtrl.setRoot(MainPage).catch(() => {console.error('Error ´doLogin´')});
      this.loadingService.hideLoading();
    }, (err) => {
      this.loadingService.hideLoading();
      // Unable to log in
      this.toastService.show(this.translateService.instant('LOGIN_ERROR'), 'error');
    });
  }

  signup() {
    this.navCtrl.push('SignupPage').catch(() => {console.error('Error ´signup´')});
  }
  facebookUp() {
    this.loadingService.showLoading();
    this.auth.signInWithFacebook().subscribe((response: UserDetail) => {
      console.log(response)
      this.events.publish('user:logged', response);
      this.navCtrl.setRoot(MainPage).catch(() => {console.error('Error ´facebookUp´')});
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
