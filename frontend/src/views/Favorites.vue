<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">
      Моите любими
    </h1>

    <LoadingSpinner v-if="loading" />
    <EmptyState v-else-if="favoritesMovies.length === 0" message="Нямате любими филми или сериали. Добавете филми от страницата с детайли." />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <MovieCard
        v-for="movie in favoritesMovies"
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
const { favorites, fetchFavorites } = useUserLists()

const loading = ref(true)
const favoritesMovies = ref([])

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
  await fetchFavorites()
  
  const moviePromises = favorites.value.map(async (fav) => {
    try {
      const endpoint = fav.type === 'movie' ? 'movie' : 'tv'
      const response = await axios.get(`${TMDB_BASE_URL}/${endpoint}/${fav.id}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'bg-BG'
        }
      })
      
      const formatted = formatMovieData({ ...response.data, media_type: fav.type })
      
      return {
        ...formatted,
        savedType: fav.type
      }
    } catch (error) {
      console.error(`Error fetching ${fav.type} ${fav.id}:`, error)
      return null
    }
  })

  const results = await Promise.all(moviePromises)
  favoritesMovies.value = results.filter(m => m !== null)
  loading.value = false
})
</script>

<style scoped>
</style>

