import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingService {
  private loading: any;
  constructor(
    private loadingCtrl: LoadingController
  ) {

  }
  showLoading() {
    if(!this.loading) {
      this.loading = this.loadingCtrl.create({
        duration: 5000,
      });
      this.loading.present();
    }
  }

  hideLoading() {
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }
}
