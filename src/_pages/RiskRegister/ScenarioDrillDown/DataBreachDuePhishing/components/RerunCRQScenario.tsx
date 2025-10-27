// Replaced next/image with regular img tag
import { useIsGuestUser } from 'permissions/use-permissions';
import { type FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/button';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { useUpdateCRQScenario } from '@/services/hooks';
import type { RiskRegisterResponse } from '@/types/riskRegister';
import EllipseIcon from '../../../../../components/icons/ellipse.svg';
import { RerunScenarioSuccessDialog } from './RerunScenarioSuccessDialog';

type Props = {
	scenario: RiskRegisterResponse;
};

export const RerunCRQScenario: FC<Props> = ({ scenario }) => {
	const { t } = useTranslation('riskRegister', {
		keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
	});
	const [showModal, setShowModal] = useState(false);
	const isGuestUser = useIsGuestUser();
	const { showDemoModal } = useContext(DemoExperienceContext);
	const { mutate: updateCRQScenario } = useUpdateCRQScenario({
		onSuccess: () => setShowModal(true),
	});

	const handleRefreshClick = () => {
		updateCRQScenario({ scenarioId: scenario.scenario_id });
	};

	return (
		<>
			<div>
				{!scenario.scenario_data.crq_data?.is_crq_up_to_date && (
					<div className='flex justify-start gap-5'>
						<div className='flex items-center gap-[6px] text-text-specific-external-scan-score'>
							<img src={EllipseIcon} alt='update available' />
							<p className='text-[13px] font-[400]'>{t('updateAvailable')}</p>
						</div>
						<Button
							data-testid='quantitative-metrics-header-refresh'
							className='space-between flex h-auto flex-row gap-[20px] rounded-[5px] px-[7px] py-[3px] text-sm text-text-specific-external-scan-score underline underline-offset-2'
							variant='link'
							onClick={() =>
								isGuestUser
									? showDemoModal({ title: t('rerunScenario') })
									: handleRefreshClick()
							}
						>
							<p className='text-[14px] font-[700]'>{t('refresh')}</p>
						</Button>
					</div>
				)}
			</div>
			<div data-testid='success-modal'>
				<RerunScenarioSuccessDialog
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			</div>
		</>
	);
};
