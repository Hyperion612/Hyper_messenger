import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, CheckCircle, XCircle, Loader2, Eye, EyeOff, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { saveCredentials, testConnection, isConnected, getCredentials, clearCredentials } from '../lib/supabase';

export default function Connect() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const connected = isConnected();
  const credentials = getCredentials();

  const handleTest = async () => {
    if (!url || !key) {
      setStatus('error');
      setErrorMsg('Please fill in both fields');
      return;
    }

    setTesting(true);
    setStatus('idle');
    setErrorMsg('');

    const result = await testConnection(url, key);
    setTesting(false);

    if (result.success) {
      saveCredentials({ url, key, connectedAt: new Date().toISOString() });
      setStatus('success');
      setTimeout(() => {
        navigate('/app');
      }, 1500);
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Connection failed');
    }
  };

  const handleDisconnect = () => {
    if (confirm('Are you sure you want to disconnect from Supabase? All synced data will remain in your Supabase project.')) {
      clearCredentials();
      setUrl('');
      setKey('');
      setStatus('idle');
      window.location.reload();
    }
  };

  const copySqlSchema = () => {
    const sql = `-- Hyper Messenger Database Schema
-- Run this in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS hyper_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS hyper_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('dm', 'group', 'channel', 'bot')),
  name TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation members
CREATE TABLE IF NOT EXISTS hyper_conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES hyper_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES hyper_users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS hyper_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES hyper_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES hyper_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  encrypted BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON hyper_messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_members_user ON hyper_conversation_members(user_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE hyper_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hyper_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hyper_conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE hyper_messages ENABLE ROW LEVEL SECURITY;

-- Allow all operations for demo (adjust for production)
CREATE POLICY "Enable all for authenticated users" ON hyper_users FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON hyper_conversations FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON hyper_conversation_members FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON hyper_messages FOR ALL USING (true);`;

    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen mesh-gradient overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Developer Connection</h1>
              <p className="text-xs text-zinc-500">Connect to your Supabase backend</p>
            </div>
          </div>
          {connected && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400">Connected</span>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Connection Status */}
        {connected && credentials && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-6 border border-green-500/20"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Connected to Supabase</h3>
                  <p className="text-sm text-zinc-400 mb-2">Your data is synced with the cloud database</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="font-mono">{credentials.url}</span>
                    <span>•</span>
                    <span>Connected {new Date(credentials.connectedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </motion.div>
        )}

        {/* Connection Form */}
        {!connected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-hyper-500/10 flex items-center justify-center">
                <Database className="w-6 h-6 text-hyper-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Connect to Supabase</h2>
                <p className="text-sm text-zinc-400">Enter your project credentials to enable cloud sync</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-300 mb-2 block font-medium">
                  Project URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-hyper-500/50 transition-colors"
                />
                <p className="text-xs text-zinc-500 mt-1.5">
                  Find this in your Supabase project settings → API → Project URL
                </p>
              </div>

              <div>
                <label className="text-sm text-zinc-300 mb-2 block font-medium">
                  Anon/Public Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-hyper-500/50 transition-colors pr-12 font-mono"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/5"
                  >
                    {showKey ? <EyeOff className="w-4 h-4 text-zinc-500" /> : <Eye className="w-4 h-4 text-zinc-500" />}
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-1.5">
                  Use the anon/public key from Settings → API → Project API keys
                </p>
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-green-400">Connection successful! Redirecting...</span>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm text-red-400 font-medium">Connection failed</span>
                    <p className="text-xs text-red-400/70 mt-1">{errorMsg}</p>
                  </div>
                </motion.div>
              )}

              <button
                onClick={handleTest}
                disabled={testing || !url || !key}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-hyper-600 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testing connection...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Connect & Sync
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Setup Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Database Setup Required
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Before connecting, you need to create the required tables in your Supabase project.
            Run the following SQL in your Supabase SQL Editor:
          </p>

          <div className="relative">
            <div className="bg-black/50 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
              <pre className="text-zinc-300 whitespace-pre-wrap">{`-- Hyper Messenger Database Schema
-- Run this in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS hyper_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS hyper_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('dm', 'group', 'channel', 'bot')),
  name TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation members
CREATE TABLE IF NOT EXISTS hyper_conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES hyper_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES hyper_users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS hyper_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES hyper_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES hyper_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  encrypted BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation 
  ON hyper_messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_members_user 
  ON hyper_conversation_members(user_id);

-- Enable Row Level Security
ALTER TABLE hyper_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hyper_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hyper_conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE hyper_messages ENABLE ROW LEVEL SECURITY;

-- Allow all operations (adjust for production)
CREATE POLICY "Enable all" ON hyper_users FOR ALL USING (true);
CREATE POLICY "Enable all" ON hyper_conversations FOR ALL USING (true);
CREATE POLICY "Enable all" ON hyper_conversation_members FOR ALL USING (true);
CREATE POLICY "Enable all" ON hyper_messages FOR ALL USING (true);`}</pre>
            </div>
            <button
              onClick={copySqlSchema}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy SQL
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <a
              href="https://supabase.com/dashboard/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm hover:bg-green-500/20 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Create Supabase Project
            </a>
            <a
              href="https://supabase.com/docs/guides/database"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl glass text-zinc-300 text-sm hover:text-white transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Supabase Docs
            </a>
          </div>
        </motion.div>

        {/* What gets synced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">What Gets Synced</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Users', desc: 'User profiles and metadata', icon: '👤' },
              { title: 'Conversations', desc: 'Chats, groups, channels', icon: '💬' },
              { title: 'Messages', desc: 'All message content', icon: '📨' },
              { title: 'Members', desc: 'Group memberships', icon: '👥' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-medium text-white">{item.title}</div>
                  <div className="text-xs text-zinc-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-4">
            All data is stored in your Supabase project. You have full control and can export/delete anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
