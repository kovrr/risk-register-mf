import ScenarioTopBarNoSearch from '@/_pages/RiskRegister/components/ScenarioTopBarNoSearch';
import React, { useState } from 'react';
import KovrrInsights from './insights';
import RiskRegisterTable from './RiskRegisterTable';
import RiskRegisterVisualization from './visualization';

type TabKey = 'table' | 'visualization' | 'insights';

const RiskRegister: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('table');

  const tabClasses = (key: TabKey) =>
    [
      'flex-1 px-6 py-4 text-center text-sm font-bold border-b-2 transition-colors',
      activeTab === key
        ? 'bg-white text-gray-800 border-[#6E56CF]'
        : 'bg-[#F2F4F7] text-gray-600 border-transparent',
    ].join(' ');

  return (
    <div className='min-h-screen'>
      <div className='mx-auto w-full max-w-[1440px] px-5 py-6 md:px-8 md:py-8'>
        <div className='flex flex-col gap-6'>
          <ScenarioTopBarNoSearch />

          {/* Tabs */}
          <div className='flex w-full border-b border-slate-200'>
            <button
              type='button'
              className={tabClasses('table')}
              onClick={() => setActiveTab('table')}
            >
              Risk Register Table
            </button>
            <button
              type='button'
              className={tabClasses('visualization')}
              onClick={() => setActiveTab('visualization')}
            >
              Risk Register Visualization
            </button>
            <button
              type='button'
              className={tabClasses('insights')}
              onClick={() => setActiveTab('insights')}
            >
              Kovrr Insights
            </button>
          </div>

          {/* Panels */}
          <div className='mt-6 min-h-[calc(100vh-160px)]'>
            {activeTab === 'table' && (
              <div className='mx-auto max-w-[1440px]'>
                <RiskRegisterTable />
              </div>
            )}
            {activeTab === 'visualization' && (
              <div className='mx-auto max-w-[1440px]'>
                <RiskRegisterVisualization />
              </div>
            )}
            {activeTab === 'insights' && (
              <div className='mx-auto max-w-[1440px]'>
                <KovrrInsights />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskRegister;
