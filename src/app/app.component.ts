import { Component, ViewChild } from '@angular/core';

// Ngx-translate
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

// Ionic
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Config, Nav, Platform, MenuController, ModalController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';

// Pages
import { MainPage, LoginPage } from '../pages/pages';

// Services
import { AuthService, SettingsServices, UsersService } from '../providers/providers';

// Entities
import { UserDetail } from '../models/user.entities';

// Lodash
import * as _ from 'lodash';

// LANG CONST
export const LANG_ES: string = 'es';
export const LANG_AR: string = 'ar';

@Component({
  template: `<ion-menu id="myMenu" [content]="content">
    <ion-content>
      <ion-list-header *ngIf="userDetails" no-lines>
        <ion-item (click)="goToOtherPage('ProfileUserPage')">
          <div item-start>
          <div class="avatar-img-60" [style.background-image]="'url(' + userDetails.pictureURL?.pathOfImage + ')'"></div>
          </div>
          <h2>{{userDetails.firstName}}</h2>
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

  rootPage = LoginPage;

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
    private settingsServices: SettingsServices,
    private translate: TranslateService,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private menuController: MenuController,
    private androidPermissions: AndroidPermissions,
    private events: Events,
    private storage: Storage,
  ) {
    /** TODO */
    this.translate.setDefaultLang(LANG_AR);
    this.platform.setDir('rtl', true);
    this.initializeApp();
    this.catchDataUser();
  }

  initializeApp() {
    this.platform.ready()
    .then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initTranslate();
    })
    .catch((error) => {console.error('App not loaded correctly ´initializeApp´: ' + error)});
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
    this.nav.setRoot(page.component).catch(() => {console.error('Error ´openPage´')});
  }
  goToOtherPage(page: string) {
    // push another page onto the history stack
    // causing the nav controller to animate the new page in
    this.menuController.close().catch(() => {console.error('Error ´goToOtherPage´')});
    this.nav.push(page).catch(() => {console.error('Error ´goToOtherPage´')});
  }

  /**
   * Logout and reset the state of user
   */
  logout() {
    this.auth.signOut()
    .then(() => {
      this.menuController.close().catch(() => {console.error('Error ´logout´')});
      this.nav.setRoot(LoginPage).catch(() => {console.error('Error ´logout´')});
      this.storage.clear();
    })
    .catch(() => {console.error('Error ´logout´')});
  }

  private catchDataUser() {
    this.events.subscribe('user:logged', (response) => {
      if (!_.isUndefined(response)) {
        this.userDetails = response;
        this.userService.setUserInformationStorage(this.userDetails);
        this.settingsServices.setValue('initialRun', true).catch(() => {console.error('Error ´logout´')});
      }
    });
  }

  /**
   * Modal to select the differents laguages.
   */
  // private selectLanguage() {
  //   const addModal = this.modalCtrl.create(FirstRunPage);
  //   addModal.present().catch(() => {console.error('Error ´selectLanguage´')});
  // }
}
