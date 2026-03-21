import Link from "next/link";
import { Scale } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-white to-surface">
      {/* Top-left branding */}
      <div className="absolute top-6 left-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white transition-colors group-hover:bg-primary-light">
            <Scale className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold text-primary tracking-tight">
            Atticus
          </span>
        </Link>
      </div>

      {/* Centred content */}
      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        {children}
      </div>
    </div>
  );
}
