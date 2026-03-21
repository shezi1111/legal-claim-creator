import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8",
        className
      )}
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-text-light">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
