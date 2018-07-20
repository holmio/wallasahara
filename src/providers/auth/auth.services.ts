import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { Observable } from "rxjs/Observable";
import { UserDetail } from '../../models/user.entities';
import { UsersService } from '../users/users.services';

@Injectable()
export class AuthService {
  private user: firebase.User;

	constructor(
    public afAuth: AngularFireAuth,
    private userService: UsersService,
  ) {
		afAuth.authState.subscribe(user => {
			this.user = user;
    });
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

	signInWithEmail(credentials) {
    return new Observable<any>((observer: any) => {
      const sourceLoginUser = this.afAuth.auth.signInWithEmailAndPassword(credentials.email,credentials.password);
      Observable.concat(sourceLoginUser)
      .flatMap((response) => {
        return this.userService.getUserInformationFireStore(response.uid);
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
      .flatMap((response) => {
        userInformation = {
          firsName: credentials.firsName,
          lastName: null,
          uuid: response.uid,
          lastSignInTime: response.metadata.lastSignInTime,
          photoURL: response.photoURL || './assets/img/speakers/bear.jpg',
          email: response.email,
        }
        return this.userService.updateUserData(userInformation);
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


	getEmail() {
		return this.user && this.user.email;
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
      const sourceFacebook = this.oauthSignIn(new firebase.auth.FacebookAuthProvider());
      Observable.concat(sourceFacebook)
      .flatMap((response) => {
        userInformation = {
          firsName: response.additionalUserInfo.profile.first_name,
          lastName: response.additionalUserInfo.profile.last_name,
          uuid: response.user.uid,
          lastSignInTime: response.user.metadata.lastSignInTime,
          photoURL: response.user.photoURL,
          email: response.user.email,
        }
        // If it is a new user we register in the date base
        if (response.additionalUserInfo.isNewUser) {
          return this.userService.updateUserData(userInformation);
        }
        return Observable.empty();
      }).subscribe(
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
    })
  }

	private oauthSignIn(provider: AuthProvider): Observable<any> {
		return Observable.fromPromise(this.afAuth.auth.signInWithPopup(provider));
	}

}
