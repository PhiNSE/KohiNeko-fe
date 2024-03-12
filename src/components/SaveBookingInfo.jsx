const SaveBookingInfo = ({ IconComponent, value }) => (
  <div className='h-10 w-[13rem] bg-orange-400 relative rounded-xl text-xl'>
    <input
      disabled
      value={value}
      className='h-full w-full rounded-lg border border-blue-gray-200 bg-transparent px-3 py-2.5 text-sm text-blue-gray-700 outline-none transition-all focus:border-2 focus:border-gray-900 disabled:border-0 disabled:bg-blue-gray-50 text-center pl-10 font-bold'
      placeholder=' '
    />
    <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
      <IconComponent />
    </div>
  </div>
);

export default SaveBookingInfo;
