import { individualCoupon, updateCouponStatus } from '../../../../config/Services';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import EditCartCoupon from './editCartCoupon';
import EditFreebieCoupon from './editFreebieCoupon';
import EditProductCoupon from './editProductCoupon';
import React, { useEffect, useRef, useState } from 'react';

const CouponActivateDeactivate = () => {
  const { CouponId } = useParams();
  const [couponData, setCouponDetails] = useState([]);
  useEffect(() => {
    individualCoupon(CouponId)
      .then((res) => {
        setCouponDetails(res?.data?.data?.coupon);
      })
      .catch((err) => {});
  }, []);

  const handleButtonClick = () => {
    if (couponRef.current) {
      window.scrollTo({
        top: couponRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const OnUpdate = (status) => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const payload = {
      couponId: CouponId,
      couponStatus: status,
      updatedBy: uidx,
    };

    updateCouponStatus(payload)
      .then((res) => {
        // setCouponDetails(res?.data?.data?.coupon);
      })
      .catch((err) => {});
    handleButtonClick();
  };

  const couponRef = useRef(null);
  const userName = localStorage.getItem('user_name');

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {couponData?.couponType === 'CART_VALUE' && <EditCartCoupon couponData={couponData} />}
      {couponData?.couponType === 'FREEBIE' && <EditFreebieCoupon couponData={couponData} />}
      {couponData?.couponType === 'CATEGORY' && <EditProductCoupon couponData={couponData} />}

      {/* <Card style={{ marginTop: '60px', padding: '30px' }}>
        <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SoftButton variant="gradient" color="info" onClick={() => OnUpdate('ACTIVE')}>
            ACTIVE
          </SoftButton>
          <SoftButton variant="gradient" color="warning" onClick={() => OnUpdate('INACTIVE')}>
            INACTIVE
          </SoftButton>
          <SoftButton variant="gradient" color="error" onClick={() => OnUpdate('DISABLED')}>
            DELETE
          </SoftButton>
        </SoftBox>
      </Card> */}
    </DashboardLayout>
  );
};

export default CouponActivateDeactivate;
