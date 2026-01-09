# Movie & TV Show Catalog

A full-stack application for browsing movies and TV shows with user authentication, favorites, and watch later lists.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` (or the next available port).

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_API_BASE_URL=http://localhost:3000/api
```

Get your free TMDB API key from: https://www.themoviedb.org/settings/api

## Backend Setup

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:3000`.

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3000
NODE_ENV=development
```

## Features

- Browse movies and TV shows from TMDB API
- User authentication (register/login)
- Favorites list
- Watch later list
- Search functionality
- Genre filtering
- Infinite scroll pagination
- Responsive design with Vuetify and Tailwind CSS

## Tech Stack

### Frontend
- Vue 3
- Vue Router
- TanStack Query (Vue)
- Vuetify
- Tailwind CSS
- Axios
- Vite

### Backend
- Express.js
- JWT Authentication
- bcryptjs
- File-based data storage (JSON)

## Development

### Running Both Frontend and Backend

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```

## License

MIT
