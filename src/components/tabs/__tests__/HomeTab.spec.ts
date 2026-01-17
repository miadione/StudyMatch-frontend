import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeTab from '../HomeTab.vue'

vi.mock('@/services/profileService', () => ({
  getDiscoverProfiles: vi.fn().mockResolvedValue([])
}))

describe('HomeTab', () => {
  it('rendert die Komponente', () => {
    const wrapper = mount(HomeTab)
    expect(wrapper.exists()).toBe(true)
  })
})
