import React from 'react';
import { HiOutlineShieldExclamation } from 'react-icons/hi';
import Button from './Button';

const Empty = ({ object }) => {
  return (
    <>
      <div className='w-full h-auto text-2xl px-2 py-5 font-bold'>
        No {object} are available at the moment
      </div>
    </>
  );
};

export default Empty;
