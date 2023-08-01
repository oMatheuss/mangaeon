import { atom, useAtom } from 'jotai';
import { app } from './firebase';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const auth = getAuth(app);

export const userAtom = atom<User | null>(null);
userAtom.debugLabel = 'User';

userAtom.onMount = (setAtom) => {
  console.log('atom is mounted in provider');
  let unsub = onAuthStateChanged(auth, (user) => {
    setAtom(user);
  });
  return unsub;
};

export const useUser = () => {
  return useAtom(userAtom);
};
