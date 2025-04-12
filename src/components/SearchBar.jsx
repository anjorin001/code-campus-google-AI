import { Search } from "lucide-react";
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [value, setvalue] = useState('');

  const handleChange = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      onSearch(value);
    }
  };
  
  const handleClear = (e) => {
    e.preventDefault(); 
    setvalue('')
  }
  return (
    <div className="search-bar-container">
      <form action="" onKeyDown={handleChange}>
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            value={value}
            placeholder="Search CodeCampus.."
            onChange={(e) => setvalue(e.target.value)}
            className="search-input"
            style={{ backgroundColor: '#3E4454' }}
          />
         {value && <button onClick={handleClear}>x</button>}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
