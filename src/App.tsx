import { useMemo, useState } from 'react';
import { AccountModal, AuthModalMode } from './components/AccountModal';
import { ApplicationModal } from './components/ApplicationModal';
import { FaqAccordion } from './components/FaqAccordion';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroCalculator } from './components/HeroCalculator';
import { HowItWorksSection } from './components/HowItWorksSection';
import { InfoModal, InfoModalType } from './components/InfoModal';
import { LoanRateOption, SimulatedLoan, UserAccount } from './types/loan';
import { calculateLoan, normalizePhoneDigits } from './utils/loanMath';
import {
  createNewUser,
  findDuplicateUser,
  findUserByCredentials,
  loadActiveUserId,
  loadUsers,
  saveActiveUserId,
  saveUsers,
} from './utils/userStore';

export default function App() {
  const [amount, setAmount] = useState<number>(20000);
  const [termDays, setTermDays] = useState<number>(14);
  const [dailyRate, setDailyRate] = useState<LoanRateOption>(0.1);

  const [users, setUsers] = useState<UserAccount[]>(() => loadUsers());
  const [activeUserId, setActiveUserId] = useState<string | null>(() => loadActiveUserId());

  const [isApplicationOpen, setIsApplicationOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);

  const currentUser = useMemo(
    () => users.find((u) => u.id === activeUserId) ?? null,
    [users, activeUserId]
  );

  const calculation = useMemo(
    () => calculateLoan(amount, termDays, dailyRate),
    [amount, termDays, dailyRate]
  );

  const persistUsers = (nextUsers: UserAccount[]) => {
    setUsers(nextUsers);
    saveUsers(nextUsers);
  };

  const setSessionUser = (userId: string | null) => {
    setActiveUserId(userId);
    saveActiveUserId(userId);
  };

  const openAuthModal = (mode: AuthModalMode) => {
    setAuthModalMode(mode);
    setIsAccountOpen(true);
  };

  const handleLogin = (identifier: string, password: string): string | null => {
    const found = findUserByCredentials(users, identifier, password);
    if (!found) {
      return 'Невірний email/телефон або пароль';
    }
    setSessionUser(found.id);
    return null;
  };

  const handleQuickSwitchUser = (userId: string) => {
    setSessionUser(userId);
  };

  const handleRegister = (payload: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
  }): string | null => {
    const duplicate = findDuplicateUser(users, payload.email, payload.phone);
    if (duplicate) {
      return 'Користувач із таким email або номером телефону вже існує';
    }
    const newUser = createNewUser(payload);
    const nextUsers = [newUser, ...users];
    persistUsers(nextUsers);
    setSessionUser(newUser.id);
    return null;
  };

  const handleLogout = () => {
    setSessionUser(null);
  };

  const handleApplicationApproved = (
    newLoan: SimulatedLoan,
    applicantInfo: {
      fullName: string;
      phone: string;
      email: string;
      password: string;
    }
  ) => {
    if (currentUser) {
      const nextUsers = users.map((u) =>
        u.id === currentUser.id ? { ...u, loans: [newLoan, ...u.loans] } : u
      );
      persistUsers(nextUsers);
    } else {
      const existing = users.find(
        (u) =>
          u.email.toLowerCase() === applicantInfo.email.trim().toLowerCase() ||
          normalizePhoneDigits(u.phone) === normalizePhoneDigits(applicantInfo.phone)
      );

      if (existing) {
        const nextUsers = users.map((u) =>
          u.id === existing.id ? { ...u, loans: [newLoan, ...u.loans] } : u
        );
        persistUsers(nextUsers);
        setSessionUser(existing.id);
      } else {
        const created = createNewUser({
          fullName: applicantInfo.fullName,
          phone: applicantInfo.phone,
          email: applicantInfo.email,
          password: applicantInfo.password,
          initialLoans: [newLoan],
        });
        persistUsers([created, ...users]);
        setSessionUser(created.id);
      }
    }

    setIsApplicationOpen(false);
    setAuthModalMode('login');
    setIsAccountOpen(true);
  };

  const handleRepayLoan = (loanId: string) => {
    if (!currentUser) return;
    const nextUsers = users.map((u) =>
      u.id === currentUser.id
        ? {
            ...u,
            loans: u.loans.map((loan) =>
              loan.id === loanId ? { ...loan, status: 'repaid' as const } : loan
            ),
          }
        : u
    );
    persistUsers(nextUsers);
  };

  const handleScrollToCalculator = () => {
    setIsAccountOpen(false);
    const calcEl = document.getElementById('calculator');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-white text-[#0F172A]">
      <Header
        currentUser={currentUser}
        onOpenLogin={() => openAuthModal('login')}
        onOpenRegister={() => openAuthModal('register')}
        onOpenAccount={() => openAuthModal('login')}
        onOpenRates={() => setInfoModalType('rates')}
      />

      <main className="flex-1">
        <HeroCalculator
          amount={amount}
          termDays={termDays}
          dailyRate={dailyRate}
          calculation={calculation}
          currentUser={currentUser}
          onAmountChange={setAmount}
          onTermChange={setTermDays}
          onRateChange={setDailyRate}
          onApply={() => setIsApplicationOpen(true)}
          onOpenLogin={() => openAuthModal('login')}
          onOpenRegister={() => openAuthModal('register')}
          onOpenAccount={() => openAuthModal('login')}
        />

        <HowItWorksSection />

        <FaqAccordion onContactTeam={() => setInfoModalType('contact')} />
      </main>

      <Footer onOpenLegal={(tab) => setInfoModalType(tab)} />

      <ApplicationModal
        isOpen={isApplicationOpen}
        calculation={calculation}
        currentUser={currentUser}
        onClose={() => setIsApplicationOpen(false)}
        onApproved={handleApplicationApproved}
      />

      <AccountModal
        isOpen={isAccountOpen}
        initialMode={authModalMode}
        currentUser={currentUser}
        allUsers={users}
        onClose={() => setIsAccountOpen(false)}
        onLogin={handleLogin}
        onQuickSwitchUser={handleQuickSwitchUser}
        onRegister={handleRegister}
        onLogout={handleLogout}
        onRepayLoan={handleRepayLoan}
        onOpenCalculator={handleScrollToCalculator}
      />

      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
        onUsePromoPreset={handleScrollToCalculator}
      />
    </div>
  );
}
