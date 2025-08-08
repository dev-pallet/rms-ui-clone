/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';

// Soft UI Dashboard PRO React components
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../../../components/SoftTypography';

// NewProduct page components
import { Button } from '@mui/material';
import { isSmallScreen } from '../../../../../../Common/CommonFunction';
import { useDebounce } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { verifyBatch } from '../../../../../../../../config/Services';
import CloseIcon from '@mui/icons-material/Close';
import Spinner from '../../../../../../../../components/Spinner';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

function EditPricingField({
  setMrp,
  setSalePrice,
  setPurchasePrice,
  mrp,
  unitOption,
  purchasePrice,
  salePrice,
  setBatchNo,
  setInventoryId,
  expDate,
  setExpDate,
  handleAddmore,
  SetCount,
  count,
  setQuantity,
  quantity,
  batchno,
  availableUnits,
  setAvailableUnits,
  inventoryId,
  fixedCount,
  setSeverity,
  setErrorMsg,
  setOpen,
  setBatchPresent,
  invetoryLoader
}) {
  const tempModalData = {};
  const [open, setOpen1] = useState(false);
  const [batchCheck, setBatchCheck] = useState('');
  const [batchChange, setBatchChange] = useState(false);
  const { id } = useParams();
  const locId = localStorage.getItem('locId');
  const debouncedValue = useDebounce(batchCheck, 500);
  const isMobileDevice = isSmallScreen();



  useEffect(() => {
    if(batchChange){
      verifyBatch(locId, id, debouncedValue )
        .then((res) => {
          setBatchChange(false);
          if(res.data.data.object.available === true){
            setSeverity('error');
            setErrorMsg('Batch already present, add another batch');
            setOpen(true);
            setBatchCheck('');
            setBatchPresent(true);
          }else{
            setSeverity('success');
            setErrorMsg(res.data.data.message);
            setOpen(true);
            setBatchCheck('');
            setBatchPresent(false);
          }
        })
        .catch((err) => {
          setBatchChange(false);
          setSeverity('error');
          setErrorMsg(err?.response?.data?.message);
          setOpen(true);
          setBatchCheck('');
          setBatchPresent(false);
        });
    }
  }, [debouncedValue]);

  const handleInputChange = (e, index) => {
    setBatchChange(true);
    setBatchPresent(false);
    setBatchCheck(e.target.value);
    const updatedBatchNos = [...batchno];
    updatedBatchNos[index] = e.target.value;
    setBatchNo(updatedBatchNos);

  };


  useEffect(() => {

  }, [unitOption]);

  const handleDelete = (index) => {
    const updatedBatchNos = [...batchno];
    updatedBatchNos.splice(index, 1);
    setBatchNo(updatedBatchNos);

    const updatedinventoryId = [...inventoryId];
    updatedinventoryId.splice(index, 1);
    setInventoryId(updatedinventoryId);

    const updatedAvailableUnits = [...availableUnits];
    updatedAvailableUnits.splice(index, 1);
    setAvailableUnits(updatedAvailableUnits);

    const updatedmrp = [...mrp];
    updatedmrp.splice(index, 1);
    setMrp(updatedmrp);

    const updatedSalePrices = [...salePrice];
    updatedSalePrices.splice(index, 1);
    setSalePrice(updatedSalePrices);

    const updatedpurchasePrices = [...purchasePrice];
    updatedpurchasePrices.splice(index, 1);
    setPurchasePrice(updatedpurchasePrices);

    const updatedexpDate = [...expDate];
    updatedexpDate.splice(index, 1);
    setExpDate(updatedexpDate);

    const updatedquantity = [...quantity];
    updatedquantity.splice(index, 1);
    setQuantity(updatedquantity);

    SetCount(count - 1);
  };

  return (
    <Card sx={{ overflow: 'auto', marginTop: '20px' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
      <SoftBox p={3}>
        <SoftBox display="flex" gap="30px">
          <SoftTypography variant="h5" fontWeight="bold">
            Batch Details
          </SoftTypography>
          {invetoryLoader
            ?<SoftTypography variant="h5" fontWeight="bold">
              <Spinner />
            </SoftTypography>
            :null
          }
        </SoftBox>
        {Array.from({ length: count }).map((e, index) => (
          <SoftBox mt={1} key={index} style={{minWidth:'900px'}}>
            <Grid container spacing={3} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item xs={2} sm={2} md={2} mt={index === 0 ? '10px' : '-1px'} display={index !== 0 ? 'flex' : ''}>
                {index === 0 && (
                  <SoftBox mb={1} display="flex">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Batch No
                    </InputLabel>
                  </SoftBox>
                )}
                <SoftBox display='flex' alignItems='center' gap='10px'>
                  <SoftInput
                    value={batchno[index]}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                  
                  {/* <SoftBox>
                    <CheckCircleOutlineIcon color='success'/>
                  </SoftBox> */}
                </SoftBox>


              </Grid>
              <Grid item xs={1.5} sm={1.5} md={1.5} mt={index === 0 ? '10px' : '-1px'}>
                {index === 0 && (
                  <SoftBox mb={1} display="flex">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Quantity
                    </InputLabel>
                  </SoftBox>
                )}

                <SoftInput
                  type="number"
                  value={quantity[index]}
                  onChange={(e) => {
                    const updatedQty = [...quantity];
                    updatedQty[index] = e.target.value;
                    setQuantity(updatedQty);
                  }}
                />
              </Grid>
              <Grid item xs={1.5} sm={1.5} md={1.5} mt={index === 0 ? '10px' : '-1px'}>
                {index === 0 && (
                  <SoftBox mb={1} display="flex">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Available Units
                    </InputLabel>
                  </SoftBox>
                )}

                <SoftInput
                  type="number"
                  value={availableUnits[index]}
                  onChange={(e) => {
                    const updatedAvailableUnits = [...availableUnits];
                    updatedAvailableUnits[index] = e.target.value;
                    setAvailableUnits(updatedAvailableUnits);
                  }}
                />
              </Grid>

              <Grid item xs={1.5} sm={1.5} md={1.5}>
                {index === 0 && (
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      MRP
                    </InputLabel>
                  </SoftBox>
                )}

                <SoftInput
                  value={mrp[index]}
                  type="number"
                  //   // disabled={isGen ? true : false}
                  onChange={(e) => {
                    const updatedmrp = [...mrp];
                    updatedmrp[index] = e.target.value;
                    setMrp(updatedmrp);
                  }}
                />
              </Grid>

              <Grid item xs={1.5} sm={1.5} md={1.5}>
                {index === 0 && (
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Selling Price
                    </InputLabel>
                  </SoftBox>
                )}
                <SoftInput
                  type="number"
                  value={salePrice[index]}
                  onChange={(e) => {
                    const updatedSalePrices = [...salePrice];
                    updatedSalePrices[index] = e.target.value;
                    setSalePrice(updatedSalePrices);
                  }}
                />
              </Grid>

              <Grid item xs={1.5} sm={1.5} md={1.5}>
                {index === 0 && (
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Purchase Price
                    </InputLabel>
                  </SoftBox>
                )}
                <SoftInput
                  type="number"
                  value={purchasePrice[index]}
                  onChange={(e) => {
                    const updatedpurchasePrices = [...purchasePrice];
                    updatedpurchasePrices[index] = e.target.value;
                    setPurchasePrice(updatedpurchasePrices);
                  }}
                />
              </Grid>

              

              <Grid item xs={2} sm={2} md={2} mt={index === 0 ? '10px' : '-1px'}>
                {index === 0 && (
                  <SoftBox mb={1} display="flex">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Expiry Date
                    </InputLabel>
                  </SoftBox>
                )}
                <SoftInput
                  type="date"
                  value={expDate[index]}
                  onChange={(e) => {
                    const updatedexpDate = [...expDate];
                    updatedexpDate[index] = e.target.value;
                    setExpDate(updatedexpDate);
                  }}
                />
                {/* <SoftInput value={expDate} onChange={(e) => setExpDate(e.target.value)} /> */}
              </Grid>
              {index >= fixedCount ? (
                <SoftBox
                  className="close-icons"
                  mt={index === 0 ? '52px' : '28px'}
                  width="25px"
                  onClick={() => handleDelete(index)}
                >
                  <CloseIcon />
                </SoftBox>
              ) : <SoftBox
                className="close-icons"
                mt={index === 0 ? '52px' : '28px'}
                width="25px"
           
              >
             
              </SoftBox>}
            </Grid>
          </SoftBox>
        ))}
        <Button onClick={handleAddmore}>+ Add more</Button>
      </SoftBox>
    </Card>
  );
}

export default EditPricingField;
