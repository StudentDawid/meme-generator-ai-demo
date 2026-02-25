<template>
  <v-layout class="fill-height">
    <!-- Header -->
    <v-app-bar flat border="b" color="background">
      <template #prepend>
        <v-icon color="primary" class="mr-2">mdi-google-circles-extended</v-icon>
        <span class="text-h6 font-weight-bold tracking-tight">MemeCraft</span>
      </template>

      <v-spacer/>

      <v-btn variant="text" prepend-icon="mdi-help-circle-outline" class="text-none mr-2">Help</v-btn>
      <input ref="fileInput" type="file" accept="image/png, image/jpeg, image/jpg" style="display: none;" @change="handleFileUpload">
      <v-btn color="primary" variant="flat" prepend-icon="mdi-upload" class="text-none" @click="triggerFileUpload">Upload Image</v-btn>
    </v-app-bar>

    <!-- Left Sidebar: Templates -->
    <v-navigation-drawer width="300" border="e" color="background" permanent>
      <div class="pa-4 border-b">
        <v-text-field
          density="compact"
          variant="solo-filled"
          placeholder="Search templates..."
          prepend-inner-icon="mdi-magnify"
          hide-details
          flat
          bg-color="surface"
        />
      </div>

      <div class="pa-4">
        <div class="text-caption font-weight-bold text-uppercase text-medium-emphasis mb-3">Trending</div>
        
        <div v-if="pending" class="d-flex justify-center pa-4">
          <v-progress-circular indeterminate color="primary"/>
        </div>
        
        <v-row v-else dense>
          <v-col v-for="meme in trendingMemes" :key="meme.id" cols="6">
            <v-card
              class="ratio-1-1 d-flex flex-column align-end justify-end cursor-pointer group"
              color="surface-variant"
              flat
              border
              @click="selectedMeme = meme"
            >
              <v-img :src="meme.url" cover class="w-100 h-100 position-absolute" />
              <div class="w-100 text-caption text-white bg-black-50 pa-1 text-truncate z-1 mt-auto" style="z-index: 1;">
                {{ meme.name }}
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-navigation-drawer>

    <!-- Right Sidebar: Controls -->
    <v-navigation-drawer location="right" width="340" border="s" color="background" class="d-flex flex-column" permanent>
      <div class="pa-6 flex-grow-1 overflow-y-auto">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="text-subtitle-2 font-weight-bold">Text Layers</div>
          <v-btn variant="text" color="primary" size="small" class="text-none px-2 font-weight-bold">+ Add Text</v-btn>
        </div>

        <!-- Top Text -->
        <v-card variant="flat" class="pa-3 mb-4 rounded-lg bg-surface border">
          <div class="text-caption text-medium-emphasis mb-2 font-weight-medium">Top Caption</div>
          <v-text-field
            v-model="topText"
            density="compact"
            variant="outlined"
            hide-details
            class="mb-3"
          />
          <div class="d-flex align-center gap-2 mb-3">
            <v-select
              v-model="topFont"
              density="compact"
              variant="outlined"
              hide-details
              :items="fonts"
              label="Font"
              class="flex-grow-1"
            />
            <div class="d-flex align-center gap-1">
              <v-btn icon size="x-small" variant="outlined" class="bg-white rounded" title="Text Color"/>
              <v-btn icon size="x-small" variant="outlined" class="bg-black rounded" title="Stroke Color"/>
            </div>
          </div>
          <div>
            <div class="d-flex justify-space-between text-caption text-medium-emphasis mb-1">
              <span>Size</span>
              <span>{{ topSize }}px</span>
            </div>
            <v-slider
              v-model="topSize"
              density="compact"
              hide-details
              thumb-size="12"
              color="primary"
              max="120"
              min="10"
              class="mt-n2"
            />
          </div>
        </v-card>

        <!-- Bottom Text -->
        <v-card variant="flat" class="pa-3 mb-6 rounded-lg bg-surface border">
          <div class="text-caption text-medium-emphasis mb-2 font-weight-medium">Bottom Caption</div>
          <v-textarea
            v-model="bottomText"
            density="compact"
            variant="outlined"
            hide-details
            rows="2"
            auto-grow
            class="mb-3"
          />
          <div class="d-flex align-center gap-2 mb-3">
            <v-select
              v-model="bottomFont"
              density="compact"
              variant="outlined"
              hide-details
              :items="fonts"
              label="Font"
              class="flex-grow-1"
            />
            <div class="d-flex align-center gap-1">
              <v-btn icon size="x-small" variant="outlined" class="bg-white rounded" title="Text Color"/>
              <v-btn icon size="x-small" variant="outlined" class="bg-black rounded" title="Stroke Color"/>
            </div>
          </div>
          <div>
            <div class="d-flex justify-space-between text-caption text-medium-emphasis mb-1">
              <span>Size</span>
              <span>{{ bottomSize }}px</span>
            </div>
            <v-slider
              v-model="bottomSize"
              density="compact"
              hide-details
              thumb-size="12"
              color="primary"
              max="120"
              min="10"
              class="mt-n2"
            />
          </div>
        </v-card>
        
        <v-divider class="mb-6"/>

        <!-- Advanced Area -->
        <div class="mb-4">
          <div class="text-subtitle-2 font-weight-bold mb-4">Effects & Filter</div>
          <v-row dense class="mb-4">
            <v-col v-for="effect in filters" :key="effect.name" cols="3">
              <v-card variant="flat" class="bg-surface ratio-1-1 d-flex flex-column align-center justify-center cursor-pointer effect-card">
                <v-icon size="small" class="mb-1">{{ effect.icon }}</v-icon>
                <span class="text-[10px]">{{ effect.name }}</span>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="pa-6 bg-background border-t mt-auto">
        <v-btn color="primary" block size="large" class="font-weight-bold mb-4 text-none" @click="downloadMeme">
          <v-icon start>mdi-download</v-icon>
          Download Meme
        </v-btn>
        <div class="d-flex justify-center gap-4 text-medium-emphasis">
          <v-btn icon="mdi-share-variant" variant="text" density="comfortable"/>
          <v-btn icon="mdi-link" variant="text" density="comfortable"/>
          <v-btn icon="mdi-bookmark-outline" variant="text" density="comfortable"/>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Center Workspace -->
    <v-main class="bg-grey-darken-4 h-100 position-relative" style="pointer-events: none;">
      <div class="d-flex align-center justify-space-between w-100 position-absolute top-0 left-0 right-0 pa-4 z-10 w-100" style="z-index: 10; pointer-events: auto;">
        <div class="d-flex gap-2">
          <v-btn icon="mdi-undo" size="small" color="surface" elevation="2"/>
          <v-btn icon="mdi-redo" size="small" color="surface" elevation="2"/>
        </div>
        <div class="d-flex gap-2">
          <v-btn prepend-icon="mdi-aspect-ratio" size="small" color="surface" elevation="2" class="text-none">Fit</v-btn>
          <v-btn append-icon="mdi-chevron-down" size="small" color="surface" elevation="2" class="text-none">100%</v-btn>
        </div>
      </div>

      <div class="h-100 d-flex flex-column" style="pointer-events: auto;">
        <div class="flex-grow-1 d-flex align-center justify-center pa-8 overflow-hidden">
          <v-card elevation="10" class="position-relative bg-transparent mx-auto d-inline-block" style="max-width: 100%; max-height: 100%;">
            <!-- Render the Fabric.js canvas here -->
            <canvas id="meme-canvas" ref="canvasEl" />
          </v-card>
        </div>

        <div class="bg-surface border-t py-2 px-4 d-flex justify-space-between align-center text-caption text-medium-emphasis flex-shrink-0">
          <div class="d-flex align-center" style="gap: 16px;">
            <span v-if="selectedMeme">{{ selectedMeme.width }} x {{ selectedMeme.height }}px</span>
            <span v-else>800 x 600px</span>
            <span>1.2 MB</span>
          </div>
          <div class="d-flex align-center gap-2">
            <v-badge dot color="success" inline/>
            <span>Auto-saved</span>
          </div>
        </div>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { fabric } from 'fabric'

