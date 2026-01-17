import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '../BaseInput.vue'

describe('BaseInput', () => {
  it('rendert das Label', () => {
    const wrapper = mount(BaseInput, {
      props: { label: 'E-Mail', modelValue: '' }
    })
    expect(wrapper.find('label').text()).toBe('E-Mail')
  })
})
