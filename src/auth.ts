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
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      setUser(user);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(errorCode, errorMessage);
      // ...
    });
}

export async function logout(
  setUser: Dispatch<SetStateAction<User | null | false>>,
): Promise<void> {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      setUser(null);
    })
    .catch((error) => {});
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
