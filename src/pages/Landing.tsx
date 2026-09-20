import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Lock, Globe, MessageCircle, Video, Users, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: Lock, title: 'E2E Encryption', desc: 'Signal Protocol + MLS. Messages are unreadable to anyone, including us.' },
    { icon: Zap, title: 'Real-time', desc: 'WebSocket + WebTransport. Sub-50ms latency worldwide.' },
    { icon: Globe, title: 'Cross-platform', desc: 'Web, iOS, Android, Desktop. One account, everywhere.' },
    { icon: Video, title: 'Video Calls', desc: 'WebRTC-based HD video with AI noise cancellation.' },
    { icon: Users, title: 'Groups & Channels', desc: 'Up to 200K members. Threads, polls, reactions.' },
    { icon: Sparkles, title: 'AI Assistant', desc: 'Summarize, translate, smart replies. Built-in.' },
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
          
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/architecture')} className="text-sm text-zinc-400 hover:text-white transition-colors">
              Architecture
            </button>
            <button onClick={() => navigate('/app')} className="text-sm text-zinc-400 hover:text-white transition-colors">
              Demo App
            </button>
            <button 
              onClick={() => navigate('/app')}
              className="px-5 py-2 rounded-xl bg-hyper-600 hover:bg-hyper-500 text-white text-sm font-medium transition-all hover:scale-105"
            >
              Open Messenger
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
              <span className="text-sm text-zinc-300">Military-grade encryption • Zero-knowledge architecture</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="gradient-text">Hyper</span>
              <br />
              <span className="text-white">Messenger</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
              The most secure, feature-rich messenger built with zero-trust architecture. 
              End-to-end encrypted, cross-platform, AI-powered.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => navigate('/app')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-hyper-600 to-purple-600 text-white font-semibold text-lg hover:scale-105 transition-all shadow-lg shadow-hyper-500/20"
              >
                Launch Demo →
              </button>
              <button 
                onClick={() => navigate('/architecture')}
                className="px-8 py-4 rounded-2xl glass text-white font-semibold text-lg hover:scale-105 transition-all"
              >
                View Architecture
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
            Built for the <span className="gradient-text">future</span>
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
              { value: 'E2EE', label: 'Encryption' },
              { value: '<50ms', label: 'Latency' },
              { value: '99.99%', label: 'Uptime' },
              { value: '0', label: 'Data leaks' },
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

      {/* Architecture Teaser */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Enterprise Architecture</h2>
          <p className="text-zinc-400 mb-8">
            Microservices, event-driven, zero-trust. Built on Kubernetes with full observability.
          </p>
          <button 
            onClick={() => navigate('/architecture')}
            className="px-6 py-3 rounded-xl glass text-hyper-400 hover:text-hyper-300 font-medium transition-colors"
          >
            Explore Full Architecture →
          </button>
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
          <p className="text-sm text-zinc-600">© 2026 Hyper Messenger. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
