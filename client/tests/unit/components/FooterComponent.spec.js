import { mount } from '@vue/test-utils'
import FooterComponent from '@/components/layout/FooterComponent.vue'

describe('FooterComponent.vue', () => {
  it('renders creator text', () => {
    const wrapper = mount(FooterComponent)
    const text = wrapper.text()
    expect(text).toContain('Created by')
    expect(text).toContain('Sreenu Sandadi')
  })

  it('has expected classes and heart icon', () => {
    const wrapper = mount(FooterComponent)
    const span = wrapper.find('span')
    expect(span.exists()).toBe(true)
    expect(span.classes()).toEqual(
      expect.arrayContaining(['text-center', 'p-3', 'bg-body-tertiary']),
    )

    const icon = wrapper.find('i')
    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toEqual(expect.arrayContaining(['bi', 'bi-heart-fill']))
  })
})
