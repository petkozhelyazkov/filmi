import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Movies from '../views/Movies.vue'
import TVShows from '../views/TVShows.vue'
import MovieDetails from '../views/MovieDetails.vue'
import Search from '../views/Search.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Favorites from '../views/Favorites.vue'
import WatchLater from '../views/WatchLater.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/movies',
    name: 'Movies',
    component: Movies,
    props: route => ({
      category: route.query.category || 'popular'
    })
  },
  {
    path: '/tv-shows',
    name: 'TVShows',
    component: TVShows,
    props: route => ({
      category: route.query.category || 'popular'
    })
  },
  {
    path: '/movie/:id',
    name: 'MovieDetails',
    component: MovieDetails,
    props: route => ({
      id: route.params.id,
      type: route.query.type || 'movie'
    })
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites
  },
  {
    path: '/watch-later',
    name: 'WatchLater',
    component: WatchLater
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
