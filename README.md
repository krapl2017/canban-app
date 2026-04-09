
#### Запуск backend
``` bash
cd backend
php artisan serve
```
#### Запуск frontend
``` bash
cd frontend
bun run dev
```


#  1. Общая архитектура

##  Стек

- **Frontend**
    - React + TypeScript
    - Redux Toolkit
    - Drag & Drop → `@dnd-kit` (современный и плавный)
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
#  3. Backend — API дизайн

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
```
### Images
```
POST   /api/cards/{id}/images  
DELETE /api/images/{id}
```

# 4. Frontend
### Что надо устанавливать в ../frontend:
``` bash
bun add @reduxjs/toolkit react-redux axios
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers @dnd-kit/utilities
bun add react-router-dom

```


#### Реализация drag&drop:

Есть 3 сущности:
- **DndContext** → оборачивает всё
- **Droppable (колонки)**
- **Draggable (карточки)**


#  Что можно улучшить 

- добавить анимации
- модалки вместо confirm
# Комментарий мб следующий пункт
#### Запуск backend
``` bash
cd backend
php artisan serve
```
#### Запуск frontend
``` bash
cd frontend
bun run dev
```


