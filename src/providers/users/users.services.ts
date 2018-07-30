import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { UserDetail, UserUpdate } from '../../models/user.entities';
import { Observable } from 'rxjs/Observable';
import { SettingsServices } from '../settings/settings.services';
import { UploadService } from '../upload/upload.services';
import { DeleteFileService } from '../delete-file/delete-file.services';

@Injectable()
export class UsersService {

  private userCollectionRef: AngularFirestoreCollection<any>;
  private pathImage: string = 'images/profile/avatar';
  private USER_INFORMATION_KEY: string = '_userInformation';
  constructor(
    private storage: Storage,
    private afStore: AngularFirestore,
    private uploadService: UploadService,
    private deleteFileService: DeleteFileService,
  ) {
    this.userCollectionRef = this.afStore.collection<UserDetail>('users');
  }

  getUserInformationStorage(): Observable<UserDetail> {
    return Observable.fromPromise(this.storage.get(this.USER_INFORMATION_KEY))
  }

  setUserInformationStorage(userInformation: UserDetail): Observable<UserDetail> {
    return Observable.fromPromise(this.storage.set(this.USER_INFORMATION_KEY, userInformation));
  }

  updateUserData(user: UserUpdate): Observable<any> {
    return new Observable<any>((observer: any) => {
      if (user.pictureURL.base64Image) {
        const sourceUpdateUser = this.uploadService.uploadFiles([user.pictureURL.base64Image], this.pathImage)
        Observable.concat(sourceUpdateUser)
        .concatMap((response) => {
          const updateUser: any = {
            firstName: user.firstName,
            lastName: user.lastName,
            pictureURL: {
              pathOfBucket: response.pathOfBucket[0],
              pathOfImage: response.listOfUrlsImages[0]
            },
          }
          return this.userCollectionRef.doc(user.uuid).update(updateUser)
        })
        .concatMap(() => {
          if(user.pictureURL.pathOfBucketOld) {
            return this.deleteFileService.fileToDelete(user.pictureURL.pathOfBucketOld)
          }
        })
        .concatMap(() => {
          return this.getUserInformationFireStore(user.uuid)
        })
        .take(1)
        .subscribe(
          (response: any) => {
            observer.next(response);
            observer.complete();
          }, (error) => {
            observer.error(error);
          }
        );
      } else {
        const updateUser: any = {
          firstName: user.firstName,
          lastName: user.lastName,
        }
        const sourceUpdateUser = this.userCollectionRef.doc(user.uuid).update(updateUser)
        Observable.concat(sourceUpdateUser)
        .concatMap(() => {
          return this.getUserInformationFireStore(user.uuid)
        })
        .take(1)
        .subscribe(
          (response: any) => {
            observer.next(response);
            observer.complete();
          }, (error) => {
            observer.error(error);
          }
        );
      }
    });
  }

  private getUserInformationFireStore(uuid): Observable<any> {
    return this.userCollectionRef.doc(uuid).valueChanges()
  }

}
