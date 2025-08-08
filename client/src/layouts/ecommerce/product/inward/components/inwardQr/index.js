import './inwardQr.css';
import * as React from 'react';
import { Button } from '@mui/material';
import { green } from '@mui/material/colors';
import { poInward } from '../../../../../../config/Services';
import { postInwardData } from '../../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Grid from '@mui/material/Grid';
import MuiAlert from '@mui/material/Alert';
import SetInterval from '../../../../setinterval';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import Verified from '@mui/icons-material/Verified';
import { noDatagif } from '../../../../Common/CommonFunction';

const InwardQr = () => {
  const { po } = useParams();
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

  const userDetails = localStorage.getItem('user_details');
  const uidx = JSON.parse(userDetails).uidx;

  const contextType = localStorage.getItem('contextType');

  useEffect(() => {
    setLoader(true);
    const payload = {
      userId: uidx,
      orgId: orgId,
      locationId: locId,
      requestNumber: verifyLoader ? poNumber : po,
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
        setitemArr(res.data.data.inwardMasterCopyRequest.inwardItemRequest);
        setSessionId(res.data.data.inboundSessionDetail.sessionId);
        setErrorImg(true);
        setPoNumber(po);
      })
      .catch((err) => {
        setAlertmessage(err.response.data.message);
        setTimelineerror('error');
        setTimeout(() => {
          handleopensnack();
        });
        setLoader(false);
        setVerifyLoader(false);
        setSessionId('');
        setaddress({});
        setitemArr([]);
        setNewbox(false);
        setErrorImg(false);
        setPoNumber('');
      });
  }, [po]);

  const [inputDisable, setInputDisable] = useState(true);
  const [selectedData, setSelectedData] = useState([]);
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  function handleCheckboxChange(item) {
    setInputDisable(false);
    setSelectedData((prevData) => {
      if (prevData.includes(item)) {
        return prevData.filter((i) => i !== item);
      }
      return [...prevData, item];
    });
  }

  const handlepodetails = (poNum) => {
    navigate(`/products/quality-checking/${poNum}`);
  };

  const change = (key, value, id, idx) => {
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
    if (payload.inwardItemInputList.length) {
      for (let i = 0; i < payload.inwardItemInputList.length; i++) {
        if (
          payload.inwardItemInputList[i]['quantityReceived'] == 0 ||
          payload.inwardItemInputList[i]['batchNumber'] == null ||
          payload.inwardItemInputList[i]['expiryDetail'] == null
        ) {
          setTimelineerror('warning');
          setAlertmessage(`Please enter values to the required field at row${i + 1} it should not be empty`);
          setOpensnack(true);
          return false;
        }
      }
    }

    return true;
  };

  const handleInwardsave = () => {
    const payload = {
      masterCopyNo: address.masterCopyNo,
      inboundRequestNumber: verifyLoader ? poNumber : po,
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
        setAlertmessage('SUCCESS');
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

  return (
    <DashboardLayout>
      <DashboardNavbar />

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
        <Card sx={{ overflow: 'visible' }}>
          <SoftBox p={3}>
            <SoftBox mt={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <SoftBox>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        PO Number
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox className="form-flex-inward-box">
                      {/* <Grid item xs={12} md={6} xl={6}> */}
                      <Grid item xs={11} md={11} xl={11}>
                        {!verifyLoader ? (
                          <SoftInput
                            type="text"
                            placeholder="Eg : 77700244"
                            value={poNumber}
                            onChange={(e) => setPoNumber(e.target.value.trim())}
                          />
                        ) : (
                          <SoftInput
                            type="text"
                            placeholder="Eg : 77700244"
                            value={po}
                            //   onChange={(e) => setPoNumber(e.target.value)}
                          />
                        )}
                      </Grid>
                      {loader ? (
                        <Spinner />
                      ) : !loader && !verifyLoader ? (
                        <SoftBox className="wrapper-btn-box-inward">
                          <Button className="vefir-bnt" onClick={() => handlepodetails(poNumber)}>
                            Verify
                          </Button>
                        </SoftBox>
                      ) : (
                        <Verified style={{ color: green[500] }} />
                      )}
                    </SoftBox>
                  </SoftBox>
                  {newBox ? (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6} xl={6}>
                        <SoftBox className="quality-box">
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
                        <SoftBox className="quality-box">
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
                    <SoftBox className="wrapper-table">
                      <table className="styled-table">
                        <thead>
                          <tr>
                            <th className="th-text">
                              <Checkbox className="kalu" />
                            </th>
                            <th className="th-text">Sku</th>
                            <th className="th-text">Ordered</th>
                            <th className="th-text">Previous Inward</th>
                            <th className="th-text">Pending Order</th>
                            <th className="th-text">Quantity</th>
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
                                        onChange={(e) => change('quantityReceived', e.target.value, item.id, idx)}
                                        readOnly={selectedData.includes(item) ? false : true}
                                        required
                                        style={{ width: '100%' }}
                                      />
                                    </SoftBox>
                                  </td>
                                  <td>
                                    <SoftBox className="small-input-varient">
                                      <input
                                        disabled={inputDisable}
                                        className="wrapper-table-input"
                                        type="text"
                                        placeholder="Enter Batch"
                                        required
                                        onChange={(e) => change('batchNumber', e.target.value, item.id)}
                                        readOnly={selectedData.includes(item) ? false : true}
                                        style={{ width: '100%' }}
                                      />
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
                                        onChange={(e) => change('expiryDetail', e.target.value, item.id)}
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
                    </SoftBox>
                  ) : (
                    <SoftBox className="middle-box-center">
                      <img className="src-img" src={noDatagif} alt="" />
                    </SoftBox>
                  )}
                </Grid>
              </Grid>
            </SoftBox>
          </SoftBox>
          <SoftBox className="grad-info-btn">
            <SoftBox className="sm-width">
              <SoftButton className="vendor-second-btn" onClick={handleClose}>
                cancel
              </SoftButton>
              {save ? (
                <Spinner />
              ) : (
                <SoftButton className="saver-wrapper" onClick={handleInwardsave}>
                  save
                </SoftButton>
              )}
            </SoftBox>
          </SoftBox>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default InwardQr;
