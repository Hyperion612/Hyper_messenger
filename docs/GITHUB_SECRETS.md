# 🔧 Настройка GitHub Secrets для деплоя

## Обязательные secrets

### Для Vercel деплоя:
```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

**Как получить:**
1. Зайдите на [vercel.com](https://vercel.com)
2. Settings → Tokens → Create Token
3. Скопируйте token
4. Для ORG_ID и PROJECT_ID смотрите в настройках проекта

### Для Docker деплоя:
Автоматически используется `GITHUB_TOKEN` (не нужно добавлять)

### Для SSH деплоя:
```bash
SSH_HOST=your-server.com
SSH_USERNAME=deploy
SSH_PRIVATE_KEY=-----BEGIN OPENSSH PRIVATE KEY-----...
SSH_PORT=22  # опционально
DEPLOY_PATH=/var/www/hyper  # опционально
PRODUCTION_URL=https://hyper.example.com  # опционально
```

**Как получить SSH_PRIVATE_KEY:**
```bash
# На локальной машине
cat ~/.ssh/id_rsa  # или id_ed25519
```

Скопируйте ВЕСЬ контент включая BEGIN/END строки.

### Для Kubernetes деплоя:
```bash
KUBE_CONFIG=your_kubeconfig_content
```

**Как получить:**
```bash
cat ~/.kube/config
```

Скопируйте ВЕСЬ YAML контент.

## Добавление secrets

### Через GitHub UI:
1. Зайдите в репозиторий на GitHub
2. Settings → Secrets and variables → Actions
3. New repository secret
4. Введите Name и Value
5. Add secret

### Через GitHub CLI:
```bash
# Vercel
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID

# SSH
gh secret set SSH_HOST
gh secret set SSH_USERNAME
gh secret set SSH_PRIVATE_KEY

# Kubernetes
gh secret set KUBE_CONFIG
```

## Environment-specific secrets

Можно создать secrets для разных environments:

```bash
# Production
gh secret set API_URL --env production
gh secret set DATABASE_URL --env production

# Staging
gh secret set API_URL --env staging
gh secret set DATABASE_URL --env staging
```

## Проверка secrets

```bash
# Список всех secrets
gh secret list

# Проверить конкретный secret
gh secret get VERCEL_TOKEN
```

## Troubleshooting

### Ошибка: "secret not found"
- Проверьте название secret (case-sensitive)
- Убедитесь, что secret добавлен в правильный репозиторий

### Ошибка: "permission denied"
- Проверьте permissions в workflow файле
- Для Docker нужен `packages: write`
- Для Pages нужен `pages: write` и `id-token: write`

### Ошибка: "authentication failed"
- Проверьте токены и ключи
- Убедитесь, что токены не истекли
- Для SSH проверьте, что ключ добавлен на сервер

## Security Best Practices

✅ **DO:**
- Использовать different tokens для different environments
- Ротировать токены каждые 90 дней
- Использовать least-privilege permissions
- Включить 2FA для всех участников

❌ **DON'T:**
- Коммитить secrets в код
- Использовать один token для всего
- Делиться secrets через незащищенные каналы
- Хранить secrets в plaintext

## Rotation Policy

Рекомендуется ротировать secrets:
- **API Keys**: каждые 90 дней
- **Deploy Tokens**: каждые 180 дней
- **SSH Keys**: каждые 365 дней
- **Database Credentials**: каждые 90 дней

## Audit Logging

GitHub автоматически логирует использование secrets:
- Settings → Secrets and variables → Actions → Audit log

Можно увидеть:
- Кто добавил/изменил secret
- Когда secret был использован
- В каком workflow

## Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CLI Reference](https://cli.github.com/manual/gh_secret)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
