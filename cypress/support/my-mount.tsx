import { FronteggProvider } from "@frontegg/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { fronteggAuthServerUrl } from "./commands-lib/mock-frontegg";
import { FakeParamsRouter } from "./test-utils";
import { InstanceWrapper } from "@/components/wrappers/InstanceWrapper";

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
  return (
    <FakeParamsRouter params={options?.routerParams}>
      <FronteggProvider
        contextOptions={{
          baseUrl: fronteggAuthServerUrl,
          currentUserRoles: ["king"],
        }}
      >
        <InstanceWrapper>
          <QueryClientProvider client={queryClient}>
            {component}
          </QueryClientProvider>
        </InstanceWrapper>
      </FronteggProvider>
    </FakeParamsRouter>
  );
};
