import { LoanCalculation, LoanRateOption } from '../types/loan';

export function pluralizeDays(days: number): string {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'дні';
  return 'днів';
}

export function formatCurrency(value: number): string {
  return `${new Intl.NumberFormat('uk-UA', {
    maximumFractionDigits: 0,
  }).format(Math.round(value))} ₴`;
}

export function formatReturnDate(daysFromToday: number, baseDate: Date = new Date()): { date: Date; formatted: string } {
  const target = new Date(baseDate);
  target.setDate(target.getDate() + daysFromToday);
  const formatted = new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(target);
  return { date: target, formatted };
}

export function calculateLoan(
  amount: number,
  termDays: number,
  dailyRatePercent: LoanRateOption
): LoanCalculation {
  const interestAmount = Math.round(amount * (dailyRatePercent / 100) * termDays);
  const totalRepayment = amount + interestAmount;
  const { date, formatted } = formatReturnDate(termDays);

  return {
    amount,
    termDays,
    dailyRatePercent,
    interestAmount,
    totalRepayment,
    returnDate: date,
    formattedReturnDate: formatted,
  };
}

export function formatPhoneMask(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  let normalized = digits;
  if (normalized.startsWith('0')) {
    normalized = '38' + normalized;
  } else if (!normalized.startsWith('380')) {
    if (normalized.startsWith('38')) {
      normalized = '380' + normalized.slice(2);
    } else if (normalized.startsWith('3')) {
      normalized = '380' + normalized.slice(1);
    } else {
      normalized = '380' + normalized;
    }
  }
  const sliced = normalized.slice(0, 12);
  let res = '+380';
  if (sliced.length > 3) res += ` (${sliced.slice(3, 5)}`;
  if (sliced.length >= 5) res += ')';
  if (sliced.length > 5) res += ` ${sliced.slice(5, 8)}`;
  if (sliced.length > 8) res += `-${sliced.slice(8, 10)}`;
  if (sliced.length > 10) res += `-${sliced.slice(10, 12)}`;
  return res;
}

export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function isValidPhone(phone: string): boolean {
  return normalizePhoneDigits(phone).length === 12;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function formatPassportMask(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 9);
}

export function formatCardNumberMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatExpiryMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function detectCardBrand(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.startsWith('4')) return 'Visa';
  if (digits.startsWith('5')) return 'Mastercard';
  if (digits.startsWith('9')) return 'Простір';
  return 'Банківська картка';
}
