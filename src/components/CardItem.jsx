import React from 'react';
import LazyLoadImage from './LazyLoadImage';

const CardItem = ({
  img,
  title,
  firstInfoLabel,
  firstInfo,
  secondInfoLabel,
  secondInfo,
  children,
  classNameProps,
}) => {
  return (
    <div
      className={`flex gap-4 mx-1 border-2 rounded-lg px-1.5 py-2 h-96 justify-center ${classNameProps}`}
    >
      <div className='flex flex-col gap-1 w-96 justify-center '>
        <div className='w-auto h-full'>
          <LazyLoadImage
            src={img}
            classNameProps='rounded-lg self-start'
          ></LazyLoadImage>
        </div>
        <h1 className='text-primary text-2xl font-bold mx-auto'>{title}</h1>
        {/* Info */}
        <div className='flex gap-4 justify-around'>
          {/* Description */}
          <div className='flex items-center text-xl justify-center gap-2 capitalize'>
            <span className='font-bold'>{firstInfoLabel} </span>
            {firstInfo}
          </div>
          {/* Breed */}
          <div className='flex items-center  justify-center text-xl gap-2 capitalize'>
            <span className='font-bold'>{secondInfoLabel} </span>
            {secondInfo}
          </div>
        </div>

        <div className='mt-auto w-full'>{children}</div>
      </div>
    </div>
  );
};

export default CardItem;
