<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">
      {{ pageTitle }}
    </h1>

    <GenreFilter
      v-model="selectedGenre"
      :available-genres="availableGenresList"
    />

    <LoadingSpinner v-if="isLoading" />
    <EmptyState v-else-if="isError" :message="errorMessage" type="error" />
    <div v-else-if="filteredMovies && filteredMovies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <MovieCard
        v-for="movie in filteredMovies"
        :key="movie.id"
        :movie="movie"
        @click="goToMovieDetails"
      />
    </div>
    <EmptyState v-else message="Няма налични филми в момента." />
    <LoadingSpinner v-if="isFetchingNextPage" :size="48" message="Зареждане на още филми..." />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMoviesByCategory, genreMap } from '../composables/useMovies'
import MovieCard from '../components/MovieCard.vue'
import GenreFilter from '../components/GenreFilter.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()
const route = useRoute()

const category = computed(() => route.query.category || 'popular')
const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useMoviesByCategory(category)

const selectedGenre = ref('')
const availableGenresList = computed(() => {
  return Object.entries(genreMap).map(([id, name]) => ({ id: parseInt(id), name }))
})

const errorMessage = computed(() => {
  return `Грешка при зареждане на филмите: ${error.value?.message || 'Неизвестна грешка'}`
})

const allMovies = computed(() => {
  if (!data.value?.pages) return []
  return data.value.pages.flatMap(page => page.data)
})

const filteredMovies = computed(() => {
  if (!allMovies.value || allMovies.value.length === 0) return []
  
  if (!selectedGenre.value) {
    return allMovies.value
  }
  
  const genreId = parseInt(selectedGenre.value)
  return allMovies.value.filter(movie => movie.genre_ids?.includes(genreId))
})

let scrollTimeout = null

const handleScroll = () => {
  if (isLoading.value || isFetchingNextPage.value) return
  
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  
  scrollTimeout = setTimeout(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    
    const distanceFromBottom = documentHeight - (scrollTop + windowHeight)
    
    if (distanceFromBottom < 300 && hasNextPage.value) {
      fetchNextPage()
    }
  }, 100)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('wheel', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('wheel', handleScroll)
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})

const pageTitle = computed(() => {
  const titles = {
    'popular': 'Популярни филми',
    'trending': 'Трендови филми',
    'top-rated': 'Топ 100 филми',
    'latest': 'Нови филми'
  }
  return titles[category.value] || 'Филми'
})

const goToMovieDetails = (id) => {
  router.push({ 
    path: `/movie/${id}`,
    query: { type: 'movie' }
  })
}

watch(category, () => {
  selectedGenre.value = ''
})
</script>

<style scoped>
</style>

