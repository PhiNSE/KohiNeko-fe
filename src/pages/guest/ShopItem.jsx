import React from 'react';

const ShopItem = () => {
  return (
    <>
      shops.map((shop) => (
      <Card
        key={shop.id}
        image={shop?.images[0]?.url}
        header={shop.shopName}
        content={shop.description}
      />
      ))}
    </>
  );
};

export default ShopItem;
