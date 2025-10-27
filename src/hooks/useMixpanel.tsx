export const useMixpanel = () => {
  const track = (event: string, properties?: Record<string, any>) => {
    // Mock implementation for now
    console.log('Mixpanel track:', event, properties);
  };

  return { track };
};
