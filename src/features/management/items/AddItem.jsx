import { useState, useEffect } from 'react';
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Menu,
} from '@mui/material';
import GetImage from '../../../components/GetImage';
import { getAllItemTypes } from '../../../services/apiItems';
import { useQuery } from '@tanstack/react-query';
import { moneyFormat } from '../../../utils/moneyFormater';

const AddItem = ({ register, reset, watch, setValue, onFormUpdate }) => {
  const name = watch('name');
  const description = watch('description');
  const itemType = watch('itemType');
  // initialize images array to RENDER each image
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState();
  // key to choose image again after delete
  const [key1, setKey1] = useState(1);
  const [key2, setKey2] = useState(0);

  const { data: itemTypes } = useQuery({
    queryKey: ['itemTypes'],
    queryFn: () => getAllItemTypes(),
  });

  // reset form after submit
  useEffect(() => {
    reset({
      name: null,
      description: null,
      itemType: null,
      price: null,
    });
  }, []);

  useEffect(() => {
    setValue('price', Number(price));
  }, [price]);

  useEffect(() => {
    // initialize images array to STORE each image
    const tempImageArray = [];
    images.map((image) => {
      if (image) {
        tempImageArray.push(image);
      }
    });
    setValue('images', tempImageArray); // store image array to form use setValue instead of register because <GetImage/> is not a form component
  }, [images]);

  // this use to check if all fields are filled
  useEffect(() => {
    const isFormFilled =
      images.filter((image) => image !== undefined).length >= 1 &&
      name !== '' &&
      price !== '' &&
      description !== '' &&
      itemType !== '';
    onFormUpdate(isFormFilled); // pass isFormFilled to Cat.jsx
  }, [images, watch, name, price, description, itemType, onFormUpdate]);

  // const handlePriceChange = (event) => {
  //   const numericValue = event.target.value.replace(/\D/g, '');
  //   setPrice(numericValue);
  // };

  const handlePriceChange = (event) => {
    const newValue = event.target.value;
    if (!isNaN(newValue) && !newValue.includes(' ')) {
      setPrice(newValue);
    }
  };
  return (
    <>
      <div className='mt-2'>
        <Typography variant='h6'>Name</Typography>
        <TextField
          label='Name'
          color='warning'
          fullWidth
          required
          margin='normal'
          {...register('name')}
        />

        <Typography variant='h6'>Price (VND)</Typography>
        <TextField
          label='Price'
          color='warning'
          fullWidth
          required
          margin='normal'
          onChange={(event) => handlePriceChange(event)}
          value={moneyFormat(price)}
        />

        <Typography variant='h6'>Description</Typography>
        <TextField
          label='Description'
          color='warning'
          fullWidth
          required
          margin='normal'
          multiline
          rows={6}
          {...register('description')}
        />

        <Typography variant='h6'>Item type</Typography>
        <FormControl fullWidth margin='normal'>
          <InputLabel id='demo-simple-select-label'>
            Choose item type
          </InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            label='Choose item type'
            color='warning'
            margin='normal'
            required
            {...register('itemTypeId')}
          >
            {itemTypes?.data &&
              itemTypes?.data.map((type) => (
                <MenuItem key={type._id} value={type._id}>
                  {type.itemTypeName === 'drink' && 'Drink'}
                  {type.itemTypeName === 'foods' && 'Food'}
                  {type.itemTypeName === 'cat foods' && 'Cat Food'}
                  {type.itemTypeName === 'toys' && 'Toys'}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Typography variant='h6' sx={{ pb: 1 }}>
          Image
        </Typography>
        <GetImage
          key={key1}
          fileId={'1'}
          selectedFile={images[0]}
          setSelectedFile={(file) => {
            if (file !== images[0]) {
              setKey1((prevKey) => prevKey + 1);
              setImages((prevImages) => [file, prevImages[1]]);
            }
          }}
        />
        {images[0] && (
          <GetImage
            key={key2}
            fileId={'2'}
            selectedFile={images[1]}
            setSelectedFile={(file) => {
              if (file !== images[1]) {
                setKey2((prevKey) => prevKey - 1);
                setImages((prevImages) => [prevImages[0], file]);
              }
            }}
          />
        )}
      </div>
    </>
  );
};

export default AddItem;
