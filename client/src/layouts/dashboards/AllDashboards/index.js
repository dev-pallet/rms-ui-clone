import { Skeleton } from '@mui/material';
import { isSmallScreen } from '../../ecommerce/Common/CommonFunction';
import React, { Suspense, lazy } from 'react';

const MobileDashBoard = lazy(() => import('../default/mobileDashBoard'));
const Default = lazy(() => import('../default'));
const HeadOfficeDefault = lazy(() => import('../head-office'));

const AllDashbaord = () => {
  const isMobileDevice = isSmallScreen();
  const isHeadOffice = localStorage.getItem('isHeadOffice');
  return (
    <>
      {isMobileDevice ? (
        <Suspense fallback={<Skeleton variant="rounded" width="100%" height={100} sx={{margin: '10px'}}/>}>
          <MobileDashBoard />
        </Suspense>
      ) :  isHeadOffice === 'true' ? (
        <Suspense fallback={<p></p>}>
          <HeadOfficeDefault />
        </Suspense>
      ) : !isMobileDevice && (
        <Suspense fallback={<p></p>}>
          <Default />
        </Suspense>
      )}
    </>
  );
};

export default AllDashbaord;
