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
  id_chapter: number,
  callback: (comment: CommentModel[]) => void
) => {
  const col = collection(db, 'leitor', id_chapter.toString(), 'comments');

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
  id_chapter: number,
  comment: Omit<CommentModel, 'id' | 'time'>
) => {
  const col = collection(db, 'leitor', id_chapter.toString(), 'comments');

  await addDoc(col, {
    ...comment,
    time: Timestamp.now(),
  } as Omit<CommentModel, 'id'>);
};

export const deleteComment = async (id_chapter: number, id_comment: string) => {
  const refDoc = doc(
    db,
    'leitor',
    id_chapter.toString(),
    'comments',
    id_comment.toString()
  );
  await deleteDoc(refDoc);
};
