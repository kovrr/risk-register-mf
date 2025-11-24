'use client';

import { Button } from '@/components/atoms/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { Textarea } from '@/components/atoms/textarea';
import InfoPopover from '@/components/molecules/info-popover';
import { Spinner } from '@/components/ui/Spinner';
import {
  QUERY_KEYS,
  useUpdateRiskScenarioField,
} from '@/services/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type Props = {
  initialMethodology?: string;
};
export const MethodologyInsight: React.FC<Props> = ({ initialMethodology }) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.methodologyInsights',
  });
  const [methodology, setMethodology] = useState(initialMethodology);
  const isSaveDisabled = methodology === initialMethodology;
  const { mutateAsync: updateScenario, isPending: isSaving } =
    useUpdateRiskScenarioField({
      onSuccess: async (updatedScenario) => {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.RISK_SCENARIO, updatedScenario.scenario_id],
        });
        toast.success('Methodology insights updated successfully');
      },
      onError: (error) => {
        toast.error('Failed to update methodology insights');
        console.error(error);
      },
    });

  const handleSave = async () => {
    await updateScenario({
      methodology_insights: methodology,
    });
  };

  return (
    <Card className='rounded-xl border-0 bg-white shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-2 text-[17px] font-[700] text-text-base-primary'>
          {t('title')}
          <InfoPopover
            content={t('info', {
              returnObjects: true,
            })}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder={t('placeholder')}
          className='min-h-[180px] rounded-lg border-slate-200 focus-visible:ring-slate-200'
          value={methodology}
          onChange={(e) => setMethodology(e.target.value)}
        />
        <div className='mt-4 flex justify-end'>
          <Button
            className='ml-auto h-[34px] w-[61px] bg-[#7C89FF] px-8 text-white hover:bg-[#6574ff]'
            onClick={handleSave}
            disabled={isSaving || isSaveDisabled}
          >
            {isSaving ? (
              <>
                <Spinner
                  className='-ml-1 mr-3 text-white'
                  data-testid='note-spinner'
                />
                {t('saving')}
              </>
            ) : (
              t('save')
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
