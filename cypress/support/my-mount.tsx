import { InstanceWrapper } from '@/components/wrappers/InstanceWrapper';
import '@/i18n';
import { theme } from '@/theme/baseTheme';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';

export interface CustomOptions {
  companyId?: string;
  routerParams: { [key: string]: string };
}
export const withProvider = (
  component: JSX.Element,
  options: CustomOptions | undefined
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  // If routerParams are provided, use MemoryRouter with the params
  if (options?.routerParams && options.routerParams.scenarioId) {
    const path = `/scenarios/${options.routerParams.scenarioId}`;
    return (
      <MemoryRouter initialEntries={[path]}>
        <ChakraProvider theme={theme}>
          <InstanceWrapper>
            <QueryClientProvider client={queryClient}>
              <Routes>
                {/* Route to extract scenarioId from URL params */}
                <Route path="/scenarios/:scenarioId" element={component} />
                {/* Fallback route for other paths */}
                <Route path="*" element={component} />
              </Routes>
            </QueryClientProvider>
          </InstanceWrapper>
        </ChakraProvider>
      </MemoryRouter>
    );
  }

  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <InstanceWrapper>
          <QueryClientProvider client={queryClient}>
            {component}
          </QueryClientProvider>
        </InstanceWrapper>
      </ChakraProvider>
    </BrowserRouter>
  );
};
