import { ref } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import { useAuth } from './useAuth'

export function useUserLists() {
  const { isAuthenticated } = useAuth()
  const favorites = ref([])
  const watchLater = ref([])
  const loading = ref(false)

  const fetchFavorites = async () => {
    if (!isAuthenticated.value) return
    
    try {
      loading.value = true
      const response = await axios.get(`${API_BASE_URL}/user/favorites`)
      favorites.value = response.data.favorites || []
      return { success: true, data: favorites.value }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch favorites'
      }
    } finally {
      loading.value = false
    }
  }

  const fetchWatchLater = async () => {
    if (!isAuthenticated.value) return
    
    try {
      loading.value = true
      const response = await axios.get(`${API_BASE_URL}/user/watch-later`)
      watchLater.value = response.data.watchLater || []
      return { success: true, data: watchLater.value }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch watch later'
      }
    } finally {
      loading.value = false
    }
  }

  const normalizeType = (type) => {
    if (type === 'movie' || type === 'tv') return type
    return type === 'Филм' ? 'movie' : 'tv'
  }

  const addToFavorites = async (movieId, type) => {
    if (!isAuthenticated.value) {
      return { success: false, error: 'Please login to add favorites' }
    }
    
    try {
      const normalizedType = normalizeType(type)
      const response = await axios.post(`${API_BASE_URL}/user/favorites`, {
        movieId: String(movieId),
        type: normalizedType
      })
      favorites.value = response.data.favorites || []
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to add to favorites'
      }
    }
  }

  const removeFromFavorites = async (movieId, type) => {
    if (!isAuthenticated.value) return
    
    try {
      const normalizedType = normalizeType(type)
      const response = await axios.delete(`${API_BASE_URL}/user/favorites`, {
        data: {
          movieId: String(movieId),
          type: normalizedType
        }
      })
      favorites.value = response.data.favorites || []
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to remove from favorites'
      }
    }
  }

  const addToWatchLater = async (movieId, type) => {
    if (!isAuthenticated.value) {
      return { success: false, error: 'Please login to add to watch later' }
    }
    
    try {
      const normalizedType = normalizeType(type)
      const response = await axios.post(`${API_BASE_URL}/user/watch-later`, {
        movieId: String(movieId),
        type: normalizedType
      })
      watchLater.value = response.data.watchLater || []
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to add to watch later'
      }
    }
  }

  const removeFromWatchLater = async (movieId, type) => {
    if (!isAuthenticated.value) return
    
    try {
      const normalizedType = normalizeType(type)
      const response = await axios.delete(`${API_BASE_URL}/user/watch-later`, {
        data: {
          movieId: String(movieId),
          type: normalizedType
        }
      })
      watchLater.value = response.data.watchLater || []
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to remove from watch later'
      }
    }
  }

  const isFavorite = (movieId, type) => {
    const normalizedType = normalizeType(type)
    return favorites.value.some(
      fav => fav.id === String(movieId) && fav.type === normalizedType
    )
  }

  const isInWatchLater = (movieId, type) => {
    const normalizedType = normalizeType(type)
    return watchLater.value.some(
      wl => wl.id === String(movieId) && wl.type === normalizedType
    )
  }

  return {
    favorites,
    watchLater,
    loading,
    fetchFavorites,
    fetchWatchLater,
    addToFavorites,
    removeFromFavorites,
    addToWatchLater,
    removeFromWatchLater,
    isFavorite,
    isInWatchLater
  }
}

