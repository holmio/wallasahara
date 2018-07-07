import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Config, Nav, Platform, MenuController, ModalController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';

import { FirstRunPage, MainPage, LoginPage } from '../pages/pages';
import { AuthService, LoadingService, SettingsServices } from '../providers/providers';
import * as _ from 'lodash';

export const LANG_ES: string = 'es';
export const LANG_AR: string = 'ar';

@Component({
  template: `<ion-menu id="myMenu" [content]="content">
    <ion-header no-border>
      <ion-toolbar>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
      <ion-item (click)="logout()" *ngIf="auth.authenticated">
        <ion-icon name="log-out" item-left></ion-icon>
        Log out
      </ion-item>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {

  rootPage = MainPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Login', component: 'LoginPage' },
    { title: 'List of Items', component: 'ListMasterPage' },
    { title: 'Search', component: 'SearchPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Menu', component: 'MenuPage' },
  ];
  PERMISSION = {
    WRITE_EXTERNAL: this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
    READ_EXTERNAL: this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
    CAMERA: this.androidPermissions.PERMISSION.CAMERA,
  };
  constructor(
    public platform: Platform,
    public auth: AuthService,
    public modalCtrl: ModalController,
    private loadingService: LoadingService,
    private settingsServices: SettingsServices,
    private translate: TranslateService,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private menuController: MenuController,
    private androidPermissions: AndroidPermissions,
    private diagnostic: Diagnostic
  ) {
    /** TODO */
    this.translate.setDefaultLang(LANG_AR);
    this.platform.setDir('rtl', true);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (this.platform.is('android')) {
        this.requestAllPermissions();
      }
      this.initTranslate();
      this.initLoginUser();
    });
  }


  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.settingsServices.getValue('optionLang').subscribe((lang) => {
      if (lang === LANG_AR) this.translate.setDefaultLang(LANG_AR);
    });

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
    /**
     *
     */
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log("onLangChange", event.translations)
      if (event.lang === LANG_AR) {
        this.settingsServices.setValue('optionLang', LANG_AR);
        this.platform.setDir('rtl', true);
        this.platform.setDir('ltr', false);
      } else {
        this.settingsServices.setValue('optionLang', LANG_ES);
        this.platform.setDir('ltr', true);
        this.platform.setDir('rtl', false);
      }
    })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.menuController.close();
    this.auth.signOut();
    this.nav.setRoot(LoginPage);
  }

  private requestAllPermissions() {
    const permissions = Object.keys(this.PERMISSION).map(k => this.PERMISSION[k]);
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]).then((status) => {
      // alert(JSON.stringify(status));
    }, error => {
      console.error('permission error:', error);
    });
  }

  private initLoginUser() {

    this.loadingService.showLoading();
    this.settingsServices.getValue('initialRun')
    .switchMap(status => {
      if (!_.isUndefined(status)) {
        return this.auth.afAuth.authState;
      } else {
        this.rootPage = LoginPage;
        // this.selectLanguage();
        this.loadingService.hideLoading();
      }
    }).subscribe(
      authState => {
        if (authState) {
          this.rootPage = MainPage;
        } else {
          this.rootPage = LoginPage;
        }
        this.loadingService.hideLoading();
      },
      error => {
        console.error(error);
        this.loadingService.hideLoading();
      }
    )
  }

  private selectLanguage() {
    const addModal = this.modalCtrl.create(FirstRunPage);
    addModal.present();
  }
}
