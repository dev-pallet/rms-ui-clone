//react
import { useEffect, useState } from 'react';

//soft ui components
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';

//mui components
import { InputLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

//styles
import './loyalitypoints.css';

//redux
import { getLoyaltyReward, setRewards } from '../../../../datamanagement/loyaltyProgramSlice';
import { getMainCategory } from '../../../../config/Services';
import { loyaltyRewardStyles } from './newLoyaltyConfig';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const LoyaltyReward = () => {
  const dispatch = useDispatch();
  const getRewards = useSelector(getLoyaltyReward);
  const [redeemTypeValue, setRedeemTypeValue] = useState('');
  const loyalty_type = localStorage.getItem('loyaltyType');
  const [selected, setSelected] = useState('cat');
  const [mainCatArr, setMainCatArr] = useState([]);
  const [arr, setArr] = useState([]);
  const [cng, setCng] = useState(false);

  const redeemTypeArray = [
    { label: 'Redeem % discount', value: 'percentage_dis' },
    { label: 'Redeem a free item', value: 'free_item' },
  ];

  const redeemTypeChange = (val) => {
    setRedeemTypeValue(val);
    dispatch(setRewards({ generalAmountSpend: { ...getRewards.generalAmountSpend, rewardType: val } }));
  };

  //updating the value of rewards in redux
  const handleMinPointsReq = (e) => {
    dispatch(setRewards({ minReqPoints: e.target.value }));
  };

  //updating the value of rewards in redux
  const handleItemDetails = (val) => {
    dispatch(
      setRewards({
        generalAmountSpend: {
          ...getRewards.generalAmountSpend,
          rewardType: redeemTypeValue,
          freeItem: redeemTypeValue == 'free_item' ? val : 'nil',
          percentageDis: redeemTypeValue == 'percentage_dis' ? val : 'nil',
        },
      }),
    );
  };

  const handleSelectedChange = (e) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    getMainCategory().then((response) => {
      setArr(response.data.data);
      setCng(!cng);
    });
  }, []);

  useEffect(() => {
    const cat = [];
    arr.map((e) => {
      if (e !== undefined) {
        cat.push({ value: e.mainCategoryId, label: e.categoryName });
      }
    });
    setMainCatArr(cat);
  }, [cng]);

  const mainCatgSelected = mainCatArr.find((opt) => !!opt.value);

  const [mainCatSelected, setMainCat] = useState(mainCatgSelected);

  const loyaltyType = [
    {
      label: 'POS USER',
      value: 'POS_USER',
    },
    {
      label: 'END CUSTOMER',
      value: 'END_CUSTOMER',
    },
    {
      label: 'B2B',
      value: 'B2B',
    },
  ];

  //rendering ui according to the loyalty type
  const renderTypeUI = (type) => {
    switch (type) {
      case 'general_amount_spend':
        return (
          <>
            <InputLabel required sx={loyaltyRewardStyles}>
              Redeem Type
            </InputLabel>
            <SoftBox style={{ width: '100%' }}>
              <SoftSelect
                options={redeemTypeArray}
                style={{ width: '10px' }}
                onChange={(e) => {
                  const value = e.value;
                  redeemTypeChange(value);
                }}
                placeholder="Select reward type"
              />
            </SoftBox>
            {redeemTypeValue == 'free_item' ? (
              <>
                <InputLabel required sx={{ ...loyaltyRewardStyles, marginTop: '10px' }}>
                  Enter item name
                </InputLabel>
                <SoftBox style={{ width: '100%' }}>
                  <SoftInput
                    type="text"
                    placeholder="Item name"
                    style={{ maxHeight: '50px' }}
                    onChange={(e) => handleItemDetails(e.target.value)}
                    // value={amountSpent}
                  />
                </SoftBox>
              </>
            ) : redeemTypeValue == 'percentage_dis' ? (
              <SoftBox style={{ width: '100%' }} mt={2}>
                <InputLabel required sx={loyaltyRewardStyles}>
                  Enter percentage(%)
                </InputLabel>
                <SoftInput
                  type="number"
                  placeholder="Eg: 5%"
                  style={{ maxHeight: '50px' }}
                  onChange={(e) => handleItemDetails(e.target.value)}
                  value={getRewards?.generalAmountSpend?.percentageDis}
                  className="loyalty-reward-input"
                />
                <InputLabel required sx={{ ...loyaltyRewardStyles, marginTop: '20px' }}>
                  Maximum amount that can be redeemed
                </InputLabel>
                <SoftBox style={{ width: '100%' }}>
                  <SoftInput
                    type="text"
                    placeholder="Eg: ₹ 100"
                    style={{ maxHeight: '50px' }}
                    onChange={(e) =>
                      dispatch(
                        setRewards({
                          generalAmountSpend: { ...getRewards.generalAmountSpend, maxAmountPercent: e.target.value },
                        }),
                      )
                    }
                    value={getRewards?.generalAmountSpend?.maxAmountPercent}
                    className="loyalty-reward-input"
                  />
                </SoftBox>
              </SoftBox>
            ) : null}
          </>
        );

      case 'brands':
        return (
          <>
            <InputLabel required sx={loyaltyRewardStyles}>
              Brand Selection
            </InputLabel>
            <SoftBox style={{ width: '100%' }}>
              <SoftSelect
                // options={Validityop}
                style={{ width: '10px' }}
                // onChange={(e) => {
                //   const value = e.value;
                //   onvaliddate(value);
                // }}
                placeholder="Select reward type"
              />
            </SoftBox>
          </>
        );
      case 'categories_or_sku':
        return (
          <>
            <FormControl>
              <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
                <FormControlLabel
                  value="by_cat"
                  control={<Radio onChange={handleSelectedChange} checked={selected === 'cat'} value="cat" />}
                  label="By Categories"
                />
                <FormControlLabel
                  value="by_sku"
                  control={<Radio onChange={handleSelectedChange} checked={selected === 'sku'} value="sku" />}
                  label="By Product"
                />
              </RadioGroup>
            </FormControl>
            {selected == 'cat' ? (
              <>
                <InputLabel required sx={loyaltyRewardStyles}>
                  Main Category
                </InputLabel>
                <SoftBox style={{ width: '100%' }}>
                  <SoftSelect
                    className="loyalty-remainder-days-select"
                    value={mainCatSelected}
                    options={mainCatArr}
                    isMulti={true}
                    onChange={(option) => {
                      setMainCat(option);
                    }}
                  />
                </SoftBox>
                <InputLabel required sx={loyaltyRewardStyles}>
                  Category level 1
                </InputLabel>
                <SoftBox style={{ width: '100%' }}>
                  <SoftSelect
                    className="loyalty-remainder-days-select"
                    // isDisabled={!mainCatSelected || isGen ? true : false}
                    isMulti={true}
                  />
                </SoftBox>
                <InputLabel required sx={loyaltyRewardStyles}>
                  Category level 2
                </InputLabel>
                <SoftBox style={{ width: '100%' }}>
                  <SoftSelect
                    // isDisabled={!cat1 || isGen ? true : false}
                    className="loyalty-remainder-days-select"
                    isMulti={true}
                  />
                </SoftBox>
              </>
            ) : (
              <SoftBox className="loyalty-reward-main-card">
                <InputLabel required sx={loyaltyRewardStyles}>
                  Select the product
                </InputLabel>
                <SoftBox style={{ width: '100%' }} mt={1}>
                  <SoftSelect
                    options={redeemTypeArray}
                    className="loyalty-remainder-days-select"
                    // onChange={(e) => setDateNum(e.value)}
                    // value={dateNum.value}
                    isMulti={true}
                  />
                </SoftBox>
              </SoftBox>
            )}
          </>
        );

      default:
        return 'component not found';
    }
  };
  return (
    <SoftBox>
      <SoftTypography variant="h4" fontSize="23px" fontWeight="bold">
        Configure Stage 1
      </SoftTypography>
      <SoftBox mb={1} ml={0} gap={1} className="input-container">
        <InputLabel required sx={loyaltyRewardStyles}>
          Select Loyalty Type
        </InputLabel>
        <SoftBox style={{ width: '100%', display: 'flex', gap: '1rem' }}>
          <SoftSelect
            options={loyaltyType}
            className="loyalty-type-select"
            onChange={(e) => dispatch(setRewards({ ...getRewards, customer_type: e.value }))}
          />
        </SoftBox>
      </SoftBox>
      <SoftBox mb={3} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
        <InputLabel required sx={loyaltyRewardStyles}>
          Minimum points required to redeem
        </InputLabel>
        <SoftInput
          type="number"
          placeholder="Eg: 100 Points"
          style={{ maxHeight: '50px' }}
          onChange={(e) => handleMinPointsReq(e)}
          value={getRewards?.minReqPoints}
        />
      </SoftBox>
      <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
        {renderTypeUI(loyalty_type)}
      </SoftBox>
    </SoftBox>
  );
};

export default LoyaltyReward;
