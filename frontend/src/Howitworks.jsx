
const STEPS = [
  {
    number: "01",
    label: "Listen",
    title: "Takes in the full picture",
    description:
      "Lumen reads your message alongside any attached files, past turns, and context you've given it — not just the last line you typed.",
  },
  {
    number: "02",
    label: "Reason",
    title: "Works through it in the open",
    description:
      "Instead of jumping to an answer, it breaks the problem down, checks its own reasoning, and flags where it's uncertain.",
  },
  {
    number: "03",
    label: "Respond",
    title: "Answers in plain language",
    description:
      "You get a direct, human-readable answer — with the reasoning available if you want to check its work.",
  },
];

export default function HowItWorks() {
  return (
    <main
      id="how-it-works"
      className="relative w-full overflow-hidden bg-[#0A0812] px-6 py-28 md:px-16"
    >
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#00D4FF] opacity-10 blur-[140px]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="max-w-xl">
          <span className="mb-5 inline-block rounded-full border border-white/10 px-4 py-1 font-mono text-xs tracking-wide text-[#6C5CE7]">
            HOW IT WORKS
          </span>
          <h2 className="font-display text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl">
            Every message, three stages.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="group relative bg-[#0A0812] p-8 transition-colors duration-300 hover:bg-white/[0.03] md:p-10"
            >
              <span className="font-display text-sm text-white/30">
                {step.number}
              </span>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[#00D4FF]">
                {step.label}
              </p>
              <h3 className="mt-3 font-display text-xl font-medium text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {step.description}
              </p>

              {/* connecting line to next step, desktop only */}
              <div className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-8 -translate-y-1/2 translate-x-full bg-gradient-to-r from-white/20 to-transparent md:block last:hidden" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}