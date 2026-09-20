import { getSupabase, isConnected } from './supabase';

export interface SyncUser {
  id?: string;
  username: string;
  email?: string;
  avatar_url?: string;
  status?: string;
}

export interface SyncConversation {
  id?: string;
  type: 'dm' | 'group' | 'channel' | 'bot';
  name?: string;
  avatar?: string;
}

export interface SyncMessage {
  id?: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  encrypted?: boolean;
  status?: string;
  created_at?: string;
}

export interface SyncMember {
  conversation_id: string;
  user_id: string;
  role?: string;
}

export async function syncUser(user: SyncUser): Promise<string | null> {
  if (!isConnected()) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('hyper_users')
      .upsert(user, { onConflict: 'username' })
      .select('id')
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch (err) {
    console.error('Failed to sync user:', err);
    return null;
  }
}

export async function syncConversation(conversation: SyncConversation): Promise<string | null> {
  if (!isConnected()) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('hyper_conversations')
      .insert(conversation)
      .select('id')
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch (err) {
    console.error('Failed to sync conversation:', err);
    return null;
  }
}

export async function syncMessage(message: SyncMessage): Promise<string | null> {
  if (!isConnected()) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('hyper_messages')
      .insert(message)
      .select('id')
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch (err) {
    console.error('Failed to sync message:', err);
    return null;
  }
}

export async function syncMember(member: SyncMember): Promise<boolean> {
  if (!isConnected()) return false;
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('hyper_conversation_members')
      .insert(member);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to sync member:', err);
    return false;
  }
}

export async function loadUsers(): Promise<SyncUser[]> {
  if (!isConnected()) return [];
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('hyper_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Failed to load users:', err);
    return [];
  }
}

export async function loadConversations(): Promise<SyncConversation[]> {
  if (!isConnected()) return [];
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('hyper_conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Failed to load conversations:', err);
    return [];
  }
}

export async function loadMessages(conversationId: string): Promise<SyncMessage[]> {
  if (!isConnected()) return [];
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('hyper_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Failed to load messages:', err);
    return [];
  }
}

export async function loadMembers(conversationId: string): Promise<SyncMember[]> {
  if (!isConnected()) return [];
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('hyper_conversation_members')
      .select('*')
      .eq('conversation_id', conversationId);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Failed to load members:', err);
    return [];
  }
}

export async function deleteMessage(messageId: string): Promise<boolean> {
  if (!isConnected()) return false;
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('hyper_messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete message:', err);
    return false;
  }
}

export async function getSyncStats(): Promise<{
  users: number;
  conversations: number;
  messages: number;
} | null> {
  if (!isConnected()) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const [users, conversations, messages] = await Promise.all([
      supabase.from('hyper_users').select('count', { count: 'exact', head: true }),
      supabase.from('hyper_conversations').select('count', { count: 'exact', head: true }),
      supabase.from('hyper_messages').select('count', { count: 'exact', head: true }),
    ]);

    return {
      users: users.count || 0,
      conversations: conversations.count || 0,
      messages: messages.count || 0,
    };
  } catch (err) {
    console.error('Failed to get sync stats:', err);
    return null;
  }
}
