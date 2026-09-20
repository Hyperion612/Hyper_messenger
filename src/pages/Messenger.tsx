import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle, Search, Plus, Settings, Moon, Sun, Phone, Video,
  MoreVertical, Send, Smile, Paperclip, Mic, Image, Users, Hash,
  Shield, Check, CheckCheck, Star, Pin, Bell, Archive, ChevronLeft,
  AtSign, Bot, Globe, Lock
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  encrypted?: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: 'dm' | 'group' | 'channel' | 'bot';
  verified?: boolean;
  pinned?: boolean;
}

const mockChats: Chat[] = [
  { id: '1', name: 'Alice Chen', avatar: '👩‍💻', lastMessage: 'The new encryption module is ready!', time: '2m', unread: 3, online: true, type: 'dm', verified: true, pinned: true },
  { id: '2', name: 'Hyper Team', avatar: '🚀', lastMessage: 'Bob: Deployed v2.4.1 to staging', time: '15m', unread: 12, online: true, type: 'group' },
  { id: '3', name: 'Security Channel', avatar: '🛡️', lastMessage: 'Weekly security report published', time: '1h', unread: 0, online: false, type: 'channel', verified: true },
  { id: '4', name: 'Hyper AI', avatar: '🤖', lastMessage: 'How can I help you today?', time: '3h', unread: 0, online: true, type: 'bot' },
  { id: '5', name: 'David Park', avatar: '👨‍🎨', lastMessage: 'Check out the new UI designs', time: '5h', unread: 0, online: false, type: 'dm' },
  { id: '6', name: 'Crypto Research', avatar: '🔐', lastMessage: 'Signal Protocol v4 analysis complete', time: '1d', unread: 0, online: false, type: 'group' },
  { id: '7', name: 'Elena Volkov', avatar: '👩‍🔬', lastMessage: 'Meeting at 3pm?', time: '1d', unread: 0, online: true, type: 'dm' },
  { id: '8', name: 'Announcements', avatar: '📢', lastMessage: 'Hyper 2.5 is coming next week!', time: '2d', unread: 0, online: false, type: 'channel', verified: true },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', text: 'Hey! Have you seen the new MLS implementation?', sender: 'other', time: '10:30 AM' },
    { id: '2', text: 'Yes! The key rotation is much faster now 🚀', sender: 'me', time: '10:32 AM', status: 'read' },
    { id: '3', text: 'I also added support for post-quantum cryptography', sender: 'other', time: '10:33 AM' },
    { id: '4', text: 'That\'s amazing! Can you push the changes?', sender: 'me', time: '10:35 AM', status: 'read' },
    { id: '5', text: 'Already done. Check the main branch.', sender: 'other', time: '10:36 AM' },
    { id: '6', text: 'The new encryption module is ready!', sender: 'other', time: '10:40 AM' },
  ],
  '2': [
    { id: '1', text: 'Team standup in 5 minutes', sender: 'other', time: '9:00 AM' },
    { id: '2', text: 'I\'ll be there 👍', sender: 'me', time: '9:01 AM', status: 'read' },
    { id: '3', text: 'Bob: Deployed v2.4.1 to staging', sender: 'other', time: '9:15 AM' },
  ],
  '4': [
    { id: '1', text: 'Hello! I\'m Hyper AI, your intelligent assistant. I can help you with:\n\n• Summarizing long conversations\n• Translating messages\n• Smart reply suggestions\n• Finding information in chats\n\nHow can I help you today?', sender: 'other', time: '3:00 PM' },
  ],
};

