import { QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import Provider from '@/components/molecules/ProviderComponent';
import { InstanceWrapper } from '@/components/wrappers/InstanceWrapper';
import { initQueryClient } from '@/services/initQueryClient';

const RemoteApp = () => {
	const queryClient = useMemo(() => initQueryClient(), []);
	return (
		<QueryClientProvider client={queryClient}>
			<InstanceWrapper>
				<Routes>
					<Route path='/' element={<Provider />} />
				</Routes>
			</InstanceWrapper>
		</QueryClientProvider>
	);
};

export default RemoteApp;
