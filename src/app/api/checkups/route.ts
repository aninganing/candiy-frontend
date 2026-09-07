import axios from 'axios';
import { NextResponse } from 'next/server';
import type { CheckupVerifyRequestDto } from '@/features/checkups/api/checkup.dto';
import { candiyServerClient } from '@/shared/api/candiyServerClient';
import { serverEnv } from '@/shared/lib/env.server';
import { createCheckupMockResponder } from '@/shared/mocks/checkupMockResponder';

// 브라우저 MSW가 개입하지 않는 경로(직접 호출, MSW 미기동 등)에서도
// mock 모드에서는 실제 CANDiY API로 나가지 않도록 하는 안전장치.
const mockResponder = createCheckupMockResponder();

export async function POST(request: Request) {
  const body = await request.json();

  if (serverEnv.NEXT_PUBLIC_API_MODE === 'mock') {
    const { status, body: responseBody } = mockResponder.resolve(
      body as Partial<CheckupVerifyRequestDto>,
    );
    return NextResponse.json(responseBody, { status });
  }

  try {
    const { data } = await candiyServerClient.post('/v1/nhis/checkup', body);
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    return NextResponse.json(
      {
        status: 'error',
        message: '건강검진 조회 중 알 수 없는 오류가 발생했습니다.',
        code: 'SE-000',
      },
      { status: 500 },
    );
  }
}
