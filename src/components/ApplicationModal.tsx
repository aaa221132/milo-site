import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldAlert,
  X,
} from 'lucide-react';
import { ApplicationFormData, LoanCalculation, SimulatedLoan, UserAccount } from '../types/loan';
import {
  detectCardBrand,
  formatCardNumberMask,
  formatCurrency,
  formatExpiryMask,
  formatPassportMask,
  formatPhoneMask,
  isValidEmail,
  isValidPhone,
  pluralizeDays,
} from '../utils/loanMath';

interface ApplicationModalProps {
  isOpen: boolean;
  calculation: LoanCalculation;
  currentUser: UserAccount | null;
  onClose: () => void;
  onApproved: (
    loan: SimulatedLoan,
    applicantInfo: {
      fullName: string;
      phone: string;
      email: string;
      password: string;
    }
  ) => void;
}

type DrawerStep = 0 | 1 | 2 | 3;

const INITIAL_FORM: ApplicationFormData = {
  phone: '',
  email: '',
  consent: true,
  fullName: '',
  birthDate: '',
  passportSeriesNumber: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  accountPassword: '',
};

export function ApplicationModal({
  isOpen,
  calculation,
  currentUser,
  onClose,
  onApproved,
}: ApplicationModalProps) {
  const [step, setStep] = useState<DrawerStep>(0);
  const [form, setForm] = useState<ApplicationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [approvedLoan, setApprovedLoan] = useState<SimulatedLoan | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isChecking) {
        onClose();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isChecking, onClose]);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setErrors({});
      setIsChecking(false);
      setApprovedLoan(null);
      setForm({
        ...INITIAL_FORM,
        phone: currentUser?.phone ?? '',
        email: currentUser?.email ?? '',
        fullName: currentUser?.fullName ?? '',
      });
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const fillStep1Demo = () => {
    setForm((prev) => ({
      ...prev,
      phone: prev.phone || '+380 (93) 555-77-88',
      email: prev.email || 'new.user@example.ua',
      accountPassword: prev.accountPassword || '1234',
      consent: true,
    }));
    setErrors({});
  };

  const fillStep2Demo = () => {
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || 'Савченко Дмитро Олегович',
      birthDate: '1999-04-18',
      passportSeriesNumber: '001234567',
      cardNumber: '4149 4991 1234 5678',
      cardExpiry: '12/29',
      cardCvv: '123',
    }));
    setErrors({});
  };

  const validateStep1 = (): boolean => {
    const nextErrors: Partial<Record<keyof ApplicationFormData, string>> = {};
    if (!isValidPhone(form.phone)) {
      nextErrors.phone = 'Введіть коректний номер телефону (+380 XX XXX-XX-XX)';
    }
    if (!isValidEmail(form.email)) {
      nextErrors.email = 'Введіть коректну електронну пошту';
    }
    if (!currentUser && form.accountPassword.trim().length < 4) {
      nextErrors.accountPassword = 'Придумайте пароль (мінімум 4 символи) для збереження історії';
    }
    if (!form.consent) {
      nextErrors.consent = 'Підтвердіть згоду на навчальну симуляцію';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const nextErrors: Partial<Record<keyof ApplicationFormData, string>> = {};
    if (form.fullName.trim().split(/\s+/).length < 2) {
      nextErrors.fullName = 'Вкажіть прізвище та ім’я (мінімум два слова)';
    }
    if (!form.birthDate) {
      nextErrors.birthDate = 'Вкажіть дату народження';
    } else {
      const birth = new Date(form.birthDate);
      const ageDiff = new Date().getFullYear() - birth.getFullYear();
      if (Number.isNaN(birth.getTime()) || ageDiff < 18 || ageDiff > 90) {
        nextErrors.birthDate = 'Вік позичальника має бути від 18 до 75 років';
      }
    }
    const passportDigits = form.passportSeriesNumber.replace(/\D/g, '');
    if (passportDigits.length < 8) {
      nextErrors.passportSeriesNumber = 'Введіть 9 цифр номера ID-картки';
    }
    const cardDigits = form.cardNumber.replace(/\D/g, '');
    if (cardDigits.length !== 16) {
      nextErrors.cardNumber = 'Номер картки має містити 16 цифр';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry)) {
      nextErrors.cardExpiry = 'Формат ММ/РР';
    }
    if (!/^\d{3}$/.test(form.cardCvv)) {
      nextErrors.cardCvv = '3 цифри';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleSubmitStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setStep(3);
    setIsChecking(true);

    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const cardDigits = form.cardNumber.replace(/\D/g, '');
      const createdLoan: SimulatedLoan = {
        id: `loan-${Date.now()}`,
        contractNumber: `ML-2026-${randomNum}`,
        amount: calculation.amount,
        termDays: calculation.termDays,
        dailyRatePercent: calculation.dailyRatePercent,
        interestAmount: calculation.interestAmount,
        totalRepayment: calculation.totalRepayment,
        createdAt: new Intl.DateTimeFormat('uk-UA', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(new Date()),
        returnDateFormatted: calculation.formattedReturnDate,
        cardLast4: cardDigits.slice(-4) || '0000',
        status: 'active',
      };

      setIsChecking(false);
      setApprovedLoan(createdLoan);
    }, 1800);
  };

  const cardBrand = detectCardBrand(form.cardNumber);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0F172A]/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isChecking) onClose();
      }}
    >
      <div className="bg-white w-full max-w-[440px] h-full overflow-y-auto shadow-2xl flex flex-col justify-between p-6 sm:p-8">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#00A36C]">
              {step === 0
                ? 'Ваш розрахунок'
                : step === 1
                ? 'Крок 1 з 3 · Контакти'
                : step === 2
                ? 'Крок 2 з 3 · Анкета й картка'
                : 'Крок 3 з 3 · Рішення'}
            </span>

            {!isChecking && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрити панель"
                className="w-9 h-9 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Step 0: Estimate Summary */}
          {step === 0 && (
            <div className="space-y-6">
              <h2
                id="drawer-title"
                className="font-display text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#0F172A] leading-tight"
              >
                Деталі вашої позики.
              </h2>

              <div className="bg-[#F8FAFC] rounded-2xl p-5 space-y-3.5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Сума позики</span>
                  <span className="font-bold text-[#0F172A] tabular-nums">
                    {formatCurrency(calculation.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Повернути через</span>
                  <span className="font-bold text-[#0F172A] tabular-nums">
                    {calculation.termDays} {pluralizeDays(calculation.termDays)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Денна ставка</span>
                  <span className="font-bold text-[#00A36C] tabular-nums">
                    {calculation.dailyRatePercent}% ({formatCurrency(calculation.interestAmount)})
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Дата повернення</span>
                  <span className="font-medium text-slate-700 tabular-nums">
                    {calculation.formattedReturnDate}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#0F172A]">Разом до повернення</span>
                  <span className="font-display text-lg font-extrabold text-[#0F172A] tabular-nums">
                    {formatCurrency(calculation.totalRepayment)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {currentUser
                  ? `Після підтвердження договір буде автоматично збережено в історії акаунта «${currentUser.fullName}».`
                  : 'На наступному кроці ви вкажете контакти, і система створить для вас окремий акаунт зі своєю історією.'}
              </p>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full min-h-[48px] px-5 py-3 bg-[#00B67A] hover:bg-[#009B68] text-white font-display font-bold text-sm sm:text-base rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Продовжити оформлення</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full min-h-[44px] px-5 py-2.5 bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] border border-slate-200 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Повернутися до калькулятора
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Phone, Email (+ password if guest) */}
          {step === 1 && (
            <form onSubmit={handleNextFromStep1} noValidate className="space-y-4">
              <div>
                <h2 id="drawer-title" className="font-display text-2xl font-extrabold text-[#0F172A]">
                  Контактні дані
                </h2>
                <div className="flex items-center justify-between gap-4 mt-1.5">
                  <p className="text-xs text-slate-500">
                    {currentUser ? 'Дані підтягнуто з вашого профілю.' : 'Створимо персональний профіль.'}
                  </p>
                  <button
                    type="button"
                    onClick={fillStep1Demo}
                    className="text-xs font-semibold text-[#00A36C] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Автозаповнити
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="app-phone" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                  Номер телефону
                </label>
                <input
                  id="app-phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="+380 (67) 000-00-00"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: formatPhoneMask(e.target.value) });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm tabular-nums outline-none transition-colors ${
                    errors.phone ? 'border-red-500 bg-red-50/40' : 'border-slate-300 focus:border-[#00B67A]'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="app-email" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                  Електронна пошта
                </label>
                <input
                  id="app-email"
                  type="email"
                  placeholder="name@example.ua"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm outline-none transition-colors ${
                    errors.email ? 'border-red-500 bg-red-50/40' : 'border-slate-300 focus:border-[#00B67A]'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {!currentUser && (
                <div>
                  <label htmlFor="app-password" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                    Пароль для акаунта
                  </label>
                  <input
                    id="app-password"
                    type="password"
                    placeholder="Мінімум 4 символи"
                    value={form.accountPassword}
                    onChange={(e) => {
                      setForm({ ...form, accountPassword: e.target.value });
                      if (errors.accountPassword) setErrors({ ...errors, accountPassword: undefined });
                    }}
                    className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm outline-none transition-colors ${
                      errors.accountPassword
                        ? 'border-red-500 bg-red-50/40'
                        : 'border-slate-300 focus:border-[#00B67A]'
                    }`}
                  />
                  {errors.accountPassword && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.accountPassword}</span>
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => {
                      setForm({ ...form, consent: e.target.checked });
                      if (errors.consent) setErrors({ ...errors, consent: undefined });
                    }}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#00B67A] focus:ring-[#00B67A]"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    Я розумію, що це навчальний прототип, і дані зберігаються лише локально у браузері.
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.consent}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="px-4 py-3 min-h-[48px] border border-slate-200 hover:bg-slate-50 text-[#0F172A] font-semibold text-sm rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Назад</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[48px] px-5 py-3 bg-[#00B67A] hover:bg-[#009B68] text-white font-display font-bold text-sm sm:text-base rounded-xl transition-colors cursor-pointer"
                >
                  Далі
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Mock Passport & Card */}
          {step === 2 && (
            <form onSubmit={handleSubmitStep2} noValidate className="space-y-4">
              <div>
                <h2 id="drawer-title" className="font-display text-2xl font-extrabold text-[#0F172A]">
                  Паспорт і картка
                </h2>
              </div>

              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#00A36C] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Навчальна форма: використовуйте вигадані тестові дані.</span>
                </div>
                <button
                  type="button"
                  onClick={fillStep2Demo}
                  className="font-semibold text-[#00A36C] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Автозаповнити
                </button>
              </div>

              <div>
                <label htmlFor="app-fullname" className="block text-sm font-semibold text-[#0F172A] mb-1">
                  ПІБ (умовно)
                </label>
                <input
                  id="app-fullname"
                  type="text"
                  placeholder="Савченко Дмитро Олегович"
                  value={form.fullName}
                  onChange={(e) => {
                    setForm({ ...form, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm outline-none transition-colors ${
                    errors.fullName ? 'border-red-500 bg-red-50/40' : 'border-slate-300 focus:border-[#00B67A]'
                  }`}
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="app-passport" className="block text-sm font-semibold text-[#0F172A] mb-1">
                    Номер ID-картки
                  </label>
                  <input
                    id="app-passport"
                    type="text"
                    inputMode="numeric"
                    placeholder="001234567"
                    value={form.passportSeriesNumber}
                    onChange={(e) => {
                      setForm({ ...form, passportSeriesNumber: formatPassportMask(e.target.value) });
                      if (errors.passportSeriesNumber) setErrors({ ...errors, passportSeriesNumber: undefined });
                    }}
                    className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm tabular-nums outline-none transition-colors ${
                      errors.passportSeriesNumber
                        ? 'border-red-500 bg-red-50/40'
                        : 'border-slate-300 focus:border-[#00B67A]'
                    }`}
                  />
                  {errors.passportSeriesNumber && (
                    <p className="mt-1 text-xs text-red-600">{errors.passportSeriesNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="app-birthdate" className="block text-sm font-semibold text-[#0F172A] mb-1">
                    Дата народження
                  </label>
                  <input
                    id="app-birthdate"
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => {
                      setForm({ ...form, birthDate: e.target.value });
                      if (errors.birthDate) setErrors({ ...errors, birthDate: undefined });
                    }}
                    className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm tabular-nums outline-none transition-colors ${
                      errors.birthDate ? 'border-red-500 bg-red-50/40' : 'border-slate-300 focus:border-[#00B67A]'
                    }`}
                  />
                  {errors.birthDate && <p className="mt-1 text-xs text-red-600">{errors.birthDate}</p>}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="app-card" className="text-sm font-semibold text-[#0F172A]">
                    Номер банківської картки
                  </label>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" aria-hidden="true" />
                    {cardBrand}
                  </span>
                </div>
                <input
                  id="app-card"
                  type="text"
                  inputMode="numeric"
                  placeholder="4149 4991 0000 0000"
                  value={form.cardNumber}
                  onChange={(e) => {
                    setForm({ ...form, cardNumber: formatCardNumberMask(e.target.value) });
                    if (errors.cardNumber) setErrors({ ...errors, cardNumber: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm font-mono tabular-nums outline-none transition-colors ${
                    errors.cardNumber ? 'border-red-500 bg-red-50/40' : 'border-slate-300 focus:border-[#00B67A]'
                  }`}
                />
                {errors.cardNumber && <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="app-expiry" className="block text-sm font-semibold text-[#0F172A] mb-1">
                    Термін дії
                  </label>
                  <input
                    id="app-expiry"
                    type="text"
                    inputMode="numeric"
                    placeholder="12/29"
                    value={form.cardExpiry}
                    onChange={(e) => {
                      setForm({ ...form, cardExpiry: formatExpiryMask(e.target.value) });
                      if (errors.cardExpiry) setErrors({ ...errors, cardExpiry: undefined });
                    }}
                    className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm font-mono tabular-nums outline-none transition-colors ${
                      errors.cardExpiry ? 'border-red-500 bg-red-50/40' : 'border-slate-300 focus:border-[#00B67A]'
                    }`}
                  />
                  {errors.cardExpiry && <p className="mt-1 text-xs text-red-600">{errors.cardExpiry}</p>}
                </div>

                <div>
                  <label htmlFor="app-cvv" className="block text-sm font-semibold text-[#0F172A] mb-1">
                    CVV / CVC
                  </label>
                  <input
                    id="app-cvv"
                    type="password"
                    inputMode="numeric"
                    maxLength={3}
                    placeholder="123"
                    value={form.cardCvv}
                    onChange={(e) => {
                      setForm({ ...form, cardCvv: e.target.value.replace(/\D/g, '').slice(0, 3) });
                      if (errors.cardCvv) setErrors({ ...errors, cardCvv: undefined });
                    }}
                    className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm font-mono tabular-nums outline-none transition-colors ${
                      errors.cardCvv ? 'border-red-500 bg-red-50/40' : 'border-slate-300 focus:border-[#00B67A]'
                    }`}
                  />
                  {errors.cardCvv && <p className="mt-1 text-xs text-red-600">{errors.cardCvv}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 min-h-[48px] border border-slate-200 hover:bg-slate-50 text-[#0F172A] font-semibold text-sm rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Назад</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[48px] px-5 py-3 bg-[#00B67A] hover:bg-[#009B68] text-white font-display font-bold text-sm sm:text-base rounded-xl transition-colors cursor-pointer"
                >
                  Надіслати заявку
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Spinner & Approval */}
          {step === 3 && (
            <div className="py-6">
              {isChecking ? (
                <div className="py-12 text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-[#00B67A] animate-spin mx-auto" aria-hidden="true" />
                  <h2 id="drawer-title" className="font-display text-xl font-bold text-[#0F172A]">
                    Імітація перевірки анкети
                  </h2>
                  <p className="text-sm text-slate-600">
                    Моделюємо скорингову перевірку та додаємо договір до вашої історії...
                  </p>
                </div>
              ) : (
                approvedLoan && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-[#E6F7F1] text-[#00A36C] flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
                      </div>
                      <h2 id="drawer-title" className="font-display text-2xl font-extrabold text-[#0F172A]">
                        Заявку схвалено!
                      </h2>
                      <p className="text-sm text-slate-600">
                        Договір <span className="font-mono font-semibold text-[#0F172A]">{approvedLoan.contractNumber}</span> сформовано та збережено у вашому особистому кабінеті.
                      </p>
                    </div>

                    <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 space-y-3 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Зараховано на картку</span>
                        <span className="font-bold text-[#0F172A] tabular-nums">
                          {formatCurrency(approvedLoan.amount)} (•••• {approvedLoan.cardLast4})
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Ставка</span>
                        <span className="font-semibold text-[#00A36C] tabular-nums">
                          {approvedLoan.dailyRatePercent}% / день
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Дата повернення</span>
                        <span className="font-semibold text-[#0F172A] tabular-nums">
                          {approvedLoan.returnDateFormatted}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 pt-2 border-t border-slate-200">
                        <span className="font-semibold text-[#0F172A]">Разом до повернення</span>
                        <span className="font-display text-lg font-extrabold text-[#00A36C] tabular-nums">
                          {formatCurrency(approvedLoan.totalRepayment)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() =>
                          onApproved(approvedLoan, {
                            fullName: form.fullName,
                            phone: form.phone,
                            email: form.email,
                            password: form.accountPassword || '1234',
                          })
                        }
                        className="w-full min-h-[48px] px-5 py-3 bg-[#00B67A] hover:bg-[#009B68] text-white font-display font-bold text-sm sm:text-base rounded-xl transition-colors cursor-pointer"
                      >
                        Відкрити мій кабінет та історію
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full min-h-[44px] px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-[#0F172A] font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                      >
                        Повернутися до калькулятора
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-400">
          milo. · Навчальний фінансовий прототип
        </div>
      </div>
    </div>
  );
}
