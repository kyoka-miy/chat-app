'use client';
import { usePost } from '@/hooks/usePost';
import { CONSTANTS } from '@/utils/constants';
import { Account } from '@/utils/type';
import { useRouter } from 'next/navigation';
import { ErrorMessage } from '../common/ErrorMessage';

type Props = {
  setIsModalOpen: (v: boolean) => void;
  setUserIdInput: (v: string) => void;
  userIdInput: string;
  setSearchError: (v: string | null) => void;
  handleUserIdSearch: () => Promise<void>;
  searchError: string | null;
  newFriendSuggest: Account | null;
  setNewFriendSuggest: (v: Account | null) => void;
};

export const AddNewFriendModal: React.FC<Props> = ({
  setIsModalOpen,
  setUserIdInput,
  userIdInput,
  setSearchError,
  handleUserIdSearch,
  searchError,
  newFriendSuggest,
  setNewFriendSuggest,
}) => {
  const router = useRouter();
  const { post, errorMessage } = usePost();

  const onCloseModal = () => {
    setIsModalOpen(false);
    setUserIdInput('');
    setNewFriendSuggest(null);
  };
  const onAddFriend = async (friendId: string) => {
    await post(CONSTANTS.ENDPOINT.ACCOUNTS_FRIENDS, { accountId: friendId });
    setIsModalOpen(false);
    setUserIdInput('');
    setNewFriendSuggest(null);
    router.refresh();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={() => {
        setIsModalOpen(false);
        setUserIdInput('');
      }}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
          onClick={onCloseModal}
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4">Invite New Friend</h2>
        <input
          type="text"
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 mb-4"
          placeholder="Find a new friend by id..."
          value={userIdInput}
          onChange={(e) => {
            setUserIdInput(e.target.value);
            setSearchError(null);
          }}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await handleUserIdSearch();
            }
          }}
        />
        {searchError && <ErrorMessage errorMessage={searchError} />}
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        <div>
          {newFriendSuggest ? (
            <div
              className="p-3 rounded bg-gray-200 dark:bg-grday-700 hover:cursor-pointer"
              onClick={() => {
                onAddFriend(newFriendSuggest._id);
              }}
            >
              <span className="font-bold text-gray-500">{newFriendSuggest.name}</span> <br />
              <span className="text-xs text-gray-500">ID: {newFriendSuggest.userId}</span>
            </div>
          ) : (
            <span className="text-gray-500">No Result</span>
          )}
        </div>
      </div>
    </div>
  );
};
