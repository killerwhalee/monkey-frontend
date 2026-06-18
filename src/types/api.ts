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

export type AccountType = 'mock' | 'real'

export interface Account {
  id: number
  display_id: string
  account_type: AccountType
  account_number: string
  product_code: string
  is_active: boolean
  auto_create_starting_balance: number
  auto_create_min_interval_seconds: number
  auto_create_max_interval_seconds: number
  token_status: { has_token: boolean; expires_at: string | null }
  created_at: string
  updated_at: string
}

export interface CreateAccountPayload {
  account_type: AccountType
  app_key: string
  app_secret: string
  account_number: string
  product_code: string
}

export interface Monkey {
  id: number
  account: number | null
  name: string
  is_active: boolean
  is_system: boolean
  balance: number
  initial_balance: number
  /** 성급함 (0–1): higher = more frequent trading (shorter interval). */
  haste: number
  /** 배짱 (0–1): higher = larger orders. */
  balls: number
  /** Cadence in seconds, derived from haste at birth (read-only). */
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
  account: number
  count: number
  starting_balance: number
}

export interface GlobalMonkeyControl {
  id: number
  market_open: boolean
  enabled: boolean
  time_enabled: boolean
  holiday_enabled: boolean
  manual_enabled: boolean
  note: string
  created_at: string
  updated_at: string
}

export interface HourMinute {
  hour: number | null
  minute: number | null
}

export interface MarketHours {
  open: HourMinute
  close: HourMinute
  holiday_check: HourMinute
}

export interface KisAccessToken {
  id: number
  environment: string
  expires_at: string
  created_at: string
  updated_at: string
}

export interface RunnableTask {
  name: string
  task: string
  label: string
  description: string
  dangerous: boolean
  warnings: string[]
  when: 'market_open' | 'market_closed' | null
}

export interface RunTaskResponse {
  task: string
  id: string
}

export interface TaskSchedule {
  id: number
  name: string
  label: string
  description: string
  task: string
  hour: number
  minute: number
  enabled: boolean
}

export interface UpdateSchedulePayload {
  id: number
  hour: number
  minute: number
}

export interface IntervalSchedule {
  id: number
  name: string
  label: string
  description: string
  task: string
  every: number
  period: string
  enabled: boolean
}

export interface UpdateIntervalPayload {
  id: number
  every: number
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
  /** Current Monkey Index value (base 1,000.00). */
  monkey_index: number
  /** Today's opening index value (yesterday's close). */
  monkey_index_open: number
  /** Fractional change vs. today's open (0.05 = +5%). */
  monkey_index_change: number
  latest_orders: Order[]
}

export interface IndexReturnPeriod {
  /** Reference date (the close this period compares against). */
  date: string
  /** Monkey Index value on the reference date. */
  index: number
  /** current / reference − 1; null if the reference index is unusable. */
  rate: number | null
}

export interface IndexReturns {
  /** Current Monkey Index value. */
  current: number
  /** Per-lookback reference; null when no data reaches that far back. */
  periods: {
    day: IndexReturnPeriod | null
    week: IndexReturnPeriod | null
    month: IndexReturnPeriod | null
    quarter: IndexReturnPeriod | null
  }
}

export interface AccountSummary {
  account_id: number
  display_id: string
  account_type: AccountType
  kis_cash_balance: number
  kis_holdings_value: number
  kis_total_assets: number
  kis_total_pl: number
  kis_earning_rate: number
  unallocated_cash: number
  monkey_count: number
  active_monkey_count: number
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
