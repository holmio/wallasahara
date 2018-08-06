import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

// ionic
import { IonicPage, NavController, Events } from 'ionic-angular';

// Ngx-translate
import { TranslateService } from '@ngx-translate/core';

// Pages
import { MainPage } from '../pages';

// Services
import { AuthService, ToastService } from '../../providers/providers';

// Rxjs
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  userToRegister: any = {};

  form: FormGroup;
  // Our translated text strings
  private signupErrorString: string;

  constructor(
    public navCtrl: NavController,
    private toastService: ToastService,
    private translateService: TranslateService,
    private auth: AuthService,
    private events: Events,
    private formBuilder: FormBuilder,
  ) {


    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    });

    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword:   ['', [Validators.required, this.matchOtherValidator('password')]]
    });
  }



  doSignup() {
    // Attempt to login in through our User service
    delete this.form.value.confirmPassword;
    this.auth.signUp(this.form.value).subscribe((response) => {
      this.events.publish('user:logged', response);
      this.navCtrl.setRoot(MainPage).catch(() => {console.error('Error ´doSignup´')});
    }, (error) => {
      // Unable to sign up
      this.toastService.show(this.signupErrorString, 'error');
      console.log(error)
    });
  }

  private matchOtherValidator(otherControlName: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const otherControl: AbstractControl = control.root.get(otherControlName);

        if (otherControl) {
            const subscription: Subscription = otherControl
                .valueChanges
                .subscribe(() => {
                    control.updateValueAndValidity();
                    subscription.unsubscribe();
                });
        }

        return (otherControl && control.value !== otherControl.value) ? {match: true} : null;
    };
  }
}
