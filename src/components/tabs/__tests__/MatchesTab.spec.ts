import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MatchesTab from '../MatchesTab.vue'

vi.mock('@/services/matchService', () => ({
  getMatches: vi.fn().mockResolvedValue([])
}))

describe('MatchesTab', () => {
  it('zeigt den Titel an', () => {
    const wrapper = mount(MatchesTab)
    expect(wrapper.text()).toContain('Matches')
  })
})
