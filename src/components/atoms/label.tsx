import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-[400] line-height-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-base-secondary flex items-center gap-1',
  {
    variants: {
      variant: {
        default: '',
        'section-label': 'font-[700] font-[14px] text-text-base-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, variant, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant }), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
