import api from '@/api/api'
import type {
    ProfileRequest,
    ProfileResponse,
    OnboardingStatus,
    Course,
    Subject,
    Language
} from '@/types'

/**
 * Eigenes Profil laden
 */
export async function getMyProfile(): Promise<ProfileResponse> {
    const response = await api.get('/api/profiles/me')
    return response.data
}

/**
 * Profil aktualisieren (PATCH)
 */
export async function updateProfile(data: ProfileRequest): Promise<ProfileResponse> {
    const response = await api.patch('/api/profiles/me', data)
    return response.data
}

/**
 * Onboarding-Status abrufen
 */
export async function getOnboardingStatus(): Promise<OnboardingStatus> {
    const response = await api.get('/api/profiles/onboarding/status')
    return response.data
}

/**
 * Profile zum Swipen laden
 */
export async function getDiscoverProfiles(): Promise<ProfileResponse[]> {
    const response = await api.get('/api/profiles/discover')
    return response.data
}

/**
 * Einzelnes Profil laden
 */
export async function getProfileById(id: number): Promise<ProfileResponse> {
    const response = await api.get(`/api/profiles/${id}`)
    return response.data
}

/**
 * Alle Studiengänge laden
 */
export async function fetchCourses(): Promise<Course[]> {
    const response = await api.get('/api/courses')
    return response.data
}

/**
 * Alle Fächer laden
 */
export async function fetchSubjects(): Promise<Subject[]> {
    const response = await api.get('/api/subjects')
    return response.data
}

/**
 * Alle Sprachen laden
 */
export async function fetchLanguages(): Promise<Language[]> {
    const response = await api.get('/api/languages')
    return response.data
}