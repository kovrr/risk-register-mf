import React from 'react';
import { Box, BoxProps, Flex, Select, Text } from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { PaginationState } from '@tanstack/react-table';

interface Props extends BoxProps {
  paginationState: PaginationState;
  setPaginationState: (state: PaginationState) => void;
  totalCount: number;
  currentPageItemCount: number;
  entriesLabel?: string;
  shouldForcePage?: true;
  staticPageSize?: number;
  isLoading?: boolean;
}

const Pagination: React.FC<Props> = ({
  paginationState,
  setPaginationState,
  entriesLabel,
  totalCount,
  currentPageItemCount,
  shouldForcePage,
  staticPageSize,
  isLoading,
  ...restProps
}) => {
  const handlePageDropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaginationState({
      pageIndex: 0,
      pageSize: Number(e.target.value),
    });
  };

  const handlePageClick = (pageIndex: number) => {
    setPaginationState({
      ...paginationState,
      pageIndex,
    });
  };

  const { pageIndex, pageSize } = paginationState;
  const start = pageIndex * pageSize + 1;
  const end = start + currentPageItemCount - 1;
  const pageCount = Math.ceil(totalCount / pageSize);

  return (
    <Box
      display='flex'
      bgColor='white'
      borderRadius='0px 0px 15px 15px'
      padding='24px'
      alignItems='center'
      flexDir='row'
      justifyContent='space-between'
      __css={{
        '.pagination-container': {
          display: 'flex',
          listStyle: 'none',
          alignItems: 'center',
          fontSize: '15px',
          li: {
            marginLeft: '2.5',
            marginRight: '2.5',
          },
          'li.selected': {
            color: 'brand.purple',
            fontWeight: 'bold',
          },
        },
      }}
      {...restProps}
    >
      <Flex alignItems='center'>
        <Text as='label' fontSize='sm' mr='3' color='brand.misc.6'>
          View
        </Text>
        {staticPageSize ? (
          <Text fontSize='sm' color='brand.misc.6'>
            {staticPageSize}
          </Text>
        ) : (
          <Select
            w='auto'
            fontSize='sm'
            borderRadius='2xl'
            value={pageSize}
            onChange={handlePageDropChange}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        )}
        <Text ml='3' fontSize='sm' color='brand.misc.6'>
          {entriesLabel || 'entries'} per page
        </Text>
      </Flex>
      <Flex alignItems='center' data-testid='pagination-container'>
        {!isLoading && (
          <Text as='label' fontSize='sm' ml='3' mr='7' color='brand.misc.6'>
            Results: {start} - {end} of {totalCount}
          </Text>
        )}
        <ReactPaginate
          breakLabel='...'
          nextLabel={<GrFormNext />}
          onPageChange={({ selected }) => handlePageClick(selected)}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel={<GrFormPrevious />}
          renderOnZeroPageCount={() => null}
          containerClassName='pagination-container'
          forcePage={shouldForcePage ? pageIndex : undefined}
        />
      </Flex>
    </Box>
  );
};

export default Pagination;
