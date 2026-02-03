import api from './api'

// Home Content
export const getHomeContent = () => api.get('/api/home')
export const updateHomeContent = (data) => api.put('/api/home', data)

// Story
export const getStorySections = () => api.get('/api/story/sections')
export const createStorySection = (data) => api.post('/api/story/sections', data)
export const updateStorySection = (id, data) => api.put(`/api/story/sections/${id}`, data)
export const deleteStorySection = (id) => api.delete(`/api/story/sections/${id}`)

export const getStoryImages = () => api.get('/api/story/images')
export const createStoryImage = (data) => api.post('/api/story/images', data)
export const updateStoryImage = (id, data) => api.put(`/api/story/images/${id}`, data)
export const deleteStoryImage = (id) => api.delete(`/api/story/images/${id}`)

// Wedding Info
export const getInfoSections = () => api.get('/api/info')
export const createInfoSection = (data) => api.post('/api/info', data)
export const updateInfoSection = (id, data) => api.put(`/api/info/${id}`, data)
export const deleteInfoSection = (id) => api.delete(`/api/info/${id}`)

// Timeline
export const getTimelineEvents = () => api.get('/api/timeline')
export const createTimelineEvent = (data) => api.post('/api/timeline', data)
export const updateTimelineEvent = (id, data) => api.put(`/api/timeline/${id}`, data)
export const deleteTimelineEvent = (id) => api.delete(`/api/timeline/${id}`)
export const reorderTimelineEvents = (eventIds) => api.put('/api/timeline/reorder', eventIds)

// Gallery
export const getGalleryImages = () => api.get('/api/gallery')
export const createGalleryImage = (data) => api.post('/api/gallery', data)
export const updateGalleryImage = (id, data) => api.put(`/api/gallery/${id}`, data)
export const deleteGalleryImage = (id) => api.delete(`/api/gallery/${id}`)

// Gifts
export const getGiftItems = () => api.get('/api/gifts')
export const createGiftItem = (data) => api.post('/api/gifts', data)
export const updateGiftItem = (id, data) => api.put(`/api/gifts/${id}`, data)
export const deleteGiftItem = (id) => api.delete(`/api/gifts/${id}`)

// RSVP
export const createRSVP = (data) => api.post('/api/rsvp', data)
export const getRSVPs = () => api.get('/api/rsvp')

// Upload (auth required: ensure Bearer token is always sent)
export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'multipart/form-data',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return api.post('/api/upload', formData, { headers })
}

export const deleteFile = (filename) => api.delete(`/api/upload/${filename}`)

// Seed Data
export const seedDemoData = () => api.post('/api/seed/demo')
export const clearDemoData = () => api.delete('/api/seed/demo')

