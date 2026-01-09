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
    <div v-else-if="filteredTVShows && filteredTVShows.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <MovieCard
        v-for="show in filteredTVShows"
        :key="show.id"
        :movie="show"
        @click="goToShowDetails"
      />
    </div>
    <EmptyState v-else message="Няма налични сериали в момента." />
    <LoadingSpinner v-if="isFetchingNextPage" :size="48" message="Зареждане на още сериали..." />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTVShowsByCategory, genreMap } from '../composables/useMovies'
import MovieCard from '../components/MovieCard.vue'
import GenreFilter from '../components/GenreFilter.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()
const route = useRoute()

const category = computed(() => route.query.category || 'popular')
const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTVShowsByCategory(category)

const selectedGenre = ref('')
const availableGenresList = computed(() => {
  return Object.entries(genreMap).map(([id, name]) => ({ id: parseInt(id), name }))
})

const errorMessage = computed(() => {
  return `Грешка при зареждане на сериалите: ${error.value?.message || 'Неизвестна грешка'}`
})

const allTVShows = computed(() => {
  if (!data.value?.pages) return []
  return data.value.pages.flatMap(page => page.data)
})

const filteredTVShows = computed(() => {
  if (!allTVShows.value || allTVShows.value.length === 0) return []
  
  if (!selectedGenre.value) {
    return allTVShows.value
  }
  
  const genreId = parseInt(selectedGenre.value)
  return allTVShows.value.filter(show => show.genre_ids?.includes(genreId))
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
    'popular': 'Популярни сериали',
    'trending': 'Трендови сериали',
    'top-rated': 'Топ 100 сериали',
    'latest': 'Нови сериали'
  }
  return titles[category.value] || 'Сериали'
})

const goToShowDetails = (id) => {
  router.push({ 
    path: `/movie/${id}`,
    query: { type: 'tv' }
  })
}

watch(category, () => {
  selectedGenre.value = ''
})
</script>

<style scoped>
</style>

