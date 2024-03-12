import { SortSharp } from '@mui/icons-material';
import { useState } from 'react';

const FilterBy = ({ options, defaultValue, onChange, className }) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <select
      value={selectedOption}
      onChange={handleChange}
      className='text-lg px-3 py-2 border border-gray-300 rounded-sm bg-gray-100 font-semibold shadow-sm w-[6rem] h-[3rem]'
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default FilterBy;
