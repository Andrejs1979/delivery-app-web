import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from 'config/firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const firebaseAppAuth = firebaseApp.auth();

export const providers = {
	phoneProvider: new firebase.auth.PhoneAuthProvider()
};
