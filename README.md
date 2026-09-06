# CANDiY 건강검진 대시보드

CANDiY NHIS API를 연동해 국민건강보험 건강검진 결과를 조회하고 시각화합니다.

## 프로젝트 개요

사용자가 이름/생년월일/휴대폰번호와 간편인증 수단을 입력하면 CANDiY의 2단계(1차 요청 → 간편인증 → 2차 요청) 본인인증 플로우를 거쳐 건강검진 이력을 조회합니다. 조회가 완료되면 검진 개요·상세 항목·과거 이력을 대시보드 화면에서 확인할 수 있습니다.

## 기술 스택 (선택 이유)

- **Next.js App Router + TypeScript(strict)** — 서버 프록시(Route Handler)와 클라이언트 화면을 한 프로젝트에서 관리하기 위해. `app/`은 라우팅만 담당하고 로직은 `features/`에 응집시킵니다.
- **Tailwind CSS v4** — `@theme`의 CSS-first 설정으로 디자인 토큰(컬러/라디우스/쉐도우)을 정의하고, 다크모드를 `prefers-color-scheme` 기반으로 전환합니다.
- **TanStack Query + Zustand** — 서버에서 오는 데이터(검진 조회 결과)는 TanStack Query로, 서버가 소유하지 않는 클라이언트 상태(위저드 진행 단계)는 Zustand로 분리해 캐시 이원화를 방지합니다.
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

`http://localhost:3000`에서 확인합니다. 기본 `NEXT_PUBLIC_API_MODE=mock` 상태로 실행하면 실제 API 키 없이도 전체 조회 플로우를 끝까지 체험할 수 있습니다.

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
    page.tsx                  # 홈
    layout.tsx, providers.tsx # 전역 레이아웃, TanStack Query/MockProvider 등록
    checkups/page.tsx         # 건강검진 조회 화면
    api/checkups/route.ts     # 서버 프록시 Route Handler
  features/
    checkups/
      api/                    # DTO 정의 + axios 호출 (checkup.dto.ts, checkup.api.ts)
      mappers/                # DTO → 도메인 타입 변환 (checkup.mapper.ts)
      types/                  # 도메인 타입 (checkup.types.ts)
      constants/              # 간편인증 수단/통신사 옵션, 인증 만료 시간
      hooks/                  # TanStack Query 훅 + 위저드 오케스트레이션 훅
      store/                  # Zustand 위저드 상태
      components/             # CheckupIntro/Form/Pending/Success + CheckupWizard
  shared/
    api/                      # client.ts(브라우저 axios), candiyServerClient.ts(서버 전용)
    mocks/                    # MSW handler/fixture, MockProvider
    components/
      ui/                     # Button, Card, Input, Badge, SelectableChip, InlineAlert
      layout/                 # Header
    lib/                      # cn(), env 등 공통 유틸
