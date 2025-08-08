//soft ui components
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';

//mui
import { InputLabel } from '@mui/material';

//redux
import { getLoyaltyTitle, setTitle } from '../../../../datamanagement/loyaltyProgramSlice';
import { loyaltyRewardStyles } from './newLoyaltyConfig';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export const LoyaltyTitle = () => {
  const dispatch = useDispatch();

  const loyaltyTitle = useSelector(getLoyaltyTitle);
  const handleTitle = (e, type) => {
    dispatch(setTitle(type ? { header: e.target.value } : { subheader: e.target.value }));
  };

  return (
    <SoftBox>
      <SoftTypography variant="h4" fontSize="1.4375rem" fontWeight="bold">What do you want to name your loyalty program?</SoftTypography>
      <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
        <InputLabel required sx={loyaltyRewardStyles}>
                    Header
        </InputLabel>
        <SoftInput
          type="text"
          placeholder="Title"
          style={{ maxHeight: '50px' }}
          onChange={(e) => handleTitle(e, true)}
          value={loyaltyTitle?.header}
        />
      </SoftBox>
      <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
        <InputLabel required sx={loyaltyRewardStyles}>
                    Subtitle
        </InputLabel>
        <SoftInput
          type="text"
          style={{ maxHeight: '50px' }}
          placeholder="Get rewards on every step"
          onChange={(e) => handleTitle(e, false)}
          value={loyaltyTitle?.subheader}
        />
      </SoftBox>
    </SoftBox>
  );
};