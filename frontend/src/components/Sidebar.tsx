import { deleteChatRoom, getAccounts, addChatRoom } from "@/utils/api";
import { Account, ChatRoom } from "@/utils/type";
import React, { useEffect, useState } from "react";

type SidebarProps = {
  rooms: ChatRoom[];
  currentRoomId: string;
  onSelectRoom: (roomId: string) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({
  rooms,
  currentRoomId,
  onSelectRoom,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetRoomId, setTargetRoomId] = useState<string | null>(null);
  const [targetRoomName, setTargetRoomName] = useState<string>("");

  const [addModalOpen, setAddModalOpen] = useState(false);

  // Modal state for new chat room
  const [newChatRoomName, setNewChatRoomName] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    if (addModalOpen) {
      getAccounts().then((data) => {
        setAccounts(data);
      });
    }
  }, [addModalOpen]);

  const handleDeleteClick = (roomId: string, roomName: string) => {
    setTargetRoomId(roomId);
    setTargetRoomName(roomName);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (targetRoomId) {
      deleteChatRoom(targetRoomId);
    }
    window.location.reload();
  };

  const handleCancel = () => {
    setDeleteModalOpen(false);
    setTargetRoomId(null);
    setTargetRoomName("");
  };

  const handleCreateRoom = async () => {
    await addChatRoom({ name: newChatRoomName, accountIds: selectedAccounts });
    setAddModalOpen(false);
    setNewChatRoomName("");
    setSelectedAccounts([]);
    window.location.reload();
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
          <li
            key={room._id}
            className="flex items-center justify-between group"
          >
            <button
              className={`flex-1 text-left px-3 py-2 rounded transition-colors ${
                currentRoomId === room._id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-100 dark:hover:bg-blue-700"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-bold">{targetRoomName}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {addModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Add Chat Room</h3>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Chat Room Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                value={newChatRoomName}
                onChange={(e) => setNewChatRoomName(e.target.value)}
                placeholder="Enter chat room name"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Select Accounts</label>
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                {accounts.map((acc) => (
                  <label key={acc._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={acc._id}
                      checked={selectedAccounts.includes(acc._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAccounts([...selectedAccounts, acc._id]);
                        } else {
                          setSelectedAccounts(
                            selectedAccounts.filter((id) => id !== acc._id)
                          );
                        }
                      }}
                    />
                    <span>{acc.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                onClick={handleCreateRoom}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
