# 📦 Структура проекта Hyper Messenger

## 📁 Директории и файлы

```
hyper-messenger/
├── .github/
│   └── workflows/
│       ├── ci.yml                      # CI: lint, typecheck, build, test
│       ├── docker.yml                  # Build & push Docker image
│       ├── deploy-vercel.yml           # Deploy to Vercel
│       ├── deploy-pages.yml            # Deploy to GitHub Pages
│       ├── deploy-ssh.yml              # Deploy to own server via SSH
│       ├── deploy-k8s.yml              # Deploy to Kubernetes
│       └── release.yml                 # Create GitHub release
│
├── k8s/
│   ├── deployment.yaml                 # Kubernetes Deployment
│   ├── service.yaml                    # Kubernetes Service
│   └── ingress.yaml                    # Kubernetes Ingress
│
├── docs/
│   └── GITHUB_SECRETS.md              # Инструкция по настройке secrets
│
├── src/
│   ├── pages/
│   │   ├── Landing.tsx                 # Главная страница
│   │   ├── Messenger.tsx               # Мессенджер (клиент)
│   │   ├── AdminLogin.tsx              # Логин админки
│   │   ├── AdminPanel.tsx              # Админ-панель
│   │   └── Architecture.tsx            # Документация архитектуры
│   ├── App.tsx                         # Главный компонент
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Глобальные стили
│
├── public/                             # Static assets
├── dist/                               # Build output (gitignore)
│
├── .dockerignore                       # Docker ignore file
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore file
├── Dockerfile                          # Multi-stage Docker build
├── docker-compose.yml                  # Docker Compose config
├── nginx.conf                          # Nginx configuration
├── README.md                           # Project documentation
├── DEPLOYMENT.md                       # This file
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
└── vite.config.js                      # Vite config
```

## 🚀 Быстрый деплой

### 1. Vercel (самый простой)

```bash
# 1. Push код в GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Добавить secrets в GitHub
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID

# 3. Готово! Автоматический деплой при push в main
```

### 2. Docker

```bash
# Build
docker build -t hyper-web .

# Run
docker run -p 80:80 hyper-web

# Или через docker-compose
docker-compose up -d
```

### 3. Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/

# Check status
kubectl get all -n hyper-production
```

## 🔄 CI/CD Pipeline

### При push в main:
1. ✅ CI workflow запускается автоматически
2. ✅ Lint + Typecheck
3. ✅ Build
4. ✅ Deploy (если настроен)

### При создании тега (v1.0.0):
1. ✅ Build artifacts
2. ✅ Create GitHub release
3. ✅ Upload archives
4. ✅ Generate changelog

## 🔐 Required Secrets

### Vercel:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### SSH:
- `SSH_HOST`
- `SSH_USERNAME`
- `SSH_PRIVATE_KEY`
- `DEPLOY_PATH` (optional)

### Kubernetes:
- `KUBE_CONFIG`

## 📊 Monitoring

После деплоя проверьте:
- GitHub Actions tab - статус workflows
- Vercel dashboard - логи деплоя
- Kubernetes dashboard - статус подов

## 🐛 Troubleshooting

### Build fails:
```bash
# Проверить локально
npm run typecheck
npm run build
```

### Deploy fails:
- Проверить secrets
- Проверить permissions в workflow
- Смотреть логи в GitHub Actions

### Docker fails:
```bash
# Проверить локально
docker build -t test .
docker run -p 80:80 test
```

## 📚 Additional Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Docs](https://vercel.com/docs)
- [Docker Docs](https://docs.docker.com)
- [Kubernetes Docs](https://kubernetes.io/docs)

---

**Need help?** Check [README.md](./README.md) or [GITHUB_SECRETS.md](./docs/GITHUB_SECRETS.md)
