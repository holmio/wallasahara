import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Observable } from "rxjs/Observable";


@Injectable()
export class DeleteFileService {

  deleteFiles(pathList: any) {
    return new Observable ((observer) =>{
      pathList.forEach((path, index) => {
          this.fileToDelete(path).then(() =>{
            if (pathList.length === index + 1){
              observer.next(true);
              observer.complete();
            }
            return true;
            // File deleted successfully
          }).catch((error) => {
            // Uh-oh, an error occurred!
            console.log(error);
          });
      });
    })
  }

  /**
   * Delete image from firebase storage is take a string path of the image
   * @param path
   */
  fileToDelete(path: string) {

    // first delete the image
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(path);
    return fileRef.delete()

  }

}
