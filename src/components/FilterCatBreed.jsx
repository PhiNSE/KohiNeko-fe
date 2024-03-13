const FilterCatBreed = ({ cat, selectedBreed, setSelectedBreed }) => {
  const catBreeds = cat?.data
    ? [...new Set(cat.data.map((cat) => cat.breed))].sort()
    : [];
  return (
    <select
      value={selectedBreed}
      onChange={(e) => setSelectedBreed(e.target.value)}
      className='text-lg px-3 py-2 border bg-secondary  rounded-s font-semibold shadow-sm w-[8rem] h-[3rem] '
    >
      <option
        value='All'
        className='bg-secondary text-black hover:bg-secondary'
      >
        All
      </option>
      {catBreeds?.map((breed) => (
        <option
          key={breed}
          value={breed}
          className='bg-secondary text-black hover:bg-secondary'
        >
          {breed}
        </option>
      ))}
    </select>
  );
};

export default FilterCatBreed;
