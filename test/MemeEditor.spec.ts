import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MemeEditor from '../app/components/MemeEditor.vue'

describe('MemeEditor.vue', () => {
  it('renders correctly', async () => {
    // Mount the component
    // Zawiera ono wywołanie useFetch oraz instancję canvasu. 
    // `mountSuspended` to rekomendowane rozwiązanie do testowania Nuxt 3 (szczególnie tam gdzie SSR lub UseFetch).
    const wrapper = await mountSuspended(MemeEditor)
    
    // Test 1: Upewnij się że komponent się zamontował i wyświetla nagłówek "MemeCraft"
    expect(wrapper.text()).toContain('MemeCraft')
    
    // Test 2: Główne boczne paski zostały zidentyfikowane
    expect(wrapper.text()).toContain('Text Layers')
    expect(wrapper.text()).toContain('Trending')
    
    // Test 3: Element <canvas> jest w DOM
    expect(wrapper.find('canvas#meme-canvas').exists()).toBe(true)
  })

  it('displays the generic default setup text fields', async () => {
    const wrapper = await mountSuspended(MemeEditor)
    
    // Oczekujemy że od razu są ładowane 2 bloki do edycji tekstu z domyślnymi słowami (góra i dół).
    // Ponieważ to text-field i textarea, sprawdzamy ich atrybut value
    const inputs = wrapper.findAll('textarea, input[type="text"]')
    
    // Szukamy elementów <input> / <textarea> z wpisanym testowym statem
    const allValues = inputs.map(i => (i.element as HTMLInputElement | HTMLTextAreaElement).value)
    
    expect(allValues).toContain('WHEN THE CODE')
    expect(allValues).toContain('FINALLY COMPILES')
  })
})
