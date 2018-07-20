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
  constructor(
    public afStore: AngularFirestore,
    private settingsServices: SettingsServices,
  ) {
    this.userCollectionRef = afStore.collection<UserDetail>('users');
  }

  getUserInformationStorage(): Observable<UserDetail> {
    return this.settingsServices.getValue('userInformation');
  }

  setUserInformation(userInformation: UserDetail): Observable<UserDetail> {
    return Observable.fromPromise(this.settingsServices.setValue('userInformation', userInformation));
  }

  updateUserData(user: UserDetail): Observable<any> {
    return Observable.fromPromise(this.userCollectionRef.doc(user.uuid).set(user))
  }

  getUserInformationFireStore(uuid) {
    return this.userCollectionRef.doc(uuid).valueChanges()
  }

}
