"use client"

export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="animate-aurora-slow absolute -left-[20%] -top-[20%] h-[80%] w-[80%] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(108,92,231,0.25) 0%, rgba(108,92,231,0.08) 30%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />

      <div
        className="animate-aurora-medium absolute -right-[15%] top-[10%] h-[70%] w-[60%] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.06) 35%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      <div
        className="animate-aurora-fast absolute -bottom-[10%] left-[20%] h-[60%] w-[70%] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(167,139,250,0.2) 0%, rgba(167,139,250,0.05) 30%, transparent 60%)",
          filter: "blur(90px)",
        }}
      />

      <div
        className="animate-aurora-slow absolute left-[40%] top-[30%] h-[50%] w-[50%] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 50%)",
          filter: "blur(120px)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(108,92,231,0.03) 0%, transparent 50%)",
        }}
      />
    </div>
  )
}
