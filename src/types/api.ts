export interface Stock {
  id: number
  market: string
  ticker: string
  name: string
}

export interface Holding {
  id: number
  monkey_id: number
  stock: Stock
  quantity: number
}

export const ORDER_TYPE = {
  BUY: 0,
  SELL: 1,
} as const

export type OrderType = (typeof ORDER_TYPE)[keyof typeof ORDER_TYPE]

export type OrderStatus = 'created' | 'skipped' | 'submitted' | 'succeeded' | 'failed'

export interface Order {
  id: number
  monkey_id: number
  stock: Stock
  order_type: OrderType
  order_type_label: string
  status: OrderStatus
  requested_quantity: number
  executed_quantity: number
  estimated_price: number | null
  executed_price: number | null
  price: number | null
  quantity: number
  failure_reason: string
  kis_order_id: string
  kis_order_status: string
  kis_request: Record<string, unknown>
  kis_response: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface MonkeyMetrics {
  cash_balance: number
  holdings_value: number
  total_equity: number
  total_pl: number
  realized_pl: number
  unrealized_pl: number
  earning_ratio: number
}

export interface Monkey {
  id: number
  name: string
  is_active: boolean
  balance: number
  initial_balance: number
  min_quantity: number
  max_quantity: number
  killed_at: string | null
  holdings: Holding[]
  recent_orders: Order[]
  metrics: MonkeyMetrics
}

export interface MonkeySummaryItem {
  id: number
  name: string
  is_active: boolean
  metrics: MonkeyMetrics
}

export interface MonkeyBulkCreatePayload {
  count: number
  starting_balance: number
  min_quantity?: number
  max_quantity?: number
}

export interface GlobalMonkeyControl {
  id: number
  enabled: boolean
  kill_threshold: number
  order_interval_seconds: number
  note: string
  created_at: string
  updated_at: string
}

export interface KisAccessToken {
  id: number
  environment: string
  expires_at: string
  created_at: string
  updated_at: string
}

export interface DailyEarningRatioPoint {
  date: string
  average_earning_ratio: number
  best_earning_ratio: number
}

export interface DashboardSummary {
  active_monkey_count: number
  average_earning_ratio: number
  best_earning_ratio: number
  latest_orders: Order[]
  daily_earning_ratio_series: DailyEarningRatioPoint[]
}

export interface TokenObtainResponse {
  access: string
  refresh: string
}

export interface TokenRefreshResponse {
  access: string
  refresh?: string
}
