import './putaway.css';
import * as React from 'react';
import { Typography } from '@mui/material';
import { buttonStyles } from '../../../../Common/buttonColor';
import {
  fetchStorageDetailsWithBarcodeId,
  postputAwayData,
  putAwayLoactionData,
  putAwayPonumber,
  sessionRequest,
} from '../../../../../../config/Services';
import { green } from '@mui/material/colors';
import { isSmallScreen, noDatagif } from '../../../../Common/CommonFunction';
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
import PutAwayCard from '../putawayformMobileCard';
import RefreshIcon from '@mui/icons-material/Refresh';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import Verified from '@mui/icons-material/Verified';

const Putaway = () => {
  const navigate = useNavigate();
  //snackbar
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [showInward, setShowInward] = useState(false);
  const [save, setSave] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [parentCheckBox, setParentCheckBox] = useState(false);

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;

  const poNumber = localStorage.getItem('poNum');
  const sessionId = localStorage.getItem('sessionId');

  // API for Put-away Form
  // const [poNumber, setPoNumber] = useState('');

  const [verifyStorageIdItem, setVerifyStorageIdItem] = useState(null);
  const [verifyStorageLoader, setVerifyStorageLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [newBox, setNewbox] = useState(false);
  const [locationhit, setLocationHit] = useState(false);
  const [verifyLoader, setVerifyLoader] = useState(false);

  const [locRows, setLocTableRows] = useState([]);
  let locaArr,
    locationRow = [];

  const handlepodetails = () => {
    setLoader(true);
    putAwayPonumber(poNumber, orgId, locId)
      .then((res) => {
        locaArr = res.data.data;
        locationRow.push(
          locaArr?.object?.map((row) => ({
            value: row.sessionId + '   ' + row.timestamp,
            label: row.sessionId + '  ' + row.timestamp,
          })),
        );
        setAlertmessage(res.data.data.message);
        setTimelineerror('success');
        setTimeout(() => {
          handleopensnack();
        });
        setLocTableRows(locationRow[0]);
        setLoader(false);
        setVerifyLoader(true);
        setShowInward(true);
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

  const [sessionArr, setsessionArr] = useState([]);
  const [errorImg, setErrorImg] = useState(false);
  // const [sessionid, setsessionId] = useState('');
  const [refId, setRefId] = useState('');

  const getSessionId = (value) => {
    let sessionId = '';
    for (let i = 0; i < value.length; i++) {
      if (value[i] === ' ') {
        sessionId = value.substring(0, i);
        setsessionId(sessionId);
        break;
      }
    }
    return sessionId.trim();
  };

  const handleSessionchange = () => {
    setLoader(true);
    // const sessionId = getSessionId(option.value);
    const sessionId = localStorage.getItem('sessionId');
    sessionRequest(sessionId)
      .then((res) => {
        const result = res.data.data;
        if (result.object !== null) {
          const data = result.object.putAwayItemInfoList.map((item) => {
            return {
              ...item,
              checked: false,
              isVerified: false,
            };
          });
          setAlertmessage('Success Inward Verified');
          setTimelineerror('success');
          setsessionArr(data);
          setRefId(result.object.inwardMasterRefId);
          setLoader(false);

          setErrorImg(true);
        }
        if (result.object == null) {
          setAlertmessage(result.message);
          setTimelineerror('success');
          setOpensnack(true);
        }
      })
      .catch((err) => {
        setAlertmessage(err.response.data.message);
        setTimelineerror('error');
        setTimeout(() => {
          handleopensnack();
        });
        setLoader(false);
        setIsDisabled(true);
      });
  };

  const handleLocation = (item, index) => {
    let storageId = '';
    let storageName = '';
    putAwayLoactionData(orgId, locId)
      .then((res) => {
        if (res.data.data.object == null) {
          const newArr = [...sessionArr];
          newArr[index] = {
            ...item,
            storageId: storageId,
            storageName: storageName,
          };
          setsessionArr(newArr);
        } else {
          storageId = res.data.data.object.storageId;
          storageName = res.data.data.object.storageName;
          const newArr = [...sessionArr];
          newArr[index] = {
            ...item,
            storageId: storageId,
            storageName: storageName,
          };
          setsessionArr(newArr);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    console.log('sesssionArr', sessionArr);
    if (sessionArr.every((item) => item.checked === true && parentCheckBox === false)) {
      setParentCheckBox(true);
    }
    if (sessionArr.some((item) => item.checked == false && parentCheckBox === true)) {
      setParentCheckBox(false);
    }
  }, [sessionArr]);

  useEffect(() => {
    handleSessionchange();
  }, []);

  //POST the putaway api

  const [inputValues, setInputValues] = useState({});
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const handleParentCheckBox = (e) => {
    const checked = e.target.checked;
    setParentCheckBox(checked);

    if (e.target.checked == true) {
      const newArr = [...sessionArr].map((item) => ({
        ...item,
        checked: true,
      }));
      // console.log('newArr', newArr);
      setsessionArr(newArr);
    }
    if (e.target.checked == false) {
      const newArr = [...sessionArr].map((item) => ({
        ...item,
        checked: false,
      }));
      // console.log('newArr', newArr);
      setsessionArr(newArr);
    }
  };

  function handleCheckboxChange(item) {
    const newArr = [...sessionArr];
    const newArrIndex = newArr.findIndex((el) => el?.id === item?.id);
    newArr[newArrIndex] = {
      ...item,
      checked: !item?.checked,
    };
    // if (newArr[newArrIndex]['checked'] === true) {
    //   handleLocation(newArr[newArrIndex], newArrIndex);
    // }
    setsessionArr(newArr);
  }

  function handleInputChange(id, e) {
    setInputValues((prevValues) => {
      return { ...prevValues, [id]: { [e.target.name]: e.target.value } };
    });
  }
  const storageNameChange = (e, item, index) => {
    const newArr = [...sessionArr];
    newArr[index] = {
      ...item,
      storageName: e.target.value,
    };
    setsessionArr(newArr);
  };

  const storageIdChange = (e, item, index) => {
    const newArr = [...sessionArr];

    if (newArr[index]['isVerified'] == true) {
      newArr[index] = {
        ...item,
        isVerified: false,
        storageName: '',
        storageId: e.target.value,
      };
      setsessionArr(newArr);
    } else {
      newArr[index] = {
        ...item,
        storageId: e.target.value,
      };
      setsessionArr(newArr);
    }
  };
  let rowIndex = '';

  const findRowWithEmptyStorageId = (data) => {
    for (let i = 0; i < data?.length; i++) {
      if (data[i]?.storageId == '' || data[i]?.storageId == null) {
        rowIndex = i;
        break;
      } else if (data[i].storageId?.length !== 13) {
        rowIndex = i;
        break;
      }
    }
    return rowIndex !== '' ? true : false;
  };

  const verifyPayLoad = (data) => {
    const emptyStorageIdRow = findRowWithEmptyStorageId(data?.putAwayItemList);

    if (poNumber?.length === 0) {
      setAlertmessage('Please verify your PO Number');
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }
    if (sessionArr.every((item) => item?.checked == false)) {
      setAlertmessage('Please select atleast one product');
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }

    // if (emptyStorageIdRow === true) {
    //   setAlertmessage(Please verify Storage ID and it should be of 13 digits`);
    //   setTimelineerror('warning');
    //   setOpensnack(true);
    //   return false;
    // }

    return true;
  };

  const handleSaveputAway = () => {
    const payload = [...sessionArr];
    const putAwayItemList = payload
      .filter((item) => item?.checked == true)
      .map((item) => {
        return {
          inwardItemId: item?.inwardItemId,
          id: item?.id,
          storageId: item?.storageId,
          storageName: item?.storageName,
        };
      });
    const finalPayload = {
      userId: uidx,
      sessionId: sessionId,
      requestNumber: poNumber,
      inwardMasterRefId: refId,
      orgId: orgId,
      putAwayItemList: putAwayItemList,
    };

    if (!verifyPayLoad(finalPayload)) {
      setLoader(false);
      return;
    }

    setSave(true);
    postputAwayData(finalPayload)
      .then((res) => {
        setAlertmessage(res?.data?.data?.message);
        setTimelineerror('success');
        setOpensnack(true);
        setSave(false);
        localStorage.setItem('handleTabForPutAway', true);
        setTimeout(() => {
          navigate('/inventory/inward');
        }, 2000);
      })
      .catch((err) => {
        setAlertmessage(err?.response?.data?.message);
        setTimelineerror('error');
        setTimeout(() => {
          handleopensnack();
        }, 500);
        setSave(false);
      });
  };

  const handleCancelPutAway = () => {
    localStorage.setItem('handleTabOnCancelPutaway', 2);
    navigate('/inventory/inward');
  };

  const handleStorageIdVerification = (item, id, index) => {
    const findSelectedItem = [...sessionArr].find((item) => item.id === id);
    setVerifyStorageIdItem(findSelectedItem);
    const newArr = [...sessionArr];
    const barcode = newArr[index]['storageId'];
    // console.log('storageIdverify', barcode);
    setVerifyStorageLoader(true);
    fetchStorageDetailsWithBarcodeId(barcode)
      .then((res) => {
        setVerifyStorageLoader(false);
        const result = res.data.data;
        if (result.object == null) {
        }
        if (result.object !== null) {
          const newArr = [...sessionArr];
          newArr[index] = {
            ...item,
            storageName: result.object.storageName,
            isVerified: true,
          };
          setsessionArr(newArr);
          setAlertmessage(result.message);
          setTimelineerror('success');
          setOpensnack(true);
        }
      })
      .catch((err) => {
        setVerifyStorageLoader(false);
      });
  };

  const isMobileDevice = isSmallScreen();

  return (
    <DashboardLayout isMobileDevice={isMobileDevice}>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {isMobileDevice && (
        <SoftBox className={'inward-detail-main-header po-box-shadow'} mb={2}>
          <MobileNavbar title={'Put Away Details'} prevLink={true} />
        </SoftBox>
      )}
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
      <SoftBox
        sx={{
          height: 'calc(100vh - 99px)',
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'space-between'
          position: 'relative',
        }}
      >
        <Card sx={{ overflow: 'visible' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
          <SoftBox p={3}>
            <SoftBox mt={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      PO Number
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox>
                    {/* <SoftBox className="form-flex-inward-box">
                    <Grid item xs={11} md={11} xl={11}>
                      <SoftInput
                        type="text"
                        placeholder="Eg : 77700244"
                        onChange={(e) => setPoNumber(e.target.value.trim())}
                      />
                    </Grid>
                    {loader ? (
                      <Spinner />
                    ) : !loader && !verifyLoader ? (
                      <SoftBox className="wrapper-btn-box-inward">
                        <Button className="vefir-bnt" onClick={() => handlepodetails()}>
                          Verify
                        </Button>
                      </SoftBox>
                    ) : (
                      <Verified style={{ color: green[500] }} />
                    )}
                  </SoftBox> */}
                    <SoftTypography
                      component="label"
                      sx={{
                        fontSize: '1.5rem',
                      }}
                    >
                      {localStorage.getItem('poNum')}
                    </SoftTypography>
                    <Verified style={{ color: green[500] }} />
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
                            10221 Aurelie Pike Suite 997
                          </SoftTypography>
                          <br />
                          <SoftTypography
                            className="bill-add-text"
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                          >
                            Bangalore
                          </SoftTypography>
                          <br />
                          <SoftTypography
                            className="bill-add-text"
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                          >
                            560037
                          </SoftTypography>
                          <br />
                          <SoftTypography
                            className="bill-add-text"
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                          >
                            8745712569
                          </SoftTypography>
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
                            10221 Aurelie Pike Suite 997
                          </SoftTypography>
                          <br />
                          <SoftTypography
                            className="bill-add-text"
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                          >
                            Bangalore
                          </SoftTypography>
                          <br />
                          <SoftTypography
                            className="bill-add-text"
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                          >
                            560037
                          </SoftTypography>
                          <br />
                          <SoftTypography
                            className="bill-add-text"
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                          >
                            8745712569
                          </SoftTypography>
                        </SoftBox>
                      </Grid>
                    </Grid>
                  ) : (
                    ''
                  )}

                  {/* 
                {showInward ? (
                  <Grid item xs={12} sm={12}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Inward Sessions
                    </SoftTypography>
                    <SoftSelect
                      defaultValue={{ value: '', label: 'Session Id' }}
                      options={locRows}
                      onChange={(option) => handleSessionchange(option)}
                    />
                  </Grid>
                ) : (
                  ''
                )} */}

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    sx={{
                      marginTop: '1rem',
                    }}
                  >
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Inward Session
                    </SoftTypography>
                    <SoftBox>
                      <SoftTypography
                        component="label"
                        sx={{
                          fontSize: '1.5rem',
                        }}
                      >
                        {localStorage.getItem('sessionId')}
                      </SoftTypography>
                      <Verified style={{ color: green[500] }} />
                    </SoftBox>
                  </Grid>

                  {errorImg ? (
                    <Grid
                      container
                      spacing={3}
                      p={3}
                      sx={{
                        overflow: 'auto',
                      }}
                    >
                      {!isMobileDevice && (
                        <table
                          className="styled-table"
                          style={{
                            minWidth: '80rem',
                          }}
                        >
                          <thead>
                            <tr>
                              <th className="th-text">
                                <Checkbox
                                  checked={parentCheckBox}
                                  className="parent-checkbox"
                                  onChange={handleParentCheckBox}
                                />
                              </th>
                              <th className="gold-text">Sku</th>
                              <th className="gold-text">Last Inward</th>
                              <th className="gold-text">Batch Id</th>
                              <th className="gold-text">Gtin</th>
                              <th className="gold-text">Storage ID</th>
                              <th className="gold-text">Storage Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sessionArr.map((item, index) => {
                              return (
                                <>
                                  <tr key={item.id}>
                                    <td lassName="gold-text">
                                      <Checkbox
                                        className="child-checkbox"
                                        checked={item.checked}
                                        onChange={() => handleCheckboxChange(item)}
                                        {...label}
                                      />
                                    </td>
                                    <td className="gold-text">{item.itemName}</td>
                                    <td className="gold-text">{item.lastInward}</td>
                                    <td className="gold-text">{item.batchNumber}</td>
                                    {item.gtin === null ? (
                                      <td className="gold-text">-----</td>
                                    ) : (
                                      <td className="gold-text">{item.gtin}</td>
                                    )}
                                    <td>
                                      <SoftBox
                                        sx={{
                                          display: 'flex',
                                          gap: '1rem',
                                        }}
                                      >
                                        <SoftInput
                                          value={item.storageId !== null ? item.storageId : ''}
                                          // type="number"
                                          onChange={(e) => storageIdChange(e, item, index)}
                                        />
                                        {verifyStorageLoader && item.id == verifyStorageIdItem.id ? (
                                          <CircularProgress
                                            sx={{
                                              marginTop: '0.5rem',
                                            }}
                                            size={20}
                                            color="info"
                                          />
                                        ) : item['isVerified'] == true ? (
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
                                            onClick={() => handleStorageIdVerification(item, item.id, index)}
                                          />
                                        )}
                                      </SoftBox>
                                    </td>
                                    <td>
                                      <SoftInput
                                        value={item.storageName !== null ? item.storageName : ''}
                                        readOnly={true}
                                        disabled={true}
                                        // onChange={(e) => storageNameChange(e, item, index)}
                                      />
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </Grid>
                  ) : (
                    !isMobileDevice && (
                      <SoftBox className="middle-box-center">
                        <img className="src-img" src={noDatagif} alt="" />
                      </SoftBox>
                    )
                  )}
                </Grid>
              </Grid>
            </SoftBox>
          </SoftBox>

          {!isMobileDevice && (
            <SoftBox className="grad-info-btn action-btn-inward-detail">
              <SoftBox className="sm-btn-width" mr="10px">
                <SoftButton
                  onClick={handleCancelPutAway}
                  variant={buttonStyles.secondaryVariant}
                  className="outlined-softbutton"
                >
                  Cancel
                </SoftButton>
                {save ? (
                  <Spinner />
                ) : (
                  <SoftButton
                    color="info"
                    disabled={isDisabled}
                    onClick={handleSaveputAway}
                    variant={buttonStyles.primaryVariant}
                    className="contained-softbutton"
                  >
                    Save
                  </SoftButton>
                )}
              </SoftBox>
            </SoftBox>
          )}
        </Card>
        {errorImg && isMobileDevice ? (
          <SoftBox sx={{ height: '100%' }}>
            {!!sessionArr.length && (
              <Typography fontSize="16px" fontWeight={700} mt={2}>
                Product Details
              </Typography>
            )}
            {sessionArr.map((product, index) => (
              <PutAwayCard
                handleCheckboxChange={handleCheckboxChange}
                index={index}
                product={product}
                storageIdChange={storageIdChange}
                handleStorageIdVerification={handleStorageIdVerification}
                verifyStorageLoader={verifyStorageLoader}
                verifyStorageIdItem={verifyStorageIdItem}
                setsessionArr={setsessionArr}
              />
            ))}
          </SoftBox>
        ) : (
          isMobileDevice && <SoftBox sx={{ height: '100%' }}></SoftBox>
        )}
        {isMobileDevice && (
          <SoftBox className="grad-info-btn action-btn-inward-detail">
            <SoftBox className="sm-btn-width" mt={2}>
              <SoftButton className="vendor-second-btn" onClick={handleCancelPutAway}>
                Cancel
              </SoftButton>
              {save ? (
                <Spinner />
              ) : (
                <SoftButton color="info" disabled={isDisabled} onClick={handleSaveputAway}>
                  Save
                </SoftButton>
              )}
            </SoftBox>
          </SoftBox>
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default Putaway;
