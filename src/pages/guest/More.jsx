import { useState } from 'react';
import FilterLocation from '../../components/FilterLocation';
import { useCatByShop } from '../../hooks/useCatByShop';

const More = () => {
  //* Get Cat By Shopid
  const {
    isLoading: isCatLoading,
    cat,
    error: catError,
  } = useCatByShop('65edb684f9660adf5bafaeaf');
  const catBreeds = cat?.data.map((cat) => {
    const words = cat?.breed.split(' ');
    return words[0];
  });
  const [selectedBreed, setSelectedBreed] = useState('All');

  return (
    <div>
      <label className='mr-2 text-sm font-bold'>Filter by Cat Breed:</label>
      <select
        value={selectedBreed}
        onChange={(e) => setSelectedBreed(e.target.value)}
        className='text-lg px-3 py-2 border border-gray-300 rounded-sm bg-gray-100 font-semibold shadow-sm w-[8rem] h-[3rem]'
      >
        <option value='All'>All</option>
        {catBreeds?.map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>
    </div>
  );
};

export default More;
