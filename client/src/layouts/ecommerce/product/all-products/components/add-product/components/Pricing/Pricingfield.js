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
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';

// NewProduct page components
import './pricing.css';
import { Button } from '@mui/material';
import { isSmallScreen } from '../../../../../../Common/CommonFunction';
import { useDebounce } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { verifyBatch } from '../../../../../../../../config/Services';
import CloseIcon from '@mui/icons-material/Close';

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

function PricingField({
  setOpeningStack,
  setMrp,
  setSalePrice,
  setPurchasePrice,
  mrp,
  unitOption,
  setSpOption,
  purchasePrice,
  salePrice,
  openingStack,
  batchNo,
  setBatchNo,
  expDate,
  setExpDate,
  handleAddmore,
  SetCount,
  count,
  SetQuantity,
  quantity,
  barcode,
  manBarcode,
  setSeverity,
  setErrorMsg,
  setOpen,
  setBatchPresent,
  weighingScale,
}) {
  let tempModalData = {};
  const [open, setOpen1] = useState(false);
  const [batchCheck, setBatchCheck] = useState('');
  const [batchChange, setBatchChange] = useState(false);
  const locId = localStorage.getItem('locId');
  const debouncedValue = useDebounce(batchCheck, 500);


  const handleOpen = () => {
    tempModalData = {
      openingStack: openingStack,
      batchNo: batchNo,
      expDate: expDate,
    };
    setOpen1(true);
  };
  const handleClose = () => {
    setOpeningStack('0');
    setBatchNo('');
    setExpDate('');
    setOpen1(false);
  };

  const handleCloseSave = () => {
    if (!openingStack) {
      setOpeningStack('0');
    }
    setOpen1(false);
  };

  useEffect(() => {
    let newBarCode = '';
    if (barcode !== '') {
      newBarCode = barcode;
    } else {
      newBarCode = manBarcode;
    }
    if (batchChange && !weighingScale) {
      verifyBatch(locId, newBarCode, debouncedValue)
        .then((res) => {
          setBatchChange(false);
          if (res?.data?.data?.object.available === true) {
            setSeverity('error');
            setErrorMsg('Batch already present, add another batch');
            setOpen(true);
            setBatchCheck('');
            setBatchPresent(false);
          } else {
            setSeverity('success');
            setErrorMsg(res.data.data.message);
            setOpen(true);
            setBatchCheck('');
            setBatchPresent(true);
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
    const updatedBatchNos = [...batchNo];
    updatedBatchNos[index] = e.target.value;
    setBatchNo(updatedBatchNos);
  };

  useEffect(() => {
    if (unitOption.label === 'Grams') {
      setSpOption({ value: 'Grams', label: 'gms' });
    } else if (unitOption.label === 'Kilograms') {
      setSpOption({ value: 'Kilograms', label: 'kg' });
    } else if (unitOption.label === 'Millilitres') {
      setSpOption({ value: 'Millilitres', label: 'ml' });
    } else if (unitOption.label === 'Litres') {
      setSpOption({ value: 'Litres', label: 'Litres' });
    } else {
      setSpOption({ value: 'each', label: 'each' });
    }
  }, [unitOption]);

  const handleDelete = (index) => {
    const updatedBatchNos = [...batchNo];
    updatedBatchNos.splice(index, 1);
    setBatchNo(updatedBatchNos);

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

    SetCount(count - 1);
  };
  const isMobileDevice = isSmallScreen();
  
  return (
    <Card className={`${isMobileDevice && 'po-box-shadow'}`}>
      <SoftTypography variant="h5" fontWeight="bold" pt={3} px={3}>
        Batch Details
      </SoftTypography>
      <SoftBox px={3} pb={3} sx={{ overflow: 'auto' }}>        
        {Array.from({ length: count }).map((e, index) => (
          <SoftBox mt={1} key={index} style={{ minWidth: '1000px' }}>
            <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item xs={1.5} sm={1.5} md={1.5} mt={index === 0 ? '10px' : '-1px'}>
                {index === 0 && (
                  <SoftBox mb={1} display="flex">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Batch No
                    </InputLabel>
                  </SoftBox>
                )}

                <SoftInput
                  value={batchNo[index]}
                  onChange={(e) => handleInputChange(e, index)}
                  // onChange={(e) => {
                  //   const updatedBatchNos = [...batchNo];
                  //   updatedBatchNos[index] = e.target.value;
                  //   setBatchNo(updatedBatchNos);
                  // }}
                />
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
                    SetQuantity(updatedQty);
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
                  value={mrp !== '' ? mrp[index] : ''}
                  // disabled={isGen ? true : false}
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
                  value={mrp !== '' ? salePrice[index] : ''}
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
                  value={mrp !== '' ? purchasePrice[index] : ''}
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

              <SoftBox
                className="close-icons"
                mt={index === 0 ? '52px' : '28px'}
                width="25px"
                onClick={() => handleDelete(index)}
              >
                <CloseIcon />
              </SoftBox>
            </Grid>
          </SoftBox>
        ))}
        <Button onClick={handleAddmore} className="add-more-text" style={{ textTransform: 'none' }}>
          + Add More
        </Button>
      </SoftBox>
    </Card>
  );
}

export default PricingField;
