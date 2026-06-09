import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface IntroCard {
  title: string
  body: string
}

const INTRO_CARDS: IntroCard[] = [
  {
    title: '한 줄 요약',
    body: '무작위로 행동하는 가상의 원숭이 트레이더가 실제 주식 시장에서 얼마나 수익을 낼 수 있는가를 관찰하는 실험입니다.',
  },
  {
    title: '연구 배경',
    body: '"무작위성을 가진 트레이더는 주식 시장에서 얼마나 승리할 수 있는가?"라는 논문 주제를 검증하기 위해 시작된 프로젝트입니다.',
  },
  {
    title: '원숭이의 동작 방식',
    body: '각 원숭이는 매 거래 주기마다 (1) 임의의 종목을 임의의 수량만큼 매수하거나, (2) 보유 중인 임의의 종목을 임의의 수량만큼 매도합니다. 시장이나 경제에 대한 지식이 전혀 없는 트레이더의 행동을 그대로 흉내냅니다.',
  },
  {
    title: '실제 시장과의 연동',
    body: '원숭이는 가상의 존재이지만, 실제 한국 주식시장 데이터를 기반으로 한국투자증권(KIS) Open API의 모의투자 환경을 통해 주문을 체결합니다. 실제 자금은 사용되지 않으며 모든 거래는 모의투자입니다.',
  },
  {
    title: '대시보드 안내',
    body: '현재 운영 중인 원숭이 수, 평균·최고 수익률, 최근 주문 내역, 일별 수익률 추이 그래프를 통해 원숭이들의 활동과 성과를 실시간으로 확인할 수 있습니다.',
  },
  {
    title: '데이터 고지',
    body: '일별 수익률 그래프는 기록을 시작한 시점부터 데이터가 누적되므로 초기에는 비어 있을 수 있습니다. 본 프로젝트는 학술적 실험을 위한 것으로, 투자 권유나 조언이 아닙니다.',
  },
]

export function ProjectIntroSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>프로젝트 소개</CardTitle>
        <CardDescription>Monkey — 무작위 트레이더 실험 프로젝트</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {INTRO_CARDS.map((card) => (
            <div key={card.title} className="rounded-lg bg-muted/40 p-4 ring-1 ring-foreground/5">
              <h3 className="font-medium text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
