import { Toaster } from '@/components/atoms/sonner';
import { DataTable } from '@/components/molecules/DataTable';
import { useMixpanel } from '@/hooks/useMixpanel';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRiskRegisterTable } from './useRiskRegisterTable';

const RiskRegisterTable = () => {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'table' });
  const {
    table,
    pageCount,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    totalCount,
    isLoading,
    isFetching,
  } = useRiskRegisterTable();

  const { track: trackEvent } = useMixpanel();

  useEffect(() => {
    trackEvent({
      name: 'risk_register.table_viewed',
    });
  }, [trackEvent]);

  return (
    <div className='max-w-8xl mx-auto my-8' data-testid='risk-register-table'>
      <DataTable
        isFetching={isFetching}
        isLoading={isLoading}
        table={table}
        pagination={{
          pageCount,
          pageIndex,
          pageSize,
          setPageIndex,
          setPageSize,
          totalCount,
          currentPageSize: table.getRowModel().rows.length,
          pageSizePrefix: t('pagination.pageSize.prefix'),
          pageSizeSuffix: t('pagination.pageSize.suffix'),
          resultsPrefix: t('results.prefix'),
          resultsSuffix: t('results.suffix'),
        }}
      />
      <Toaster />
    </div>
  );
};

export default RiskRegisterTable;
