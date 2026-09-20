# 🔗 Подключение к Supabase

Hyper Messenger поддерживает полную синхронизацию данных с Supabase для облачного хранения.

## 🚀 Быстрый старт

### 1. Создайте проект в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "New Project"
3. Заполните данные проекта
4. Дождитесь создания (1-2 минуты)

### 2. Создайте таблицы

1. В Supabase Dashboard перейдите в **SQL Editor**
2. Скопируйте SQL-схему со страницы подключения или ниже
3. Выполните SQL-запрос

<details>
<summary>📋 SQL Schema (нажмите чтобы развернуть)</summary>

```sql
-- Hyper Messenger Database Schema

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
CREATE POLICY "Enable all" ON hyper_messages FOR ALL USING (true);
```

</details>

### 3. Получите credentials

1. В Supabase Dashboard перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL** (например: `https://abcdefg.supabase.co`)
   - **anon/public key** (длинный JWT токен)

### 4. Подключите в Hyper

1. Откройте Hyper Messenger
2. Нажмите кнопку **"Для разработчиков"** в навигации
3. Введите:
   - Project URL
   - Anon/Public Key
4. Нажмите **"Connect & Sync"**

✅ Готово! Теперь все сообщения синхронизируются с Supabase.

## 📊 Что синхронизируется

| Данные | Таблица | Описание |
|--------|---------|----------|
| 👤 Users | `hyper_users` | Профили пользователей |
| 💬 Conversations | `hyper_conversations` | Чаты, группы, каналы |
| 📨 Messages | `hyper_messages` | Все сообщения |
| 👥 Members | `hyper_conversation_members` | Участники групп |

## 🔐 Безопасность

### Row Level Security (RLS)

По умолчанию включены открытые политики для демо. Для production:

```sql
-- Пример: только авторизованные пользователи
CREATE POLICY "Users can view own data" 
ON hyper_messages 
FOR SELECT 
USING (auth.uid() = sender_id);

CREATE POLICY "Users can insert own messages" 
ON hyper_messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);
```

### API Keys

- **anon key** - для клиентского кода (публичный)
- **service_role key** - только для серверного кода (секретный!)

⚠️ **НИКОГДА** не используйте `service_role` в клиентском коде!

## 🛠️ API Примеры

### Отправка сообщения

```typescript
import { syncMessage } from './lib/sync';

await syncMessage({
  conversation_id: 'chat-uuid',
  sender_id: 'user-uuid',
  content: 'Hello!',
  encrypted: true,
  status: 'sent'
});
```

### Загрузка сообщений

```typescript
import { loadMessages } from './lib/sync';

const messages = await loadMessages('chat-uuid');
```

### Статистика

```typescript
import { getSyncStats } from './lib/sync';

const stats = await getSyncStats();
console.log(stats); // { users: 10, conversations: 5, messages: 150 }
```

## 🔧 Troubleshooting

### Ошибка подключения

**Проблема:** "Connection failed"

**Решения:**
- Проверьте URL (должен быть `https://...supabase.co`)
- Убедитесь, что используете `anon` key, а не `service_role`
- Проверьте, что проект активен в Supabase Dashboard

### Ошибка таблиц

**Проблема:** "relation does not exist"

**Решение:**
- Выполните SQL-схему в SQL Editor
- Проверьте, что все таблицы созданы

### Ошибка прав

**Проблема:** "permission denied"

**Решение:**
- Проверьте RLS политики
- Для демо используйте `CREATE POLICY "Enable all" ...`

## 📦 Экспорт данных

Вы можете экспортировать данные в любой момент:

```sql
-- Экспорт всех сообщений
SELECT * FROM hyper_messages ORDER BY created_at DESC;

-- Экспорт в CSV (через Supabase Dashboard)
-- Table Editor → Export → CSV
```

## 🗑️ Удаление данных

```sql
-- Удалить все сообщения
DELETE FROM hyper_messages;

-- Удалить все данные
DROP TABLE hyper_messages;
DROP TABLE hyper_conversation_members;
DROP TABLE hyper_conversations;
DROP TABLE hyper_users;
```

## 💰 Стоимость

Supabase Free Tier:
- 500 MB database
- 1 GB file storage
- 50,000 monthly active users
- Unlimited API requests

Для Hyper Messenger этого достаточно для демо и небольших проектов.

## 🔗 Полезные ссылки

- [Supabase Docs](https://supabase.com/docs)
- [SQL Editor](https://supabase.com/docs/guides/database/sql-editor)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [API Reference](https://supabase.com/docs/reference/javascript)

---

**Нужна помощь?** Создайте issue в GitHub репозитории.
