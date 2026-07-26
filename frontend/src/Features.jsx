import React, { useState } from "react";
import { Brain, Code2, FileText, Image, Mic, Globe, Zap, Shield, ChevronDown } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Conversations",
    description: "Natural, context-aware chat powered by Gemini.",
    details: "Remembers context across turns and adapts tone to match the conversation.",
  },
  {
    icon: Code2,
    title: "Code Generation",
    description: "Write, debug, and explain code across languages.",
    details: "Supports syntax highlighting, inline fixes, and step-by-step explanations.",
  },
  {
    icon: FileText,
    title: "PDF Analysis",
    description: "Extract insights and summaries from documents instantly.",
    details: "Pulls key points, tables, and figures from long documents in seconds.",
  },
  {
    icon: Image,
    title: "Image Generation",
    description: "Create stunning visuals from simple text prompts.",
    details: "Fine-tune style, aspect ratio, and detail level to match your vision.",
  },
  {
    icon: Mic,
    title: "Voice Chat",
    description: "Talk naturally and get real-time spoken responses.",
    details: "Low-latency speech recognition with natural-sounding replies.",
  },
  {
    icon: Globe,
    title: "Multi Language",
    description: "Communicate fluently in dozens of languages.",
    details: "Auto-detects input language and replies in kind, no setup needed.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Near-instant responses, no matter the complexity.",
    details: "Optimized inference pipeline keeps latency low even under load.",
  },
  {
    icon: Shield,
    title: "Secure",
    description: "Your conversations stay private and protected.",
    details: "End-to-end encryption with no third-party data sharing.",
  },
];

function FeatureCard({ icon: Icon, title, description, details }) {
  const [open, setOpen] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border p-6 transition-colors duration-200 cursor-pointer ${
        open
          ? "border-amber-400/40 bg-[#0d0c16]"
          : "border-white/10 bg-[#0a0912] hover:border-amber-400/40"
      }`}
      onClick={() => setOpen((prev) => !prev)}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight overlay, follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), rgba(139,92,246,0.16), transparent 70%)",
        }}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex items-center justify-center h-11 w-11 rounded-full border border-violet-400/40 transition-colors duration-200 group-hover:border-cyan-400/60">
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

      <h3 className="relative mt-4 text-lg font-semibold text-white tracking-tight">
        {title}
      </h3>
      <div className="relative mt-2 h-px w-8 bg-amber-400/60" />
      <p className="relative mt-3 text-sm leading-relaxed text-gray-400">
        {description}
      </p>

      <div
        className={`relative grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm leading-relaxed text-gray-500 border-t border-white/10 pt-3">
            {details}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section
      className="relative overflow-hidden bg-[#05040a] py-20 px-6"
      style={{ fontFamily: '"Mulish", sans-serif' }}
    >
      {/* Grid background, fading from top-left */}
      <div
        className="pointer-events-none absolute inset-0"
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
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400/80 mb-3">
            Capabilities
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Everything you need, powered by AI
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto">
            Meena GPT brings together the tools you need in one seamless, intelligent interface.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}