import { usePost } from '@/hooks/usePost';
import { del, get } from '@/utils/api';
import { CONSTANTS } from '@/utils/constants';
import { Account, ChatRoom } from '@/utils/type';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { DeleteChatRoomModal } from './DeleteChatRoomModal';
import { AddChatRoomModal } from './AddChatRoomModal';

type Props = {
  rooms: ChatRoom[];
  currentRoomId: string;
  onSelectRoom: (roomId: string) => void;
};

export const ChatRoomsSidebar: React.FC<Props> = ({ rooms, currentRoomId, onSelectRoom }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetRoomId, setTargetRoomId] = useState<string | null>(null);
  const [targetRoomName, setTargetRoomName] = useState<string>('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newChatRoomName, setNewChatRoomName] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const { post, isLoading, errorMessage } = usePost();
  const router = useRouter();

  useEffect(() => {
    if (addModalOpen) {
      get<Account[]>(CONSTANTS.ENDPOINT.ACCOUNTS_FRIENDS).then((data) => {
        setAccounts(data);
      });
    }
  }, [addModalOpen]);

  const handleDeleteClick = (roomId: string, roomName: string) => {
    setTargetRoomId(roomId);
    setTargetRoomName(roomName);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (targetRoomId) {
      await del(CONSTANTS.ENDPOINT.CHAT_ROOM(targetRoomId));
    }
    router.refresh();
  };

  const handleCancel = () => {
    setDeleteModalOpen(false);
    setTargetRoomId(null);
    setTargetRoomName('');
  };

  const handleCreateRoom = async () => {
    await post(CONSTANTS.ENDPOINT.CHAT_ROOMS, {
      name: newChatRoomName,
      accountIds: selectedAccounts,
    });
    setAddModalOpen(false);
    setNewChatRoomName('');
    setSelectedAccounts([]);
    router.refresh();
  };

  return (
    <aside className="w-56 bg-gray-100 dark:bg-gray-800 h-full p-4 flex flex-col gap-2 border-r">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Chat Rooms</h2>
        <button
          className="ml-2 text-gray-400 hover:text-blue-600 p-1 rounded transition-colors hover:cursor-pointer"
          title="Add room"
          onClick={() => setAddModalOpen(true)}
        >
          ＋
        </button>
      </div>
      <ul className="flex-1 space-y-2">
        {rooms.map((room) => (
          <li key={room._id} className="flex items-center justify-between group">
            <button
              className={`flex-1 text-left px-3 py-2 rounded transition-colors ${
                currentRoomId === room._id
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-blue-100 dark:hover:bg-blue-700'
              } hover:cursor-pointer`}
              onClick={() => onSelectRoom(room._id)}
            >
              {room.name}
            </button>
            <button
              className="ml-2 text-gray-400 hover:text-red-600 p-1 rounded transition-colors hover:cursor-pointer"
              title="Delete room"
              onClick={() => handleDeleteClick(room._id, room.name)}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
      {deleteModalOpen && (
        <DeleteChatRoomModal
          targetRoomName={targetRoomName}
          handleConfirmDelete={handleConfirmDelete}
          handleCancel={handleCancel}
        />
      )}
      {addModalOpen && (
        <AddChatRoomModal
          newChatRoomName={newChatRoomName}
          setNewChatRoomName={setNewChatRoomName}
          selectedAccounts={selectedAccounts}
          setSelectedAccounts={setSelectedAccounts}
          accounts={accounts}
          isLoading={isLoading}
          errorMessage={errorMessage || ''}
          handleCreateRoom={handleCreateRoom}
          setAddModalOpen={setAddModalOpen}
        />
      )}
    </aside>
  );
};
