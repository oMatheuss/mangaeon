import { getFirestore } from 'firebase/firestore';
import { app } from './firebase';

export const db = getFirestore(app);

export {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
