import React, { useState } from "react";
import AdminChatList from "./AdminChatList";
import AdminChatBox from "./AdminChatBox";
import { MessageSquare, Loader2 } from "lucide-react";
// import { markMessagesAsRead } from "../../service/api.conversation.service";

const AdminChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-[700px] w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      {/* Sidebar - Danh sách hội thoại */}
      <div className="w-1/3 bg-gray-50 border-r flex flex-col">
        <div className="p-4 border-b bg-white flex items-center gap-2 shadow-sm">
          <MessageSquare className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-700">Tin nhắn</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AdminChatList
            onSelectConversation={async (conv) => {
              setLoading(true);
              setSelectedConversation(conv);

              setTimeout(() => setLoading(false), 500);
            }}
            selectedConversation={selectedConversation}
          />
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 bg-gradient-to-b from-white to-gray-50 flex flex-col">
        {selectedConversation ? (
          loading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Loader2 className="animate-spin mr-2" />
              Đang tải hội thoại...
            </div>
          ) : (
            <AdminChatBox
              conversation={selectedConversation}
              // setConversations={setConversations}
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare size={40} className="mb-3 text-blue-500" />
            <p className="text-base font-medium">
              Chọn một hội thoại để bắt đầu trò chuyện
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
