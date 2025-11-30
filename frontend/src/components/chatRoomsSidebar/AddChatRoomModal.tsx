import { ErrorMessage } from '../common/ErrorMessage';

type Props = {
  newChatRoomName: string;
  setNewChatRoomName: (name: string) => void;
  selectedAccounts: string[];
  setSelectedAccounts: (ids: string[]) => void;
  accounts: { _id: string; name: string }[];
  isLoading: boolean;
  errorMessage: string;
  handleCreateRoom: () => Promise<void>;
  setAddModalOpen: (isOpen: boolean) => void;
};

export const AddChatRoomModal: React.FC<Props> = ({
  newChatRoomName,
  setNewChatRoomName,
  selectedAccounts,
  setSelectedAccounts,
  accounts,
  isLoading,
  errorMessage,
  handleCreateRoom,
  setAddModalOpen,
}) => {
  return (
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
                      setSelectedAccounts(selectedAccounts.filter((id) => id !== acc._id));
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
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              'Create'
            )}
          </button>
          <ErrorMessage errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
};
