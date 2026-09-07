# CANDiY 건강검진 대시보드

CANDiY NHIS API를 연동해 국민건강보험 건강검진 결과를 조회하고 시각화합니다.

- **웹 🖥️**: https://candiy-frontend.vercel.app/
- **스토리북 📖**: https://candiy-frontend-storybook.vercel.app/

## 프로젝트 개요

로그인(`/login`, 현재는 mock)한 사용자가 이름/생년월일/휴대폰번호와 간편인증 수단을 입력하면 CANDiY의 2단계(1차 요청 → 간편인증 → 2차 요청) 본인인증 플로우를 거쳐 최근 10년간의 건강검진 이력을 조회합니다. 조회가 완료되면 `/dashboard`에서 최근 검진 결과 요약, 검진 항목별 게이지·추이, 지질 패널 비교, 검진 기록, 검진일별 전체 항목을 확인할 수 있습니다.

## 기술 스택 (선택 이유)

- **Next.js App Router + TypeScript(strict)** — 서버 프록시(Route Handler)와 클라이언트 화면을 한 프로젝트에서 관리하기 위해. `app/`은 라우팅만 담당하고 로직은 `features/`에 응집시킵니다.
- **Tailwind CSS v4** — `@theme`의 CSS-first 설정으로 디자인 토큰(컬러/라디우스/쉐도우)을 정의하고, 다크모드를 `prefers-color-scheme` 기반으로 전환합니다.
- **Chart.js + react-chartjs-2** — 게이지(`GaugeRangeChart`)·추이(`LineTrendChart`)·항목 비교(`BarComparisonChart`) 차트를 커스텀 플러그인으로 구현합니다. 차트 컴포넌트는 `useQuery`/Zustand를 모르는 순수 프레젠테이셔널 컴포넌트입니다.
- **TanStack Query + Zustand** — 서버에서 오는 데이터(검진 조회 결과)는 TanStack Query로, 서버가 소유하지 않는 클라이언트 상태(위저드 진행 단계, 로그인 세션)는 Zustand로 분리해 캐시 이원화를 방지합니다. 검진 결과 쿼리는 `@tanstack/react-query-persist-client`로 `sessionStorage`에 저장해 새로고침/뒤로가기에도 유지되고, 탭을 닫으면 사라집니다. 로그인 세션(`auth.store.ts`)은 `zustand/middleware`의 `persist`로 `localStorage`에 저장해 탭을 닫아도 유지됩니다.
- **react-hook-form + zod** — 로그인 폼(`LoginForm`)과 건강검진 조회 폼(`CheckupForm`)의 검증 스키마를 zod로 선언하고 `@hookform/resolvers`로 react-hook-form에 연결합니다. 검증 규칙과 폼 상태 관리를 분리해 스키마만 보고도 어떤 값이 유효한지 알 수 있게 했습니다.
- **axios** — `shared/api/client.ts`(브라우저용)와 `shared/api/candiyServerClient.ts`(서버 전용, API 키 주입)를 분리해 API 키가 브라우저에 노출되지 않도록 합니다.
- **MSW(Mock Service Worker)** — mock 레이어로 전체 플로우를 데모 가능하게 만들고 실 스펙으로 DTO/mapper만 교체하도록 설계했습니다.
- **Vitest + React Testing Library / Storybook** — 도메인 로직(mapper, 훅)은 Vitest로, 프레젠테이셔널 컴포넌트는 Storybook으로 독립 검증합니다.
- **lucide-react** — 아이콘을 인라인 SVG 대신 라이브러리로 통일해 일관된 크기/스타일을 보장합니다.

## 시작하기

### 설치

```bash
pnpm install
```

### 환경 변수

`.env.example`을 `.env.local`로 복사한 뒤 값을 채웁니다.

```bash
cp .env.example .env.local
```

