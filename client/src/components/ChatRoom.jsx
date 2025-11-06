import React from 'react';
import MessageInput from './MessageInput';

function ChatRoom() {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-lg rounded-lg">
      {/* Messages area - scrollable, fixed height */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-gray-500 text-center py-8">
          ChatRoom
        </div>
      </div>

      {/* Input area - sticky bottom bar */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white rounded-b-lg">
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatRoom;

