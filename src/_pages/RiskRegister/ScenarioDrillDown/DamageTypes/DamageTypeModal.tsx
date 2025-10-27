import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import type { FC } from 'react';
import { RiskDriverDamageTypes } from './OldIndex';

interface DamageTypeModalProps {
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  defaultTabIndex?: number;
}
const DamageTypeModal: FC<DamageTypeModalProps> = ({
  isDrawerOpen,
  onCloseDrawer,
}) => {
  const { onClose } = useDisclosure();
  const { data: scenario } = useCurrentRiskRegisterScenario();
  const cost_components_breakdown =
    scenario?.scenario_data?.crq_data?.results?.cost_components_breakdown;

  const onCloseM = () => {
    onCloseDrawer();
    onClose();
  };

  const aal =
    scenario?.scenario_data.crq_data?.results?.lean_simulation_exposure
      ?.top_simulation_stats.event_loss.avg;

  if (!cost_components_breakdown) return null;

  return (
    <>
      <Drawer
        isOpen={isDrawerOpen}
        placement='right'
        onClose={onCloseM}
        size='md'
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton position='relative' ml='48px' />
          <DrawerBody data-testid='DamageTypeDrawer'>
            <RiskDriverDamageTypes
              exposure={cost_components_breakdown}
              inDrawer={true}
              aal={aal}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DamageTypeModal;
