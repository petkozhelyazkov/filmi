<template>
  <div class="max-w-4xl mx-auto mb-8">
    <v-card elevation="4" class="p-6">
      <div class="flex justify-center mb-4">
        <v-btn
          @click="showGenres = !showGenres"
          color="info"
          variant="outlined"
          class="w-full md:w-auto"
        >
          {{ showGenres ? 'Скрий жанрове' : 'Покажи жанрове' }}
          <v-icon end>{{ showGenres ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </div>

      <v-expand-transition>
        <div v-show="showGenres">
          <label class="text-sm font-semibold text-gray-700 mb-2 block">
            Жанр:
          </label>
          <v-radio-group
            :model-value="modelValue"
            inline
            density="compact"
            class="genre-radio-group"
            @update:model-value="handleChange"
          >
            <v-radio label="Всички" value="" color="primary" class="genre-radio"></v-radio>
            <v-radio
              v-for="genre in availableGenres"
              :key="genre.id"
              :label="genre.name"
              :value="genre.id"
              color="primary"
              class="genre-radio"
            ></v-radio>
          </v-radio-group>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { genreMap } from '../composables/useMovies'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  availableGenres: {
    type: Array,
    default: () => {
      return Object.entries(genreMap).map(([id, name]) => ({ id: parseInt(id), name }))
    }
  }
})

const emit = defineEmits(['update:modelValue'])

const showGenres = ref(false)

const handleChange = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.genre-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.genre-radio {
  margin-right: 0 !important;
}
</style>

