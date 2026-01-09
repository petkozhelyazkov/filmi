<template>
  <div class="container mx-auto px-4 py-8">
    <v-btn
      @click="goBack"
      color="primary"
      variant="text"
      class="mb-4"
    >
      <v-icon start>mdi-arrow-left</v-icon>
      Назад
    </v-btn>

    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </div>

    <div v-else-if="isError" class="text-center py-12">
      <v-alert type="error" class="max-w-md mx-auto">
        Грешка при зареждане на филма: {{ error.message }}
      </v-alert>
    </div>

    <div v-else-if="movie" class="max-w-5xl mx-auto">
      <v-card elevation="8" class="overflow-hidden">
        <div class="md:flex">
          <div class="md:w-1/3 p-6 bg-gray-50 flex items-center justify-center">
            <div class="relative w-full max-w-[350px]">
              <div v-if="movie.poster" class="relative" style="aspect-ratio: 2/3;">
                <img
                  :src="movie.poster"
                  :alt="movie.title"
                  class="w-full h-full object-cover rounded-lg shadow-lg"
                  @error="handleImageError"
                  @load="handleImageLoad"
                />
                <div v-if="imageLoading" class="absolute inset-0 d-flex align-center justify-center bg-grey-lighten-2 rounded-lg">
                  <v-progress-circular
                    color="primary"
                    indeterminate
                    size="64"
                  ></v-progress-circular>
                </div>
                <div v-if="imageError" class="absolute inset-0 d-flex flex-column align-center justify-center bg-grey-lighten-2 rounded-lg pa-4">
                  <v-icon size="64" color="grey-darken-1" class="mb-2">mdi-image-off</v-icon>
                  <span class="text-caption text-grey-darken-1 text-center">Изображението не е налично</span>
                </div>
              </div>
              <div v-else class="w-full" style="aspect-ratio: 2/3;">
                <div class="w-full h-full d-flex flex-column align-center justify-center bg-grey-lighten-2 rounded-lg pa-4">
                  <v-icon size="64" color="grey-darken-1" class="mb-2">mdi-image-off</v-icon>
                  <span class="text-caption text-grey-darken-1 text-center">Няма изображение</span>
                </div>
              </div>
              <div class="absolute top-4 right-4">
                <v-chip color="warning" size="large" class="font-bold text-lg">
                  {{ movie.rating }}
                </v-chip>
              </div>
            </div>
          </div>

          <div class="md:w-2/3 p-8">
            <div class="flex items-start justify-between mb-4">
              <h1 class="text-4xl font-bold text-gray-800 flex-1">
                {{ movie.title }}
              </h1>
              <v-chip 
                :color="movie.type === 'Филм' ? 'primary' : 'secondary'" 
                size="large"
                class="ml-4"
              >
                {{ movie.type }}
              </v-chip>
            </div>

            <div class="mb-6">
              <h2 class="text-2xl text-gray-600 mb-4">
                {{ movie.director }}
              </h2>
              <div class="flex flex-wrap gap-2 mb-4">
                <v-chip color="primary" variant="outlined" size="large">
                  {{ movie.genre }}
                </v-chip>
                <v-chip color="info" variant="outlined" size="large">
                  {{ movie.year }}
                </v-chip>
                <v-chip color="success" variant="outlined" size="large">
                  {{ movie.duration }}
                </v-chip>
              </div>
            </div>

            <v-divider class="my-6"></v-divider>

            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-3 text-gray-800">
                Сюжет
              </h3>
              <p class="text-gray-700 leading-relaxed text-lg">
                {{ movie.description }}
              </p>
            </div>

            <v-divider class="my-6"></v-divider>

            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-3 text-gray-800">
                Актьорски състав
              </h3>
              <div class="flex flex-wrap gap-2">
                <v-chip
                  v-for="(actor, index) in movie.cast"
                  :key="index"
                  color="secondary"
                  variant="outlined"
                  size="default"
                >
                  {{ actor }}
                </v-chip>
              </div>
            </div>

            <v-divider class="my-6"></v-divider>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500 mb-1">Жанр</p>
                <p class="text-lg font-semibold">{{ movie.genre }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Година</p>
                <p class="text-lg font-semibold">{{ movie.year }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Продължителност</p>
                <p class="text-lg font-semibold">{{ movie.duration }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Рейтинг</p>
                <p class="text-lg font-semibold">{{ movie.rating }}/5.0</p>
              </div>
            </div>

            <v-divider class="my-6"></v-divider>

            <div v-if="isAuthenticated" class="flex gap-3">
              <v-btn
                :color="isFavoriteMovie ? 'error' : 'primary'"
                :variant="isFavoriteMovie ? 'flat' : 'outlined'"
                @click="toggleFavorite"
                :loading="favoriteLoading"
              >
                <v-icon start>{{ isFavoriteMovie ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                {{ isFavoriteMovie ? 'Премахни от любими' : 'Добави в любими' }}
              </v-btn>
              <v-btn
                :color="isInWatchLaterList ? 'secondary' : 'primary'"
                :variant="isInWatchLaterList ? 'flat' : 'outlined'"
                @click="toggleWatchLater"
                :loading="watchLaterLoading"
              >
                <v-icon start>{{ isInWatchLaterList ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}</v-icon>
                {{ isInWatchLaterList ? 'Премахни от за по-късно' : 'Добави за по-късно' }}
              </v-btn>
            </div>
            <v-alert v-else type="info" class="mt-4">
              <router-link to="/login" class="text-primary font-semibold">
                Влезте
              </router-link>
              в акаунта си, за да добавяте филми в любими и за по-късно.
            </v-alert>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovie } from '../composables/useMovies'
import { useAuth } from '../composables/useAuth'
import { useUserLists } from '../composables/useUserLists'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  type: {
    type: String,
    default: 'movie'
  }
})

const router = useRouter()
const { data: movie, isLoading, isError, error } = useMovie(Number(props.id), props.type)
const { isAuthenticated } = useAuth()
const {
  isFavorite,
  isInWatchLater,
  addToFavorites,
  removeFromFavorites,
  addToWatchLater,
  removeFromWatchLater,
  fetchFavorites,
  fetchWatchLater
} = useUserLists()

const imageLoading = ref(true)
const imageError = ref(false)
const favoriteLoading = ref(false)
const watchLaterLoading = ref(false)

const movieType = computed(() => movie.value?.type || 'Филм')
const actualType = computed(() => props.type || 'movie')

const handleImageLoad = () => {
  imageLoading.value = false
  imageError.value = false
}

const handleImageError = () => {
  imageLoading.value = false
  imageError.value = true
  console.error('Failed to load image:', movie.value?.poster)
}

const isFavoriteMovie = computed(() => {
  if (!movie.value) return false
  return isFavorite(String(props.id), actualType.value)
})

const isInWatchLaterList = computed(() => {
  if (!movie.value) return false
  return isInWatchLater(String(props.id), actualType.value)
})

const toggleFavorite = async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  favoriteLoading.value = true
  const movieId = String(props.id)
  const typeToSave = actualType.value
  
  if (isFavoriteMovie.value) {
    await removeFromFavorites(movieId, typeToSave)
  } else {
    await addToFavorites(movieId, typeToSave)
  }
  favoriteLoading.value = false
}

const toggleWatchLater = async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  watchLaterLoading.value = true
  const movieId = String(props.id)
  const typeToSave = actualType.value
  
  if (isInWatchLaterList.value) {
    await removeFromWatchLater(movieId, typeToSave)
  } else {
    await addToWatchLater(movieId, typeToSave)
  }
  watchLaterLoading.value = false
}

watch(movie, () => {
  if (movie.value) {
    imageLoading.value = true
    imageError.value = false
    console.log('Movie poster URL:', movie.value.poster)
  }
}, { immediate: true })

onMounted(async () => {
  if (isAuthenticated.value) {
    await Promise.all([fetchFavorites(), fetchWatchLater()])
  }
})

const goBack = () => {
  router.back()
}
</script>

