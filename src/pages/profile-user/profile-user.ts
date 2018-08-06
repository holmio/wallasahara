import { Component } from '@angular/core';

// Ionic
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

// Services
import { UsersService } from '../../providers/providers';

// Entities
import { UserDetail } from '../../models/user.entities';

// Rxjs
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs';

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
  private unsubscribtion: Subscription;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private usersService: UsersService,
    private modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    this.unsubscribtion = this.usersService.getUserInformationStorage()
    .concatMap(response => {
      return this.usersService.getUserInformationFireStore(response.uuid)
    }).subscribe(data  => {
      this.userInformation = data;
      this.listOfItems.next(this.userInformation.listOfItems);
    });
  }

  ionViewDidLeave(){
    this.unsubscribtion.unsubscribe();
  }

  editUser() {
    const addModal = this.modalCtrl.create('UserEditPage', { userInformation: this.userInformation });
    addModal.onDidDismiss(data => {
      if(data) this.userInformation = data;
    });
    addModal.present().catch((error) => {console.error('Error ´editUser´: ' + error)});
  }

  /**
   * Navigate to the detail page for this item.
   */
  handleItemBtn(event) {
    this.navCtrl.push('ItemDetailPage', { uuidItem: event.uuidItem }).catch(() => {console.error('Error ´handleItemBtn´')});
  }

}
