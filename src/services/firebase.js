import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from 'config/firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const firebaseAppAuth = firebaseApp.auth();
export const providers = {
	googleProvider: new firebase.auth.GoogleAuthProvider(),
	facebookProvider: new firebase.auth.FacebookAuthProvider(),
	emailProvider: new firebase.auth.EmailAuthProvider()
};
