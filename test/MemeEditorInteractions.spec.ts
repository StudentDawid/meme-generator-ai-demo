import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MemeEditor from '../app/components/MemeEditor.vue'

// Mock fabric to ensure canvas and interactions work
vi.mock('fabric', () => {
  const Canvas = class {
    constructor() {
      this.backgroundImage = {
        filters: [],
        applyFilters: () => {}
      }
      this.width = 800
      this.height = 600
    }
    add() {}
    remove() {}
    renderAll() {}
    on() {}
    getObjects() { return [] }
    setActiveObject() {}
    discardActiveObject() {}
    setWidth() {}
    setHeight() {}
    setBackgroundImage(img: any, cb: any) {
        this.backgroundImage = img
        if(cb) cb()
    }
    toJSON() { return { objects: [] } }
  }

  return {
    fabric: {
      Canvas,
      IText: class {
        constructor() {}
        set() {}
        setCoords() {}
      },
      Image: {
        fromURL: (url: string, cb: any) => {
            const img = {
                width: 800,
                height: 600,
                scale: () => {},
                setCoords: () => {},
                filters: [],
                applyFilters: () => {}
            }
            cb(img)
        },
        filters: {
          Grayscale: class {},
          Blur: class {},
          Noise: class {}
        }
      }
    }
  }
})

describe('MemeEditor Interactions', () => {
  it('adds a new text layer when "Add Text" is clicked', async () => {
    const wrapper = await mountSuspended(MemeEditor)

    // Wait for onMounted async import
    await new Promise(resolve => setTimeout(resolve, 200))

    // Check "ADDITIONAL TEXT" does not exist yet
    const initialInputs = wrapper.findAll('textarea, input')
    const hasAdditional = initialInputs.some(i => (i.element as HTMLInputElement).value === 'ADDITIONAL TEXT')
    expect(hasAdditional).toBe(false)

    // Find button with text "+ Add Text"
    const buttons = wrapper.findAll('button')
    const addTextBtn = buttons.find(b => b.text().includes('Add Text'))
    expect(addTextBtn?.exists()).toBe(true)

    await addTextBtn!.trigger('click')

    // Check "ADDITIONAL TEXT" exists
    const finalInputs = wrapper.findAll('textarea, input')
    const hasAdditionalNow = finalInputs.some(i => (i.element as HTMLInputElement).value === 'ADDITIONAL TEXT')
    expect(hasAdditionalNow).toBe(true)
  })

  it('removes a text layer when delete button is clicked', async () => {
    const wrapper = await mountSuspended(MemeEditor)

    // Wait for onMounted async import
    await new Promise(resolve => setTimeout(resolve, 200))

    // Add a text layer first
    const buttons = wrapper.findAll('button')
    const addTextBtn = buttons.find(b => b.text().includes('Add Text'))
    await addTextBtn!.trigger('click')

    // Verify added
    let inputs = wrapper.findAll('textarea, input')
    expect(inputs.some(i => (i.element as HTMLInputElement).value === 'ADDITIONAL TEXT')).toBe(true)

    // Find the delete button (mdi-close)
    const deleteBtn = wrapper.findAll('button').find(b => b.html().includes('mdi-close'))
    expect(deleteBtn?.exists()).toBe(true)

    await deleteBtn!.trigger('click')

    // Verify removed
    inputs = wrapper.findAll('textarea, input')
    expect(inputs.some(i => (i.element as HTMLInputElement).value === 'ADDITIONAL TEXT')).toBe(false)
  })

  it('toggles filter selection', async () => {
    const wrapper = await mountSuspended(MemeEditor)

    // Wait for onMounted async import
    await new Promise(resolve => setTimeout(resolve, 200))

    // Find filter card "B&W"
    const filterCards = wrapper.findAll('.effect-card')
    const bwCard = filterCards.find(c => c.text().includes('B&W'))
    expect(bwCard?.exists()).toBe(true)

    await bwCard!.trigger('click')

    // Check if the span inside has 'text-primary' class
    const span = bwCard!.find('span.text-\\[10px\\]')
    expect(span.classes()).toContain('text-primary')

    // Toggle off
    await bwCard!.trigger('click')
    expect(span.classes()).not.toContain('text-primary')
  })
})
