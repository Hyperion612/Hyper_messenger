import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../lib/auth';
import { isConnected, clearCredentials, getCredentials } from '../lib/supabase';
import {
  ArrowLeft, Globe, Moon, Sun, Monitor, Bell, Lock, User,
  LogOut, Database, CheckCircle, X, Save
} from 'lucide-react';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  
  const [language, setLanguage] = useState(i18n.language || 'ru');
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(
    (localStorage.getItem('hyper_theme') as any) || 'dark'
  );
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saved, setSaved] = useState(false);
  
  const supabaseConnected = isConnected();
  const credentials = getCredentials();

  const changeLanguage = (lng: string) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem('hyper_language', lng);
  };

  const changeTheme = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('hyper_theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const saveProfile = () => {
    updateProfile({ fullName, bio });
    setEditingProfile(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDisconnect = () => {
    if (confirm(t('connect.disconnectConfirm'))) {
      clearCredentials();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen mesh-gradient overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/app')} className="p-2 rounded-lg hover:bg-white/5">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
            <h1 className="text-lg font-bold text-white">{t('settings.title')}</h1>
          </div>
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400">{t('common.success')}</span>
            </motion.div>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Profile Section */}
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-hyper-400" />
              {t('profile.title')}
            </h2>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="px-3 py-1.5 rounded-lg glass text-sm text-zinc-300 hover:text-white"
            >
              {editingProfile ? t('common.cancel') : t('common.edit')}
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-hyper-500/20 to-purple-500/20 flex items-center justify-center text-3xl">
              {user?.avatar || '👤'}
            </div>
            <div className="flex-1">
              {editingProfile ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('auth.fullName')}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-hyper-500/50"
                  />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={t('profile.bio')}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-hyper-500/50 resize-none"
                  />
                  <button
                    onClick={saveProfile}
                    className="px-4 py-2 rounded-lg bg-hyper-600 text-white text-sm font-medium flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t('profile.saveChanges')}
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-white font-medium">{user?.fullName}</h3>
                  <p className="text-sm text-zinc-400">@{user?.username}</p>
                  <p className="text-sm text-zinc-500">{user?.email}</p>
                  {user?.bio && <p className="text-xs text-zinc-500 mt-1">{user.bio}</p>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="glass-strong rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            {t('settings.appearance')}
          </h2>
          
          <div className="space-y-4">
            {/* Language */}
            <div>
              <label className="text-sm text-zinc-300 mb-2 block">{t('settings.language')}</label>
              <div className="flex gap-2">
                {[
                  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
                  { code: 'en', label: 'English', flag: '🇬🇧' },
                ].map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      language === lang.code
                        ? 'bg-hyper-500/10 border border-hyper-500/30 text-hyper-400'
                        : 'glass text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="text-sm text-zinc-300 mb-2 block">{t('settings.theme')}</label>
              <div className="flex gap-2">
                {[
                  { value: 'dark' as const, icon: Moon, label: t('settings.dark') },
                  { value: 'light' as const, icon: Sun, label: t('settings.light') },
                  { value: 'system' as const, icon: Monitor, label: t('settings.system') },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => changeTheme(opt.value)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      theme === opt.value
                        ? 'bg-hyper-500/10 border border-hyper-500/30 text-hyper-400'
                        : 'glass text-zinc-400 hover:text-white'
                    }`}
                  >
                    <opt.icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-strong rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" />
            {t('settings.notifications')}
          </h2>
          
          <div className="space-y-3">
            {[
              { label: t('settings.enableNotifications'), value: notifications, setter: setNotifications },
              { label: t('settings.sound'), value: sound, setter: setSound },
              { label: t('settings.readReceipts'), value: readReceipts, setter: setReadReceipts },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-300">{item.label}</span>
                <button
                  onClick={() => item.setter(!item.value)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    item.value ? 'bg-hyper-500' : 'bg-zinc-700'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    item.value ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Connection */}
        <div className="glass-strong rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-green-400" />
            {t('settings.connection')}
          </h2>
          
          {supabaseConnected && credentials ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-green-400">{t('settings.connectedTo')}</span>
                </div>
                <p className="text-xs text-zinc-500 font-mono">{credentials.url}</p>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20"
              >
                {t('settings.disconnect')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/connect')}
              className="w-full py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20"
            >
              Подключить Supabase
            </button>
          )}
        </div>

        {/* Account */}
        <div className="glass-strong rounded-2xl p-6 border border-red-500/20">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-400" />
            {t('settings.dangerZone')}
          </h2>
          
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl glass text-zinc-300 hover:text-white text-sm font-medium flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
