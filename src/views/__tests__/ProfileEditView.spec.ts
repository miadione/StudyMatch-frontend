import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileEditView from '../ProfileEditView.vue'

vi.mock('@/services/profileService', () => ({
  getMyProfile: vi.fn().mockResolvedValue({}),
  updateProfile: vi.fn(),
  fetchCourses: vi.fn().mockResolvedValue([]),
  fetchSubjects: vi.fn().mockResolvedValue([]),
  fetchLanguages: vi.fn().mockResolvedValue([])
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

describe('ProfileEditView', () => {
  it('rendert die Komponente', () => {
    const wrapper = mount(ProfileEditView)
    expect(wrapper.exists()).toBe(true)
  })
})
