import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UsersService } from '../../providers/providers';
import { UserDetail, ItemOfUser } from '../../models/user.entities';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * Page to show and edit data of the user.
 */

@IonicPage()
@Component({
  selector: 'page-profile-user',
  templateUrl: 'profile-user.html',
})
export class ProfileUserPage {

  productInformation: any = 'products';
  userInformation: UserDetail;
  listOfItems = new BehaviorSubject([]);

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public usersService: UsersService,
    private modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    this.usersService.getUserInformationStorage().subscribe(data  => {
      this.userInformation = data;
      this.listOfItems.next(this.userInformation.listOfItems);
    });
  }

  editUser() {
    const addModal = this.modalCtrl.create('UserEditPage', { userInformation: this.userInformation });
    addModal.onDidDismiss(data => {
      if(data) this.userInformation = data;
    });
    addModal.present();
  }

  /**
   * Navigate to the detail page for this item.
   */
  handleItemBtn(event) {
    this.navCtrl.push('ItemDetailPage', { uuidItem: event.uuidItem });
  }

}
