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
        
        <v-row v-else density="compact">
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
          <v-btn variant="text" color="primary" size="small" class="text-none px-2 font-weight-bold" @click="addGenericText">+ Add Text</v-btn>
        </div>

        <!-- Dynamic Text Layers -->
        <v-card v-for="(layer, index) in textLayers" :key="layer.id" variant="flat" class="pa-3 mb-4 rounded-lg bg-surface border">
          <div class="d-flex justify-space-between align-center text-caption text-medium-emphasis mb-2 font-weight-medium">
            <span>{{ layer.name }}</span>
            <v-btn v-if="index > 1" icon="mdi-close" size="x-small" variant="text" @click="removeTextLayer(layer)" />
          </div>
          <v-textarea
v-if="index > 0"
            v-model="layer.text"
            density="compact"
            variant="outlined"
            hide-details
            rows="2"
            auto-grow
            class="mb-3"
            @update:model-value="updateTextFromPanel(layer)"
          />
          <v-text-field
v-else
            v-model="layer.text"
            density="compact"
            variant="outlined"
            hide-details
            class="mb-3"
            @update:model-value="updateTextFromPanel(layer)"
          />
          <div class="d-flex align-center gap-2 mb-3">
            <v-select
              v-model="layer.font"
              density="compact"
              variant="outlined"
              hide-details
              :items="fonts"
              label="Font"
              class="flex-grow-1"
              @update:model-value="updateTextFromPanel(layer)"
            />
            <div class="d-flex align-center gap-1">
              <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon size="x-small" variant="outlined" :style="`background-color: ${layer.color}`" class="rounded" title="Text Color"/>
                </template>
                <v-color-picker v-model="layer.color" hide-inputs @update:model-value="updateTextFromPanel(layer)" />
              </v-menu>

              <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon size="x-small" variant="outlined" :style="`background-color: ${layer.stroke}`" class="rounded" title="Stroke Color"/>
                </template>
                <v-color-picker v-model="layer.stroke" hide-inputs @update:model-value="updateTextFromPanel(layer)" />
              </v-menu>
            </div>
          </div>
          <div>
            <div class="d-flex justify-space-between text-caption text-medium-emphasis mb-1">
              <span>Size</span>
              <span>{{ layer.size }}px</span>
            </div>
            <v-slider
              v-model="layer.size"
              density="compact"
              hide-details
              thumb-size="12"
              color="primary"
              max="120"
              min="10"
              class="mt-n2"
              @update:model-value="updateTextFromPanel(layer)"
            />
          </div>
        </v-card>
        
        <v-divider class="mb-6"/>

        <!-- Advanced Area -->
        <div class="mb-4">
          <div class="text-subtitle-2 font-weight-bold mb-4">Effects & Filter</div>
          <v-row density="compact" class="mb-4">
            <v-col v-for="effect in filters" :key="effect.name" cols="3">
              <v-card variant="flat" class="bg-surface ratio-1-1 d-flex flex-column align-center justify-center cursor-pointer effect-card" @click="applyFilter(effect.name)">
                <v-icon size="small" class="mb-1" :color="activeFilter === effect.name ? 'primary' : undefined">{{ effect.icon }}</v-icon>
                <span class="text-[10px]" :class="{ 'text-primary font-weight-bold': activeFilter === effect.name }">{{ effect.name }}</span>
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
          <v-btn icon="mdi-share-variant" variant="text" density="comfortable" title="Share via Web API" @click="shareMeme"/>
          <v-btn icon="mdi-link" variant="text" density="comfortable" title="Copy Web Link" @click="copyLink"/>
          <v-btn icon="mdi-bookmark-outline" variant="text" density="comfortable" title="Save / Bookmark" @click="triggerHelp"/>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Center Workspace -->
    <v-main class="bg-grey-darken-4 h-100 position-relative" style="pointer-events: none;">
      <div class="d-flex align-center justify-space-between w-100 position-absolute top-0 left-0 right-0 pa-4 z-10 w-100" style="z-index: 10; pointer-events: auto;">
        <div class="d-flex gap-2">
          <v-btn icon="mdi-undo" size="small" color="surface" elevation="2" :disabled="!canUndo" @click="undo" />
          <v-btn icon="mdi-redo" size="small" color="surface" elevation="2" :disabled="!canRedo" @click="redo" />
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

export interface TextLayerDef {
  id: string
  name: string
  text: string
  size: number
  font: string
  color: string
  stroke: string
}

const textLayers = ref<TextLayerDef[]>([
  { id: 'top', name: 'Top Caption', text: 'WHEN THE CODE', size: 48, font: 'Impact', color: '#FFFFFF', stroke: '#000000' },
  { id: 'bottom', name: 'Bottom Caption', text: 'FINALLY COMPILES', size: 48, font: 'Impact', color: '#FFFFFF', stroke: '#000000' }
])

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const activeFilter = ref('')

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

