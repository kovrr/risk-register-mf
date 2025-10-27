import Wrapper from '@/components/wrappers/Wrapper';
import { loadTour } from '@/load-tour';
import { useIsSelfAssessmentLimitedUser } from '@/permissions/use-permissions';
import { useIsProductTourEnabled } from '@/services/feature-toggles';
import { Box, Flex } from '@chakra-ui/layout';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PUBLIC_ROUTES } from '../../routes';

interface Props {
  children: React.ReactNode | React.ReactNode[];
}
const DefaultLayout: React.FC<Props> = ({ children }: Props) => {
  const shouldStartProductTour = useIsProductTourEnabled();
  const [created, setCreated] = useState(false);
  const isSelfAssessmentLimitedUser = useIsSelfAssessmentLimitedUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSelfAssessmentLimitedUser) {
      if (!location.pathname.includes('self-assessment')) {
        navigate(PUBLIC_ROUTES.SELF_ASSESSMENT);
      }
    }
  }, [isSelfAssessmentLimitedUser, location.pathname, navigate]);

  useEffect(() => {
    if (shouldStartProductTour && !created) {
      setCreated(true);
      loadTour();
    }
  }, [shouldStartProductTour, created]);
  return (
    <Flex flexDir='column' h='100%'>
      <div className='h-40px'></div>
      <Box
        flexGrow={1}
        w='100%'
        bgColor='brand.background.blue'
        h='calc(100% - 88px)'
        overflow='auto'
      >
        <Wrapper display='flex' flexDir='row' position='relative' height='100%'>
          <Box flexGrow={1} pt='37' pb='24' h='100%'>
            {children}
          </Box>
        </Wrapper>
      </Box>
    </Flex>
  );
};

export default DefaultLayout;
