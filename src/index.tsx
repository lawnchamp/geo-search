import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/app';
import 'firebase/firestore';
import * as geofirestore from 'geofirestore';

import App from './App';

const firebaseConfig = {
  apiKey: 'AIzaSyB4RR0UEZLUcl8Ot6QUm90hGKWvqjXvz8M',
  authDomain: 'geo-search-fb258.firebaseapp.com',
  databaseURL: 'https://geo-search-fb258.firebaseio.com',
  projectId: 'geo-search-fb258',
  storageBucket: 'geo-search-fb258.appspot.com',
  messagingSenderId: '121481666928',
  appId: '1:121481666928:web:a63b5e5ff8512c69bbefb5',
};
export const app = firebase.initializeApp(firebaseConfig);
export const firestore = app.firestore();
export const GeoFirestore = geofirestore.initializeApp(firestore);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
