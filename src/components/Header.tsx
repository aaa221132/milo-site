import { useState } from 'react';
import { Menu, User, X } from 'lucide-react';
import { UserAccount } from '../types/loan';

interface HeaderProps {
  currentUser: UserAccount | null;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAccount: () => void;
  onOpenRates: () => void;
}

export function Header({
  currentUser,
  onOpenLogin,
  onOpenRegister,
  onOpenAccount,
  onOpenRates,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const firstName = currentUser ? currentUser.fullName.split(/\s+/)[1] || currentUser.fullName.split(/\s+/)[0] : '';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand wordmark */}
        <a
          href="#top"
          className="font-display text-2xl font-extrabold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00B67A] rounded"
        >
          milo.
        </a>

        {/* Zone 2: Navigation links */}
        <nav aria-label="Основна навігація" className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Як це працює
          </a>
          <button
            type="button"
            onClick={onOpenRates}
            className="text-sm font-medium text-slate-600 hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer"
          >
            Умови та ставки
          </button>
          <a
            href="#faq"
            className="text-sm font-medium text-slate-600 hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Часті питання
          </a>
        </nav>

        {/* Zone 3: Auth / Account action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {currentUser ? (
            <button
              type="button"
              onClick={onOpenAccount}
              className="px-4 py-2 min-h-[38px] text-sm font-semibold text-[#0F172A] bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00B67A]"
            >
              <User className="w-4 h-4 text-[#00A36C]" aria-hidden="true" />
              <span>{firstName} · Історія ({currentUser.loans.length})</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-3.5 py-2 min-h-[38px] text-sm font-semibold text-[#0F172A] bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00B67A]"
              >
                Увійти
              </button>
              <button
                type="button"
                onClick={onOpenRegister}
                className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 min-h-[38px] text-sm font-semibold text-white bg-[#00B67A] hover:bg-[#009B68] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00B67A]"
              >
                Реєстрація
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Мобільна навігація"
          className="md:hidden bg-white border-t border-slate-100 px-4 py-3 flex flex-col gap-1"
        >
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 min-h-[44px] flex items-center text-sm font-medium text-slate-700 hover:text-[#0F172A] hover:bg-slate-50 rounded-lg transition-colors"
          >
            Як це працює
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRates();
            }}
            className="px-3 py-2.5 min-h-[44px] flex items-center text-left text-sm font-medium text-slate-700 hover:text-[#0F172A] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            Умови та ставки
          </button>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 min-h-[44px] flex items-center text-sm font-medium text-slate-700 hover:text-[#0F172A] hover:bg-slate-50 rounded-lg transition-colors"
          >
            Часті питання
          </a>
          {!currentUser && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="mt-1 px-3 py-2.5 min-h-[44px] flex items-center justify-center text-sm font-semibold text-white bg-[#00B67A] rounded-lg"
            >
              Реєстрація акаунта
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
