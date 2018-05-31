import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { Observable } from "rxjs/Observable";
import { DocumentReference } from '@firebase/firestore-types';
import { CreateItem, ItemImage } from '../../models/item.entities';
import { AuthService } from '../providers';
import { ObserveOnMessage } from 'rxjs/operators/observeOn';
import { Observer } from 'rxjs';

@Injectable()
export class UploadService {
  // Main task
	constructor() {}

  uploadFile(filesToUpload: ItemImage, pathRoute: string): Observable<any> {
    let urlOfImages: Array<string> = [];
    if (filesToUpload.base64List.length !== 0) {
      filesToUpload.base64List.forEach(element => {
        let basePath: string = `${pathRoute}/${new Date().getTime()}.jpg`;
        urlOfImages.push(basePath);
        this.uploadFileString(basePath, element);
      });
    }
    return Observable.of({listOfUrlsImages: urlOfImages})
    .catch((error) => { return error });
  }

  private async uploadFileString(path:string, file:string) {
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(path).putString(file, 'data_url');
    await uploadTask;
  }

  private async deleteFile(path:string){
    let storageRef = firebase.storage().ref();
    return await storageRef.child(path).delete();
  }


}
