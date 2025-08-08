//react
import { useState } from 'react';

//soft ui components
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';

//mui components
import { Checkbox } from '@mui/material';

//images
import bluestar from '../../../../assets/images/ecommerce/bluestars.png';

//styles
import './loyalitypoints.css';

//redux
import { getLoyaltyTerms, setTerms } from '../../../../datamanagement/loyaltyProgramSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export const LoyaltyTerms = () => {
  const dispatch = useDispatch();
  const getTerms = useSelector(getLoyaltyTerms);

  //terms & conditions array data
  const [checkboxes, setCheckboxes] = useState([
    { label: 'Maximum no of transaction per day.', checked: false, value: getTerms?.num_trans_per_day || '' },
    { label: 'Minimum purchase required for redemption.', checked: false, value: getTerms?.minPurchaseReq || '' },
    {
      label: 'Maximum reward points per transaction.',
      checked: false,
      value: getTerms?.max_reward_per_transaction || '',
    },
    {
      label: 'Loyalty points can be redeemed with other coupons/ discounts.',
      checked: false,
      value: getTerms?.clubbed,
    },
    { label: 'Otp validation required for redemption.', checked: false, value: getTerms?.otp_validation },
    { label: 'Enable customer blacklisting for loyalty', checked: false, value: getTerms?.blacklistEnabled },
  ]);

  //updating value of checkbox to render the input tags
  const handleTerms = (e, index) => {
    index == 3
      ? dispatch(setTerms({ ...getTerms, clubbed: e.target.checked }))
      : index == 4
        ? dispatch(setTerms({ ...getTerms, otp_validation: e.target.checked }))
        : index == 5
          ? dispatch(setTerms({ ...getTerms, blacklistEnabled: e.target.checked }))
          : null;
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox, i) => (i === index ? { ...checkbox, checked: !checkbox.checked } : checkbox)),
    );
  };

  //updating the terms and conditions
  const handleTermValues = (e, i) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox, index) => (index === i ? { ...checkbox, value: e.target.value } : checkbox)),
    );
    dispatch(
      setTerms(
        i == 0
          ? { ...getTerms, num_trans_per_day: e.target.value }
          : i == 1
            ? { ...getTerms, minPurchaseReq: e.target.value }
            : i == 2
              ? { ...getTerms, max_reward_per_transaction: e.target.value }
              : null,
      ),
    );
  };

  const handleBlackListing = (e, action) => {
    dispatch(
      setTerms(
        action == 'd'
          ? { ...getTerms, blackListingOrderThresholdPerDay: e.target.value }
          : action == 'm'
            ? { ...getTerms, blackListingOrderThresholdPerMonth: e.target.value }
            : action == 'dv'
              ? { ...getTerms, blackListingOrderValueThresholdPerDay: e.target.value }
              : action == 'mv'
                ? { ...getTerms, blackListingOrderValueThresholdPerMonth: e.target.value }
                : null,
      ),
    );
  };

  return (
    <SoftBox>
      <SoftTypography variant="h4" fontSize="1.4375rem" fontWeight="bold">
        Edit Terms & Conditions
      </SoftTypography>
      <SoftBox className="points-insp-box" my={2}>
        <img src={bluestar} alt="err" className="points-insp-image" />
        <SoftTypography className="points-text-box" fontSize="1rem">
          Popular Suggestions
        </SoftTypography>
      </SoftBox>
      <SoftBox className="loyalty-terms-scroll">
        {' '}
        {checkboxes.map((ele, index) => (
          <SoftBox className="loyalty-reward-main-card" key={index}>
            <SoftBox className="loyalty-reward-checkbox-card">
              <SoftTypography variant="h4" fontSize="1rem">
                {ele.label}
              </SoftTypography>
              <Checkbox
                {...label}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                type="checkbox"
                checked={ele.checked}
                onChange={(e) => handleTerms(e, index)}
              />
            </SoftBox>
            {ele.checked && index !== 3 && index !== 4 && index !== 5 ? (
              <SoftInput
                type="number"
                placeholder="enter here..."
                style={{ maxHeight: '50px' }}
                className="loyalty-reward-input"
                onChange={(e) => handleTermValues(e, index)}
                value={ele.value}
              />
            ) : ele.checked && index === 5 ? (
              <>
                <SoftTypography variant="h5" className="blacklist-terms">
                  Enter the maximum number of orders that should be blacklisted in a day
                </SoftTypography>
                <SoftInput
                  type="number"
                  placeholder="enter here..."
                  style={{ maxHeight: '50px' }}
                  className="loyalty-reward-input"
                  onChange={(e) => handleBlackListing(e, 'd')}
                  value={getTerms?.blackListingOrderThresholdPerDay}
                />
                <SoftTypography variant="h5" className="blacklist-terms">
                  Enter the maximum number of orders that should be blacklisted in a month
                </SoftTypography>
                <SoftInput
                  type="number"
                  placeholder="enter here..."
                  style={{ maxHeight: '50px' }}
                  className="loyalty-reward-input"
                  onChange={(e) => handleBlackListing(e, 'm')}
                  value={getTerms.blackListingOrderThresholdPerMonth}
                />
                <SoftTypography variant="h5" className="blacklist-terms">
                  Enter the maximum order value that should be blacklisted in a day
                </SoftTypography>
                <SoftInput
                  type="number"
                  placeholder="enter here..."
                  style={{ maxHeight: '50px' }}
                  className="loyalty-reward-input"
                  onChange={(e) => handleBlackListing(e, 'dv')}
                  value={getTerms.blackListingOrderValueThresholdPerDay}
                />
                <SoftTypography variant="h5" className="blacklist-terms">
                  Enter the maximum order value that should be blacklisted in a month
                </SoftTypography>
                <SoftInput
                  type="number"
                  placeholder="enter here..."
                  style={{ maxHeight: '50px' }}
                  className="loyalty-reward-input"
                  onChange={(e) => handleBlackListing(e, 'mv')}
                  value={getTerms.blackListingOrderValueThresholdPerMonth}
                />
              </>
            ) : null}
          </SoftBox>
        ))}
      </SoftBox>
    </SoftBox>
  );
};
