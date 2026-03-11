import {
  getAuth,
  signInWithRedirect,
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

export async function login() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log({ user });
      const extraInfo = getAdditionalUserInfo(result);
      console.log({ extraInfo });
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
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
  console.log("logout");
}

export function checkLoginState(setUser) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log({ user });
      setUser(user);
    } else {
      console.log("Sign out");
    }
  });
}
