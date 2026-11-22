import { useState } from 'react';
import { ArrowUpRight, Minus, Plus } from 'lucide-react';
import { FaqItem } from '../types/loan';

interface FaqAccordionProps {
  onContactTeam: () => void;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Хто може подати заявку на позику?',
    answer:
      'Ви повинні бути віком від 18 років, мати регулярний дохід та банківську картку. Кожна заявка в цьому навчальному прототипі імітує стандартну перевірку платоспроможності.',
  },
  {
    id: 'faq-2',
    question: 'Які відсоткові ставки доступні в калькуляторі?',
    answer:
      'Ви можете вибрати один із чотирьох тарифів: мінімальну ставку 0.1% на день, а також 1%, 1.5% або 2% на день. Переплата автоматично перераховується залежно від суми та терміну позики.',
  },
  {
    id: 'faq-3',
    question: 'На яку максимальну суму та термін можна оформити позику?',
    answer:
      'Калькулятор дозволяє обрати суму від 1 000 до 100 000 ₴ на термін від 5 до 90 днів із точним розрахунком дати повернення.',
  },
  {
    id: 'faq-4',
    question: 'Як зберігається історія позик для різних користувачів?',
    answer:
      'Кожен зареєстрований користувач має окремий обліковий запис зі своєю персональною історією активних та погашених договорів. Ви можете створити новий акаунт або перемикатися між тестовими профілями.',
  },
  {
    id: 'faq-5',
    question: 'Чи можу я погасити позику достроково?',
    answer:
      'Так, в особистому кабінеті будь-якого акаунта можна закрити активний договір достроково одним натисканням, після чого статус зміниться на погашений в історії цього користувача.',
  },
];

export function FaqAccordion({ onContactTeam }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="bg-[#F8FAFC]">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#00A36C] mb-2">
              Корисно знати
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
              Трохи ясності допомагає впевненості.
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Чесні відповіді без дрібного шрифту. Залишилися запитання? Ми готові допомогти.
            </p>

            <button
              type="button"
              onClick={onContactTeam}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#00A36C] hover:text-[#008A5C] transition-colors cursor-pointer"
            >
              <span>Зв&apos;язатися з командою</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {FAQ_ITEMS.map((item) => {
                const isOpen = openId === item.id;
                const panelId = `${item.id}-panel`;
                const buttonId = `${item.id}-button`;

                return (
                  <div key={item.id}>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                      className="w-full py-5 text-left flex items-center justify-between gap-4 hover:text-[#00A36C] transition-colors cursor-pointer"
                    >
                      <span className="font-display text-sm sm:text-base font-bold text-[#0F172A]">
                        {item.question}
                      </span>
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                      ) : (
                        <Plus className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                      )}
                    </button>

                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className="pb-5 pr-8 text-sm text-slate-600 leading-relaxed"
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
