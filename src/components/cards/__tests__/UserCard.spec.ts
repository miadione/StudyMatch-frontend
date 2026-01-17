import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from '../UserCard.vue'

describe('UserCard', () => {
  it('zeigt den Namen an', () => {
    const wrapper = mount(UserCard, {
      props: {
        profile: {
          id: 1,
          vorname: 'Max',
          course: 'Informatik',
          semester: 3,
          subjects: [],
          languages: [],
          gender: "MALE",
          bio: "",
          birthdate: "",
          profilePictureUrl: "",
          onboardingStep: 0,
          profileComplete: false,
          createdAt: "",
          updatedAt: ""
        }
      }
    })
    expect(wrapper.text()).toContain('Max')
  })
})
