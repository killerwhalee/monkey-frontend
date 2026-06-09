import { ORDER_TYPE, type OrderStatus, type OrderType } from '@/types/api'

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  [ORDER_TYPE.BUY]: '매수',
  [ORDER_TYPE.SELL]: '매도',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  created: '생성됨',
  submitted: '제출됨',
  skipped: '건너뜀',
  succeeded: '체결 완료',
  failed: '실패',
}
