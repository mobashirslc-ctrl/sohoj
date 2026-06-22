// app/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ডাটাবেসের জন্য
import { getStorage } from "firebase/storage";      // ছবির জন্য

const firebaseConfig = {
  apiKey: "AIzaSyDl_PNINm4FXlfahMxH7EqloMrB1Xs34jQ",
  authDomain: "sohoj-d016c.firebaseapp.com",
  projectId: "sohoj-d016c",
  storageBucket: "sohoj-d016c.firebasestorage.app",
  messagingSenderId: "74401301062",
  appId: "1:74401301062:web:306dd7bdd8a827d4ee8047",
  measurementId: "G-5W5LC3BME7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// এগুলো এক্সপোর্ট করুন যাতে অন্য ফাইলে ব্যবহার করতে পারেন
export const db = getFirestore(app);
export const storage = getStorage(app);