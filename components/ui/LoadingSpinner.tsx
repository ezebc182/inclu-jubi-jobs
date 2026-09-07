interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export function LoadingSpinner({ size = "md", message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4",
  };

  const textSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-primary-600 border-t-transparent dark:border-primary-400`}
        aria-hidden="true"
      />
      {message && (
        <p
          className={`${textSizeClasses[size]} font-semibold text-ink-soft`}
        >
          {message}
        </p>
      )}
      <span className="sr-only">{message || "Cargando..."}</span>
    </div>
  );
}
