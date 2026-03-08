// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
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

export async function createPortfolio(portfolioId) {
  try {
    await setDoc(doc(db, "portfolios", portfolioId), {
      assets: [],
    });
    console.log("Document written with ID: ");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// export async function getAllUsers() {
//   const users = {};
//   const querySnapshot = await getDocs(collection(db, "portfolios"));
//   querySnapshot.forEach((doc) => {
//     console.log(`${doc.id} => ${doc.data()}`);
//     users[doc.id] = doc.data();
//   });
//   return users;
// }

export async function getPortfolio(portfolioId) {
  const portfolio = await getDoc(doc(db, "portfolios", portfolioId));
  if (portfolio.exists()) {
    console.log("Document data:", portfolio.data());
  } else {
    console.log("No such document!");
  }
  return portfolio.data().assets;
}

export async function updatePortfolio(portfolioId, assets) {
  const portfolio = doc(db, "portfolios", portfolioId);
  await updateDoc(portfolio, { assets });
}

// export async function deleteFirstUser() {
//   const firstUser = await getFirstUser();
//   await deleteDoc(firstUser);
// }
