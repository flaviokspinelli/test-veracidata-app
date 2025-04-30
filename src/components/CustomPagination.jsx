import React from 'react';
import { Box, Pagination, PaginationItem } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

const CustomPagination = ({ currentPage, totalPages, onPageChange, maxPagesToShow = 5 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handlePageChange = (event, page) => {
    const queryParams = queryString.parse(location.search);
    const newQueryParams = { ...queryParams, page: page.toString() };
    const newSearch = queryString.stringify(newQueryParams);

    navigate(`${location.pathname}?${newSearch}`);
    if (onPageChange) onPageChange(page);
  };

  return (
    <Box display="flex" justifyContent="center" my={3}>
      <Pagination
        count={Math.ceil(totalPages)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        shape="rounded"
        size="medium"
        siblingCount={1}
        boundaryCount={1}
        renderItem={(item) => <PaginationItem {...item} />}
      />
    </Box>
  );
};

export default CustomPagination;
