import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AvatarCreator from '../AvatarCreator.vue'

describe('AvatarCreator', () => {
  it('generiert eine DiceBear URL', () => {
    const wrapper = mount(AvatarCreator, {
      props: { modelValue: '' }
    })
    expect(wrapper.find('img').attributes('src')).toContain('dicebear.com')
  })
})
