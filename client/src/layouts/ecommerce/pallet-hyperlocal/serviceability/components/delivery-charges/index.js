import './index.css';
import { Box, Button, Grid, InputLabel, Tooltip } from '@mui/material';
import {
  addDistanceArray,
  addPriceArray,
  addRateArray,
  addWeightArray,
  deleteDistanceArray,
  deletePriceArray,
  deleteWeightArray,
  getDeliveryCost,
  getDistanceArray,
  getInstantDelivery,
  getPickUpCheckBox,
  getPriceArray,
  getRateArray,
  getSelectOption,
  getWeightArray,
  setDeliveryCost,
  setRateArray,
  setRateByDistance,
  setRateByPrice,
  setRateByWeight,
  setSelectOption,
  setpickUpCheckBox,
} from '../../../../../../datamanagement/serviceSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';

const DeliveryCharges = () => {
  const dispatch = useDispatch();
  const selectedOptionData = useSelector(getSelectOption);
  const weightArrayData = useSelector(getWeightArray);
  const priceArrayData = useSelector(getPriceArray);
  const distanceArrayData = useSelector(getDistanceArray);
  const rateArrayData = useSelector(getRateArray);
  const freeCheckBox = useSelector(getPickUpCheckBox);
  const deliveryCost = useSelector(getDeliveryCost);
  const instantDelivery = useSelector(getInstantDelivery);

  const handleInputChange = (option) => {
    dispatch(setSelectOption(option));
  };

  // to delete  row according to optionwise
  const handleDelete = (index) => {
    let deleteAction;

    if (selectedOptionData.value === 'RATE_BY_WEIGHT') {
      deleteAction = deleteWeightArray;
    } else if (selectedOptionData.value === 'RATE_BY_DISTANCE') {
      deleteAction = deleteDistanceArray;
    } else if (selectedOptionData.value === 'RATE_BY_PRICE') {
      deleteAction = deletePriceArray;
    }

    if (deleteAction) {
      dispatch(deleteAction(index));
    }
  };

  const handleWeightDelete = (index) => {
    handleDelete(index);
  };

  const handleDistanceDelete = (index) => {
    handleDelete(index);
  };

  const handlePriceDelete = (index) => {
    handleDelete(index);
  };

  // to change the value of min,max & rate
  const handleChange = (index, field, value) => {
    let updateAction;

    if (selectedOptionData.value === 'RATE_BY_WEIGHT') {
      updateAction = setRateByWeight;
    } else if (selectedOptionData.value === 'RATE_BY_DISTANCE') {
      updateAction = setRateByDistance;
    } else if (selectedOptionData.value === 'RATE_BY_PRICE') {
      updateAction = setRateByPrice;
    } else if (selectedOptionData.value === 'FLAT_RATE') {
      updateAction = setRateArray;
    }

    if (updateAction) {
      const updatedArray = [
        ...(selectedOptionData.value === 'RATE_BY_WEIGHT'
          ? weightArrayData
          : selectedOptionData.value === 'RATE_BY_DISTANCE'
            ? distanceArrayData
            : priceArrayData),
      ];

      const updatedItem = { ...updatedArray[index], [field]: value };
      updatedArray[index] = updatedItem;

      if (selectedOptionData.value === 'FLAT_RATE') {
        dispatch(updateAction({ ...rateArrayData, min: 0, max: 0, [field]: value }));
      } else {
        dispatch(updateAction(updatedArray));
      }
    }
  };

  // to add more row according to optionwise

  const handleAddMore = () => {
    let addAction;

    if (selectedOptionData.value === 'RATE_BY_WEIGHT') {
      addAction = addWeightArray;
    } else if (selectedOptionData.value === 'RATE_BY_DISTANCE') {
      addAction = addDistanceArray;
    } else if (selectedOptionData.value === 'RATE_BY_PRICE') {
      addAction = addPriceArray;
    } else if (selectedOptionData.value === 'FLAT_RATE') {
      addAction = addRateArray;
    }

    if (addAction) {
      if (selectedOptionData.value === 'FLAT_RATE') {
        const newRateObject = { min: 0, max: 0, rate: 0 };
        // Dispatch the addAction with an array containing the newRateObject
        dispatch(addAction([newRateObject]));
        // Also dispatch setRateArray to update the rateArray in the state
        dispatch(setRateArray([...rateArrayData, newRateObject]));
      } else if (selectedOptionData.value === 'RATE_BY_WEIGHT') {
        dispatch(addAction({ min: '', max: '', rate: '' }));
      } else if (selectedOptionData.value === 'RATE_BY_DISTANCE') {
        dispatch(addAction({ min: '', max: '', rate: '' }));
      } else {
        dispatch(addAction({ min: '', max: '', rate: '' }));
      }
    }
  };

  const handleWeightAddMore = () => {
    handleAddMore();
  };

  const handleDistanceAddMore = () => {
    handleAddMore();
  };

  const handlePriceAddMore = () => {
    handleAddMore();
  };

  const handleDeliveryCharges = (e) => {
    const inputText = e.target.value;
    dispatch(setDeliveryCost(Number(inputText)));
  };

  const handleCheckBox = (e) => {
    const inputText = e.target.checked;
    dispatch(setpickUpCheckBox(inputText));
  };

  const handleInstantInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedArray = instantDelivery.map((delivery, i) => {
      if (i === index) {
        return {
          ...delivery,
          [name]: value === '' ? '' : Number(value),
        };
      }
      return delivery;
    });

    dispatch(setInstantDelivery(updatedArray));
  };

  return (
    <Box>
      <SoftBox className="vendors-filter-div">
        <Grid container p={2}>
          <Grid item md={12} sm={12} xs={12} mt={2} ml={-0.5}>
            <SoftTypography fontSize="16px" fontWeight="bold">
              Delivery Charges
            </SoftTypography>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2}>
            <SoftBox mb={1} display="flex">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Select how delivery is calculated:
              </InputLabel>
            </SoftBox>
            <SoftBox display="flex" alignItems="center" gap="10px">
              <SoftSelect
                value={selectedOptionData}
                onChange={(option) => handleInputChange(option)}
                options={[
                  {
                    value: 'FREE_SHIPPING',
                    label: 'Free Shipping',
                  },
                  {
                    value: 'FLAT_RATE',
                    label: 'Flat Rate',
                  },
                  {
                    value: 'RATE_BY_WEIGHT',
                    label: 'Rate by Weight',
                  },
                  {
                    value: 'RATE_BY_DISTANCE',
                    label: 'Rate by Distance',
                  },
                  {
                    value: 'RATE_BY_PRICE',
                    label: 'Rate by Price',
                  },
                ]}
              />
            </SoftBox>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2}>
            {selectedOptionData.value === 'FREE_SHIPPING' ? (
              <>
                <SoftBox display="flex" mt={2} gap="10px"></SoftBox>
              </>
            ) : selectedOptionData.value === 'FLAT_RATE' ? (
              <>
                <SoftBox mb={1} display="flex" gap="3px">
                  <input type="checkbox" checked={freeCheckBox} onChange={handleCheckBox} />
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Offer free shipping when a customer buys over a certain amount{freeCheckBox === true && <b>₹ </b>}
                    <input
                      type="number"
                      value={deliveryCost}
                      disabled={freeCheckBox === false ? true : false}
                      className="shadow-input"
                      onChange={(e) => handleDeliveryCharges(e)}
                    />
                  </InputLabel>
                </SoftBox>

                <SoftBox display="flex" mt={2} gap="10px">
                  <div>
                    <SoftBox mt={2} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Rate</InputLabel>
                    </SoftBox>
                    <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                      <SoftInput
                        type="number"
                        value={selectedOptionData.value === 'FLAT_RATE' ? rateArrayData.rate : ''}
                        onChange={(e) => handleChange(0, 'rate', e.target.value)}
                      />
                    </SoftBox>
                  </div>
                </SoftBox>
              </>
            ) : selectedOptionData.value === 'RATE_BY_WEIGHT' ? (
              <>
                <SoftBox mb={1} display="flex" gap="3px">
                  <input type="checkbox" checked={freeCheckBox} onChange={handleCheckBox} />
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Offer free shipping when a customer buys over a certain amount{freeCheckBox === true && <b>₹ </b>}
                    <input
                      type="number"
                      value={deliveryCost}
                      disabled={freeCheckBox === false ? true : false}
                      className="shadow-input"
                      onChange={(e) => handleDeliveryCharges(e)}
                    />
                  </InputLabel>
                </SoftBox>

                <SoftBox mb={1} mt={1} display="flex" gap={1}>
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', color: '#344767' }}>
                    Slabs
                  </InputLabel>
                  <Tooltip
                    placement="bottom-end"
                    title="(0-5 kg) charges ₹ 20, (5-10 kg) charges ₹ 40,(10-20 kg) charges ₹ 60,(20 kg and above) charges ₹ 100"
                  >
                    <InfoOutlinedIcon fontSize="small" color={'info'} />
                  </Tooltip>
                </SoftBox>

                {weightArrayData.map((e, i) => (
                  <div className="weight-wrapper-box" key={i}>
                    <SoftBox mt={2} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Weight (min)
                      </InputLabel>
                    </SoftBox>
                    <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                      <SoftInput
                        type="number"
                        value={selectedOptionData.value === 'RATE_BY_WEIGHT' ? weightArrayData[i].min : ''}
                        onChange={(e) => handleChange(i, 'min', e.target.value)}
                      />
                    </SoftBox>

                    <SoftBox mt={2} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Weight (max)
                      </InputLabel>
                    </SoftBox>
                    <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                      <SoftInput
                        type="number"
                        onChange={(e) => handleChange(i, 'max', e.target.value)}
                        value={selectedOptionData.value === 'RATE_BY_WEIGHT' ? weightArrayData[i].max : ''}
                      />
                    </SoftBox>

                    <SoftBox mt={2} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Rate</InputLabel>
                    </SoftBox>
                    <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                      <SoftInput
                        type="number"
                        value={selectedOptionData.value === 'RATE_BY_WEIGHT' ? weightArrayData[i].rate : ''}
                        onChange={(e) => handleChange(i, 'rate', e.target.value)}
                      />
                    </SoftBox>

                    <CancelIcon
                      onClick={() => handleWeightDelete(i)}
                      fontSize="small"
                      color="error"
                      className="cancel-cursor-weight"
                    />
                  </div>
                ))}

                <Button onClick={handleWeightAddMore} className="weight-btn-wrapper">
                  Add More +
                </Button>
              </>
            ) : selectedOptionData.value === 'RATE_BY_DISTANCE' ? (
              <>
                <SoftBox mb={1} display="flex" gap="3px">
                  <input type="checkbox" checked={freeCheckBox} onChange={handleCheckBox} />
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Offer free shipping when a customer buys over a certain amount{freeCheckBox === true && <b>₹ </b>}
                    <input
                      type="number"
                      value={deliveryCost}
                      disabled={freeCheckBox === false ? true : false}
                      className="shadow-input"
                      onChange={(e) => handleDeliveryCharges(e)}
                    />
                  </InputLabel>
                </SoftBox>

                <SoftBox mb={1} mt={1} display="flex" gap={1}>
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', color: '#344767' }}>
                    Slabs
                  </InputLabel>
                  <Tooltip
                    placement="bottom-end"
                    title="(0-5 km) charges ₹ 20, (5-10 km) charges ₹ 40,(10-20 km) charges ₹ 60,(20 km and above) charges ₹ 100"
                  >
                    <InfoOutlinedIcon fontSize="small" color={'info'} />
                  </Tooltip>
                </SoftBox>

                {distanceArrayData.map((e, i) => (
                  <div className="weight-wrapper-box" key={i}>
                    <SoftBox mt={2} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Distance (min)
                      </InputLabel>
                    </SoftBox>
                    <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                      <SoftInput
                        type="number"
                        value={selectedOptionData.value === 'RATE_BY_DISTANCE' ? distanceArrayData[i].min : ''}
                        onChange={(e) => handleChange(i, 'min', e.target.value)}
                      />
                    </SoftBox>

                    <SoftBox mt={2} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Distance (max)
                      </InputLabel>
                    </SoftBox>
                    <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                      <SoftInput
                        type="number"
                        value={selectedOptionData.value === 'RATE_BY_DISTANCE' ? distanceArrayData[i].max : ''}
                        onChange={(e) => handleChange(i, 'max', e.target.value)}
                      />
                    </SoftBox>

                    <SoftBox mt={2} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Rate</InputLabel>
                    </SoftBox>
                    <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                      <SoftInput
                        type="number"
                        value={selectedOptionData.value === 'RATE_BY_DISTANCE' ? distanceArrayData[i].rate : ''}
                        onChange={(e) => handleChange(i, 'rate', e.target.value)}
                      />
                    </SoftBox>

                    <CancelIcon
                      onClick={() => handleDistanceDelete(i)}
                      fontSize="small"
                      color="error"
                      className="cancel-cursor-weight"
                    />
                  </div>
                ))}
                <Button onClick={handleDistanceAddMore} className="weight-btn-wrapper">
                  Add More +
                </Button>
              </>
            ) : selectedOptionData.value === 'RATE_BY_PRICE' ? (
              <>
                <SoftBox mb={1} display="flex" gap="3px">
                  <input type="checkbox" checked={freeCheckBox} onChange={(e) => handleCheckBox(e)} />
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Offer free shipping when a customer buys over a certain amount{freeCheckBox === true && <b>₹ </b>}
                    <input
                      type="number"
                      value={deliveryCost}
                      disabled={freeCheckBox === false ? true : false}
                      className="shadow-input"
                      onChange={(e) => handleDeliveryCharges(e)}
                    />
                  </InputLabel>
                </SoftBox>

                <SoftBox mb={1} mt={1} display="flex" gap={1}>
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', color: '#344767' }}>
                    Slabs
                  </InputLabel>
                  <Tooltip
                    placement="bottom-end"
                    title="(₹0-100) charges ₹ 20, (₹200-300) charges ₹ 40,(₹300-400) charges ₹ 60,(₹500 and above) charges ₹ 100"
                  >
                    <InfoOutlinedIcon fontSize="small" color={'info'} />
                  </Tooltip>
                </SoftBox>

                {priceArrayData.map((e, i) => (
                  <div className="weight-wrapper-box" key={i}>
                    <SoftBox mt={2} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Price (min)
                      </InputLabel>
                    </SoftBox>
                    <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                      <SoftInput
                        type="number"
                        value={selectedOptionData.value === 'RATE_BY_PRICE' ? priceArrayData[i].min : ''}
                        onChange={(e) => handleChange(i, 'min', e.target.value)}
                      />
                    </SoftBox>

                    <SoftBox mt={2} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Price (max)
                      </InputLabel>
                    </SoftBox>
                    <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                      <SoftInput
                        type="number"
                        value={selectedOptionData.value === 'RATE_BY_PRICE' ? priceArrayData[i].max : ''}
                        onChange={(e) => handleChange(i, 'max', e.target.value)}
                      />
                    </SoftBox>

                    <SoftBox mt={2} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Rate</InputLabel>
                    </SoftBox>
                    <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                      <SoftInput
                        type="number"
                        value={selectedOptionData.value === 'RATE_BY_PRICE' ? priceArrayData[i].rate : ''}
                        onChange={(e) => handleChange(i, 'rate', e.target.value)}
                      />
                    </SoftBox>

                    <CancelIcon
                      onClick={() => handlePriceDelete(i)}
                      fontSize="small"
                      color="error"
                      className="cancel-cursor-weight"
                    />
                  </div>
                ))}

                <Button onClick={handlePriceAddMore} className="weight-btn-wrapper">
                  Add More +
                </Button>
              </>
            ) : null}
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2}>
            {instantDelivery?.[0]?.instantDeliveryStartTime && instantDelivery?.[0]?.instantDeliveryEndTime ? (
              <>
                <SoftTypography fontSize="16px" fontWeight="bold">
                  Additional charges for instant delivery
                </SoftTypography>
                <SoftBox mt={2} display="flex">
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Surge fee</InputLabel>
                </SoftBox>
                <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                  <SoftInput
                    type="number"
                    value={instantDelivery?.[0]?.surgeFee}
                    onChange={handleInstantInputChange}
                    name="surgeFee"
                  />
                </SoftBox>
                <SoftBox mt={2} display="flex">
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Platform fee
                  </InputLabel>
                </SoftBox>
                <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                  <SoftInput
                    type="number"
                    value={instantDelivery?.[0]?.platformFee}
                    onChange={handleInstantInputChange}
                    name="platformFee"
                  />
                </SoftBox>
                <SoftBox mt={2} display="flex">
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Convenience fee
                  </InputLabel>
                </SoftBox>
                <SoftBox display="flex" alignItems="center" gap="10px" width="120px">
                  <SoftInput
                    type="number"
                    value={instantDelivery?.[0]?.convenienceFee}
                    onChange={handleInstantInputChange}
                    name="convenienceFee"
                  />
                </SoftBox>
              </>
            ) : null}
          </Grid>
        </Grid>
      </SoftBox>
    </Box>
  );
};

export default DeliveryCharges;
