import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
  constructor(
    public toastController: ToastController,
  ) {

  }
  show (message: string, cssClass?: string, duration: number = 3000) {
    const toast = this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
      cssClass: cssClass
    });
    toast.present();
  }
}
