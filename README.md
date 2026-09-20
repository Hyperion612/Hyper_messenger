# 🚀 Hyper Messenger

Суперсовременный кроссплатформенный мессенджер с end-to-end шифрованием и изолированной супер-админ панелью.

![Hyper Messenger](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-proprietary-red)
![Build](https://img.shields.io/badge/build-passing-green)

## ✨ Возможности

### Клиентская часть
- 🔐 **End-to-End Encryption** (Signal Protocol / MLS)
- 💬 **Real-time обмен сообщениями** (WebSocket)
- 📱 **Кроссплатформенность** (Web, iOS, Android, Desktop)
- 🎥 **Видеозвонки** (WebRTC)
- 👥 **Групповые чаты и каналы** (до 200K участников)
- 🤖 **AI-ассистент** (суммаризация, перевод, умные ответы)
- 🌙 **Dark/Light темы** с glassmorphism UI
- 📴 **Оффлайн-режим** с синхронизацией

### Админ-панель (Super Admin)
- 👥 **Управление пользователями** (CRUD, бан, верификация)
- 🛡️ **Модерация контента** (репорты, каналы, broadcast)
- ⚙️ **Системные настройки** (feature flags, лимиты, maintenance)
- 📊 **Аналитика** (DAU/MAU, retention, география)
- 🔐 **Безопасность** (сессии, ключи, DDoS защита)
- 💾 **База данных** (бэкапы, SQL консоль, миграции)
- 📝 **Audit log** (immutable, hash chain)

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────────┐
│                    PUBLIC INTERNET                       │
└────────────────────────┬────────────────────────────────┘
                         │
                ┌────────▼────────┐
                │  CDN + WAF      │
                │  (CloudFlare)   │
                └────────┬────────┘
                         │
            ┌────────────▼────────────┐
            │   API Gateway (Kong)    │
            └─────┬──────────────┬────┘
                  │              │
         ┌────────▼─────┐  ┌────▼────────┐
         │ Client API   │  │ Admin API   │
         │ (Public)     │  │ (VPN Only)  │
         └──────┬───────┘  └─────┬───────┘
                │                 │
         ┌──────▼─────────────────▼──────┐
         │    Core Services (K8s)        │
         │  Auth | Chat | Media | AI     │
         └──────────────┬────────────────┘
                        │
         ┌──────────────▼────────────────┐
         │   PostgreSQL | Redis | S3     │
         └───────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** + TypeScript
- **Vite** (build tool)
- **Tailwind CSS v4** (styling)
- **Framer Motion** (animations)
- **React Router** (routing)
- **Recharts** (charts)
- **Lucide React** (icons)

### Backend (рекомендуемый)
- **Rust (Axum)** - Core API, WebSocket
- **Go** - Microservices
- **Node.js (NestJS)** - Admin API
- **PostgreSQL 16** - Primary database
- **Redis** - Cache, pub/sub
- **Kafka** - Event streaming
- **MinIO (S3)** - Media storage

### Infrastructure
- **Kubernetes** - Orchestration
- **Docker** - Containerization
- **Terraform** - IaC
- **Istio** - Service mesh
- **Vault** - Secrets management

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Clone repository
git clone https://github.com/your-org/hyper-messenger.git
cd hyper-messenger

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173)

### Сборка для production

```bash
npm run build
```

Результат в папке `dist/`

## 📦 Деплой

### Вариант 1: Vercel (рекомендуется)

1. Создайте проект на [Vercel](https://vercel.com)
2. Подключите GitHub репозиторий
3. Добавьте secrets в GitHub:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
4. Push в `main` branch автоматически задеплоит

### Вариант 2: Docker

```bash
# Build image
docker build -t hyper-web .

# Run container
docker run -p 80:80 hyper-web
```

Или через docker-compose:

```bash
docker-compose up -d
```

### Вариант 3: Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Check status
kubectl get pods -n hyper-production
```

### Вариант 4: GitHub Pages

1. Включите GitHub Pages в settings репозитория
2. Выберите source: GitHub Actions
3. Push в `main` branch

### Вариант 5: Собственный сервер (SSH)

1. Добавьте secrets в GitHub:
   - `SSH_HOST`
   - `SSH_USERNAME`
   - `SSH_PRIVATE_KEY`
   - `DEPLOY_PATH` (например, `/var/www/hyper`)
2. Push в `main` branch

## 🔐 Безопасность

### E2EE (End-to-End Encryption)
- **Signal Protocol** для 1:1 чатов
- **MLS (Messaging Layer Security)** для групп
- **AES-256-GCM** шифрование
- **Forward secrecy** (ключи ротируются)
- Сервер **НИКОГДА** не видит plaintext

### Admin Panel Isolation
- Отдельный URL (скрытый)
- VPN-only доступ
- Multi-factor authentication (TOTP + WebAuthn)
- Device fingerprint binding
- 15-minute session timeout
- Immutable audit log (hash chain)
- Auto-lockdown при подозрительной активности

### Security Headers
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
Content-Security-Policy: default-src 'self'
```

## 📊 Мониторинг

### Метрики
- **Prometheus** - сбор метрик
- **Grafana** - дашборды
- **Loki** - логи
- **Tempo** - трейсинг

### Алерты
- Error rate > 1% → PagerDuty
- P99 latency > 500ms → Slack
- CPU > 80% → Telegram
- Failed logins > 10/min → Telegram

## 🧪 Testing

```bash
# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

## 📝 Environment Variables

Скопируйте `.env.example` в `.env.local` и заполните:

```bash
cp .env.example .env.local
```

Основные переменные:
- `VITE_API_URL` - Backend API URL
- `VITE_WS_URL` - WebSocket URL
- `VITE_SENTRY_DSN` - Sentry error tracking
- `VITE_ENABLE_AI_ASSISTANT` - Feature flags

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

1. **CI** (`ci.yml`) - lint, typecheck, build, test
2. **Docker** (`docker.yml`) - build & push image
3. **Deploy Vercel** (`deploy-vercel.yml`) - deploy to Vercel
4. **Deploy Pages** (`deploy-pages.yml`) - deploy to GitHub Pages
5. **Deploy SSH** (`deploy-ssh.yml`) - deploy to own server
6. **Deploy K8s** (`deploy-k8s.yml`) - deploy to Kubernetes
7. **Release** (`release.yml`) - create GitHub release

### Release Process

```bash
# Create new version
npm version patch  # or minor, major

# Push tag
git push origin main --tags
```

Автоматически:
1. Build artifacts
2. Create GitHub release
3. Generate changelog
4. Upload archives

## 📚 Документация

- [Architecture](./docs/architecture.md) - полная архитектура
- [API Reference](./docs/api.md) - API документация
- [Security Model](./docs/security.md) - модель безопасности
- [Deployment Guide](./docs/deployment.md) - детальное руководство

## 🤝 Contributing

Этот проект приватный. Для внесения изменений свяжитесь с владельцем.

## 📄 License

Proprietary - All rights reserved.

## 🔗 Ссылки

- **Demo**: [hyper-messenger.vercel.app](https://hyper-messenger.vercel.app)
- **Admin Panel**: `/hyper-admin-7x9k` (скрытый URL)
- **Architecture Docs**: `/architecture`

---

**Создано с ❤️ для безопасной коммуникации**
