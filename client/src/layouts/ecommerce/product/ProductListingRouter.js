import { useState, useEffect } from 'react';
import { AllProducts } from './all-products/all-products';
import { RestaurantListing } from './restaurant-listing/RestaurantListing';

const ProductListingRouter = () => {
  const [productType, setProductType] = useState(null);

  useEffect(() => {
    const type = localStorage.getItem('retailType');
    setProductType(type);
  }, []);

  if (productType === 'RESTAURANT') {
    return <RestaurantListing />;
  }

  return <AllProducts />;
};

export default ProductListingRouter;
