import Link from "next/link";
import { LineIcon, type IconName } from "@/components/ui/LineIcon";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  /** Icono de refuerzo. Sin él el bloque queda solo con texto, que también
   *  es una opción válida cuando el mensaje se explica solo. */
  icon?: IconName;
  /** Segunda salida, para cuando la primera puede no servir. */
  secondaryLabel?: string;
  secondaryHref?: string;
}

/**
 * Estado vacío.
 *
 * Dos correcciones sobre la versión anterior:
 *
 * 1. El fondo era `dark:bg-primary-700`. En modo oscuro `--brand-700` es un
 *    azul claro, así que el panel se aclaraba mientras el texto `ink-soft`
 *    también se aclaraba: texto casi invisible. Ahora sale de `surface`, que
 *    se redefine junto con el texto y no puede desincronizarse.
 *
 * 2. El título iba en `text-ink-soft`, el mismo tono que la descripción, así
 *    que no había jerarquía. Va en `ink`.
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center rounded-lg border border-dashed border-rule bg-surface p-8 text-center">
      {icon && (
        <span className="mb-4 inline-flex text-ink-soft" aria-hidden="true">
          <LineIcon name={icon} size={40} strokeWidth={1.3} />
        </span>
      )}

      <h3 className="text-xl md:text-2xl">{title}</h3>

      <p className="mt-2 max-w-measure-tight text-lg text-ink-soft">
        {description}
      </p>

      {((actionLabel && actionHref) || (secondaryLabel && secondaryHref)) && (
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {actionLabel && actionHref && (
            <Link
              href={actionHref}
              className="press inline-flex min-h-[52px] items-center justify-center rounded-md bg-primary-600 px-6 text-lg font-semibold text-white transition-colors hover:bg-primary-700"
            >
              {actionLabel}
            </Link>
          )}
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="press inline-flex min-h-[52px] items-center justify-center rounded-md border border-primary-600 px-6 text-lg font-semibold text-primary-700 transition-colors hover:bg-primary-50 dark:border-primary-300 dark:text-primary-200 dark:hover:bg-primary-900/40"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
