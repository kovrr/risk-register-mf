import { Button } from '@/components/atoms/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms/tooltip';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type Props = {
  id: string;
  title: string;
  description: string;
  disabled?: boolean;
};
export const ScenarioDetails = ({
  id,
  title,
  description,
  disabled = false,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation('riskRegister', { keyPrefix: 'table' });

  return (
    <div className='flex w-[161px] flex-col'>
      <span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className={cn('w-fit max-w-[100%]', disabled && 'cursor-default')}
            >
              <span>
                <Button
                  className='h-min max-w-[100%] p-0 text-[14px] font-[700] text-text-base-primary underline underline-offset-2'
                  variant='link'
                  disabled={disabled}
                  onClick={() => navigate(`/risk-register/scenarios/${id}`)}
                >
                  <p className='truncate'>{title}</p>
                </Button>
              </span>
            </TooltipTrigger>
            {disabled ? (
              <TooltipContent>
                <p>{t('scenarioDetails.loading')}</p>
              </TooltipContent>
            ) : null}
          </Tooltip>
        </TooltipProvider>
      </span>
      <span className={cn('truncate text-sm text-text-base-secondary')}>
        {description}
      </span>
    </div>
  );
};
