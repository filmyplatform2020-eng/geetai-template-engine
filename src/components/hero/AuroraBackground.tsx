"use client"

export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="animate-aurora-slow absolute -left-[20%] -top-[20%] h-[80%] w-[80%] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--style-hero-from) 0%, var(--style-hero-via) 30%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="animate-aurora-medium absolute -right-[15%] top-[10%] h-[70%] w-[60%] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--style-hero-via) 0%, var(--style-hero-to) 35%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="animate-aurora-fast absolute -bottom-[10%] left-[20%] h-[60%] w-[70%] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--style-hero-to) 0%, var(--color-accent-light) 30%, transparent 60%)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="animate-aurora-slow absolute left-[40%] top-[30%] h-[50%] w-[50%] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-accent-soft) 0%, transparent 50%)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, var(--style-hero-from) 0%, transparent 50%)",
        }}
      />
    </div>
  )
}
