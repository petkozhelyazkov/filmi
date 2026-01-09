<template>
  <v-card
    class="movie-card cursor-pointer"
    @click="handleClick"
    elevation="4"
  >
    <div class="relative overflow-hidden">
      <v-img
        :src="movie.poster"
        :alt="movie.title"
        :height="imageHeight"
        cover
        class="poster-image"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              color="grey-lighten-4"
              indeterminate
            ></v-progress-circular>
          </div>
        </template>
      </v-img>
      <div class="absolute top-2 right-2 rating-chip">
        <v-chip color="warning" size="small" class="font-bold">
          {{ movie.rating }}
        </v-chip>
      </div>
      <div class="absolute top-2 left-2 type-chip">
        <v-chip 
          :color="movie.type === 'Филм' ? 'primary' : 'secondary'" 
          size="small"
        >
          {{ movie.type }}
        </v-chip>
      </div>
    </div>

    <v-card-title class="text-lg font-semibold line-clamp-2">
      {{ movie.title }}
    </v-card-title>

    <v-card-subtitle class="text-gray-600">
      {{ movie.director }} • {{ movie.year }}
    </v-card-subtitle>

    <v-card-text>
      <div class="flex items-center gap-2 mb-2">
        <v-chip size="small" color="primary" variant="outlined">
          {{ movie.genre }}
        </v-chip>
        <v-chip size="small" color="info" variant="outlined">
          {{ movie.duration }}
        </v-chip>
      </div>
      <p class="text-sm text-gray-700 line-clamp-3">
        {{ movie.description }}
      </p>
    </v-card-text>

    <v-card-actions class="card-actions">
      <v-btn
        color="primary"
        variant="text"
        class="details-btn"
        @click.stop="handleClick"
      >
        Виж детайли
        <v-icon end class="ml-1">mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const props = defineProps({
  movie: {
    type: Object,
    required: true
  },
  imageHeight: {
    type: [String, Number],
    default: 450
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  const type = props.movie.media_type || (props.movie.type === 'Филм' ? 'movie' : 'tv')
  emit('click', props.movie.id, type)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.movie-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
  z-index: 10;
}

.poster-image {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.movie-card:hover .poster-image {
  transform: scale(1.1);
}

.rating-chip,
.type-chip {
  transition: all 0.3s ease;
  transform: scale(1);
}

.movie-card:hover .rating-chip,
.movie-card:hover .type-chip {
  transform: scale(1.1);
}

.card-actions {
  transition: all 0.3s ease;
  opacity: 0.8;
}

.movie-card:hover .card-actions {
  opacity: 1;
}

.details-btn {
  transition: all 0.3s ease;
}

.movie-card:hover .details-btn {
  transform: translateX(4px);
}

.movie-card:hover .details-btn .v-icon {
  transform: translateX(4px);
}
</style>

