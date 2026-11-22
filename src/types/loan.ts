export type LoanRateOption = 0.1 | 1 | 1.5 | 2;

export interface LoanCalculation {
  amount: number;
  termDays: number;
  dailyRatePercent: LoanRateOption;
  interestAmount: number;
  totalRepayment: number;
  returnDate: Date;
  formattedReturnDate: string;
}

export interface ApplicationFormData {
  phone: string;
  email: string;
  consent: boolean;
  fullName: string;
  birthDate: string;
  passportSeriesNumber: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  accountPassword: string;
}

export interface SimulatedLoan {
  id: string;
  contractNumber: string;
  amount: number;
  termDays: number;
  dailyRatePercent: number;
  interestAmount: number;
  totalRepayment: number;
  createdAt: string;
  returnDateFormatted: string;
  cardLast4: string;
  status: 'active' | 'repaid';
}

export interface UserAccount {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  createdAt: string;
  loans: SimulatedLoan[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
