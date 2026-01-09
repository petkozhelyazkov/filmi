<template>
  <div class="flex justify-center items-center py-12">
    <v-progress-circular
      indeterminate
      color="primary"
      :size="size"
    ></v-progress-circular>
    <span v-if="message" class="ml-4 text-gray-600">{{ message }}</span>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: [String, Number],
    default: 64
  },
  message: {
    type: String,
    default: ''
  }
})
</script>

