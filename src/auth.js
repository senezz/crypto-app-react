import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const provider = new GoogleAuthProvider();
export const auth = getAuth();
setPersistence(auth, browserLocalPersistence);

export async function login(setUser) {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
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

export async function logout(setUser) {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      setUser(null);
    })
    .catch((error) => {});
}

export async function loginWithTelegram() {
  throw new Error("Telegram auth not implemented");
}

export function checkLoginState() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user ?? null);
    });
  });
}
