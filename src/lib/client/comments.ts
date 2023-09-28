import {
  db,
  collection,
  onSnapshot,
  Timestamp,
  addDoc,
  deleteDoc,
  doc,
} from '@/lib/client/firestore';
import { CommentModel } from '@/types/comment';

export const listenComments = (
  chapterId: string,
  callback: (comment: CommentModel[]) => void
) => {
  const col = collection(db, 'leitor', chapterId, 'comments');

  let first = true;
  const allComments: CommentModel[] = [];

  return onSnapshot(col, (snapshot) => {
    if (first) {
      snapshot.forEach((doc) => {
        const comment = {
          id: doc.id,
          ...doc.data(),
        } as CommentModel;

        allComments.push(comment);
      });

      first = false;
      callback(allComments);
    } else {
      const changes = snapshot.docChanges();

      // iterate on all chages that happened
      for (const docChange of changes) {
        if (docChange.type === 'added') {
          allComments.push({
            id: docChange.doc.id,
            ...docChange.doc.data(),
          } as CommentModel);
        } else if (docChange.type === 'modified') {
          const oldIdx = allComments.findIndex(
            (x) => x.id === docChange.doc.id
          );
          allComments[oldIdx] = {
            id: docChange.doc.id,
            ...docChange.doc.data(),
          } as CommentModel;
        } else {
          const oldIdx = allComments.findIndex(
            (x) => x.id === docChange.doc.id
          );
          allComments.splice(oldIdx, 1);
        }
      }

      callback([...allComments]);
    }
  });
};

export const postComment = async (
  chapterId: string,
  comment: Omit<CommentModel, 'id' | 'time'>
) => {
  const col = collection(db, 'leitor', chapterId, 'comments');

  await addDoc(col, {
    ...comment,
    time: Timestamp.now(),
  } as Omit<CommentModel, 'id'>);
};

export const deleteComment = async (chapterId: string, commentId: string) => {
  const refDoc = doc(db, 'leitor', chapterId, 'comments', commentId);
  await deleteDoc(refDoc);
};
