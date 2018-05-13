import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import AuthProvider = firebase.auth.AuthProvider;
import { Observable } from "rxjs/Observable";
import { DocumentReference } from '@firebase/firestore-types';

@Injectable()
export class ItemsService {
  private itemCollectionRef: AngularFirestoreCollection<any>;
  private item$: Observable<any>;

	constructor(private afStore: AngularFirestore) {
    this.itemCollectionRef = afStore.collection<any>('items');
	}

	addItem(dataItem: any): Observable<any> {
    // create a parameter to set the time of creation
    dataItem.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return Observable.fromPromise(this.itemCollectionRef.add(dataItem))
    .map((data) => { return {itemId: data.id }})
    .catch((error) => { return error });
  }

  updateItem(updateData: any): Observable<any> {
    return Observable.fromPromise(this.itemCollectionRef.doc(updateData.id).update(updateData.dataItem))
    .map((data) => { return data })
    .catch((error) => { return error });
  }

  deleteItem(itemId: any): Observable<any> {
    return Observable.fromPromise(this.itemCollectionRef.doc(itemId).delete())
    .map((data) => { return data })
    .catch((error) => { return error });
	}

}
