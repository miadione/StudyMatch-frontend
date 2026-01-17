import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LikesTab from '../LikesTab.vue'

vi.mock('@/services/likeService', () => ({
  getReceivedLikes: vi.fn().mockResolvedValue([])
}))

describe('LikesTab', () => {
  it('zeigt den Titel an', () => {
    const wrapper = mount(LikesTab)
    expect(wrapper.text()).toContain('Likes')
  })
})
