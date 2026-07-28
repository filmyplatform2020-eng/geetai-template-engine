export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

export interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: number
  read: boolean
}

export interface AnalyticsSummary {
  totalProducts: number
  totalCategories: number
  totalBrands: number
  totalReviews: number
  avgRating: number
  totalBuyLinks: number
  activeAffiliates: number
  pageViews: number
}

export interface BuildStatus {
  status: "idle" | "building" | "success" | "error"
  lastBuild: string | null
  duration: number | null
  errors: number
  warnings: number
}

export interface TableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}
