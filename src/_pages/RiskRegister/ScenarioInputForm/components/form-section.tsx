import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type FormSectionProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
};

export function FormSection({
  title,
  description,
  icon,
  children,
  className,
  headerAction,
}: FormSectionProps) {
  const hasHeader = Boolean(title || description || icon || headerAction);

  return (
    <section
      className={cn(
        'rounded-2xl border border-border-base bg-fill-base-0 p-6 shadow-sm',
        className,
      )}
    >
      {hasHeader && (
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div>
            {!!title && (
          <div className='flex items-center gap-2'>
            <h2 className='text-lg font-semibold text-text-base-primary'>
              {title}
            </h2>
            {icon}
          </div>
            )}
          {description && (
            <p className='mt-1 max-w-[640px] text-sm text-text-base-secondary'>
              {description}
            </p>
          )}
        </div>
        {headerAction}
      </div>
      )}
      <div className={cn('space-y-6', hasHeader ? 'mt-6' : 'mt-0')}>
        {children}
      </div>
    </section>
  );
}

