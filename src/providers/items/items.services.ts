import { Injectable } from '@angular/core';

// Firebase
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

// Rxjs
import { Observable } from "rxjs/Observable";

// Services
import { UploadService } from '../upload/upload.services';
import { DeleteFileService } from '../delete-file/delete-file.services';
import { AuthService } from '../auth/auth.services';
import { UsersService } from '../users/users.services';

// Entities
import { CreateItem, ItemImage, UpdateItem, DetailsItem } from '../../models/item.entities';
import { UserDetail, ItemOfUser } from '../../models/user.entities';

// Lodash
import * as _ from 'lodash';

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
    // Init default params
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
        return this.userService.getUserInformationFireStore(dataItem.uuidUser).take(1);
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
        dataUserStorage.listOfItems.splice(_.findIndex(dataUserStorage.listOfItems, (o) => { return o.uuid === itemDetails.uuid; }), 1);
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
  // getListOfItems(limit: number, last: string) {
  //   return this.paginationService.init('items', 'timestamp');
  //   return this.afStore.collection('items', ref => (
  //     ref
  //       .where('id', '<', last)
  //       .orderBy('id', 'desc')
  //       .limit(limit)
  //    )).snapshotChanges();
  // }

  /**
   * Get the data of item.
   * @param uuidItem uuid of item
   * @returns itemDetails
   */
  getItemByUuid(uuidItem: string): Observable<DetailsItem> {
    let itemDetails: any;
    return new Observable((observer) => {
      this.itemCollectionRef.doc(uuidItem).valueChanges()
      .take(1)
      .concatMap((response:any) => {
        itemDetails = {
          name: response.name,
          about: response.about,
          wilaya: response.wilaya,
          price: response.price,
          timestamp: response.timestamp,
          currency: response.currency,
          uuid: response.uuid,
        };
        return this.imagesCollectionRef.doc(uuidItem).valueChanges().take(1)
      }).subscribe(
        (response:any) => {
            itemDetails.imagesItem = response.pathOfImages;
            itemDetails.imagesPathDirectory = response.pathOfBucket;
            observer.next(itemDetails);
            observer.complete();
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
