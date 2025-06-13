import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      search();
    }
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      {/* <h2>SearchBar Component</h2> */}
      <Input 
        type="text" 
        placeholder="Enter A Song, Album, or Artist" 
        value={term} 
        onChange={handleTermChange} 
        onKeyDown={handleKeyDown} // Added this line
        className="flex-grow"
      />
      <Button onClick={search}>SEARCH</Button>
    </div>
  );
};

export default SearchBar;
