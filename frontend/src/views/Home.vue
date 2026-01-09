<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">
      Популярни филми и сериали
    </h1>

    <LoadingSpinner v-if="isLoading" />
    <EmptyState v-else-if="isError" :message="errorMessage" type="error" />
    <div v-else-if="movies && movies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @click="goToMovieDetails"
      />
    </div>
    <EmptyState v-else message="Няма налични филми в момента." />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMovies } from '../composables/useMovies'
import MovieCard from '../components/MovieCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()
const { data: movies, isLoading, isError, error } = useMovies()

const errorMessage = computed(() => {
  return `Грешка при зареждане на филмите: ${error.value?.message || 'Неизвестна грешка'}`
})

const goToMovieDetails = (id, type = 'movie') => {
  router.push({ 
    path: `/movie/${id}`,
    query: { type: type || 'movie' }
  })
}
</script>
