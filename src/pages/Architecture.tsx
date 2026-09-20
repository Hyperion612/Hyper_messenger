import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Server, Database, Shield, Globe, Cpu, HardDrive,
  Cloud, Lock, Wifi, Layers, GitBranch, Box, Terminal,
  Monitor, Smartphone, Code, Zap, Eye, AlertTriangle,
  CheckCircle, ChevronRight, Network, Key, FileCode,
  Activity, TrendingUp
} from 'lucide-react';

type Section = 'overview' | 'stack' | 'database' | 'security' | 'admin' | 'devops';

export default function Architecture() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('overview');

  const sections: { id: Section; label: string; icon: any }[] = [
    { id: 'overview', label: 'System Overview', icon: Network },
    { id: 'stack', label: 'Tech Stack', icon: Code },
    { id: 'database', label: 'Database Schema', icon: Database },
    { id: 'security', label: 'Security Model', icon: Shield },
    { id: 'admin', label: 'Admin Isolation', icon: Lock },
    { id: 'devops', label: 'DevOps & Infra', icon: Cloud },
  ];

  return (
    <div className="min-h-screen mesh-gradient overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-white/5">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Hyper Architecture</h1>
              <p className="text-xs text-zinc-500">Technical documentation & system design</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/app')}
            className="px-4 py-2 rounded-xl bg-hyper-600 text-white text-sm font-medium hover:bg-hyper-500"
          >
            Open Demo
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${
                activeSection === s.id 
                  ? 'bg-hyper-500/10 text-hyper-400 border border-hyper-500/20' 
                  : 'glass text-zinc-400 hover:text-white'
              }`}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'stack' && <StackSection />}
          {activeSection === 'database' && <DatabaseSection />}
          {activeSection === 'security' && <SecuritySection />}
          {activeSection === 'admin' && <AdminSection />}
          {activeSection === 'devops' && <DevOpsSection />}
        </motion.div>
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-8">
      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-4">System Architecture Diagram</h2>
        <p className="text-zinc-400 text-sm mb-6">High-level overview of the Hyper messenger infrastructure</p>
        
        {/* Architecture Diagram */}
        <div className="bg-black/30 rounded-xl p-6 font-mono text-xs overflow-x-auto">
          <pre className="text-zinc-300 leading-relaxed">{`
┌─────────────────────────────────────────────────────────────────────────┐
│                           PUBLIC INTERNET                                │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                          ┌────────▼────────┐
                          │   CloudFlare    │
                          │   CDN + WAF     │
                          │   DDoS Shield   │
                          └────────┬────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │     API Gateway (Kong)       │
                    │   Rate Limit • Auth • Route  │
                    └──────┬──────────────┬───────┘
                           │              │
              ┌────────────▼──┐    ┌──────▼────────────┐
              │  Client API   │    │   Admin API        │
              │  (Public)     │    │   (VPN Only)       │
              │  Port 443     │    │   Port 8443        │
              └───────┬───────┘    └──────┬─────────────┘
                      │                    │
         ┌────────────▼────────────────────▼──────────┐
         │          CORE SERVICES (Kubernetes)          │
         │                                              │
         │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
         │  │   Auth   │ │   Chat   │ │  Media   │    │
         │  │ Service  │ │ Service  │ │ Service  │    │
         │  └──────────┘ └──────────┘ └──────────┘    │
         │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
         │  │   AI     │ │  Notify  │ │  Admin   │    │
         │  │ Service  │ │ Service  │ │ Service  │    │
         │  └──────────┘ └──────────┘ └──────────┘    │
         └────────────────────┬───────────────────────┘
                              │
         ┌────────────────────▼───────────────────────┐
         │              DATA LAYER                      │
         │                                              │
         │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
         │  │PostgreSQL│ │  Redis   │ │   S3     │    │
         │  │ (Primary)│ │ (Cache)  │ │ (Media)  │    │
         │  └──────────┘ └──────────┘ └──────────┘    │
         │  ┌──────────┐ ┌──────────┐                  │
         │  │  Kafka   │ │  Loki    │                  │
         │  │ (Events) │ │  (Logs)  │                  │
         │  └──────────┘ └──────────┘                  │
         └────────────────────────────────────────────┘
          `}</pre>
        </div>
      </div>

      {/* Key Principles */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Layers,
            title: 'Microservices',
            desc: 'Event-driven architecture with Kafka/NATS. Each service independently deployable with its own database.',
            color: 'text-blue-400',
            bg: 'bg-blue-500/10'
          },
          {
            icon: Shield,
            title: 'Zero Trust',
            desc: 'mTLS between all services. Service mesh (Istio) for traffic management. No implicit trust.',
            color: 'text-green-400',
            bg: 'bg-green-500/10'
          },
          {
            icon: Lock,
            title: 'E2E Encryption',
            desc: 'Signal Protocol for 1:1, MLS for groups. Server never sees plaintext. Forward secrecy guaranteed.',
            color: 'text-purple-400',
            bg: 'bg-purple-500/10'
          },
        ].map((p, i) => (
          <div key={i} className="glass-strong rounded-xl p-6">
            <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center mb-4`}>
              <p.icon className={`w-6 h-6 ${p.color}`} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
            <p className="text-sm text-zinc-400">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Data Flow */}
      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Message Flow (E2EE)</h2>
        <div className="space-y-4">
          {[
            { step: 1, title: 'Key Exchange', desc: 'X3DH handshake establishes shared secret. Double Ratchet for forward secrecy.', icon: Key },
            { step: 2, title: 'Message Encryption', desc: 'Client encrypts with AES-256-GCM. Keys derived via HKDF. Sender key for groups (MLS).', icon: Lock },
            { step: 3, title: 'Transport', desc: 'Encrypted payload sent via WebSocket. Server stores only ciphertext + metadata.', icon: Wifi },
            { step: 4, title: 'Delivery', desc: 'Recipient decrypts locally. Ratchet advances. Key rotation every 1000 messages.', icon: CheckCircle },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-hyper-500/10 flex items-center justify-center flex-shrink-0">
                <s.icon className="w-5 h-5 text-hyper-400" />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-hyper-400 font-mono">Step {s.step}</span>
                  <h4 className="text-sm font-semibold text-white">{s.title}</h4>
                </div>
                <p className="text-xs text-zinc-400 mt-1">{s.desc}</p>
              </div>
              {i < 3 && <ChevronRight className="w-4 h-4 text-zinc-600 mt-3" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StackSection() {
  const stacks = [
    {
      category: 'Backend',
      items: [
        { name: 'Rust (Axum)', role: 'Core API, WebSocket server', why: 'Memory safety, zero-cost abstractions, 10x throughput vs Node.js' },
        { name: 'Go', role: 'Microservices, workers', why: 'Fast compilation, excellent concurrency, great for services' },
        { name: 'Node.js (NestJS)', role: 'Admin API, BFF layer', why: 'Rapid development, rich ecosystem' },
      ]
    },
    {
      category: 'Frontend',
      items: [
        { name: 'React + Next.js 14', role: 'Web client', why: 'SSR, RSC, excellent DX, massive ecosystem' },
        { name: 'React Native (Expo)', role: 'iOS & Android', why: 'Code sharing with web, native performance' },
        { name: 'Tauri', role: 'Desktop (Win/Mac/Linux)', why: 'Rust backend, tiny binary, native feel' },
      ]
    },
    {
      category: 'Data',
      items: [
        { name: 'PostgreSQL 16', role: 'Primary database', why: 'ACID, JSONB, full-text search, partitioning' },
        { name: 'Redis Cluster', role: 'Cache, pub/sub, sessions', why: 'Sub-ms latency, data structures, pub/sub' },
        { name: 'Apache Kafka', role: 'Event streaming', why: 'Durability, ordering, replay, exactly-once semantics' },
        { name: 'MinIO (S3)', role: 'Media storage', why: 'S3-compatible, self-hosted, erasure coding' },
      ]
    },
    {
      category: 'Infrastructure',
      items: [
        { name: 'Kubernetes (EKS)', role: 'Orchestration', why: 'Auto-scaling, self-healing, declarative' },
        { name: 'Terraform', role: 'IaC', why: 'Multi-cloud, state management, modules' },
        { name: 'Istio', role: 'Service mesh', why: 'mTLS, traffic management, observability' },
        { name: 'Vault', role: 'Secrets management', why: 'Dynamic secrets, encryption as a service, audit' },
      ]
    },
    {
      category: 'Observability',
      items: [
        { name: 'Grafana + Prometheus', role: 'Metrics & dashboards', why: 'Industry standard, alerting, visualization' },
        { name: 'Loki + Tempo', role: 'Logs & traces', why: 'Cost-effective, correlated with metrics' },
        { name: 'Sentry', role: 'Error tracking', why: 'Real-time alerts, source maps, release tracking' },
      ]
    },
  ];

  return (
    <div className="space-y-8">
      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Technology Stack</h2>
        <p className="text-zinc-400 text-sm">Optimized for performance, security, and developer experience</p>
      </div>

      {stacks.map((stack, i) => (
        <div key={i} className="glass-strong rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Box className="w-5 h-5 text-hyper-400" />
            {stack.category}
          </h3>
          <div className="space-y-3">
            {stack.items.map((item, j) => (
              <div key={j} className="flex items-start gap-4 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{item.name}</span>
                    <span className="text-xs text-zinc-500">— {item.role}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DatabaseSection() {
  return (
    <div className="space-y-8">
      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Database Schema (ER Diagram)</h2>
        <p className="text-zinc-400 text-sm">PostgreSQL with separate schemas for client and admin data</p>
      </div>

      {/* ER Diagram */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-hyper-400" /> Core Entities
        </h3>
        <div className="bg-black/30 rounded-xl p-6 font-mono text-xs overflow-x-auto">
          <pre className="text-zinc-300">{`
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│       users         │     │    conversations    │     │     messages        │
├─────────────────────┤     ├─────────────────────┤     ├─────────────────────┤
│ id (UUID) PK        │     │ id (UUID) PK        │     │ id (UUID) PK        │
│ username            │◄────│ type (dm/group/chan)│◄────│ conversation_id FK  │
│ email (encrypted)   │     │ created_at          │     │ sender_id FK        │
│ password_hash       │     │ metadata (JSONB)    │     │ ciphertext (bytea)  │
│ public_key (bytea)  │     │ last_message_at     │     │ nonce (bytea)       │
│ identity_key        │     │ member_count        │     │ created_at          │
│ status              │     │ is_archived         │     │ status              │
│ avatar_url          │     └─────────────────────┘     │ device_id           │
│ created_at          │                                  └─────────────────────┘
│ updated_at          │     ┌─────────────────────┐     ┌─────────────────────┐
│ last_seen           │     │  conversation_members│    │    devices          │
│ totp_secret         │     ├─────────────────────┤     ├─────────────────────┤
│ is_verified         │     │ conversation_id FK  │     │ id (UUID) PK        │
│ role                │     │ user_id FK          │     │ user_id FK          │
│ mfa_enabled         │     │ role (admin/member) │     │ device_name         │
│ frozen_at           │     │ joined_at           │     │ platform            │
│ banned_at           │     │ muted_until         │     │ push_token          │
└─────────────────────┘     └─────────────────────┘     │ last_active         │
                                                         │ is_active           │
┌─────────────────────┐     ┌─────────────────────┐     └─────────────────────┘
│    media_files      │     │     reactions       │
├─────────────────────┤     ├─────────────────────┤
│ id (UUID) PK        │     │ id (UUID) PK        │
│ message_id FK       │     │ message_id FK       │
│ type (image/video/  │     │ user_id FK          │
│   voice/document)   │     │ emoji               │
│ storage_key         │     │ created_at          │
│ mime_type           │     └─────────────────────┘
│ size_bytes          │
│ encryption_key      │     ┌─────────────────────┐
│ thumbnail_key       │     │    reports          │
│ uploaded_by FK      │     ├─────────────────────┤
│ created_at          │     │ id (UUID) PK        │
│ processed_at        │     │ reporter_id FK      │
└─────────────────────┘     │ target_type         │
                             │ target_id           │
                             │ reason              │
                             │ status (pending/    │
                             │   resolved/rejected)│
                             │ resolved_by FK      │
                             │ created_at          │
                             └─────────────────────┘
          `}</pre>
        </div>
      </div>

      {/* Admin Schema */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-400" /> Admin Schema (Isolated)
        </h3>
        <div className="bg-black/30 rounded-xl p-6 font-mono text-xs overflow-x-auto">
          <pre className="text-zinc-300">{`
┌─────────────────────────┐     ┌─────────────────────────┐
│    admin_sessions       │     │     audit_log           │
├─────────────────────────┤     ├─────────────────────────┤
│ id (UUID) PK            │     │ id (BIGSERIAL) PK       │
│ admin_user_id           │     │ action (ENUM)           │
│ device_fingerprint      │     │ target_type             │
│ ip_address              │     │ target_id               │
│ user_agent              │     │ admin_id                │
│ totp_verified           │     │ ip_address              │
│ expires_at              │     │ previous_hash           │
│ created_at              │     │ current_hash            │
│ last_activity           │     │ metadata (JSONB)        │
│ revoked_at              │     │ severity (ENUM)         │
└─────────────────────────┘     │ created_at              │
                                └─────────────────────────┘
┌─────────────────────────┐     ┌─────────────────────────┐
│    feature_flags        │     │    rate_limits          │
├─────────────────────────┤     ├─────────────────────────┤
│ id (UUID) PK            │     │ id (UUID) PK            │
│ name (UNIQUE)           │     │ resource_type           │
│ enabled                 │     │ limit_value             │
│ rollout_percentage      │     │ window_seconds          │
│ target_segments         │     │ scope (global/user/role)│
│ created_at              │     │ created_at              │
│ updated_at              │     │ updated_at              │
└─────────────────────────┘     └─────────────────────────┘
          `}</pre>
        </div>
      </div>

      {/* Indexes */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Key Indexes & Partitions</h3>
        <div className="space-y-2 font-mono text-xs">
          {[
            'CREATE INDEX idx_messages_conversation_time ON messages (conversation_id, created_at DESC);',
            'CREATE INDEX idx_users_username_trgm ON users USING gin (username gin_trgm_ops);',
            'CREATE INDEX idx_audit_log_created ON audit_log (created_at DESC);',
            'PARTITION messages BY RANGE (created_at); -- Monthly partitions',
            'CREATE INDEX idx_conversations_members ON conversation_members USING gin (user_id);',
          ].map((sql, i) => (
            <div key={i} className="p-3 rounded-lg bg-black/30 text-green-400">{sql}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-8">
      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">Security Model</h2>
        <p className="text-zinc-400 text-sm">Defense in depth with multiple security layers</p>
      </div>

      {/* Security Layers */}
      <div className="space-y-4">
        {[
          {
            layer: 'Layer 1: Network',
            items: ['CloudFlare WAF + DDoS protection', 'IP whitelisting for admin endpoints', 'mTLS between all services (Istio)', 'VPN-only admin access (WireGuard/Tailscale)', 'Separate network segments (VPC per tier)'],
            icon: Globe,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10'
          },
          {
            layer: 'Layer 2: Application',
            items: ['Rate limiting (per IP + per user)', 'Input validation (Zod schemas)', 'CSP headers + CORS strict policy', 'CSRF tokens for state-changing ops', 'SQL injection prevention (parameterized queries)'],
            icon: Shield,
            color: 'text-green-400',
            bg: 'bg-green-500/10'
          },
          {
            layer: 'Layer 3: Authentication',
            items: ['Argon2id password hashing (memory: 64MB)', 'TOTP (RFC 6238) + WebAuthn/FIDO2', 'Short-lived JWTs (5 min) + refresh rotation', 'Device fingerprint binding', 'Session timeout (15 min inactivity)'],
            icon: Key,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10'
          },
          {
            layer: 'Layer 4: Encryption',
            items: ['E2EE: Signal Protocol (X3DH + Double Ratchet)', 'Group E2EE: Messaging Layer Security (MLS)', 'At-rest: AES-256-GCM with per-row keys', 'In-transit: TLS 1.3 everywhere', 'Key rotation: automatic every 1000 messages'],
            icon: Lock,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10'
          },
          {
            layer: 'Layer 5: Data',
            items: ['Encrypted email storage (AES-256)', 'PII minimization (only necessary data)', 'GDPR compliance + data export', 'Immutable audit logs (hash chain)', 'Encrypted backups (client-side keys)'],
            icon: Database,
            color: 'text-red-400',
            bg: 'bg-red-500/10'
          },
        ].map((layer, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-strong rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${layer.bg} flex items-center justify-center`}>
                <layer.icon className={`w-5 h-5 ${layer.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white">{layer.layer}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {layer.items.map((item, j) => (
                <div key={j} className="flex items-center gap-2 text-sm text-zinc-300">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pentest Checklist */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" /> Pentest Checklist
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'OWASP Top 10 coverage',
            'E2EE implementation audit',
            'Key exchange verification',
            'Rate limiting stress test',
            'SQL injection scan',
            'XSS/CSRF testing',
            'Authentication bypass attempts',
            'Session fixation testing',
            'API authorization checks',
            'Denial of service testing',
            'Cryptographic implementation review',
            'Supply chain audit (dependencies)',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-zinc-300 p-2 rounded-lg bg-white/[0.02]">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminSection() {
  return (
    <div className="space-y-8">
      <div className="glass-strong rounded-2xl p-8 border border-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Admin Module Isolation</h2>
            <p className="text-sm text-zinc-400">Complete separation from user-facing systems</p>
          </div>
        </div>
      </div>

      {/* Isolation Diagram */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Network Isolation Architecture</h3>
        <div className="bg-black/30 rounded-xl p-6 font-mono text-xs overflow-x-auto">
          <pre className="text-zinc-300">{`
┌─────────────────────────────────────────────────────────────────┐
│                     PRODUCTION NETWORK                           │
│                                                                  │
│  ┌──────────────────────┐    ┌──────────────────────────────┐   │
│  │   PUBLIC ZONE         │    │   ADMIN ZONE (Isolated)      │   │
│  │                       │    │                              │   │
│  │  ┌─────────────────┐  │    │  ┌────────────────────────┐ │   │
│  │  │  Client App     │  │    │  │  Admin App             │ │   │
│  │  │  (Next.js)      │  │    │  │  (Separate codebase)   │ │   │
│  │  └────────┬────────┘  │    │  └───────────┬────────────┘ │   │
│  │           │           │    │              │              │   │
│  │  ┌────────▼────────┐  │    │  ┌───────────▼────────────┐ │   │
│  │  │  Client API     │  │    │  │  Admin API             │ │   │
│  │  │  Port 443       │  │    │  │  Port 8443 (internal)  │ │   │
│  │  └────────┬────────┘  │    │  └───────────┬────────────┘ │   │
│  │           │           │    │              │              │   │
│  └───────────┼───────────┘    └──────────────┼──────────────┘   │
│              │                               │                  │
│              │         ┌─────────┐           │                  │
│              └────────►│ Shared  │◄──────────┘                  │
│                        │  Data   │                              │
│                        │  Layer  │  ← Different DB schemas      │
│                        └─────────┘  ← Separate JWT secrets      │
│                                     ← mTLS required             │
│                                     ← VPN gateway only          │
└─────────────────────────────────────────────────────────────────┘

Access Path:
User → VPN (WireGuard) → IP Whitelist Check → mTLS Verify → Admin App
          `}</pre>
        </div>
      </div>

      {/* Security Measures */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-strong rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-400" /> Authentication
          </h3>
          <div className="space-y-2">
            {[
              'Username + password (Argon2id)',
              'TOTP (mandatory second factor)',
              'WebAuthn/Passkeys support',
              'Hardware key (YubiKey) option',
              'Device fingerprint verification',
              '15-minute session timeout',
              'Single active session only',
              'Instant revocation capability',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                <CheckCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" /> Stealth & Protection
          </h3>
          <div className="space-y-2">
            {[
              'No links to admin in client app',
              'Hidden URL path (obscured)',
              'No robots.txt / sitemap entries',
              'Fake 404 for unauthorized access',
              'Rate limiting + honeypot endpoints',
              'fail2ban on auth failures',
              'Auto-lockdown after 5 failures',
              'Telegram alert on suspicious activity',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-green-400" /> Immutable Audit Trail
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Every action logged', desc: 'User mgmt, config changes, logins' },
            { label: 'Append-only storage', desc: 'No DELETE/UPDATE on audit table' },
            { label: 'Hash chain integrity', desc: 'SHA-256 linked blocks' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-lg bg-white/[0.02]">
              <div className="text-sm font-medium text-white">{item.label}</div>
              <div className="text-xs text-zinc-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-black/30 rounded-xl p-4 font-mono text-xs">
          <div className="text-zinc-500">// Audit log entry structure</div>
          <div className="text-white mt-1">{`{`}</div>
          <div className="text-zinc-300 ml-4">{`"id": "uuid-v7",`}</div>
          <div className="text-zinc-300 ml-4">{`"action": "USER_BAN",`}</div>
          <div className="text-zinc-300 ml-4">{`"target": { "type": "user", "id": "..." },`}</div>
          <div className="text-zinc-300 ml-4">{`"admin_id": "super-admin",`}</div>
          <div className="text-zinc-300 ml-4">{`"ip": "10.0.1.42",`}</div>
          <div className="text-zinc-300 ml-4">{`"device_fingerprint": "sha256:abc...",`}</div>
          <div className="text-zinc-300 ml-4">{`"previous_hash": "0x7f8a...",`}</div>
          <div className="text-zinc-300 ml-4">{`"current_hash": "0x3b2c...",`}</div>
          <div className="text-zinc-300 ml-4">{`"timestamp": "2026-01-20T14:30:00Z"`}</div>
          <div className="text-white">{`}`}</div>
        </div>
      </div>

      {/* What Admin CAN'T see */}
      <div className="glass-strong rounded-xl p-6 border border-green-500/20">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-400" /> E2EE Boundary — What Admin CANNOT Access
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-medium text-red-400 mb-2">✗ CANNOT SEE</h4>
            <div className="space-y-1">
              {['Message content (plaintext)', 'Media file contents', 'Voice message audio', 'Video call data', 'E2EE keys'].map((item, i) => (
                <div key={i} className="text-sm text-zinc-400 flex items-center gap-2">
                  <X className="w-3 h-3 text-red-400" /> {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium text-green-400 mb-2">✓ CAN SEE (Metadata only)</h4>
            <div className="space-y-1">
              {['User registration dates', 'Message counts & timestamps', 'Group membership lists', 'Device info (not content)', 'Report statistics'].map((item, i) => (
                <div key={i} className="text-sm text-zinc-400 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function DevOpsSection() {
  return (
    <div className="space-y-8">
      <div className="glass-strong rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2">DevOps & Infrastructure</h2>
        <p className="text-zinc-400 text-sm">CI/CD, Kubernetes, monitoring, and deployment strategy</p>
      </div>

      {/* CI/CD Pipeline */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-hyper-400" /> CI/CD Pipeline
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { label: 'Push to Git', icon: Code, color: 'bg-blue-500/10 text-blue-400' },
            { label: 'Lint + Type Check', icon: CheckCircle, color: 'bg-green-500/10 text-green-400' },
            { label: 'Unit Tests', icon: CheckCircle, color: 'bg-green-500/10 text-green-400' },
            { label: 'Integration Tests', icon: CheckCircle, color: 'bg-green-500/10 text-green-400' },
            { label: 'Build Image', icon: Box, color: 'bg-purple-500/10 text-purple-400' },
            { label: 'Security Scan', icon: Shield, color: 'bg-amber-500/10 text-amber-400' },
            { label: 'Deploy Staging', icon: Cloud, color: 'bg-cyan-500/10 text-cyan-400' },
            { label: 'E2E Tests', icon: CheckCircle, color: 'bg-green-500/10 text-green-400' },
            { label: 'Deploy Prod', icon: Zap, color: 'bg-red-500/10 text-red-400' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${step.color} text-xs font-medium`}>
                <step.icon className="w-3.5 h-3.5" />
                {step.label}
              </div>
              {i < 8 && <ChevronRight className="w-4 h-4 text-zinc-600" />}
            </div>
          ))}
        </div>
      </div>

      {/* Kubernetes */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Server className="w-4 h-4 text-hyper-400" /> Kubernetes Manifest (Example)
        </h3>
        <div className="bg-black/30 rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-zinc-300">{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: hyper-chat-service
  namespace: hyper-production
spec:
  replicas: 3
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: chat-service
  template:
    metadata:
      labels:
        app: chat-service
      annotations:
        sidecar.istio.io/inject: "true"
    spec:
      containers:
      - name: chat-service
        image: registry.hyper.internal/chat-service:v2.4.1
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: hyper-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: hyper-secrets
              key: redis-url
        ports:
        - containerPort: 8080
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5`}</pre>
        </div>
      </div>

      {/* Monitoring */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-strong rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" /> Monitoring Stack
          </h3>
          <div className="space-y-3">
            {[
              { tool: 'Prometheus', desc: 'Metrics collection (15s scrape)' },
              { tool: 'Grafana', desc: 'Dashboards + alerting rules' },
              { tool: 'Loki', desc: 'Log aggregation (label-based)' },
              { tool: 'Tempo', desc: 'Distributed tracing (Jaeger-compatible)' },
              { tool: 'AlertManager', desc: 'PagerDuty/Telegram/Slack alerts' },
              { tool: 'Sentry', desc: 'Error tracking + release management' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-white">{item.tool}</span>
                <span className="text-xs text-zinc-500">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Alert Rules
          </h3>
          <div className="space-y-3">
            {[
              { rule: 'Error rate > 1%', severity: 'critical', channel: 'PagerDuty' },
              { rule: 'P99 latency > 500ms', severity: 'warning', channel: 'Slack' },
              { rule: 'CPU > 80% for 5min', severity: 'warning', channel: 'Telegram' },
              { rule: 'Disk > 90%', severity: 'critical', channel: 'PagerDuty' },
              { rule: 'Failed login attempts > 10/min', severity: 'critical', channel: 'Telegram' },
              { rule: 'Certificate expiry < 7 days', severity: 'warning', channel: 'Slack' },
            ].map((alert, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-sm text-white">{alert.rule}</div>
                  <div className="text-xs text-zinc-500">→ {alert.channel}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  alert.severity === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                }`}>{alert.severity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deployment Strategy */}
      <div className="glass-strong rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Deployment Strategy</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { strategy: 'Blue-Green', desc: 'Zero-downtime deployments. Instant rollback.', icon: Zap, color: 'text-blue-400' },
            { strategy: 'Canary', desc: '5% → 25% → 100% rollout with auto-promotion.', icon: TrendingUp, color: 'text-green-400' },
            { strategy: 'Feature Flags', desc: 'Decouple deploy from release. Kill switch.', icon: ToggleLeft, color: 'text-purple-400' },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-lg bg-white/[0.02]">
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <div className="text-sm font-medium text-white">{s.strategy}</div>
              <div className="text-xs text-zinc-500 mt-1">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToggleLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
      <circle cx="8" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}
