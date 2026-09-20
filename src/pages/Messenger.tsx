import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/auth';
import {
  getConversationMessages, getUserConversations, sendMessage, markAsRead,
  createConversation, onNewMessage, onConversationCreated, onMessageDelivered,
  ChatMessage, Conversation
} from '../lib/chat';
import {
  MessageCircle, Search, Plus, Settings, Phone, Video,
  MoreVertical, Send, Smile, Paperclip, Mic, Users, Hash,
  Shield, Check, CheckCheck, Pin, ChevronLeft, Bot, Lock,
  Database, X, UserPlus, LogOut
} from 'lucide-react';

export default function Messenger() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, getAllUsers, logout } = useAuth();
  
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatType, setNewChatType] = useState<'dm' | 'group'>('dm');
  const [newChatName, setNewChatName] = useState('');
  const [newChatMembers, setNewChatMembers] = useState<string[]>([]);
  const [searchUser, setSearchUser] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allUsers = getAllUsers().filter(u => u.id !== user?.id);

  // Load conversations
  useEffect(() => {
    if (user) {
      setConversations(getUserConversations(user.id));
    }
  }, [user]);

  // Real-time listeners
  useEffect(() => {
    if (!user) return;

    const unsubMessage = onNewMessage((msg) => {
      if (selectedChat && msg.conversationId === selectedChat.id) {
        setMessages(prev => [...prev, msg]);
      }
      // Refresh conversations list
      setConversations(getUserConversations(user.id));
    });

    const unsubConv = onConversationCreated((conv) => {
      if (conv.members.includes(user.id)) {
        setConversations(prev => [...prev, conv]);
      }
    });

    const unsubDelivered = onMessageDelivered((messageId) => {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: 'delivered' } : m));
    });

    return () => {
      unsubMessage();
      unsubConv();
      unsubDelivered();
    };
  }, [user, selectedChat]);

  // Load messages when chat selected
  useEffect(() => {
    if (selectedChat) {
      setMessages(getConversationMessages(selectedChat.id));
      if (user) {
        markAsRead(selectedChat.id, user.id);
      }
    }
  }, [selectedChat, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !user || !selectedChat) return;
    
    const msg = sendMessage(
      selectedChat.id,
      user.id,
      user.fullName,
      user.avatar,
      inputText.trim()
    );
    
    setMessages(prev => [...prev, msg]);
    setInputText('');
    
    // Update conversation list
    setConversations(getUserConversations(user.id));
  };

  const handleCreateChat = () => {
    if (!user) return;
    
    if (newChatType === 'dm') {
      if (newChatMembers.length !== 1) return;
      const otherUser = allUsers.find(u => u.id === newChatMembers[0]);
      if (!otherUser) return;
      
      const conv = createConversation('dm', otherUser.fullName, [user.id, otherUser.id], user.id, otherUser.avatar);
      setSelectedChat(conv);
    } else {
      if (!newChatName.trim() || newChatMembers.length === 0) return;
      const conv = createConversation('group', newChatName, [user.id, ...newChatMembers], user.id);
      setSelectedChat(conv);
    }
    
    setShowNewChat(false);
    setNewChatName('');
    setNewChatMembers([]);
    setConversations(getUserConversations(user.id));
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter(u =>
    u.username.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchUser.toLowerCase())
  );

  const getChatDisplayName = (conv: Conversation): string => {
    if (conv.type === 'dm') {
      const otherMember = conv.members.find(m => m !== user?.id);
      const otherUser = allUsers.find(u => u.id === otherMember);
      return otherUser?.fullName || conv.name;
    }
    return conv.name;
  };

  const getChatAvatar = (conv: Conversation): string => {
    if (conv.type === 'dm') {
      const otherMember = conv.members.find(m => m !== user?.id);
      const otherUser = allUsers.find(u => u.id === otherMember);
      return otherUser?.avatar || conv.avatar;
    }
    return conv.avatar;
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-screen flex mesh-gradient overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="w-80 h-full glass border-r border-white/5 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-hyper-500 to-purple-500 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold gradient-text text-lg">Hyper</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowNewChat(true)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <Plus className="w-4 h-4 text-zinc-400" />
                  </button>
                  <button onClick={() => navigate('/settings')} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <Settings className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder={t('messenger.searchConversations')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-hyper-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <p className="text-sm text-zinc-500">Нет чатов</p>
                  <button
                    onClick={() => setShowNewChat(true)}
                    className="mt-2 px-4 py-2 rounded-lg bg-hyper-500/10 text-hyper-400 text-sm"
                  >
                    Создать чат
                  </button>
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const unread = user ? (conv.unreadCount[user.id] || 0) : 0;
                  return (
                    <motion.div
                      key={conv.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => {
                        setSelectedChat(conv);
                        if (window.innerWidth < 768) setShowSidebar(false);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1 ${
                        selectedChat?.id === conv.id ? 'bg-hyper-500/10 border border-hyper-500/20' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-lg">
                        {getChatAvatar(conv)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white truncate">
                            {getChatDisplayName(conv)}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {conv.lastMessageTime ? formatTime(conv.lastMessageTime) : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-zinc-400 truncate">
                            {conv.lastMessage || t('messenger.noMessages')}
                          </p>
                          {unread > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-hyper-500 text-white text-[10px] font-bold min-w-[18px] text-center">
                              {unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* User Info */}
            {user && (
              <div className="p-3 border-t border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-lg">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{user.fullName}</p>
                  <p className="text-xs text-zinc-500 truncate">@{user.username}</p>
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="glass-strong border-b border-white/5 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden p-2 rounded-lg hover:bg-white/5"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-lg">
                  {getChatAvatar(selectedChat)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-white text-sm">
                      {getChatDisplayName(selectedChat)}
                    </h3>
                    <Lock className="w-3 h-3 text-green-500" />
                  </div>
                  <p className="text-xs text-zinc-400">
                    {selectedChat.type === 'group'
                      ? `${selectedChat.members.length} ${t('messenger.members')}`
                      : t('messenger.online')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button className="p-2.5 rounded-xl hover:bg-white/5"><Phone className="w-4 h-4 text-zinc-400" /></button>
                <button className="p-2.5 rounded-xl hover:bg-white/5"><Video className="w-4 h-4 text-zinc-400" /></button>
                <button className="p-2.5 rounded-xl hover:bg-white/5"><MoreVertical className="w-4 h-4 text-zinc-400" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-xs text-zinc-400">
                  <Lock className="w-3 h-3 text-green-500" />
                  {t('messenger.encryptedNotice')}
                </div>
              </div>

              {messages.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-zinc-500 text-sm">{t('messenger.noMessages')}</p>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                    msg.senderId === user?.id
                      ? 'bg-hyper-600/80 text-white rounded-br-md'
                      : 'glass-strong text-white rounded-bl-md'
                  }`}>
                    {msg.senderId !== user?.id && selectedChat.type !== 'dm' && (
                      <p className="text-xs font-medium text-hyper-300 mb-1">{msg.senderName}</p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.senderId === user?.id ? 'justify-end' : ''}`}>
                      <span className="text-[10px] text-white/50">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.senderId === user?.id && (
                        <span className="text-[10px]">
                          {msg.status === 'sending' && <span className="text-white/30">⏳</span>}
                          {msg.status === 'sent' && <Check className="w-3 h-3 text-white/50" />}
                          {msg.status === 'delivered' && <CheckCheck className="w-3 h-3 text-white/50" />}
                          {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-hyper-300" />}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="glass-strong border-t border-white/5 p-4">
              <div className="flex items-center gap-3">
                <button className="p-2.5 rounded-xl hover:bg-white/5"><Paperclip className="w-5 h-5 text-zinc-400" /></button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t('messenger.typeMessage')}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-hyper-500/50 transition-colors"
                  />
                </div>
                {inputText.trim() ? (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    className="p-3 rounded-xl bg-hyper-600 hover:bg-hyper-500 transition-colors"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </motion.button>
                ) : (
                  <button className="p-3 rounded-xl hover:bg-white/5"><Mic className="w-5 h-5 text-zinc-400" /></button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-hyper-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <MessageCircle className="w-10 h-10 text-hyper-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">{t('messenger.welcomeToHyper')}</h3>
              <p className="text-zinc-400 text-sm">{t('messenger.selectConversation')}</p>
              <p className="text-zinc-600 text-xs mt-4">{t('messenger.allMessagesEncrypted')}</p>
              {conversations.length === 0 && (
                <button
                  onClick={() => setShowNewChat(true)}
                  className="mt-6 px-6 py-3 rounded-xl bg-hyper-600 text-white text-sm font-medium hover:bg-hyper-500"
                >
                  {t('chat.createNew')}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewChat(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass-strong rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  {newChatType === 'dm' ? t('chat.createNew') : t('chat.createGroup')}
                </h2>
                <button onClick={() => setShowNewChat(false)} className="p-2 rounded-lg hover:bg-white/5">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {/* Type selector */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setNewChatType('dm')}
                  className={`flex-1 py-2 rounded-xl text-sm ${
                    newChatType === 'dm' ? 'bg-hyper-500/10 border border-hyper-500/30 text-hyper-400' : 'glass text-zinc-400'
                  }`}
                >
                  {t('chat.personalChat')}
                </button>
                <button
                  onClick={() => setNewChatType('group')}
                  className={`flex-1 py-2 rounded-xl text-sm ${
                    newChatType === 'group' ? 'bg-hyper-500/10 border border-hyper-500/30 text-hyper-400' : 'glass text-zinc-400'
                  }`}
                >
                  {t('chat.groupChat')}
                </button>
              </div>

              {/* Group name */}
              {newChatType === 'group' && (
                <input
                  type="text"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  placeholder={t('chat.groupName')}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-hyper-500/50 mb-4"
                />
              )}

              {/* Search users */}
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder={t('chat.enterUsername')}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-hyper-500/50 mb-3"
              />

              {/* Users list */}
              <div className="max-h-60 overflow-y-auto space-y-1 mb-4">
                {filteredUsers.map(u => (
                  <div
                    key={u.id}
                    onClick={() => {
                      if (newChatType === 'dm') {
                        setNewChatMembers([u.id]);
                      } else {
                        setNewChatMembers(prev =>
                          prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id]
                        );
                      }
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                      newChatMembers.includes(u.id) ? 'bg-hyper-500/10 border border-hyper-500/20' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-lg">
                      {u.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{u.fullName}</p>
                      <p className="text-xs text-zinc-500">@{u.username}</p>
                    </div>
                    {newChatMembers.includes(u.id) && (
                      <Check className="w-4 h-4 text-hyper-400" />
                    )}
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-center text-sm text-zinc-500 py-4">
                    {allUsers.length === 0 ? 'Нет других пользователей' : 'Пользователи не найдены'}
                  </p>
                )}
              </div>

              {/* Create button */}
              <button
                onClick={handleCreateChat}
                disabled={newChatMembers.length === 0 || (newChatType === 'group' && !newChatName.trim())}
                className="w-full py-3 rounded-xl bg-hyper-600 text-white text-sm font-medium hover:bg-hyper-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {newChatType === 'dm' ? t('chat.startChat') : t('chat.create')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
