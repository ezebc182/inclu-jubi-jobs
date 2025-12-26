import Link from "next/link";

interface BigCTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export function BigCTAButton({
  href,
  children,
  variant = "primary",
  onClick,
}: BigCTAButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center min-h-[48px] px-8 py-4 text-lg font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-4";
  const variantClasses =
    variant === "primary"
      ? "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600"
      : "bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-300 dark:bg-secondary-400 dark:hover:bg-secondary-500";

  if (onClick) {
    return (
      <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </Link>
  );
}