| 변수                   | 설명                                                                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `CANDIY_API_KEY`       | 서버 전용 API 키. `NEXT_PUBLIC_` 접두어가 없어 브라우저 번들에 노출되지 않습니다.                                             |
| `CANDIY_API_BASE_URL`  | CANDiY API base URL (기본값: `https://api.candiy.io`).                                                                        |
| `NEXT_PUBLIC_API_MODE` | `mock` \| `live`. `mock`이면 MSW가 요청을 가로채 fixture를 반환하고, `live`면 Route Handler가 실제 CANDiY API로 프록시합니다. |

### 실행

```bash
pnpm dev
```

`http://localhost:3000`에서 확인합니다(포트가 이미 사용 중이면 Next가 다음 available 포트를 씁니다). 기본 `NEXT_PUBLIC_API_MODE=mock` 상태로 실행하면 실제 API 키 없이도 조회 → 대시보드 전체 플로우를 끝까지 체험할 수 있습니다.

### mock ↔ live 전환

`.env.local`의 `NEXT_PUBLIC_API_MODE`를 `live`로 바꾸고 `CANDIY_API_KEY`/`CANDIY_API_BASE_URL`을 설정하면 실제 API로 전환됩니다. 컴포넌트/훅/스토어는 도메인 타입만 다루므로 전환 시 코드 변경은 필요 없습니다.

## 스크립트

| 명령                                | 설명                            |
| ----------------------------------- | ------------------------------- |
| `pnpm dev`                          | 개발 서버 실행                  |
| `pnpm build`                        | 프로덕션 빌드                   |
| `pnpm start`                        | 빌드된 앱 실행                  |
| `pnpm lint`                         | ESLint 검사                     |
| `pnpm typecheck`                    | `tsc --noEmit` 타입 검사        |
| `pnpm test`                         | Vitest 전체 실행                |
| `pnpm test:watch`                   | Vitest watch 모드               |
| `pnpm format` / `pnpm format:check` | Prettier 포맷팅                 |
| `pnpm storybook`                    | Storybook 개발 서버 (포트 6006) |
| `pnpm build-storybook`              | Storybook 정적 빌드             |

## 아키텍처

### 폴더 구조

```
src/
  app/                        # 라우팅/레이아웃 조립만 (로직 없음)
    page.tsx                  # 홈 — 서비스 소개 + "시작하기"(/checkups) 진입점
    login/page.tsx            # 로그인 화면(GuestOnly로 감싸 로그인 상태면 /checkups로 리다이렉트)
    layout.tsx, providers.tsx # 전역 레이아웃, TanStack Query(+sessionStorage persist)/MockProvider 등록
    checkups/page.tsx         # 건강검진 조회 위저드 화면(AuthGuard로 감싸 비로그인 시 /login으로 리다이렉트)
    dashboard/                # 대시보드 화면 (page/loading/error, page는 AuthGuard로 보호)
    api/checkups/route.ts     # 서버 프록시 Route Handler
  features/
    auth/
      types/                  # 도메인 타입 (auth.types.ts — AuthUser)
      schemas/                # 로그인 폼 zod 스키마 (login.schema.ts)
      store/                  # Zustand 로그인 세션 상태(localStorage persist)
      hooks/                  # useRequireAuth/useRedirectIfAuthenticated(라우트 가드 판정), useLogout
      components/             # LoginForm, AuthGuard(보호 라우트), GuestOnly(비로그인 전용 라우트)
    checkups/
      api/                    # DTO 정의 + axios 호출 (checkup.dto.ts, checkup.api.ts)
      mappers/                # DTO → 도메인 타입 변환(checkup.mapper.ts), 참고치 문자열 파싱(referenceRange.mapper.ts)
      types/                  # 도메인 타입 (checkup.types.ts)
      schemas/                # 조회 폼 zod 스키마 (checkupForm.schema.ts)
      constants/              # 간편인증 수단/통신사 옵션, 인증 만료 시간
      hooks/                  # TanStack Query 훅(useCheckupData) + 위저드 오케스트레이션 훅
      store/                  # Zustand 위저드 상태
      components/             # CheckupIntro/Form/Pending/Success + CheckupWizard
    dashboard/
      mappers/                # 도메인 타입 → 차트/화면 props 변환(게이지·추이·지질패널·검진이력)
      components/             # RecentCheckupSummary, CheckupRecordList, LipidPanelChart, HistoryPanel, Dashboard
  shared/
    api/                      # client.ts(브라우저 axios), candiyServerClient.ts(서버 전용), queryClient.ts/queryKeys.ts(TanStack Query persist 설정)
    mocks/                    # MSW handler/fixture, MockProvider (건강검진 조회 API만 — 로그인은 순수 클라이언트라 mock 서버가 없음)
    hooks/                    # useDragScroll 등 도메인에 속하지 않는 공용 훅
    components/
      ui/                     # Button, LinkButton, Card, Input, Badge, SelectableChip, InlineAlert
      layout/                 # Header
      feedback/               # Spinner, EmptyState
      charts/                 # GaugeRangeChart, LineTrendChart, BarComparisonChart, ChartTooltip (순수 프레젠테이셔널)
    lib/                      # cn(), env 등 공통 유틸
  config/
    site.ts                   # ROUTES 상수 — 화면 추가/삭제는 여기서
    metrics.ts                # 게이지로 보여줄 항목(GAUGE_METRICS)과 전체 이력 섹션 구성(HISTORY_SECTIONS)
```

