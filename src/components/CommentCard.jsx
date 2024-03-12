import { useState } from 'react';
import catPngCommment from '../assets/catPngComment.png';
import Rating from '@mui/material/Rating';

const CommentCard = ({ title, star, content, author }) => {
  return (
    <div className='bg-stone-500 h-atuo w-96 rounded-md mb-5 px-3'>
      <div className='grid grid-cols-[1fr_2fr] gap-2 '>
        <div className='w-32 h-32'>
          <img src={catPngCommment} className='h-full w-full object-cover' />
        </div>
        <div>
          <h1 className='text-white font-bold'>{title}</h1>
          <Rating disabled value={star} />
        </div>
      </div>
      <span className='text-white font font-semibold'>{content}</span>
      <div className='flex justify-end'>
        <span className='text-gray-50 italic'>{author}</span>
      </div>
    </div>
  );
};

export default CommentCard;
