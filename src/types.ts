// ==================== Auth ====================
export interface User {
    id: number
    username: string
    password: string
    profile: ProfileResponse
}

export interface LoginCredentials {
    username: string
    password: string
}

export interface RegisterData {
    username: string
    password: string
    role?: string
}

// ==================== Profile ====================
export type Gender = 'MALE' | 'FEMALE' | 'DIVERSE'

export const GenderLabels: Record<Gender, string> = {
    MALE: 'Männlich',
    FEMALE: 'Weiblich',
    DIVERSE: 'Divers'
}

export interface ProfileRequest {
    vorname?: string
    gender?: Gender
    bio?: string
    birthdate?: string
    semester?: number
    profilePictureUrl?: string
    courseId?: number        // Studiengang (einer)
    subjectIds?: number[]    // Fächer (mehrere)
    languageIds?: number[]
}

export interface ProfileResponse {
    id: number
    vorname: string
    gender: Gender
    bio: string
    birthdate: string
    semester: number
    profilePictureUrl: string
    course: string                            // Studiengang (Name)
    subjects: { id: number; name: string }[]  // Fächer
    languages: { id: number; name: string }[]
    onboardingStep: number
    profileComplete: boolean
    createdAt: string
    updatedAt: string
}

export interface OnboardingStatus {
    currentStep: number
    isComplete: boolean
    hasVorname: boolean           // Schritt 1
    hasProfilePicture: boolean    // Schritt 2
    hasGender: boolean            // Schritt 3
    hasBirthdate: boolean         // Schritt 4
    hasBio: boolean               // Schritt 5
    hasCourse: boolean            // Schritt 6 (Studiengang)
    hasSemester: boolean          // Schritt 7
    hasSubjects: boolean          // Schritt 8 (Fächer)
    hasLanguages: boolean         // Schritt 9
}

// ==================== Reference Data ====================
export interface Course {
    id: number
    name: string
}

export interface Subject {
    id: number
    name: string
}

export interface Language {
    id: number
    name: string
}

export interface CourseResponse {
    id: number
    name: string
}

export interface SubjectResponse {
    id: number
    name: string
}

export interface LanguageResponse {
    id: number
    name: string
}

// ==================== Likes & Matches ====================
export interface Like {
    id: number
    fromUserVorname: string
    fromUserUsername: string
    toUserVorname: string
    toUserUsername: string
    isMatch: boolean
}

export interface MatchResponse {
    isMatch: boolean
    toUserVorname?: string
}

export interface Match {
    matchId: number
    otherUserId: number
    otherUserVorname: string
    otherUserUsername: string
    profilePictureUrl?: string
}

// ==================== UI ====================
export type TabId = 'home' | 'likes' | 'matches' | 'profile'

export interface NavTab {
    id: TabId
    label: string
    icon: string
}

export interface DragState {
    isDragging: boolean
    offset: { x: number; y: number }
    startPos: { x: number; y: number }
}