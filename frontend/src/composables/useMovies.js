import { useQuery, useInfiniteQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import axios from 'axios'
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '../config/api'

export const genreMap = {
  28: 'Екшън',
  12: 'Приключение',
  16: 'Анимация',
  35: 'Комедия',
  80: 'Криминален',
  99: 'Документален',
  18: 'Драма',
  10751: 'Семеен',
  14: 'Фантастика',
  36: 'История',
  27: 'Хорър',
  10402: 'Музика',
  9648: 'Мистерия',
  10749: 'Романтика',
  878: 'Научна фантастика',
  10770: 'TV филм',
  53: 'Трилър',
  10752: 'Война',
  37: 'Уестърн'
}

const genreNameToId = {
  'Екшън': 28,
  'Приключение': 12,
  'Анимация': 16,
  'Комедия': 35,
  'Криминален': 80,
  'Документален': 99,
  'Драма': 18,
  'Семеен': 10751,
  'Фантастика': 14,
  'История': 36,
  'Хорър': 27,
  'Музика': 10402,
  'Мистерия': 9648,
  'Романтика': 10749,
  'Научна фантастика': 878,
  'TV филм': 10770,
  'Трилър': 53,
  'Война': 10752,
  'Уестърн': 37
}

export const availableGenres = [
  'Всички',
  'Екшън',
  'Приключение',
  'Анимация',
  'Комедия',
  'Криминален',
  'Документален',
  'Драма',
  'Семеен',
  'Фантастика',
  'История',
  'Хорър',
  'Музика',
  'Мистерия',
  'Романтика',
  'Научна фантастика',
  'Трилър',
  'Война',
  'Уестърн'
]

function getGenreName(genreIds) {
  if (!genreIds || genreIds.length === 0) return 'Неизвестен'
  return genreIds.map(id => genreMap[id] || 'Друго').slice(0, 2).join(', ')
}

function formatMovieData(movie, isDetail = false) {
  const releaseDate = movie.release_date || movie.first_air_date || ''
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'
  
  let genreText = 'Неизвестен'
  if (movie.genres && movie.genres.length > 0) {
    genreText = movie.genres.map(g => g.name).slice(0, 2).join(', ')
  } else if (movie.genre_ids && movie.genre_ids.length > 0) {
    genreText = getGenreName(movie.genre_ids)
  }
  
  const imageSize = isDetail ? 'w780' : 'w500'
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/${imageSize}${movie.poster_path}` 
    : null
  
  return {
    id: movie.id,
    title: movie.title || movie.name,
    director: movie.director || (movie.created_by && movie.created_by[0]?.name) || 'Неизвестен режисьор',
    description: movie.overview || 'Няма описание',
    year: year,
    genre: genreText,
    genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
    type: movie.media_type === 'tv' ? 'Сериал' : 'Филм',
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : '0.0',
    duration: movie.runtime 
      ? `${movie.runtime} мин` 
      : movie.number_of_seasons 
        ? `${movie.number_of_seasons} сезона` 
        : 'N/A',
    poster: posterUrl || `https://via.placeholder.com/${isDetail ? '500x750' : '300x450'}?text=${encodeURIComponent(movie.title || movie.name || 'No Image')}`,
    cast: movie.cast || [],
    backdrop: movie.backdrop_path 
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` 
      : null
  }
}

export function useMovies() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      if (!TMDB_API_KEY || TMDB_API_KEY === 'demo_key_please_replace') {
        throw new Error('TMDB API ключ липсва! Моля, създайте .env файл с VITE_TMDB_API_KEY=your_key. Получете безплатен ключ от: https://www.themoviedb.org/settings/api')
      }
      
      try {
        const moviesResponse = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
          params: {
            api_key: TMDB_API_KEY,
            language: 'bg-BG'
          }
        })
        
        const tvResponse = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
          params: {
            api_key: TMDB_API_KEY,
            language: 'bg-BG'
          }
        })
        
        const movies = moviesResponse.data.results.slice(0, 10).map(movie => ({
          ...formatMovieData(movie),
          media_type: 'movie'
        }))
        
        const tvShows = tvResponse.data.results.slice(0, 10).map(tv => ({
          ...formatMovieData({ ...tv, media_type: 'tv' }),
          media_type: 'tv'
        }))
        
        const combined = [...movies, ...tvShows]
        return combined.sort(() => Math.random() - 0.5)
      } catch (error) {
        console.error('Error fetching movies:', error)
        throw error
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useMoviesByCategory(category) {
  const categoryValue = computed(() => {
    if (typeof category === 'function' || (category && typeof category.value !== 'undefined')) {
      return category.value || 'popular'
    }
    return category || 'popular'
  })
  
  return useInfiniteQuery({
    queryKey: ['movies', categoryValue],
    queryFn: async ({ pageParam = 1 }) => {
      const cat = categoryValue.value
      if (!TMDB_API_KEY || TMDB_API_KEY === 'demo_key_please_replace') {
        throw new Error('TMDB API ключ липсва! Моля, създайте .env файл с VITE_TMDB_API_KEY=your_key. Получете безплатен ключ от: https://www.themoviedb.org/settings/api')
      }
      
      try {
        let endpoint = 'movie/popular'
        
        switch(cat) {
          case 'trending':
            endpoint = 'trending/movie/day'
            break
          case 'top-rated':
            endpoint = 'movie/top_rated'
            break
          case 'latest':
            endpoint = 'movie/now_playing'
            break
          default:
            endpoint = 'movie/popular'
        }
        
        const response = await axios.get(`${TMDB_BASE_URL}/${endpoint}`, {
          params: {
            api_key: TMDB_API_KEY,
            language: 'bg-BG',
            page: pageParam
          }
        })
        
        return {
          data: response.data.results.map(movie => ({
            ...formatMovieData(movie),
            media_type: 'movie'
          })),
          nextPage: pageParam + 1,
          hasMore: pageParam < response.data.total_pages
        }
      } catch (error) {
        console.error('Error fetching movies:', error)
        throw error
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  })
}

export function useTVShowsByCategory(category) {
  const categoryValue = computed(() => {
    if (typeof category === 'function' || (category && typeof category.value !== 'undefined')) {
      return category.value || 'popular'
    }
    return category || 'popular'
  })
  
  return useInfiniteQuery({
    queryKey: ['tv-shows', categoryValue],
    queryFn: async ({ pageParam = 1 }) => {
      const cat = categoryValue.value
      if (!TMDB_API_KEY || TMDB_API_KEY === 'demo_key_please_replace') {
        throw new Error('TMDB API ключ липсва! Моля, създайте .env файл с VITE_TMDB_API_KEY=your_key. Получете безплатен ключ от: https://www.themoviedb.org/settings/api')
      }
      
      try {
        let endpoint = 'tv/popular'
        
        switch(cat) {
          case 'trending':
            endpoint = 'trending/tv/day'
            break
          case 'top-rated':
            endpoint = 'tv/top_rated'
            break
          case 'latest':
            endpoint = 'tv/on_the_air'
            break
          default:
            endpoint = 'tv/popular'
        }
        
        const response = await axios.get(`${TMDB_BASE_URL}/${endpoint}`, {
          params: {
            api_key: TMDB_API_KEY,
            language: 'bg-BG',
            page: pageParam
          }
        })
        
        return {
          data: response.data.results.map(tv => ({
            ...formatMovieData({ ...tv, media_type: 'tv' }),
            media_type: 'tv'
          })),
          nextPage: pageParam + 1,
          hasMore: pageParam < response.data.total_pages
        }
      } catch (error) {
        console.error('Error fetching TV shows:', error)
        throw error
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  })
}

export function useMovie(id, type = 'movie') {
  return useQuery({
    queryKey: ['movie', id, type],
    queryFn: async () => {
      if (!TMDB_API_KEY || TMDB_API_KEY === 'demo_key_please_replace') {
        throw new Error('TMDB API ключ липсва! Моля, създайте .env файл с VITE_TMDB_API_KEY=your_key. Получете безплатен ключ от: https://www.themoviedb.org/settings/api')
      }
      
      try {
        const endpoint = type === 'tv' ? 'tv' : 'movie'
        const response = await axios.get(`${TMDB_BASE_URL}/${endpoint}/${id}`, {
          params: {
            api_key: TMDB_API_KEY,
            language: 'bg-BG',
            append_to_response: 'credits'
          }
        })
        
        const movieData = response.data
        const cast = movieData.credits?.cast?.slice(0, 5).map(actor => actor.name) || []
        
        const formattedData = {
          ...formatMovieData({ ...movieData, media_type: type }, true), // Pass true for isDetail
          cast: cast,
          budget: movieData.budget,
          revenue: movieData.revenue,
          production_companies: movieData.production_companies?.map(company => company.name) || []
        }
        
        console.log('Movie data:', {
          id: movieData.id,
          title: movieData.title || movieData.name,
          poster_path: movieData.poster_path,
          formatted_poster: formattedData.poster
        })
        
        return formattedData
      } catch (error) {
        console.error('Error fetching movie details:', error)
        throw error
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useSearchMovies(searchTerm, selectedGenre) {
  const searchKey = computed(() => searchTerm.value || '')
  const genreKey = computed(() => {
    const genre = selectedGenre?.value || ''
    return genre ? String(genre) : ''
  })
  
  return useQuery({
    queryKey: ['movies', 'search', searchKey, genreKey],
    queryFn: async () => {
      if (!TMDB_API_KEY || TMDB_API_KEY === 'demo_key_please_replace') {
        throw new Error('TMDB API ключ липсва! Моля, създайте .env файл с VITE_TMDB_API_KEY=your_key. Получете безплатен ключ от: https://www.themoviedb.org/settings/api')
      }
      
      try {
        const term = (searchTerm.value || '').trim()
        const genre = selectedGenre?.value || ''
        const genreId = genre ? parseInt(genre) : null
        
        if (!term && !genreId) {
          const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
              api_key: TMDB_API_KEY,
              language: 'bg-BG'
            }
          })
          return response.data.results.slice(0, 20).map(movie => formatMovieData(movie))
        }
        
        let movies = []
        let tvShows = []
        
        if (genreId) {
          const [moviesByGenre, tvByGenre] = await Promise.all([
            axios.get(`${TMDB_BASE_URL}/discover/movie`, {
              params: {
                api_key: TMDB_API_KEY,
                language: 'bg-BG',
                with_genres: genreId
              }
            }),
            axios.get(`${TMDB_BASE_URL}/discover/tv`, {
              params: {
                api_key: TMDB_API_KEY,
                language: 'bg-BG',
                with_genres: genreId
              }
            })
          ])
          
          movies = moviesByGenre.data.results.map(movie => ({
            ...formatMovieData(movie),
            media_type: 'movie'
          }))
          
          tvShows = tvByGenre.data.results.map(tv => ({
            ...formatMovieData({ ...tv, media_type: 'tv' }),
            media_type: 'tv'
          }))
          
          if (term) {
            const termLower = term.toLowerCase()
            movies = movies.filter(movie => 
              movie.title.toLowerCase().includes(termLower) ||
              movie.description.toLowerCase().includes(termLower) ||
              movie.director.toLowerCase().includes(termLower)
            )
            tvShows = tvShows.filter(tv => 
              tv.title.toLowerCase().includes(termLower) ||
              tv.description.toLowerCase().includes(termLower) ||
              tv.director.toLowerCase().includes(termLower)
            )
          }
        } else {
          const [moviesResponse, tvResponse] = await Promise.all([
            axios.get(`${TMDB_BASE_URL}/search/movie`, {
              params: {
                api_key: TMDB_API_KEY,
                query: term || 'popular',
                language: 'bg-BG'
              }
            }),
            axios.get(`${TMDB_BASE_URL}/search/tv`, {
              params: {
                api_key: TMDB_API_KEY,
                query: term || 'popular',
                language: 'bg-BG'
              }
            })
          ])
          
          movies = moviesResponse.data.results.map(movie => ({
            ...formatMovieData(movie),
            media_type: 'movie'
          }))
          
          tvShows = tvResponse.data.results.map(tv => ({
            ...formatMovieData({ ...tv, media_type: 'tv' }),
            media_type: 'tv'
          }))
        }
        
        return [...movies, ...tvShows]
      } catch (error) {
        console.error('Error searching movies:', error)
        throw error
      }
    },
    enabled: true,
    staleTime: 1000 * 60 * 5,
  })
}
