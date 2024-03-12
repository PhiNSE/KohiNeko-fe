import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import emptyImg from '../assets/EmptyImg.jpg';

const CarouselImgae = ({ height, images, altText = "" }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <Splide
        options={{
          type: 'loop',
          gap: '3rem',
          autoplay: images.length > 0,
          arrows: images.length > 0,
        }}
        className='my-carousel'
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <SplideSlide
              key={index}
              className={`flex justify-center items-center w-96 h-96`}
              onClick={() => openModal(image)}
            >
              <img
                src={image.url}
                alt={`${altText} slide ${index}`}
                className='object-cover object-center w-full h-full'
              />
            </SplideSlide>
          ))
        ) : (
          <SplideSlide className={`flex justify-center items-center w-96 h-96`}>
            <img
              src={emptyImg}
              alt='No images available'
              className='object-cover object-center w-full h-full'
            />
          </SplideSlide>
        )}
      </Splide>

      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-auto ">
          {selectedImage && (
            <img
              src={selectedImage.url}
              alt={selectedImage.altText}
              className="object-cover object-center w-full h-full"
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default CarouselImgae;
