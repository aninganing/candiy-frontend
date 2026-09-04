import axios from 'axios';
import { NextResponse } from 'next/server';
import { candiyServerClient } from '@/shared/api/candiyServerClient';

export async function POST(request: Request) {
  const body = await request.json();

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
