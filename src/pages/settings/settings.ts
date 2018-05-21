import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { SettingsService, LoadingService } from '../../providers/providers';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';

  subSettings: any = SettingsPage;

  selectedLang: string;

  private currentLang: string;

  constructor(public navCtrl: NavController,
    public settingsService: SettingsService,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    public platform: Platform,
  ) {
    // setting current value of lang
    this.settingsService.getValue('optionLang').then((lang) => this.currentLang = lang);
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;

    this.settingsService.load().then(() => {
      this.settingsReady = true;
      this.options = this.settingsService.allSettings;

      this.buildForm();
    });
  }

  private buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      optionLang: [this.currentLang],
    };

    this.selectedLang = this.currentLang;

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and set value of lang
    this.form.valueChanges.subscribe((formData) => {
      if(formData.optionLang !== this.currentLang) {
        // setting again current value of lang
        this.currentLang = formData.optionLang;
        this.changeLanguage(formData.optionLang)
      }
      this.settingsService.merge(this.form.value);
    });
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }
  /**
   * Method to set the laguage was choosed
   * @param language language param
   */
  changeLanguage(language: string) {
    this.translate.use(language);
  }
}
