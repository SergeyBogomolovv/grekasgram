# Grekasgram - Онлайн-мессенджер на next.js + nest.js

## Как запустить

- Клонируем репозиторий
- Создаем .env файл с необходимыми параметрами
- Параметры для .env

```env
POSTGRES_DB=Имя базы данных
POSTGRES_USER=Пользователь базы данных
POSTGRES_PASSWORD=Пароль базы данных
POSTGRES_PORT=Порт базы данных
POSTGRES_HOST=Хост базы данных

REDIS_HOST=Хост редиса
REDIS_PORT=Порт редиса
REDIS_TTL=Время жизни кэша

JWT_SECRET=секретный jwt токен

MAIL_HOST=Хост почтового провайдера
MAIL_PORT=Порт почтового провайдера
MAIL_USER=Пользователь почтового провайдера
MAIL_PASS=Пароль от почтового провайдера

CORS_ORIGIN=Домен сайта
CONFIRM_EMAIL_URL=Url, на который будет произведен редирект с токеном из письма

OBJECT_STORAGE_ACCESS=access токен обьектного хранилища
OBJECT_STORAGE_SECRET=секретный токен обьектного хранилища
OBJECT_STORAGE_ENDPOINT=ендпоинт обьектного хранилища
OBJECT_STORAGE_REGION=регион обьектного хранилища
OBJECT_STORAGE_BUCKET=бакет обьектного хранилища
NODE_ENV=production

PORT=порт бэкенда

NEXT_PUBLIC_API_URL=url бэкенда
API_URL=url бэкенда(для ssr)
NEXT_PUBLIC_WS_URL=url ws бэкенда
```

- Генерируем сертификаты
  ```
  docker run --rm -v /etc/letsencrypt:/etc/letsencrypt -v /var/lib/letsencrypt:/var/lib/letsencrypt certbot/certbot certonly --standalone -d grekasgram.ru --email change-email@gmail.com --agree-tos --no-eff-email
  ```
- Останавливаем docker compose down
- Запускаем все приложение ```docker compose up -d```
  
## Описание архитектуры проекта (Frontend)

### Entities

- Chat - ui карточки чата и группы, которая отображается в чатбаре, так же тут будет все crud операции с чатами в будущем
- Message - ui сообщения и crud операции (удаление, редактирование)
- User - ui карточки пользователя и crud операции с пользователями
- Session - ui списка сессий и crud операции

### Features

- Auth - формы авторизации и работа с api
- Chatheader - верхняя панель чата с кнопкой действий и информацией о собеседнике
- message-form - форма отправки сообщения
- Chatbar - поиск чатов, пользователей и групп, отображает соответсвующие карточки и общий инпут поиска
- Navigation - все компоненты навигации (мобильный футер, сайдбар, мобильный дравер с чатами, навбар)
- Profile - форма для обновления данных о профиле
- user-profile - информация о другом пользователе

### Widgets

- chat - сообщения чата с infinity scroll

## Auth Flow

В данном приложении используется авторизация c JWT Access и Refresh токенами

- При авторизации отправляется запрос, валидируются данные и создается refreshToken, который содержит в себе id пользователя, user-agent и ip адрес, откуда был произведен вход. Этот токен хранится в базе данных и так же кэшируется. Так же генерируется access токен, который живет 15 минут и содержит в себе информацию о пользователе. На клиент отправляется accessToken и ставится refreshToken в httpOnly cookie.

- При аунтефикации проверяется access токен и если он не валидный, то выбрасывается ошибка, если это первая ошибка, то отправляется запрос на refresh токена, где валидируется refreshToken

## Используемые технологии

### Frontend

- Фреймворк: Next.js
- Стилизация: Tailwindcss + shadcn/ui
- Для работы с формами и валидации используются react-hook-form и zod
- В качестве стейт-менеджера: react-query
- Для работы с real-time: socket-io
- Тестирование: vitest

### Backend

- Фреймворк: Nest.js
- ORM и БД:  TypeORM + Postgresql
- Кэширование: Redis
- Работа с s3 хранилищем: aws-sdk-client
- Отправка писем: nodemailer

### Devops

- Proxy: Nginx
- Контейнеризация: Docker
