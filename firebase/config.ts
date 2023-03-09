// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_eIpMuTWuUAI_L8pdQ0GHpJAzRFwMGbc",
  authDomain: "kanban-9a84a.firebaseapp.com",
  databaseURL:
    "https://kanban-9a84a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kanban-9a84a",
  storageBucket: "kanban-9a84a.appspot.com",
  messagingSenderId: "249316716060",
  appId: "1:249316716060:web:616ab7eff7a46a958179d9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore();
