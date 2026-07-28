import { getTemplateForCategory, type TemplateConfig } from "@/engine/templates"
import type { ThemeName } from "@/engine/theme/types"

export interface AIDesignConfig {
  template: TemplateConfig
  theme: ThemeName
}

export function detectDesign(category: string): AIDesignConfig {
  const template = getTemplateForCategory(category)
  return {
    template,
    theme: template.theme,
  }
}
