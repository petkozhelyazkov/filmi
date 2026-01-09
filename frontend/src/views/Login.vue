<template>
  <div class="container mx-auto px-4 py-8 max-w-md">
    <v-card elevation="4" class="pa-6">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">
        Вход
      </h1>

      <v-form @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="Имейл"
          type="email"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          class="mb-4"
          :error-messages="errors.email"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Парола"
          type="password"
          prepend-inner-icon="mdi-lock"
          variant="outlined"
          class="mb-4"
          :error-messages="errors.password"
          required
        ></v-text-field>

        <v-alert
          v-if="errorMessage"
          type="error"
          class="mb-4"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>

        <v-btn
          type="submit"
          color="primary"
          size="large"
          block
          :loading="loading"
          class="mb-4"
        >
          Вход
        </v-btn>

        <div class="text-center">
          <p class="text-gray-600">
            Нямате акаунт?
            <router-link to="/register" class="text-primary font-semibold">
              Регистрирайте се
            </router-link>
          </p>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const errors = ref({})

const handleLogin = async () => {
  errors.value = {}
  errorMessage.value = ''
  
  if (!email.value || !password.value) {
    if (!email.value) errors.value.email = 'Имейлът е задължителен'
    if (!password.value) errors.value.password = 'Паролата е задължителна'
    return
  }

  loading.value = true
  const result = await login(email.value, password.value)
  loading.value = false

  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.error
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>

