import type { ThemeName } from "./types"
import { themes } from "./themes"

export const ACTIVE_THEME: ThemeName = "apple"

export function getTheme(name?: ThemeName) {
  return themes[name ?? ACTIVE_THEME]
}

export const theme = themes[ACTIVE_THEME]
