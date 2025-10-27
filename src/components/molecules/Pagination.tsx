import { type FC, useCallback } from 'react';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import ReactPaginate from 'react-paginate';
import { Dropdown, type Option } from './Dropdown';

const defaultOptionStyles = {
  className:
    'text-text-base-secondary font-normal border-stroke-base-1 border-[1px]',
};

const PageSizeOptions: Option[] = [
  {
    label: '10',
    value: 10,
    ...defaultOptionStyles,
  },
  {
    label: '20',
    value: 20,
    ...defaultOptionStyles,
  },
  {
    label: '50',
    value: 50,
    ...defaultOptionStyles,
  },
];

const CONSTS = {
  PAGE_SIZE_PREFIX: 'View',
  PAGE_SIZE_SUFFIX: 'items per page',
  RESULTS_PREFIX: 'Results',
  RESULTS_SUFFIX: 'of',
};

export type PaginationProps = {
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  currentPageSize: number;
  pageSizePrefix?: string;
  pageSizeSuffix?: string;
  resultsPrefix?: string;
  resultsSuffix?: string;
};
export const Pagination: FC<PaginationProps> = ({
  pageCount,
  pageIndex,
  pageSize,
  totalCount,
  setPageIndex,
  setPageSize,
  currentPageSize,
  pageSizePrefix = CONSTS.PAGE_SIZE_PREFIX,
  pageSizeSuffix = CONSTS.PAGE_SIZE_SUFFIX,
  resultsPrefix = CONSTS.RESULTS_PREFIX,
  resultsSuffix = CONSTS.RESULTS_SUFFIX,
}) => {
  const start = pageIndex * pageSize + 1;
  const end = start + currentPageSize - 1;
  const onPageSizeChange = useCallback(
    ({ value }: Option) => {
      setPageSize(value);
      setPageIndex(0);
    },
    [setPageSize, setPageIndex],
  );

  return (
    <div className='flex items-center justify-between text-sm text-text-base-secondary'>
      <div className='flex items-center gap-2'>
        <span>{pageSizePrefix}</span>
        <Dropdown
          options={PageSizeOptions}
          defaultValue={PageSizeOptions[0]}
          onChange={onPageSizeChange}
        />
        <span>{pageSizeSuffix}</span>
      </div>
      <div className='flex items-center gap-3'>
        <span>
          {resultsPrefix} {start} - {end} {resultsSuffix} {totalCount}
        </span>
        <ReactPaginate
          breakLabel='...'
          nextLabel={<GrFormNext />}
          onPageChange={({ selected }: { selected: number }) =>
            setPageIndex(selected)
          }
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel={<GrFormPrevious />}
          renderOnZeroPageCount={() => null}
          containerClassName='pagination-container'
          className='flex items-center gap-3'
          activeClassName='text-text-brand-primary font-bold'
        />
      </div>
    </div>
  );
};