### API 추상화 계층

`shared/api/client.ts`가 axios 인스턴스를 만드는 유일한 지점입니다. 다른 코드는 axios를 직접 import하지 않고, `features/*/api/*.api.ts`가 DTO를 받아 `features/*/mappers/*.mapper.ts`로 도메인 타입으로 변환합니다. 컴포넌트/훅/스토어는 도메인 타입만 다루며 DTO를 직접 다루지 않습니다.

브라우저는 CANDiY API를 직접 호출하지 않고 Next.js Route Handler(`app/api/checkups/route.ts`)를 거칩니다. Route Handler는 서버 전용 `candiyServerClient`로 API 키를 주입해 실제(또는 mock) CANDiY API에 요청합니다 — API 키가 브라우저 번들에 포함되지 않습니다.

로그인(`features/auth`)은 이 계층을 거치지 않습니다. CANDiY API에는 앱 사용자 로그인이라는 개념 자체가 없어서(실제 "인증"은 위 건강검진 본인인증 플로우입니다), 로그인은 처음부터 순수 클라이언트 로직으로 구현했습니다. 자세한 동작은 아래 "로그인" 절을 참고하세요.

## 주요 기능 / 화면

### 로그인 (`/login`) — 현재 mock 구현

`/checkups`, `/dashboard`는 로그인해야 접근할 수 있습니다(`AuthGuard`가 비로그인 상태를 감지하면 `/login`으로 리다이렉트). 반대로 이미 로그인한 상태로 `/login`에 접근하면 `GuestOnly`가 `/checkups`로 돌려보냅니다.

**지금 동작 방식(전부 mock)**: 실제 계정 시스템이 없습니다. 이름은 아무 값이나 입력하면 되고, 비밀번호는 실제 자격 증명이 아니라 **형식만**(영문+숫자 조합 8자 이상, `login.schema.ts`) zod로 검증합니다. 형식만 맞으면 입력한 이름 그대로 로그인 처리되어 `AuthUser { name }`이 Zustand 스토어(`auth.store.ts`, `persist`로 `localStorage`에 저장)에 저장됩니다. 로그인한 이름은 건강검진 위저드의 본인인증 대기/완료 화면과 대시보드 인사말에 그대로 쓰입니다(단, 검진 결과 자체에 찍히는 환자명은 CANDiY 응답의 `patientName`이라 로그인 이름과 별개입니다). 로그아웃(`useLogout`)은 세션을 지우는 것과 함께 캐시된 검진 데이터·위저드 진행 단계도 함께 초기화해, 다음 로그인 때 이전 사용자의 조회 결과가 그대로 보이는 걸 막습니다.