export interface Meme {
  id: string
  name: string
  url: string
  width: number
  height: number
  box_count: number
  captions: number
}

const { data, pending } = useFetch<{ success: boolean; data: { memes: Meme[] } }>('https://api.imgflip.com/get_memes')

const memes = computed(() => data.value?.data?.memes || [])
const trendingMemes = computed(() => memes.value.slice(0, 16))

const selectedMeme = ref<Meme | null>(null)

// Ensure at least one is selected when loaded
watch(memes, (newMemes) => {
  if (newMemes.length > 0 && !selectedMeme.value) {
    selectedMeme.value = newMemes[0] || null
  }
})

const topText = ref('WHEN THE CODE')
const bottomText = ref('FINALLY COMPILES')
const topSize = ref(48)
const bottomSize = ref(48)
const topFont = ref('Impact')
const bottomFont = ref('Impact')

const fonts = ['Impact', 'Arial', 'Comic Sans MS', 'Helvetica']

const filters = [
  { name: 'Fry', icon: 'mdi-contrast' },
  { name: 'Blur', icon: 'mdi-blur' },
  { name: 'B&W', icon: 'mdi-palette-outline' },
  { name: 'Noise', icon: 'mdi-grain' },
]

// --- Fabric.js and Canvas Logic ---
const canvasEl = ref<HTMLCanvasElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

let fCanvas: fabric.Canvas | null = null
let fTopText: fabric.IText | null = null
let fBottomText: fabric.IText | null = null
let fabricLib: typeof fabric | null = null

