const DoubleContent = ({ children }) => {
  return (
    <div className='grid grid-cols-1 2xl:grid-cols-[1fr_1fr] 2xl:px-[13rem] gap-10'>
      {children}
    </div>
  );
};

export default DoubleContent;
