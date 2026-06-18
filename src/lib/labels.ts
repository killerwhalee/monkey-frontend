import { ORDER_TYPE, type OrderStatus, type OrderType } from '@/types/api'

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  [ORDER_TYPE.BUY]: '매수',
  [ORDER_TYPE.SELL]: '매도',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  created: '생성됨',
  submitted: '체결 대기',
  executed: '체결 완료',
  skipped: '건너뜀',
  // Legacy orders applied under the old "접수 == 체결" scheme; kept for back-compat.
  succeeded: '체결 완료',
  failed: '실패',
}
