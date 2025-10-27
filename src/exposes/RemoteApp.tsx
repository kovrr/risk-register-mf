import { Toaster } from '@/components/atoms/toaster';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { ErrorBoundary } from '@/components/wrappers/ErrorBoundary';
import { InstanceWrapper } from '@/components/wrappers/InstanceWrapper';
import { DemoExperienceContextProvider } from '@/contexts/DemoExperienceContext';
import '@/globals.css';
import { Box, Flex } from '@chakra-ui/layout';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
// Risk Register Components
import RiskRegister from '@/_pages/RiskRegister';
import ScenarioEdit from '@/_pages/RiskRegister/ScenarioEdit';
import ScenarioView from '@/_pages/RiskRegister/ScenarioView';
import { initQueryClient } from '@/services/initQueryClient';
import { theme } from '@/theme/baseTheme';

const RemoteApp = () => {
	const queryClient = useMemo(() => initQueryClient(), []);

	return (
		<ChakraProvider theme={theme}>
			<ErrorBoundary>
				<QueryClientProvider client={queryClient}>
					<InstanceWrapper>
						<DemoExperienceContextProvider>
							<Flex direction='column' height='100%'>
								<Box
									flexGrow={1}
									w='100%'
									bgColor='brand.background.blue'
									overflow='auto'
								>
									<DefaultLayout>
										<Routes>
											{/* Main Risk Register Table */}
											<Route path='/' element={<RiskRegister />} />

											{/* View Scenario Details */}
											<Route
												path='/scenarios/:scenarioId'
												element={<ScenarioView />}
											/>

											{/* Edit Scenario */}
											<Route
												path='/scenarios/:scenarioId/edit'
												element={<ScenarioEdit />}
											/>
										</Routes>
									</DefaultLayout>
								</Box>
								<ReactQueryDevtools initialIsOpen={false} />
							</Flex>
						</DemoExperienceContextProvider>
					</InstanceWrapper>
				</QueryClientProvider>
			</ErrorBoundary>
			<Toaster />
		</ChakraProvider>
	);
};

export default RemoteApp;
