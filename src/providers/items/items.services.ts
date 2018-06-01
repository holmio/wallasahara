import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { Observable } from "rxjs/Observable";
import { CreateItem, ItemImage, UpdateItem } from '../../models/item.entities';
import { UploadService } from '../upload/upload.services';
import * as _ from 'lodash';

/**
 * Service with the necessary elements to add, update and delete and Item
 */

@Injectable()
export class ItemsService {
  private itemCollectionRef: AngularFirestoreCollection<CreateItem>;
  private imagesCollectionRef: AngularFirestoreCollection<ItemImage>;
  private item$: Observable<any>;
	constructor(
    private afStore: AngularFirestore,
    private uploadService: UploadService,
  ) {
    this.itemCollectionRef = afStore.collection<any>('items');
    this.imagesCollectionRef = afStore.collection<any>('images');
	}

  /**
   * Register the data of the item within of base data.
   * @param dataItem data of Item
   */
	addItem(dataItem: CreateItem): Observable<any> {
    // Uuid generated automatic
    let uuidItem: string = this.uuidv4();
    // Bath of the images
    let basePath: string = `images/items/${uuidItem}`;
    // create a parameter to set the time of creation
    dataItem.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    return new Observable<any>((observer: any) => {
      let sourceUpload = this.uploadService.uploadFiles(dataItem.imagesItem, basePath);
      Observable.concat(sourceUpload)
      .flatMap((response) => {
        return Observable.fromPromise(this.imagesCollectionRef.doc(uuidItem).set(
          {
            pathOfImages: response.listOfUrlsImages,
            pathOfBucket: response.pathOfBucket,
          })).map((item) => { return { profileItem: _.last(response.listOfUrlsImages) }; });
      })
      .flatMap((response) => {
        dataItem.profileItem = response.profileItem;
        delete dataItem.imagesItem;
        return this.itemCollectionRef.doc(uuidItem).set(dataItem)
      })
      .subscribe(
        (response: any) => {
          // Nothing TODO
        }, (error) => {
          observer.error(error);
        }, () => {
          observer.next('Success!!');
          observer.complete();
        }
      );
    });
  }

  /**
   * Update item
   * @param updateData data of item
   */
  updateItem(updateData: UpdateItem, uuidItem: string): Observable<any> {
    return Observable.fromPromise(this.itemCollectionRef.doc(uuidItem).update(updateData))
    .catch((error) => { return error });
  }

  /**
   * Delete and item
   * @param uuidItem unique code of item
   */
  deleteItem(uuidItem: any): Observable<any> {
    return Observable.fromPromise(this.itemCollectionRef.doc(uuidItem).delete())
    .catch((error) => { return error });
  }

  /**
   * Get the list of items.
   */
  getListOfItems() {
    return this.itemCollectionRef.valueChanges();
  }

  getImagesFromURL (url) {
    let storageRef = firebase.storage().ref();
  }

  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}
