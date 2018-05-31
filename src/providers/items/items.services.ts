import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { Observable } from "rxjs/Observable";
import { DocumentReference } from '@firebase/firestore-types';
import { CreateItem, ItemImage } from '../../models/item.entities';
import { UploadService } from '../upload/upload.services';
import { mergeMap } from 'rxjs/operators';


@Injectable()
export class ItemsService {
  private itemCollectionRef: AngularFirestoreCollection<any>;
  private imagesCollectionRef: AngularFirestoreCollection<any>;
  private item$: Observable<any>;

	constructor(
    private afStore: AngularFirestore,
    private uploadService: UploadService,
  ) {
    this.itemCollectionRef = afStore.collection<any>('items');
    this.imagesCollectionRef = afStore.collection<any>('images');
	}

	addItem(dataItem: CreateItem): Observable<any> {
    // create a parameter to set the time of creation
    dataItem.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return Observable.fromPromise(this.itemCollectionRef.add(dataItem))
    .map((data) => { return {uidItem: data.id }})
    .catch((error) => { return error });
  }

  uploadImages(dataImages: ItemImage): Observable<any> {
    let basePath: string = `images/items/${dataImages.uidItem}`;
    let sourceUpload = this.uploadService.uploadFile(dataImages, basePath);
    let sourceImageTotal = sourceUpload.pipe(mergeMap(val => this.imagesCollectionRef.doc(dataImages.uidItem).set({
      pathOfImages: val.listOfUrlsImages
    })));
    return sourceImageTotal;
  }

  updateItem(updateData: any): Observable<any> {
    return Observable.fromPromise(this.itemCollectionRef.doc(updateData.id).update(updateData.dataItem))
    .catch((error) => { return error });
  }

  deleteItem(itemId: any): Observable<any> {
    return Observable.fromPromise(this.itemCollectionRef.doc(itemId).delete())
    .catch((error) => { return error });
  }

  getListOfItems() {
    return this.itemCollectionRef.valueChanges();
  }

}
