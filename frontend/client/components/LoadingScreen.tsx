import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

export default function LoadingScreen() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#0D0D0F] to-[#1A1A1D] flex flex-col items-center justify-center overflow-hidden z-50">
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-primary animate-float-up"
            style={{
              left: `${particle.left}%`,
              top: "60%",
              animation: `float-up ${particle.duration}s ease-out ${particle.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Emblem container */}
        <div className="relative w-48 h-48">
          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-rotate-ring" />

          {/* Second ring */}
          <div
            className="absolute inset-0 rounded-full border border-transparent border-b-primary border-l-primary"
            style={{
              animation: "rotate-ring 4s linear reverse infinite",
            }}
          />

          {/* Center emblem */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-2 border-primary/40 flex items-center justify-center animate-glow-pulse">
            <div className="text-center">
              <div className="text-5xl mb-2">⚔️</div>
              <p className="text-primary font-bold text-sm">DARK HUNTERS</p>
            </div>
          </div>

          {/* Pulsing glow behind */}
          <div
            className="absolute inset-0 rounded-full bg-primary/5 blur-2xl"
            style={{
              animation: "glow-pulse 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Loading bar */}
        <div className="w-96 mt-8">
          <div className="relative h-2 bg-[#2A2A2D] rounded-full overflow-hidden border border-primary/30 glow-gold">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-secondary animate-loading-bar"
              style={{
                animation: "loading-bar-fill 2.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center mt-6">
          <p className="text-white text-lg font-semibold drop-shadow-lg">
            Loading<span className="animate-pulse">...</span>
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Preparing your gaming dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
