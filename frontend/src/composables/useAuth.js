import { ref, computed } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const user = ref(null)
const token = ref(localStorage.getItem('auth_token') || null)

if (token.value) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
}

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const setAuth = (authToken, userData) => {
    token.value = authToken
    user.value = userData
    localStorage.setItem('auth_token', authToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    delete axios.defaults.headers.common['Authorization']
  }

  const register = async (email, password, name) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        name
      })
      
      setAuth(response.data.token, response.data.user)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Registration failed'
      }
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      })
      
      setAuth(response.data.token, response.data.user)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed'
      }
    }
  }

  const logout = () => {
    clearAuth()
  }

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/profile`)
      user.value = response.data
      return { success: true, data: response.data }
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuth()
      }
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to fetch profile'
      }
    }
  }

  if (token.value && !user.value) {
    fetchProfile()
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    register,
    login,
    logout,
    fetchProfile,
    setAuth,
    clearAuth
  }
}

