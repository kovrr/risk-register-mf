import React from 'react';
import ScenarioTableTopBar from './components/ScenarioTableTopBar';
import RiskRegisterTable from './RiskRegisterTable';

const RiskRegister: React.FC = () => {
  return (
    <>
      <ScenarioTableTopBar />
      <RiskRegisterTable />
    </>
  );
};

export default RiskRegister;
