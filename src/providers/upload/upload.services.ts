import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { Observable } from "rxjs/Observable";
import { DocumentReference } from '@firebase/firestore-types';
import { CreateItem, ItemImage } from '../../models/item.entities';

@Injectable()
export class UploadService {
  private imagesCollectionRef: AngularFireStorageReference;

	constructor(
    private afStorege: AngularFireStorage,
  ) {
    this.imagesCollectionRef = afStorege.ref('images');
	}

  uploadImages(dataImages: ItemImage): Observable<any> {
    return Observable.fromPromise(this.imagesCollectionRef.child(dataImages.idItem).set(
      { base64:dataImages.base64 }
    ))
    .map((data) => { return data })
    .catch((error) => { return error });
  }

}
