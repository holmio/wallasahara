import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import { TranslateService } from '@ngx-translate/core';
import { LoginPage } from '../login/login';
import { SettingsService, LoadingService } from '../../services/services';

/**
 * Generated class for the SelectLanguagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-language',
  templateUrl: 'select-language.html',
})
export class SelectLanguagePage {
  loginPage: any = LoginPage;
  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    public platform: Platform,
    private viewController: ViewController,
    public settingsService: SettingsService,
    private loadingService: LoadingService,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectLanguagePage');
  }

  changeLanguage(language: string) {
    this.loadingService.showLoading();
    this.translate.use(language).subscribe(
      () => {
        this.settingsService.setValue('initialRun', 'true');
        if (language === 'ar') {
          this.settingsService.setValue('optionLang', 'ar');
          this.platform.setDir('rtl', true);
        } else {
          this.settingsService.setValue('optionLang', 'es');
          this.platform.setDir('ltr', true);
        }
      },
      (error) => {
        console.log(error);
        this.loadingService.hideLoading();
      },
      () => {
        this.loadingService.hideLoading();
        this.navCtrl.setRoot(this.loginPage);
      }
    );
  }

}
