interface FooterProps {
  onOpenLegal: (tab: 'terms' | 'privacy' | 'contact') => void;
}

export function Footer({ onOpenLegal }: FooterProps) {
  return (
    <footer className="bg-[#0B121E] text-slate-400">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-12 lg:py-14">
        {/* Top Row: Brand & Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="font-display text-xl font-extrabold text-white tracking-tight">
              milo.
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Трохи допомоги. Ясніше майбутнє.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Умови користування
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Політика конфіденційності
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Контакти
            </button>
          </div>
        </div>

        {/* Middle Row: Responsible Borrowing & Academic Disclaimer */}
        <div className="py-8 space-y-2.5 text-xs leading-relaxed">
          <p className="text-slate-200 font-semibold">
            Позичайте розумно. Обмірковуйте рішення.
          </p>
          <p className="text-slate-400 max-w-4xl">
            Позичайте лише ту суму, яку зможете комфортно повернути. Прострочені платежі можуть призвести до додаткових нарахувань та вплинути на кредитну історію. Якщо ви відчуваєте фінансові труднощі, зверніться до незалежного консультанта.
          </p>
          <p className="text-slate-500 max-w-4xl">
            Показовий приклад: позика 10 000 ₴ на 14 днів під мінімальну ставку 0.1% на день — відсотки 140 ₴, разом до повернення 10 140 ₴. Доступні суми від 1 000 до 100 000 ₴ на термін до 90 днів зі ставками 0.1%, 1%, 1.5% або 2% на день. Цей інтерфейс є студентським навчальним UI/UX-прототипом.
          </p>
        </div>

        {/* Bottom Row */}
        <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} milo. Навчальний концепт-сервіс; не є кредитною офертою.</span>
          <span>Українська · UAH ₴</span>
        </div>
      </div>
    </footer>
  );
}
