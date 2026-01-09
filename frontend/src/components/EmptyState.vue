<template>
  <div class="text-center py-12">
    <v-alert :type="type" class="max-w-md mx-auto">
      {{ message }}
    </v-alert>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info'
  }
})
</script>

