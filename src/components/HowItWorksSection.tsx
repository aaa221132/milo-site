import { CreditCard, FileText, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Налаштуйте під себе',
    description: 'Оберіть зручну суму та дату повернення відповідно до вашого бюджету.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Швидка й чесна перевірка',
    description: 'Подайте заявку онлайн із паспортом та даними картки. Рішення орієнтовно за 5 хвилин.',
    icon: ShieldCheck,
  },
  {
    number: '03',
    title: 'Повертайтесь до справ',
    description: 'Підтвердіть умови, і ми перекажемо кошти безпосередньо на ваш банківський рахунок.',
    icon: CreditCard,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white border-b border-slate-100">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-16 lg:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#00A36C] mb-2">
              Простий підхід
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Менше паперів. Більше життя.
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            Три прості кроки. На одну турботу менше.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#E6F7F1] text-[#00A36C] flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-medium text-slate-400 tabular-nums">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#0F172A] mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
