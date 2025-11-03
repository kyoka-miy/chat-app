import React, { useState } from 'react';
import { useAccount } from '@/context/AccountContext';

export const FriendsSidebar: React.FC = () => {
  const { account } = useAccount();
  const [search, setSearch] = useState('');
  // TODO: Replace with actual friends data
  const friends = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];
  const filtered = friends.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {filtered.map((f) => (
            <li key={f.id} className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700">
              {f.name}
            </li>
          ))}
        </ul>
      </div>
      <button className="mt-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
        Add Friends ＋
      </button>
    </aside>
  );
};
