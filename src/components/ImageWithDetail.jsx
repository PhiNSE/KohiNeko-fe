import LazyLoadImage from './LazyLoadImage';

const ImageWithDetail = ({ img, subtitle }) => {
  return (
    <div className='flex justify-center items-center flex-col h-80 w-96'>
      <LazyLoadImage src={img} classNameProps='rounded-md' />
      <h3 className='font-bold'>{subtitle}</h3>
    </div>
  );
};

export default ImageWithDetail;
