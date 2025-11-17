import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCHSFsdW1O3j0D3nbrKL5GMrN7WmZAv2tE",
  authDomain: "ezbuy-bb95b.firebaseapp.com",
  projectId: "ezbuy-bb95b",
  storageBucket: "ezbuy-bb95b.firebasestorage.app",
  messagingSenderId: "215213288268",
  appId: "1:215213288268:web:54b4d1bcef364023e87de9",
  measurementId: "G-2ZDDDENMWB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);