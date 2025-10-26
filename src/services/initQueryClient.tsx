import { QueryClient } from '@tanstack/react-query';

const IS_RUNNING_IN_CYPRESS = import.meta.env.RUNNING_IN_CYPRESS;

const RETRIES = IS_RUNNING_IN_CYPRESS ? false : 3;

export const initQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: RETRIES,
			},
			mutations: {
				retry: RETRIES,
			},
		},
	});
};
