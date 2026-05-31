import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Slide = {
  kicker?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  visual?: () => React.ReactNode;
};

const A = ({ children }: { children: React.ReactNode }) => (
  <span className="accent-word">{children}</span>
);

/* ——— Visual demos (monochrome, minimal) ——— */

const VisualBrain = () => (
  <div className="mt-12 flex items-center justify-center gap-6 md:gap-10">
    {["Думает", "Решает", "Делает"].map((t, idx) => (
      <motion.div
        key={t}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + idx * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-3"
      >
        <div className="orb size-20 md:size-28" />
        <div className="text-base md:text-lg opacity-80">{t}</div>
      </motion.div>
    ))}
  </div>
);

const VisualChatVsAgent = () => (
  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
    {[
      { t: "Обычный ИИ", d: "«Расскажи рецепт борща»", tag: "Отвечает" },
      { t: "ИИ-агент", d: "«Закажи продукты и приготовь меню»", tag: "Делает" },
    ].map((c, idx) => (
      <motion.div
        key={c.t}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 + idx * 0.12, duration: 0.7 }}
        className="glass rounded-3xl p-7"
      >
        <div className="text-xs uppercase tracking-[0.25em] opacity-50 mb-3">{c.tag}</div>
        <div className="text-2xl md:text-3xl text-display">{c.t}</div>
        <div className="mt-3 text-base md:text-lg opacity-70">{c.d}</div>
      </motion.div>
    ))}
  </div>
);

const VisualSteps = () => (
  <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2">
    {["Задача", "План", "Действия", "Результат"].map((t, i) => (
      <div key={t} className="flex items-center gap-3 md:gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
          className="glass-soft rounded-full px-5 py-2.5 text-base md:text-lg"
        >
          {t}
        </motion.div>
        {i < 3 && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 0.5, width: 24 }}
            transition={{ delay: 0.55 + i * 0.15, duration: 0.5 }}
            className="h-px bg-white/40 hidden md:block"
          />
        )}
      </div>
    ))}
  </div>
);

const VisualOpenClaw = () => (
  <div className="mt-10 flex flex-wrap justify-center gap-3">
    {["Без кода", "Шаблоны", "В браузере", "Безопасно", "За минуты"].map((t, i) => (
      <motion.span
        key={t}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 + i * 0.08, duration: 0.5 }}
        className="glass-soft px-5 py-2 rounded-full text-base"
      >
        {t}
      </motion.span>
    ))}
  </div>
);

const VisualExample = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.45, duration: 0.7 }}
    className="mt-10 glass rounded-3xl p-7 md:p-9 max-w-2xl mx-auto text-left"
  >
    <div className="text-xs uppercase tracking-[0.25em] opacity-50 mb-3">Запрос</div>
    <div className="text-xl md:text-2xl text-display leading-snug">
      «Найди билеты в Сочи на июль, сравни три варианта и пришли лучший»
    </div>
    <div className="mt-6 flex flex-wrap gap-2 text-sm opacity-80">
      {["открывает сайты", "сравнивает цены", "присылает ответ"].map((t) => (
        <span key={t} className="glass-soft rounded-full px-3 py-1">→ {t}</span>
      ))}
    </div>
  </motion.div>
);

const VisualDemo = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="mt-12 flex flex-col items-center gap-5"
  >
    <div className="relative">
      <div className="orb size-32 md:size-40" />
      <motion.div
        className="absolute inset-0 rounded-full border border-white/30"
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
    <div className="text-sm uppercase tracking-[0.35em] opacity-60">live demo →</div>
  </motion.div>
);

/* ——— Slides ——— */

