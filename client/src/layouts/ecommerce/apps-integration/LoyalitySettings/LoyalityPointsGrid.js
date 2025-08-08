//react
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//soft ui components
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';

//custom components
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import Spinner from '../../../../components/Spinner';

//mui components
import { Card, Chip, FormControlLabel, FormGroup, Grid, Switch } from '@mui/material';

//redux
import { setPoints, setRewards, setTerms, setTitle } from '../../../../datamanagement/loyaltyProgramSlice';
import { useDispatch } from 'react-redux';

// images
import image from '../../../../assets/images/ecommerce/loyalty_pr.png';

// icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

//api
import { activateLoyaltyProgram, deleteLoyaltyProgram, disableLoyaltyProgram } from '../../../../config/Services';

const LoyalityPointsGrid = ({ data, loader, mainData, setDeleted }) => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const dispatch = useDispatch();
  const [disableOp, setDisableOp] = useState('');
  const [active, setActive] = useState(true);
  const createdById = JSON.parse(localStorage.getItem('user_details')).uidx;
  const contextType = localStorage.getItem('contextType');
  const sourceOrgId = localStorage.getItem('orgId');

  // .loyalty-settings-card-img
  const handleEditLoyalty = () => {
    if (mainData?.configId) {
      localStorage.setItem('loyaltyConfigId', mainData?.configId);
      setActive(mainData?.configurationStatus == 'ACTIVE' ? true : false);
      dispatch(setTitle({ header: mainData?.header, subheader: mainData?.subTitle }));
      dispatch(
        setPoints({
          pointsGiven: mainData?.rewardRatePoint,
          amountSpend: mainData?.rewardRateAmount,
          pointsBrand: 'Points',
          pointsValue: mainData?.rewardRatePointValue,
          validity: mainData?.expiryAfter,
          date: mainData?.expiryAfter,
        }),
      );
      dispatch(
        setRewards({
          minReqPoints: mainData?.rewardUptoPoint,
          generalAmountSpend: {
            rewardType: '',
            freeItem: 'nil',
            percentageDis: mainData?.redeemPercentage,
            maxAmountPercent: mainData?.redeemAmountUpto,
            cashDiscount: 'nil',
          },
        }),
      );
      dispatch(
        setTerms({
          num_trans_per_day: '',
          minPurchaseReq: '',
          max_reward_per_transaction: mainData?.rewardMinPurchasePrice,
          clubbed: mainData?.redeemableIfCouponApplied,
          otp_validation: mainData?.otpValidation,
          blacklistEnabled: mainData?.blackListing,
          blackListingOrderThresholdPerDay: mainData?.blackListingOrderThresholdPerDay,
          blackListingOrderThresholdPerMonth: mainData?.blackListingOrderThresholdPerMonth,
          blackListingOrderValueThresholdPerDay: mainData?.blackListingOrderValueThresholdPerDay,
          blackListingOrderValueThresholdPerMonth: mainData?.blackListingOrderValueThresholdPerMonth,
        }),
      );
    }
  };

  const handleLoyaltyActive = (e) => {
    setActive(e.target.checked);
  };

  useEffect(() => {
    if (mainData?.configId) {
      const payload = {
        userId: createdById,
        sourceType: contextType,
        sourceOrgId: sourceOrgId,
        targetConfigId: mainData?.configId,
      };
      !active
        ? disableLoyaltyProgram(payload)
          .then((res) => {})
          .catch((err) => {
            setActive(!active);
            showSnackBar('Loyalty disabling failed. Please try again!', 'error');
          })
        : activateLoyaltyProgram(payload)
          .then((res) => {})
          .catch((err) => {
            setDisableOp('');
            setActive(!active);
            showSnackBar('Loyalty activation failed. Please try again!', 'error');
          });
    }
  }, [active]);

  const deleteLoyaltyProgramFn = () => {
    const payload = {
      userId: createdById,
      sourceType: contextType,
      sourceOrgId: sourceOrgId,
      targetConfigId: mainData?.configId,
    };
    deleteLoyaltyProgram(payload).then((res) => {
      setDeleted(true);
      showSnackBar('Successfully deleted the loyalty program.', 'success');
      dispatch(setTitle({ header: 'Header', subheader: 'Subheader' }));
      dispatch(
        setPoints({
          pointsGiven: '1',
          amountSpend: '100',
          pointsBrand: 'Points',
          pointsValue: '10',
          validity: '',
          date: '',
        }),
      );
      dispatch(
        setRewards({
          minReqPoints: '100',
          generalAmountSpend: {
            rewardType: '',
            freeItem: 'nil',
            percentageDis: '',
            maxAmountPercent: '',
            cashDiscount: 'nil',
          },
        }),
      );
      dispatch(
        setTerms({ num_trans_per_day: '2', minPurchaseReq: '1000', max_reward_per_transaction: '', clubbed: '' }),
      );
    });
  };

  const handleEditProgram = () => {
    handleEditLoyalty();
    navigate('/new-loyalty-config/configuration/general-amount-spend/edit');
  };

  return (
    <Grid item xs={12} md={6} xl={6}>
      <Card className={`loyalty-details-card ${!active ? 'disabled-program' : 'activated-program'}`}>
        {loader ? (
          <Spinner />
        ) : (
          <>
            <img className="loyalty-settings-card-img" src={image} alt="error" />
            <SoftBox>
              <SoftTypography varaint="h3" fontSize="1.2rem" fontWeight="bold">
                {data?.header}
              </SoftTypography>
              <SoftTypography varaint="h3" fontSize="1rem" fontWeight="bold">
                {data?.subheading}
              </SoftTypography>
              <SoftTypography varaint="p" fontSize="1rem" fontWeight="bold">
                Earn {data?.pointsEarned} point on every ₹{data?.amountSpent} spent
              </SoftTypography>
              <SoftTypography varaint="p" fontSize="1rem" fontWeight="bold">
                1 point = ₹{data?.pointValue}
              </SoftTypography>
              <SoftTypography varaint="p" fontSize="1rem" fontWeight="bold">
                Minimum purchase amount : {data?.minPurchaseAmt}
              </SoftTypography>
              <SoftBox>
                <Chip className="whatsapp-chip-loyalty chip-common-style" label="Whatsapp" />
                <Chip label="Email" className="chip-common-style" />
              </SoftBox>
              <SoftBox ml={1.5}>
                <FormGroup>
                  <FormControlLabel
                    control={<Switch checked={active} onChange={handleLoyaltyActive} />}
                    label="Active"
                  />
                </FormGroup>
              </SoftBox>
              <SoftBox className="loyalty-details-icons">
                <button className="loyalty-button-config red-clr">
                  <DeleteIcon color="error" className="loyalty-icon-config" onClick={deleteLoyaltyProgramFn} />
                </button>
                <button className="loyalty-button-config blue-clr" onClick={() => handleEditProgram()}>
                  <EditOutlinedIcon color="info" className="loyalty-icon-config" />
                </button>
              </SoftBox>
            </SoftBox>
          </>
        )}
      </Card>
    </Grid>
  );
};

export default LoyalityPointsGrid;