**실제 백엔드로 교체하려면**: 이 기능은 CANDiY API를 거치지 않는 순수 클라이언트 구현이라, 다른 feature처럼 DTO/mapper만 바꿔서 될 일이 아니라 로그인 API 자체를 새로 붙여야 합니다.

1. `features/auth/api/auth.api.ts`(신규) + DTO를 만들어 `shared/api/client.ts`의 `apiPost`로 실제 로그인 엔드포인트를 호출합니다.
2. `LoginForm.tsx`의 제출 핸들러가 `useAuthStore.getState().login(name)`을 직접 부르는 대신, 위 API 호출 결과(발급된 사용자 정보/토큰)로 로그인하도록 바꿉니다. 필요하면 `AuthUser`에 `id`/토큰 필드를 추가합니다.
3. `login.schema.ts`의 비밀번호 검증은 그대로 두거나(형식 검증은 실제 서비스에서도 유효) 서버 응답의 인증 실패(잘못된 비밀번호 등)를 폼에 에러로 표시하는 로직을 `CheckupForm`의 `errorMessage` 패턴처럼 추가합니다.
4. `AuthGuard`/`GuestOnly`/`useLogout`/`useRequireAuth`는 `useAuthStore`의 `user`/`hasHydrated`만 바라보므로 그대로 재사용할 수 있습니다.

### 건강검진 조회 위저드 (`/checkups`)

CANDiY NHIS 문서의 2단계 인증 플로우를 그대로 구현했습니다.

1. **CheckupIntro** — 조회 시작 안내 화면.
2. **CheckupForm** — 이름/생년월일/휴대폰번호와 간편인증 수단(12종)·통신사(3종)를 입력해 최근 10년 조회 범위로 1차 요청을 보냅니다.
3. **CheckupPending** — 1차 요청 응답(`multiFactorInfo`)을 받아 사용자가 휴대폰에서 간편인증을 완료하길 기다리는 화면. 인증 만료(4분 30초) 카운트다운을 보여주고, 폴링 대신 사용자가 직접 "인증 완료" 버튼을 눌러 2차 요청을 트리거합니다. 아직 인증을 완료하지 않은 상태로 누르면(`AE-003`) 같은 화면에서 재시도 안내를 보여줍니다.
4. **CheckupSuccess** — 2차 요청이 성공해 검진 데이터를 받으면 요약(검진 횟수, 최근 검진일)을 보여주고, 확인 시 `/dashboard`로 이동합니다.

위저드 진행 상태는 Zustand(`checkupWizard.store.ts`)의 discriminated union으로 관리하며, `persist`를 사용하지 않습니다 — 개인정보와 인증 challenge가 새로고침 후에도 남아있으면 안 되고, 어차피 4분 30초 후 만료되기 때문입니다. 조회에 성공한 검진 데이터(`CheckupData`)는 TanStack Query 캐시로 옮겨져 `/dashboard`에서 사용됩니다.

### 건강검진 대시보드 (`/dashboard`)

조회된 검진 데이터를 세 섹션으로 보여줍니다.

