import { nativeTheme } from 'electron'

export const darkMode = () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
}

export const systemTheme = () => {
  return nativeTheme.themeSource = 'system';
}

export const getTheme = () => ({
  dark: nativeTheme.shouldUseDarkColors,
  theme: nativeTheme.themeSource,
  shouldUseHighContrastColors: nativeTheme.shouldUseHighContrastColors,
  shouldUseInvertedColorScheme: nativeTheme.shouldUseInvertedColorScheme,
  inForcedColorsMode: nativeTheme.inForcedColorsMode
})

