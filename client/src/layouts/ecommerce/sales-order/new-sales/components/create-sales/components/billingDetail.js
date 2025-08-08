import { Grid } from '@mui/material';
import { isSmallScreen } from '../../../../../Common/CommonFunction';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../../components/SoftTypography';

const BillingItem = ({
  isMobileDevice,
  label,
  value,
  isBold,
  isInput,
  isCheckbox,
  checked,
  onChange,
  isDisabled,
  setIsCredit,
  handleCouponChange,
  handleLoyality,
}) => {
  // Function to handle checkbox changes based on label
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    if (label === 'Coupon') handleCouponChange(isChecked);
    else if (label === 'Loyalty') handleLoyality(isChecked);
    else setIsCredit(isChecked);
  };

  return (
    <SoftBox className="sales-billing-data" sx={{ border: 'none' }}>
      <SoftBox
        sx={{
          width: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '5px',
        }}
      >
        {isCheckbox && (
          <input type="checkbox" checked={checked} disabled={isDisabled} onChange={handleCheckboxChange} />
        )}
        <SoftTypography
          fontSize={isMobileDevice ? '12px' : isBold ? '16px' : '0.78rem'}
          textAlign="end"
          sx={{ fontWeight: isBold ? 'bold' : 'normal' }}
        >
          {label}
        </SoftTypography>
      </SoftBox>

      {checked && !isInput ? (
        <SoftTypography fontSize={isMobileDevice ? '12px' : '0.78rem'} textAlign={isMobileDevice ? 'end' : 'inherit'}>
          {label === 'Available Credit' ? value : label === 'Loyalty' ? <b> {value}</b> : `${value}`}
        </SoftTypography>
      ) : checked || isInput ? (
        <SoftBox sx={{ width: '40%', my: 1 }}>
          <SoftInput sx={{ padding: '5px' }} type="number" value={value} onChange={onChange} />
        </SoftBox>
      ) : isBold ? (
        <SoftBox
          style={{
            borderTop: '1px solid #dedede',
            borderBottom: '1px solid #dedede',
            width: '40%',
            padding: '5px',
          }}
        >
          <SoftTypography fontSize={'16px'} fontWeight="bold">
            {`₹ ${value}`}
          </SoftTypography>
        </SoftBox>
      ) : (
        <SoftTypography fontSize={isMobileDevice ? '12px' : '0.78rem'} textAlign={isMobileDevice ? 'end' : 'inherit'}>
          {label === 'Available Credit' || label === 'Coupon' || label === 'Loyalty' ? value : `₹ ${value}`}
        </SoftTypography>
      )}
    </SoftBox>
  );
};

const SalesBillingDetailRow = ({ billingItems, setIsCredit, handleCouponChange, handleLoyality }) => {
  const isMobileDevice = isSmallScreen();

  return (
    <Grid item xs={12} md={4} xl={4}>
      <SoftBox className="add-po-bill-details-box" sx={{ border: 'none !important' }}>
        {billingItems?.map((item, index) => (
          <BillingItem
            key={index}
            isMobileDevice={isMobileDevice}
            label={item?.label}
            value={item?.value}
            isBold={item?.isBold}
            isInput={item?.isInput}
            isCheckbox={item?.isCheckbox}
            checked={item?.checked}
            onChange={item?.onChange}
            isDisabled={item?.isDisabled}
            setIsCredit={setIsCredit}
            handleCouponChange={handleCouponChange}
            handleLoyality={handleLoyality}
          />
        ))}
      </SoftBox>
    </Grid>
  );
};

export default SalesBillingDetailRow;
