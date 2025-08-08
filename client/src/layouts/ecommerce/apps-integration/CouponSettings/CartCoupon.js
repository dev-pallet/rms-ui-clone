import './CartCoupon.css';
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete, Card, CircularProgress, Grid, InputLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {
  createCoupon,
  getLocationwarehouseData,
  getRetailUserLocationDetails,
  getUserDetails,
  manufacturerSearch,
} from '../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import moment from 'moment';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CartCoupon = () => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [errormsg, setErrorMsg] = useState('');
  const [loader, setLoader] = useState(false);

  const [discount, setDiscount] = useState({ value: 'FLAT_OFF', label: 'Rs' });
  const [discountType, setDiscountType] = useState({ value: 'All', label: 'All' });
  const [couponCode, setCouponCode] = useState('');
  const [offerName, setOfferName] = useState('');
  const [description, setDescription] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountUpto, setDiscountUpto] = useState('');
  const [limit, setLimit] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [totalUsage, setTotalUsage] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [userUsage, setUserUsage] = useState('');
  const [combined, setCombined] = useState(false);
  const [catOp, setCatOp] = useState([]);
  const [categories, setCategories] = useState([]);
  const [manuOp, setManuOp] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [locOp, setLocOp] = useState([]);
  const [locations, setLocations] = useState([]);
  const [cartValue, setCartValue] = useState('');
  const [image, setImage] = useState('');
  const [displayImage, setDisplayImage] = useState('');
  const [checkbox, setCheckbox] = useState([]);
  const [orgIds, setOrgIds] = useState({});
  const LocalorgId = localStorage.getItem('orgId');

  const navigate = useNavigate();

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const discountop = [
    { value: 'FLAT_OFF', label: 'Rs' },
    { value: 'PERCENTAGE', label: '%' },
  ];

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

  useEffect(() => {
    const orgId = localStorage.getItem('orgId');
    const contextType = localStorage.getItem('contextType');

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
    getUserDetails()
      .then((res) => {
        const data = res.data.data;
        const orgId = {};
        const channels = [
          { name: 'RMS', checked: false, displayImage: '', image: '' },
          { name: 'APP', checked: false, displayImage: '', image: '' },
          { name: 'POS', checked: false, displayImage: '', image: '' },
        ];
        const locId = localStorage.getItem('locId');

        // if (
        //   data?.roles.includes('WAREHOUSE_USER') &&
        //   data?.contexts?.WAREHOUSE_USER &&
        //   data?.contexts?.WAREHOUSE_USER &&
        //   data?.contexts?.WAREHOUSE_USER?.meta?.some((item) => item?.org_id === LocalorgId)
        // ) {
        //   channels.push({ name: 'WMS', checked: false, displayImage: '', image: '' });
        //   orgId.warehouseId = LocalorgId;
        //   orgId.warehouseLoc = locId;
        // }
        // if (
        //   data?.roles.includes('RETAIL_USER') &&
        //   data?.contexts?.RETAIL_USER &&
        //   data?.contexts?.RETAIL_USER?.meta?.some((item) => item?.org_id === LocalorgId)
        // ) {
        //   channels.push(
        //     { name: 'RMS', checked: false, displayImage: '', image: '' },
        //     { name: 'APP', checked: false, displayImage: '', image: '' },
        //   );
        //   orgId.retailId = LocalorgId;
        //   orgId.retailLoc = locId;
        // }
        // if (
        //   data?.roles.includes('POS_USER') &&
        //   data?.contexts?.POS_USER &&
        //   data?.contexts?.POS_USER &&
        //   data?.contexts?.POS_USER?.meta?.some((item) => item?.org_id === LocalorgId)
        // ) {
        //   channels.push({ name: 'POS', checked: false, displayImage: '', image: '' });
        // }
        setCheckbox(channels);
        setOrgIds(orgId);
      })
      .catch((err) => {
        setSeverity('error');
        setErrorMsg('Cannot fetch user details');
        setOpen(true);
      });
  }, []);

  const onSelectFile = (event, index) => {
    setCheckbox((prevState) => {
      const selectedFiles = event.target.files;
      const selectedFilesArray = Array.from(selectedFiles);
      // setImage(selectedFilesArray[0]);
      const image = selectedFilesArray[0];
      // selectedFilesArray.map((e) => {
      //   setBlobImages((prev) => [...prev, e]);
      // });

      const displayImage = URL.createObjectURL(selectedFilesArray[0]);

      // setDisplayImage(imagesArray);

      // FOR BUG IN CHROME
      event.target.value = '';
      return prevState.map((item, id) => {
        return index === id ? { ...item, image: image, displayImage: displayImage } : item;
      });
    });
  };

  const convertTime = (time) => {
    const date = moment.utc(time).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();
    return moment(stillUtc).local().format('HH:mm');
  };

  const handleManuTitle = (title) => {
    if (title?.length > 2) {
      manufacturerSearch(title).then((response) => {
        const manu = response?.data?.data.map((e) => {
          return {
            value: e.manufactureName,
            label: e.manufactureName,
          };
        });
        setManuOp(manu);
      });
    }
  };

  const handleSave = () => {
    let limitExist = false;
    const customerArr = [];
    let applicableOn = '';
    checkbox.forEach(({ name, checked }) => {
      if (checked) {
        limitExist = true;
        if (name === 'POS') {
          const orgId = localStorage.getItem('orgId');
          const locId = localStorage.getItem('locId');
          applicableOn = 'END_USER';
          customerArr.push({
            orgId: orgId,
            orgLocationId: locId,
            orgType: 'RETAIL',
            customerType: name,
          });
        } else if (name === 'RMS') {
          const orgId = localStorage.getItem('orgId');
          const locId = localStorage.getItem('locId');
          applicableOn = 'ORG';
          customerArr.push({
            orgId: orgId,
            orgLocationId: locId,
            orgType: 'RETAIL',
            customerType: name,
          });
        } else if (name === 'APP') {
          const orgId = localStorage.getItem('orgId');
          const locId = localStorage.getItem('locId');
          applicableOn = 'ALL';
          customerArr.push({
            orgId: orgId,
            orgLocationId: locId,
            orgType: 'RETAIL',
            customerType: name,
          });
        } else if (name === 'RMS' && name === 'APP' && name === 'POS') {
          const orgId = localStorage.getItem('orgId');
          const locId = localStorage.getItem('locId');
          applicableOn = 'ALL';
          customerArr.push({
            orgId: orgId,
            orgLocationId: locId,
            orgType: 'RETAIL',
            customerType: name,
          });
        } else {
          const orgId = localStorage.getItem('orgId');
          const locId = localStorage.getItem('locId');
          applicableOn = 'ORG';
          customerArr.push({
            orgId: orgId,
            orgLocationId: locId,
            orgType: 'WMS',
            customerType: name,
          });
        }
      }
    });
    if (
      !couponCode ||
      !offerName ||
      !maxBudget ||
      !totalUsage ||
      !locations?.length ||
      !cartValue ||
      (discount?.value == 'FLAT_OFF' ? !discountValue : !discountUpto || !discountValue) ||
      (limit ? !dateFrom || !dateTo : false) ||
      !customerArr.length
    ) {
      setSeverity('warning');
      setErrorMsg('Please fill all required fields');
      setOpen(true);
      return;
    }
    const locId = localStorage.getItem('locId');
    const orgId = localStorage.getItem('orgId');
    const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
    const contextType = localStorage.getItem('contextType');

    const locArr = [];
    locations.forEach((e) => {
      locArr.push(e.value);
    });

    if (
      customerArr.length > 1 &&
      customerArr.some((c) => c.customerType === 'POS') &&
      customerArr.some((c) => c.customerType === 'WMS' || c.customerType === 'RMS' || c.customerType === 'APP')
    ) {
      applicableOn = 'ALL';
    }
    const payload = {
      couponCode: couponCode,
      couponType: 'CART_VALUE',
      createdBy: uidx,
      offerName: offerName,
      description: description,
      termsAndConditions: termsAndConditions,
      discountType: discount.value,
      discountValue: discountValue,
      discountUpto: discountUpto,
      sourceLocationId: locId,
      sourceOrgType: contextType,
      sourceOrgId: orgId,
      validPeriodExist: limit,
      validFrom: dateFrom || null,
      validTo: dateTo || null,
      validTimeFrom: timeFrom || '00:00',
      validTimeTo: timeTo || '23:59',
      minOrderValue: cartValue,
      maxUsagePerUser: userUsage || 'NO_LIMIT',
      usageLimitExist: userUsage ? true : false,
      maxTotalUsage: totalUsage,
      budget: maxBudget,
      validPeriodExist: limit,
      combined: combined,
      preApproved: false,
      applicableOn: applicableOn,
      applicableProductType: [],
      applicableBrand: [],
      applicableLocation: locArr,
      couponApplicableCustomersList: customerArr,
    };

    const formData = new FormData();
    formData.append(
      'coupon',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );
    // if (!image) {
    //   formData.append('file', []);
    // } else {
    //   formData.append('file', image);
    // }
    checkbox.forEach(({ name, checked, image }) => {
      if (image) {
        if (name === 'POS') {
          formData.append('pos_image', image);
        }
        if (name === 'WMS') {
          formData.append('wms_image', image);
        }
        if (name === 'RMS') {
          formData.append('rms_image', image);
        }
        if (name === 'APP') {
          formData.append('app_image', image);
        }
      }
    });

    createCoupon(formData)
      .then((res) => {
        if (res.data.data.es === 0) {
          setLoader(false);
          setSeverity('success');
          setErrorMsg('Coupon Created Successfully');
          setOpen(true);
          setTimeout(() => {
            navigate('/marketing/Coupons');
          }, 2000);
        } else {
          setLoader(false);
          setSeverity('error');
          setErrorMsg(res.data.data.message);
          setOpen(true);
        }
      })
      .catch((err) => {
        setLoader(false);
        setSeverity('error');
        if (err.message === 'Request failed with status code 400') {
          setErrorMsg('Invalid max usage per customer');
        } else {
          setErrorMsg(err.message);
        }
        setOpen(true);
      });
  };

  const handleNegativeVal = (event) => {
    if (event.charCode < 48 && event.charCode !== 32 && event.charCode !== 37) {
      event.preventDefault();
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Card style={{ padding: '20px', display: 'flex' }}>
        <SoftTypography variant="h5" m={0.5} mb={2}>
          Cart Value
        </SoftTypography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Coupon Title
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                onKeyPress={(e) => handleNegativeVal(e)}
                style={{ maxHeight: '50px' }}
                value={offerName}
                onChange={(e) => setOfferName(e.target.value)}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Coupon Code
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                onKeyPress={(e) => handleNegativeVal(e)}
                style={{ maxHeight: '50px' }}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Description</InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                onKeyPress={(e) => handleNegativeVal(e)}
                value={description}
                placeholder="Enter description for the coupon"
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={5}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Terms & Conditions
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                onKeyPress={(e) => handleNegativeVal(e)}
                value={termsAndConditions}
                placeholder="Enter Terms & Conditions for the coupon"
                onChange={(e) => setTermsAndConditions(e.target.value)}
                // readOnly={isGen ? true : false}
                multiline
                rows={5}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Maximum Budget
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                onKeyPress={(e) => handleNegativeVal(e)}
                style={{ maxHeight: '50px' }}
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
              />
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              {' '}
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Total Coupons to be issued
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                onKeyPress={(e) => handleNegativeVal(e)}
                value={totalUsage}
                type="number"
                onChange={(e) => setTotalUsage(e.target.value)}
              />
            </SoftBox>
          </Grid>

          {/* <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Location
              </InputLabel>
              <SoftSelect value={locations} onChange={(e) => setLocations(e)} options={locOp} isMulti />
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
          <Grid item xs={12} md={6} lg={6}></Grid>
          <Grid item xs={12} md={6} lg={6}>
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
          <Grid item xs={12} md={6} lg={6}></Grid>
          {limit && (
            <>
              <Grid item xs={12} md={3} lg={3}>
                <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Valid from:
                  </InputLabel>
                  <SoftInput
                    onWheel={(e) => e.target.blur()}
                    onKeyPress={(e) => handleNegativeVal(e)}
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
                    onWheel={(e) => e.target.blur()}
                    onKeyPress={(e) => handleNegativeVal(e)}
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
                Minimum Cart Value
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                onKeyPress={(e) => handleNegativeVal(e)}
                style={{ maxHeight: '50px' }}
                type="number"
                value={cartValue}
                onChange={(e) => setCartValue(e.target.value)}
              />
            </SoftBox>
          </Grid>
          <Grid
            item
            xs={discount.value === 'PERCENTAGE' ? 4 : 6}
            md={discount.value === 'PERCENTAGE' ? 2 : 3}
            lg={discount.value === 'PERCENTAGE' ? 2 : 3}
          >
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              {' '}
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
              <Grid item xs={4} md={2} lg={2}>
                <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                  {' '}
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
              <Grid item xs={4} md={2} lg={2}>
                <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                  {' '}
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
            <Grid item xs={6} md={3} lg={3}>
              <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
                {' '}
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
          {/* {checkbox.some((el) => el.checked) && ( */}
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              {' '}
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Maximum usage per customer
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                onKeyPress={(e) => handleNegativeVal(e)}
                value={userUsage}
                type="number"
                onChange={(e) => setUserUsage(e.target.value)}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Combine with other coupons?
              </InputLabel>
              <SoftBox style={{ display: 'flex' }}>
                <RadioGroup
                  style={{ flexDirection: 'row', marginLeft: '17px' }}
                  value={combined ? 'yes' : 'no'}
                  onChange={(e) => setCombined(e.target.value === 'yes' ? true : false)}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </SoftBox>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <SoftBox
              mb={1}
              ml={0.5}
              display="flex"
              flexDirection="row"
              gap={1}
              className="input-container"
              style={{ height: '100%' }}
            >
              <SoftBox style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Sales Channels
                </InputLabel>
                <FormControl component="fieldset" variant="standard">
                  <FormGroup sx={{ marginLeft: '17px' }}>
                    {checkbox.map(({ name, checked, displayImage, image }, i) => (
                      <>
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
                        />
                        {checked && (
                          <SoftBox className="upload-box">
                            <input
                              type="file"
                              name="images"
                              id={`file-${i}`}
                              onChange={(e) => {
                                onSelectFile(e, i);
                              }}
                              accept="image/png , image/jpeg, image/webp"
                            />
                            {image ? (
                              <SoftBox display="flex" flexDirection="column" alignItems="center" gap={2}>
                                <SoftBox
                                  component="img"
                                  src={displayImage}
                                  key={displayImage}
                                  alt=""
                                  borderRadius="lg"
                                  shadow="lg"
                                  width="100px"
                                  height="100px"
                                />
                                <p
                                  className="body-label"
                                  onClick={() => {
                                    removeImage(i);
                                  }}
                                >
                                  Remove image
                                </p>
                              </SoftBox>
                            ) : (
                              <label variant="body2" htmlFor={`file-${i}`} className="body-label">
                                Browse Image
                              </label>
                            )}
                          </SoftBox>
                        )}
                      </>
                    ))}
                  </FormGroup>
                </FormControl>
              </SoftBox>
              {/* {checkbox.some((el) => el.checked) && (
                <SoftBox className="multiple-box">
                  <input
                    type="file"
                    name="images"
                    id="file"
                    onChange={onSelectFile}
                    accept="image/png , image/jpeg, image/webp"
                  />
                  {image ? (
                    <SoftBox display="flex" flexDirection="column" alignItems="center" gap={2}>
                      <SoftBox
                        component="img"
                        src={displayImage}
                        key={displayImage}
                        alt=""
                        borderRadius="lg"
                        shadow="lg"
                        width="100px"
                        height="100px"
                      />
                      <p
                        className="body-label"
                        onClick={() => {
                          setImage('');
                          setDisplayImage('');
                        }}
                      >
                        Remove image
                      </p>
                    </SoftBox>
                  ) : (
                    <label variant="body2" htmlFor="file" className="body-label">
                      Browse Image
                    </label>
                  )}
                </SoftBox>
              )} */}
            </SoftBox>
          </Grid>
        </Grid>
      </Card>
      <SoftBox display="flex" flexDirection="row-reverse" className="input-container">
        <SoftButton variant="gradient" color="info" style={{ marginLeft: '20px', margin: '10px' }} onClick={handleSave}>
          {loader ? (
            <CircularProgress
              size={18}
              sx={{
                color: '#fff',
              }}
            />
          ) : (
            <>Save</>
          )}
        </SoftButton>
        <SoftButton
          variant="outlined"
          color="info"
          onClick={() => navigate(-1)}
          style={{ marginLeft: '20px', margin: '10px' }}
        >
          Cancel
        </SoftButton>
      </SoftBox>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
          {errormsg}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default CartCoupon;
