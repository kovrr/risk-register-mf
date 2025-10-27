import React from 'react';
import { Menu, Box, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useMaterialityContext } from '_pages/ResultsNarrative/MaterialityTab/MaterialityContext';

export const CustomThresholdPopupMenu = () => {
  const { t } = useTranslation('resultsNarrative', {
    keyPrefix: 'materialityAnalysis.customThreshold.popupMenu',
  });
  const { openModal, handleDeleteCustomThreshold } = useMaterialityContext();
  return (
    <Box marginLeft='auto'>
      <Menu>
        <MenuButton aria-label='More actions' data-testid='more-options'>
          <BsThreeDotsVertical />
        </MenuButton>
        <MenuList zIndex={10}>
          <MenuItem onClick={openModal} data-testid='edit-threshold'>
            {t('editThreshold')}
          </MenuItem>
          <MenuItem
            onClick={handleDeleteCustomThreshold}
            color='brand.red'
            data-testid='delete-threshold'
          >
            {t('deleteThreshold')}
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};
