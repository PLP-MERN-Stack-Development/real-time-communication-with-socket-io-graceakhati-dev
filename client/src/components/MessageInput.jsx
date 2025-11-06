import React from 'react';

function MessageInput() {
  return (
    <div className="p-4 flex gap-2">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="button"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;

