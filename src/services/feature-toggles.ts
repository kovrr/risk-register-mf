export const useFeatureRiskRegisterCRQ = () => {
  // Return true to enable feature, or read from env/config
  return import.meta.env.VITE_FEATURE_CRQ === 'true' || import.meta.env.REACT_APP_FEATURE_CRQ === 'true';
};

export const useFeatureRiskRegisterTemplate = () => {
  return import.meta.env.VITE_FEATURE_TEMPLATE === 'true' || import.meta.env.REACT_APP_FEATURE_TEMPLATE === 'true';
};

export const useFeatureRiskRegisterReorganize = () => {
  return import.meta.env.VITE_FEATURE_REORGANIZE === 'true' || import.meta.env.REACT_APP_FEATURE_REORGANIZE === 'true';
};

export const useIsProductTourEnabled = () => {
  return import.meta.env.VITE_FEATURE_PRODUCT_TOUR === 'true' || import.meta.env.REACT_APP_FEATURE_PRODUCT_TOUR === 'true';
};