let canvasHistory: string[] = []
let historyIndex = -1
let isHistoryProcessing = false

const canUndo = computed(() => historyIndex > 0)
const canRedo = computed(() => historyIndex < canvasHistory.length - 1)

let fCanvas: fabric.Canvas | null = null
let fabricLib: typeof fabric | null = null

const currentScale = ref(1)

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
    if (isHistoryProcessing) return
    const obj = e.target as (fabric.IText & { id?: string })
    const layer = textLayers.value.find(l => l.id === obj.id)
    if (layer) layer.text = obj.text || ''
    scheduleHistorySave()
  })

  fCanvas?.on('object:modified', () => scheduleHistorySave())
  fCanvas?.on('object:added', () => scheduleHistorySave())
  fCanvas?.on('object:removed', () => scheduleHistorySave())

  if (selectedMeme.value) {
    loadMemeImage(selectedMeme.value.url)
  }
})

function initTextLayers() {
  if (!fabricLib || !fCanvas) return

  const commonOptions = {
    strokeWidth: 2,
    fontWeight: '900',
    textAlign: 'center',
    originX: 'center' as const,
    originY: 'center' as const,
    transparentCorners: false,
    cornerColor: '#6200EE',
    cornerStyle: 'circle' as const
  }
  
  textLayers.value.forEach((layer, index) => {
    const textObj = new fabricLib!.IText(layer.text.toUpperCase(), {
      ...commonOptions,
      id: layer.id,
      fill: layer.color,
      stroke: layer.stroke,
      fontFamily: layer.font,
      fontSize: layer.size,
      left: fCanvas!.width ? fCanvas!.width / 2 : 400,
      top: index === 0 ? 50 : fCanvas!.height ? fCanvas!.height - 50 : 550,
    } as unknown as fabric.ITextOptions & { id: string })
    fCanvas!.add(textObj)
  })
}

// History Logic
function scheduleHistorySave() {
  if (isHistoryProcessing || !fCanvas) return
  const currentJson = JSON.stringify(fCanvas.toJSON(['id']))
  if (canvasHistory.length > 0 && canvasHistory[historyIndex] === currentJson) return
  
  if (historyIndex < canvasHistory.length - 1) {
    canvasHistory = canvasHistory.slice(0, historyIndex + 1)
  }
  canvasHistory.push(currentJson)
  if (canvasHistory.length > 30) canvasHistory.shift() // Limit to 30 steps
  else historyIndex++
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--
    restoreHistoryState()
  }
}

function redo() {
  if (historyIndex < canvasHistory.length - 1) {
    historyIndex++
    restoreHistoryState()
  }
}

function restoreHistoryState() {
  if (!fCanvas || !fabricLib) return
  isHistoryProcessing = true
  fCanvas.loadFromJSON(canvasHistory[historyIndex], () => {
    fCanvas!.renderAll()
    rebuildTextLayersFromCanvas()
    isHistoryProcessing = false
  })
}

function rebuildTextLayersFromCanvas() {
  if (!fCanvas) return
  const objects = fCanvas.getObjects('i-text') as (fabric.IText & { id?: string })[]
  textLayers.value = objects.map(o => ({
    id: o.id || generateId(),
    name: 'Text Layer',
    text: o.text || '',
    size: o.fontSize || 48,
    font: o.fontFamily || 'Impact',
    color: (o.fill as string) || '#FFFFFF',
    stroke: (o.stroke as string) || '#000000',
  }))
}

function removeTextLayer(layer: TextLayerDef) {
  textLayers.value = textLayers.value.filter(l => l.id !== layer.id)
  if (fCanvas) {
    const obj = fCanvas.getObjects('i-text').find((o: fabric.Object & { id?: string }) => o.id === layer.id)
    if (obj) fCanvas.remove(obj)
    fCanvas.renderAll()
    scheduleHistorySave()
  }
}

// --- Update layer from right sidebar
function updateTextFromPanel(layer: TextLayerDef) {
  if (!fCanvas) return
  const objects = fCanvas.getObjects('i-text') as (fabric.IText & { id?: string })[]
  const obj = objects.find(o => o.id === layer.id)
  
  if (obj) {
    obj.set({
      text: layer.text.toUpperCase(),
      fontFamily: layer.font,
      fontSize: layer.size,
      fill: layer.color,
      stroke: layer.stroke
    })
    fCanvas.renderAll()
    scheduleHistorySave() // manual override save
  }
}

