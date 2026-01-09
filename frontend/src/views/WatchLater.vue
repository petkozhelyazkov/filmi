<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">
      За по-късно
    </h1>

    <LoadingSpinner v-if="loading" />
    <EmptyState v-else-if="watchLaterMovies.length === 0" message="Нямате филми или сериали за по-късно. Добавете филми от страницата с детайли." />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <MovieCard
        v-for="movie in watchLaterMovies"
        :key="`${movie.id}-${movie.type}`"
        :movie="movie"
        @click="(id, type) => goToMovieDetails(id, movie.savedType)"
      />
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
import MovieCard from '../components/MovieCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()
const { isAuthenticated } = useAuth()
const { watchLater, fetchWatchLater } = useUserLists()

const loading = ref(true)
const watchLaterMovies = ref([])

const goToMovieDetails = (id, savedType) => {
  router.push({ 
    path: `/movie/${id}`,
    query: { type: savedType || 'movie' }
  })
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  loading.value = true
  await fetchWatchLater()
  
  const moviePromises = watchLater.value.map(async (wl) => {
    try {
      const endpoint = wl.type === 'movie' ? 'movie' : 'tv'
      const response = await axios.get(`${TMDB_BASE_URL}/${endpoint}/${wl.id}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'bg-BG'
        }
      })
      
      const formatted = formatMovieData({ ...response.data, media_type: wl.type })
      
      return {
        ...formatted,
        savedType: wl.type
      }
    } catch (error) {
      console.error(`Error fetching ${wl.type} ${wl.id}:`, error)
      return null
    }
  })

  const results = await Promise.all(moviePromises)
  watchLaterMovies.value = results.filter(m => m !== null)
  loading.value = false
})
</script>

<style scoped>
</style>

