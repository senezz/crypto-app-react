// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { message } from "antd";
import {
  getFirestore,
  collection,
  setDoc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import type { Asset, Transaction } from "./types/types";
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

function reportFirestoreError(userMessage: string, e: unknown): void {
  console.error(userMessage, e);
  message.error(userMessage);
}

export async function createPortfolio(portfolioId: string): Promise<void> {
  try {
    await setDoc(doc(db, "portfolios", portfolioId), {
      assets: [],
    });
  } catch (e) {
    reportFirestoreError("Failed to create your portfolio", e);
  }
}

export async function getPortfolio(portfolioId: string): Promise<Asset[]> {
  try {
    const portfolio = await getDoc(doc(db, "portfolios", portfolioId));
    if (portfolio.exists()) {
      return portfolio.data().assets;
    } else {
      await createPortfolio(portfolioId);
    }
  } catch (e) {
    reportFirestoreError("Failed to load your portfolio", e);
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
    reportFirestoreError("Failed to save portfolio changes", e);
  }
}

export async function getTelegramUsername(uid: string): Promise<string | null> {
  try {
    const snapshot = await getDoc(doc(db, "portfolios", uid));
    if (snapshot.exists()) {
      return snapshot.data().telegramLink?.username ?? null;
    }
  } catch (e) {
    reportFirestoreError("Failed to load Telegram link status", e);
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
    reportFirestoreError("Failed to save Telegram link", e);
  }
}

export async function addTransaction(
  uid: string,
  transaction: Omit<Transaction, "id">,
): Promise<void> {
  try {
    await addDoc(
      collection(db, "portfolios", uid, "transactions"),
      transaction,
    );
  } catch (e) {
    reportFirestoreError("Failed to save transaction to history", e);
  }
}

export async function getTransactions(uid: string): Promise<Transaction[]> {
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "portfolios", uid, "transactions"),
        orderBy("date", "desc"),
      ),
    );
    return snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as Transaction,
    );
  } catch (e) {
    reportFirestoreError("Failed to load transaction history", e);
  }
  return [];
}

export async function getUserByCode(code: string) {
  const snapshot = await getDocs(
    query(collection(db, "tg-codes"), where("code", "==", Number(code))),
  );
  return snapshot.docs[0]?.data();
}

// export async function deleteFirstUser() {
//   const firstUser = await getFirstUser();
//   await deleteDoc(firstUser);
// }
