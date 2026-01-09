<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title class="text-2xl font-bold">
        Филми и Сериали
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" variant="text" class="text-white">
        Начало
      </v-btn>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            class="text-white"
          >
            Филми
            <v-icon end>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/movies?category=trending">
            <v-list-item-title>Трендови</v-list-item-title>
          </v-list-item>
          <v-list-item to="/movies?category=top-rated">
            <v-list-item-title>Топ 100</v-list-item-title>
          </v-list-item>
          <v-list-item to="/movies?category=latest">
            <v-list-item-title>Нови</v-list-item-title>
          </v-list-item>
          <v-list-item to="/movies?category=popular">
            <v-list-item-title>Популярни</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            class="text-white"
          >
            Сериали
            <v-icon end>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/tv-shows?category=trending">
            <v-list-item-title>Трендови</v-list-item-title>
          </v-list-item>
          <v-list-item to="/tv-shows?category=top-rated">
            <v-list-item-title>Топ 100</v-list-item-title>
          </v-list-item>
          <v-list-item to="/tv-shows?category=latest">
            <v-list-item-title>Нови</v-list-item-title>
          </v-list-item>
          <v-list-item to="/tv-shows?category=popular">
            <v-list-item-title>Популярни</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn to="/search" variant="text" class="text-white">
        Търсене
      </v-btn>

      <template v-if="isAuthenticated">
        <v-btn to="/profile" variant="text" class="text-white">
          <v-icon start>mdi-account</v-icon>
          {{ user?.name }}
        </v-btn>
        <v-btn @click="handleLogout" variant="text" class="text-white">
          <v-icon start>mdi-logout</v-icon>
          Изход
        </v-btn>
      </template>
      <template v-else>
        <v-btn to="/login" variant="text" class="text-white">
          <v-icon start>mdi-login</v-icon>
          Вход
        </v-btn>
        <v-btn to="/register" variant="text" class="text-white">
          Регистрация
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { useAuth } from './composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user, isAuthenticated, logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<style scoped>
</style>
