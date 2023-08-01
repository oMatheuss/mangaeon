import { app } from './firebase';
import { getAuth } from 'firebase/auth';

export const auth = getAuth(app);

export { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
