import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, LogOut, User, UserPlus, X } from 'lucide-react';
import { UserAccount } from '../types/loan';
import {
  formatCurrency,
  formatPhoneMask,
  isValidEmail,
  isValidPhone,
  pluralizeDays,
} from '../utils/loanMath';

export type AuthModalMode = 'login' | 'register';

interface AccountModalProps {
  isOpen: boolean;
  initialMode: AuthModalMode;
  currentUser: UserAccount | null;
  allUsers: UserAccount[];
  onClose: () => void;
  onLogin: (identifier: string, password: string) => string | null;
  onQuickSwitchUser: (userId: string) => void;
  onRegister: (payload: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
  }) => string | null;
  onLogout: () => void;
  onRepayLoan: (loanId: string) => void;
  onOpenCalculator: () => void;
}

export function AccountModal({
  isOpen,
  initialMode,
  currentUser,
  allUsers,
  onClose,
  onLogin,
  onQuickSwitchUser,
  onRegister,
  onLogout,
  onRepayLoan,
  onOpenCalculator,
}: AccountModalProps) {
  const [authTab, setAuthTab] = useState<AuthModalMode>(initialMode);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'active' | 'repaid'>('all');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  useEffect(() => {
    setAuthTab(initialMode);
    setLoginError('');
    setRegError('');
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setLoginError('Введіть email або номер телефону');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Введіть пароль');
      return;
    }
    const err = onLogin(loginIdentifier, loginPassword);
    if (err) {
      setLoginError(err);
    } else {
      setLoginError('');
      setLoginIdentifier('');
      setLoginPassword('');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regName.trim().split(/\s+/).length < 2) {
      setRegError('Вкажіть прізвище та ім’я (мінімум два слова)');
      return;
    }
    if (!isValidPhone(regPhone)) {
      setRegError('Введіть коректний номер телефону (+380 XX XXX-XX-XX)');
      return;
    }
    if (!isValidEmail(regEmail)) {
      setRegError('Введіть коректну електронну пошту');
      return;
    }
    if (regPassword.trim().length < 4) {
      setRegError('Пароль має містити щонайменше 4 символи');
      return;
    }

    const err = onRegister({
      fullName: regName,
      phone: regPhone,
      email: regEmail,
      password: regPassword,
    });

    if (err) {
      setRegError(err);
    } else {
      setRegError('');
      setRegName('');
      setRegPhone('');
      setRegEmail('');
      setRegPassword('');
    }
  };

  const activeLoansCount = currentUser ? currentUser.loans.filter((l) => l.status === 'active').length : 0;
  const repaidLoansCount = currentUser ? currentUser.loans.filter((l) => l.status === 'repaid').length : 0;
  const filteredLoans = currentUser
    ? currentUser.loans.filter((l) => (historyFilter === 'all' ? true : l.status === historyFilter))
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <User className="w-5 h-5 text-[#00A36C]" aria-hidden="true" />
            ) : (
              <UserPlus className="w-5 h-5 text-[#00A36C]" aria-hidden="true" />
            )}
            <h2 id="account-modal-title" className="font-display text-lg font-bold text-[#0F172A]">
              {currentUser ? 'Особистий кабінет та історія' : 'Вхід або реєстрація'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити вікно кабінету"
            className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!currentUser ? (
          <div className="p-6 space-y-5">
            {/* Login / Register Segmented Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#F8FAFC] border border-slate-200 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setLoginError('');
                }}
                className={`py-2 px-3 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-white text-[#0F172A] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                Увійти
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setRegError('');
                }}
                className={`py-2 px-3 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  authTab === 'register'
                    ? 'bg-white text-[#0F172A] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                Реєстрація
              </button>
            </div>

            {authTab === 'login' ? (
              <div className="space-y-5">
                <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                  <div>
                    <label htmlFor="login-id" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                      Email або номер телефону
                    </label>
                    <input
                      id="login-id"
                      type="text"
                      placeholder="alex@example.ua або +380 (67) 111-22-33"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 focus:border-[#00B67A] text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="login-pass" className="block text-sm font-semibold text-[#0F172A] mb-1.5">
                      Пароль
                    </label>
                    <input
                      id="login-pass"
                      type="password"
                      placeholder="••••"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 focus:border-[#00B67A] text-sm outline-none transition-colors"
                    />
                  </div>

                  {loginError && (
                    <p className="text-xs text-red-600 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full min-h-[46px] px-5 py-2.5 bg-[#00B67A] hover:bg-[#009B68] text-white font-display font-bold text-sm sm:text-base rounded-xl transition-colors cursor-pointer"
                  >
                    Увійти в акаунт
                  </button>
                </form>

                {/* Quick Switcher for existing accounts to demonstrate isolated histories */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 mb-2.5">
                    Швидкий вхід у наявні профілі (різні історії):
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => onQuickSwitchUser(user.id)}
                        className="w-full px-3.5 py-2.5 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-xl text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                            {user.fullName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate tabular-nums">
                            {user.phone} · {user.email}
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#00A36C] whitespace-nowrap shrink-0 tabular-nums">
                          Позик: {user.loans.length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
                <p className="text-xs text-slate-500">
                  Новий акаунт матиме власну чисту історію позик і зберігатиметься локально.
                </p>

                <div>
                  <label htmlFor="reg-name" className="block text-sm font-semibold text-[#0F172A] mb-1">
                    ПІБ
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    placeholder="Бондаренко Ірина Сергіївна"
                    value={regName}
                    onChange={(e) => {
                      setRegName(e.target.value);
                      if (regError) setRegError('');
                    }}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 focus:border-[#00B67A] text-sm outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="reg-phone" className="block text-sm font-semibold text-[#0F172A] mb-1">
                      Номер телефону
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="+380 (67) 000-00-00"
                      value={regPhone}
                      onChange={(e) => {
                        setRegPhone(formatPhoneMask(e.target.value));
                        if (regError) setRegError('');
                      }}
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 focus:border-[#00B67A] text-sm tabular-nums outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="reg-email" className="block text-sm font-semibold text-[#0F172A] mb-1">
                      Email
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="iryna@example.ua"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        if (regError) setRegError('');
                      }}
                      className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 focus:border-[#00B67A] text-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-pass" className="block text-sm font-semibold text-[#0F172A] mb-1">
                    Пароль
                  </label>
                  <input
                    id="reg-pass"
                    type="password"
                    placeholder="Мінімум 4 символи"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (regError) setRegError('');
                    }}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 focus:border-[#00B67A] text-sm outline-none transition-colors"
                  />
                </div>

                {regError && (
                  <p className="text-xs text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full min-h-[46px] px-5 py-2.5 bg-[#00B67A] hover:bg-[#009B68] text-white font-display font-bold text-sm sm:text-base rounded-xl transition-colors cursor-pointer"
                >
                  Зареєструватися
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Authenticated User Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="font-display font-bold text-base text-[#0F172A]">
                  {currentUser.fullName}
                </div>
                <div className="text-xs text-slate-500 tabular-nums mt-0.5">
                  {currentUser.phone} · {currentUser.email}
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="self-start sm:self-auto px-3.5 py-2 min-h-[38px] text-xs font-semibold text-slate-600 hover:text-[#0F172A] border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Вийти / Змінити</span>
              </button>
            </div>

            {/* Per-user History Stats & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs text-slate-600 tabular-nums">
                <span>
                  Усього: <strong className="text-[#0F172A]">{currentUser.loans.length}</strong>
                </span>
                <span>
                  Активні: <strong className="text-[#0F172A]">{activeLoansCount}</strong>
                </span>
                <span>
                  Погашені: <strong className="text-[#00A36C]">{repaidLoansCount}</strong>
                </span>
              </div>

              <div className="inline-flex items-center gap-1 p-1 bg-[#F8FAFC] border border-slate-200 rounded-lg self-start">
                {(
                  [
                    { key: 'all', label: 'Усі' },
                    { key: 'active', label: 'Активні' },
                    { key: 'repaid', label: 'Погашені' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setHistoryFilter(tab.key)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      historyFilter === tab.key
                        ? 'bg-white text-[#0F172A] shadow-xs'
                        : 'text-slate-500 hover:text-[#0F172A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User's Isolated Loan History */}
            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {filteredLoans.length === 0 ? (
                <div className="text-center py-8 bg-[#F8FAFC] border border-slate-200 rounded-xl px-4">
                  <p className="text-sm text-slate-600 mb-4">
                    {currentUser.loans.length === 0
                      ? 'Історія цього акаунта поки порожня. Оформіть першу позику в калькуляторі.'
                      : 'У цій категорії записів немає.'}
                  </p>
                  {currentUser.loans.length === 0 && (
                    <button
                      type="button"
                      onClick={onOpenCalculator}
                      className="px-4 py-2.5 min-h-[40px] bg-[#00B67A] hover:bg-[#009B68] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Оформити позику
                    </button>
                  )}
                </div>
              ) : (
                filteredLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="p-4 sm:p-5 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-slate-500">
                        <span className="font-mono font-semibold text-[#0F172A]">
                          {loan.contractNumber}
                        </span>
                        <span className="mx-1.5">·</span>
                        <span>від {loan.createdAt}</span>
                      </div>
                      {loan.status === 'active' ? (
                        <span className="text-xs font-semibold text-[#0F172A]">
                          Активний · Очікує повернення
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-[#00A36C] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          Погашено
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-[11px] text-slate-500">Сума</div>
                        <div className="font-bold text-[#0F172A] tabular-nums">
                          {formatCurrency(loan.amount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">До повернення</div>
                        <div className="font-bold text-[#0F172A] tabular-nums">
                          {formatCurrency(loan.totalRepayment)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Термін · Ставка</div>
                        <div className="text-slate-700 tabular-nums">
                          {loan.termDays} {pluralizeDays(loan.termDays)} · {loan.dailyRatePercent}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Дата повернення</div>
                        <div className="text-slate-700 tabular-nums">{loan.returnDateFormatted}</div>
                      </div>
                    </div>

                    {loan.status === 'active' && (
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-500 tabular-nums">
                          Картка •••• {loan.cardLast4}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRepayLoan(loan.id)}
                          className="px-4 py-2 min-h-[38px] bg-[#00B67A] hover:bg-[#009B68] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Погасити достроково
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
