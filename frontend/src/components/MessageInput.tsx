import React, { useState } from "react";

type MessageInputProps = {
  onSend: (text: string) => void;
  user: string;
  setAccount: (account: string) => void;
};

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  user,
  setAccount,
}) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="flex gap-2 items-end p-4 border-t bg-white dark:bg-gray-900">
      <input
        className="border rounded px-2 py-1 w-32 text-sm"
        placeholder="User Name"
        value={user}
        onChange={(e) => setAccount(e.target.value)}
      />
      <input
        className="flex-1 border rounded px-2 py-1 text-sm"
        placeholder="Write your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm cursor-pointer"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};
