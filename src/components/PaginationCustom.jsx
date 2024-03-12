import { useState } from 'react';
import Pagination from '@mui/material/Pagination';

const PaginationCustom = ({ count, page, onPageChange }) => {
  const handlePageChange = (event, value) => {
    onPageChange(value - 1);
  };

  return (
    <div className='flex justify-center mt-3'>
      <Pagination
        count={count}
        variant='outlined'
        shape='rounded'
        page={page + 1}
        color='primary'
        onChange={handlePageChange}
      />
    </div>
  );
};

export default PaginationCustom;
