import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileTab from '../ProfileTab.vue'

vi.mock('@/services/profileService', () => ({
  getMyProfile: vi.fn().mockResolvedValue({ vorname: 'Max' })
}))

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ logout: vi.fn() })
}))

describe('ProfileTab', () => {
  it('rendert die Komponente', () => {
    const wrapper = mount(ProfileTab)
    expect(wrapper.exists()).toBe(true)
  })
})
