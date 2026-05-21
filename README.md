# Kanban Board

Повнофункціональний Kanban-додаток у стилі Trello з підтримкою drag-and-drop, пошуку та фільтрації завдань. Картки можна переміщувати між колонками, додавати, редагувати та видаляти. Кожна картка має заголовок, опис, пріоритет і дату створення.

## Технічний стек

| Рівень          | Технології                                   |
| --------------- | -------------------------------------------- |
| **Frontend**    | React 18 (Vite), Redux Toolkit, Tailwind CSS |
| **Backend**     | Node.js, Express.js                          |
| **Drag & Drop** | @hello-pangea/dnd                            |
| **База даних**  | JSON-файл                                    |

## Запуск проекту

### Передумови

- Node.js >= 18.x
- npm >= 9.x

### Backend

```bash
cd server
npm install
```

Створіть файл `.env` у папці `server/`:

```env
PORT=5000
```

```bash
npm run dev
```

Сервер запуститься на `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
```

Створіть файл `.env` у папці `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Додаток відкриється на `http://localhost:5173`.
