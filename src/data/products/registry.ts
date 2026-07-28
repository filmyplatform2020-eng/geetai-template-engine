import type { ProductCatalog } from "@/engine/product/types"
import { macbookPro } from "./macbook-pro"

export const products: ProductCatalog = {
  [macbookPro.slug]: macbookPro,
}
