import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_DIR = path.join(__dirname, '../data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function initUsersFile() {
  await ensureDataDir()
  try {
    await fs.access(USERS_FILE)
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2))
  }
}

export async function getUsers() {
  await initUsersFile()
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function saveUsers(users) {
  await ensureDataDir()
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

export async function findUserByEmail(email) {
  const users = await getUsers()
  return users.find(user => user.email === email)
}

export async function findUserById(id) {
  const users = await getUsers()
  return users.find(user => user.id === id)
}

export async function createUser(userData) {
  const users = await getUsers()
  
  const existingUser = await findUserByEmail(userData.email)
  if (existingUser) {
    throw new Error('User with this email already exists')
  }
  
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    favorites: [],
    watchLater: []
  }
  
  users.push(newUser)
  await saveUsers(users)
  
  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

export async function updateUser(userId, updates) {
  const users = await getUsers()
  const userIndex = users.findIndex(user => user.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  }
  
  await saveUsers(users)
  
  const { password, ...userWithoutPassword } = users[userIndex]
  return userWithoutPassword
}

export async function addToFavorites(userId, movieId, movieType) {
  const users = await getUsers()
  const userIndex = users.findIndex(user => user.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  const favorite = { id: movieId, type: movieType, addedAt: new Date().toISOString() }
  
  const exists = users[userIndex].favorites.some(fav => fav.id === movieId && fav.type === movieType)
  if (exists) {
    return users[userIndex]
  }
  
  users[userIndex].favorites.push(favorite)
  await saveUsers(users)
  
  return users[userIndex]
}

export async function removeFromFavorites(userId, movieId, movieType) {
  const users = await getUsers()
  const userIndex = users.findIndex(user => user.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  users[userIndex].favorites = users[userIndex].favorites.filter(
    fav => !(fav.id === movieId && fav.type === movieType)
  )
  
  await saveUsers(users)
  return users[userIndex]
}

export async function addToWatchLater(userId, movieId, movieType) {
  const users = await getUsers()
  const userIndex = users.findIndex(user => user.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  const watchLater = { id: movieId, type: movieType, addedAt: new Date().toISOString() }
  
  const exists = users[userIndex].watchLater.some(wl => wl.id === movieId && wl.type === movieType)
  if (exists) {
    return users[userIndex]
  }
  
  users[userIndex].watchLater.push(watchLater)
  await saveUsers(users)
  
  return users[userIndex]
}

export async function removeFromWatchLater(userId, movieId, movieType) {
  const users = await getUsers()
  const userIndex = users.findIndex(user => user.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  users[userIndex].watchLater = users[userIndex].watchLater.filter(
    wl => !(wl.id === movieId && wl.type === movieType)
  )
  
  await saveUsers(users)
  return users[userIndex]
}

