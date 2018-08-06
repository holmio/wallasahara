import { Component } from '@angular/core';

// Ionic
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
    this.gallery = this.navParams.get('gallery');
  }

  dismiss() {
    this.viewCtrl.dismiss().catch(() => {console.error('Error ´dismiss´')});
  }
}
