import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

export function ProjectIntroSection() {
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
								— 랜덤한 종목을 선택한 뒤, 랜덤한 수량만큼 매수합니다.
							</li>
							<li>
								<span className="font-medium text-foreground">
									🔴 매도 버튼
								</span>{' '}
								— 현재 보유 중인 종목 가운데 하나를 선택한 뒤, 랜덤한 수량만큼
								매도합니다.
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
							원숭이가 태어날 때는 초기 자본, 최소 매매 수량, 최대 매매 수량이
							고정됩니다. 현재 설정은 다음과 같습니다.
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
										<TableCell className="text-right font-mono tabular-nums">
											1,000,000원
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>최소 매매 수량</TableCell>
										<TableCell className="text-right font-mono tabular-nums">
											1주
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>최대 매매 수량</TableCell>
										<TableCell className="text-right font-mono tabular-nums">
											10주
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
						<p className="mt-3">
							<span className="font-medium text-foreground">
								Q. 100만 원은 어디서 났나요?
							</span>
							<br />
							5억 원짜리 모의투자 계좌를 만들어, 원숭이 500마리를 동시에 운영할
							수 있습니다. 다만 모의투자 계좌는 3개월마다 초기화되므로, 이
							부분은 추후 보완할 계획입니다.
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
								주식 시장이 개장하면 깨어납니다.
							</li>
							<li>
								<span className="font-medium text-foreground">거래</span> — 매
								분마다 한 번씩 매수 또는 매도 중 하나를 행동합니다. 어떤 버튼을
								누를지는 원숭이 자신도 모릅니다.
							</li>
							<li>
								<span className="font-medium text-foreground">장 종료</span> —
								시장이 폐장하면 활동을 중단하고, 다음 거래일까지 기다립니다.
							</li>
						</ul>
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
								전체 평가자산이 초기 자본의 20% 이하가 되면 원숭이는 시장에서
								퇴출됩니다.
							</li>
						</ul>
						<p className="mt-2">
							원숭이가 번식하거나 사망하는 경우, 보유 중인 모든 주식은 즉시
							청산됩니다.
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
							<li>원숭이 지수(Monkey Index) 개발</li>
						</ul>
						<p className="mt-2">
							특히 프로젝트가 충분히 안정화되면 &ldquo;오늘의 원숭이
							지수&rdquo;를 만들어 볼 계획입니다.
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
							<li>실제 주식 시장에서 쓰는 차트 그래프도 도입하고 싶습니다.</li>
						</ul>
					</section>
				</article>
			</CardContent>
		</Card>
	);
}
