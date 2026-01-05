<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import AvatarCreator from '@/components/AvatarCreator.vue'
import {
  getMyProfile,
  updateProfile,
  fetchSubjects,
  fetchCourses,
  fetchLanguages
} from '@/services/profileService'
import type { Subject, Course, Language, Gender, ProfileResponse } from '@/types'

const router = useRouter()

// State
const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Formular-Daten
const vorname = ref('')
const profilePictureUrl = ref('')
const selectedGender = ref<Gender | null>(null)
const birthdate = ref('')
const bio = ref('')
const semester = ref<number | null>(null)
const selectedCourseId = ref<number | null>(null)
const selectedSubjectIds = ref<number[]>([])
const selectedLanguageIds = ref<number[]>([])

// Verfügbare Optionen
const courses = ref<Course[]>([])
const subjects = ref<Subject[]>([])
const languages = ref<Language[]>([])

// Gender Optionen
const genderOptions: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Männlich' },
  { value: 'FEMALE', label: 'Weiblich' },
  { value: 'DIVERSE', label: 'Divers' }
]

// Semester Optionen
const semesterOptions = Array.from({ length: 10 }, (_, i) => i + 1)

// Toggle Funktionen
function toggleSubject(subjectId: number): void {
  const index = selectedSubjectIds.value.indexOf(subjectId)
  if (index === -1) {
    selectedSubjectIds.value.push(subjectId)
  } else {
    selectedSubjectIds.value.splice(index, 1)
  }
}

function toggleLanguage(languageId: number): void {
  const index = selectedLanguageIds.value.indexOf(languageId)
  if (index === -1) {
    selectedLanguageIds.value.push(languageId)
  } else {
    selectedLanguageIds.value.splice(index, 1)
  }
}

// Profil laden und Formular befüllen
async function loadProfile(): Promise<void> {
  loading.value = true
  error.value = null

  try {
    // Parallel laden
    const [profile, coursesData, subjectsData, languagesData] = await Promise.all([
      getMyProfile(),
      fetchCourses(),
      fetchSubjects(),
      fetchLanguages()
    ])

    // Optionen setzen
    courses.value = coursesData
    subjects.value = subjectsData
    languages.value = languagesData

    // Formular mit aktuellen Werten befüllen
    populateForm(profile)

  } catch (e) {
    console.error('Fehler beim Laden:', e)
    error.value = 'Profil konnte nicht geladen werden'
  } finally {
    loading.value = false
  }
}

function populateForm(profile: ProfileResponse): void {
  vorname.value = profile.vorname || ''
  profilePictureUrl.value = profile.profilePictureUrl || ''
  selectedGender.value = profile.gender as Gender || null
  birthdate.value = profile.birthdate || ''
  bio.value = profile.bio || ''
  semester.value = profile.semester || null

  // Course ID aus dem Namen finden
  const matchingCourse = courses.value.find(c => c.name === profile.course)
  selectedCourseId.value = matchingCourse?.id || null

  // Subject IDs aus den Objekten extrahieren
  selectedSubjectIds.value = profile.subjects?.map(s => s.id) || []

  // Language IDs aus den Objekten extrahieren
  selectedLanguageIds.value = profile.languages?.map(l => l.id) || []
}

// Profil speichern
async function saveProfile(): Promise<void> {
  saving.value = true
  error.value = null
  successMessage.value = null

  try {
    await updateProfile({
      vorname: vorname.value,
      profilePictureUrl: profilePictureUrl.value,
      gender: selectedGender.value || undefined,
      birthdate: birthdate.value || undefined,
      bio: bio.value,
      semester: semester.value || undefined,
      courseId: selectedCourseId.value || undefined,
      subjectIds: selectedSubjectIds.value,
      languageIds: selectedLanguageIds.value
    })

    successMessage.value = 'Profil erfolgreich gespeichert!'

    // Nach 2 Sekunden zurück navigieren
    setTimeout(() => {
      router.push('/app')
    }, 1500)

  } catch (e) {
    console.error('Fehler beim Speichern:', e)
    error.value = 'Profil konnte nicht gespeichert werden'
  } finally {
    saving.value = false
  }
}

