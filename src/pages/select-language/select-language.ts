import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    public platform: Platform,
    private viewController: ViewController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectLanguagePage');
  }

  changeLanguage(language: string) {
    console.log(this.translate.getLangs());
    this.translate.use(language).subscribe(
      () => {
        if (language === 'ar') {
          this.platform.setDir('rtl', true);
        } else {
          this.platform.setDir('ltr', true);
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        this.viewController.dismiss();
      }
    );
  }

}
