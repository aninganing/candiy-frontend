import { apiPost } from '@/shared/api/client';
import { toCheckupChallenge, toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import type {
  CheckupChallenge,
  CheckupData,
  CheckupRequestInput,
} from '@/features/checkups/types/checkup.types';
import type {
  CheckupInitiateRequestDto,
  CheckupInitiateResponseDto,
  CheckupVerifyRequestDto,
  CheckupVerifyResponseDto,
} from '@/features/checkups/api/checkup.dto';

const CHECKUP_ENDPOINT = '/checkups';

function toInitiateRequestDto(input: CheckupRequestInput, id: string): CheckupInitiateRequestDto {
  return {
    id,
    loginTypeLevel: String(input.loginTypeLevel),
    legalName: input.legalName,
    birthdate: input.birthdate,
    phoneNo: input.phoneNo,
    telecom: String(input.telecom),
    startDate: input.startDate,
    endDate: input.endDate,
    inquiryType: input.inquiryType !== undefined ? String(input.inquiryType) : undefined,
  };
}

export async function initiateCheckup(
  input: CheckupRequestInput,
  id: string,
): Promise<CheckupChallenge> {
  const response = await apiPost<CheckupInitiateResponseDto>(
    CHECKUP_ENDPOINT,
    toInitiateRequestDto(input, id),
  );
  return toCheckupChallenge(response.data);
}

export async function verifyCheckup(
  input: CheckupRequestInput,
  id: string,
  challenge: CheckupChallenge,
): Promise<CheckupData> {
  const dto: CheckupVerifyRequestDto = {
    ...toInitiateRequestDto(input, id),
    isContinue: '1',
    multiFactorInfo: challenge,
  };
  const response = await apiPost<CheckupVerifyResponseDto>(CHECKUP_ENDPOINT, dto);
  return toCheckupData(response.data);
}
