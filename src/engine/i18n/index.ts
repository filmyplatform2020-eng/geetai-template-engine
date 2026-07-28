import { regions, type CurrencyCode, type LocaleCode, type RegionConfig } from "./config"

export type { CurrencyCode, LocaleCode, RegionConfig }
export { regions }

export const DEFAULT_REGION = "us"

export const localeLabels: Record<LocaleCode, string> = {
  "en-US": "English (US)",
  "en-GB": "English (UK)",
  "en-IN": "English (India)",
  "en-AU": "English (Australia)",
  "de-DE": "Deutsch",
  "fr-FR": "Français",
  "ja-JP": "日本語",
}
