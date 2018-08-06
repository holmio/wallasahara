import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;


import { Observable } from "rxjs/Observable";

import { UserDetail } from '../../models/user.entities';

@Injectable()
export class AuthService {
  private user: firebase.User;
  private userCollectionRef: AngularFirestoreCollection<any>;

	constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private facebook: Facebook,
    private platform: Platform
  ) {
    this.userCollectionRef = this.afStore.collection<UserDetail>('users');
		this.afAuth.authState.subscribe(user => {
			this.user = user;
    });
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  get getEmail() {
		return this.user && this.user.email;
  }

  get getUuid() {
		return this.user && this.user.uid;
	}

	signInWithEmail(credentials) {
    return new Observable<any>((observer: any) => {
      const sourceLoginUser = this.afAuth.auth.signInWithEmailAndPassword(credentials.email,credentials.password);
      Observable.concat(sourceLoginUser)
      .concatMap((response) => {
        return this.userCollectionRef.doc(response.uid).valueChanges();
      })
      .subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        }, (error) => {
          observer.error(error);
        }
      );
    });
  }

	signUp(credentials): Observable<any> {
    return new Observable<any>((observer: any) => {
      let userInformation: UserDetail;
      const sourceCreateUser = this.afAuth.auth.createUserWithEmailAndPassword(credentials.email,credentials.password);
      Observable.concat(sourceCreateUser)
      .concatMap((response) => {
        userInformation = {
          uuid: response.uid,
          firstName: credentials.firstName,
          lastName: null,
          lastSignInTime: response.metadata.lastSignInTime,
          providerUserInfo: 'email',
          pictureURL: {
            pathOfImage: response.photoURL || './assets/img/speakers/bear.jpg',
            pathOfBucket: '',
          },
          email: response.email,
          listOfItems: [],
        }
        return Observable.fromPromise(this.userCollectionRef.doc(response.uid).set(userInformation));
      })
      .subscribe(
        (response) => {
          // Nothing todo
        }, (error) => {
          observer.error(error);
        },
        () => {
          observer.next(userInformation);
          observer.complete();
        }
      );
    });
	}

	signOut(): Promise<void> {
		return this.afAuth.auth.signOut();
	}

	signInWithGoogle() {
		console.log('Sign in with google');
		return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
  }

  signInWithFacebook(): Observable<UserDetail> {
    console.log('Sign in with facebook');
    return new Observable<any>((observer: any) => {
      let userInformation: UserDetail;
      if (this.platform.is('cordova')) {
        const sourceFacebook = this.facebook.login(['email', 'public_profile'])
        Observable.concat(sourceFacebook)
        .concatMap((response) => {
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
          return this.afAuth.auth.signInAndRetrieveDataWithCredential(facebookCredential)
        })
        .concatMap((response) => {
          // If it is a new user we register in the date base
          if (response.additionalUserInfo.isNewUser) {
            userInformation = {
              uuid: response.user.uid,
              firstName: response.additionalUserInfo.profile.first_name,
              lastName: response.additionalUserInfo.profile.last_name,
              lastSignInTime: response.user.metadata.lastSignInTime,
              pictureURL: {
                pathOfImage: response.user.photoURL,
                pathOfBucket: '',
              },
              providerUserInfo: 'facebook',
              email: response.user.email,
              listOfItems: [],
            }
            return Observable.fromPromise(this.userCollectionRef.doc(response.user.uid).set(userInformation));
          }
          // Return data of user
          return this.userCollectionRef.doc(response.user.uid).valueChanges() as any;
        })
        .take(1)
        .subscribe(
          (response: any) => {
            if (response) userInformation = response;
          }, (error) => {
            observer.error(error);
          },
          () => {
            observer.next(userInformation);
            observer.complete();
          }
        );
      } else {
        const sourceFacebook = this.oauthSignIn(new firebase.auth.FacebookAuthProvider());
        Observable.concat(sourceFacebook)
        .concatMap((response) => {
          // If it is a new user we register in the date base
          if (response.additionalUserInfo.isNewUser) {
            userInformation = {
              uuid: response.user.uid,
              firstName: response.additionalUserInfo.profile.first_name,
              lastName: response.additionalUserInfo.profile.last_name,
              lastSignInTime: response.user.metadata.lastSignInTime,
              providerUserInfo: 'facebook',
              pictureURL: {
                pathOfImage: response.user.photoURL,
                pathOfBucket: '',
              },
              email: response.user.email,
              listOfItems: [],
            }
            return Observable.fromPromise(this.userCollectionRef.doc(response.user.uid).set(userInformation));
          }
          // Return data of user
          return this.userCollectionRef.doc(response.user.uid).valueChanges() as any;
        })
        .take(1)
        .subscribe(
          (response: any) => {
            if (response) userInformation = response;
          }, (error) => {
            observer.error(error);
          },
          () => {
            observer.next(userInformation);
            observer.complete();
          }
        );
      }
    })
  }

	private oauthSignIn(provider: AuthProvider): Observable<any> {
		return Observable.fromPromise(this.afAuth.auth.signInWithPopup(provider));
	}

}
