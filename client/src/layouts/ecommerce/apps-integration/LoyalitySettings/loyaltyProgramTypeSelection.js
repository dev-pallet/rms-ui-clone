//mui components
import { Grid } from '@mui/material';

//soft ui components
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';
import WavedBlogCard from 'examples/Cards/BlogCards/WavedBlogCard';

//images

import img1 from '../../../../assets/images/ecommerce/brands-logos.png';
import img2 from '../../../../assets/images/ecommerce/sku.png';
import img3 from '../../../../assets/images/ecommerce/cart-purchase.png';

export const LoyaltyProgramTypeSelection = () => {

  const typeSelectionArray = [
    {
      image: img3,
      title: 'General Amount Spend',
      des: 'This program is about getting rewarded with points for the amount you spend on each purchase.',
      label: 'Create New',
      route: '/new-loyalty-config/configuration/general-amount-spend/create'
    },
    {
      image: img1,
      title: 'Brands',
      des: 'This program is about getting rewarded with points for a particular brand.',
      label: 'Create New',
      route: '/new-loyalty-config/configuration/brands/create'
    },
    {
      image: img2,
      title: 'Categories or SKU\'s',
      des: 'This program is about getting rewarded with points for specific categories or products available in strore.',
      label: 'Create New',
      route: '/new-loyalty-config/configuration/categories_sku/create'
    }
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox>
        <SoftTypography variant="h4" fontSize="1.4375rem" fontWeight="bold">Loyalty Configuration Type Selection</SoftTypography>
      </SoftBox>
      <Grid container spacing={3}>
        {typeSelectionArray?.map((e) => (
          <Grid item xs={12} md={6} xl={4}>
            <WavedBlogCard
              image={e.image}
              title={e.title}
              description={e.des}
              action={{
                type: 'internal',
                route: e.route,
                color: 'info',
                label: e.label,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
};