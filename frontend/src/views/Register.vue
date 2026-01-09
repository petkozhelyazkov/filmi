<template>
  <div class="container mx-auto px-4 py-8 max-w-md">
    <v-card elevation="4" class="pa-6">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">
        Регистрация
      </h1>

      <v-form @submit.prevent="handleRegister">
        <v-text-field
          v-model="name"
          label="Име"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          class="mb-4"
          :error-messages="errors.name"
          required
        ></v-text-field>

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

        <v-text-field
          v-model="confirmPassword"
          label="Потвърди парола"
          type="password"
          prepend-inner-icon="mdi-lock-check"
          variant="outlined"
          class="mb-4"
          :error-messages="errors.confirmPassword"
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
          Регистрирай се
        </v-btn>

        <div class="text-center">
          <p class="text-gray-600">
            Вече имате акаунт?
            <router-link to="/login" class="text-primary font-semibold">
              Влезте
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
const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const errors = ref({})

const handleRegister = async () => {
  errors.value = {}
  errorMessage.value = ''
  
  if (!name.value) errors.value.name = 'Името е задължително'
  if (!email.value) errors.value.email = 'Имейлът е задължителен'
  if (!password.value) {
    errors.value.password = 'Паролата е задължителна'
  } else if (password.value.length < 6) {
    errors.value.password = 'Паролата трябва да е поне 6 символа'
  }
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Потвърдете паролата'
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Паролите не съвпадат'
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }

  loading.value = true
  const result = await register(email.value, password.value, name.value)
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