1. **최근 검진 결과 요약(`RecentCheckupSummary`)** — 환자명·검진일·종합소견, 신장/체중/혈압/BMI 핵심 수치, 참고치를 단일 상·하한(`60이상`, `18.5-24.9` 등)으로 파싱할 수 있는 항목의 게이지(`MetricGaugeGrid`)와 BMI·수축기/이완기 혈압의 최근 3회 추이(`MetricTrendList`)를 한 카드에 담습니다. 게이지·추이는 `md` 이상에서 2열, 그 아래에서 1열로 쌓입니다.
2. **검진 기록(`CheckupRecordList`)** — `resultList`(검진 방문 기록) 기준으로 총 건수와 각 기록의 검진일·기관명·검진유형을 최신순으로 보여줍니다. `overviewList`(검진 수치 스냅샷)와 개수가 달라도 독립적으로 동작합니다.
3. **지질 패널 비교(`LipidPanelChart`)** — 총콜레스테롤/LDL콜레스테롤/중성지방을 각자의 질환의심 기준(=100%) 대비 비율로 환산해 비교합니다. 일부 항목만 파싱 가능해도 나머지 항목은 그대로 보여주고, 3개 다 파싱할 수 없으면 안내 문구를 표시합니다.
4. **전체 검진 이력(`HistoryPanel`)** — 검진일 pill로 회차를 고르면 해당 회차의 22개 항목 전체를 7개 섹션으로 보여줍니다. 제목의 chevron을 눌러 접고 펼칠 수 있습니다.

검진 데이터가 아직 없으면 안내와 조회 링크(`EmptyState`)를, sessionStorage에서 캐시를 복원하는 중이면 스피너(`Spinner`)를 보여줍니다.

## API 연동 노트

`NEXT_PUBLIC_API_MODE=mock`일 때는 MSW(`shared/mocks/`)가 CANDiY 문서 기반 fixture로 응답해 API 키 없이도 전체 플로우를 데모할 수 있습니다.

`features/checkups`는 현재 CANDiY NHIS 건강검진 조회 문서(1차/2차 인증 요청)를 기준으로 DTO와 mapper를 구현했지만, 기본값은 여전히 `mock` 모드입니다. 실제 스펙과 차이가 발견되거나 `live`로 전환할 때 수정이 필요한 지점은 다음 세 곳뿐입니다.

- `features/checkups/api/checkup.dto.ts` — wire-format 필드명
- `features/checkups/mappers/checkup.mapper.ts` — DTO → 도메인 타입 변환
- `shared/api/client.ts` / `candiyServerClient.ts` — base URL, 인증 헤더 방식

컴포넌트/훅/스토어는 도메인 타입만 알고 있으므로 위 세 곳 외에는 수정할 필요가 없습니다.

검진 항목 값은 API 스펙이 미확정이라 필드가 빈 문자열이거나(측정 안 됨) 응답에서 아예 빠질 수 있습니다(`undefined`). `referenceRange.mapper.ts`의 `parseNumericValue`가 이 두 경우를 모두 `null`로 처리해, `Number('')`가 `0`으로 평가되어 실측값 0과 혼동되는 문제와 필드 누락으로 인한 런타임 에러를 함께 막습니다. 참고치 문자열도 `"60이상"`, `"18.5-24.9"` 같은 성별조건 없는 단일 상·하한 패턴만 파싱하며, 혈압·혈색소·r-GTP처럼 성별조건이나 `"/"`로 묶인 복합값은 값만 그대로 보여주고 상태·게이지 계산은 하지 않습니다.

## 테스트 / Storybook 실행 방법

```bash
pnpm test          # Vitest 전체 실행 (mapper, 훅, 컴포넌트)
pnpm test:watch    # watch 모드
pnpm storybook     # Storybook 개발 서버 — shared/components/{ui,charts,feedback}, features/{auth,checkups,dashboard}/components 프레젠테이션 확인
```

테스트(`*.test.ts(x)`)와 스토리(`*.stories.tsx`)는 각 소스 파일 옆에 colocate되어 있습니다. Vitest + React Testing Library(jsdom)로 계층별로 다른 패턴을 씁니다.

`// given` / `// when` / `// then` 같은 주석은 달지 않습니다. `it('~하면 ~한다')` 설명 문장에 이미 그 내용이 들어있고, 테스트 코드도 arrange(렌더) → act(조작) → assert(검증) 순서라 어디가 어디인지 바로 보이기 때문입니다.

