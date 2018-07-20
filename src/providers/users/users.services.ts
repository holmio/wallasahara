import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { UserDetail } from '../../models/user.entities';
import { Observable } from 'rxjs/Observable';
import { UserInfo } from 'firebase/app';
import { SettingsServices } from '../settings/settings.services';

@Injectable()
export class UsersService {

  private userCollectionRef: AngularFirestoreCollection<any>;
  private userInformation;
  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private settingsServices: SettingsServices,
  ) {
    this.userCollectionRef = afStore.collection<UserDetail>('users');
    this.userInformation = afAuth.auth.currentUser;
  }

  getUserInformation(): Observable<UserDetail> {
    return this.settingsServices.getValue('userInformation');
  }

  setUserInformation(userInformation: UserDetail): Observable<UserDetail> {
    return Observable.fromPromise(this.settingsServices.setValue('userInformation', userInformation));
  }

}