const slides: Slide[] = [
  {
    kicker: "Презентация",
    title: (
      <>
        Что такое <A>ИИ-агент</A>
        <br /> и при чём тут <A>OpenClaw</A>
      </>
    ),
    body: "Простыми словами — о технологии, которая уже меняет нашу жизнь.",
  },
  {
    kicker: "Сначала самое простое",
    title: <>Что такое <A>ИИ</A>?</>,
    body: "ИИ — искусственный интеллект. Программа, которая учится на примерах и принимает решения: понимает речь, пишет тексты, отвечает на вопросы — почти как человек.",
  },
  {
    kicker: "Главная идея",
    title: <>А <A>ИИ-агент</A> — это…</>,
    body: "Это ИИ, который не просто отвечает, а действует сам. Получил цель — и шаг за шагом её достигает.",
    visual: VisualBrain,
  },
  {
    kicker: "Как он работает",
    title: <>Четыре <A>шага</A></>,
    body: "Любой агент действует по одной простой схеме.",
    visual: VisualSteps,
  },
  {
    kicker: "Аналогия",
    title: <>Собеседник <A>или</A> сотрудник?</>,
    visual: VisualChatVsAgent,
  },
  {
    kicker: "Знакомство",
    title: <>А что такое <A>OpenClaw</A>?</>,
    body: "Платформа, на которой обычный человек может собрать своего ИИ-агента — без программирования.",
    visual: VisualOpenClaw,
  },
  {
    kicker: "Пример из жизни",
    title: <>Как это <A>выглядит</A></>,
    visual: VisualExample,
  },
  {
    kicker: "Зачем это нам",
    title: <>Почему это <A>важно</A></>,
    body: "ИИ-агенты берут на себя рутину. У человека остаётся главное — думать, творить, общаться с близкими.",
  },
  {
    kicker: "А теперь",
    title: <>Покажу <A>вживую</A>, как это работает</>,
    body: "Несколько секунд — и вы увидите своего первого агента.",
    visual: VisualDemo,
  },
];

/* ——— Liquid transitions ——— */

const variants = {
  enter: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? 60 : -60,
    scale: 0.96,
    filter: "blur(24px)",
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? -40 : 40,
    scale: 0.98,
    filter: "blur(24px)",
  }),
};

export default function Presentation() {
  const [[i, dir], setState] = useState<[number, number]>([0, 1]);

  const go = useCallback((n: number) => {
    setState(([cur]) => {
      const next = Math.max(0, Math.min(slides.length - 1, n));
      return [next, next > cur ? 1 : -1];
    });
  }, []);

  const next = useCallback(() => go(i + 1), [go, i]);
  const prev = useCallback(() => go(i - 1), [go, i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") next();
      else if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const s = slides[i];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <div className="aurora" />

      {/* Top counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 glass-soft rounded-full px-4 py-2">
        <span className="text-[11px] tracking-[0.3em] uppercase opacity-70">
          {String(i + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* Side arrows (desktop) */}
      <button
        onClick={prev}
        disabled={i === 0}
        className="hidden md:grid absolute left-6 top-1/2 -translate-y-1/2 z-20 glass-soft size-14 rounded-full place-items-center disabled:opacity-20 hover:scale-110 hover:bg-white/10 transition-all duration-500"
        aria-label="Назад"
      >
        <ArrowLeft className="size-5" />
      </button>
      <button
        onClick={next}
        disabled={i === slides.length - 1}
        className="hidden md:grid absolute right-6 top-1/2 -translate-y-1/2 z-20 glass-soft size-14 rounded-full place-items-center disabled:opacity-20 hover:scale-110 hover:bg-white/10 transition-all duration-500"
        aria-label="Вперёд"
      >
        <ArrowRight className="size-5" />
      </button>

      {/* Slide */}
      <div className="relative z-10 h-full w-full flex items-center justify-center px-5 md:px-24">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={i}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl"
          >
            <div className="glass shine rounded-[2rem] md:rounded-[2.5rem] p-7 md:p-16 text-center">
              {s.kicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                  className="text-[10px] md:text-xs uppercase tracking-[0.35em] mb-5 md:mb-6"
                >
                  {s.kicker}
                </motion.div>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.28, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl"
              >
                {s.title}
              </motion.h1>
              {s.body && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 0.82, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.8 }}
                  className="mt-6 md:mt-8 text-base md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
                >
                  {s.body}
                </motion.p>
              )}
              {s.visual && s.visual()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button
          onClick={prev}
          disabled={i === 0}
          className="md:hidden glass-soft size-11 rounded-full grid place-items-center disabled:opacity-20 transition-all duration-500"
          aria-label="Назад"
        >
          <ArrowLeft className="size-5" />
        </button>

        <div className="glass-soft rounded-full px-4 py-3 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => go(idx)}
              className={`dot ${idx === i ? "active" : ""}`}
              aria-label={`Слайд ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={i === slides.length - 1}
          className="md:hidden glass-soft size-11 rounded-full grid place-items-center disabled:opacity-20 transition-all duration-500"
          aria-label="Вперёд"
        >
          <ArrowRight className="size-5" />
        </button>
      </div>

      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 text-[9px] uppercase tracking-[0.35em] opacity-30">
        ← → пробел
      </div>
    </div>
  );
}
