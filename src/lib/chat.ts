// Real-time chat service using BroadcastChannel API for cross-tab communication
// and localStorage for persistence

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  readBy: string[];
}

export interface Conversation {
  id: string;
  type: 'dm' | 'group' | 'channel';
  name: string;
  avatar: string;
  members: string[]; // user IDs
  createdBy: string;
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: Record<string, number>; // userId -> count
}

const CONVERSATIONS_KEY = 'hyper_conversations';
const MESSAGES_KEY = 'hyper_messages';

// BroadcastChannel for real-time cross-tab communication
let channel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel {
  if (!channel) {
    channel = new BroadcastChannel('hyper_chat');
  }
  return channel;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Conversations
export function getConversations(): Conversation[] {
  try {
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to save conversations:', e);
  }
}

export function getConversation(id: string): Conversation | null {
  return getConversations().find(c => c.id === id) || null;
}

export function getUserConversations(userId: string): Conversation[] {
  return getConversations().filter(c => c.members.includes(userId));
}

export function createConversation(
  type: 'dm' | 'group' | 'channel',
  name: string,
  members: string[],
  createdBy: string,
  avatar?: string
): Conversation {
  const conversations = getConversations();
  
  // For DM, check if already exists
  if (type === 'dm' && members.length === 2) {
    const existing = conversations.find(c => 
      c.type === 'dm' && 
      c.members.length === 2 &&
      c.members.includes(members[0]) && 
      c.members.includes(members[1])
    );
    if (existing) return existing;
  }
  
  const avatars = ['💬', '👥', '🚀', '🎯', '🔥', '⭐', '💎', '🌟', '🎨', '🎪'];
  
  const conversation: Conversation = {
    id: generateId(),
    type,
    name,
    avatar: avatar || avatars[Math.floor(Math.random() * avatars.length)],
    members,
    createdBy,
    createdAt: new Date().toISOString(),
    unreadCount: {},
  };
  
  conversations.push(conversation);
  saveConversations(conversations);
  
  // Broadcast new conversation
  getChannel().postMessage({ type: 'conversation_created', conversation });
  
  return conversation;
}

// Messages
export function getMessages(): ChatMessage[] {
  try {
    const data = localStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save messages:', e);
  }
}

export function getConversationMessages(conversationId: string): ChatMessage[] {
  return getMessages()
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  senderAvatar: string,
  content: string,
  type: 'text' | 'image' | 'file' = 'text'
): ChatMessage {
  const messages = getMessages();
  
  const message: ChatMessage = {
    id: generateId(),
    conversationId,
    senderId,
    senderName,
    senderAvatar,
    content,
    type,
    timestamp: new Date().toISOString(),
    status: 'sent',
    readBy: [senderId],
  };
  
  messages.push(message);
  saveMessages(messages);
  
  // Update conversation last message
  const conversations = getConversations();
  const idx = conversations.findIndex(c => c.id === conversationId);
  if (idx >= 0) {
    conversations[idx].lastMessage = content;
    conversations[idx].lastMessageTime = message.timestamp;
    
    // Update unread counts for other members
    conversations[idx].members.forEach(memberId => {
      if (memberId !== senderId) {
        conversations[idx].unreadCount[memberId] = (conversations[idx].unreadCount[memberId] || 0) + 1;
      }
    });
    
    saveConversations(conversations);
  }
  
  // Broadcast message
  getChannel().postMessage({ type: 'new_message', message });
  
  // Simulate delivery after 500ms
  setTimeout(() => {
    markAsDelivered(message.id);
  }, 500);
  
  return message;
}

export function markAsDelivered(messageId: string): void {
  const messages = getMessages();
  const idx = messages.findIndex(m => m.id === messageId);
  if (idx >= 0) {
    messages[idx].status = 'delivered';
    saveMessages(messages);
    getChannel().postMessage({ type: 'message_delivered', messageId });
  }
}

export function markAsRead(conversationId: string, userId: string): void {
  const messages = getMessages();
  let changed = false;
  
  messages.forEach(m => {
    if (m.conversationId === conversationId && !m.readBy.includes(userId)) {
      m.readBy.push(userId);
      if (m.status !== 'read' && m.readBy.length > 1) {
        m.status = 'read';
      }
      changed = true;
    }
  });
  
  if (changed) {
    saveMessages(messages);
    getChannel().postMessage({ type: 'messages_read', conversationId, userId });
  }
  
  // Reset unread count
  const conversations = getConversations();
  const idx = conversations.findIndex(c => c.id === conversationId);
  if (idx >= 0) {
    conversations[idx].unreadCount[userId] = 0;
    saveConversations(conversations);
  }
}

export function deleteMessage(messageId: string): boolean {
  const messages = getMessages();
  const filtered = messages.filter(m => m.id !== messageId);
  if (filtered.length < messages.length) {
    saveMessages(filtered);
    getChannel().postMessage({ type: 'message_deleted', messageId });
    return true;
  }
  return false;
}

// Event listeners for real-time updates
export function onNewMessage(callback: (message: ChatMessage) => void): () => void {
  const ch = getChannel();
  const handler = (event: MessageEvent) => {
    if (event.data.type === 'new_message') {
      callback(event.data.message);
    }
  };
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
}

export function onConversationCreated(callback: (conversation: Conversation) => void): () => void {
  const ch = getChannel();
  const handler = (event: MessageEvent) => {
    if (event.data.type === 'conversation_created') {
      callback(event.data.conversation);
    }
  };
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
}

export function onMessageDelivered(callback: (messageId: string) => void): () => void {
  const ch = getChannel();
  const handler = (event: MessageEvent) => {
    if (event.data.type === 'message_delivered') {
      callback(event.data.messageId);
    }
  };
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
}

export function onMessagesRead(callback: (conversationId: string, userId: string) => void): () => void {
  const ch = getChannel();
  const handler = (event: MessageEvent) => {
    if (event.data.type === 'messages_read') {
      callback(event.data.conversationId, event.data.userId);
    }
  };
  ch.addEventListener('message', handler);
  return () => ch.removeEventListener('message', handler);
}

// Stats
export function getChatStats(): { conversations: number; messages: number } {
  return {
    conversations: getConversations().length,
    messages: getMessages().length,
  };
}
