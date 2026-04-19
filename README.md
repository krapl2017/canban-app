# Требования
На машине должны быть установлены:
- php (https://www.php.net/manual/ru/install.php)
- composer (https://getcomposer.org/download/)
- bun (https://bun.com/)
# Установка

```
git clone https://github.com/krapl2017/canban-app.git
```
## Первый запуск после git clone
#### Запуск backend (в корне проекта)
``` bash
cd backend (перейти в папку backend)
composer install
перезапустить терминал (перезапустить редактор кода)
cp .env.example .env (создать .env и скопировать туда содержимое .env.example)
php artisan key:generate
php artisan config:clear
php artisan migrate
php artisan serve
```
#### Запуск frontend (в корне проекта)
``` bash
cd frontend (перейти в папку frontend)
bun i
bun run dev
```
## Дальнейшие запуски
#### Запуск backend (в корне проекта)
``` bash
cd backend (перейти в папку backend)
php artisan serve
```
#### Запуск frontend (в корне проекта)
``` bash
cd frontend (перейти в папку frontend)
bun run dev
```
#  1. Общая архитектура

##  Стек

- **Frontend**
    - React + TypeScript
    - Redux Toolkit
    - Drag & Drop → `@dnd-kit`
    - Bun (менеджер пакетов + dev server)
- **Backend**
    - Laravel (REST API)
    - Аутентификация (упрощённая)
- **Хранилище**
    - SQLite
- **Файлы**
    - Laravel storage (изображения карточек)

Сущности (модели)
```
User
Board
Column
Card
Image
```
Связи:
- User → Boards (1:N)
- Board → Columns (1:N)
- Column → Cards (1:N)
- Card → Images (1:N)

#  2. Структура проекта
```
kanban-app/
 ├── backend/ (Laravel)
 └── frontend/ (React + Bun)
```
#  3. Backend

##  endpoints
### Auth
```
POST /api/register  
POST /api/login  
GET  /api/me
```
### Boards
```
GET    /api/boards  
POST   /api/boards  
GET    /api/boards/{id}  
PUT /api/boards/{id}
DELETE /api/boards/{id}
```
### Columns
```
POST   /api/columns  
PUT    /api/columns/{id}  
DELETE /api/columns/{id}
```
### Cards
```
POST   /api/cards  
PUT    /api/cards/{id}  
DELETE /api/cards/{id}
POST /api/cards/reorder
```
### Images
```
POST   /api/cards/{id}/images  
DELETE /api/images/{id}
```


