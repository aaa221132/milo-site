import { useEffect } from 'react';
import { X } from 'lucide-react';
import { formatCurrency } from '../utils/loanMath';

export type InfoModalType = 'rates' | 'terms' | 'privacy' | 'contact' | null;

interface InfoModalProps {
  type: InfoModalType;
  onClose: () => void;
  onUsePromoPreset: () => void;
}

export function InfoModal({ type, onClose, onUsePromoPreset }: InfoModalProps) {
  useEffect(() => {
    if (!type) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  const titles: Record<Exclude<InfoModalType, null>, string> = {
    rates: 'Умови та ставки',
    terms: 'Умови користування (макет)',
    privacy: 'Політика конфіденційності',
    contact: 'Зв’язок із командою',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <h2 id="info-modal-title" className="font-display text-lg font-bold text-[#0F172A]">
            {titles[type]}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрити вікно"
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-slate-600 leading-relaxed">
          {type === 'rates' && (
            <>
              <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Мінімальна ставка</span>
                  <span className="font-bold text-[#00A36C] tabular-nums">0.1% на день</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Доступні тарифи</span>
                  <span className="font-bold text-[#0F172A] tabular-nums">0.1% / 1% / 1.5% / 2%</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Діапазон суми</span>
                  <span className="font-semibold text-[#0F172A] tabular-nums">
                    {formatCurrency(1000)} – {formatCurrency(100000)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Термін користування</span>
                  <span className="font-semibold text-[#0F172A] tabular-nums">5 – 90 днів</span>
                </div>
              </div>
              <p>
                Вимоги до позичальника в навчальному макеті: вік від 18 до 75 років, ID-картка або паспорт та активна банківська картка.
              </p>
              <button
                type="button"
                onClick={() => {
                  onUsePromoPreset();
                  onClose();
                }}
                className="w-full min-h-[44px] px-4 py-2.5 bg-[#00B67A] hover:bg-[#009B68] text-white font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Перейти до калькулятора
              </button>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                Цей веб-застосунок є навчальним студентським проєктом з UI/UX-дизайну та frontend-розробки. Він не є фінансовою компанією та не надає реальних кредитних послуг.
              </p>
              <p>
                Усі акаунти, суми, договори та статуси схвалення зберігаються локально у вашому браузері виключно для демонстрації інтерфейсу.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>
                Прототип не передає персональних або платіжних даних на зовнішні сервери. Інформація про створені облікові записи та позики зберігається лише локально у вашому браузері (localStorage).
              </p>
              <p>
                Під час тестування рекомендується використовувати функцію автозаповнення або вигадані дані.
              </p>
            </>
          )}

          {type === 'contact' && (
            <>
              <p>
                Навчальна команда підтримки прототипу <strong>milo.</strong>:
              </p>
              <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-2 text-xs sm:text-sm tabular-nums">
                <div>Email: hello@milo-edu.example</div>
                <div>Телефон (макет): +380 (800) 000-00-00</div>
                <div>Адреса: м. Київ, вул. Навчальна, 1</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