// Ensure the image scales properly when chosen
function loadMemeImage(url: string) {
  if (!fabricLib || !fCanvas) return
  
  fabricLib.Image.fromURL(url, (img: fabric.Image) => {
    const maxWidth = 800
    const maxHeight = window.innerHeight - 140
    let sc = 1
    
    const iw = img.width || 800
    const ih = img.height || 600
    
    if (iw > maxWidth || ih > maxHeight) {
      sc = Math.min(maxWidth / iw, maxHeight / ih)
    }
    
    currentScale.value = sc
    
    // Scale canvas to image aspect ratio
    fCanvas?.setWidth(iw * sc)
    fCanvas?.setHeight(ih * sc)
    
    img.scale(sc)
    
    if (fCanvas) {
      fCanvas.setBackgroundImage(img, fCanvas.renderAll.bind(fCanvas))
      // After image is applied, if this is initial load - align defaults
      const texts = fCanvas.getObjects('i-text') as (fabric.IText & { id?: string })[]
      texts.forEach((txt) => {
        if (txt.id === 'top') txt.set({ left: fCanvas!.width ? fCanvas!.width / 2 : 0, top: 40 })
        if (txt.id === 'bottom') txt.set({ left: fCanvas!.width ? fCanvas!.width / 2 : 0, top: fCanvas!.height ? fCanvas!.height - 40 : 0 })
        txt.setCoords()
      })
      fCanvas.renderAll()
      canvasHistory = []
      historyIndex = -1
      scheduleHistorySave()
    }
  }, { crossOrigin: 'anonymous' })
}

watch(selectedMeme, (newMeme) => {
  if (newMeme) loadMemeImage(newMeme.url)
})

function applyFilter(filterName: string) {
  if (!fCanvas || !fabricLib) return
  const imgObj = fCanvas.backgroundImage as fabric.Image | undefined
  if (!imgObj) return

  activeFilter.value = activeFilter.value === filterName ? '' : filterName
  imgObj.filters = []

  if (activeFilter.value === 'B&W') {
    imgObj.filters.push(new fabricLib.Image.filters.Grayscale())
  } else if (activeFilter.value === 'Blur') {
    imgObj.filters.push(new fabricLib.Image.filters.Blur({ blur: 0.2 }))
  } else if (activeFilter.value === 'Noise') {
    imgObj.filters.push(new fabricLib.Image.filters.Noise({ noise: 100 }))
  }

  imgObj.applyFilters()
  fCanvas.renderAll()
}

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

// --- Feature: Download Image (High Res export) ---
const downloadMeme = () => {
  if (!fCanvas) return
  // Prevent selection boxes in downloaded image
  fCanvas.discardActiveObject()
  fCanvas.renderAll()

  // multiplier allows you to export high resolution original scaling
  const multiplier = currentScale.value > 0 ? 1 / currentScale.value : 1
  const dataURL = fCanvas.toDataURL({ format: 'png', quality: 1, multiplier })
  
  const link = document.createElement('a')
  link.download = `memecraft-${selectedMeme.value?.name?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'masterpiece'}.png`
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// --- Extras: Export Share / Texts
const addGenericText = () => {
  if (!fCanvas || !fabricLib) return
  const newId = generateId()
  const textOpts = {
    id: newId,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    fontFamily: 'Impact',
    fontWeight: '900',
    textAlign: 'center',
    originX: 'center' as const,
    originY: 'center' as const,
    transparentCorners: false,
    cornerColor: '#6200EE',
    cornerStyle: 'circle' as const
  }
  const newTextObj = new fabricLib.IText('ADDITIONAL TEXT', {
    ...textOpts,
    fontSize: 48,
    left: fCanvas.width ? fCanvas.width / 2 : 400,
    top: fCanvas.height ? fCanvas.height / 2 : 300,
  } as unknown as fabric.ITextOptions & { id: string })
  
  fCanvas.add(newTextObj)
  fCanvas.setActiveObject(newTextObj)
  fCanvas.renderAll()
  
  // Create UI representation
  textLayers.value.push({
    id: newId,
    name: `Text ${textLayers.value.length + 1}`,
    text: 'ADDITIONAL TEXT',
    size: 48,
    font: 'Impact',
    color: '#FFFFFF',
    stroke: '#000000'
  })
  
  scheduleHistorySave()
}

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
  alert('Tool Link Copied to Clipboard!')
}

const shareMeme = async () => {
  if (!fCanvas) return
  fCanvas.discardActiveObject()
  fCanvas.renderAll()
  
  const multiplier = currentScale.value > 0 ? 1 / currentScale.value : 1
  const dataURL = fCanvas.toDataURL({ format: 'png', quality: 1, multiplier })
  
  try {
    const b64 = dataURL.split(',')[1]
    if (!b64) return
    const rawData = atob(b64)
    const arr = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; i++) {
        arr[i] = rawData.charCodeAt(i)
    }
    const blob = new Blob([arr], { type: 'image/png' })
    const file = new File([blob], 'memecraft.png', { type: 'image/png' })
    if (navigator.share) {
      await navigator.share({
        title: 'My MemeCraft Masterpiece',
        text: 'Check out the meme I just created!',
        files: [file]
      })
    } else {
      alert('Native Share is not supported in this browser. Please download it instead.')
    }
  } catch(e) { 
    console.error('Sharing failed', e) 
  }
}

const triggerHelp = () => {
  alert('Bookmarks module coming soon! Click download buttons instead.')
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
