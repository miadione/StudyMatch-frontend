<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Avatar Optionen
const selectedSeed = ref('Alex')
const topStyle = ref('shortFlat')
const hairColor = ref('2c1b18')
const skinColor = ref('edb98a')
const eyes = ref('default')
const mouth = ref('default')
const accessories = ref('wayfarers')

// Verfügbare Seeds (Namen)
const seeds = [
  { value: 'Alex', label: 'Option 1' },
  { value: 'Max', label: 'Option 2' },
  { value: 'Lisa', label: 'Option 3' },
  { value: 'Sophie', label: 'Option 4' },
  { value: 'Tom', label: 'Option 5' },
  { value: 'Emma', label: 'Option 6' },
  { value: 'Felix', label: 'Option 7' },
  { value: 'Mia', label: 'Option 8' },
  { value: 'Leon', label: 'Option 9' },
  { value: 'Anna', label: 'Option 10' },
]

// Verfügbare Optionen (korrekte DiceBear Werte)
const topStyles = [
  { value: 'shortFlat', label: 'Kurz' },
  { value: 'shortCurly', label: 'Kurz Lockig' },
  { value: 'longButNotTooLong', label: 'Lang' },
  { value: 'curly', label: 'Lockig' },
  { value: 'dreads', label: 'Dreads' },
  { value: 'shaggy', label: 'Strubbelig' },
  { value: 'bun', label: 'Dutt' },
  { value: 'bob', label: 'Bob' },
]

const hairColors = [
  { value: '2c1b18', label: 'Schwarz' },
  { value: '4a312c', label: 'Dunkelbraun' },
  { value: 'a55728', label: 'Braun' },
  { value: 'd6b370', label: 'Blond' },
  { value: 'c93305', label: 'Rot' },
  { value: 'e8e1e1', label: 'Grau' },
]

const skinColors = [
  { value: 'ffdbb4', label: 'Hell' },
  { value: 'edb98a', label: 'Mittel' },
  { value: 'd08b5b', label: 'Gebräunt' },
  { value: 'ae5d29', label: 'Braun' },
  { value: '614335', label: 'Dunkel' },
]

const eyeStyles = [
  { value: 'default', label: 'Normal' },
  { value: 'happy', label: 'Fröhlich' },
  { value: 'wink', label: 'Zwinkern' },
  { value: 'surprised', label: 'Überrascht' },
  { value: 'squint', label: 'Zusammengekniffen' },
]

const mouthStyles = [
  { value: 'default', label: 'Normal' },
  { value: 'smile', label: 'Lächeln' },
  { value: 'serious', label: 'Ernst' },
  { value: 'tongue', label: 'Zunge' },
  { value: 'twinkle', label: 'Grinsen' },
]

const accessoryOptions = [
  { value: 'eyepatch', label: 'Eyepatch' },
  { value: 'prescription01', label: 'Brille' },
  { value: 'sunglasses', label: 'Sonnenbrille' },
  { value: 'round', label: 'Rund' },
  { value: 'wayfarers', label: 'Wayfarers' },
  {value: 'kurt', label: 'Kurt'}
]

// Avatar URL generieren
const avatarUrl = computed(() => {
  const params = new URLSearchParams({
    seed: selectedSeed.value,
    top: topStyle.value,
    hairColor: hairColor.value,
    skinColor: skinColor.value,
    eyes: eyes.value,
    mouth: mouth.value,
    accessories: accessories.value,
  })

  return `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}&accessoriesProbability=100`
})

// URL an Parent weitergeben wenn sich Avatar ändert
watch(avatarUrl, (newUrl) => {
  emit('update:modelValue', newUrl)
}, { immediate: true })

// Bestehenden Avatar parsen wenn vorhanden
onMounted(() => {
  if (props.modelValue && props.modelValue.includes('dicebear.com')) {
    try {
      const url = new URL(props.modelValue)
      const params = url.searchParams

      if (params.get('seed')) selectedSeed.value = params.get('seed')!
      if (params.get('top')) topStyle.value = params.get('top')!
      if (params.get('hairColor')) hairColor.value = params.get('hairColor')!
      if (params.get('skinColor')) skinColor.value = params.get('skinColor')!
      if (params.get('eyes')) eyes.value = params.get('eyes')!
      if (params.get('mouth')) mouth.value = params.get('mouth')!
      if (params.get('accessoriesType')) accessories.value = params.get('accessoriesType')!
    } catch (e) {
      console.warn('Konnte Avatar-URL nicht parsen:', e)
    }
  }
})
</script>

