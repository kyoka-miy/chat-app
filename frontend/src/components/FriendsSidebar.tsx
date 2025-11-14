import React, { useEffect, useState } from 'react';
import { useAccount } from '@/context/AccountContext';
import { useGet } from '@/utils/api';
import { CONSTANTS } from '@/utils/constants';
import { Account } from '@/utils/type';

export const FriendsSidebar: React.FC = () => {
  const { account } = useAccount();
  const [searchText, setSearchText] = useState('');
  const [friends, setFriends] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdInput, setUserIdInput] = useState('');
  const [newFriendSuggest, setNewFriendSuggest] = useState<Account | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      useGet(CONSTANTS.ENDPOINT.ACCOUNTS_SEARCH(searchText)).then((data) => {
        setFriends(data);
      });
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  useEffect(() => {
    if (userIdInput.trim().length === 0) return;
    const handler = setTimeout(() => {
      useGet(CONSTANTS.ENDPOINT.ACCOUNT_FIND_BY_ID(userIdInput)).then((data) => {
        setNewFriendSuggest(data);
      });
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [userIdInput]);

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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => {
            setIsModalOpen(false);
            setUserIdInput('');
            // setFriend(null);
          }}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
              onClick={() => {
                setIsModalOpen(false);
                setUserIdInput('');
                // setFriend(null);
              }}
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4">Invite New Friend</h2>
            <input
              type="text"
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 mb-4"
              placeholder="Find a new friend by id..."
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
            />
            <div>
              {newFriendSuggest ? (
                <div className="p-3 rounded bg-gray-200 dark:bg-grday-700 hover:cursor-pointer">
                  <span className="font-bold text-gray-500">{newFriendSuggest.name}</span> <br />
                  <span className="text-xs text-gray-500">ID: {newFriendSuggest.userId}</span>
                </div>
              ) : (
                <span className="text-gray-500">No Result</span>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
