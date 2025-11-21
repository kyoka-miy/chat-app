import React, { useEffect, useState } from 'react';
import { useAccount } from '@/context/AccountContext';
import { useGet } from '@/utils/api';
import { CONSTANTS } from '@/utils/constants';
import { Account } from '@/utils/type';
import { AddNewFriendModal } from './AddNewFriendModal';

export const FriendsSidebar: React.FC = () => {
  const { account } = useAccount();
  const [searchText, setSearchText] = useState('');
  const [friends, setFriends] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdInput, setUserIdInput] = useState('');
  const [newFriendSuggest, setNewFriendSuggest] = useState<Account | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      useGet(CONSTANTS.ENDPOINT.ACCOUNTS_FRIENDS_SEARCH(searchText)).then((data) => {
        setFriends(data);
      });
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const handleUserIdSearch = async () => {
    if (userIdInput.trim().length === 0) return;
    const data = await useGet(CONSTANTS.ENDPOINT.ACCOUNT_FIND_BY_ID(userIdInput));
    if (!data) {
      setNewFriendSuggest(null);
      setSearchError('The id does not exist or already in your friends.');
    } else {
      setNewFriendSuggest(data);
      setSearchError(null);
    }
  };

  return (
    <aside className="w-56 bg-gray-100 dark:bg-gray-800 h-full p-4 flex flex-col gap-2 border-r">
      <div className="flex flex-col items-center mb-4 gap-2">
        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
          {/* TODO: Replace with actual user icon */}
          <span role="img" aria-label="user">
            👤
          </span>
        </div>
        <span className="font-bold">{account?.name}</span>
      </div>
      <div className="mb-2">
        <input
          type="text"
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
          placeholder="Search friends..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {friends.map((f) => (
            <li
              key={f._id}
              className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:cursor-pointer"
            >
              {f.name}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="mt-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 hover:cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        Add Friends ＋
      </button>
      {isModalOpen && (
        <AddNewFriendModal
          setIsModalOpen={setIsModalOpen}
          setUserIdInput={setUserIdInput}
          userIdInput={userIdInput}
          setSearchError={setSearchError}
          handleUserIdSearch={handleUserIdSearch}
          searchError={searchError}
          newFriendSuggest={newFriendSuggest}
          setNewFriendSuggest={setNewFriendSuggest}
        />
      )}
    </aside>
  );
};
