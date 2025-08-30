import { deleteChatRoom } from "@/utils/api";
import React, { useState } from "react";

export type ChatRoom = {
  _id: string;
  name: string;
  createdDateTime: Date;
  accounts: string[];
  messages: string[];
};

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
  const [modalOpen, setModalOpen] = useState(false);
  const [targetRoomId, setTargetRoomId] = useState<string | null>(null);
  const [targetRoomName, setTargetRoomName] = useState<string>("");

  const handleDeleteClick = (roomId: string, roomName: string) => {
    setTargetRoomId(roomId);
    setTargetRoomName(roomName);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (targetRoomId) {
      deleteChatRoom(targetRoomId);
    }
    setModalOpen(false);
    setTargetRoomId(null);
    setTargetRoomName("");
    window.location.reload();
  };

  const handleCancel = () => {
    setModalOpen(false);
    setTargetRoomId(null);
    setTargetRoomName("");
  };

  return (
    <aside className="w-56 bg-gray-100 dark:bg-gray-800 h-full p-4 flex flex-col gap-2 border-r">
      <h2 className="text-lg font-bold mb-4">Chat Rooms</h2>
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
              }`}
              onClick={() => onSelectRoom(room._id)}
            >
              {room.name}
            </button>
            <button
              className="ml-2 text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
              title="Delete room"
              onClick={() => handleDeleteClick(room._id, room.name)}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-bold">{targetRoomName}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
