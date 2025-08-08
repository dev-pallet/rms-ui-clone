//soft ui components
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';

//mui components
import { InputLabel } from '@mui/material';
import Switch from '@mui/material/Switch';

//styles
import './loyalitypoints.css';

//react
import { useEffect, useState } from 'react';

//icons
import bluestar from '../../../../assets/images/ecommerce/bluestars.png';
import chilli from '../../../../assets/images/ecommerce/chilli.png';
import coins from '../../../../assets/images/ecommerce/coins.png';
import cookies from '../../../../assets/images/ecommerce/cookies.png';
import star from '../../../../assets/images/ecommerce/star.png';

//redux
import { getLoyaltyPoints, setPoints } from '../../../../datamanagement/loyaltyProgramSlice';
import { loyaltyRewardStyles } from './newLoyaltyConfig';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export const LoyaltyPoints = () => {
  const [checked, setChecked] = useState(false);
  const [dateType, setDateType] = useState('');
  const [dateNum, setDateNum] = useState('');
  const [pBrand, setPBrand] = useState('');
  const dispatch = useDispatch();
  const getPoints = useSelector(getLoyaltyPoints);

  const [isClicked, setIsClicked] = useState({
    chilli: false,
    cookies: false,
    coins: false,
    stars: false,
  });

  const handlePointsEarnedSpend = (val, type) => {
    dispatch(
      setPoints(type == 'spend' ? { amountSpend: val } : type == 'earns' ? { pointsGiven: val } : { pointsValue: val }),
    );
  };

  const switchHandler = (event) => {
    setChecked(event.target.checked);
  };

  const handlePointBranding = (e) => {
    dispatch(setPoints({ pointsBrand: e.target.value }));
    setPBrand(e.target.value);
  };

  const handlePointsBrandingSuggestion = (val) => {
    const itemName = val.toLowerCase();
    setPBrand(val);

    dispatch(setPoints({ pointsBrand: val }));
    const newClickedState = {
      chilli: false,
      cookies: false,
      coins: false,
      stars: false,
    };
    newClickedState[itemName] = true;
    setIsClicked(newClickedState);
  };

  const pointsInspArray = [
    { label: 'Chilli', src: chilli, selected: isClicked.chilli },
    { label: 'Cookies', src: cookies, selected: isClicked.cookies },
    { label: 'Coins', src: coins, selected: isClicked.coins },
    { label: 'Star', src: star, selected: isClicked.stars },
  ];

  const numObject = Array.from({ length: 100 }, (_, index) => ({
    label: (index + 1).toString(),
    value: index + 1,
  }));

  const dwmArray = [
    { label: 'Days', value: 'days' },
    { label: 'Weeks', value: 'weeks' },
    { label: 'Months', value: 'months' },
  ];

  function addDaysWeeksMonths(originalDate, numberOfUnits, unitType) {
    const date = new Date(originalDate);

    switch (unitType) {
      case 'days':
        date.setDate(date.getDate() + numberOfUnits);
        break;
      case 'weeks':
        date.setDate(date.getDate() + numberOfUnits * 7);
        break;
      case 'months':
        date.setMonth(date.getMonth() + numberOfUnits);
        break;
      default:
        return 'Invalid unit';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    if (dateNum != '' || dateType != '') {
      const currentDate = new Date();
      const newDateAfterWeeks = addDaysWeeksMonths(currentDate, dateNum, dateType);
      dispatch(setPoints({ validity: newDateAfterWeeks, date: dateNum }));
    }
  }, [dateNum, dateType]);

  return (
    <SoftBox>
      <SoftTypography variant="h4" fontSize="1.4375rem" fontWeight="bold">
        How much points customers can earn?
      </SoftTypography>
      <SoftBox className="loyalty-terms-scroll">
        <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
          <InputLabel required sx={loyaltyRewardStyles}>
            Every time customer spends
          </InputLabel>
          <SoftInput
            type="number"
            placeholder="₹"
            style={{ maxHeight: '50px' }}
            onChange={(e) => handlePointsEarnedSpend(e.target.value, 'spend')}
            value={getPoints?.amountSpend}
          />
        </SoftBox>
        <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
          <InputLabel required sx={loyaltyRewardStyles}>
            Customer earns
          </InputLabel>
          <SoftInput
            type="number"
            onChange={(e) => handlePointsEarnedSpend(e.target.value, 'earns')}
            value={getPoints?.pointsGiven}
          />
        </SoftBox>
        <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
          <InputLabel required sx={loyaltyRewardStyles}>
            Value of each point earned
          </InputLabel>
          <SoftInput
            type="number"
            style={{ maxHeight: '50px' }}
            placeholder="eg: ₹5"
            onChange={(e) => handlePointsEarnedSpend(e.target.value, 'points_val')}
            value={getPoints?.pointsValue}
          />
        </SoftBox>
        <SoftBox className="loyalty-branding-box" mt={2}>
          <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold">
            Points branding
          </SoftTypography>
          <Switch {...label} checked={checked} onChange={switchHandler} size="medium" />
        </SoftBox>
        {checked ? (
          <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
            <InputLabel required sx={loyaltyRewardStyles}>
              Add Plural for the name
            </InputLabel>
            <SoftInput
              type="text"
              style={{ maxHeight: '50px' }}
              placeholder="eg: Points"
              inputProps={{ maxLength: 11 }}
              onChange={handlePointBranding}
              value={pBrand}
            />
            <InputLabel sx={{ fontSize: '0.9rem', color: 'lightgrey' }}>{pBrand.length + '/11 characters'}</InputLabel>
            <SoftBox className="points-insp-box">
              <img src={bluestar} alt="" className="points-insp-image icon-margin" />
              <SoftTypography className="points-text-box">Inspiration for points naming</SoftTypography>
            </SoftBox>
            <SoftBox className="points-insp-main-box">
              {pointsInspArray?.map((e) => {
                return (
                  <SoftBox
                    className={e.selected ? 'points-insp-chip-selected' : 'points-insp-chip'}
                    onClick={() => handlePointsBrandingSuggestion(e.label)}
                  >
                    <img src={e.src} alt="" className="points-insp-image" />
                    <SoftTypography variant="h4" fontSize="1rem">
                      {e.label}
                    </SoftTypography>
                  </SoftBox>
                );
              })}
            </SoftBox>
          </SoftBox>
        ) : null}
        <SoftBox mb={1} ml={0} display="flex" flexDirection="column" gap={1} className="input-container">
          <InputLabel required sx={loyaltyRewardStyles}>
            Points Validity
          </InputLabel>
          <SoftBox style={{ width: '100%', display: 'flex', gap: '1rem' }}>
            <SoftSelect
              options={numObject}
              className="loyalty-remainder-days-select"
              onChange={(e) => setDateNum(e.value)}
            />
            <SoftSelect
              options={dwmArray}
              className="loyalty-remainder-select-box"
              onChange={(e) => setDateType(e.value)}
            />
          </SoftBox>
        </SoftBox>
        <SoftBox className="points-preview-main-box">
          <SoftTypography variant="h4" fontSize="1rem">
            Customers{' '}
            <b className="points-preview-box">
              earn {getPoints?.pointsGiven} {getPoints.pointsGiven == 1 ? 'point' : 'points'}
            </b>{' '}
            on every <b className="points-preview-box">₹{getPoints?.amountSpend} spent.</b>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
};
