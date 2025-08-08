import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete, Button, Card, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, TextField } from '@mui/material';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { getLocationwarehouseData, getRetailUserLocationDetails } from '../../../../config/Services';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';

const DynamicCoupon = () => {
  const [DynamicCoupon, SetDynamicCoupon] = useState(true);
  const [checkbox, setCheckbox] = useState([
    { name: 'WMS', checked: false, displayImage: '', image: '' },
    { name: 'RMS', checked: false, displayImage: '', image: '' },
    { name: 'APP', checked: false, displayImage: '', image: '' },
    { name: 'POS', checked: false, displayImage: '', image: '' },
  ]);
  const LocalorgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [locations, setLocations] = useState([]);
  const [locOp, setLocOp] = useState([]);
  const orgId = localStorage.getItem('orgId');
  const contextType = localStorage.getItem('contextType');
  const [discount, setDiscount] = useState({ value: 'FLAT_OFF', label: 'Rs' });
  const [discountType, setDiscountType] = useState({ value: 'All', label: 'All' });
  const [discountValue, setDiscountValue] = useState('');
  const [discountUpto, setDiscountUpto] = useState('');
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const discountop = [
    { value: 'FLAT_OFF', label: 'Rs' },
    { value: 'PERCENTAGE', label: '%' },
  ];

  useEffect(() => {
   
    if (contextType == 'RETAIL') {
      getRetailUserLocationDetails(orgId).then((res) => {
        const loc = res?.data?.data?.branches.map((e) => {
          return {
            value: e.branchId,
            label: e.displayName,
          };
        });
        setLocOp(loc);
      });
    } else if (contextType == 'WMS') {
      getLocationwarehouseData(orgId).then((res) => {
        const loc = res?.data?.data?.locationDataList.map((e) => {
          return {
            value: e.locationId,
            label: e.locationName,
          };
        });
        setLocOp(loc);
      });
    }
  }, []);
  
  const handleNegativeVal = (event) => {
    if (event.charCode < 48 && event.charCode !== 32 && event.charCode !== 37) {
      event.preventDefault();
    }
  };
  const handleChange = (index) => {
    setCheckbox((prevState) => {
      return prevState.map((item, id) => {
        return index === id ? { ...item, checked: !item.checked } : item;
      });
    });
  };

  const removeImage = (index) => {
    setCheckbox((prevState) => {
      return prevState.map((item, id) => {
        return index === id ? { ...item, image: '', displayImage: '' } : item;
      });
    });
  };

  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{fontSize:'0.9rem'}}>
          Are you Sure to {DynamicCoupon ?   'Disable' : 'Enable' } Coupon Dynamic Coupon?
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { handleClose();}}>Disagree</Button>
          <Button onClick={() => { handleClose(); SetDynamicCoupon(!DynamicCoupon); }} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Card style={{ padding: '15px' }}> <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>Dynamic Coupon </div>
        {/* <Switch checked={DynamicCoupon}  onClick={handleClickOpen} /> */}
      </SoftBox></Card>
     

      <br />
      {DynamicCoupon &&   <Card style={{ padding: '15px' }}>
        <SoftBox style={{ display: 'flex', justifyContent: 'space-between',marginTop: '10px' }}>
          <SoftTypography style={{fontSize:'1rem', display:'flex', alignItems:'center'}}> <SettingsIcon fontSize="medium" style={{marginRight:'10px'}} /> Configration </SoftTypography>
        </SoftBox>
        {/* <hr style={{ color: 'blue', backgroundColor: 'lightgray', marginTop: '10px',marginBottom: '10px', height: '1px', border: 'none' }} /> */}

        <SoftBox style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={6}>
              <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
        Discount
                </InputLabel>
                <SoftSelect
                  options={discountop}
                  value={discount}
                  onChange={(e) => {
                    setDiscount(e);
                    setDiscountUpto('');
                    setDiscountValue('');
                  }}
                />
              </SoftBox>
            </Grid>
            {discount.value === 'PERCENTAGE' && (
              <>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
            Percentage
                    </InputLabel>
                    <SoftInput
                      onWheel={(e) => e.target.blur()}
                      onKeyPress={(e) => handleNegativeVal(e)}
                      value={discountValue}
                      type="number"
                      icon={{
                        component: '%',
                        direction: 'right',
                      }}
                      onChange={(e) => setDiscountValue(e.target.value)}
                    />
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
            Discount Upto
                    </InputLabel>
                    <SoftInput
                      onWheel={(e) => e.target.blur()}
                      onKeyPress={(e) => handleNegativeVal(e)}
                      value={discountUpto}
                      type="number"
                      icon={{
                        component: '₹',
                        direction: 'left',
                      }}
                      onChange={(e) => setDiscountUpto(e.target.value)}
                    />
                  </SoftBox>
                </Grid>
              </>
            )}
            {discount.value === 'FLAT_OFF' && (
              <Grid item xs={12} md={6} lg={6}>
                <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
          Discount Amount
                  </InputLabel>
                  <SoftInput
                    onWheel={(e) => e.target.blur()}
                    onKeyPress={(e) => handleNegativeVal(e)}
                    value={discountValue}
                    type="number"
                    icon={{
                      component: '₹',
                      direction: 'left',
                    }}
                    onChange={(e) => setDiscountValue(e.target.value)}
                  />
                </SoftBox>
              </Grid>
            )}
            <Grid item xs={12} md={6} lg={6}>
              <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
      Max usage per Customer
                </InputLabel>
                <SoftInput></SoftInput>
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
        Valid days
                </InputLabel>
                <SoftSelect options={[
   
                  { 'value': 5, 'label': '5' },
                  { 'value': 10, 'label': '10' },
                  { 'value': 15, 'label': '15' },
                  { 'value': 20, 'label': '20' },
                  { 'value': 25, 'label': '25' },
                  { 'value': 30, 'label': '30' },
                  { 'value': 60, 'label': '60' }
  
  
                ]}></SoftSelect>    </SoftBox>
            </Grid>
            <Grid item xs={12} >
              <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                {' '}
                <FormGroup sx={{ marginLeft: '17px' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={limit}
                        onChange={() => {
                          setLimit(!limit);
                          setDateFrom('');
                          setDateTo('');
                          setTimeFrom('');
                          setTimeTo('');
                        }}
                      />
                    }
                    label="Set Coupon Validity"
                  />
                </FormGroup>
              </SoftBox>
            </Grid>
            {limit && (
              <>
                <Grid item xs={12} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Valid from:
                    </InputLabel>
                    <SoftInput
                      onKeyPress={(e) => handleNegativeVal(e)}
                      onWheel={(e) => e.target.blur()}
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </SoftBox>
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Valid Upto:
                    </InputLabel>
                    <SoftInput
                      onKeyPress={(e) => handleNegativeVal(e)}
                      onWheel={(e) => e.target.blur()}
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </SoftBox>
                </Grid>
                <Grid item xs={6} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['TimePicker']}>
                        <DemoItem style={{ width: '100%' }}>
                          <SoftTypography required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                          Time From:
                          </SoftTypography>
                          <TimePicker value={timeFrom} onChange={(newValue) => setTimeFrom(convertTime(newValue.$d))} />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                  </SoftBox>
                </Grid>

                <Grid item xs={6} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['TimePicker']}>
                        <DemoItem style={{ width: '100%' }}>
                          <SoftTypography required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                          Time Upto:
                          </SoftTypography>
                          <TimePicker value={timeTo} onChange={(newValue) => setTimeTo(convertTime(newValue.$d))} />
                        </DemoItem>
                      </DemoContainer>
                    </LocalizationProvider>
                  </SoftBox>
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6} lg={6}>
              <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
        Cart Value
                </InputLabel>
                <SoftInput></SoftInput>
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
        No of Coupons to be Issued
                </InputLabel>
                <SoftSelect options={[
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' },
                ]}></SoftSelect>
              </SoftBox>
            </Grid>
            {/* <Grid item xs={12} md={6} lg={6}>
    <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
      <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
        Max usage per Customer
      </InputLabel>
      <SoftInput></SoftInput>
    </SoftBox>
  </Grid> */}
            <Grid item xs={12} md={6} lg={6}>
              <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Location
                </InputLabel>

                <Autocomplete
                  multiple
                  options={locOp}
                  onChange={(event, newValue) => {
                    setLocations(newValue);
                  }}
                  getOptionLabel={(option) => option.label}
                  filterSelectedOptions
                  renderInput={(params) => <TextField {...params} placeholder="Select" />}
                />
              </SoftBox>
            </Grid>
          </Grid>

        </SoftBox>

        <SoftBox style={{ display: 'flex' , marginTop:'10px' }}>
          {' '}
          <SoftBox>
            <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Notify Customer
            </InputLabel>
            <FormControl component="fieldset" variant="standard">
              <FormGroup sx={{ display: 'flex', flexDirection: 'row', marginLeft: '17px' }}>
                {/* {checkbox.map(({ name, checked, displayImage, image }, i) => ( */}
                <FormControlLabel
                  control={
                    <Checkbox
                      //   checked={checked}
                      //   onChange={() => {
                      //     handleChange(i);
                      //     removeImage(i);
                      //   }}
                      //   name={"name"}
                    />
                  }
                  label={'SMS'}
                  sx={{ marginRight: '20px' }}
                />
                {/* ))} */}
              </FormGroup>
            </FormControl>
            <FormControl component="fieldset" variant="standard">
              <FormGroup sx={{ display: 'flex', flexDirection: 'row', marginLeft: '17px' }}>
                {/* {checkbox.map(({ name, checked, displayImage, image }, i) => ( */}
                <FormControlLabel
                  control={
                    <Checkbox
                      //   checked={checked}
                      //   onChange={() => {
                      //     handleChange(i);
                      //     removeImage(i);
                      //   }}
                      //   name={"name"}
                    />
                  }
                  label={'WHATSAPP'}
                  sx={{ marginRight: '20px' }}
                />
                {/* ))} */}
              </FormGroup>
            </FormControl>
          </SoftBox>
          {' '}
        </SoftBox>
        <SoftBox style={{marginTop:'10px'}}>
          <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Print With Bill
          </InputLabel>
          <FormControl component="fieldset" variant="standard">
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', marginLeft: '17px' }}>
              {/* {checkbox.map(({ name, checked, displayImage, image }, i) => ( */}
              <FormControlLabel
                control={
                  <Checkbox
                    //   checked={checked}
                    //   onChange={() => {
                    //     handleChange(i);
                    //     removeImage(i);
                    //   }}
                    //   name={"name"}
                  />
                }
                //   label={name}
                sx={{ marginRight: '20px' }}
              />
              {/* ))} */}
            </FormGroup>
          </FormControl>
        </SoftBox>
        <SoftBox style={{marginTop:'10px'}}>
          <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Combine Coupons
          </InputLabel>
          <FormControl component="fieldset" variant="standard">
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', marginLeft: '17px' }}>
              {/* {checkbox.map(({ name, checked, displayImage, image }, i) => ( */}
              <FormControlLabel
                control={
                  <Checkbox
                    //   checked={checked}
                    //   onChange={() => {
                    //     handleChange(i);
                    //     removeImage(i);
                    //   }}
                  />
                }
                label={'Yes'}
                sx={{ marginRight: '20px' }}
              />
              {/* ))} */}
            </FormGroup>
          </FormControl>
          <FormControl component="fieldset" variant="standard">
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', marginLeft: '17px' }}>
              {/* {checkbox.map(({ name, checked, displayImage, image }, i) => ( */}
              <FormControlLabel
                control={
                  <Checkbox
                    //   checked={checked}
                    //   onChange={() => {
                    //     handleChange(i);
                    //     removeImage(i);
                    //   }}
                    // name={"NO"}
                  />
                }
                label={'No'}
                sx={{ marginRight: '20px' }}
              />
              {/* ))} */}
            </FormGroup>
          </FormControl>
        </SoftBox>
        <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' , marginTop:'10px'}}>
            Sales Channels
        </InputLabel>
        <FormControl component="fieldset" variant="standard">
          <FormGroup sx={{ display: 'flex', flexDirection: 'row', marginLeft: '17px' }}>
            {checkbox.map(({ name, checked, displayImage, image }, i) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={() => {
                      handleChange(i);
                      removeImage(i);
                    }}
                    name={name}
                  />
                }
                label={name}
                key={i}
                sx={{ marginRight: '20px' }}
              />
            ))}
          </FormGroup>
        </FormControl>

        <SoftBox
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <SoftButton
            variant="gradient"
            color="info"
            style={{ marginLeft: '20px', float: 'right', margin: '10px' }}
            // onClick={onCancel}
          >
              Cancel
          </SoftButton>
          <SoftButton
            variant="gradient"
            color="info"
            style={{ marginLeft: '20px', float: 'right', margin: '10px' }}
            // onClick={onsave}
          >
              Apply
          </SoftButton>
        </SoftBox>
      </Card>}
      
    </DashboardLayout>
  );
};

export default DynamicCoupon;