onMounted(async () => {
  // Dynamically import fabric to avoid SSR errors
  const fModule = await import('fabric')
  fabricLib = fModule.fabric
  
  if (!canvasEl.value) return

  fCanvas = new fabricLib.Canvas(canvasEl.value, {
    width: 800,
    height: 600,
    backgroundColor: '#1E1E1E',
  })

  initTextLayers()

  // Track text edits directly on canvas to update vue refs
  fCanvas?.on('text:changed', (e: fabric.IEvent) => {
    if (e.target === fTopText) topText.value = (e.target as fabric.IText).text || ''
    if (e.target === fBottomText) bottomText.value = (e.target as fabric.IText).text || ''
  })

  if (selectedMeme.value) {
    loadMemeImage(selectedMeme.value.url)
  }
})

function initTextLayers() {
  if (!fabricLib || !fCanvas) return

  const textOptions = {
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    fontFamily: topFont.value,
    fontWeight: '900',
    textAlign: 'center',
    originX: 'center' as const,
    originY: 'center' as const,
    transparentCorners: false,
    cornerColor: '#6200EE',
    cornerStyle: 'circle' as const
  }
  
  fTopText = new fabricLib.IText(topText.value.toUpperCase(), {
    ...textOptions,
    fontSize: topSize.value,
    left: fCanvas.width ? fCanvas.width / 2 : 400,
    top: 50,
  })
  
  fBottomText = new fabricLib.IText(bottomText.value.toUpperCase(), {
    ...textOptions,
    fontSize: bottomSize.value,
    left: fCanvas.width ? fCanvas.width / 2 : 400,
    top: fCanvas.height ? fCanvas.height - 50 : 550,
  })
  
  fCanvas?.add(fTopText, fBottomText)
}

function loadMemeImage(url: string) {
  if (!fabricLib || !fCanvas) return
  
  fabricLib.Image.fromURL(url, (img: fabric.Image) => {
    const maxWidth = 800
    const maxHeight = window.innerHeight - 140
    let sc = 1
    
    if (img.width > maxWidth || img.height > maxHeight) {
      sc = Math.min(maxWidth / img.width, maxHeight / img.height)
    }
    
    // Scale canvas to image aspect ratio
    fCanvas?.setWidth((img.width || 0) * sc)
    fCanvas?.setHeight((img.height || 0) * sc)
    
    img.scale(sc)
    
    if (fCanvas) fCanvas.setBackgroundImage(img, fCanvas.renderAll.bind(fCanvas))
    
    // Update text positions
    fTopText?.set({ left: fCanvas?.width ? fCanvas.width / 2 : 0, top: 40 })
    fBottomText?.set({ left: fCanvas?.width ? fCanvas.width / 2 : 0, top: fCanvas?.height ? fCanvas.height - 40 : 0 })
    fTopText?.setCoords()
    fBottomText?.setCoords()
    
    fCanvas?.renderAll()
  }, { crossOrigin: 'anonymous' })
}

watch(selectedMeme, (newMeme) => {
  if (newMeme) loadMemeImage(newMeme.url)
})

watch([topText, topFont, topSize], () => {
  if (!fTopText) return
  fTopText.set({ 
    text: topText.value.toUpperCase(), 
    fontFamily: topFont.value, 
    fontSize: topSize.value 
  })
  fCanvas?.renderAll()
})

watch([bottomText, bottomFont, bottomSize], () => {
  if (!fBottomText) return
  fBottomText.set({ 
    text: bottomText.value.toUpperCase(), 
    fontFamily: bottomFont.value, 
    fontSize: bottomSize.value 
  })
  fCanvas?.renderAll()
})

// --- Feature: Upload Image ---
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      loadMemeImage(dataUrl)
      selectedMeme.value = null // odznacz memy po lewej by był czysty wrzut
    }
    reader.readAsDataURL(file)
  }
}

// --- Feature: Download Image ---
const downloadMeme = () => {
  if (!fCanvas) return
  // Prevent selection boxes in downloaded image
  fCanvas.discardActiveObject()
  fCanvas.renderAll()

  const dataURL = fCanvas.toDataURL({ format: 'png', quality: 1 })
  const link = document.createElement('a')
  link.download = 'memecraft-masterpiece.png'
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.ratio-1-1 {
  aspect-ratio: 1 / 1;
}
.bg-black-50 {
  background-color: rgba(0, 0, 0, 0.6);
}
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.pointer-events-none { pointer-events: none; }
.meme-text {
  -webkit-text-stroke: 2px black;
  text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000;
  font-weight: 900;
  line-height: 1.1;
  word-wrap: break-word;
}
.effect-card:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.08) !important;
}
.text-\[10px\] {
  font-size: 10px;
}
</style>