function goBack(): void {
  router.back()
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="profile-edit">
    <!-- Header -->
    <header class="header">
      <button class="back-btn" @click="goBack">
        ← Zurück
      </button>
      <h1>Profil bearbeiten</h1>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="message error">
      {{ error }}
    </div>

    <!-- Form -->
    <form v-else class="form" @submit.prevent="saveProfile">

      <!-- Success Message -->
      <div v-if="successMessage" class="message success">
        {{ successMessage }}
      </div>

      <!-- Profilbild -->
      <section class="form-section">
        <label class="section-label">Avatar</label>
        <AvatarCreator v-model="profilePictureUrl" />
      </section>

      <!-- Vorname -->
      <section class="form-section">
        <label class="section-label">Vorname</label>
        <input
            v-model="vorname"
            type="text"
            placeholder="Dein Vorname..."
            class="input"
            maxlength="50"
        />
      </section>

      <!-- Geschlecht -->
      <section class="form-section">
        <label class="section-label">Geschlecht</label>
        <div class="chips-row">
          <button
              v-for="option in genderOptions"
              :key="option.value"
              type="button"
              class="chip"
              :class="{ selected: selectedGender === option.value }"
              @click="selectedGender = selectedGender === option.value ? null : option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </section>

      <!-- Geburtsdatum -->
      <section class="form-section">
        <label class="section-label">Geburtsdatum</label>
        <input
            v-model="birthdate"
            type="date"
            class="input"
            max="2010-01-01"
            min="1950-01-01"
        />
      </section>

      <!-- Bio -->
      <section class="form-section">
        <label class="section-label">Über mich</label>
        <textarea
            v-model="bio"
            placeholder="Erzähle etwas über dich..."
            class="textarea"
            maxlength="500"
            rows="4"
        ></textarea>
        <span class="char-count">{{ bio.length }} / 500</span>
      </section>

      <!-- Studiengang -->
      <section class="form-section">
        <label class="section-label">Studiengang</label>
        <div class="chips-row">
          <button
              v-for="course in courses"
              :key="course.id"
              type="button"
              class="chip"
              :class="{ selected: selectedCourseId === course.id }"
              @click="selectedCourseId = selectedCourseId === course.id ? null : course.id"
          >
            {{ course.name }}
          </button>
        </div>
      </section>

      <!-- Semester -->
      <section class="form-section">
        <label class="section-label">Semester</label>
        <div class="semester-row">
          <button
              v-for="n in semesterOptions"
              :key="n"
              type="button"
              class="semester-chip"
              :class="{ selected: semester === n }"
              @click="semester = semester === n ? null : n"
          >
            {{ n }}
          </button>
        </div>
      </section>

      <!-- Fächer -->
      <section class="form-section">
        <label class="section-label">
          Fächer
          <span v-if="selectedSubjectIds.length > 0" class="count">
            ({{ selectedSubjectIds.length }} ausgewählt)
          </span>
        </label>
        <div class="chips-container">
          <button
              v-for="subject in subjects"
              :key="subject.id"
              type="button"
              class="chip small"
              :class="{ selected: selectedSubjectIds.includes(subject.id) }"
              @click="toggleSubject(subject.id)"
          >
            {{ subject.name }}
          </button>
        </div>
      </section>

      <!-- Sprachen -->
      <section class="form-section">
        <label class="section-label">
          Sprachen
          <span v-if="selectedLanguageIds.length > 0" class="count">
            ({{ selectedLanguageIds.length }} ausgewählt)
          </span>
        </label>
        <div class="chips-container">
          <button
              v-for="language in languages"
              :key="language.id"
              type="button"
              class="chip small"
              :class="{ selected: selectedLanguageIds.includes(language.id) }"
              @click="toggleLanguage(language.id)"
          >
            {{ language.name }}
          </button>
        </div>
      </section>

      <!-- Submit -->
      <div class="form-actions">
        <BaseButton type="submit" :disabled="saving" full-width>
          <LoadingSpinner v-if="saving" size="sm" />
          <span v-else>Speichern</span>
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.profile-edit {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;
}

.header {
  background: var(--gradient-primary);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.header h1 {
  margin: 0;
  font-size: 1.25rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.message {
  margin: 20px;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  font-weight: 500;
}

.message.error {
  background: #fee;
  color: #c00;
}

.message.success {
  background: #efe;
  color: #060;
}

.form {
  padding: 20px;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.section-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-label .count {
  color: #667eea;
  text-transform: none;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #eee;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #667eea;
}

.textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #eee;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: none;
  transition: border-color 0.2s;
}

.textarea:focus {
  outline: none;
  border-color: #667eea;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 0.8rem;
  color: #999;
  margin-top: 4px;
}

/* Image Preview */
.image-preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.image-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  font-size: 2rem;
}

/* Chips */
.chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.chip {
  padding: 10px 16px;
  border: 2px solid #eee;
  border-radius: 20px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.chip.small {
  padding: 6px 12px;
  font-size: 0.8rem;
}

.chip:hover {
  border-color: #667eea;
}

.chip.selected {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
}

/* Semester */
.semester-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.semester-chip {
  width: 44px;
  height: 44px;
  border: 2px solid #eee;
  border-radius: 12px;
  background: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.semester-chip:hover {
  border-color: #667eea;
}

.semester-chip.selected {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
}

/* Form Actions */
.form-actions {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>