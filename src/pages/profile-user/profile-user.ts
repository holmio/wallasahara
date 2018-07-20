import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersService } from '../../providers/providers';
import { UserDetail } from '../../models/user.entities';

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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public usersService: UsersService,
  ) {
  }

  ionViewDidLoad() {
    this.usersService.getUserInformation().subscribe(data  => {
      this.userInformation = data;
    });
  }

}
