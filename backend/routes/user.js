import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import {
  findUserById,
  updateUser,
  addToFavorites,
  removeFromFavorites,
  addToWatchLater,
  removeFromWatchLater
} from '../models/User.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/profile', async (req, res) => {
  try {
    const user = await findUserById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { password, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: error.message || 'Error fetching profile' })
  }
})

router.put('/profile', async (req, res) => {
  try {
    const { name, email } = req.body
    const updates = {}
    
    if (name) updates.name = name
    if (email) updates.email = email

    const updatedUser = await updateUser(req.user.userId, updates)
    res.json(updatedUser)
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: error.message || 'Error updating profile' })
  }
})

router.get('/favorites', async (req, res) => {
  try {
    const user = await findUserById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ favorites: user.favorites || [] })
  } catch (error) {
    console.error('Get favorites error:', error)
    res.status(500).json({ error: error.message || 'Error fetching favorites' })
  }
})

router.post('/favorites', async (req, res) => {
  try {
    const { movieId, type } = req.body

    if (!movieId || !type) {
      return res.status(400).json({ error: 'movieId and type are required' })
    }

    const user = await addToFavorites(req.user.userId, movieId, type)
    const { password, ...userWithoutPassword } = user

    res.json({
      message: 'Added to favorites',
      favorites: userWithoutPassword.favorites
    })
  } catch (error) {
    console.error('Add to favorites error:', error)
    res.status(500).json({ error: error.message || 'Error adding to favorites' })
  }
})

router.delete('/favorites', async (req, res) => {
  try {
    const { movieId, type } = req.body

    if (!movieId || !type) {
      return res.status(400).json({ error: 'movieId and type are required' })
    }

    const user = await removeFromFavorites(req.user.userId, movieId, type)
    const { password, ...userWithoutPassword } = user

    res.json({
      message: 'Removed from favorites',
      favorites: userWithoutPassword.favorites
    })
  } catch (error) {
    console.error('Remove from favorites error:', error)
    res.status(500).json({ error: error.message || 'Error removing from favorites' })
  }
})

router.get('/watch-later', async (req, res) => {
  try {
    const user = await findUserById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ watchLater: user.watchLater || [] })
  } catch (error) {
    console.error('Get watch later error:', error)
    res.status(500).json({ error: error.message || 'Error fetching watch later' })
  }
})

router.post('/watch-later', async (req, res) => {
  try {
    const { movieId, type } = req.body

    if (!movieId || !type) {
      return res.status(400).json({ error: 'movieId and type are required' })
    }

    const user = await addToWatchLater(req.user.userId, movieId, type)
    const { password, ...userWithoutPassword } = user

    res.json({
      message: 'Added to watch later',
      watchLater: userWithoutPassword.watchLater
    })
  } catch (error) {
    console.error('Add to watch later error:', error)
    res.status(500).json({ error: error.message || 'Error adding to watch later' })
  }
})

router.delete('/watch-later', async (req, res) => {
  try {
    const { movieId, type } = req.body

    if (!movieId || !type) {
      return res.status(400).json({ error: 'movieId and type are required' })
    }

    const user = await removeFromWatchLater(req.user.userId, movieId, type)
    const { password, ...userWithoutPassword } = user

    res.json({
      message: 'Removed from watch later',
      watchLater: userWithoutPassword.watchLater
    })
  } catch (error) {
    console.error('Remove from watch later error:', error)
    res.status(500).json({ error: error.message || 'Error removing from watch later' })
  }
})

export default router

