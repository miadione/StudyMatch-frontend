<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import type { Subject, Course, Language, Gender } from '@/types'
import AvatarCreator from '@/components/AvatarCreator.vue'
import {
  getOnboardingStatus,
  updateProfile,
  fetchSubjects,
  fetchCourses,
  fetchLanguages
} from '@/services/profileService'



const router = useRouter()
const currentStep = ref(1)
const totalSteps = 9
const loading = ref(false)
const saving = ref(false)
const vorname = ref('')
const profilePictureUrl = ref('')
const selectedGender = ref<Gender | null>(null)
const birthdate = ref('')
const bio = ref('')
const semester = ref<number | null>(null)
const selectedCourseId = ref<number | null>(null)
const selectedSubjectIds = ref<number[]>([])
const selectedLanguageIds = ref<number[]>([])
const courses = ref<Course[]>([])
const subjects = ref<Subject[]>([])
const languages = ref<Language[]>([])
const genderOptions: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Männlich' },
  { value: 'FEMALE', label: 'Weiblich' },
  { value: 'DIVERSE', label: 'Divers' }
]


const subjectSearch = ref('')
const languageSearch = ref('')


const filteredSubjects = computed(() => {
  if (!subjectSearch.value) return subjects.value
  return subjects.value.filter(s =>
      s.name.toLowerCase().includes(subjectSearch.value.toLowerCase())
  )
})

const filteredLanguages = computed(() => {
  if (!languageSearch.value) return languages.value
  return languages.value.filter(l =>
      l.name.toLowerCase().includes(languageSearch.value.toLowerCase())
  )
})


const progress = computed(() => {
  return Math.round((currentStep.value / totalSteps) * 100)
})

const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 1: // Vorname
      return vorname.value.trim().length >= 2
    case 2: // Profilbild
      return profilePictureUrl.value.trim().length > 0
    case 3: // Geschlecht
      return selectedGender.value !== null
    case 4: // Geburtsdatum
      return birthdate.value !== ''
    case 5: // Bio
      return bio.value.trim().length > 0
    case 6: // Studiengang
      return selectedCourseId.value !== null
    case 7: // Semester
      return semester.value !== null && semester.value > 0
    case 8: // Fächer
      return selectedSubjectIds.value.length > 0
    case 9: // Sprachen
      return selectedLanguageIds.value.length > 0
    default:
      return false
  }
})

const stepTitles = [
  'Dein Name',
  'Profilbild',
  'Geschlecht',
  'Geburtsdatum',
  'Über dich',
  'Studiengang',
  'Semester',
  'Fächer',
  'Sprachen'
]

function toggleGender(gender: Gender): void {
  if (selectedGender.value === gender) {
    selectedGender.value = null
  } else {
    selectedGender.value = gender
  }
}

function toggleCourse(courseId: number): void {
  if (selectedCourseId.value === courseId) {
    selectedCourseId.value = null
  } else {
    selectedCourseId.value = courseId
  }
}

function toggleSubject(subjectId: number): void {
  const index = selectedSubjectIds.value.indexOf(subjectId)
  if (index === -1) {
    selectedSubjectIds.value.push(subjectId)
  } else {
    selectedSubjectIds.value.splice(index, 1)
  }
}

function isSubjectSelected(subjectId: number): boolean {
  return selectedSubjectIds.value.includes(subjectId)
}

function toggleLanguage(languageId: number): void {
  const index = selectedLanguageIds.value.indexOf(languageId)
  if (index === -1) {
    selectedLanguageIds.value.push(languageId)
  } else {
    selectedLanguageIds.value.splice(index, 1)
  }
}

function isLanguageSelected(languageId: number): boolean {
  return selectedLanguageIds.value.includes(languageId)
}

async function saveCurrentStep(): Promise<boolean> {
  saving.value = true

  try {
    let data = {}

    switch (currentStep.value) {
      case 1:
        data = { vorname: vorname.value }
        break
      case 2:
        data = { profilePictureUrl: profilePictureUrl.value }
        break
      case 3:
        data = { gender: selectedGender.value }
        break
      case 4:
        data = { birthdate: birthdate.value }
        break
      case 5:
        data = { bio: bio.value }
        break
      case 6:
        data = { courseId: selectedCourseId.value }
        break
      case 7:
        data = { semester: semester.value }
        break
      case 8:
        data = { subjectIds: selectedSubjectIds.value }
        break
      case 9:
        data = { languageIds: selectedLanguageIds.value }
        break
    }

    await updateProfile(data)
    return true
  } catch (error) {
    console.error('Fehler beim Speichern:', error)
    return false
  } finally {
    saving.value = false
  }
}

