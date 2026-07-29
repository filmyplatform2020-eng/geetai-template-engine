import type { ProductCatalog } from "@/engine/product/types"
import { macbookPro } from "./macbook-pro"
import { macbookAir15 } from "./macbook-air-15-m3"
import { dellXps16 } from "./dell-xps-16-2025"
import { iphone16ProMax } from "./iphone-16-pro-max"
import { galaxyS25Ultra } from "./galaxy-s25-ultra"
import { sonyWH1000XM6 } from "./sony-wh-1000xm6"
import { ipadPro13 } from "./ipad-pro-13-m4"
import { appleWatchUltra3 } from "./apple-watch-ultra-3"
import { ps5Pro } from "./ps5-pro"
import { sonyA7V } from "./sony-a7v"
import { samsungQDOLED } from "./samsung-qd-oled"
import { airpodsPro3 } from "./airpods-pro-3"
import { nintendoSwitch2 } from "./nintendo-switch-2"
import { metaQuest4 } from "./meta-quest-4"
import { djiAir4 } from "./dji-air-4"
import { kindleScribe2 } from "./kindle-scribe-2"
import { appleStudioDisplay2 } from "./apple-studio-display-2"
import { logitechMxMaster4 } from "./logitech-mx-master-4"
import { googlePixel9Pro } from "./google-pixel-9-pro"
import { sonosEra300 } from "./sonos-era-300"

export const products: ProductCatalog = {
  [macbookPro.slug]: macbookPro,
  [macbookAir15.slug]: macbookAir15,
  [dellXps16.slug]: dellXps16,
  [iphone16ProMax.slug]: iphone16ProMax,
  [galaxyS25Ultra.slug]: galaxyS25Ultra,
  [sonyWH1000XM6.slug]: sonyWH1000XM6,
  [ipadPro13.slug]: ipadPro13,
  [appleWatchUltra3.slug]: appleWatchUltra3,
  [ps5Pro.slug]: ps5Pro,
  [sonyA7V.slug]: sonyA7V,
  [samsungQDOLED.slug]: samsungQDOLED,
  [airpodsPro3.slug]: airpodsPro3,
  [nintendoSwitch2.slug]: nintendoSwitch2,
  [metaQuest4.slug]: metaQuest4,
  [djiAir4.slug]: djiAir4,
  [kindleScribe2.slug]: kindleScribe2,
  [appleStudioDisplay2.slug]: appleStudioDisplay2,
  [logitechMxMaster4.slug]: logitechMxMaster4,
  [googlePixel9Pro.slug]: googlePixel9Pro,
  [sonosEra300.slug]: sonosEra300,
}
