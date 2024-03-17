import { getApp,getApps,initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth,initializeAuth,getReactNativePersistence } from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
apiKey: "AIzaSyA0mc3IR1nLZYJYtbJK6HV6QEbVloEhHg0",
  authDomain: "best-chat-app-ba9d9.firebaseapp.com",
  projectId: "best-chat-app-ba9d9",
  storageBucket: "best-chat-app-ba9d9.appspot.com",
  messagingSenderId: "593505437949",
  appId: "1:593505437949:web:ed0d0e35dd1280890e1694",
  measurementId: "G-HCQLK0QTCK"
};
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const firestoreDB = getFirestore(app);
const firebaseAuth = getAuth(app);

export { app,auth, firebaseAuth, firestoreDB }