import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  constructor(private viewCtrl: ViewController) {
  }

  delete() {
    this.viewCtrl.dismiss({event: 'delete'}).catch(() => {console.error('Error ´delete´')});
  }

}
