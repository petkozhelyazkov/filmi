# Movies & TV Shows Backend API

Backend API for the Movies and TV Shows application with authentication and user profiles.

## Features

- User registration and login
- JWT-based authentication
- User profiles
- Favorites list (save movies/TV shows)
- Watch later list (save movies/TV shows for later)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `backend` directory:

3. **IMPORTANT**: Add the following to your `.env` file (JWT_SECRET is REQUIRED):
```
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Note**: The server will NOT start without JWT_SECRET!

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Data Storage

The backend uses JSON file-based storage in the `data/` directory.

