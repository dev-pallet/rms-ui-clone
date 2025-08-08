import { useEffect, useState } from 'react';
import ProductDetailsPage from '../products-new-page/Products-detail-page';
import RestaurantDetails from './restaurant-details/RestaurantDetails';

const ProductDetailsRouter = () => {
  const [productType, setProductType] = useState(null);

  useEffect(() => {
    const type = localStorage.getItem('retailType');
    setProductType(type);
  }, []);

  if (productType === 'RESTAURANT') {
    return <RestaurantDetails />;
  }

  return <ProductDetailsPage />;
};

export default ProductDetailsRouter;
