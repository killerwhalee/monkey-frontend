import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProjectIntroSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>프로젝트 소개</CardTitle>
      </CardHeader>
      <CardContent>
        <article className="flex flex-col gap-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h3 className="text-base font-semibold text-foreground">한 줄 요약</h3>
            <p className="mt-2">
              무작위로 행동하는 가상의 원숭이 트레이더가 실제 주식 시장에서 얼마나 수익을 낼 수 있는가를
              관찰하는 실험입니다.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground">연구 배경</h3>
            <p className="mt-2">
              &ldquo;무작위성을 가진 트레이더는 주식 시장에서 얼마나 승리할 수 있는가?&rdquo;라는 논문
              주제를 검증하기 위해 시작된 프로젝트입니다.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground">원숭이의 동작 방식</h3>
            <p className="mt-2">
              각 원숭이는 매 거래 주기마다 (1) 임의의 종목을 임의의 수량만큼 매수하거나, (2) 보유 중인
              임의의 종목을 임의의 수량만큼 매도합니다. 시장이나 경제에 대한 지식이 전혀 없는 트레이더의
              행동을 그대로 흉내냅니다.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground">실제 시장과의 연동</h3>
            <p className="mt-2">
              원숭이는 가상의 존재이지만, 실제 한국 주식시장 데이터를 기반으로 한국투자증권(KIS) Open
              API의 모의투자 환경을 통해 주문을 체결합니다. 실제 자금은 사용되지 않으며 모든 거래는
              모의투자입니다.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground">대시보드 안내</h3>
            <p className="mt-2">
              현재 운영 중인 원숭이 수, 평균·최고 수익률, 최근 주문 내역, 일별 수익률 추이 그래프를 통해
              원숭이들의 활동과 성과를 실시간으로 확인할 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-foreground">데이터 고지</h3>
            <p className="mt-2">
              일별 수익률 그래프는 기록을 시작한 시점부터 데이터가 누적되므로 초기에는 비어 있을 수
              있습니다. 본 프로젝트는 학술적 실험을 위한 것으로, 투자 권유나 조언이 아닙니다.
            </p>
          </section>
        </article>
      </CardContent>
    </Card>
  )
}
