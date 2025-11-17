export type MockGroup = {
  id: string;
  name: string;
};

const MOCK_GROUPS: MockGroup[] = [
  { id: '00000000-0000-0456-0001-000000000001', name: 'Engineering Team' },
  { id: '00000000-0000-0456-0002-000000000002', name: 'Security Team' },
  { id: '00000000-0000-0456-0003-000000000003', name: 'Operations Team' },
] as const;

export const useMockGroups = () => {
  return {
    data: MOCK_GROUPS,
    isLoading: false,
  };
};


