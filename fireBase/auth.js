import { auth , db } from "./Config";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signInWithCredential,
  FacebookAuthProvider,
  sendEmailVerification,
  signOut
} from "firebase/auth";
import {
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  collection,

} from "firebase/firestore";

// Listen for authentication state to change.
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("We are authenticated now!");
  }
});

async function register(email, password, name) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create a user document in Firestore
    const userDocRef = doc(db, 'users', cred.user.uid);

    await setDoc(userDocRef, {
      email: email,
      name: name,
      cart: [] 
    });

    console.log('User registered successfully:', cred.user.uid);
    return cred; 
  } catch (error) {
    console.error('Error registering user:', error);
    throw error; 
  }
}
async function login(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

async function sendVerificationEmail() {
  try {
    await sendEmailVerification(auth.currentUser, {
      handleCodeInApp: true,
      url: "http://project-398ae.firebaseapp.com/",
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}

async function logout() {
  await signOut(auth);
}

async function resetPass(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}

export { register, login, logout, resetPass, sendVerificationEmail };
