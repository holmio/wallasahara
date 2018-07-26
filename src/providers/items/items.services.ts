import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from "rxjs/Observable";
import { CreateItem, ItemImage, UpdateItem, DetailsItem, ItemList } from '../../models/item.entities';
import { UploadService } from '../upload/upload.services';
import * as _ from 'lodash';
import { Subject, BehaviorSubject } from 'rxjs';
import { combineLatest, switchMap } from 'rxjs/operators';
import { PaginationService } from '../pagination/pagination.services';
import { DeleteFileService } from '../delete-file/delete-file.services';
import { AuthService } from '../auth/auth.services';
import { UserDetail, ItemOfUser } from '../../models/user.entities';
import { UsersService } from '../users/users.services';

/**
 * Service with the necessary elements to add, update and delete a Item
 */

@Injectable()
export class ItemsService {
  private itemCollectionRef: AngularFirestoreCollection<any>;
  private imagesCollectionRef: AngularFirestoreCollection<ItemImage>;
  private userCollectionRef: AngularFirestoreCollection<any>;
  // private items$: Observable<ItemList[]>;
  // private priceFilter$: BehaviorSubject<string|null>;
  // private nameFilter$: BehaviorSubject<string|null>;
	constructor(
    private afStore: AngularFirestore,
    private uploadService: UploadService,
    private paginationService: PaginationService,
    private deleteService: DeleteFileService,
    private authService: AuthService,
    private userService: UsersService,
  ) {
    this.itemCollectionRef = afStore.collection<any>('items');
    this.imagesCollectionRef = afStore.collection<ItemImage>('galleryItems');
    this.userCollectionRef = this.afStore.collection<UserDetail>('users');
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
    // Set the time of creation
    dataItem.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    dataItem.uuid = uuidItem;
    dataItem.uuidUser = this.authService.getUuid;
    dataItem.isEnabled = true;
    dataItem.isSold = false;
    return new Observable<any>((observer: any) => {
      const sourceUpload = this.uploadService.uploadFiles(dataItem.imagesItem, basePath);
      Observable.concat(sourceUpload)
      .concatMap((response) => {
        return Observable.fromPromise(this.imagesCollectionRef.doc(uuidItem).set(
          {
            pathOfImages: response.listOfUrlsImages,
            pathOfBucket: response.pathOfBucket,
          })).map((item) => { return { profileItem: _.head(response.listOfUrlsImages) }; });
      })
      .concatMap((response) => {
        dataItem.profileItem = response.profileItem;
        delete dataItem.imagesItem;
        return this.itemCollectionRef.doc(uuidItem).set(dataItem)
      })
      .concatMap(() => {
        return this.userService.getUserInformationStorage();
      })
      .concatMap((response) => {
        const dataUserStorage = response;
        const infoItemToUser: ItemOfUser = {
          uuid: dataItem.uuid,
          isSold: dataItem.isSold,
          price: dataItem.price,
          profileItem: dataItem.profileItem,
          currency: dataItem.currency,
        }
        dataUserStorage.listOfItems.push(infoItemToUser);
        this.userService.setUserInformationStorage(dataUserStorage);
        return this.userCollectionRef.doc(dataUserStorage.uuid).update({
          listOfItems: dataUserStorage.listOfItems
        })
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
   * Delete an item and the collections of the item
   * @param itemDetails object with item data
   * @returns No return any data
   */
  deleteItem(itemDetails: DetailsItem): Observable<any> {
    return new Observable<any>((observer: any) => {
      const sourceItemToDelete = this.deleteService.deleteFiles(itemDetails.imagesPathDirectory);
      Observable.concat(sourceItemToDelete)
      this.deleteService.deleteFiles(itemDetails.imagesPathDirectory)
      .concatMap(() => {
        return this.itemCollectionRef.doc(itemDetails.uuid).delete()
      })
      .concatMap(() => {
        return this.imagesCollectionRef.doc(itemDetails.uuid).delete()
      })
      .concatMap(() => {
        return this.userService.getUserInformationStorage();
      })
      .concatMap((response) => {
        const dataUserStorage = response;
        dataUserStorage.listOfItems.splice(_.indexOf(dataUserStorage.listOfItems, itemDetails.uuid), 1);
        this.userService.setUserInformationStorage(dataUserStorage);
        return this.userCollectionRef.doc(dataUserStorage.uuid).update({
          listOfItems: dataUserStorage.listOfItems
        })
      })
      .subscribe(
        () => {
          observer.next();
          observer.complete();
        },
        (error) => {
          observer.error(error);
        },
      );

    });
  }

  /**
   * Get the list of items.
   */
  getListOfItemsByFilter(filter: any = {}) {

    console.log(filter);
    // this.items$ = Observable.combineLatest(
    //   this.priceFilter$,
    //   this.nameFilter$
    // ).switchMap(([size, color]) =>
    //   this.afStore.collection<ItemList>('items', ref => {
    //     let query: any;
    //     if (filter.price) { query = query.where('price', '==', filter.price) };
    //     if (filter.name) { query = query.where('name', '==', filter.name) };
    //     return query;
    //   }).valueChanges()
    // );
    // return this.items$;
    // const queryObservable = size$.pipe(
    //   switchMap(size =>
    //     this.afStore.collection('items', ref => ref.where('size', '==', size)).valueChanges()
    //   )
    // );

    return this.afStore.collection('items', (ref: any) => {
      let query: any = ref;
      if (filter.price) { query = query.where('price', '>=', filter.price) };
      if (filter.name) { query = query.where('name', '==', '%'+filter.name+'%') };
      return query
    }).valueChanges();
  }

  /**
   * Get the list of items.
   */
  getListOfItems(limit: number, last: string) {
    return this.paginationService.init('items', 'timestamp');
    // return this.afStore.collection('items', ref => (
    //   ref
    //     .where('id', '<', last)
    //     .orderBy('id', 'desc')
    //     .limit(limit)
    //  )).snapshotChanges();
  }

  /**
   * Get the data of item.
   * @param uuidItem uuid of item
   * @returns itemDetails
   */
  getItemByUuid(uuidItem: string): Observable<DetailsItem> {
    let itemDetails: DetailsItem;
    return new Observable((observer) => {
      const sourceItem = Observable.zip(
        this.itemCollectionRef.doc(uuidItem).valueChanges(),
        this.imagesCollectionRef.doc(uuidItem).valueChanges(),
      );
      sourceItem.subscribe(
        (response: any) => {
          if(response[0] !== null || response[1] !== null) {
            itemDetails = {
              name: response[0].name,
              about: response[0].about,
              price: response[0].price,
              imagesItem: response[1].pathOfImages,
              imagesPathDirectory: response[1].pathOfBucket,
              timestamp: response[0].timestamp,
              currency: response[0].currency,
              uuid: response[0].uuid,
            };
            observer.next(itemDetails);
            observer.complete();
          }
        },
        (error) => observer.error(error),
      )
    });
  }

  /**
   * Method to generate Unique Key
   */
  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


}