<template>
  <div class="avatar-creator">
    <!-- Preview -->
    <div class="preview-section">
      <div class="avatar-preview">
        <img :src="avatarUrl" alt="Dein Avatar" />
      </div>
    </div>

    <!-- Optionen -->
    <div class="options-section">
      <!-- Seed (Basis) -->
      <div class="option-group">
        <label class="option-label">Basis</label>
        <div class="option-chips">
          <button
              v-for="s in seeds"
              :key="s.value"
              type="button"
              class="chip"
              :class="{ selected: selectedSeed === s.value }"
              @click="selectedSeed = s.value"
          >
            {{ s.label }}
          </button>
        </div>
      </div>

      <!-- Frisur -->
      <div class="option-group">
        <label class="option-label">Frisur</label>
        <div class="option-chips">
          <button
              v-for="h in topStyles"
              :key="h.value"
              type="button"
              class="chip"
              :class="{ selected: topStyle === h.value }"
              @click="topStyle = h.value"
          >
            {{ h.label }}
          </button>
        </div>
      </div>

      <!-- Haarfarbe -->
      <div class="option-group">
        <label class="option-label">Haarfarbe</label>
        <div class="option-chips">
          <button
              v-for="c in hairColors"
              :key="c.value"
              type="button"
              class="chip color-chip"
              :class="{ selected: hairColor === c.value }"
              @click="hairColor = c.value"
          >
            <span class="color-dot" :style="{ background: '#' + c.value }"></span>
            {{ c.label }}
          </button>
        </div>
      </div>

      <!-- Hautfarbe -->
      <div class="option-group">
        <label class="option-label">Hautfarbe</label>
        <div class="option-chips">
          <button
              v-for="s in skinColors"
              :key="s.value"
              type="button"
              class="chip color-chip"
              :class="{ selected: skinColor === s.value }"
              @click="skinColor = s.value"
          >
            <span class="color-dot" :style="{ background: '#' + s.value }"></span>
            {{ s.label }}
          </button>
        </div>
      </div>

      <!-- Augen -->
      <div class="option-group">
        <label class="option-label">Augen</label>
        <div class="option-chips">
          <button
              v-for="e in eyeStyles"
              :key="e.value"
              type="button"
              class="chip"
              :class="{ selected: eyes === e.value }"
              @click="eyes = e.value"
          >
            {{ e.label }}
          </button>
        </div>
      </div>

      <!-- Mund -->
      <div class="option-group">
        <label class="option-label">Mund</label>
        <div class="option-chips">
          <button
              v-for="m in mouthStyles"
              :key="m.value"
              type="button"
              class="chip"
              :class="{ selected: mouth === m.value }"
              @click="mouth = m.value"
          >
            {{ m.label }}
          </button>
        </div>
      </div>

      <!-- Accessoires -->
      <div class="option-group">
        <label class="option-label">Accessoires</label>
        <div class="option-chips">
          <button
              v-for="a in accessoryOptions"
              :key="a.value"
              type="button"
              class="chip"
              :class="{ selected: accessories === a.value }"
              @click="accessories = a.value"
          >
            {{ a.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-creator {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Preview */
.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-preview {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: var(--gradient-primary);
  padding: 4px;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: white;
}

/* Options */
.options-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.option-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 8px 14px;
  border: 2px solid #eee;
  border-radius: 16px;
  background: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.chip.color-chip {
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.chip:hover {
  border-color: #667eea;
}

.chip.selected {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
}

.chip.selected .color-dot {
  border-color: rgba(255, 255, 255, 0.3);
}

/* Mobile */
@media (max-width: 480px) {
  .option-chips {
    gap: 6px;
  }

  .chip {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}
</style>