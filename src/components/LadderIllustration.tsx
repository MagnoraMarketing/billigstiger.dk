import type { LadderType } from "@/lib/types";

/**
 * Original, generic SVG illustrations used as product/category visuals until
 * licensed supplier photos are added. No third-party imagery is used.
 */
export function LadderIllustration({ type, className = "" }: { type: LadderType | string; className?: string }) {
  const stroke = "#0f172a";
  const accent = "#f59e0b";
  const rungs = (x1: number, x2: number, y0: number, y1: number, n: number) =>
    Array.from({ length: n }, (_, i) => {
      const y = y0 + ((y1 - y0) * (i + 1)) / (n + 1);
      return <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke={accent} strokeWidth={5} strokeLinecap="round" />;
    });

  let content: React.ReactNode;
  switch (type) {
    case "trappestige":
    case "glasfiberstige":
    case "skammel": {
      const leg = type === "glasfiberstige" ? "#ea580c" : stroke;
      const h = type === "skammel" ? 70 : 150;
      content = (
        <>
          <line x1="70" y1={180 - h} x2="45" y2="180" stroke={leg} strokeWidth={7} strokeLinecap="round" />
          <line x1="110" y1={180 - h} x2="135" y2="180" stroke={leg} strokeWidth={7} strokeLinecap="round" />
          <line x1="70" y1={180 - h} x2="110" y2={180 - h} stroke={stroke} strokeWidth={9} strokeLinecap="round" />
          <line x1="110" y1={180 - h} x2="150" y2="180" stroke={leg} strokeWidth={6} strokeLinecap="round" />
          {Array.from({ length: type === "skammel" ? 1 : 4 }, (_, i) => {
            const n = type === "skammel" ? 2 : 5;
            const t = (i + 1) / n;
            const y = 180 - h + h * t;
            const x1 = 70 - 25 * t;
            const x2 = 110 + 25 * t;
            return <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke={accent} strokeWidth={5} strokeLinecap="round" />;
          })}
        </>
      );
      break;
    }
    case "platformsstige":
      content = (
        <>
          <line x1="60" y1="70" x2="40" y2="180" stroke={stroke} strokeWidth={7} strokeLinecap="round" />
          <line x1="120" y1="70" x2="140" y2="180" stroke={stroke} strokeWidth={7} strokeLinecap="round" />
          <rect x="55" y="62" width="70" height="10" rx="3" fill={stroke} />
          <path d="M60 62 V20 H125 V62" fill="none" stroke={stroke} strokeWidth={5} strokeLinejoin="round" />
          {rungs(45, 135, 72, 180, 4)}
          <circle cx="40" cy="183" r="6" fill={accent} />
          <circle cx="140" cy="183" r="6" fill={accent} />
        </>
      );
      break;
    case "rullestillads":
      content = (
        <>
          <rect x="45" y="30" width="90" height="145" fill="none" stroke={stroke} strokeWidth={6} />
          <line x1="45" y1="100" x2="135" y2="100" stroke={stroke} strokeWidth={6} />
          <line x1="45" y1="30" x2="135" y2="100" stroke={stroke} strokeWidth={3} />
          <line x1="45" y1="100" x2="135" y2="175" stroke={stroke} strokeWidth={3} />
          <rect x="40" y="24" width="100" height="10" fill={accent} />
          <circle cx="50" cy="182" r="7" fill={accent} />
          <circle cx="130" cy="182" r="7" fill={accent} />
        </>
      );
      break;
    case "tilbehoer":
      content = (
        <>
          <line x1="40" y1="150" x2="140" y2="150" stroke={stroke} strokeWidth={9} strokeLinecap="round" />
          <rect x="78" y="60" width="24" height="90" rx="4" fill="none" stroke={stroke} strokeWidth={6} />
          <circle cx="40" cy="150" r="8" fill={accent} />
          <circle cx="140" cy="150" r="8" fill={accent} />
        </>
      );
      break;
    case "skydestige":
    case "kombistige":
    case "teleskopstige":
    case "tagstige":
    case "enkeltstige":
    default: {
      const twoPart = type === "skydestige" || type === "kombistige";
      content = (
        <>
          <line x1="65" y1="15" x2="55" y2="180" stroke={stroke} strokeWidth={7} strokeLinecap="round" />
          <line x1="115" y1="15" x2="125" y2="180" stroke={stroke} strokeWidth={7} strokeLinecap="round" />
          {twoPart && (
            <>
              <line x1="72" y1="5" x2="66" y2="110" stroke={stroke} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
              <line x1="108" y1="5" x2="114" y2="110" stroke={stroke} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
            </>
          )}
          {rungs(60, 120, 15, 180, type === "teleskopstige" ? 9 : 7)}
          {type === "tagstige" && <path d="M65 15 q25 -20 50 0" fill="none" stroke={accent} strokeWidth={5} />}
          {twoPart && <line x1="30" y1="180" x2="150" y2="180" stroke={stroke} strokeWidth={7} strokeLinecap="round" />}
        </>
      );
    }
  }

  return (
    <svg viewBox="0 0 180 195" role="img" aria-hidden="true" className={className}>
      {content}
    </svg>
  );
}
