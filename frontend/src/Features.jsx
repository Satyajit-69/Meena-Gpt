
import React, { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Brain,
  Code2,
  FileText,
  Image,
  Mic,
  Globe,
  Zap,
  Shield,
  ChevronDown,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// FEATURES
const features = [
  {
    icon: Brain,
    title: "AI Conversations",
    description: "Natural, context-aware chat powered by AI.",
    details:
      "Remembers context across turns and adapts tone to match the conversation.",
  },
  {
    icon: Code2,
    title: "Code Generation",
    description: "Write, debug, and explain code across languages.",
    details:
      "Supports syntax highlighting, inline fixes, and step-by-step explanations.",
  },
  {
    icon: FileText,
    title: "PDF Analysis",
    description: "Extract insights and summaries from documents instantly.",
    details:
      "Pulls key points, tables, and figures from long documents in seconds.",
  },
  {
    icon: Image,
    title: "Image Generation",
    description: "Create stunning visuals from simple text prompts.",
    details:
      "Fine-tune style, aspect ratio, and detail level to match your vision.",
  },
  {
    icon: Mic,
    title: "Voice Chat",
    description: "Talk naturally and get real-time spoken responses.",
    details:
      "Low-latency speech recognition with natural-sounding replies.",
  },
  {
    icon: Globe,
    title: "Multi Language",
    description: "Communicate fluently in dozens of languages.",
    details:
      "Auto-detects input language and replies in kind, no setup needed.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get fast responses to your questions.",
    details:
      "Designed to deliver helpful answers with minimal waiting.",
  },
  {
    icon: Shield,
    title: "Secure",
    description: "Your conversations stay private and protected.",
    details:
      "Use secure authentication and responsible data-handling practices.",
  },
];

// TECHNOLOGY STACK — ACTUAL COMPANY LOGOS
const techStack = [
  {
    name: "Node.js",
    role: "Runtime",
    logo: "https://cdn.simpleicons.org/nodedotjs/339933",
  },
  {
    name: "React",
    role: "Frontend",
    logo: "https://cdn.simpleicons.org/react/61DAFB",
  },
  {
    name: "Tailwind CSS",
    role: "Styling",
    logo: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
  },
  {
    name: "OpenAI",
    role: "AI Engine",
    logo: "https://cdn.simpleicons.org/openai/FFFFFF",
  },
  {
    name: "Express",
    role: "Backend",
    logo: "https://cdn.simpleicons.org/express/FFFFFF",
  },
  {
    name: "MongoDB",
    role: "Database",
    logo: "https://cdn.simpleicons.org/mongodb/47A248",
  },
  {
    name: "JWT",
    role: "Authentication",
    logo: "https://cdn.simpleicons.org/jsonwebtokens/FFFFFF",
  },
];

// FEATURE CARD
function FeatureCard({ icon: Icon, title, description, details }) {
  const [open, setOpen] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    e.currentTarget.style.setProperty(
      "--x",
      `${e.clientX - rect.left}px`
    );

    e.currentTarget.style.setProperty(
      "--y",
      `${e.clientY - rect.top}px`
    );
  };

  const handleToggle = () => {
    setOpen((prev) => !prev);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  };

  return (
    <div
      className={`feat-card group relative cursor-pointer overflow-hidden rounded-lg border p-6 transition-colors duration-200 ${
        open
          ? "border-amber-400/40 bg-[#0d0c16]"
          : "border-white/10 bg-[#0a0912] hover:border-amber-400/40"
      }`}
      onClick={handleToggle}
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), rgba(139,92,246,0.16), transparent 70%)",
        }}
      />

      <div className="relative flex items-start justify-between">
        <div className="feat-icon flex h-11 w-11 items-center justify-center rounded-full border border-violet-400/40 transition-colors duration-200 group-hover:border-cyan-400/60">
          <Icon
            className="h-5 w-5 text-violet-300 transition-colors duration-200 group-hover:text-cyan-300"
            strokeWidth={1.75}
          />
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
            open ? "rotate-180 text-amber-400" : ""
          }`}
        />
      </div>

      <h3 className="relative mt-4 text-lg font-semibold tracking-tight text-white">
        {title}
      </h3>

      <div className="feat-line relative mt-2 h-px w-8 origin-left bg-amber-400/60" />

      <p className="relative mt-3 text-sm leading-relaxed text-gray-400">
        {description}
      </p>

      <div
        className={`relative grid transition-all duration-300 ease-in-out ${
          open
            ? "mt-3 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="border-t border-white/10 pt-3 text-sm leading-relaxed text-gray-500">
            {details}
          </p>
        </div>
      </div>
    </div>
  );
}

// TECHNOLOGY STACK — NO FLOATING ANIMATION
function TechStack() {
  return (
    <div className="mt-24">
      <div className="tech-head mb-10 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-amber-400/80">
          Technology
        </p>

        <h2 className="text-3xl font-bold text-white md:text-4xl">
          Built with a modern stack
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-gray-400">
          Reliable, scalable tools working together under the hood.
        </p>
      </div>

      <div className="tech-grid grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {techStack.map(({ name, role, logo }) => (
          <div
            key={name}
            className="tech-item flex flex-col items-center rounded-lg border border-white/10 bg-[#0a0912] p-5 text-center transition-colors duration-200 hover:border-amber-400/40"
          >
            <div className="flex h-12 w-12 items-center justify-center">
              <img
                src={logo}
                alt={`${name} logo`}
                loading="lazy"
                decoding="async"
                className="h-9 w-9 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <h4 className="mt-3 text-sm font-semibold text-white">
              {name}
            </h4>

            <p className="mt-1 text-xs text-gray-500">{role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// MAIN COMPONENT
export default function Features() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // Section heading animation
        gsap.from(".feat-head > *", {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".feat-head",
            start: "top 85%",
            once: true,
          },
        });

        // Feature cards reveal
        gsap.set(".feat-card", {
          opacity: 0,
          y: 30,
        });

        ScrollTrigger.batch(".feat-card", {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
              overwrite: true,
            }),
        });

        // Accent lines
        gsap.from(".feat-line", {
          scaleX: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".feat-grid",
            start: "top 80%",
            once: true,
          },
        });

        // Static grid background; no parallax
        // Technology heading
        gsap.from(".tech-head > *", {
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".tech-head",
            start: "top 85%",
            once: true,
          },
        });

        // Technology cards reveal without bounce or floating
        gsap.from(".tech-item", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".tech-grid",
            start: "top 88%",
            once: true,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#05040a] px-4 py-16 sm:px-6 sm:py-20"
      style={{ fontFamily: '"Mulish", sans-serif' }}
    >
      {/* Background grid */}
      <div
        className="feat-bg pointer-events-none absolute inset-x-0 -top-[15%] h-[130%]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(circle at top left, black 0%, transparent 60%)",
          WebkitMaskImage:
            "radial-gradient(circle at top left, black 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Features heading */}
        <div className="feat-head mb-12 text-center sm:mb-14">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-amber-400/80">
            Capabilities
          </p>

          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Everything you need, powered by AI
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            Meena GPT brings together the tools you need in one seamless,
            intelligent interface.
          </p>
        </div>

        {/* Feature cards */}
        <div className="feat-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        {/* Company technology logos */}
        <TechStack />
      </div>
    </section>
  );
}
