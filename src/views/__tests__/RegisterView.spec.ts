import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterView from '../RegisterView.vue'

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    register: vi.fn(),
    loading: false,
    error: null
  })
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

describe('RegisterView', () => {
  it('zeigt das Registrierungs-Formular', () => {
    const wrapper = mount(RegisterView)
    expect(wrapper.find('form').exists()).toBe(true)
  })
})
