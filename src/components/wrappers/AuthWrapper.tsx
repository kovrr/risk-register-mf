import type React from 'react';

interface Props {
	children: React.ReactNode;
}

export const AuthWrapper = ({ children }: Props) => {
	return (
		// <FronteggProvider contextOptions={contextOptions} authOptions={authOptions}>
			{children}
		// </FronteggProvider>
	);
};
