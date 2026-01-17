import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '../LoginView.vue'

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    loading: false,
    error: null
  })
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

describe('LoginView', () => {
  it('zeigt das Login-Formular', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.find('form').exists()).toBe(true)
  })
})
