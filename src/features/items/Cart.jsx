import { Grid, TextField, Typography, Button } from '@mui/material';
import FormatNumber from '../../utils/NumberFormatter';
import { HiOutlineX } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyBox from '../../assets/empty_box.png';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { createInvoice } from '../../services/apiItems';
import { FaTrashCan } from 'react-icons/fa6';
import LazyLoadImage from '../../components/LazyLoadImage';
import QuantityControl from '../../components/QuantityControl';
import Currency from '../../components/Currency';
import emptyImg from '../../assets/EmptyImg.jpg';
import FilterBy from '../../components/FilterBy';
import Empty from '../../components/Empty';

const Cart = ({ selectedItems, setSelectedItems, handleUpdateItem }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const filterOptions = [
    { value: '', label: 'All' },
    { value: 'drink', label: 'Drink' },
    { value: 'foods', label: 'Food' },
    { value: 'cat foods', label: 'Cat Food' },
    { value: 'toys', label: 'Toys' },
  ];
  const [totalPrice, setTotalPrice] = useState();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = useForm();
  // const CreateInvoice = useMutation({ mutationFn: createInvoice });

  const removeItem = (itemToRemove) => {
    setSelectedItems((prevItems) => {
      return prevItems.filter((item) => item !== itemToRemove);
    });
  };

  const eliminateUnwanted = (data) => {
    return data.map((item, index) => {
      const { images, price, name, status, itemTypeId, description, ...rest } =
        item;
      return { ...rest };
    });
  };

  const onSubmit = async () => {
    setValue('items', selectedItems);
    console.log(selectedItems.data);
    localStorage.setItem('items', JSON.stringify(selectedItems));
    navigate('/purchase');
  };

  useEffect(() => {
    const total = selectedItems.reduce(
      (asc, item) => asc + Number(item.price) * Number(item.quantity),
      0
    );
    setTotalPrice(total);
  }, [selectedItems]);

  const [quantities, setQuantities] = useState({});
  // const handleQuantityChange = (id, quantity) => {
  //   setQuantities((prevQuantities) => ({ ...prevQuantities, [id]: quantity }));
  // };
  const handleQuantityChange = (id, quantity) => {
    handleUpdateItem(id, quantity);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex justify-end'>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className='text-lg px-3 py-2 border bg-secondary  rounded-s font-semibold shadow-sm w-[8rem] h-[3rem] '
          >
            {filterOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className='bg-secondary text-black hover:bg-secondary'
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {selectedItems.length !== 0 ? (
          <div className=' flex flex-col  gap-3 my-2'>
            <Grid sx={{ mb: 2 }} container spacing={1} alignItems='center'>
              <Grid container item xs={12} alignItems='center'>
                <Grid item xs={2}>
                  <Typography
                    variant='h6'
                    textAlign='center'
                    style={{ textTransform: 'uppercase' }}
                  >
                    Item
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography
                    variant='h6'
                    textAlign='center'
                    style={{ textTransform: 'uppercase' }}
                  >
                    Quantity
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant='h6'
                    textAlign='center'
                    style={{ textTransform: 'uppercase' }}
                  >
                    Category
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant='h6'
                    textAlign='center'
                    style={{ textTransform: 'uppercase' }}
                  >
                    Price
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  {/* Empty grid item to align with trash can icon */}
                </Grid>
              </Grid>

              {selectedItems &&
                selectedItems.length > 0 &&
                (() => {
                  const filteredItems = selectedItems.filter(
                    (item) =>
                      !filter || item.itemTypeId?.itemTypeName === filter
                  );

                  if (filteredItems.length === 0) {
                    return <Empty object='item' />;
                  }

                  return filteredItems.map((item, idx) => (
                    <Grid container item xs={12} key={idx}>
                      <Grid
                        item
                        xs={2}
                        container
                        direction='column'
                        justifyContent='center'
                        alignItems='center'
                      >
                        <div className='h-20 w-20'>
                          <img
                            src={
                              item?.images[0]?.url
                                ? item.images[0].url
                                : emptyImg
                            }
                            alt={item.name}
                            className='w-full h-full object-cover rounded-large'
                          />
                        </div>

                        <span className='text-l text-center '>{item.name}</span>
                      </Grid>

                      <Grid
                        item
                        xs={3}
                        container
                        direction='column'
                        justifyContent='center'
                        alignItems='center'
                      >
                        <QuantityControl
                          value={item.quantity || 1}
                          onIncrement={() =>
                            handleQuantityChange(
                              item._id,
                              (item.quantity || 1) + 1
                            )
                          }
                          onDecrement={() =>
                            handleQuantityChange(
                              item._id,
                              Math.max((item.quantity || 1) - 1, 1)
                            )
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        textAlign='center'
                        container
                        direction='column'
                        justifyContent='center'
                        alignItems='center'
                      >
                        <Typography variant='h6' className='capitalize'>
                          {item.itemTypeId?.itemTypeName || 'No category'}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        textAlign='center'
                        container
                        direction='column'
                        justifyContent='center'
                        alignItems='center'
                      >
                        <Typography variant='h6'>
                          {FormatNumber(item.price)}
                          <Currency>VND</Currency>
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        textAlign='center'
                        container
                        direction='column'
                        justifyContent='center'
                        alignItems='center'
                      >
                        <FaTrashCan
                          size={24}
                          className='cursor-pointer hover:text-red-500'
                          onClick={() => removeItem(item)}
                        />
                      </Grid>
                    </Grid>
                  ));
                })()}
            </Grid>

            <>
              <hr />
              <div className='mt-2 flex flex-row justify-end'>
                <Typography variant='h5' fontWeight='bold'>
                  Total:{' '}
                </Typography>
                <Typography variant='h5' fontWeight='bold'>
                  {totalPrice ? FormatNumber(totalPrice) : 0} VND
                </Typography>
              </div>
            </>
          </div>
        ) : (
          <div className='w-full h-auto flex flex-col justify-center items-center'>
            <img
              src={EmptyBox}
              alt='empty box'
              className='h-60 w-60 object-cover rounded-large'
            />
            <Typography variant='h6' fontWeight='bold'>
              Your cart is empty
            </Typography>
          </div>
        )}

        <div className='mt-5 mb-4'>
          <Button
            fullWidth
            variant='contained'
            color='warning'
            style={{ borderRadius: '50px' }}
            type='submit'
            disabled={isSubmitting}
            //   onClick={() => handleCheckOut(selectedItems)}
          >
            Check out
          </Button>
        </div>
      </form>
    </>
  );
};

export default Cart;