- **순수 함수 (mapper, zod 스키마)**: 입력→출력만 검증하는 단순 단위 테스트. 예) `checkup.mapper.test.ts`, `referenceRange.mapper.test.ts`, `login.schema.ts`/`checkupForm.schema.ts`의 `*.schema.test.ts`(`safeParse` 성공/실패 케이스).
- **Zustand 스토어**: 컴포넌트 없이 `useXxxStore.setState()`/`.getState()`로 직접 상태를 주입·검증합니다. `persist` 미들웨어를 쓰는 스토어(`auth.store.ts`)도 동일하게 다루되, 각 테스트의 `afterEach`에서 스토어 상태를 초기값으로 리셋합니다(모듈이 테스트 파일 간에 공유되는 싱글턴이기 때문).
- **react-hook-form + zod 폼(`LoginForm`, `CheckupForm`)**: `mode: 'onChange'`로 입력마다 비동기 검증이 돌기 때문에, 렌더 직후의 `isValid`/에러 상태를 확인할 때는 `waitFor`로 감싸야 flaky해지지 않습니다(react-hook-form의 잘 알려진 타이밍 이슈). `userEvent.type`으로 입력 후 `await waitFor(() => expect(button).toBeEnabled())` 형태가 기본 패턴입니다.
- **TanStack Query를 쓰는 컴포넌트/훅(`useCheckupData`, `Dashboard`, `CheckupWizard` 등)**: 매 테스트마다 새 `QueryClient`를 만들어 `QueryClientProvider`로 감싸고, 필요하면 `queryClient.setQueryData(queryKeys.checkups.data(), ...)`로 캐시를 미리 채워 렌더합니다. sessionStorage 복원 중 상태는 `IsRestoringProvider value={true}`로 시뮬레이션합니다.
- **API 함수/Route Handler(`checkup.api.ts`, `app/api/checkups/route.ts`)**: MSW(`shared/mocks/server.ts`)로 실제 HTTP 왕복을 가로채 검증합니다. 로그인은 서버 왕복이 없는 순수 클라이언트 로직이라 MSW를 쓰지 않습니다.
- **Chart.js를 렌더하는 조합 테스트(`Dashboard.test.tsx` 등)**: jsdom은 canvas 2D 컨텍스트를 지원하지 않아 실제 Chart.js를 마운트하면 애니메이션 타이밍에 따라 불안정해질 수 있습니다. 차트 자체가 아니라 화면 조합을 검증하는 테스트는 `vi.mock('react-chartjs-2', () => ({ Bar: () => null, Line: () => null }))`로 목업합니다(차트 컴포넌트 자체의 props 매핑 테스트는 목업하지 않고 실제로 마운트해 검증).
- **`next/navigation`을 쓰는 컴포넌트**: `vi.mock('next/navigation', () => ({ useRouter: () => ({ push, replace }) }))`로 라우터를 목업하고 `push`/`replace` 호출 여부·인자를 검증합니다.

## 배포

Vercel로 배포합니다.

- **앱**: https://candiy-frontend.vercel.app/
- **Storybook**: https://candiy-frontend-storybook.vercel.app/ (같은 저장소를 가리키는 별도 Vercel 프로젝트 — `pnpm build-storybook` / `storybook-static`)
- **Preview**: `NEXT_PUBLIC_API_MODE=mock` 유지 — API 키 없이 전체 플로우를 데모할 수 있습니다.
- **Production**: CANDiY 실제 스펙 연동 후 `NEXT_PUBLIC_API_MODE=live`로 전환하고 `CANDIY_API_KEY`/`CANDIY_API_BASE_URL`을 Vercel 환경 변수에 설정합니다.

## 알려진 제한사항

- **로그인이 전부 mock입니다.** 실제 계정 시스템이 없고, 비밀번호는 형식만 검증할 뿐 신원을 확인하지 않습니다. 로그인 사용자 이름과 CANDiY 응답의 검진 대상자 이름(`patientName`)은 서로 무관합니다. 실제 연동 방법은 위 "로그인" 절 참고.
