import './quality.css';
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Divider, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { buttonStyles } from '../../../../Common/buttonColor';
import { green } from '@mui/material/colors';
import { inwardBatchAvailabilityCheck, postInwardData } from '../../../../../../config/Services';
import { isSmallScreen, noDatagif } from '../../../../Common/CommonFunction';
import { poInward } from '../../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Grid from '@mui/material/Grid';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import MuiAlert from '@mui/material/Alert';
import QualityFormCard from '../qualityFormMobileCard';
import RefreshIcon from '@mui/icons-material/Refresh';
import RepackingInward from './components/repacking';
import SetInterval from '../../../../setinterval';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import Verified from '@mui/icons-material/Verified';

const Qualitychecking = () => {
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  //snackbar
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [opensnack, setOpensnack] = useState(false);
  const [opensnack1, setOpensnack1] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [alertmessage1, setAlertmessage1] = useState('');

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleopensnack1 = () => {
    setOpensnack1(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const handleCloseSnackbar1 = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack1(false);
  };

  // API for Inward Form
  const [poNumber, setPoNumber] = useState('');
  const [loader, setLoader] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [address, setaddress] = useState({});
  const [itemArr, setitemArr] = useState([]);
  const [newBox, setNewbox] = useState(false);
  const [newLoader, setnewLoader] = useState(false);
  const [errorImg, setErrorImg] = useState(false);
  const [save, setSave] = useState(false);
  const [verifyLoader, setVerifyLoader] = useState(false);
  const [itemVerifyBatch, setItemVerifyBatch] = useState(null);
  const [vendorName, setVendorName] = useState('');
  // const [type, setType] = useState({ value: 'PO Number', label: 'PO Number' });
  const [type, setType] = useState({ value: 'Repacking', label: 'Repacking' });
  const [verifyBatchLoader, setVerifyBatchLoader] = useState(false);

  const userDetails = localStorage.getItem('user_details');
  const uidx = JSON.parse(userDetails).uidx;

  const contextType = localStorage.getItem('contextType');

  const handlepodetails = () => {
    setLoader(true);

    const payload = {
      userId: uidx,
      orgId: orgId,
      locationId: locId,
      requestNumber: poNumber,
      requestNoType: 'PO',
      reqSourceType: contextType,
    };

    poInward(payload)
      .then((res) => {
        setLoader(false);
        setVerifyLoader(true);
        setNewbox(true);
        setAlertmessage(res.data.data.message);
        setTimelineerror('success');
        handleopensnack();
        setaddress(res.data.data.inwardMasterCopyRequest);
        const itemArrList = res.data.data.inwardMasterCopyRequest.inwardItemRequest.map((item) => ({
          ...item,
          isVerified: false,
        }));
        setitemArr(itemArrList);
        setSessionId(res.data.data.inboundSessionDetail.sessionId);
        setVendorName(res.data.data.inwardMasterCopyRequest.vendorName);
        setErrorImg(true);
      })
      .catch((err) => {
        setAlertmessage(err.response.data.message);
        setTimelineerror('error');
        setTimeout(() => {
          handleopensnack();
        });
        setLoader(false);
        setVerifyLoader(false);
      });
  };

  const [inputDisable, setInputDisable] = useState(true);
  const [selectedData, setSelectedData] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  function handleCheckboxChange(item) {
    setIsSelected(false);
    setInputDisable(false);
    setSelectedData((prevData) => {
      if (prevData.includes(item)) {
        return prevData.filter((i) => i !== item);
      }
      return [...prevData, item];
    });
  }

  const checkRejectionReasonDisableOrNot = (item, id) => {
    const findItem = selectedData.find((el) => el.id === id);
    if (
      findItem !== undefined &&
      findItem['quantityRejected'] !== undefined &&
      findItem['quantityRejected'].length > 0 &&
      findItem['quantityRejected'] !== '0'
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleRejectionReason = (option, key, id, idx) => {
    const index = selectedData.findIndex((item) => item.id == id);
    const dumm_obj = selectedData[index];
    dumm_obj[key] = option.value;
    const arr = [...selectedData];
    arr[index] = dumm_obj;
    setSelectedData([...arr]);
  };

  const handleBatchId = (key, value, id, idx) => {
    const index = selectedData.findIndex((item) => item.id == id);
    const arr = [...selectedData];

    if (arr[index]['isVerified'] == true) {
      const newArr = [...itemArr];
      newArr[idx]['isVerified'] = false;
      setitemArr(newArr);
      return;
    } else {
      arr[index][key] = value;
      setSelectedData([...arr]);
    }
  };

  const handleDateChange = (date, key, id, idx) => {
    const convertDate = new Date(date.$d);
    const year = convertDate.getFullYear();
    const month = String(convertDate.getMonth() + 1).padStart(2, '0');
    const day = String(convertDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const index = selectedData.findIndex((item) => item.id == id);
    const dumm_obj = selectedData[index];

    dumm_obj[key] = formattedDate;

    const arr = [...selectedData];
    arr[index] = dumm_obj;

    setSelectedData([...arr]);
  };

  const change = (key, value, id, idx, e) => {
    const index = selectedData.findIndex((item) => item.id == id);
    const dumm_obj = selectedData[index];

    dumm_obj[key] = value;

    const arr = [...selectedData];
    arr[index] = dumm_obj;

    if (
      arr[index]['quantityOutstanding'] == 0 &&
      arr[index]['lastInward'] == 0 &&
      arr[index]['quantityReceived'] > arr[index]['quantityOrdered']
    ) {
      setAlertmessage('Quantity should not be more than Ordered quantity');
      setTimelineerror('warning');
      handleopensnack();
      const newItemArr = [...itemArr];
      newItemArr[idx]['quantityReceived'] = 0;
      setitemArr(newItemArr);
      return;
    }

    if (arr[index]['quantityOutstanding'] < arr[index]['quantityReceived'] && arr[index]['quantityOutstanding'] !== 0) {
      setAlertmessage('Quantity should not be more than Pending Order');
      setTimelineerror('warning');
      handleopensnack();
      const newItemArr = [...itemArr];
      newItemArr[idx]['quantityReceived'] = 0;
      setitemArr(newItemArr);
      return;
    }

    setSelectedData([...arr]);
  };

  const verifyPayLoad = (payload) => {
    if (poNumber.length == 0) {
      setAlertmessage('Please verify your PO Number');
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }

    if (payload.inwardItemInputList.length === 0) {
      setTimelineerror('warning');
      setAlertmessage('Please select a product to proceed ');
      setOpensnack(true);
      return false;
    }

    // const newRw = [...payload.inwardItemInputList];
    // for (let i = 0; i < newRw.length; i++) {
    //   const row = newRw[i];

    // }

    if (payload.inwardItemInputList.length) {
      const newRw = [...payload.inwardItemInputList];
      for (let i = 0; i < newRw.length; i++) {
        const row = newRw[i];
        if (row['quantityReceived'] == 0) {
          setTimelineerror('warning');
          setAlertmessage(`Please enter values to quantity field at row ${i + 1}`);
          setOpensnack(true);
          return false;
        }

        if (row['batchNumber'] == null) {
          setTimelineerror('warning');
          setAlertmessage(`Please enter Batch Id and verify at row ${i + 1}`);
          setOpensnack(true);
          return false;
        }
        if (row['expiryDetail'] == null) {
          setTimelineerror('warning');
          setAlertmessage(`Please enter expiry date at row ${i + 1}`);
          setOpensnack(true);
          return false;
        }

        if (row['batchNumber'] !== null && row['isVerified'] == false) {
          setTimelineerror('warning');
          setAlertmessage(`Required : Please verify Batch Id field at row${i + 1}`);
          setOpensnack(true);
          return false;
        }

        // if(row['quantityRejected'] && row['rejectionReason'] == undefined){
        //     setTimelineerror('warning');
        //     setAlertmessage(`Please enter rejected to the required field at row${i + 1} it should not be empty`);
        //     setOpensnack(true);
        //     return false;
        // }

        // if (
        //   row['quantityReceived'] == 0 ||
        //   row['batchNumber'] == null ||
        //   row['expiryDetail'] == null ||
        //   (row['quantityRejected'] && row['rejectionReason'] == undefined)
        // ) {
        //   setTimelineerror('warning');
        //   setAlertmessage(`Please enter values to the required field at row${i + 1} it should not be empty`);
        //   setOpensnack(true);
        //   return false;
        // }
      }
    }

    return true;
  };

  const handleInwardsave = () => {
    const payload = {
      masterCopyNo: address.masterCopyNo,
      inboundRequestNumber: poNumber,
      inwardItemInputList: selectedData,
      userId: uidx,
    };

    if (!verifyPayLoad(payload)) {
      setnewLoader(false);
      return;
    }

    setSave(true);
    postInwardData(sessionId, payload)
      .then((res) => {
        setAlertmessage(res.data.data.message);
        setTimelineerror('success');
        SetInterval(handleopensnack());
        setTimeout(() => {
          navigate('/inventory/inward');
        }, 2000);
        setSave(false);
      })
      .catch((err) => {
        setAlertmessage1(err.response.data.message);
        setTimelineerror('error');
        SetInterval(handleopensnack1());
        setSave(false);
      });
  };

  const handleClose = () => {
    setNewbox(false);
    setErrorImg(false);
    navigate('/inventory/inward');
  };

  // useEffect(() => {
  // }, [selectedData]);

  const verifyBatchId = (item, idx, gtin, batchNo) => {
    setVerifyBatchLoader(true);
    inwardBatchAvailabilityCheck(locId, gtin, batchNo)
      .then((res) => {
        if (res.data.data.object.available == false) {
          setAlertmessage('Batch id verified successfully.');
          setTimelineerror('success');
          setOpensnack(true);
          setVerifyBatchLoader(false);
          setItemVerifyBatch(null);
          const newArr = [...itemArr];
          newArr[idx]['isVerified'] = true;
          setitemArr(newArr);
        } else {
          setAlertmessage('Batch id already exists. Please provide different batch id');
          setTimelineerror('warning');
          setOpensnack(true);
          setVerifyBatchLoader(false);
          setItemVerifyBatch(null);
        }
      })
      .catch((err) => {
        setVerifyBatchLoader(false);
      });
  };

  const handleBatchIdCheck = (item, id, idx) => {
    const findSelectedItem = selectedData.find((item) => item.id === id);
    setItemVerifyBatch(findSelectedItem);
    if (findSelectedItem !== undefined && findSelectedItem['batchNumber'] !== null) {
      verifyBatchId(findSelectedItem, idx, findSelectedItem['gtin'], findSelectedItem['batchNumber']);
    } else if (findSelectedItem !== undefined && findSelectedItem['batchNumber'] == null) {
      setAlertmessage(`Please provide the batch id at row${idx + 1} to verify`);
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    } else {
      setAlertmessage(`Please select the current row${idx + 1} to verify batch id `);
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }
  };

  //selecting all functionality
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (isSelected) {
      setSelectedData([...itemArr]);
      setInputDisable(false);
    }
  }, [isSelected]);

  useEffect(() => {
    if (itemArr.length) {
      if (itemArr.length === selectedData.length) {
        setIsSelected(true);
      }
    }
  }, [selectedData]);

  const isMobileDevice = isSmallScreen();

  return (
    <DashboardLayout isMobileDevice={isMobileDevice}>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}

      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>

      <Snackbar open={opensnack1} autoHideDuration={3000} onClose={handleCloseSnackbar1}>
        <Alert onClose={handleCloseSnackbar1} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage1}
        </Alert>
      </Snackbar>

      {newLoader ? (
        <Spinner />
      ) : (
        <SoftBox
          sx={{
            height: itemArr.length > 2 ? 'auto' : '100%',
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'space-between'
            position: 'relative',
          }}
        >
          <Card sx={{ overflow: 'visible' }} className={`${isMobileDevice && 'po-box-shadow '}`}>
            <SoftBox p={isMobileDevice ? 0 : 3}>
              <SoftBox mt={isMobileDevice ? 0 : 1}>
                <Grid container spacing={3}>
                  {!isMobileDevice && (
                    <Grid item xs={4} sm={4}>
                      <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                        <SoftTypography
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          textTransform="capitalize"
                          p={isMobileDevice ? '10px' : '0'}
                        >
                          Select Type
                        </SoftTypography>
                      </SoftBox>
                      <SoftSelect
                        onChange={(option) => setType(option)}
                        value={type}
                        isDisabled={true}
                        options={[
                          // { value: 'PO Number', label: 'PO Number' },
                          // { value: 'SO Number', label: 'SO Number' },
                          { value: 'Repacking', label: 'Repacking' },
                        ]}
                      />
                    </Grid>
                  )}
                  {type.value === 'PO Number' ? (
                    <Grid item xs={12} sm={12}>
                      <SoftBox>
                        {isMobileDevice && (
                          <SoftBox className={'inward-detail-main-header'}>
                            <MobileNavbar title={'New Inward'} />
                          </SoftBox>
                        )}
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                          <SoftTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                            p={isMobileDevice ? '10px' : '0'}
                          >
                            PO Number
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox className="form-flex-inward-box" p={isMobileDevice ? '0 10px 10px 10px' : '0'}>
                          <Grid item xs={11} md={11} xl={11}>
                            <SoftInput
                              type="text"
                              placeholder="Eg : 77700244"
                              onChange={(e) => setPoNumber(e.target.value.trim())}
                            />
                          </Grid>
                          {/* {loader ? (
                        <Spinner />
                      ) : (
                        <SoftBox className="wrapper-btn-box-inward">
                          <Button className="vefir-bnt" onClick={handlepodetails}>
                            Verify
                          </Button>
                        </SoftBox>
                      )} */}
                          {loader ? (
                            <Spinner />
                          ) : !loader && !verifyLoader ? (
                            <SoftBox className="wrapper-btn-box-inward">
                              <SoftButton
                                variant={buttonStyles.primaryVariant}
                                className="vefir-bnt vendor-add-btn contained-softbutton"
                                onClick={() => handlepodetails()}
                              >
                                Verify
                              </SoftButton>
                            </SoftBox>
                          ) : (
                            <Verified style={{ color: green[500] }} />
                          )}
                        </SoftBox>
                      </SoftBox>
                      {newBox ? (
                        <Grid container spacing={isMobileDevice ? 0 : 3}>
                          <Grid item xs={12} md={6} xl={6} mt={isMobileDevice ? 1 : 0}>
                            {/* {isMobileDevice && <Divider sx={{margin: '1rem 0 0 0 !important'}}/>} */}
                            <SoftBox className={` ${isMobileDevice ? 'quality-box-mobile' : 'quality-box'}`}>
                              <SoftTypography
                                mb={2}
                                component="label"
                                variant="caption"
                                fontWeight="bold"
                                textTransform="capitalize"
                              >
                                Billing Address
                              </SoftTypography>
                              <br />

                              <SoftTypography
                                className="bill-add-text"
                                component="label"
                                variant="caption"
                                fontWeight="bold"
                                textTransform="capitalize"
                              >
                                {address.sourceLocationAddress}
                              </SoftTypography>
                              <br />
                            </SoftBox>
                          </Grid>
                          <Grid item xs={12} md={6} xl={6}>
                            {isMobileDevice && <Divider sx={{ margin: '0rem !important' }} />}
                            <SoftBox className={`quality-box ${isMobileDevice ? 'quality-box-mobile' : ''}`}>
                              <SoftTypography
                                mb={2}
                                component="label"
                                variant="caption"
                                fontWeight="bold"
                                textTransform="capitalize"
                              >
                                Shipping Address
                              </SoftTypography>
                              <br />
                              <SoftTypography
                                className="bill-add-text"
                                component="label"
                                variant="caption"
                                fontWeight="bold"
                                textTransform="capitalize"
                              >
                                {address.destinationLocationAddress}
                              </SoftTypography>
                              <br />
                            </SoftBox>
                          </Grid>
                        </Grid>
                      ) : (
                        ''
                      )}

                      {errorImg ? (
                        <SoftBox
                          className={`wrapper-table border-radius-table ${isMobileDevice ? 'quality-box-mobile' : ''}`}
                          sx={{
                            overflow: isMobileDevice ? 'unset' : 'auto',
                          }}
                        >
                          {isMobileDevice && <Divider sx={{ margin: '0rem !important' }} />}
                          <Typography className={`${isMobileDevice ? 'typo-vn-mob' : 'typo-vn-lap'}`}>
                            Vendor Name: <strong>{vendorName}</strong>
                          </Typography>

                          {!isMobileDevice && (
                            <table
                              className="styled-table"
                              style={{
                                minWidth: '80rem',
                                marginTop: '10px',
                              }}
                            >
                              <thead>
                                <tr>
                                  <th className="th-text">
                                    <Checkbox
                                      className="kalu"
                                      checked={isSelected}
                                      onClick={(e) => {
                                        setIsSelected(!isSelected);
                                        e.stopPropagation();
                                        if (e.target.tagName === 'svg') {
                                          setSelectedData([]);
                                        }
                                        if (e.target.checked === false) {
                                          setSelectedData([]);
                                        }
                                      }}
                                    />
                                  </th>
                                  <th className="th-text">Sku</th>
                                  <th className="th-text">Ordered</th>
                                  <th className="th-text">Previous Inward</th>
                                  <th className="th-text">Pending Order</th>
                                  <th className="th-text">Quantity</th>
                                  <th className="th-text">Rejected Quantities</th>
                                  <th className="th-text">Rejected Reason</th>
                                  <th className="th-text">Batch Id</th>
                                  <th className="th-text">Expiry Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {itemArr.map((item, idx) => {
                                  return (
                                    <>
                                      <tr>
                                        <td className="gold-text">
                                          <Checkbox
                                            className="kalu"
                                            checked={selectedData.includes(item)}
                                            onChange={() => handleCheckboxChange(item)}
                                            {...label}
                                          />
                                        </td>
                                        <td className="gold-text">{item.itemName}</td>
                                        <td className="gold-text">{item.quantityOrdered}</td>
                                        <td className="gold-text">{item.lastInward}</td>
                                        <td className="gold-text">{item.quantityOutstanding}</td>
                                        <td>
                                          <SoftBox className="small-input-varient">
                                            <input
                                              disabled={inputDisable}
                                              className="wrapper-table-input"
                                              type="number"
                                              placeholder="Enter Quantity"
                                              value={item.quantityReceived == 0 ? '' : item.quantityReceived}
                                              onChange={(e) =>
                                                change('quantityReceived', e.target.value, item.id, idx, e)
                                              }
                                              readOnly={selectedData.includes(item) ? false : true}
                                              required
                                              style={{ width: '100%', height: '2rem' }}
                                              min="1"
                                            />
                                          </SoftBox>
                                        </td>
                                        <td>
                                          <SoftBox className="small-input-varient">
                                            <input
                                              disabled={inputDisable}
                                              className="wrapper-table-input"
                                              type="number"
                                              placeholder="Enter Rejection Quantity"
                                              // value={item.quantityReceived == 0 ? '' : item.quantityReceived}
                                              // onChange={(e) => change('quantityReceived', e.target.value, item.id, idx)}
                                              onChange={(e) =>
                                                change('quantityRejected', e.target.value, item.id, idx, e)
                                              }
                                              readOnly={selectedData.includes(item) ? false : true}
                                              required
                                              style={{ width: '100%', height: '2rem' }}
                                              min="1"
                                            />
                                          </SoftBox>
                                        </td>
                                        <td>
                                          <SoftBox className="small-input-varient " id="rejected-reason">
                                            <SoftSelect
                                              style={{ width: '3rem', height: '2rem' }}
                                              options={[
                                                { value: 'DAMAGED_PACKET', label: 'DAMAGED_PACKET' },
                                                { value: 'POOR_QUALITY', label: 'POOR_QUALITY' },
                                                { value: 'USED_PRODUCT', label: 'USED_PRODUCT' },
                                                { value: 'MISSING_ITEM', label: 'MISSING_ITEM' },
                                                { value: 'LESS_QUANTITY', label: '	LESS_QUANTITY' },
                                              ]}
                                              onChange={(option) =>
                                                handleRejectionReason(option, 'rejectionReason', item.id, idx)
                                              }
                                              // isDisabled={true}
                                              isDisabled={checkRejectionReasonDisableOrNot(item, item.id)}
                                              // sx={{
                                              //   overflow: 'hidden',
                                              //   overflowWrap: 'break-word',
                                              // }}
                                              menuPortalTarget={document.body}
                                            />
                                          </SoftBox>
                                        </td>
                                        <td>
                                          <SoftBox
                                            className="small-input-varient"
                                            sx={{
                                              display: 'flex',
                                            }}
                                          >
                                            <input
                                              disabled={inputDisable}
                                              className="wrapper-table-input"
                                              type="text"
                                              placeholder="Enter Batch"
                                              required
                                              // onChange={(e) => change('batchNumber', e.target.value, item.id)}

                                              onChange={(e) =>
                                                handleBatchId('batchNumber', e.target.value, item.id, idx)
                                              }
                                              // readOnly={selectedData.includes(item) ? false : true}
                                              // readOnly={
                                              //   item['isVerified'] == true || !selectedData.includes(item) ? true : false
                                              // }
                                              style={{ width: '100%', height: '2rem', marginRight: '1rem' }}
                                            />
                                            {verifyBatchLoader &&
                                            // && itemVerifyBatch !== null
                                            item.id == itemVerifyBatch.id ? (
                                              // <Spinner
                                              //   sx={{
                                              //     marginTop: '0.5rem',
                                              //   }}
                                              // />
                                              <CircularProgress
                                                sx={{
                                                  marginTop: '0.5rem',
                                                }}
                                                size={20}
                                                color="info"
                                              />
                                            ) : // !verifyBatchLoader &&
                                            // && itemVerifyBatch == null
                                            item['isVerified'] == true ? (
                                              <Verified
                                                style={{
                                                  color: green[500],
                                                  marginTop: '0.5rem',
                                                }}
                                              />
                                            ) : (
                                              <RefreshIcon
                                                color="info"
                                                sx={{
                                                  marginTop: '0.5rem',
                                                  cursor: 'pointer',
                                                }}
                                                onClick={() => handleBatchIdCheck(item, item.id, idx)}
                                              />
                                            )}
                                          </SoftBox>
                                        </td>
                                        <td>
                                          <SoftBox className="small-input-varient">
                                            {/* <input
                                              disabled={inputDisable}
                                              className="wrapper-table-input-I"
                                              type="date"
                                              placeholder="Date"
                                              required
                                              onChange={(e) => handleDatechange('expiryDetail', e.target.value, item.id, idx, e)}
                                              readOnly={selectedData.includes(item) ? false : true}
                                            /> */}
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                              <DatePicker
                                                disabled={inputDisable}
                                                views={['year', 'month', 'day']}
                                                format="DD-MM-YYYY"
                                                onChange={(date) =>
                                                  handleDateChange(date, 'expiryDetail', item.id, idx)
                                                }
                                                sx={{
                                                  width: '10rem',
                                                  '& .MuiInputLabel-formControl': {
                                                    fontSize: '0.8rem',
                                                    top: '-0.4rem',
                                                    color: '#344767',
                                                  },
                                                }}
                                              />
                                            </LocalizationProvider>
                                          </SoftBox>
                                        </td>
                                      </tr>
                                    </>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </SoftBox>
                      ) : (
                        !isMobileDevice && (
                          <SoftBox className="middle-box-center">
                            <img className="src-img" src={noDatagif} alt="" />
                          </SoftBox>
                        )
                      )}
                    </Grid>
                  ) : type.value === 'SO Number' ? (
                    <Grid item xs={12} sm={12}>
                      <SoftBox>
                        {isMobileDevice && (
                          <SoftBox className={'inward-detail-main-header'}>
                            <MobileNavbar title={'New Inward'} />
                          </SoftBox>
                        )}
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                          <SoftTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                            p={isMobileDevice ? '10px' : '0'}
                          >
                            SO Number
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox className="form-flex-inward-box" p={isMobileDevice ? '0 10px 10px 10px' : '0'}>
                          <Grid item xs={11} md={11} xl={11}>
                            <SoftInput
                              type="text"
                              placeholder="Eg : 77700244"
                              onChange={(e) => setPoNumber(e.target.value.trim())}
                            />
                          </Grid>
                          {/* {loader ? (
                            <Spinner />
                          ) : (
                            <SoftBox className="wrapper-btn-box-inward">
                              <Button className="vefir-bnt" onClick={handlepodetails}>
                                Verify
                              </Button>
                            </SoftBox>
                          )} */}
                          {loader ? (
                            <Spinner />
                          ) : !loader && !verifyLoader ? (
                            <SoftBox className="wrapper-btn-box-inward">
                              <SoftButton
                                variant={buttonStyles.primaryVariant}
                                className="vefir-bnt vendor-add-btn contained-softbutton"
                                onClick={() => handlepodetails()}
                              >
                                Verify
                              </SoftButton>
                            </SoftBox>
                          ) : (
                            <Verified style={{ color: green[500] }} />
                          )}
                        </SoftBox>
                      </SoftBox>
                      {newBox ? (
                        <Grid container spacing={isMobileDevice ? 0 : 3}>
                          <Grid item xs={12} md={6} xl={6} mt={isMobileDevice ? 1 : 0}>
                            {/* {isMobileDevice && <Divider sx={{margin: '1rem 0 0 0 !important'}}/>} */}
                            <SoftBox className={` ${isMobileDevice ? 'quality-box-mobile' : 'quality-box'}`}>
                              <SoftTypography
                                mb={2}
                                component="label"
                                variant="caption"
                                fontWeight="bold"
                                textTransform="capitalize"
                              >
                                Billing Address
                              </SoftTypography>
                              <br />

                              <SoftTypography
                                className="bill-add-text"
                                component="label"
                                variant="caption"
                                fontWeight="bold"
                                textTransform="capitalize"
                              >
                                {address.sourceLocationAddress}
                              </SoftTypography>
                              <br />
                            </SoftBox>
                          </Grid>
                          <Grid item xs={12} md={6} xl={6}>
                            {isMobileDevice && <Divider sx={{ margin: '0rem !important' }} />}
                            <SoftBox className={`quality-box ${isMobileDevice ? 'quality-box-mobile' : ''}`}>
                              <SoftTypography
                                mb={2}
                                component="label"
                                variant="caption"
                                fontWeight="bold"
                                textTransform="capitalize"
                              >
                                Shipping Address
                              </SoftTypography>
                              <br />
                              <SoftTypography
                                className="bill-add-text"
                                component="label"
                                variant="caption"
                                fontWeight="bold"
                                textTransform="capitalize"
                              >
                                {address.destinationLocationAddress}
                              </SoftTypography>
                              <br />
                            </SoftBox>
                          </Grid>
                        </Grid>
                      ) : (
                        ''
                      )}

                      {errorImg ? (
                        <SoftBox
                          className={`wrapper-table border-radius-table ${isMobileDevice ? 'quality-box-mobile' : ''}`}
                          sx={{
                            overflow: isMobileDevice ? 'unset' : 'auto',
                          }}
                        >
                          {isMobileDevice && <Divider sx={{ margin: '0rem !important' }} />}
                          <Typography className={`${isMobileDevice ? 'typo-vn-mob' : 'typo-vn-lap'}`}>
                            Vendor Name: <strong>{vendorName}</strong>
                          </Typography>

                          {!isMobileDevice && (
                            <table
                              className="styled-table"
                              style={{
                                minWidth: '80rem',
                                marginTop: '10px',
                              }}
                            >
                              <thead>
                                <tr>
                                  <th className="th-text">
                                    <Checkbox
                                      className="kalu"
                                      checked={isSelected}
                                      onClick={(e) => {
                                        setIsSelected(!isSelected);
                                        e.stopPropagation();
                                        if (e.target.tagName === 'svg') {
                                          setSelectedData([]);
                                        }
                                        if (e.target.checked === false) {
                                          setSelectedData([]);
                                        }
                                      }}
                                    />
                                  </th>
                                  <th className="th-text">Sku</th>
                                  <th className="th-text">Ordered</th>
                                  <th className="th-text">Previous Inward</th>
                                  <th className="th-text">Pending Order</th>
                                  <th className="th-text">Quantity</th>
                                  <th className="th-text">Rejected Quantities</th>
                                  <th className="th-text">Rejected Reason</th>
                                  <th className="th-text">Batch Id</th>
                                  <th className="th-text">Expiry Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {itemArr.map((item, idx) => {
                                  return (
                                    <>
                                      <tr>
                                        <td className="gold-text">
                                          <Checkbox
                                            className="kalu"
                                            checked={selectedData.includes(item)}
                                            onChange={() => handleCheckboxChange(item)}
                                            {...label}
                                          />
                                        </td>
                                        <td className="gold-text">{item.itemName}</td>
                                        <td className="gold-text">{item.quantityOrdered}</td>
                                        <td className="gold-text">{item.lastInward}</td>
                                        <td className="gold-text">{item.quantityOutstanding}</td>
                                        <td>
                                          <SoftBox className="small-input-varient">
                                            <input
                                              disabled={inputDisable}
                                              className="wrapper-table-input"
                                              type="number"
                                              placeholder="Enter Quantity"
                                              value={item.quantityReceived == 0 ? '' : item.quantityReceived}
                                              onChange={(e) =>
                                                change('quantityReceived', e.target.value, item.id, idx, e)
                                              }
                                              readOnly={selectedData.includes(item) ? false : true}
                                              required
                                              style={{ width: '100%', height: '2rem' }}
                                              min="1"
                                            />
                                          </SoftBox>
                                        </td>
                                        <td>
                                          <SoftBox className="small-input-varient">
                                            <input
                                              disabled={inputDisable}
                                              className="wrapper-table-input"
                                              type="number"
                                              placeholder="Enter Rejection Quantity"
                                              // value={item.quantityReceived == 0 ? '' : item.quantityReceived}
                                              // onChange={(e) => change('quantityReceived', e.target.value, item.id, idx)}
                                              onChange={(e) =>
                                                change('quantityRejected', e.target.value, item.id, idx, e)
                                              }
                                              readOnly={selectedData.includes(item) ? false : true}
                                              required
                                              style={{ width: '100%', height: '2rem' }}
                                              min="1"
                                            />
                                          </SoftBox>
                                        </td>
                                        <td>
                                          <SoftBox className="small-input-varient " id="rejected-reason">
                                            <SoftSelect
                                              style={{ width: '3rem', height: '2rem' }}
                                              options={[
                                                { value: 'DAMAGED_PACKET', label: 'DAMAGED_PACKET' },
                                                { value: 'POOR_QUALITY', label: 'POOR_QUALITY' },
                                                { value: 'USED_PRODUCT', label: 'USED_PRODUCT' },
                                                { value: 'MISSING_ITEM', label: 'MISSING_ITEM' },
                                                { value: 'LESS_QUANTITY', label: '	LESS_QUANTITY' },
                                              ]}
                                              onChange={(option) =>
                                                handleRejectionReason(option, 'rejectionReason', item.id, idx)
                                              }
                                              // isDisabled={true}
                                              isDisabled={checkRejectionReasonDisableOrNot(item, item.id)}
                                              // sx={{
                                              //   overflow: 'hidden',
                                              //   overflowWrap: 'break-word',
                                              // }}
                                              menuPortalTarget={document.body}
                                            />
                                          </SoftBox>
                                        </td>
                                        <td>
                                          <SoftBox
                                            className="small-input-varient"
                                            sx={{
                                              display: 'flex',
                                            }}
                                          >
                                            <input
                                              disabled={inputDisable}
                                              className="wrapper-table-input"
                                              type="text"
                                              placeholder="Enter Batch"
                                              required
                                              // onChange={(e) => change('batchNumber', e.target.value, item.id)}

                                              onChange={(e) =>
                                                handleBatchId('batchNumber', e.target.value, item.id, idx)
                                              }
                                              // readOnly={selectedData.includes(item) ? false : true}
                                              // readOnly={
                                              //   item['isVerified'] == true || !selectedData.includes(item) ? true : false
                                              // }
                                              style={{ width: '100%', height: '2rem', marginRight: '1rem' }}
                                            />
                                            {verifyBatchLoader &&
                                            // && itemVerifyBatch !== null
                                            item.id == itemVerifyBatch.id ? (
                                              // <Spinner
                                              //   sx={{
                                              //     marginTop: '0.5rem',
                                              //   }}
                                              // />
                                              <CircularProgress
                                                sx={{
                                                  marginTop: '0.5rem',
                                                }}
                                                size={20}
                                                color="info"
                                              />
                                            ) : // !verifyBatchLoader &&
                                            // && itemVerifyBatch == null
                                            item['isVerified'] == true ? (
                                              <Verified
                                                style={{
                                                  color: green[500],
                                                  marginTop: '0.5rem',
                                                }}
                                              />
                                            ) : (
                                              <RefreshIcon
                                                color="info"
                                                sx={{
                                                  marginTop: '0.5rem',
                                                  cursor: 'pointer',
                                                }}
                                                onClick={() => handleBatchIdCheck(item, item.id, idx)}
                                              />
                                            )}
                                          </SoftBox>
                                        </td>
                                        <td>
                                          <SoftBox className="small-input-varient">
                                            <input
                                              disabled={inputDisable}
                                              className="wrapper-table-input-I"
                                              type="date"
                                              placeholder="Date"
                                              required
                                              onChange={(e) => change('expiryDetail', e.target.value, item.id, idx, e)}
                                              readOnly={selectedData.includes(item) ? false : true}
                                            />
                                          </SoftBox>
                                        </td>
                                      </tr>
                                    </>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </SoftBox>
                      ) : (
                        !isMobileDevice && (
                          <SoftBox className="middle-box-center">
                            <img className="src-img" src={noDatagif} alt="" />
                          </SoftBox>
                        )
                      )}
                    </Grid>
                  ) : type.value === 'Repacking' ? (
                    <RepackingInward />
                  ) : null}
                </Grid>
              </SoftBox>
            </SoftBox>
          </Card>
          {errorImg && isMobileDevice ? (
            <SoftBox sx={{ marginTop: '15px', height: '100%' }}>
              <Typography fontSize="16px" fontWeight={700}>
                Product Details
              </Typography>
              {itemArr.map((item, index) => (
                <QualityFormCard
                  verifyBatchLoader={verifyBatchLoader}
                  itemVerifyBatch={itemVerifyBatch}
                  inputDisable={inputDisable}
                  setInputDisable={setInputDisable}
                  item={item}
                  selectedData={selectedData}
                  setSelectedData={setSelectedData}
                  handleBatchIdCheck={handleBatchIdCheck}
                  handleBatchId={handleBatchId}
                  change={change}
                  idx={index}
                  handleRejectionReason={handleRejectionReason}
                  checkRejectionReasonDisableOrNot={checkRejectionReasonDisableOrNot}
                />
              ))}
            </SoftBox>
          ) : (
            isMobileDevice && (
              <SoftBox className="middle-box-center error-image">
                <img className="src-img error-img" src={noDatagif} alt="" />
              </SoftBox>
            )
          )}
          {type.value !== 'Repacking' && (
            <SoftBox className="grad-info-btn action-btn-inward-detail" sx={{ marginTop: '10px' }}>
              <SoftBox className="sm-width cancel-inward-btn-div">
                <SoftButton
                  onClick={handleClose}
                  variant={buttonStyles.secondaryVariant}
                  className="outlined-softbutton"
                >
                  Cancel
                </SoftButton>
                {save ? (
                  <Spinner />
                ) : (
                  <SoftButton
                    variant={buttonStyles.primaryVariant}
                    className="contained-softbutton saver-wrapper save-inward"
                    onClick={handleInwardsave}
                  >
                    Save
                  </SoftButton>
                )}
              </SoftBox>
            </SoftBox>
          )}
        </SoftBox>
      )}
    </DashboardLayout>
  );
};

export default Qualitychecking;
