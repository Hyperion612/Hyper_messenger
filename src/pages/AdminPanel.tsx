import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Admin auth is handled via sessionStorage
import {
  Shield, Users, MessageCircle, BarChart3, Settings, Database,
  Bell, Globe, Lock, AlertTriangle, Activity, Server, Eye,
  Ban, CheckCircle, XCircle, Search, Filter, Download,
  Upload, RefreshCw, Terminal, FileText, Zap, Hash,
  TrendingUp, UserCheck, Clock, Cpu, HardDrive, Wifi
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const chartData = [
  { name: '00:00', users: 2400, messages: 4000 },
  { name: '04:00', users: 1398, messages: 3000 },
  { name: '08:00', users: 5800, messages: 8000 },
  { name: '12:00', users: 8908, messages: 12000 },
  { name: '16:00', users: 7490, messages: 9800 },
  { name: '20:00', users: 9210, messages: 11000 },
  { name: '23:59', users: 3490, messages: 5200 },
];

const weeklyData = [
  { name: 'Mon', dau: 45000, newUsers: 1200 },
  { name: 'Tue', dau: 48000, newUsers: 1400 },
  { name: 'Wed', dau: 52000, newUsers: 1800 },
  { name: 'Thu', dau: 49000, newUsers: 1100 },
  { name: 'Fri', dau: 55000, newUsers: 2100 },
  { name: 'Sat', dau: 62000, newUsers: 2800 },
  { name: 'Sun', dau: 58000, newUsers: 2400 },
];

const recentUsers = [
  { id: 1, name: 'john_doe', email: 'john@example.com', status: 'active', joined: '2026-01-15', messages: 1240, device: 'iOS 17' },
  { id: 2, name: 'alice_wonder', email: 'alice@mail.com', status: 'active', joined: '2026-01-10', messages: 890, device: 'Web' },
  { id: 3, name: 'bob_builder', email: 'bob@corp.com', status: 'banned', joined: '2025-12-20', messages: 45, device: 'Android' },
  { id: 4, name: 'charlie_dev', email: 'charlie@dev.io', status: 'active', joined: '2026-01-18', messages: 2100, device: 'Desktop' },
  { id: 5, name: 'suspicious_42', email: 'anon@temp.com', status: 'frozen', joined: '2026-01-20', messages: 3, device: 'Web' },
];

const auditLogs = [
  { id: 1, action: 'USER_BAN', user: 'bob_builder', admin: 'super-admin', time: '2 min ago', ip: '10.0.1.42', severity: 'warning' },
  { id: 2, action: 'FEATURE_FLAG', target: 'ai_summarize', admin: 'super-admin', time: '15 min ago', ip: '10.0.1.42', severity: 'info' },
  { id: 3, action: 'DB_BACKUP', target: 'full_backup', admin: 'super-admin', time: '1 hour ago', ip: '10.0.1.42', severity: 'info' },
  { id: 4, action: 'LOGIN_ATTEMPT', target: 'failed_auth', admin: 'unknown', time: '3 hours ago', ip: '185.220.101.42', severity: 'critical' },
  { id: 5, action: 'KEY_ROTATION', target: 'encryption_keys', admin: 'super-admin', time: '6 hours ago', ip: '10.0.1.42', severity: 'warning' },
];

type Tab = 'dashboard' | 'users' | 'content' | 'system' | 'security' | 'analytics' | 'database' | 'audit';

export default function AdminPanel() {
  const setIsAdminAuthenticated = (v: boolean) => {
    if (v) sessionStorage.setItem('hyper_admin_auth', 'true');
    else sessionStorage.removeItem('hyper_admin_auth');
  };
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sessionTimer, setSessionTimer] = useState(900); // 15 min

  const tabs: { id: Tab; icon: any; label: string }[] = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'content', icon: MessageCircle, label: 'Content' },
    { id: 'system', icon: Settings, label: 'System' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'database', icon: Database, label: 'Database' },
    { id: 'audit', icon: FileText, label: 'Audit Log' },
  ];

  const logout = () => {
    setIsAdminAuthenticated(false);
  };

  return (
    <div className="h-screen flex admin-mesh overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 h-full glass border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">Hyper Admin</h1>
              <p className="text-[10px] text-zinc-500">Super Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Session Timer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
            <Clock className="w-3 h-3" />
            <span>Session: {Math.floor(sessionTimer / 60)}:{(sessionTimer % 60).toString().padStart(2, '0')}</span>
          </div>
          <button 
            onClick={logout}
            className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
          >
            Lock & Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8"
          >
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'users' && <UsersView />}
            {activeTab === 'content' && <ContentView />}
            {activeTab === 'system' && <SystemView />}
            {activeTab === 'security' && <SecurityView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'database' && <DatabaseView />}
            {activeTab === 'audit' && <AuditView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function DashboardView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-500">Real-time system overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-400">All systems operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Users', value: '58,241', change: '+12%', icon: Users, color: 'text-blue-400' },
          { label: 'Messages/min', value: '12,847', change: '+8%', icon: MessageCircle, color: 'text-purple-400' },
          { label: 'Active Connections', value: '142,390', change: '+5%', icon: Wifi, color: 'text-green-400' },
          { label: 'Server Load', value: '34%', change: '-2%', icon: Cpu, color: 'text-amber-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-strong rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs text-green-400">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-strong rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Active Users (24h)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="users" stroke="#5c7cfa" fill="url(#gradientBlue)" strokeWidth={2} />
              <defs>
                <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5c7cfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5c7cfa" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-strong rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Weekly Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Bar dataKey="dau" fill="#5c7cfa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="newUsers" fill="#9775fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Recent Audit Events</h3>
        <div className="space-y-3">
          {auditLogs.slice(0, 4).map(log => (
            <div key={log.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  log.severity === 'critical' ? 'bg-red-500' : log.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <span className="text-sm text-white font-mono">{log.action}</span>
                <span className="text-xs text-zinc-500">→ {log.target || log.user}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-600 font-mono">{log.ip}</span>
                <span className="text-xs text-zinc-500">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersView() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-zinc-500">Manage all registered users</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl glass text-sm text-zinc-300 hover:text-white flex items-center gap-2">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button className="px-4 py-2 rounded-xl glass text-sm text-zinc-300 hover:text-white flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/30"
          />
        </div>
        <button className="px-4 py-2.5 rounded-xl glass text-sm text-zinc-300 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="glass-strong rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500">User</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500">Joined</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500">Messages</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500">Device</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-zinc-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map(user => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-white">{user.name}</div>
                    <div className="text-xs text-zinc-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                    user.status === 'active' ? 'bg-green-500/10 text-green-400' :
                    user.status === 'banned' ? 'bg-red-500/10 text-red-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {user.status === 'active' && <CheckCircle className="w-3 h-3" />}
                    {user.status === 'banned' && <Ban className="w-3 h-3" />}
                    {user.status === 'frozen' && <XCircle className="w-3 h-3" />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-400">{user.joined}</td>
                <td className="px-6 py-4 text-sm text-zinc-400">{user.messages.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-zinc-400">{user.device}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-amber-400">
                      <Ban className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-red-400">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContentView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Management</h1>
        <p className="text-sm text-zinc-500">Moderation, channels, and broadcast</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {[
          { title: 'Pending Reports', value: '23', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { title: 'Active Channels', value: '1,247', icon: Hash, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { title: 'Active Groups', value: '8,934', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-strong rounded-xl p-6">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {[
            { id: 1, type: 'spam', user: 'spammer_99', reporter: 'alice_wonder', time: '5m ago' },
            { id: 2, type: 'harassment', user: 'toxic_user', reporter: 'bob_safe', time: '12m ago' },
            { id: 3, type: 'illegal_content', user: 'bad_actor', reporter: 'system_auto', time: '1h ago' },
          ].map(report => (
            <div key={report.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  report.type === 'spam' ? 'bg-amber-500/10 text-amber-400' :
                  report.type === 'harassment' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-red-500/10 text-red-400'
                }`}>{report.type}</span>
                <span className="text-sm text-white">@{report.user}</span>
                <span className="text-xs text-zinc-500">reported by @{report.reporter}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">{report.time}</span>
                <button className="px-3 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs hover:bg-green-500/20">Resolve</button>
                <button className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20">Ban</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Broadcast Message</h3>
        <textarea 
          placeholder="Type system announcement..."
          className="w-full h-24 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/30 resize-none"
        />
        <div className="flex justify-end mt-3">
          <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white text-sm font-medium hover:opacity-90">
            Send Broadcast
          </button>
        </div>
      </div>
    </div>
  );
}

function SystemView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Configuration</h1>
        <p className="text-sm text-zinc-500">Feature flags, limits, and maintenance</p>
      </div>

      {/* Feature Flags */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Feature Flags</h3>
        <div className="space-y-3">
          {[
            { name: 'ai_summarize', enabled: true, desc: 'AI conversation summarization' },
            { name: 'video_calls', enabled: true, desc: 'HD video calls (WebRTC)' },
            { name: 'stories', enabled: true, desc: '24h disappearing stories' },
            { name: 'voice_messages', enabled: true, desc: 'Voice message recording' },
            { name: 'channels_v2', enabled: false, desc: 'New channel system (beta)' },
            { name: 'crypto_payments', enabled: false, desc: 'Cryptocurrency payments' },
          ].map((flag, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <div className="text-sm text-white font-mono">{flag.name}</div>
                <div className="text-xs text-zinc-500">{flag.desc}</div>
              </div>
              <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${flag.enabled ? 'bg-green-500' : 'bg-zinc-700'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${flag.enabled ? 'left-7' : 'left-1'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Limits */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">System Limits</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: 'Max file size', value: '100 MB' },
            { label: 'Message rate limit', value: '30/min' },
            { label: 'Max group members', value: '200,000' },
            { label: 'Max channels per user', value: '500' },
            { label: 'Story duration', value: '24 hours' },
            { label: 'Message history', value: 'Unlimited' },
          ].map((limit, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <span className="text-sm text-zinc-400">{limit.label}</span>
              <span className="text-sm text-white font-mono">{limit.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Maintenance Mode</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">Enable maintenance mode to show "Under Maintenance" to all users</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm hover:bg-amber-500/20">
            Enable
          </button>
        </div>
      </div>
    </div>
  );
}

function SecurityView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Security Center</h1>
        <p className="text-sm text-zinc-500">Sessions, keys, DDoS protection, and threat detection</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { label: 'Active Sessions', value: '1', icon: Eye, color: 'text-green-400' },
          { label: 'Blocked IPs', value: '2,847', icon: Ban, color: 'text-red-400' },
          { label: 'Threat Level', value: 'LOW', icon: Shield, color: 'text-green-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-strong rounded-xl p-5">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Active Sessions */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Active Admin Sessions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <div className="text-sm text-white">super-admin (You)</div>
                <div className="text-xs text-zinc-500">10.0.1.42 • Chrome 120 • macOS • Current session</div>
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs">Active</span>
          </div>
        </div>
      </div>

      {/* Encryption Keys */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Encryption Key Management</h3>
        <div className="space-y-3">
          {[
            { name: 'Master Encryption Key', lastRotated: '2026-01-15', status: 'active' },
            { name: 'JWT Signing Key', lastRotated: '2026-01-18', status: 'active' },
            { name: 'Admin Session Secret', lastRotated: '2026-01-20', status: 'active' },
            { name: 'API Gateway mTLS Cert', lastRotated: '2026-01-10', status: 'expires_soon' },
          ].map((key, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-zinc-500" />
                <div>
                  <div className="text-sm text-white font-mono">{key.name}</div>
                  <div className="text-xs text-zinc-500">Last rotated: {key.lastRotated}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  key.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                }`}>{key.status}</span>
                <button className="px-3 py-1 rounded-lg bg-white/5 text-zinc-400 text-xs hover:bg-white/10">
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DDoS Panel */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">DDoS Protection</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-zinc-500 mb-2">Blocked Regions</div>
            <div className="flex flex-wrap gap-2">
              {['North Korea', 'Unknown AS', 'Tor Exit Nodes'].map((region, i) => (
                <span key={i} className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs">{region}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-2">Last 24h Attacks Blocked</div>
            <div className="text-2xl font-bold text-white">14,291</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-zinc-500">DAU/MAU, retention, and growth metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'DAU', value: '58.2K', change: '+12.3%' },
          { label: 'MAU', value: '1.2M', change: '+8.7%' },
          { label: 'Retention (7d)', value: '68%', change: '+2.1%' },
          { label: 'Avg Session', value: '24m', change: '+5.4%' },
        ].map((stat, i) => (
          <div key={i} className="glass-strong rounded-xl p-5">
            <div className="text-xs text-zinc-500">{stat.label}</div>
            <div className="text-2xl font-bold text-white mt-1">{stat.value}</div>
            <div className="text-xs text-green-400 mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">User Growth (Weekly)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
            <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="dau" stroke="#5c7cfa" fill="url(#gradientBlue2)" strokeWidth={2} />
            <Area type="monotone" dataKey="newUsers" stroke="#9775fa" fill="url(#gradientPurple)" strokeWidth={2} />
            <defs>
              <linearGradient id="gradientBlue2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5c7cfa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#5c7cfa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientPurple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9775fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9775fa" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-strong rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Top Regions</h3>
          {[
            { region: 'United States', users: '32%', flag: '🇺🇸' },
            { region: 'Germany', users: '14%', flag: '🇩🇪' },
            { region: 'Japan', users: '11%', flag: '🇯🇵' },
            { region: 'Brazil', users: '9%', flag: '🇧🇷' },
            { region: 'United Kingdom', users: '8%', flag: '🇬🇧' },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-sm text-zinc-300">{r.flag} {r.region}</span>
              <span className="text-sm text-white font-mono">{r.users}</span>
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Device Distribution</h3>
          {[
            { device: 'iOS', pct: '38%', bar: 'bg-blue-500' },
            { device: 'Android', pct: '31%', bar: 'bg-green-500' },
            { device: 'Web', pct: '22%', bar: 'bg-purple-500' },
            { device: 'Desktop', pct: '9%', bar: 'bg-amber-500' },
          ].map((d, i) => (
            <div key={i} className="py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-zinc-300">{d.device}</span>
                <span className="text-sm text-white font-mono">{d.pct}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${d.bar} rounded-full`} style={{ width: d.pct }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DatabaseView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Database Management</h1>
        <p className="text-sm text-zinc-500">Backups, migrations, and SQL console</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { label: 'DB Size', value: '2.4 TB', icon: HardDrive, color: 'text-blue-400' },
          { label: 'Last Backup', value: '2h ago', icon: RefreshCw, color: 'text-green-400' },
          { label: 'Connections', value: '47/100', icon: Activity, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-strong rounded-xl p-5">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* SQL Console */}
      <div className="glass-strong rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-zinc-400" /> SQL Console
          </h3>
          <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs">READ-ONLY MODE</span>
        </div>
        <div className="bg-black/50 rounded-xl p-4 font-mono text-sm">
          <div className="text-zinc-500 mb-2">-- Read-only mode. Write operations require confirmation.</div>
          <div className="text-green-400">hyper_db=#</div>
          <div className="text-white">SELECT COUNT(*) FROM users WHERE status = 'active';</div>
          <div className="text-zinc-400 mt-2"> count</div>
          <div className="text-zinc-400">-------</div>
          <div className="text-white"> 1,247,893</div>
          <div className="text-zinc-500 mt-2">(1 row) • Execution time: 12ms</div>
        </div>
      </div>

      {/* Backups */}
      <div className="glass-strong rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Backups</h3>
          <button className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm hover:bg-green-500/20 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Create Backup
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'backup_2026-01-20_14:00', size: '2.4 TB', time: '2 hours ago', status: 'complete' },
            { name: 'backup_2026-01-20_02:00', size: '2.4 TB', time: '14 hours ago', status: 'complete' },
            { name: 'backup_2026-01-19_14:00', size: '2.3 TB', time: '1 day ago', status: 'complete' },
          ].map((backup, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-zinc-500" />
                <div>
                  <div className="text-sm text-white font-mono">{backup.name}</div>
                  <div className="text-xs text-zinc-500">{backup.size} • {backup.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs">{backup.status}</span>
                <button className="px-3 py-1 rounded-lg bg-white/5 text-zinc-400 text-xs hover:bg-white/10">Restore</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <p className="text-sm text-zinc-500">Immutable, append-only • Hash chain verified</p>
      </div>

      <div className="glass-strong rounded-xl p-4 flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
          <Lock className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-400">Hash chain verified</span>
        </div>
        <div className="flex-1" />
        <span className="text-xs text-zinc-500">Total entries: 1,247,891</span>
      </div>

      <div className="glass-strong rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500">Timestamp</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500">Action</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500">Target</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500">Admin</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500">IP</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-zinc-500">Severity</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-6 py-4 text-xs text-zinc-400 font-mono">{log.time}</td>
                <td className="px-6 py-4 text-sm text-white font-mono">{log.action}</td>
                <td className="px-6 py-4 text-sm text-zinc-400">{log.target || log.user}</td>
                <td className="px-6 py-4 text-sm text-zinc-400">{log.admin}</td>
                <td className="px-6 py-4 text-xs text-zinc-500 font-mono">{log.ip}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    log.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                    log.severity === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>{log.severity}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-3">Hash Chain Integrity</h3>
        <div className="bg-black/50 rounded-xl p-4 font-mono text-xs">
          <div className="text-zinc-500">Latest block hash:</div>
          <div className="text-green-400 break-all mt-1">
            0x7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
          </div>
          <div className="text-zinc-500 mt-3">Previous hash:</div>
          <div className="text-zinc-400 break-all mt-1">
            0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
          </div>
          <div className="text-green-400 mt-3">✓ Chain integrity verified</div>
        </div>
      </div>
    </div>
  );
}
