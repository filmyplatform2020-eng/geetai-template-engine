import type { Product, ProductProvider, ProviderId } from "@/cms/types"
import { products as localProducts } from "@/data/products"

export class LocalProvider implements ProductProvider {
  readonly id: ProviderId = "local"
  readonly name = "Local TypeScript"

  private products: Map<string, Product>
  private allProducts: Product[]

  constructor() {
    this.allProducts = Object.values(localProducts)
    this.products = new Map(Object.entries(localProducts))
  }

  getProduct(slug: string): Product | null {
    return this.products.get(slug) ?? null
  }

  getAllProducts(): Product[] {
    return this.allProducts
  }

  getProductsByCategory(category: string): Product[] {
    return this.allProducts.filter((p) => p.category === category)
  }

  getProductsByBrand(brand: string): Product[] {
    return this.allProducts.filter((p) => p.brand.toLowerCase() === brand.toLowerCase())
  }

  searchProducts(query: string): Product[] {
    const q = query.toLowerCase()
    return this.allProducts.filter(
      (p) =>
        p.product.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
    )
  }

  getCategories(): string[] {
    return [...new Set(this.allProducts.map((p) => p.category))]
  }

  getBrands(): string[] {
    return [...new Set(this.allProducts.map((p) => p.brand))]
  }

  getProductCount(): number {
    return this.allProducts.length
  }

  createProduct(product: Product): Product {
    if (this.products.has(product.slug)) {
      throw new Error(`Product with slug "${product.slug}" already exists`)
    }
    this.products.set(product.slug, product)
    this.allProducts = [...this.products.values()]
    return product
  }

  updateProduct(slug: string, data: Partial<Product>): Product | null {
    const existing = this.products.get(slug)
    if (!existing) return null
    const updated = { ...existing, ...data, slug }
    this.products.set(slug, updated)
    this.allProducts = [...this.products.values()]
    return updated
  }

  deleteProduct(slug: string): boolean {
    const result = this.products.delete(slug)
    if (result) this.allProducts = [...this.products.values()]
    return result
  }
}
