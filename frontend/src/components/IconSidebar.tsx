import React from 'react';

type IconSidebarProps = {
  selected: 'friends' | 'chat';
  onSelect: (type: 'friends' | 'chat') => void;
};

export const IconSidebar: React.FC<IconSidebarProps> = ({ selected, onSelect }) => {
  return (
    <aside className="w-12 bg-gray-200 dark:bg-gray-900 h-full flex flex-col items-center py-4 gap-4 border-r">
      <button
        className={`p-2 rounded hover:cursor-pointer ${selected === 'friends' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 dark:hover:bg-gray-700'}`}
        onClick={() => onSelect('friends')}
        title="Friends"
      >
        <span style={{ fontSize: 24 }}>👤</span>
      </button>
      <button
        className={`p-2 rounded hover:cursor-pointer ${selected === 'chat' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 dark:hover:bg-gray-700'}`}
        onClick={() => onSelect('chat')}
        title="Chat Rooms"
      >
        <span style={{ fontSize: 24 }}>💬</span>
      </button>
    </aside>
  );
};
