<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">
      Моят профил
    </h1>

    <div v-if="loading" class="flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>

    <div v-else-if="user" class="space-y-6">
      <v-card elevation="4" class="pa-6">
        <h2 class="text-2xl font-semibold mb-4">Информация</h2>
        <div class="space-y-3">
          <div>
            <p class="text-sm text-gray-500">Име</p>
            <p class="text-lg font-semibold">{{ user.name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Имейл</p>
            <p class="text-lg font-semibold">{{ user.email }}</p>
          </div>
        </div>
      </v-card>

      <v-card elevation="4" class="pa-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">Любими ({{ favorites.length }})</h2>
          <v-btn
            v-if="favorites.length > 0"
            to="/favorites"
            color="primary"
            variant="text"
          >
            Виж всички
          </v-btn>
        </div>
        <div v-if="favorites.length === 0" class="text-center py-8 text-gray-500">
          Нямате любими филми или сериали
        </div>
        <div v-else-if="favoritesLoading" class="text-center py-4">
          <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <v-card
            v-for="fav in favoritesMovies.slice(0, 8)"
            :key="`${fav.id}-${fav.type}`"
            class="cursor-pointer"
            @click="goToMovieDetails(fav.id, fav.savedType)"
            elevation="2"
          >
            <v-card-text class="pa-3">
              <div class="flex items-center gap-2">
                <v-chip 
                  :color="fav.savedType === 'movie' ? 'primary' : 'secondary'" 
                  size="small"
                >
                  {{ fav.savedType === 'movie' ? 'Филм' : 'Сериал' }}
                </v-chip>
                <span class="font-semibold text-sm line-clamp-1">{{ fav.title }}</span>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-card>

      <v-card elevation="4" class="pa-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold">За по-късно ({{ watchLater.length }})</h2>
          <v-btn
            v-if="watchLater.length > 0"
            to="/watch-later"
            color="primary"
            variant="text"
          >
            Виж всички
          </v-btn>
        </div>
        <div v-if="watchLater.length === 0" class="text-center py-8 text-gray-500">
          Нямате филми или сериали за по-късно
        </div>
        <div v-else-if="watchLaterLoading" class="text-center py-4">
          <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <v-card
            v-for="wl in watchLaterMovies.slice(0, 8)"
            :key="`${wl.id}-${wl.type}`"
            class="cursor-pointer"
            @click="goToMovieDetails(wl.id, wl.savedType)"
            elevation="2"
          >
            <v-card-text class="pa-3">
              <div class="flex items-center gap-2">
                <v-chip 
                  :color="wl.savedType === 'movie' ? 'primary' : 'secondary'" 
                  size="small"
                >
                  {{ wl.savedType === 'movie' ? 'Филм' : 'Сериал' }}
                </v-chip>
                <span class="font-semibold text-sm line-clamp-1">{{ wl.title }}</span>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuth } from '../composables/useAuth'
import { useUserLists } from '../composables/useUserLists'
import { TMDB_API_KEY, TMDB_BASE_URL } from '../config/api'
import { formatMovieData } from '../utils/movieUtils'

const router = useRouter()
const { user, isAuthenticated, fetchProfile } = useAuth()
const { favorites, watchLater, fetchFavorites, fetchWatchLater } = useUserLists()

const loading = ref(true)
const favoritesLoading = ref(false)
const watchLaterLoading = ref(false)
const favoritesMovies = ref([])
const watchLaterMovies = ref([])

const goToMovieDetails = (id, savedType) => {
  router.push({ 
    path: `/movie/${id}`,
    query: { type: savedType || 'movie' }
  })
}

const fetchMovieDetails = async (item) => {
  try {
    const endpoint = item.type === 'movie' ? 'movie' : 'tv'
    const response = await axios.get(`${TMDB_BASE_URL}/${endpoint}/${item.id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'bg-BG'
      }
    })
    
    return {
      ...formatMovieData({ ...response.data, media_type: item.type }),
      media_type: item.type
    }
  } catch (error) {
    console.error(`Error fetching ${item.type} ${item.id}:`, error)
    return {
      id: item.id,
      title: `${item.type === 'movie' ? 'Филм' : 'Сериал'} #${item.id}`,
      type: item.type === 'movie' ? 'Филм' : 'Сериал',
      media_type: item.type
    }
  }
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  
  await Promise.all([
    fetchProfile(),
    fetchFavorites(),
    fetchWatchLater()
  ])
  
  if (favorites.value.length > 0) {
    favoritesLoading.value = true
    const favoritePromises = favorites.value.slice(0, 8).map(async (fav) => {
      const movieData = await fetchMovieDetails(fav)
      if (movieData) {
        movieData.savedType = fav.type
      }
      return movieData
    })
    const favoriteResults = await Promise.all(favoritePromises)
    favoritesMovies.value = favoriteResults.filter(m => m !== null)
    favoritesLoading.value = false
  }
  
  if (watchLater.value.length > 0) {
    watchLaterLoading.value = true
    const watchLaterPromises = watchLater.value.slice(0, 8).map(async (wl) => {
      const movieData = await fetchMovieDetails(wl)
      if (movieData) {
        movieData.savedType = wl.type
      }
      return movieData
    })
    const watchLaterResults = await Promise.all(watchLaterPromises)
    watchLaterMovies.value = watchLaterResults.filter(m => m !== null)
    watchLaterLoading.value = false
  }
  
  loading.value = false
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 1;
}
</style>

