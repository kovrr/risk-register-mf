export const useFeatureRiskRegisterCRQ = () => {
  // Return true to enable feature, or read from env/config
  return process.env.REACT_APP_FEATURE_CRQ === 'true';
};

export const useFeatureRiskRegisterTemplate = () => {
  return process.env.REACT_APP_FEATURE_TEMPLATE === 'true';
};

export const useFeatureRiskRegisterReorganize = () => {
  return process.env.REACT_APP_FEATURE_REORGANIZE === 'true';
};
