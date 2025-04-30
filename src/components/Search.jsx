import React, { useState, useEffect } from 'react';
import { InputGroup, Input, InputGroupText } from 'reactstrap';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';

const Search = ({ onSearchChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    const search = queryParams.search || '';
    setSearchValue(search);
  }, [location.search]);

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchValue(search);

    const queryParams = queryString.parse(location.search);
    if (queryParams.page) {
      delete queryParams.page; // Remover o parâmetro "page" da URL se ele existir
    }

    const newQueryParams = { ...queryParams, search };
    const newSearch = queryString.stringify(newQueryParams);
    navigate(`${location.pathname}?${newSearch}`);

    if (onSearchChange) {
      onSearchChange(search);
    }
  };

  return (
    <InputGroup className="search shadow-sm">
      <Input
        className="shadow-none border-end-0 border-secondary border-opacity-25"
        value={searchValue}
        onChange={handleSearchChange}
      />
      <InputGroupText className="bg-white shadow-none border-start-0 border-secondary border-opacity-25">
        <i className="material-symbols-outlined">search</i>
      </InputGroupText>
    </InputGroup>
  );
};

export default Search;
