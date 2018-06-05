import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { Observable } from "rxjs/Observable";
import { CreateItem, ItemImage, UpdateItem, DetailsItem } from '../../models/item.entities';
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
    this.imagesCollectionRef = afStore.collection<any>('galleryItems');
	}

  /**
   * Register the data of the item within of base data.
   * @param dataItem data of Item
   */
	addItem(dataItem: CreateItem): Observable<any> {
    // Uuid generated automatic
    const uuidItem: string = this.uuidv4();
    // Bath of the images
    const basePath: string = `images/items/${uuidItem}`;
    // create a parameter to set the time of creation
    dataItem.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    dataItem.uuid = uuidItem;
    return new Observable<any>((observer: any) => {
      const sourceUpload = this.uploadService.uploadFiles(dataItem.imagesItem, basePath);
      Observable.concat(sourceUpload)
      .flatMap((response) => {
        return Observable.fromPromise(this.imagesCollectionRef.doc(uuidItem).set(
          {
            pathOfImages: response.listOfUrlsImages,
            pathOfBucket: response.pathOfBucket,
          })).map((item) => { return { profileItem: _.last(response.listOfUrlsImages) }; });
      })
      .flatMap((response: any) => {
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

  /**
   * Get the data of item.
   */
  getItem(uuidItem: string): Observable<DetailsItem> {
    let itemDetails: DetailsItem;
    return new Observable((observer) => {
      const sourceItem = Observable.zip(
        this.itemCollectionRef.doc(uuidItem).valueChanges(),
        this.imagesCollectionRef.doc(uuidItem).valueChanges(),
      );
      sourceItem.subscribe(
        (response: any) => {
          itemDetails = {
            name: response[0].name,
            about: response[0].about,
            price: response[0].price,
            imagesItem: response[1].pathOfImages,
            timestamp: response[0].timestamp,
            uuid: response[0].uuid,
          };
          observer.next(itemDetails);
          observer.complete();
        },
        (error) => observer.error(error),
      )
    });
  }

  getImagesFromURL (url) {
    const storageRef = firebase.storage().ref();
  }

  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


}
