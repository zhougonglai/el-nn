import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useTheme = defineStore('theme', {
  state: () => reactive({
    dark: false,
    theme: 'system',
    systemTheme: 'light',
    shouldUseHighContrastColors: false,
    shouldUseInvertedColorScheme: false,
    inForcedColorsMode: false,
  }),
})
