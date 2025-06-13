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
        placeholder="Enter A Song Title" 
        value={term} 
        onChange={handleTermChange} 
      />
      <button onClick={search}>SEARCH</button>
    </div>
  );
};

export default SearchBar;
