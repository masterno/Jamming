import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [term, setTerm] = useState('');

  const handleTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value);
  };

  const search = () => {
    onSearch(term);
  };
  return (
    <div>
      {/* <h2>SearchBar Component</h2> */}
      <input 
        type="text" 
        placeholder="Enter A Song, Album, or Artist" 
        value={term} 
        onChange={handleTermChange} 
      />
      <button className="SearchButton" onClick={search}>SEARCH</button>
    </div>
  );
};

export default SearchBar;
