import './couponCard.css';
import { Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';

const CouponCard = ({ data, handleApplyCoupon, color,couponData }) => {
  const [isApplied,setIsApplied] = useState(false);

  useEffect(() => {
    if(couponData){
      if(couponData?.cartCouponId === data?.couponId){
        setIsApplied(true);
      }
    }
  }, [couponData]);
  return (
    <SoftBox className="coupon-main-div po-box-shadow">
      <SoftBox className="coupon-circle-cut-div">
        <div className="coupon-circle-cut"></div>
        <div className="coupon-circle-cut"></div>
      </SoftBox>
      <SoftBox
        className="coupon-name-div"
        //   sx={{backgroundColor: `${color} !important`}}
      >
        {data?.discountType === 'PERCENTAGE' ? (
          <Typography className="coupon-name">{data?.discountUpto}% OFF</Typography>
        ) : (
          <Typography className="coupon-name">₹{data?.discountValue} OFF</Typography>
        )}
      </SoftBox>
      {/* Details */}
      <SoftBox className="coupon-info-main-div">
        <SoftBox className="coupon-code-div ">
          <Stack>
            <Typography className="coupon-code-name-sales">Coupon Code</Typography>
            <Typography className="coupon-code-sales">{data?.couponCode}</Typography>
            <Typography className="coupon-sales-offerName">{data?.offerName}</Typography>
          </Stack>
          <Button variant="text" className="coupon-apply-button" onClick={() => handleApplyCoupon(data)} disable={isApplied} sx={{color: isApplied && '#0562fb !important'}}>
            {isApplied ? 'Applied' : 'Apply'}
          </Button>
        </SoftBox>
        <SoftBox className="coupon-discount-div">
          {data?.discountType === 'PERCENTAGE' ? (
            <Typography className="coupon-dicount-sales">
              Get <strong>%{data?.discountValue}</strong> discount upto <strong>₹{data?.discountUpto}</strong> on order
              above <strong>₹{data?.minOrderValue}</strong>
            </Typography>
          ) : (
            <Typography className="coupon-dicount-sales">
              Get <strong>₹{data?.discountValue}</strong> discount on order above{' '}
              <strong>₹{data?.minOrderValue}</strong>
            </Typography>
          )}
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
};

export default CouponCard;
