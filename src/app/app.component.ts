import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Config, Nav, Platform, MenuController, ModalController, Events } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';

import { FirstRunPage, MainPage, LoginPage } from '../pages/pages';
import { AuthService, LoadingService, SettingsServices, UsersService } from '../providers/providers';
import * as _ from 'lodash';
import { UserDetail } from '../models/user.entities';

export const LANG_ES: string = 'es';
export const LANG_AR: string = 'ar';

@Component({
  template: `<ion-menu id="myMenu" [content]="content">
    <ion-content>
      <ion-list-header *ngIf="userDetails" no-lines>
        <ion-item (click)="goToOtherPage('ProfileUserPage')">
          <ion-avatar item-start>
            <img [src]="userDetails.photoURL">
          </ion-avatar>
          <h2>{{userDetails.firsName}}</h2>
        </ion-item>
      </ion-list-header>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
        <button *ngIf="auth.authenticated" ion-item (click)="logout()">
          <ion-icon name="log-out" item-left></ion-icon>
          Log out
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {

  rootPage = MainPage;

  userDetails: UserDetail;

  @ViewChild(Nav) nav: Nav;

  // Menu pages
  pages: any[] = [
    { title: 'List of Items', component: 'ListMasterPage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Tabs', component: 'TabsPage' },
  ];

  // Permission for the camera and to read the gallery
  PERMISSION = {
    WRITE_EXTERNAL: this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
    READ_EXTERNAL: this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
    CAMERA: this.androidPermissions.PERMISSION.CAMERA,
  };

  constructor(
    public platform: Platform,
    public auth: AuthService,
    public userService: UsersService,
    public modalCtrl: ModalController,
    private loadingService: LoadingService,
    private settingsServices: SettingsServices,
    private translate: TranslateService,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private menuController: MenuController,
    private androidPermissions: AndroidPermissions,
    private events: Events,
    private diagnostic: Diagnostic
  ) {
    /** TODO */
    this.translate.setDefaultLang(LANG_AR);
    this.platform.setDir('rtl', true);
    this.initializeApp();
    this.updateDataUser();
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
     * Watching the state of the language if it is changing
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
  goToOtherPage(page: string) {
    // push another page onto the history stack
    // causing the nav controller to animate the new page in
    this.menuController.close();
    this.nav.push(page);
  }

  /**
   * Logout and reset the state of user
   */
  logout() {
    this.menuController.close();
    this.settingsServices.clearSettings();
    this.auth.signOut();
    this.nav.setRoot(LoginPage);
  }

  private updateDataUser() {
    this.events.subscribe('user:logged', (response) => {
      if (!_.isUndefined(response)) {
        this.userDetails = response;
        this.userService.setUserInformation(this.userDetails);
        this.settingsServices.setValue('initialRun', true);
      }
    });
  }

  /**
   * Request for permissions.
   */
  private requestAllPermissions() {
    const permissions = Object.keys(this.PERMISSION).map(k => this.PERMISSION[k]);
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]).then((status) => {
      // alert(JSON.stringify(status));
    }, error => {
      console.error('permission error:', error);
    });
  }

  /**
   * Start login if we have credentials
   */
  private initLoginUser() {
    if (!this.auth.authenticated) {
      this.rootPage = LoginPage;
    } else {
      this.userService.getUserInformation().subscribe(
        (response: UserDetail) => {
          this.userDetails = response;
        }
      );
      this.rootPage = MainPage;
    }
  }

  /**
   * Modal to select the differents laguages.
   */
  private selectLanguage() {
    const addModal = this.modalCtrl.create(FirstRunPage);
    addModal.present();
  }
}
