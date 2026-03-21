"use client";

import { cn } from "@/lib/utils/cn";

interface BreakdownItem {
  label: string;
  score: number;
}

interface StrengthMeterProps {
  score: number;
  breakdown?: BreakdownItem[];
  size?: "sm" | "md" | "lg";
}

function getScoreColor(score: number): string {
  if (score >= 67) return "text-success";
  if (score >= 34) return "text-warning";
  return "text-danger";
}

function getScoreLabel(score: number): string {
  if (score >= 67) return "Strong";
  if (score >= 34) return "Moderate";
  return "Weak";
}

function getBarColor(score: number): string {
  if (score >= 67) return "bg-success";
  if (score >= 34) return "bg-warning";
  return "bg-danger";
}

function getArcColor(score: number): string {
  if (score >= 67) return "#10B981";
  if (score >= 34) return "#F59E0B";
  return "#EF4444";
}

export function StrengthMeter({
  score,
  breakdown = [
    { label: "Facts", score: Math.min(100, score + 10) },
    { label: "Evidence", score: Math.max(0, score - 5) },
    { label: "Legal Basis", score: Math.min(100, score + 5) },
    { label: "Remedy Likelihood", score: Math.max(0, score - 10) },
  ],
  size = "md",
}: StrengthMeterProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  // SVG arc calculation
  const radius = size === "sm" ? 50 : size === "md" ? 70 : 90;
  const strokeWidth = size === "sm" ? 8 : size === "md" ? 10 : 12;
  const center = radius + strokeWidth;
  const svgSize = (radius + strokeWidth) * 2;

  // Semi-circle arc path
  const startAngle = Math.PI;
  const endAngle = 0;
  const progressAngle = startAngle - (clampedScore / 100) * Math.PI;

  const arcStart = {
    x: center + radius * Math.cos(startAngle),
    y: center + radius * Math.sin(startAngle),
  };
  const arcEnd = {
    x: center + radius * Math.cos(endAngle),
    y: center + radius * Math.sin(endAngle),
  };
  const arcProgress = {
    x: center + radius * Math.cos(progressAngle),
    y: center + radius * Math.sin(progressAngle),
  };

  const largeArcFlag = clampedScore > 50 ? 1 : 0;

  const bgPath = `M ${arcStart.x} ${arcStart.y} A ${radius} ${radius} 0 1 1 ${arcEnd.x} ${arcEnd.y}`;
  const progressPath = `M ${arcStart.x} ${arcStart.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${arcProgress.x} ${arcProgress.y}`;

  const fontSize = size === "sm" ? "text-2xl" : size === "md" ? "text-4xl" : "text-5xl";
  const labelSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex flex-col items-center">
      {/* Arc gauge */}
      <div className="relative" style={{ width: svgSize, height: center + 10 }}>
        <svg
          width={svgSize}
          height={center + 10}
          viewBox={`0 0 ${svgSize} ${center + 10}`}
        >
          {/* Background arc */}
          <path
            d={bgPath}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Progress arc */}
          {clampedScore > 0 && (
            <path
              d={progressPath}
              fill="none"
              stroke={getArcColor(clampedScore)}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Score number */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-0"
          style={{ height: center + 10 }}
        >
          <span className={cn("font-bold", fontSize, getScoreColor(clampedScore))}>
            {clampedScore}
          </span>
          <span className={cn("font-medium", labelSize, getScoreColor(clampedScore))}>
            {getScoreLabel(clampedScore)}
          </span>
        </div>
      </div>

      {/* Breakdown bars */}
      {breakdown.length > 0 && size !== "sm" && (
        <div className="w-full mt-6 space-y-3">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-text-light">
                  {item.label}
                </span>
                <span className="text-xs font-semibold text-text">{item.score}%</span>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", getBarColor(item.score))}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
