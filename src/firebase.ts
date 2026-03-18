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
  query,
  where,
} from "firebase/firestore";
import type { Asset } from "./types/types";
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

export async function createPortfolio(portfolioId: string): Promise<void> {
  try {
    await setDoc(doc(db, "portfolios", portfolioId), {
      assets: [],
    });
    // console.log("Document written with ID: ");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function getPortfolio(portfolioId: string): Promise<Asset[]> {
  try {
    const portfolio = await getDoc(doc(db, "portfolios", portfolioId));
    if (portfolio.exists()) {
      console.log("Document data:", portfolio.data());
      return portfolio.data().assets;
    } else {
      console.log("No such document!");
      await createPortfolio(portfolioId);
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export async function updatePortfolio(
  portfolioId: string,
  assets: Asset[],
): Promise<void> {
  try {
    const portfolio = doc(db, "portfolios", portfolioId);
    await updateDoc(portfolio, { assets });
  } catch (e) {
    console.error(e);
  }
}

export async function getTelegramUsername(uid: string): Promise<string | null> {
  try {
    const snapshot = await getDoc(doc(db, "portfolios", uid));
    if (snapshot.exists()) {
      return snapshot.data().telegramLink.username ?? null;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

export async function saveTelegramUsername(
  uid: string,
  username: string,
  chatId: number,
): Promise<void> {
  try {
    const ref = doc(db, "portfolios", uid);
    const telegramLink = {
      username,
      chatId,
    };
    await updateDoc(ref, { telegramLink });
  } catch (e) {
    console.error(e);
  }
}

export async function getUserByCode(code: string) {
  console.log(code);
  try {
    const snapshot = await getDocs(
      query(collection(db, "tg-codes"), where("code", "==", Number(code))),
    );
    return snapshot.docs[0].data();
  } catch (e) {
    console.error(e);
  }
}

// export async function deleteFirstUser() {
//   const firstUser = await getFirstUser();
//   await deleteDoc(firstUser);
// }
