import { FronteggProvider } from '@frontegg/react';
import type { ContextOptions } from '@frontegg/types/ContextOptions';
import type React from 'react';
import { useMemo } from 'react';

interface Props {
	authUrl: string;
	appId: string;
	children: React.ReactNode;
}

export const AuthWrapper = ({ authUrl, appId, children }: Props) => {
	const contextOptions: ContextOptions = useMemo(
		() => ({
			baseUrl: authUrl,
			appId,
			tenantResolver: () => {
				const urlQueryParams = new URLSearchParams(window.location.search);
				const organization = urlQueryParams.get('organization');
				return {
					tenant: organization,
				};
			},
		}),
		[authUrl, appId],
	);

	const authOptions = {
		keepSessionAlive: true,
	};

	return (
		<FronteggProvider contextOptions={contextOptions} authOptions={authOptions}>
			{children}
		</FronteggProvider>
	);
};
