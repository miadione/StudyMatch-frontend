import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../BaseButton.vue'

describe('BaseButton', () => {
  it('rendert den Slot-Inhalt', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Klick mich' }
    })
    expect(wrapper.text()).toContain('Klick mich')
  })
})
