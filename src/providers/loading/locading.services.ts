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
        duration: 10000,
      });
      this.loading.present().catch(()=>{ console.error('Error ´showLoading´')});
    }
  }

  hideLoading() {
    if(this.loading){
      this.loading.dismiss().catch((error) => { console.error('Error ´hideLoading´', error)});
      this.loading = null;
    }
  }
}
