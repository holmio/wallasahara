import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Config, Nav, Platform, MenuController } from 'ionic-angular';

import { FirstRunPage, MainPage, LoginPage } from '../pages/pages';
import { AuthService, LoadingService, SettingsService } from '../services/services';
import { Observable } from 'rxjs';

@Component({
  template: `<ion-menu [content]="content">
    <ion-header no-border>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
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
  rootPage = LoginPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Login', component: 'LoginPage' },
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Cards', component: 'CardsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Master Detail', component: 'ListMasterPage' },
    { title: 'Menu', component: 'MenuPage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Search', component: 'SearchPage' },
    { title: 'Select Language', component: 'SelectLanguagePage', icon: 'grid' },
  ]
  private menu: MenuController;

  constructor(
    public platform: Platform,
    public settingsService: SettingsService,
    public auth: AuthService,
    public loadingService: LoadingService,
    private translate: TranslateService,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private menuController: MenuController,
  ) {
    this.menu = menuController;
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initTranslate();
      this.initLoginUser();
    });
  }


  initTranslate() {
    let langApp: string = 'es';
    // Set the default language for translation strings, and the current language.
    this.settingsService.getValue('langApp').then((lang) => {
      if (lang) langApp = lang;
      this.translate.setDefaultLang(langApp);
      if (langApp === 'ar') {
        this.platform.setDir('rtl', true);
      } else {
        this.platform.setDir('ltr', true);
      }
    });

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log("onLangChange", event.translations)
    })
    this.translate.onDefaultLangChange.subscribe((event: LangChangeEvent) => {
      console.log("onDefaultLangChange", event.translations)
    })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(LoginPage);
  }

  private initLoginUser () {

    this.loadingService.showLoading();
    let source = Observable.zip(
      this.settingsService.getValue('initialRun'),
      this.auth.afAuth.authState,
    )
    source.subscribe(
      (res) => {
        console.log(res);
        if (res[0]) {
          if (res[1]) {
            this.rootPage = MainPage;
          } else {
            this.rootPage = LoginPage;
          }
          this.loadingService.hideLoading();
        } else {
          this.rootPage = FirstRunPage;
          this.loadingService.hideLoading();
        }
      });
  }
}
