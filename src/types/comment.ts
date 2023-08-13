import type { Timestamp } from 'firebase/firestore';

export interface CommentModel {
  id: string;
  message: string;
  username: string;
  userid: string;
  time: Timestamp;
}