export default function Messenger() {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(mockMessages[selectedChat.id] || []);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      encrypted: true,
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate delivery
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m));
    }, 500);

    // Simulate read
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m));
    }, 1500);

    // Simulate typing + reply
    if (selectedChat?.type === 'dm' || selectedChat?.type === 'bot') {
      setTimeout(() => setIsTyping(true), 2000);
      setTimeout(() => {
        setIsTyping(false);
        const replies = selectedChat?.type === 'bot' 
          ? ['I\'ll help you with that! Let me process your request...'] 
          : ['Got it! 👍', 'Sounds great!', 'Let me check and get back to you.', 'Perfect, thanks!'];
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          text: replies[Math.floor(Math.random() * replies.length)],
          sender: 'other',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, reply]);
      }, 4000);
    }
  };

  const filteredChats = mockChats.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatIcon = (chat: Chat) => {
    if (chat.type === 'channel') return <Hash className="w-5 h-5" />;
    if (chat.type === 'group') return <Users className="w-5 h-5" />;
    if (chat.type === 'bot') return <Bot className="w-5 h-5" />;
    return null;
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
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-hyper-500 to-purple-500 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold gradient-text text-lg">Hyper</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <Plus className="w-4 h-4 text-zinc-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <Settings className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-hyper-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredChats.map(chat => (
                <motion.div
                  key={chat.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => { setSelectedChat(chat); if (window.innerWidth < 768) setShowSidebar(false); }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1 ${
                    selectedChat?.id === chat.id ? 'bg-hyper-500/10 border border-hyper-500/20' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-lg">
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0a0a0f]" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-white truncate">{chat.name}</span>
                        {chat.verified && <Shield className="w-3.5 h-3.5 text-hyper-400 flex-shrink-0" />}
                      </div>
                      <span className="text-xs text-zinc-500">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-zinc-400 truncate flex items-center gap-1">
                        {chat.type !== 'dm' && renderChatIcon(chat)}
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-hyper-500 text-white text-[10px] font-bold min-w-[18px] text-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {chat.pinned && <Pin className="w-3 h-3 text-zinc-500 rotate-45 flex-shrink-0" />}
                </motion.div>
              ))}
            </div>
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
                  {selectedChat.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-white text-sm">{selectedChat.name}</h3>
                    {selectedChat.verified && <Shield className="w-3.5 h-3.5 text-hyper-400" />}
                    <span title="E2E Encrypted"><Lock className="w-3 h-3 text-green-500" /></span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    {selectedChat.online ? 'Online' : selectedChat.type === 'group' ? '24 members' : 'Last seen 2h ago'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <Phone className="w-4 h-4 text-zinc-400" />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <Video className="w-4 h-4 text-zinc-400" />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <Search className="w-4 h-4 text-zinc-400" />
                </button>
                <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <MoreVertical className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Encryption notice */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-xs text-zinc-400">
                  <Lock className="w-3 h-3 text-green-500" />
                  Messages are end-to-end encrypted. No one outside this chat can read them.
                </div>
              </div>

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === 'me' 
                      ? 'bg-hyper-600/80 text-white rounded-br-md' 
                      : 'glass-strong text-white rounded-bl-md'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : ''}`}>
                      <span className="text-[10px] text-white/50">{msg.time}</span>
                      {msg.sender === 'me' && msg.status && (
                        <span className="text-[10px]">
                          {msg.status === 'sent' && <Check className="w-3 h-3 text-white/50" />}
                          {msg.status === 'delivered' && <CheckCheck className="w-3 h-3 text-white/50" />}
                          {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-hyper-300" />}
                        </span>
                      )}
                      {msg.encrypted && <Lock className="w-2.5 h-2.5 text-green-400/60" />}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="glass-strong rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="glass-strong border-t border-white/5 p-4">
              <div className="flex items-center gap-3">
                <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <Paperclip className="w-5 h-5 text-zinc-400" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-hyper-500/50 transition-colors"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Smile className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
                {inputText.trim() ? (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={sendMessage}
                    className="p-3 rounded-xl bg-hyper-600 hover:bg-hyper-500 transition-colors"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </motion.button>
                ) : (
                  <button className="p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <Mic className="w-5 h-5 text-zinc-400" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-hyper-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <MessageCircle className="w-10 h-10 text-hyper-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">Welcome to Hyper</h3>
              <p className="text-zinc-400 text-sm">Select a conversation to start messaging</p>
              <p className="text-zinc-600 text-xs mt-4">All messages are end-to-end encrypted 🔒</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
