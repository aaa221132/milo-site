import { ArrowRight, Check, Clock, Lock, UserPlus } from 'lucide-react';
import { LoanCalculation, LoanRateOption, UserAccount } from '../types/loan';
import { formatCurrency, pluralizeDays } from '../utils/loanMath';

interface HeroCalculatorProps {
  amount: number;
  termDays: number;
  dailyRate: LoanRateOption;
  calculation: LoanCalculation;
  currentUser: UserAccount | null;
  onAmountChange: (value: number) => void;
  onTermChange: (value: number) => void;
  onRateChange: (rate: LoanRateOption) => void;
  onApply: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAccount: () => void;
}

const AMOUNT_MIN = 1000;
const AMOUNT_MAX = 100000;
const AMOUNT_STEP = 1000;
const TERM_MIN = 5;
const TERM_MAX = 90;
const TERM_STEP = 1;

const RATE_OPTIONS: { value: LoanRateOption; label: string; hint?: string }[] = [
  { value: 0.1, label: '0.1%', hint: 'мін.' },
  { value: 1, label: '1%' },
  { value: 1.5, label: '1.5%' },
  { value: 2, label: '2%' },
];

const AMOUNT_PRESETS = [5000, 25000, 50000, 100000];

export function HeroCalculator({
  amount,
  termDays,
  dailyRate,
  calculation,
  currentUser,
  onAmountChange,
  onTermChange,
  onRateChange,
  onApply,
  onOpenLogin,
  onOpenRegister,
  onOpenAccount,
}: HeroCalculatorProps) {
  const amountProgress = ((amount - AMOUNT_MIN) / (AMOUNT_MAX - AMOUNT_MIN)) * 100;
  const termProgress = ((termDays - TERM_MIN) / (TERM_MAX - TERM_MIN)) * 100;

  return (
    <section
      id="calculator"
      className="bg-gradient-to-b from-[#F8FAFB] to-[#F4F7FA] border-b border-slate-100"
    >
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Copy & Guest/Account Entry */}
          <div className="lg:col-span-6">
            <h1
              className="font-display font-extrabold tracking-tight text-[#0F172A] leading-[1.06] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 4.4vw, 3.65rem)', textWrap: 'balance' }}
            >
              Життя триває.
              <br />
              Рухайтесь далі.
              <br />
              <span className="text-[#00A36C]">Ми підтримаємо.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-md mb-7">
              Позика на картку для важливих цілей. Отримайте від 1 000 до 100 000 ₴ на термін до 90 днів з гнучкою ставкою від 0.1% на день.
            </p>

            {/* Inline Trust Row */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-[#0F172A] mb-4">
              <div className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00A36C]" aria-hidden="true" />
                <span>Рішення за 5 хв</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00A36C]" aria-hidden="true" />
                <span>Ставка від 0.1% на день</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-xs text-slate-500 mb-8">
              <Lock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Ваші дані залишаються приватними. Завжди.</span>
            </div>

            {/* Immediate Entry / Account Status Box */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 max-w-md">
              {currentUser ? (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-slate-500">Активний профіль</div>
                    <div className="font-display text-sm font-bold text-[#0F172A] mt-0.5">
                      {currentUser.fullName}
                    </div>
                    <div className="text-xs text-[#00A36C] mt-0.5 tabular-nums">
                      У вашій історії позик: {currentUser.loans.length}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAccount}
                    className="px-3.5 py-2 min-h-[40px] bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] border border-slate-200 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Моя історія
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0F172A] mb-1">
                    <UserPlus className="w-4 h-4 text-[#00A36C]" aria-hidden="true" />
                    <span>Персональний акаунт та історія позик</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
                    Зареєструйтеся або увійдіть у свій акаунт, щоб зберігати оформлені позики та керувати поверненням.
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={onOpenRegister}
                      className="px-4 py-2 min-h-[38px] bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Зареєструватися
                    </button>
                    <button
                      type="button"
                      onClick={onOpenLogin}
                      className="px-4 py-2 min-h-[38px] bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] border border-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Увійти в акаунт
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Loan Calculator Card */}
          <div className="lg:col-span-6 lg:pl-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F172A]">
                  Ваша позика. Ваші умови.
                </h2>
                <span className="text-xs font-semibold text-[#00A36C] whitespace-nowrap">
                  До 100 000 ₴ · 90 дн.
                </span>
              </div>

              {/* Slider 1: Amount up to 100 000 ₴ */}
              <div className="mb-5">
                <div className="flex items-baseline justify-between gap-4 mb-2.5">
                  <label htmlFor="loan-amount-slider" className="text-xs sm:text-sm font-medium text-slate-600">
                    Скільки вам потрібно?
                  </label>
                  <span className="font-display text-2xl sm:text-[26px] font-extrabold text-[#0F172A] tabular-nums">
                    {formatCurrency(amount)}
                  </span>
                </div>

                <input
                  id="loan-amount-slider"
                  type="range"
                  min={AMOUNT_MIN}
                  max={AMOUNT_MAX}
                  step={AMOUNT_STEP}
                  value={amount}
                  onChange={(e) => onAmountChange(Number(e.target.value))}
                  className="fintech-slider"
                  style={{
                    background: `linear-gradient(to right, #00B67A 0%, #00B67A ${amountProgress}%, #E2E8F0 ${amountProgress}%, #E2E8F0 100%)`,
                  }}
                  aria-label="Сума позики у гривнях"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 tabular-nums">
                  <span>1 000 ₴</span>
                  <span>50 000 ₴</span>
                  <span>100 000 ₴</span>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-3">
                  {AMOUNT_PRESETS.map((preset) => {
                    const active = amount === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => onAmountChange(preset)}
                        className={`py-1.5 px-2 text-[11px] sm:text-xs font-semibold rounded-lg border transition-colors cursor-pointer tabular-nums whitespace-nowrap ${
                          active
                            ? 'bg-[#0F172A] text-white border-[#0F172A]'
                            : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {formatCurrency(preset)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider 2: Term up to 90 days */}
              <div className="mb-5">
                <div className="flex items-baseline justify-between gap-4 mb-2.5">
                  <label htmlFor="loan-term-slider" className="text-xs sm:text-sm font-medium text-slate-600">
                    На який термін?
                  </label>
                  <div className="flex items-baseline gap-1.5 tabular-nums">
                    <span className="font-display text-2xl sm:text-[26px] font-extrabold text-[#0F172A]">
                      {termDays}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500">
                      {pluralizeDays(termDays)}
                    </span>
                  </div>
                </div>

                <input
                  id="loan-term-slider"
                  type="range"
                  min={TERM_MIN}
                  max={TERM_MAX}
                  step={TERM_STEP}
                  value={termDays}
                  onChange={(e) => onTermChange(Number(e.target.value))}
                  className="fintech-slider"
                  style={{
                    background: `linear-gradient(to right, #00B67A 0%, #00B67A ${termProgress}%, #E2E8F0 ${termProgress}%, #E2E8F0 100%)`,
                  }}
                  aria-label="Термін позики у днях"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 tabular-nums">
                  <span>5 днів</span>
                  <span>45 днів</span>
                  <span>90 днів</span>
                </div>
              </div>

              {/* Interest Rate Selector (0.1%, 1%, 1.5%, 2%) */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs sm:text-sm font-medium text-slate-600">
                    Денна відсоткова ставка
                  </span>
                  <span className="text-xs font-semibold text-[#00A36C] tabular-nums">
                    Обрано: {dailyRate}% / день
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F8FAFC] border border-slate-200 rounded-xl">
                  {RATE_OPTIONS.map((option) => {
                    const isSelected = dailyRate === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onRateChange(option.value)}
                        className={`py-2 px-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer tabular-nums flex flex-col items-center justify-center leading-tight ${
                          isSelected
                            ? 'bg-white text-[#0F172A] shadow-xs border border-slate-200'
                            : 'text-slate-600 hover:text-[#0F172A]'
                        }`}
                      >
                        <span>{option.label}</span>
                        {option.hint && (
                          <span
                            className={`text-[10px] font-semibold mt-0.5 ${
                              isSelected ? 'text-[#00A36C]' : 'text-slate-400'
                            }`}
                          >
                            {option.hint}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary Box */}
              <div className="bg-[#F8FAFC] rounded-xl p-4 sm:p-5 space-y-2.5 mb-5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500">Ви берете</span>
                  <span className="font-semibold text-[#0F172A] tabular-nums">
                    {formatCurrency(calculation.amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500">
                    Відсотки ({calculation.dailyRatePercent}% / день)
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${
                      dailyRate === 0.1 ? 'text-[#00A36C]' : 'text-[#0F172A]'
                    }`}
                  >
                    {formatCurrency(calculation.interestAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500">Дата повернення</span>
                  <span className="font-medium text-slate-700 tabular-nums">
                    {calculation.formattedReturnDate}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-slate-200/80 flex items-baseline justify-between">
                  <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                    Разом до повернення
                  </span>
                  <span className="font-display text-lg sm:text-xl font-extrabold text-[#0F172A] tabular-nums">
                    {formatCurrency(calculation.totalRepayment)}
                  </span>
                </div>
              </div>

              {/* Primary CTA Button */}
              <button
                type="button"
                onClick={onApply}
                className="w-full min-h-[48px] px-6 py-3 bg-[#00B67A] hover:bg-[#009B68] active:scale-[0.99] text-white font-display font-bold text-sm sm:text-base rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00B67A]"
              >
                <span>Отримати позику</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed mt-3.5">
                Мінімальна ставка 0.1% на день для першої або пільгової позики.
                <br />
                Жодних зобов&apos;язань до підтвердження пропозиції.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
