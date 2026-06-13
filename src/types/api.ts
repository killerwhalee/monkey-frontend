export interface Stock {
  id: number
  market: string
  ticker: string
  name: string
  is_active: boolean
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
  monkey_name: string
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
  order_interval_seconds: number
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
}

export interface GlobalMonkeyControl {
  id: number
  enabled: boolean
  kill_threshold: number
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

export interface EarningRatioCandlestick {
  date: string
  open: number
  high: number
  low: number
  close: number
}

export interface DashboardSummary {
  active_monkey_count: number
  average_earning_ratio: number
  best_earning_ratio: number
  latest_orders: Order[]
  daily_earning_ratio_series: DailyEarningRatioPoint[]
  candlestick_series: EarningRatioCandlestick[]
}

export interface AccountSummary {
  kis_cash_balance: number
  unallocated_cash: number
  monkey_count: number
  active_monkey_count: number
  total_monkey_balance: number
  total_holdings_value: number
  total_equity: number
  average_earning_ratio: number
  best_earning_ratio: number
  system_balance: number
  system_holdings_value: number
}

export interface TokenObtainResponse {
  access: string
  refresh: string
}

export interface TokenRefreshResponse {
  access: string
  refresh?: string
}
