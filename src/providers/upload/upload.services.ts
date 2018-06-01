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

  /**
   * Upload files in the data base and the storage
   * @param filesToUpload Array of the files to upload
   * @param pathRoute Route of the storage
   */
  uploadFiles(filesToUpload: Array<string>, pathRoute: string): Observable<any> {
    return new Observable<any>((observer) => {
      let urlOfImages: Array<string> = [];
      if (filesToUpload.length !== 0) {
        filesToUpload.forEach((element, index) => {
          let basePath: string = `${pathRoute}/${new Date().getTime()}.jpg`;
          this.uploadFileString(basePath, element).subscribe(
            (response) => {
              urlOfImages.push(response.urlOfImage);
            },
            error => console.log(error),
            () => {
              if (filesToUpload.length === index + 1) {
                observer.next({
                  listOfUrlsImages: urlOfImages,
                  pathOfBucket: basePath
                })
                observer.complete();
              }
            }
          );
        });
      }
    })
  }

  /**
   * Upload the files one by one
   * @param path path of the file
   * @param file base64 of file
   */
  private uploadFileString(path:string, file:string) {
    return new Observable<any>((observer) => {
      let storageRef = firebase.storage().ref();
      let uploadTask = storageRef.child(path).putString(file, 'data_url');
      uploadTask.then(
        data => {
          observer.next({urlOfImage: uploadTask.snapshot.downloadURL})
          observer.complete();
        },
        error => observer.error(error),
      )
    })
  }

  private async deleteFile(path:string){
    let storageRef = firebase.storage().ref();
    return await storageRef.child(path).delete();
  }


}
