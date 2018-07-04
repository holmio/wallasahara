import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Observable } from "rxjs/Observable";
import * as _ from 'lodash';

@Injectable()
export class UploadService {

  /**
   * Upload files in the data base and the storage
   * @param filesToUpload Array of the files to upload
   * @param pathRoute Route of the storage
   */
  uploadFiles(filesToUpload: Array<string>, pathRoute: string): Observable<any> {
    return new Observable<any>((observer) => {
      const urlOfImages: Array<string> = [];
      const basePathList: Array<string> = [];
      if (filesToUpload.length !== 0) {
        filesToUpload.forEach((element) => {
          const basePath: string = `${pathRoute}/${new Date().getTime()}.jpg`;
          basePathList.push(basePath);
          this.uploadFileString(basePath, element).subscribe(
            (response) => {
              urlOfImages.push(response.urlOfImage);
            },
            error => console.log(error),
            () => {
              // Need to complete the array and finish the observable
              if (filesToUpload.length === urlOfImages.length) {
                observer.next({
                  listOfUrlsImages: urlOfImages,
                  pathOfBucket: _.reverse(basePathList)
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
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(path).putString(file, 'data_url');
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
    const storageRef = firebase.storage().ref();
    return await storageRef.child(path).delete();
  }


}
