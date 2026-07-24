import { useEffect, useRef, useState } from "react";

const DEMO_EXCHANGE = [
  {
    role: "user",
    text: "Can you summarize this contract in plain English?",
  },
  {
    role: "bot",
    text: "Sure — it's a 12-month lease, auto-renews unless you cancel 30 days in advance, and there's a $200 early termination fee.",
  },
  {
    role: "user",
    text: "How is the weather today?",
  },
  {
    role: "bot",
    text: "Today's weather is sunny with a high of 31°C and a low of 25°C. There's a light breeze and no significant chance of rain.",
  },
  {
    role: "user",
    text: "Explain recursion like I'm five.",
  },
  {
    role: "bot",
    text: "Imagine two mirrors facing each other. You keep seeing the same picture again and again. Recursion is when a function calls itself until it reaches a stopping point.",
  },
  {
    role: "user",
    text: "Write a Java function to reverse a string.",
  },
  {
    role: "bot",
    text: `public String reverse(String str) {
    return new StringBuilder(str).reverse().toString();
}`,
  },
  {
    role: "user",
    text: "What is the capital of Japan?",
  },
  {
    role: "bot",
    text: "The capital of Japan is Tokyo.",
  },
  {
    role: "user",
    text: "Suggest three healthy breakfast ideas.",
  },
  {
    role: "bot",
    text: "1. Oats with banana and peanut butter.\n2. Scrambled eggs with whole wheat toast.\n3. Greek yogurt with fruits and nuts.",
  },
  {
    role: "user",
    text: "Convert 25°C to Fahrenheit.",
  },
  {
    role: "bot",
    text: "25°C is equal to 77°F.",
  },
  {
    role: "user",
    text: "What's the difference between HTTP and HTTPS?",
  },
  {
    role: "bot",
    text: "HTTPS is the secure version of HTTP. It encrypts communication using SSL/TLS, making data transfer safe from interception.",
  },
  {
    role: "user",
    text: "Generate a professional email asking for leave.",
  },
  {
    role: "bot",
    text: "Subject: Leave Request\n\nDear Manager,\nI would like to request leave for tomorrow due to a personal commitment. I will ensure all pending work is completed before my absence.\n\nThank you for your understanding.\nBest regards.",
  },
  {
    role: "user",
    text: "Give me a motivational quote.",
  },
  {
    role: "bot",
    text: "Success doesn't come from what you do occasionally—it comes from what you do consistently.",
  },
];

function useTypewriter(active) {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    async function play() {
      setLines([]);
      for (const message of DEMO_EXCHANGE) {
        if (cancelled) return;
        await new Promise((r) =>
          setTimeout(r, message.role === "bot" ? 500 : 250),
        );
        let typed = "";
        setLines((prev) => [...prev, { role: message.role, text: "" }]);
        for (const char of message.text) {
          if (cancelled) return;
          typed += char;
          await new Promise((r) =>
            setTimeout(r, message.role === "bot" ? 14 : 22),
          );
          setLines((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: message.role, text: typed };
            return next;
          });
        }
      }
      await new Promise((r) => setTimeout(r, 2200));
      if (!cancelled) play();
    }

    play();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return lines;
}

export default function About() {
  const lines = useTypewriter(true);
  const scrollRef = useRef(null);

  // Ease the window down to the newest line instead of snapping to it.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [lines]);

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-[#0A0812] px-6 py-28 md:px-16"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#6C5CE7] opacity-10 blur-[140px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">
        {/* Copy */}
        <div>
          <span className="mb-5 inline-block rounded-full border border-white/10 px-4 py-1 font-mono text-xs tracking-wide text-[#FFB020]">
            WHAT IS MEENA
          </span>
          <h2 className="font-display text-4xl font-medium leading-tight tracking-tight text-white md:text-5xl">
            Not a search box.
            <br />A reasoning partner.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/60">
            Meena is a chatbot that shows its reasoning as it goes — reading
            your documents, weighing the details, and answering in plain
            language instead of burying you in caveats.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-8">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wide text-white/40">
                Response time
              </dt>
              <dd className="mt-2 font-display text-2xl text-white">
                &lt; 1.2s
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-wide text-white/40">
                Context window
              </dt>
              <dd className="mt-2 font-display text-2xl text-white">
                200K tokens
              </dd>
            </div>
          </dl>
        </div>

        {/* Live chat demo card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm md:p-8">
          <div className="mb-6 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B4A]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFB020]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#00D4FF]" />
            <span className="ml-3 font-mono text-xs text-white/40">
              Meena — new chat
            </span>
          </div>

          {/* Fixed-height scroll window: content builds up, then eases
              upward smoothly instead of jumping as new lines arrive. */}
          <div
            ref={scrollRef}
            className="flex h-[22rem] flex-col gap-3 overflow-y-auto scroll-smooth pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed transition-opacity duration-300 ${
                  line.role === "user"
                    ? "self-end bg-white/10 text-white"
                    : "self-start bg-gradient-to-br from-[#6C5CE7]/20 to-[#00D4FF]/10 text-white/90"
                }`}
              >
                {line.text}
                <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-white/50 align-middle" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
