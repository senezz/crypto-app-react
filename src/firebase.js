// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxQF7sueKooLMk25WA9Gw9iq576UvF5YI",
  authDomain: "crypto-react-app-1a792.firebaseapp.com",
  projectId: "crypto-react-app-1a792",
  storageBucket: "crypto-react-app-1a792.firebasestorage.app",
  messagingSenderId: "1051641990765",
  appId: "1:1051641990765:web:aef8af50ed274dc8a5b964",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function createUser() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getAllUsers() {
  const users = {};
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    users[doc.id] = doc.data();
  });
  return users;
}

export async function getFirstUser() {
  const snapshot = await getDocs(collection(db, "users"));
  const users = snapshot.docs;
  const firstUser = users[0].ref;
  console.log({ firstUser, users });
  return firstUser;
}

export async function updateFirstUser() {
  // const firstUser = doc(collection(db, "users", users[0].id));
  const firstUser = await getFirstUser();
  await updateDoc(firstUser, {
    born: 2006,
  });
}

export async function deleteFirstUser() {
  const firstUser = await getFirstUser();
  await deleteDoc(firstUser);
}
