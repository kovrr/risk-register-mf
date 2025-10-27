import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { styled } from 'styled-components';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = styled(CollapsiblePrimitive.CollapsibleContent)`
  overflow: hidden;
  &[data-state='open'] {
    animation: slideDown 300ms ease-out;
  }
  &[data-state='closed'] {
    animation: slideUp 300ms ease-out;
  }

  @keyframes slideDown {
    from {
      height: 0;
    }
    to {
      height: var(--radix-collapsible-content-height);
    }
  }

  @keyframes slideUp {
    from {
      height: var(--radix-collapsible-content-height);
    }
    to {
      height: 0;
    }
  }
`;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
