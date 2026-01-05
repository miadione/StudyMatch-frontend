import api from '@/api/api'
import type { User, MatchResponse, Like, Match } from '@/types'

// Users
export async function fetchUsers(): Promise<User[]> {
  const response = await api.get('/api/users')
  return response.data
}

export async function fetchUserById(id: number): Promise<User> {
  const response = await api.get(`/api/users/${id}`)
  return response.data
}

// Likes
export async function likeUser(userId: number): Promise<MatchResponse> {
  const response = await api.post(`/api/likes/${userId}`)
  return response.data
}

export async function fetchMyLikes(): Promise<Like[]> {
  const response = await api.get('/api/likes')
  return response.data
}

export async function fetchLikesReceived(): Promise<Like[]> {
  const response = await api.get('/api/likes/received')
  return response.data
}

// Matches
export async function fetchMyMatches(): Promise<Match[]> {
  const response = await api.get('/api/matches')
  return response.data
}


