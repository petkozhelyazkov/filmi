<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">
      Търсене на филми и сериали
    </h1>

    <div class="max-w-4xl mx-auto mb-8">
      <v-card elevation="4" class="p-6">
        <v-text-field
          v-model="searchTerm"
          label="Търси по заглавие, режисьор, жанр или описание"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          class="mb-4"
          @update:model-value="handleSearch"
        ></v-text-field>

        <GenreFilter
          v-model="selectedGenre"
          :available-genres="availableGenresList"
          @update:model-value="handleSearch"
        />

        <div class="flex gap-2">
          <v-btn
            @click="handleSearch"
            color="primary"
            size="large"
            class="flex-1"
          >
            Търси
          </v-btn>
          <v-btn
            @click="clearSearch"
            color="secondary"
            variant="outlined"
            size="large"
          >
            Изчисти
          </v-btn>
        </div>
      </v-card>
    </div>

    <LoadingSpinner v-if="isLoading" />
    <EmptyState v-else-if="isError" :message="errorMessage" type="error" />
    <div v-else-if="searchResults && searchResults.length > 0" class="mb-4">
      <p class="text-lg text-gray-600 text-center mb-6">
        Намерени {{ searchResults.length }} {{ searchResults.length === 1 ? 'филм' : 'филма' }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MovieCard
          v-for="movie in searchResults"
          :key="movie.id"
          :movie="movie"
          :image-height="400"
          @click="goToMovieDetails"
        />
      </div>
    </div>
    <EmptyState v-else-if="hasSearched" :message="noResultsMessage" />
    <EmptyState v-else message="Въведете дума за търсене в полето по-горе." />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchMovies, genreMap } from '../composables/useMovies'
import MovieCard from '../components/MovieCard.vue'
import GenreFilter from '../components/GenreFilter.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()
const searchTerm = ref('')
const selectedGenre = ref('')
const hasSearched = ref(false)

const availableGenresList = computed(() => {
  return Object.entries(genreMap).map(([id, name]) => ({ id: parseInt(id), name }))
})

const { data: searchResults, isLoading, isError, error } = useSearchMovies(searchTerm, selectedGenre)

const errorMessage = computed(() => {
  return `Грешка при търсенето: ${error.value?.message || 'Неизвестна грешка'}`
})

const noResultsMessage = computed(() => {
  return `Няма намерени филми за "${searchTerm.value}". Опитайте с друга дума.`
})

watch(searchTerm, () => {
  if (searchTerm.value && searchTerm.value.trim() !== '') {
    hasSearched.value = true
  }
})

const handleSearch = () => {
  if (searchTerm.value && searchTerm.value.trim() !== '') {
    hasSearched.value = true
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  selectedGenre.value = ''
  hasSearched.value = false
}

const goToMovieDetails = (id, type = 'movie') => {
  router.push({ 
    path: `/movie/${id}`,
    query: { type: type || 'movie' }
  })
}
</script>

<style scoped>
</style>
