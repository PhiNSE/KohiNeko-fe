import Modal from '@mui/material/Modal';
import { useCatDetail } from '../hooks/useCatDetail';
import { FaCat } from 'react-icons/fa6';
import { PiGenderFemaleBold, PiGenderMaleBold } from 'react-icons/pi';
import { MdFavorite } from 'react-icons/md';
import Empty from './Empty';
import CarouselImgae from './CarouselImgae';
import { Typography } from '@mui/material';
import emptyImg from '../assets/EmptyImg.jpg';
import { Splide, SplideSlide } from '@splidejs/react-splide';

const CatDetails = ({ open, handleClose, shopId, catId }) => {
  const {
    isLoading: isLoadingCatDetail,
    cat,
    error: catError,
  } = useCatDetail(shopId, catId);
  if (isLoadingCatDetail) return <p>Loading...</p>;
  if (catError) return <p>Error: {catError.message}</p>;

  const { description, favorite, gender, images, name } = cat.data;

  return (
    <Modal open={open} onClose={handleClose}>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto w-1/2 '>
        <div className='bg-white overflow-auto relative rounded-lg'>
          {/* Image */}
          {images.length === 0 ? (
            <Splide
              options={{
                type: 'loop',
                gap: '3rem',
                autoplay: images.length > 0,
                arrows: images.length > 0,
              }}
              className='my-carousel'
            >
              <SplideSlide
                className={`flex justify-center items-center w-96 h-96`}
              >
                <img
                  src={emptyImg}
                  alt='No images available'
                  className='object-cover object-center w-full h-full'
                />
              </SplideSlide>
            </Splide>
          ) : (
            <div>
              <CarouselImgae
                images={images}
                altText={`${name}`}
                height={'96'}
              />
            </div>
          )}
          {/* Description */}
          <div className='my-3 px-6  max-h-[45vh] overflow-y-auto'>
            {/* Name/Favorite/Gender + Area */}

            <div className='flex justify-between items-start py-4'>
              {/* Name/Favorite/Gender  */}
              <h1 className='flex items-center text-5xl text-primary '>
                <FaCat className='mr-2' />
                <span>{name}</span>
              </h1>

              <div className='text-2xl'>
                {/* Gender */}
                <div className='flex items-center text-primary gap-1 font-bold '>
                  {gender.toLowerCase() === 'male' ? (
                    <PiGenderMaleBold className='mr-2' />
                  ) : (
                    <PiGenderFemaleBold className='mr-2' />
                  )}
                  <p>{gender}</p>
                </div>

                {/* Favorite */}
                <div className='flex items-center text-primary gap-1 font-bold '>
                  <MdFavorite className='mr-2' />
                  <p>{favorite}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <h1 className='font-bold text-primary text-center mb-1'>
              Description
            </h1>
            <Typography
              sx={{ flex: '1 1 100%' }}
              color='inherit'
              variant='subtitle1'
              component='div'
            >
              {description}
            </Typography>
          </div>
          {/* Close button */}
          <button
            onClick={handleClose}
            className='absolute top-0 right-0 w-10 transition-colors duration-300 bg-primary hover:bg-secondary text-white p-2 rounded-full'
            style={{ zIndex: 10 }}
          >
            X
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CatDetails;
