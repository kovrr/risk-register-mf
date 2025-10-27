import { Button } from '@/components/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import { formatDatetimeOnlyDate } from '@/helpers/datetimeUtils';
import {
  useCompany,
  useQuantification,
  useUpdateCRQScenario,
} from '@/services/hooks';
import type { RiskRegisterResponse } from '@/types/riskRegister';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EllipseIcon from '../../../../../components/icons/ellipse.svg';

interface IntroSectionProps {
  scenario: RiskRegisterResponse;
}

const underlineTextClassName = 'text-[14px] font-[400] underline';

export function CrqPoweredMessage({ scenario }: IntroSectionProps) {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleModalChange = (open: boolean) => {
    setShowModal(open);
    if (!open) {
      navigate('/');
    }
  };

  const { mutate: updateCRQScenario } = useUpdateCRQScenario({
    onSuccess: () => setShowModal(true),
  });

  const { data: fq } = useQuantification(
    scenario.scenario_data.crq_data?.fq_id ?? '',
  );

  const { data: company } = useCompany(
    scenario.scenario_data.crq_data?.company_id ?? '',
  );

  const isCrqPoweredScenario = scenario.scenario_type !== 'manual';

  if (!isCrqPoweredScenario) {
    return null;
  }

  return (
    <>
      <div className='flex flex-row justify-start'>
        <div className='flex flex-col gap-[10px] rounded-[10px] bg-fill-base-1 p-[10px]'>
          <p className='text-[16px] font-[700] text-text-brand-primary'>
            {t('crqPoweredScenario')}
          </p>
          <div className='flex flex-row content-center items-center gap-[20px] align-middle'>
            <div className='flex flex-row gap-[5px]'>
              <p className='text-[14px] font-[700]'>{t('modelingEntity')}</p>
              {/* @ts-ignore */}
              <p className={underlineTextClassName}>{company?.name || ''}</p>
            </div>
            <div className='flex flex-row gap-[5px]'>
              <p className='text-[14px] font-[700]'>{t('quantification')}</p>
              <p className={underlineTextClassName}>
                {fq?.updated_at ? formatDatetimeOnlyDate(fq?.updated_at) : ''}
              </p>
            </div>
          </div>

          {!scenario.scenario_data.crq_data?.is_crq_up_to_date && (
            <div className='flex flex-row justify-start'>
              <Button
                className='space-between flex h-auto flex-row gap-[20px] rounded-[5px] bg-[#00DB8B4D] px-[7px] py-[3px] text-text-information-success'
                onClick={() =>
                  updateCRQScenario({ scenarioId: scenario.scenario_id })
                }
              >
                <div className='flex flex-row gap-[4px]'>
                  <img src={EllipseIcon} alt='update available' />
                  <p className='text-[14px] font-[400]'>
                    {t('updateAvailable')}
                  </p>
                </div>
                <p className='text-[14px] font-[700]'>{t('refresh')}</p>
              </Button>
            </div>
          )}
        </div>
      </div>
      <Dialog open={showModal} onOpenChange={handleModalChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('updateSuccessTitle')}</DialogTitle>
            <DialogDescription>
              {t('updateSuccessDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className='mt-[15px] flex w-full flex-row justify-center'>
              <Button
                onClick={() => {
                  setShowModal(false);
                  navigate('/', { replace: true });
                }}
              >
                {t('ok')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
