import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SlideGalleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slide-gallery',
  templateUrl: 'slide-gallery.html',
})
export class SlideGalleryPage {
  gallery: Array<string> = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.gallery = navParams.get('gallery');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
