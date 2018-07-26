import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { MainPage } from '../pages';
import { AuthService, ToastService } from '../../providers/providers';
import { UserDetail } from '../../models/user.entities';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  userToRegister: any = {};

  // Our translated text strings
  private signupErrorString: string;

  constructor(
    public navCtrl: NavController,
    private toastService: ToastService,
    private translateService: TranslateService,
    private auth: AuthService,
    private events: Events,
  ) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
    // Attempt to login in through our User service
    this.auth.signUp(this.userToRegister).subscribe((response) => {
      this.events.publish('user:logged', response);
      this.navCtrl.setRoot(MainPage);
    }, (error) => {
      // Unable to sign up
      this.toastService.show(this.signupErrorString, 'error');
      console.log(error)
    });
  }
}
