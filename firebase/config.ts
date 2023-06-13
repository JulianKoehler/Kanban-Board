// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfigDEV = {
  apiKey: "AIzaSyC_eIpMuTWuUAI_L8pdQ0GHpJAzRFwMGbc",
  authDomain: "kanban-9a84a.firebaseapp.com",
  databaseURL:
    "https://kanban-9a84a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kanban-9a84a",
  storageBucket: "kanban-9a84a.appspot.com",
  messagingSenderId: "249316716060",
  appId: "1:249316716060:web:616ab7eff7a46a958179d9",
};

const firebaseConfigPROD = {
  apiKey: "AIzaSyC5GKvSDpzAyaRfD3G2Gdy97Fcw3rbylbk",
  authDomain: "kanban-production-ad3b8.firebaseapp.com",
  projectId: "kanban-production-ad3b8",
  storageBucket: "kanban-production-ad3b8.appspot.com",
  messagingSenderId: "752447435872",
  appId: "1:752447435872:web:475042336cbace6294ff05",
  measurementId: "G-2VHN7CXXGM",
};

// Optimization
const app = !getApps.length ? initializeApp(firebaseConfigDEV) : getApp();

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db, app };
