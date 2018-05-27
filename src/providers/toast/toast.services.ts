import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
  constructor(
    public toastController: ToastController,
  ) {

  }
  show (message: string, cssClass?: string, duration: number = 4000) {
    let toast = this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      cssClass: cssClass
    });
    toast.present();
  }
}