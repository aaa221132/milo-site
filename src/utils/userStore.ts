import { SimulatedLoan, UserAccount } from '../types/loan';
import { formatReturnDate, normalizePhoneDigits } from './loanMath';

const USERS_STORAGE_KEY = 'milo_users_v1';
const ACTIVE_USER_KEY = 'milo_active_user_id_v1';

function buildDemoUsers(): UserAccount[] {
  const d1 = formatReturnDate(14);
  const d2 = formatReturnDate(-18);
  const d3 = formatReturnDate(30);
  const d4 = formatReturnDate(-40);
  const d5 = formatReturnDate(-12);

  return [
    {
      id: 'demo-user-alex',
      fullName: 'Коваленко Олександр Іванович',
      phone: '+380 (67) 111-22-33',
      email: 'alex@example.ua',
      password: '1234',
      createdAt: '12 жовтня 2026 р.',
      loans: [
        {
          id: 'loan-alex-1',
          contractNumber: 'ML-2026-4812',
          amount: 15000,
          termDays: 14,
          dailyRatePercent: 0.1,
          interestAmount: 210,
          totalRepayment: 15210,
          createdAt: new Intl.DateTimeFormat('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date()),
          returnDateFormatted: d1.formatted,
          cardLast4: '5678',
          status: 'active',
        },
        {
          id: 'loan-alex-2',
          contractNumber: 'ML-2026-3104',
          amount: 8000,
          termDays: 10,
          dailyRatePercent: 1,
          interestAmount: 800,
          totalRepayment: 8800,
          createdAt: '15 вересня 2026 р.',
          returnDateFormatted: d2.formatted,
          cardLast4: '5678',
          status: 'repaid',
        },
      ],
    },
    {
      id: 'demo-user-maria',
      fullName: 'Мельник Марія Тарасівна',
      phone: '+380 (50) 444-55-66',
      email: 'maria@example.ua',
      password: '1234',
      createdAt: '3 вересня 2026 р.',
      loans: [
        {
          id: 'loan-maria-1',
          contractNumber: 'ML-2026-7901',
          amount: 45000,
          termDays: 30,
          dailyRatePercent: 1.5,
          interestAmount: 20250,
          totalRepayment: 65250,
          createdAt: new Intl.DateTimeFormat('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date()),
          returnDateFormatted: d3.formatted,
          cardLast4: '9012',
          status: 'active',
        },
        {
          id: 'loan-maria-2',
          contractNumber: 'ML-2026-6210',
          amount: 20000,
          termDays: 20,
          dailyRatePercent: 1,
          interestAmount: 4000,
          totalRepayment: 24000,
          createdAt: '18 жовтня 2026 р.',
          returnDateFormatted: d5.formatted,
          cardLast4: '9012',
          status: 'repaid',
        },
        {
          id: 'loan-maria-3',
          contractNumber: 'ML-2026-1542',
          amount: 12000,
          termDays: 7,
          dailyRatePercent: 0.1,
          interestAmount: 84,
          totalRepayment: 12084,
          createdAt: '5 вересня 2026 р.',
          returnDateFormatted: d4.formatted,
          cardLast4: '9012',
          status: 'repaid',
        },
      ],
    },
  ];
}

export function loadUsers(): UserAccount[] {
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const seeded = buildDemoUsers();
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fallback if localStorage is unavailable
  }
  return buildDemoUsers();
}

export function saveUsers(users: UserAccount[]): void {
  try {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore storage quota errors
  }
}

export function loadActiveUserId(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_USER_KEY);
  } catch {
    return null;
  }
}

export function saveActiveUserId(userId: string | null): void {
  try {
    if (userId) {
      window.localStorage.setItem(ACTIVE_USER_KEY, userId);
    } else {
      window.localStorage.removeItem(ACTIVE_USER_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export function findUserByCredentials(
  users: UserAccount[],
  identifier: string,
  password: string
): UserAccount | undefined {
  const trimmed = identifier.trim().toLowerCase();
  const digits = normalizePhoneDigits(identifier);

  return users.find((u) => {
    const matchesEmail = u.email.toLowerCase() === trimmed;
    const matchesPhone = digits.length >= 9 && normalizePhoneDigits(u.phone) === digits;
    return (matchesEmail || matchesPhone) && u.password === password;
  });
}

export function findDuplicateUser(
  users: UserAccount[],
  email: string,
  phone: string
): UserAccount | undefined {
  const emailNorm = email.trim().toLowerCase();
  const phoneNorm = normalizePhoneDigits(phone);
  return users.find(
    (u) => u.email.toLowerCase() === emailNorm || normalizePhoneDigits(u.phone) === phoneNorm
  );
}

export function createNewUser(params: {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  initialLoans?: SimulatedLoan[];
}): UserAccount {
  return {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    fullName: params.fullName.trim(),
    phone: params.phone.trim(),
    email: params.email.trim().toLowerCase(),
    password: params.password,
    createdAt: new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date()),
    loans: params.initialLoans ?? [],
  };
}