async function nextStep(): Promise<void> {
  const success = await saveCurrentStep()

  if (success) {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    } else {
      void router.push('/app')
    }
  }
}

function prevStep(): void {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

async function loadData(): Promise<void> {
  loading.value = true

  try {
    const status = await getOnboardingStatus()

    if (status.isComplete) {
      void router.push('/app')
      return
    }
    currentStep.value = status.currentStep

    const [coursesData, subjectsData, languagesData] = await Promise.all([
      fetchCourses(),
      fetchSubjects(),
      fetchLanguages()
    ])

    courses.value = coursesData
    subjects.value = subjectsData
    languages.value = languagesData

  } catch (error) {
    console.error('Fehler beim Laden:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="onboarding">
    <div v-if="loading" class="loading-container">
      <LoadingSpinner size="lg" />
    </div>

    <template v-else>
      <header class="header">
        <div class="progress-info">
          <span>Schritt {{ currentStep }} von {{ totalSteps }}</span>
          <span>{{ progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <h1 class="step-title">{{ stepTitles[currentStep - 1] }}</h1>
      </header>

      <div v-if="currentStep === 1" class="step-content">
        <p class="step-description">
          Wie heißt du? Dein Vorname wird anderen Nutzern angezeigt.
        </p>
        <input
            v-model="vorname"
            type="text"
            placeholder="Dein Vorname..."
            class="input"
            maxlength="50"
        />
      </div>


      <div v-if="currentStep === 2" class="step-content">
        <p class="step-description">
          Erstelle deinen eigenen Avatar!
        </p>
        <AvatarCreator v-model="profilePictureUrl" />
      </div>

      <div v-if="currentStep === 3" class="step-content">
        <p class="step-description">
          Wie identifizierst du dich?
        </p>
        <div class="chips-container centered">
          <button
              v-for="option in genderOptions"
              :key="option.value"
              class="chip"
              :class="{ selected: selectedGender === option.value }"
              @click="toggleGender(option.value)"
          >
            <span v-if="selectedGender === option.value">✓ </span>
            {{ option.label }}
          </button>
        </div>
      </div>

      <div v-if="currentStep === 4" class="step-content">
        <p class="step-description">
          Wann wurdest du geboren?
        </p>
        <input
            v-model="birthdate"
            type="date"
            class="input date-input"
            max="2010-01-01"
            min="1950-01-01"
        />
      </div>

      <div v-if="currentStep === 5" class="step-content">
        <p class="step-description">
          Erzähle anderen etwas über dich und was du suchst.
        </p>
        <textarea
            v-model="bio"
            placeholder="Ich suche Lernpartner für..."
            class="textarea"
            maxlength="500"
            rows="6"
        ></textarea>
        <p class="char-count">{{ bio.length }} / 500</p>
      </div>

      <!-- Schritt 6: Studiengang -->
      <div v-if="currentStep === 6" class="step-content">
        <p class="step-description">
          Wähle deinen Studiengang aus.
        </p>
        <div class="chips-container">
          <button
              v-for="course in courses"
              :key="course.id"
              class="chip"
              :class="{ selected: selectedCourseId === course.id }"
              @click="toggleCourse(course.id)"
          >
            <span v-if="selectedCourseId === course.id">✓ </span>
            {{ course.name }}
          </button>
        </div>
      </div>

      <!-- Schritt 7: Semester -->
      <div v-if="currentStep === 7" class="step-content">
        <p class="step-description">
          In welchem Semester bist du?
        </p>
        <div class="semester-grid">
          <button
              v-for="n in 10"
              :key="n"
              class="semester-chip"
              :class="{ selected: semester === n }"
              @click="semester = semester === n ? null : n"
          >
            {{ n }}
          </button>
        </div>
      </div>

      <!-- Schritt 8: Fächer -->
      <div v-if="currentStep === 8" class="step-content">
        <p class="step-description">
          Für welche Fächer suchst du Lernpartner?
        </p>
        <input
            v-model="subjectSearch"
            type="text"
            placeholder="🔍 Fach suchen..."
            class="search-input"
        />
        <div class="selected-count" v-if="selectedSubjectIds.length > 0">
          {{ selectedSubjectIds.length }} ausgewählt
        </div>
        <div class="chips-container scrollable">
          <button
              v-for="subject in filteredSubjects"
              :key="subject.id"
              class="chip"
              :class="{ selected: isSubjectSelected(subject.id) }"
              @click="toggleSubject(subject.id)"
          >
            <span v-if="isSubjectSelected(subject.id)">✓ </span>
            {{ subject.name }}
          </button>
        </div>
      </div>

      <!-- Schritt 9: Sprachen -->
      <div v-if="currentStep === 9" class="step-content">
        <p class="step-description">
          Welche Sprachen sprichst du?
        </p>
        <input
            v-model="languageSearch"
            type="text"
            placeholder="🔍 Sprache suchen..."
            class="search-input"
        />
        <div class="selected-count" v-if="selectedLanguageIds.length > 0">
          {{ selectedLanguageIds.length }} ausgewählt
        </div>
        <div class="chips-container scrollable">
          <button
              v-for="language in filteredLanguages"
              :key="language.id"
              class="chip"
              :class="{ selected: isLanguageSelected(language.id) }"
              @click="toggleLanguage(language.id)"
          >
            <span v-if="isLanguageSelected(language.id)">✓ </span>
            {{ language.name }}
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <footer class="footer">
        <BaseButton
            v-if="currentStep > 1"
            variant="secondary"
            @click="prevStep"
        >
          Zurück
        </BaseButton>
        <div v-else></div>

        <BaseButton
            :disabled="!isCurrentStepValid || saving"
            @click="nextStep"
        >
          <LoadingSpinner v-if="saving" size="sm" />
          <span v-else>
            {{ currentStep === totalSteps ? 'Fertig' : 'Weiter' }}
          </span>
        </BaseButton>
      </footer>
    </template>
  </div>
</template>

<style scoped>
.onboarding {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--gradient-primary);
}

.loading-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  margin-bottom: 24px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.step-title {
  color: white;
  font-size: 1.75rem;
  margin-top: 20px;
  font-weight: 700;
}

.step-content {
  flex: 1;
  background: white;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 20px;
}

.step-description {
  color: #666;
  margin-bottom: 20px;
  font-size: 1rem;
  line-height: 1.5;
}

/* Input */
.input,
.search-input {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 20px;
  border: 2px solid #eee;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input:focus,
.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.date-input {
  font-family: inherit;
}

/* Profilbild Upload */
.image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.image-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  font-size: 3rem;
}

.hint {
  font-size: 0.875rem;
  color: #999;
}

/* Bio Textarea */
.textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #eee;
  border-radius: 12px;
  font-size: 1rem;
  resize: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.textarea:focus {
  outline: none;
  border-color: #667eea;
}

.char-count {
  text-align: right;
  font-size: 0.875rem;
  color: #999;
  margin-top: 8px;
}

/* Chips */
.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chips-container.centered {
  justify-content: center;
}

.chips-container.scrollable {
  max-height: 300px;
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

.chip.large {
  padding: 14px 24px;
  font-size: 1rem;
}

.chip:hover {
  border-color: #667eea;
}

.chip.selected {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  margin: 1px;
}

/* Semester Grid */
.semester-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;
}

.semester-chip {
  aspect-ratio: 1;
  border: 2px solid #eee;
  border-radius: 12px;
  background: white;
  font-size: 1.25rem;
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

/* Selected Count */
.selected-count {
  font-size: 0.875rem;
  color: #667eea;
  font-weight: 600;
  margin: 10px 5px;
}

/* Footer Navigation */
.footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.footer > div {
  flex: 1;
}

@media (max-width: 468px) {
  .semester-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
  }

  .semester-chip {
    aspect-ratio: 1;
    border: 2px solid #eee;
    border-radius: 12px;
    background: white;
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

}
</style>