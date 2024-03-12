import Pagination from '@mui/material/Pagination';

const PaginationAPI = ({ currentPage, itemsPerPage, onPageChange, total }) => {
  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <div className='flex justify-center mt-3'>
      <Pagination
        count={Math.ceil(total / itemsPerPage)}
        variant='outlined'
        shape='rounded'
        color='primary'
        page={currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default PaginationAPI;
