import { deleteComment, listenComments, postComment } from '@/lib/comments';
import { useUser } from '@/lib/user';
import { CommentModel } from '@/types/comment';
import * as Avatar from '@radix-ui/react-avatar';
import { MessagesSquare, Send, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SecondaryAlert, SuccessAlert } from './alert';

interface CommentSectionProps {
  idChapter: number;
}

export const CommentSection = ({ idChapter }: CommentSectionProps) => {
  const [user] = useUser();

  const [isLoading, setLoading] = useState(false);
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [commented, setCommented] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      return listenComments(idChapter, setComments);
    }
  }, [idChapter, showComments]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!user) return;

    setLoading(true);
    await postComment(idChapter, {
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
      <div className='w-full flex justify-between items-end pb-1 my-4 border-b border-light-b dark:border-dark-b'>
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
              idChapter={idChapter}
              enableDelete={comment.userid === user?.uid}
            />
          ))
        ) : !showComments ? (
          <button
            className='flex flex-row items-center p-2 rounded hover:bg-light-b dark:hover:bg-dark-b self-center'
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
  idChapter: number;
  enableDelete: boolean;
}

const CommentCard = ({
  comment,
  idChapter,
  enableDelete,
}: CommentCardProps) => {
  const handleDelete = () => {
    deleteComment(idChapter, comment.id).catch(console.error);
  };

  return (
    <div className='w-full border-b border-light-b dark:border-dark-b'>
      <div className='flex flex-row items-center'>
        <Avatar.Root className='mr-4 inline-flex h-10 w-10 select-none items-center justify-center rounded-full overflow-hidden align-middle'>
          <Avatar.Fallback className='text-light dark:text-dark leading-1 flex h-full w-full items-center justify-center bg-dark-b dark:bg-light-b text-sm font-medium'>
            {comment.username[0]}
          </Avatar.Fallback>
        </Avatar.Root>
        <span className='font-bold text-md me-3'>{comment.username}</span>
      </div>
      <div className='ml-12 m-3'>
        <div className='mb-3 font-semibold text-gray-600 dark:text-gray-500'>
          {comment.message}
        </div>
        <div className='w-full flex flex-row justify-between items-center'>
          <div className='text-sm tabular-nums'>
            {comment.time.toDate().toLocaleDateString()}
            {' as '}
            {comment.time.toDate().toLocaleTimeString()}
          </div>
          {enableDelete && (
            <button
              className='w-6 h-6 rounded hover:bg-light-b dark:hover:bg-dark-b'
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
      className='w-full my-2 flex flex-col shadow-md overflow-hidden rounded-md border border-light-b dark:border-dark-b'
    >
      <textarea
        name='message'
        cols={3}
        maxLength={100}
        required
        placeholder='Adicione um comentário ao capítulo...'
        className='p-2 resize-y rounded-t-md bg-light dark:bg-dark focus:outline focus:border-indigo-600 outline-2 outline-indigo-600 -outline-offset-2 caret-indigo-600'
      ></textarea>
      <div className='flex flex-row border-t border-inherit'>
        <button
          type='submit'
          disabled={isLoading}
          className='m-2 px-2 py-1 text-light flex flex-row items-center rounded focus:outline focus:border-indigo-600 outline-2 outline-indigo-600 -outline-offset-2 bg-blue-400 dark:bg-blue-500 hover:bg-opacity-50'
        >
          <Send className='h-5 w-5 mr-2' /> Enviar
        </button>
      </div>
    </form>
  );
};
