const Navbar = ({ children }) => {
  return (
    <div
      className={`bg-orange-200 md:bg-orange-200 w-auto origin-top animate-open-menu z-10000 `}
    >
      <div className='flex md:items-center md:flex-row flex-col flex-nowrap md:space-x-8 text-xl font-semibold '>
        {children}
      </div>
    </div>
  );
};

export default Navbar;
