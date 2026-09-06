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
import { message } from "antd";
import { verifyCode } from "./firebase";

function reportAuthError(userMessage: string, e: unknown): void {
  console.error(userMessage, e);
  message.error(userMessage);
}

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
    reportAuthError("Failed to sign in with Google", error);
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
    reportAuthError("Failed to sign out", error);
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
  try {
    return await verifyCode(code);
  } catch (e) {
    const err = e as { code?: string };
    if (err.code === "functions/deadline-exceeded") {
      throw new Error("Code has expired. Please request a new one.");
    }
    throw new Error("Invalid code. Please try again.");
  }
}

export function checkLoginState(): Promise<User | null> {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user ?? null);
    });
  });
}
