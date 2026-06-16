import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfigValue } from '@/components/ui/config-value';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useGlobalControl } from '@/hooks/use-global-control';
import { useMarketHours } from '@/hooks/use-market-hours';
import {
	formatCurrency,
	formatHourMinute,
	formatIntervalCompact,
	formatPercent,
} from '@/lib/format';

export function ProjectIntroSection() {
	const { data: control } = useGlobalControl();
	const { data: marketHours } = useMarketHours();

	// Fall back to the current defaults until the live config loads, so the copy
	// stays stable and correct in the common case and updates if config differs.
	const startingBalance = control?.auto_create_starting_balance ?? 1_000_000;
	const minInterval = control?.auto_create_min_interval_seconds ?? 60;
	const maxInterval = control?.auto_create_max_interval_seconds ?? 1800;
	const killThreshold = control?.kill_threshold ?? -0.5;
	const openTime = formatHourMinute(marketHours?.open, '09:00');
	const closeTime = formatHourMinute(marketHours?.close, '15:30');

	const startingBalanceChip = (
		<ConfigValue>{formatCurrency(startingBalance)}</ConfigValue>
	);
	const intervalRangeChips = (
		<>
			<ConfigValue>{formatIntervalCompact(minInterval)}</ConfigValue>~
			<ConfigValue>{formatIntervalCompact(maxInterval)}</ConfigValue>
		</>
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>프로젝트 소개</CardTitle>
			</CardHeader>
			<CardContent>
				<article className="flex flex-col gap-6 text-sm leading-relaxed text-muted-foreground">
					<blockquote className="border-l-2 border-primary/40 pl-4 italic text-foreground">
						과연 랜덤하게 매수·매도 버튼만 누르는 원숭이는 사람 투자자를 이길 수
						있을까?
					</blockquote>

					<section>
						<h3 className="text-base font-semibold text-foreground">
							사람을 이기는 원숭이
						</h3>
						<p className="mt-2">
							오랫동안 주식 투자를 해 왔습니다. 모의투자도 해 보고, 실제 투자도
							해 봤습니다. 기업 분석도 해 보고, 차트도 보고, 뉴스도 읽고, 온갖
							지표도 참고해 봤습니다.
						</p>
						<p className="mt-2">
							그러다 문득 이런 의문이 들었습니다. &ldquo;매수 버튼과 매도 버튼만
							누를 줄 아는 원숭이는 과연 얼마나 많은 투자자를 이길 수
							있을까?&rdquo;
						</p>
						<p className="mt-2">
							시장에는 가치 투자, 성장주 투자, 배당 투자, 퀀트 투자, 차트 분석,
							뉴스 기반 투자 등 수많은 전략이 존재합니다. 그런데 정말로 이
							전략들이 아무 생각 없는 랜덤 투자보다 항상 뛰어날까요?
						</p>
						<p className="mt-2">
							이 질문은 생각보다 오래 머릿속에 남았습니다. 무려 2년 가까이
							고민만 하다가, 결국 직접 실험해 보기로 했습니다.
						</p>
					</section>

					<section>
						<h3 className="text-base font-semibold text-foreground">
							진짜 원숭이는 아닙니다
						</h3>
						<p className="mt-2">
							안타깝게도 실제 원숭이를 고용하기에는 여러 문제가 있습니다.
							원숭이가 없고, 줄 밥도 없고, 재워 줄 집도 없습니다. 무엇보다
							원숭이가 키보드를 잘 다룰지 확신할 수 없습니다. 그래서 대신 컴퓨터
							속에 가상 원숭이를 만들어, 한국투자증권 Open API를 통해
							동작시키기로 했습니다.
						</p>
						<p className="mt-2">
							가상 원숭이는 사실상 두 개의 버튼만 누를 수 있습니다.
						</p>
						<ul className="mt-2 list-disc space-y-1 pl-5">
							<li>
								<span className="font-medium text-foreground">
									🟢 매수 버튼
								</span>{' '}
								— 랜덤한 종목을 선택한 뒤, 1주를 매수합니다.
							</li>
							<li>
								<span className="font-medium text-foreground">
									🔴 매도 버튼
								</span>{' '}
								— 현재 보유 중인 종목 가운데 하나를 선택한 뒤, 1주를 매도합니다.
							</li>
						</ul>
						<p className="mt-2">
							원숭이는 그 이상 아무것도 모릅니다. 기업이 무엇을 하는지, 실적이
							좋은지, 차트가 어떤지, 뉴스가 나왔는지 — 전혀 신경 쓰지 않습니다.
							그저 버튼을 누를 뿐입니다.
						</p>
					</section>

					<section>
						<h3 className="text-base font-semibold text-foreground">
							원숭이 정보
						</h3>
						<p className="mt-2">
							원숭이가 태어날 때는 초기 자본, 매매 단위, 거래 주기가 고정됩니다.
							현재 설정은 다음과 같습니다.
						</p>
						<div className="mt-3">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>항목</TableHead>
										<TableHead className="text-right">값</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell>초기 자본</TableCell>
										<TableCell className="text-right">
											{startingBalanceChip}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>매매 단위</TableCell>
										<TableCell className="text-right font-mono tabular-nums">
											1주
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>거래 주기</TableCell>
										<TableCell className="text-right">
											원숭이마다 {intervalRangeChips} 사이로 무작위 설정
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
						<p className="mt-2">
							새로 태어난 원숭이에게는 흔한 애완동물 이름이 무작위로 주어집니다.
							이름이 중복되면 로마 숫자를 붙여 구분합니다 (예: &ldquo;Arthur
							VI&rdquo;).
						</p>
						<p className="mt-3">
							<span className="font-medium text-foreground">
								Q. 시작 자본금은 어디서 났나요?
							</span>
							<br />
							제 돈이 아닙니다. 모의투자 계좌입니다..5억까지밖에 안 되더라고요.
							<br />
							시스템이 실제 모의투자 계좌의 예수금을 주기적으로 확인하여, 아직
							할당되지 않은 현금이 {startingBalanceChip} 이상 남아 있으면 새
							원숭이를 자동으로 생성합니다.
							<br />
							매일 자동으로 한 번씩 확인하며, 관리자가 직접 버튼을
							눌러 즉시 확인할 수도 있습니다.
						</p>
						<p className="mt-2">
							현재 원숭이들은 KRX(한국거래소)에서만 활동합니다. 해가 지지 않는
							글로벌 원숭이 자산운용사는 나중에 생각해 보겠습니다.
						</p>
					</section>

					<section>
						<h3 className="text-base font-semibold text-foreground">
							원숭이의 하루
						</h3>
						<p className="mt-2">
							원숭이는 매우 단순한 생활 패턴을 가지고 있습니다.
						</p>
						<ul className="mt-2 list-disc space-y-1 pl-5">
							<li>
								<span className="font-medium text-foreground">장 시작</span> —
								주식 시장이 개장하면(<ConfigValue>{openTime}</ConfigValue>)
								깨어납니다.
							</li>
							<li>
								<span className="font-medium text-foreground">거래</span> —
								원숭이마다 정해진 주기({intervalRangeChips})마다 한 번씩 매수
								또는 매도 중 하나를 행동합니다. 어떤 버튼을 누를지는 원숭이
								자신도 모릅니다.
							</li>
							<li>
								<span className="font-medium text-foreground">장 종료</span> —
								시장이 폐장하면(<ConfigValue>{closeTime}</ConfigValue>) 활동을
								중단하고, 다음 거래일까지 기다립니다.
							</li>
							<li>
								<span className="font-medium text-foreground">휴장일</span> —
								주말과 공휴일에는 깨어나지 않습니다. 매일 한국투자증권 휴장일
								조회로 개장일 여부를 확인하여, 휴장일에는 거래를 멈춥니다.
							</li>
						</ul>
						<p className="mt-2">
							전체 거래는 세 개의 스위치(시간·휴장일·관리자 수동)가 모두 켜져 있을
							때만 실행됩니다.
						</p>
					</section>

					<section>
						<h3 className="text-base font-semibold text-foreground">
							원숭이의 생로병사
						</h3>
						<p className="mt-2">
							원숭이는 영원히 살지 않습니다. 잘나가는 원숭이는 번식하고, 망한
							원숭이는 자연스럽게 사라집니다.
						</p>
						<ul className="mt-2 list-disc space-y-1 pl-5">
							<li>
								<span className="font-medium text-foreground">🐒 번식</span> —
								전체 평가자산이 초기 자본의 2배 이상이 되면 원숭이는 둘로
								분화합니다. 원숭이답지 않은 번식 방식입니다.
							</li>
							<li>
								<span className="font-medium text-foreground">☠️ 사망</span> —
								수익률이 <ConfigValue>{formatPercent(killThreshold)}</ConfigValue>{' '}
								미만으로 떨어진 원숭이는 시장에서 퇴출됩니다. 사망 처리는 장이
								열려 있는 동안에는 진행하지 않고, 매일 장 시작 전에 한 번만 일괄
								처리합니다. (원숭이 지수가 거래 성과만 반영하도록, 장중에는 원숭이
								수가 바뀌지 않습니다.)
							</li>
						</ul>
						<p className="mt-2">
							원숭이가 번식하거나 사망하는 경우, 보유 중인 주식은 시스템 계좌로
							넘겨져 장중에 순차적으로 청산됩니다.
						</p>
					</section>

					<section>
						<h3 className="text-base font-semibold text-foreground">
							프로젝트 목표
						</h3>
						<p className="mt-2">
							사실 원숭이로 돈 벌 생각은 별로 없습니다. 그냥 궁금증 해소
							목적입니다.
						</p>
						<ul className="mt-2 list-disc space-y-1 pl-5">
							<li>랜덤 투자는 얼마나 강력한가?</li>
							<li>투자자는 실제로 시장 평균을 이기고 있는가?</li>
							<li>장기간 생존하는 원숭이는 어떤 특징을 가지는가?</li>
							<li>자연 선택이 반복되면 원숭이 집단은 진화할 수 있는가?</li>
							<li>결국 살아남는 것은 전략인가, 운인가?</li>
						</ul>
						<p className="mt-2">그리고 재밌잖아요 솔직히</p>
					</section>

					<section>
						<h3 className="text-base font-semibold text-foreground">
							앞으로의 계획
						</h3>
						<p className="mt-2">
							현재 프로젝트는 아직 초기 단계입니다. 따라서 원숭이의 행동 방식은
							언제든지 변경될 수 있습니다. 생각 중인 기능들은 다음과 같습니다.
						</p>
						<ul className="mt-2 list-disc space-y-1 pl-5">
							<li>개별 원숭이 특성 구현</li>
							<li>투자 성과 시각화</li>
							<li>원숭이 랭킹 시스템</li>
							<li>사망한 원숭이 묘비(기록) 보기</li>
						</ul>
						<p className="mt-2">
							&ldquo;오늘의 원숭이 지수&rdquo;는 이제 대시보드에서 캔들 차트로 확인할
							수 있습니다.
						</p>
					</section>

					<section>
						<h3 className="text-base font-semibold text-foreground">
							참고 사항
						</h3>
						<ul className="mt-2 list-disc space-y-1 pl-5">
							<li>
								현재는 모의투자 환경에서만 운영됩니다. 실전 투자 계좌로 전환할
								생각이 없진 않지만, 별로 좋은 생각이 아닐지도요..
							</li>
							<li>
								&ldquo;원숭이 지수&rdquo;는 10,000을 기준값으로, 매일 전일 종가에서
								출발해 그날 살아있는 원숭이들의 평가자산 합계 변화( 장 시작 시점 대비
								현재 )를 곱해 산출합니다. 즉 평균 수익률이 아니라 &ldquo;오늘 원숭이들이
								얼마나 잘 거래했는가&rdquo;를 보여주며, 원숭이 수나 계좌 잔액 변동에
								영향을 받지 않습니다. 캔들 차트로 분·시간·일 단위를 바꿔 가며 살펴볼 수
								있습니다.
							</li>
							<li>
								각 원숭이의 보유 종목은 수량뿐 아니라 평균 매입가·현재가·평가손익·
								수익률까지 확인할 수 있습니다. 평균가는 한국투자증권 체결 내역을
								주기적으로 대조하여 보정합니다.
							</li>
							<li>
								보유 종목과 실제 계좌의 보유 현황이 어긋나는 경우(상장폐지 등),
								시스템이 정기적으로 점검하여 해당 종목을 시스템 계좌로 모은 뒤
								장중에 순차적으로 청산합니다.
							</li>
						</ul>
					</section>
				</article>
			</CardContent>
		</Card>
	);
}
