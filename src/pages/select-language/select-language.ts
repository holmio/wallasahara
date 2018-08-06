import { Component } from '@angular/core';

// ionic
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';

// Ngx-translate
import { TranslateService } from '@ngx-translate/core';

// Pages
import { LoginPage } from '../pages';

// Services
import { SettingsServices } from '../../providers/providers';

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
    public settingsServices: SettingsServices,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectLanguagePage');
  }

  changeLanguage(language: string) {
    this.translate.use(language);
    this.settingsServices.setValue('initialRun', 'true');
    this.viewCtrl.dismiss().catch(() => {console.error('Error ´handleItemBtn´')});
  }

}
