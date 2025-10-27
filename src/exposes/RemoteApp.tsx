import { InstanceWrapper } from '@/components/wrappers/InstanceWrapper';
import '@/globals.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
// Risk Register Components
import RiskRegister from '@/_pages/RiskRegister';
import ScenarioEdit from '@/_pages/RiskRegister/ScenarioEdit';
import ScenarioView from '@/_pages/RiskRegister/ScenarioView';
import { initQueryClient } from '@/services/initQueryClient';

const RemoteApp = () => {
	const queryClient = useMemo(() => initQueryClient(), []);

	return (
		<QueryClientProvider client={queryClient}>
			<InstanceWrapper>
				<Routes>
					{/* Main Risk Register Table */}
					<Route path='/' element={<RiskRegister />} />

					{/* View Scenario Details */}
					<Route path='/scenario/:scenarioId' element={<ScenarioView />} />

					{/* Edit Scenario */}
					<Route path='/scenario/:scenarioId/edit' element={<ScenarioEdit />} />

				</Routes>
			</InstanceWrapper>
		</QueryClientProvider>
	);
};

export default RemoteApp;
