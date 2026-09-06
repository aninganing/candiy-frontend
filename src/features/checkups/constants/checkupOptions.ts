import type { LoginTypeLevel, TelecomCode } from '@/features/checkups/types/checkup.types';

export const AUTH_METHODS: { level: LoginTypeLevel; label: string }[] = [
  { level: 1, label: '카카오톡' },
  { level: 3, label: '삼성패스' },
  { level: 4, label: '국민은행' },
  { level: 5, label: 'PASS' },
  { level: 6, label: '네이버' },
  { level: 7, label: '신한은행' },
  { level: 8, label: '토스' },
  { level: 9, label: '뱅크샐러드' },
  { level: 10, label: '하나은행' },
  { level: 11, label: 'NH모바일인증서' },
  { level: 12, label: '우리은행' },
  { level: 13, label: '카카오뱅크' },
];

export const TELECOMS: { code: TelecomCode; label: string }[] = [
  { code: 0, label: 'SKT' },
  { code: 1, label: 'KT' },
  { code: 2, label: 'LG U+' },
];

export function getAuthMethodLabel(level: LoginTypeLevel): string {
  return AUTH_METHODS.find((method) => method.level === level)?.label ?? '';
}
