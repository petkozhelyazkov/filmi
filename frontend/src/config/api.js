export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

if (!TMDB_API_KEY || TMDB_API_KEY === 'demo_key_please_replace') {
  console.warn('TMDB API key is missing! Please create a .env file with VITE_TMDB_API_KEY=your_key')
  console.warn('Get your free API key from: https://www.themoviedb.org/settings/api')
}

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
