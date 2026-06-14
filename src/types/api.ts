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
  average_price: number
  current_price: number
  evaluation: number
  profit: number
  profit_rate: number
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
  time_enabled: boolean
  holiday_enabled: boolean
  manual_enabled: boolean
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

export const CANDLE_UNITS = ['1m', '15m', '1h', '4h', '1d'] as const

export type CandleUnit = (typeof CANDLE_UNITS)[number]

export interface Candlestick {
  /** Bucket start as epoch seconds (lightweight-charts UTCTimestamp). */
  time: number
  open: number
  high: number
  low: number
  close: number
}

export interface DashboardSummary {
  active_monkey_count: number
  average_earning_ratio: number
  best_earning_ratio: number
  total_initial_balance: number
  total_cash_balance: number
  total_holdings_value: number
  total_equity: number
  total_pl: number
  earning_ratio: number
  average_order_interval_seconds: number
  latest_orders: Order[]
  daily_earning_ratio_series: DailyEarningRatioPoint[]
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

export const FEEDBACK_CATEGORY = {
  BUG: 'bug',
  FEATURE: 'feature',
  GENERAL: 'general',
  OTHER: 'other',
} as const

export type FeedbackCategory = (typeof FEEDBACK_CATEGORY)[keyof typeof FEEDBACK_CATEGORY]

export const FEEDBACK_CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  bug: '버그 신고',
  feature: '기능 제안',
  general: '일반 의견',
  other: '기타',
}

export type FeedbackStatus = 'new' | 'answered'

export interface Feedback {
  id: number
  email: string
  category: FeedbackCategory
  category_label: string
  subject: string
  message: string
  status: FeedbackStatus
  status_label: string
  reply_message: string
  replied_at: string | null
  replied_by_username: string
  created_at: string
  updated_at: string
}

export interface FeedbackCreatePayload {
  email: string
  category: FeedbackCategory
  subject: string
  message: string
}

export interface FeedbackReplyPayload {
  reply_message: string
}