```

### API 추상화 계층

`shared/api/client.ts`가 axios 인스턴스를 만드는 유일한 지점입니다. 다른 코드는 axios를 직접 import하지 않고, `features/*/api/*.api.ts`가 DTO를 받아 `features/*/mappers/*.mapper.ts`로 도메인 타입으로 변환합니다. 컴포넌트/훅/스토어는 도메인 타입만 다루며 DTO를 직접 다루지 않습니다.

브라우저는 CANDiY API를 직접 호출하지 않고 Next.js Route Handler(`app/api/checkups/route.ts`)를 거칩니다. Route Handler는 서버 전용 `candiyServerClient`로 API 키를 주입해 실제(또는 mock) CANDiY API에 요청합니다 — API 키가 브라우저 번들에 포함되지 않습니다.

## 주요 기능 / 화면

### 건강검진 조회 위저드 (`/checkups`)

CANDiY NHIS 문서의 2단계 인증 플로우를 그대로 구현했습니다.

1. **CheckupIntro** — 조회 시작 안내 화면.
2. **CheckupForm** — 이름/생년월일/휴대폰번호와 간편인증 수단(12종)·통신사(3종)를 입력해 1차 요청을 보냅니다.
3. **CheckupPending** — 1차 요청 응답(`multiFactorInfo`)을 받아 사용자가 휴대폰에서 간편인증을 완료하길 기다리는 화면. 인증 만료(4분 30초) 카운트다운을 보여주고, 폴링 대신 사용자가 직접 "인증 완료" 버튼을 눌러 2차 요청을 트리거합니다. 아직 인증을 완료하지 않은 상태로 누르면(`AE-003`) 같은 화면에서 재시도 안내를 보여줍니다.
4. **CheckupSuccess** — 2차 요청이 성공해 검진 데이터를 받으면 요약(검진 횟수, 최근 검진일)을 보여줍니다.

위저드 진행 상태는 Zustand(`checkupWizard.store.ts`)의 discriminated union으로 관리하며, `persist`를 사용하지 않습니다 — 개인정보와 인증 challenge가 새로고침 후에도 남아있으면 안 되고, 어차피 4분 30초 후 만료되기 때문입니다.

## API 연동 노트

`NEXT_PUBLIC_API_MODE=mock`일 때는 MSW(`shared/mocks/`)가 CANDiY 문서 기반 fixture로 응답해 API 키 없이도 전체 플로우를 데모할 수 있습니다.

`features/checkups`는 현재 CANDiY NHIS 건강검진 조회 문서(1차/2차 인증 요청)를 기준으로 DTO와 mapper를 구현했지만, 기본값은 여전히 `mock` 모드입니다. 실제 스펙과 차이가 발견되거나 `live`로 전환할 때 수정이 필요한 지점은 다음 세 곳뿐입니다.

- `features/checkups/api/checkup.dto.ts` — wire-format 필드명
- `features/checkups/mappers/checkup.mapper.ts` — DTO → 도메인 타입 변환
- `shared/api/client.ts` / `candiyServerClient.ts` — base URL, 인증 헤더 방식

컴포넌트/훅/스토어는 도메인 타입만 알고 있으므로 위 세 곳 외에는 수정할 필요가 없습니다.

## 테스트 / Storybook 실행 방법

```bash
pnpm test          # Vitest 전체 실행 (mapper, 훅, 컴포넌트)
pnpm test:watch    # watch 모드
pnpm storybook     # Storybook 개발 서버 — shared/components/ui, features/checkups/components 프레젠테이션 확인
```

테스트(`*.test.ts(x)`)와 스토리(`*.stories.tsx`)는 각 소스 파일 옆에 colocate되어 있습니다.

## 배포

Vercel로 배포합니다.

- **Preview**: `NEXT_PUBLIC_API_MODE=mock` 유지 — API 키 없이 전체 플로우를 데모할 수 있습니다.
- **Production**: CANDiY 실제 스펙 연동 후 `NEXT_PUBLIC_API_MODE=live`로 전환하고 `CANDIY_API_KEY`/`CANDIY_API_BASE_URL`을 Vercel 환경 변수에 설정합니다.

## 알려진 제한사항

- 검진 결과를 시계열로 시각화하는 대시보드/트렌드(추이) 화면은 아직 구현되지 않았습니다. `CheckupSuccess`는 요약 통계만 보여줍니다.
- 로그인/인증 세션 관리(`features/auth`)는 아직 구현되지 않았습니다 — 현재는 위저드 진입 시마다 매번 본인인증을 새로 진행합니다.
- CANDiY 실제 API 응답으로 검증된 적이 없으며, 현재 DTO/mapper는 공개 문서 기준으로 작성되었습니다. 실제 연동 시 필드명/에러코드 차이가 발견될 수 있습니다.
- 모바일 반응형은 주요 브레이크포인트(`sm:`)까지만 확인했으며, 더 다양한 기기 폭에 대한 전수 검증은 하지 않았습니다.
