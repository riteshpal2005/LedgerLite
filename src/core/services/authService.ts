import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In with the Web Client ID from .env
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

/**
 * Authentication Service Wrapper
 * Handles interactions with Firebase Auth using the persist-enabled Auth instance.
 */
export const AuthService = {
  /**
   * Register a new user with Email and Password
   */
  async registerWithEmail(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  /**
   * Sign in an existing user with Email and Password
   */
  async signInWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  /**
   * Log out the current user
   */
  async logout() {
    try {
      await signOut(auth);
      // Also sign out of Google to allow picking a different account next time
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Ignore Google sign-out errors if they weren't logged in via Google
      }
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  /**
   * Sign in with Google (OAuth)
   */
  async signInWithGoogle() {
    try {
      // 1. Check if device supports Google Play
      await GoogleSignin.hasPlayServices();
      // 2. Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found');
      }

      // 3. Create a Firebase credential with the token
      const { GoogleAuthProvider, signInWithCredential } = await import('firebase/auth');
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // 4. Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },
};
