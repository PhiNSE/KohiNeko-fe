import { Grid, Typography } from '@mui/material';
import FormatNumber from '../../utils/NumberFormatter';
import EmptyBox from '../../assets/empty_box.png';
import EmptyImg from '../../assets/EmptyImg.jpg';
import { IoIosAddCircle } from 'react-icons/io';
import { Unstable_NumberInput as BaseNumberInput } from '@mui/base/Unstable_NumberInput';
import InputQuantity from '../../components/InputQuantity';
import Button from '../../components/Button';
import { useCallback, useState } from 'react';
import PaginationCustom from '../../components/PaginationCustom';
import QuantityControl from '../../components/QuantityControl';
import Currency from '../../components/Currency';

const RenderItems = ({ data, handleChooseItem }) => {
  const [keys, setKeys] = useState({}); // Add this line
  const [quantities, setQuantities] = useState({});

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;
    handleChooseItem({ ...item, quantity: quantity });
    setQuantities((prevQuantities) => ({ ...prevQuantities, [item._id]: 1 })); // Reset the quantity to 1
    setKeys((prevKeys) => ({ ...prevKeys, [item._id]: Math.random() })); // Use a random number to force re-render
  };

  //* Tab
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageChange = useCallback((value) => {
    setCurrentPage(value);
  }, []);

  return (
    <>
      <div className=' flex flex-col gap-3 mx-4 pb-3 px-6 border-solid border-2 rounded-large h-auto'>
        <Grid container spacing={2}>
          {data.length > 0 ? (
            data
              .slice(currentPage * 4, (currentPage + 1) * 4)
              .map((item, idx) => (
                <Grid key={idx} item md={6} xs={12}>
                  <div className=' flex flex-col h-full w-[23rem] my-3 gap-3 cursor-pointer rounded-large  bg-gray-100 px-3 py-2'>
                    {/* Image */}
                    <div className='w-68 h-64'>
                      <img
                        className='h-full w-full object-cover rounded-large'
                        src={item.images[0] ? item.images[0].url : EmptyImg}
                        alt={item.name}
                      />
                    </div>

                    {/* Item nam */}
                    <h1 className='font-semibold text-4xl mt-2 text-center  h-[2em]'>
                      {item.name}
                    </h1>

                    {/* Item price */}
                    <div className='flex justify-end items-center gap-3'>
                      <h3 className='font-light italic'>
                        {FormatNumber(item.price)} <Currency>VND</Currency>
                      </h3>
                    </div>

                    <Button
                      onClick={() =>
                        handleAddToCart(item, quantities[item._id] || 1)
                      }
                      type='full'
                    >
                      Add To Cart
                    </Button>
                  </div>
                </Grid>
              ))
          ) : (
            <div className='w-full h-screen flex flex-col justify-center items-center'>
              <img
                src={EmptyBox}
                alt='empty box'
                className='h-96 w-96 object-cover rounded-large'
              />
              <Typography variant='h6' fontWeight='bold'>
                No items available
              </Typography>
            </div>
          )}
        </Grid>
        {/* Pagination */}
        {data.length > 0 && (
          <PaginationCustom
            count={Math.ceil(data.length / 4)}
            page={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default RenderItems;
