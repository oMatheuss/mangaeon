'use client';

import {
  deleteComment,
  listenComments,
  postComment,
} from '@/lib/client/comments';
import { useUser } from '@/lib/client/user';
import { CommentModel } from '@/types/comment';
import * as Avatar from '@radix-ui/react-avatar';
import { MessagesSquare, Send, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SecondaryAlert, SuccessAlert } from './alert';

interface CommentSectionProps {
  chapterId: string;
}

export const CommentSection = ({ chapterId }: CommentSectionProps) => {
  const [user] = useUser();

  const [isLoading, setLoading] = useState(false);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [commented, setCommented] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      return listenComments(chapterId, setComments);
    }
  }, [chapterId, showComments]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!user) return;

    setLoading(true);
    await postComment(chapterId, {
      message: formData.get('message') as string,
      userid: user.uid,
      username: user.displayName ?? 'Anônimo',
    });
    setLoading(false);
    setCommented(true);
    setShowComments(true);
  };

  const handleShowComments = () => {
    setShowComments(true);
  };

  return (
    <>
      <div className='w-full flex justify-between items-end pb-1 my-4 border-b border-base-content/10'>
        <h2 className='font-bold text-xl sm:text-2xl'>Comentários</h2>
      </div>
      {user === null ? (
        <SecondaryAlert text='Faça login para poder comentar!' />
      ) : !commented ? (
        <CommentForm onSubmit={handleSubmit} isLoading={isLoading} />
      ) : (
        <SuccessAlert text='Muito obrigado pelo comentário!' />
      )}
      <div className='w-full flex flex-col space-y-3 my-3'>
        {showComments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              chapterId={chapterId}
              enableDelete={comment.userid === user?.uid}
            />
          ))
        ) : !showComments ? (
          <button
            className='flex flex-row items-center p-2 rounded hover:bg-base-content/20 self-center'
            onClick={handleShowComments}
          >
            <MessagesSquare className='w-7 h-7 m-auto mr-2 text-blue-500 dark:text-blue-600' />
            Ver comentários
          </button>
        ) : (
          <SecondaryAlert text='Nenhum comentário ainda!' />
        )}
      </div>
    </>
  );
};

interface CommentCardProps {
  comment: CommentModel;
  chapterId: string;
  enableDelete: boolean;
}

const CommentCard = ({
  comment,
  chapterId,
  enableDelete,
}: CommentCardProps) => {
  const handleDelete = () => {
    deleteComment(chapterId, comment.id).catch(console.error);
  };

  return (
    <div className='w-full border-b border-base-content/10'>
      <div className='flex flex-row items-center'>
        <Avatar.Root className='mr-4 inline-flex h-10 w-10 select-none items-center justify-center rounded-full overflow-hidden align-middle'>
          <Avatar.Fallback className='leading-1 flex h-full w-full items-center justify-center bg-base-200 text-sm font-medium'>
            {comment.username[0]}
          </Avatar.Fallback>
        </Avatar.Root>
        <span className='font-bold text-md me-3'>{comment.username}</span>
      </div>
      <div className='ml-12 m-3'>
        <div className='mb-3 font-semibold'>{comment.message}</div>
        <div className='w-full flex flex-row justify-between items-center'>
          <div className='text-sm tabular-nums'>
            {comment.time.toDate().toLocaleDateString()}
            {' as '}
            {comment.time.toDate().toLocaleTimeString()}
          </div>
          {enableDelete && (
            <button
              className='w-6 h-6 rounded hover:bg-base-content/10'
              onClick={handleDelete}
            >
              <Trash2 className='w-5 h-5 m-auto text-red-500 dark:text-red-600' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface CommentFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const CommentForm = ({ onSubmit, isLoading }: CommentFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className='w-full my-2 flex flex-col shadow-md overflow-hidden rounded-md border border-base-content/20'
    >
      <textarea
        name='message'
        cols={3}
        maxLength={100}
        required
        placeholder='Adicione um comentário ao capítulo...'
        className='p-2 resize-y rounded-t-md bg-base-200 focus:outline focus:border-primary outline-2 outline-primary -outline-offset-2 caret-primary'
      ></textarea>
      <div className='flex flex-row border-t border-inherit'>
        <button
          type='submit'
          disabled={isLoading}
          className='m-2 px-2 py-1 text-primary-content flex flex-row items-center rounded focus:outline outline-offset-2 focus:border-primary outline-2 outline-primary bg-primary hover:bg-primary-focus'
        >
          <Send className='h-5 w-5 mr-2' /> Enviar
        </button>
      </div>
    </form>
  );
};
