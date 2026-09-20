import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Lock, Globe, MessageCircle, Video, Users, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    { icon: Lock, title: t('landing.features.encryption'), desc: t('landing.features.encryptionDesc') },
    { icon: Zap, title: t('landing.features.realtime'), desc: t('landing.features.realtimeDesc') },
    { icon: Globe, title: t('landing.features.crossplatform'), desc: t('landing.features.crossplatformDesc') },
    { icon: Video, title: t('landing.features.video'), desc: t('landing.features.videoDesc') },
    { icon: Users, title: t('landing.features.groups'), desc: t('landing.features.groupsDesc') },
    { icon: Sparkles, title: t('landing.features.ai'), desc: t('landing.features.aiDesc') },
  ];

  return (
    <div className="min-h-screen mesh-gradient overflow-y-auto">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hyper-500 to-purple-500 flex items-center justify-center pulse-glow">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Hyper</span>
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate('/architecture')} className="text-sm text-zinc-400 hover:text-white transition-colors">
              {t('landing.nav.architecture')}
            </button>
            <button onClick={() => navigate('/connect')} className="text-sm text-zinc-400 hover:text-white transition-colors">
              {t('landing.nav.forDevelopers')}
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-xl bg-hyper-600 hover:bg-hyper-500 text-white text-sm font-medium transition-all hover:scale-105"
            >
              {t('landing.nav.openMessenger')}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Shield className="w-4 h-4 text-hyper-400" />
              <span className="text-sm text-zinc-300">{t('landing.description')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text">Hyper</span>
              <br />
              <span className="text-white">Messenger</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
              {t('landing.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-hyper-600 to-purple-600 text-white font-semibold text-lg hover:scale-105 transition-all shadow-lg shadow-hyper-500/20"
              >
                {t('landing.buttons.launchDemo')}
              </button>
              <button 
                onClick={() => navigate('/architecture')}
                className="px-8 py-4 rounded-2xl glass text-white font-semibold text-lg hover:scale-105 transition-all"
              >
                {t('landing.buttons.viewArchitecture')}
              </button>
              <button 
                onClick={() => navigate('/connect')}
                className="px-8 py-4 rounded-2xl glass text-hyper-400 font-semibold text-lg hover:scale-105 transition-all border border-hyper-500/20"
              >
                {t('landing.buttons.forDevelopers')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            {t('landing.title')}
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-strong rounded-2xl p-6 hover:scale-[1.02] transition-transform cursor-default group"
              >
                <div className="w-12 h-12 rounded-xl bg-hyper-500/10 flex items-center justify-center mb-4 group-hover:bg-hyper-500/20 transition-colors">
                  <f.icon className="w-6 h-6 text-hyper-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto glass-strong rounded-3xl p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 'E2EE', label: t('landing.stats.encryption') },
              { value: '<50ms', label: t('landing.stats.latency') },
              { value: '99.99%', label: t('landing.stats.uptime') },
              { value: '0', label: t('landing.stats.dataLeaks') },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl font-black gradient-text">{s.value}</div>
                <div className="text-sm text-zinc-500 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-hyper-500 to-purple-500 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">Hyper</span>
          </div>
          <p className="text-sm text-zinc-600">{t('landing.footer')}</p>
        </div>
      </footer>
    </div>
  );
}
