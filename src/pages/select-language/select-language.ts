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
    public viewCtrl: ViewController,
    public settingsService: SettingsService,
    private loadingService: LoadingService,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectLanguagePage');
  }

  changeLanguage(language: string) {
    this.translate.use(language)
    this.settingsService.setValue('initialRun', 'true');
    this.viewCtrl.dismiss();
  }

}
