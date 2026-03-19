import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import type { Dispatch, SetStateAction } from "react";
import { getUserByCode } from "./firebase";

const provider = new GoogleAuthProvider();
export const auth = getAuth();
setPersistence(auth, browserLocalPersistence);

export async function login(
  setUser: Dispatch<SetStateAction<User | null | false>>,
): Promise<void> {
  try {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  } catch (error) {
    console.error(error);
  }
}

export async function logout(
  setUser: Dispatch<SetStateAction<User | null | false>>,
): Promise<void> {
  try {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
  } catch (error) {
    console.error(error);
  }
}

const TelegramBotUrl = "https://t.me/CryptoPortfolioNotificationsBot";

export function loginWithTelegram(): boolean {
  window.open(TelegramBotUrl, "_blank");
  return true;
}

export async function verifyTelegramCode(
  code: string,
): Promise<{ username: string; userId: number }> {
  const user = await getUserByCode(code);
  if (!user) {
    throw new Error("Invalid code. Please try again.");
  }
  return user as { username: string; userId: number };
}

export function checkLoginState(): Promise<User | null> {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user ?? null);
    });
  });
}
