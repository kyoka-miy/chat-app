import React, { useEffect, useState } from 'react';
import { useAccount } from '@/context/AccountContext';
import { get, put } from '@/utils/api';
import { CONSTANTS } from '@/utils/constants';
import { Account } from '@/utils/type';
import { AddNewFriendModal } from './AddNewFriendModal';
import { useRouter } from 'next/navigation';

export const FriendsSidebar: React.FC = () => {
  const { account } = useAccount();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [friends, setFriends] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdInput, setUserIdInput] = useState('');
  const [newFriendSuggest, setNewFriendSuggest] = useState<Account | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(account?.name || '');
  const [editedUserId, setEditedUserId] = useState(account?.userId || '');

  const popupRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      get<Account[]>(CONSTANTS.ENDPOINT.ACCOUNTS_FRIENDS_SEARCH(searchText)).then((data) => {
        setFriends(data);
      });
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  useEffect(() => {
    setEditedName(account?.name || '');
    setEditedUserId(account?.userId || '');
  }, [account]);

  useEffect(() => {
    if (!isEditing) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  const handleUserIdSearch = async () => {
    if (userIdInput.trim().length === 0) return;
    const data: Account | null = await get<Account | null>(
      CONSTANTS.ENDPOINT.ACCOUNT_FIND_BY_ID(userIdInput)
    );
    if (!data) {
      setNewFriendSuggest(null);
      setSearchError('The id does not exist or already in your friends.');
    } else {
      setNewFriendSuggest(data);
      setSearchError(null);
    }
  };

  const handleSave = async () => {
    await put(CONSTANTS.ENDPOINT.ACCOUNTS, {
      name: editedName,
      userId: editedUserId,
    });
    setIsEditing(false);
    router.refresh();
  };

  return (
    <aside className="w-56 bg-gray-100 dark:bg-gray-800 h-full p-4 flex flex-col gap-2 border-r">
      <div className="flex flex-col items-center mb-4 gap-2 relative w-full">
        <div className="absolute top-0 right-0">
          <button
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            onClick={() => setIsEditing(true)}
            aria-label="Edit profile"
          >
            <span role="img" aria-label="edit">
              ✏️
            </span>
          </button>
          {isEditing && (
            <div
              ref={popupRef}
              className="absolute top-0 left-full ml-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-xl p-4 z-10 w-76 flex flex-col gap-2"
            >
              <div className="font-bold text-center mb-2">Edit Profile</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm w-14">Name</span>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Name"
                />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm w-14">ID</span>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  value={editedUserId}
                  onChange={(e) => setEditedUserId(e.target.value)}
                  placeholder="User ID"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 w-full cursor-pointer"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500 w-full cursor-pointer"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
          <span role="img" aria-label="user">
            👤
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-bold">{account?.name}</span>
          <span className="text-xs text-gray-500">ID: {account?.userId}</span>
        </div>
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
