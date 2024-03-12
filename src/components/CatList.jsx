import React from 'react';
import LazyLoadImage from './LazyLoadImage';
import Button from './Button';
import CardItem from './CardItem';
import { LiaTransgenderSolid } from 'react-icons/lia';
import { FaCat } from 'react-icons/fa6';

const CatList = ({ shopId, catId, img, catName, catGender, catKind }) => {
  return (
    <CardItem
      img={img}
      title={catName}
      firstInfoLabel={<LiaTransgenderSolid />}
      firstInfo={catGender}
      secondInfoLabel={<FaCat />}
      secondInfo={catKind}
    >
      <Button
        type='large'
        openModal={true}
        modalLabel='cat'
        shopId={shopId}
        catId={catId}
      >
        View Detail
      </Button>
    </CardItem>
  );
};

export default CatList;
