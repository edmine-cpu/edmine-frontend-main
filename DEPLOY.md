# 🚀 Инструкция по деплою после SEO оптимизации

## Проблема
После конвертации страниц компаний и заявок из Client Components в Server Components, старые JavaScript chunks больше не существуют. Браузеры и CDN могут кешировать старые chunk'и, что приводит к ошибкам:

```
ChunkLoadError: Loading chunk 238 failed.
MIME type mismatch: expected JavaScript, got HTML
```

## Решение

### 1️⃣ На сервере (обязательно!)

```bash
# 1. Остановить приложение
pm2 stop makeasap  # или docker-compose down

# 2. Удалить старый build
rm -rf .next

# 3. Пересобрать с новым кодом
npm run build

# 4. Перезапустить
pm2 start makeasap  # или docker-compose up -d

# 5. Проверить, что новый build загружен
pm2 logs makeasap  # или docker logs
```

### 2️⃣ Очистка CDN кеша (если используется Cloudflare/nginx)

**Cloudflare:**
```bash
# Очистить весь кеш
Dashboard → Caching → Purge Everything

# Или только JS/CSS
Dashboard → Caching → Custom Purge
/_next/static/*
```

**nginx:**
```bash
# Очистить кеш nginx (если используется proxy_cache)
rm -rf /var/cache/nginx/*
nginx -s reload
```

### 3️⃣ Проверка на локальном dev

```bash
# 1. Очистить локальный build
rm -rf .next

# 2. Пересобрать
npm run build

# 3. Запустить в production режиме
npm start

# 4. Проверить в браузере (hard refresh: Ctrl+Shift+R)
```

### 4️⃣ Для пользователей

Попросите пользователей сделать **жесткое обновление**:
- **Windows/Linux:** `Ctrl + Shift + R` или `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`
- **Или:** Очистить кеш браузера

## Изменения в конфигурации

В `next.config.ts` добавлены правильные заголовки для JS chunks:

```typescript
{
  source: '/_next/static/chunks/:path*',
  headers: [
    {
      key: 'Content-Type',
      value: 'application/javascript; charset=utf-8',
    },
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    },
  ],
}
```

## Проверка успешного деплоя

1. **Откройте DevTools (F12) → Network**
2. **Перейдите на:** `https://makeasap.com/companies/test-slug`
3. **Проверьте:**
   - ✅ Нет ошибок `ChunkLoadError`
   - ✅ Нет ошибок `MIME type mismatch`
   - ✅ Страница загружается мгновенно (SSR)
   - ✅ В исходном HTML есть контент (View Page Source)

4. **Проверьте SEO meta:**
```bash
curl -I https://makeasap.com/companies/test-slug | grep -i "x-robots-tag"
# Должно быть пусто (index, follow по умолчанию)

curl https://makeasap.com/companies/test-slug | grep -i "robots"
# Должно показать: <meta name="robots" content="index, follow">
```

## Что изменилось (для справки)

### ДО:
- `/companies/[slug]` - Client Component (CSR)
- `/requests/[slug]` - Client Component (CSR)
- Header - Client Component с layout shift

### ПОСЛЕ:
- `/companies/[slug]` - **Server Component** (SSR) + `robots: index, follow`
- `/requests/[slug]` - **Server Component** (SSR) + `robots: noindex, follow`
- Header - Server Component с middleware auth check

## Troubleshooting

### Ошибка все еще есть?

1. **Проверьте version в `package.json`:**
   ```bash
   grep version package.json
   ```

2. **Очистите npm кеш:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Проверьте build ID:**
   ```bash
   cat .next/BUILD_ID
   # Должен измениться после нового build
   ```

4. **Проверьте, что используется правильный код:**
   ```bash
   grep "'use client'" src/app/companies/\[slug\]/page.tsx
   # Должно быть ПУСТО (файл теперь server component)
   ```

## Контакты

Если проблемы остались после всех шагов:
1. Проверьте логи сервера
2. Проверьте конфигурацию nginx/reverse proxy
3. Убедитесь, что не используется старый Docker image

---

**Дата обновления:** 2025-01-11
**Версия:** После SEO оптимизации v2.0
