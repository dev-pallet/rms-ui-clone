import {
  ActivatePaymentMachine,
  DeletePaymentMachine,
  UnlinkPaymentMachine,
  addPaymentMachine,
  allPaymentMachines,
  getLicenseDetails,
  machineDetailsApi,
  updateMachineDetails,
} from '../../../config/Services';
import {
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { buttonStyles } from '../Common/buttonColor';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import FormField from '../apps-integration/Pos/components/formfield';
import LinkIcon from '@mui/icons-material/Link';
import MuiAlert from '@mui/material/Alert';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import React, { useEffect, useRef, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftSelect from '../../../components/SoftSelect';
import SoftTypography from '../../../components/SoftTypography';
import Spinner from '../../../components/Spinner';
import Stack from '@mui/material/Stack';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PaytmDashboard = ({ vendorId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogdetails, setOpenDialogdetails] = useState(false);
  const [openDialogActive, setOpenDialogActive] = useState(false);
  const [vendorConfigId, setVendorConfigId] = useState('');
  const [counterValue, setCounterValue] = useState('');
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [initialCount, setInitialCount] = useState(3);
  const [totalCount, setTotalCount] = useState(0);
  const [editedNames, setEditedNames] = useState({});
  const [machineDetails, setMachineDetails] = useState();
  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const username = localStorage.getItem('user_name');
  const [selectedValues, setSelectedValues] = useState(['UPI', 'CARD']);
  const [selectedLicense, setSelectedLicense] = useState('');
  const [licenseName, setLicenseName] = useState();
  const [showErrormsg, setErrorMessage] = useState(false);
  const navigate = useNavigate();
  const activeCount = machineDetails?.filter((obj) => obj.status === 'ACTIVE')?.length;
  const [pageReload, setPageReload] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loaderMachineId, setLoaderMachineId] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [individualMachine, setIndividualMachine] = useState('');
  const [sessionErrormsg, setSessionErrormsg] = useState('');
  const [imei , setImei] = useState('');
  const [paperPosId , setPaperPosId] = useState('');
  const [merchantStorePosCode , setMerchantStorePosCode] = useState('');
  const [tid, setTid] = useState('');
  const showSnackBar = useSnackbar();
  const handleNAME = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setSelectedMachine((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleDeviceId = (e) => {
    setDeviceId(e.target.value);
  };
  const handleCheckboxChange = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
    // }
  };
  const handleRequest = () => {
    navigate('/palletpay/request/machines');
  };
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [CreateReload, SetCreateReload] = useState(false);
  const [machineLicenseData, setMachineLicenseData] = useState();
  useEffect(() => {
    const payload = {
      orgId: orgId,
      locId: locId,
      vendor: location.pathname === '/pallet-pay/paytm' ? 'PAYTM' : 'PINELABS',
      type: 'SELF',
    };
    allPaymentMachines(payload)
      .then((res) => {
        if (res?.data?.data?.data.machineId === null) {
          setMachineDetails(null);
        } else {
          setMachineDetails(res?.data?.data?.data);
          setTotalCount(res?.data?.data?.data?.length);
        }
      })
      .catch((err) => {});
    getLicenseDetails(payload)
      .then((res) => {
        setLicenseName(res?.data?.data?.data[0]?.licenseName);
        const Data = res?.data?.data?.data?.flatMap((license) => {
          if (license?.machineResponses) {
            return license?.machineResponses?.map((machinedetails) => {
              return {
                licenseName: license?.licenseName,
                licenseID: license?.licenseId,
                machineId: machinedetails?.machineId,
              };
            });
          }
          return [];
        });
        setMachineLicenseData(Data);
      })
      .catch((err) => {});
  }, [pageReload, location.pathname]);

  const [selectedValue, setSelectedValue] = React.useState('self');
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const [selectedVendor, SetSelectedVendor] = useState('');

  const [LicenseData, SetLicenseData] = useState();
  const [machineLinked, SetMachineLinked] = useState(false);

  const formattedData = LicenseData?.map((item) => ({
    value: item.licenseId,
    label: item.licenseName,
  }));

  const handleToggle = (counterName) => {
    const payload = {
      orgId: orgId,
      locId: locId,
    };
    getLicenseDetails(payload)
      .then((res) => {
        if (res?.data?.data?.data?.licenseId !== null) {
          SetLicenseData(res?.data?.data.data);
          if (res?.data?.data?.data[0]?.machineResponses !== null) {SetMachineLinked(true);}
        }
      })
      .catch((err) => {});
    handleOpenDailogActive();
    setActivationStatus((prevState) => ({
      ...prevState,
      [counterName]: !prevState[counterName],
    }));
  };

  const handleEditName = (counterName, newName) => {
    setEditedNames((prevState) => ({
      ...prevState,
      [counterName]: newName,
    }));
  };

  const handleSaveName = (counterName) => {
    const newName = editedNames[counterName];
    if (newName) {
      const updatedActivationStatus = { ...activationStatus };
      updatedActivationStatus[newName] = updatedActivationStatus[counterName];
      delete updatedActivationStatus[counterName];

      setActivationStatus(updatedActivationStatus);
      setEditedNames((prevState) => {
        const updatedState = { ...prevState };
        delete updatedState[counterName];
        return updatedState;
      });
    }
  };

  const getActiveCount = () => {
    if (totalCount === 0) {
      return 'No Machines';
    } else if (`${activeCount} of ${totalCount}` === 'undefined of undefined') {
      return 'No Machines';
    } else if (`${activeCount}` === 'undefined') {
      return 'No Machines';
    }

    return `${activeCount} of ${totalCount}`;
  };
  const [vendorDetails, setVendorDetails] = useState();



  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const onCategoryChange = (event) => {
    SetSelectedVendor(event.value);
  };
  const handleOpenDailogDetails = () => {
    setOpenDialogdetails(true);
  };
  const handleOpenDailogActive = () => {
    setOpenDialogActive(true);
  };

  const handleCloseDailogeActive = () => {
    setOpenDialogActive(false);
    setLoader(false);
    SetHasLicense(false);
    setSelectedLicense('');
    setSessionErrormsg('');
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCounterValue('');
    setImei('');

  };

  const handleDeactivate = (machineId) => {
    const uidx = JSON.parse(user_details).uidx;
    const userName = localStorage.getItem('user_name');

    const payload = {
      id: machineId,
      updatedBy: uidx,
      updatedByName: userName,
    };
    UnlinkPaymentMachine(payload)
      .then((res) => {
        setPageReload(!pageReload);
        setLoader(false);
        if (res?.data?.data?.message === 'SESSION_ONGOING_FOR_THE_LICENSE') {
          setOpen(true);
        }
      })
      .catch((err) => {});
  };

  const onLicensechange = (event) => {
    setSelectedLicense(event.value);
    setSessionErrormsg('');
    if (machineLinked) {
      setErrorMessage(true);
    }
  };

  useEffect(() => {
    const machineId = selectedMachine?.machineId;

    const payload = {
      machineId: machineId,
    };
    if (machineId) {
      machineDetailsApi(payload)
        .then((res) => {
          setIndividualMachine(res?.data?.data);
        })
        .catch((err) => {});
    }
  }, [selectedMachine]);

  const handleInputChange = (index, value) => {
    setVendorDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index].columnValue = value;
      return updatedDetails;
    });
  };
  const handleDeleteMachine = (machineId) => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const payload = {
      code: machineId,
      updatedBy: uidx,
    };
    DeletePaymentMachine(payload)
      .then((res) => {
        setOpenDialogdetails(false);
        setPageReload(!pageReload);
      })
      .catch((err) => {
        setLoader(false);
      });
  };
  const handleUpdatedetails = () => {
    setLoader(true);
    const machineId = selectedMachine?.machineId;
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const userName = localStorage.getItem('user_name');
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');

    const payload = {
      machineId: machineId,
      // paymentVendorConfigurationId: res?.data?.data?.data[0].paymentVendorConfigurationId,
      data: { tid: deviceId },
      machineName: selectedMachine?.machineName,
      status: individualMachine?.data?.status,
      vendor: location.pathname === '/pallet-pay/paytm' ? 'PAYTM' : 'PINELABS',
      locId: locId,
      orgId: orgId,
      connectivity: 'CLOUD',
      paymentCapabilities: 'UPI,CARD',
      rentalType: individualMachine?.data?.rentalType,
      updatedBy: uidx,
      updatedByName: userName,
    };
    if (location.pathname === '/pallet-pay/pinelabs') {
      payload.data.imei = imei;
    }
    updateMachineDetails(payload)
      .then((res) => {
        setOpenDialogdetails(false);
        setPageReload(!pageReload);
      })
      .catch((err) => {});
    setName('');
    setLoader(false);
  };
  const handleSavedetails = () => {
    const data = machineLicenseData?.some((entry) => entry.licenseID === selectedLicense);
    SetHasLicense(data);
    if (data) {
      return;
    }
    const machineId = selectedMachine.machineId;

    const Licensepayload = {
      orgId: orgId,
      locId: locId,
    };
    setLoader(true);
    getLicenseDetails(Licensepayload)
      .then((res) => {
        if (res?.data?.data?.data?.licenseId !== null) {
          SetLicenseData(res?.data?.data.data);

          if (res?.data?.data?.data[0]?.machineResponses !== null) {SetMachineLinked(true);}
        }
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
    const payload = {
      licenseId: selectedLicense,
      machineId: machineId,
      createdBy: createdById,
      createdByName: username,
    };

    ActivatePaymentMachine(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'SESSION_ONGOING_FOR_THE_LICENSE') {
          setSessionErrormsg('SESSION ONGOING FOR THE LICENSE');
          return;
        }
        setSessionErrormsg('');
        handleCloseDailogeActive();
        setPageReload(!pageReload);
      })
      .catch((err) => {});
    setOpenDialogdetails(false);
    setSessionErrormsg('');
  };
  const handleCloseDialogdetails = () => {
    setOpenDialogdetails(false);
    setImei('');
  };

  const handleSave = () => {
    setLoader(true);
    const data = {};
    vendorDetails?.forEach((e) => {
      data[e.columnName] = e.columnValue;
    });
    const vendorType = location.pathname === '/pallet-pay/paytm' ? 'PAYTM' : 'PINELABS';
    if (vendorType === 'PAYTM') {
      data['tid'] = tid;
    } else if (vendorType === 'PINELABS') {
      data['imei'] = imei;
      data['tid'] = tid;
      // data['merchantStorePosCode'] = merchantStorePosCode;
      // data['paperPosId'] = paperPosId;
    }

    const payload = {
      machineName: name,
      status: 'INACTIVE',
      vendor: vendorType,
      orgId: orgId,
      locId: locId,
      data: data,
      // paymentVendorConfigurationId: res?.data?.data?.data[0].paymentVendorConfigurationId,
      connectivity: 'CLOUD',
      paymentCapabilities: 'UPI,CARD',
      type: 'SELF',
      rentalType: 'NA',
      createdBy: createdById,
      createdByName: username,
      tid: tid,
    };
    addPaymentMachine(payload)
      .then((res) => {
        setPageReload(!pageReload);
        if (res?.data?.data?.es === 1) {
          showSnackBar(res?.data?.data?.message, 'error');
        }
        SetSelectedVendor('');
        setName('');
        setVendorDetails();
        setTid('');
      })
      .catch((err) => {});
    // SetCreateReload(true);
    setOpenDialog(false);
    setImei('');

    // handleCloseDialog();
  };
  const dialogRef = useRef(null);
  const selectElement = dialogRef.current;
  const [hasLicense, SetHasLicense] = useState(false);

  useEffect(() => {
    const data = machineLicenseData?.some((entry) => entry.licenseID === selectedLicense);
    SetHasLicense(data);
  }, [selectedLicense]);

  const onSettings = () => {
    if (location.pathname === '/pallet-pay/paytm') {
      navigate('/pallet-pay/paytm/settings');
    } else if (location.pathname === '/pallet-pay/pinelabs') {
      navigate('/pallet-pay/pinelabs/settings');
    }
  };

  const renderCards = () => {
    return machineDetails?.map((counter) => (
      <Card
        style={{ margin: '15px', display: 'flex', flexWrap: 'wrap', width: '330px !important' }}
        key={counter.machineId}
        className="productKpiCard"
      >
        <SoftBox>
          <SoftTypography
            // onClick={handleOpenDailogDetails}
            style={{
              fontSize: '0.8rem',
              marginRight: '20px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              minWidth: '330px !important',
            }}
          >
            {/* <img
              style={{ width: '40px', marginInline: '10px' }}
              src="https://marketplacedesignoye.s3.ap-south-1.amazonaws.com/food-bill-counter-icon-symbol-icon-vector-logo-.png"
              alt=""
            /> */}
            <SoftBox
              style={{ display: 'flex', alignItems: 'center' }}
              onClick={() => {
                handleOpenDailogDetails();
                setSelectedMachine(counter);
                setDeviceId(counter?.tid);
                setImei(counter?.machineDetails?.imei);
              }}
            >
              <SoftBox style={{ fontSize: 'large', marginTop: '5px', marginInline: '10px' }}>
                <PointOfSaleIcon />
              </SoftBox>
              <SoftTypography style={{ fontSize: '1rem', marginTop: '3px', minWidth: '150px' }}>
                {counter?.machineName}
              </SoftTypography>
            </SoftBox>
            {machineLicenseData?.find((data) => data?.machineId === counter?.machineId)?.licenseName && (
              <SoftBox style={{ marginInline: '20px', display: 'flex', alignItems: 'center' }}>
                <LinkIcon fontSize="medium" style={{ marginRight: '15px' }} />
                <SoftTypography
                  style={{
                    fontSize: '0.89rem',
                    backgroundColor: '#e3facf',
                    padding: '3px',
                    borderRadius: '8px',
                    paddingInline: '7px',
                  }}
                >
                  {machineLicenseData?.find((data) => data?.machineId === counter?.machineId)?.licenseName}
                </SoftTypography>
              </SoftBox>
            )}

            {loader && loaderMachineId === counter?.machineId ? (
              <SoftButton
                color={counter?.status === 'INACTIVE' ? 'info' : 'error'}
                variant="gradient"
                className="softbtnSize"
                style={{ marginLeft: 'auto', justifyContent: 'center', backgroundColor: '#0562FB', color: '#fff' }}
              >
                <Spinner size={'1.3rem'} />
              </SoftButton>
            ) : (
              <SoftButton
                color={counter?.status === 'INACTIVE' ? 'info' : 'error'}
                variant="gradient"
                className="softbtnSize"
                style={{ marginLeft: 'auto', justifyContent: 'center' }}
                onClick={() => {
                  setSelectedMachine(counter);
                  setLoaderMachineId(counter.machineId);
                  {
                    counter?.status === 'INACTIVE'
                      ? handleToggle(counter.machineId)
                      : handleDeactivate(counter.machineId);
                  }
                  setLoader(true);
                }}
              >
                {counter?.status === 'INACTIVE' ? 'Activate' : 'Deactivate'}

                {/* {activationStatus[counter.name] ? 'Deactivate' : 'Activate'} */}
              </SoftButton>
            )}
          </SoftTypography>
        </SoftBox>
      </Card>
    ));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      {/* <SoftBox>
        <SoftButton style={{ float: 'right' }} onClick={handleRequest}>
          Requested Machines
        </SoftButton>
      </SoftBox> */}
      <SoftBox
        className="bg-url"
        display="flex"
        justifyContent="flex-start"
        position="relative"
        minHeight="6.75rem"
        borderRadius="xl"
        bgColor="info"
        sx={{
          backgroundImage: `url(${'https://png.pngtree.com/background/20210712/original/pngtree-blue-abstract-background-picture-image_1170267.jpg'})`,
          // https://i.postimg.cc/hvjSRvvW/pngtree-simple-light-blue-background-image-396574.jpg
        }}
      />
      <Card
        sx={{
          backdropFilter: 'saturate(200%) blur(30px)',
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: 'relative',
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <SoftBox
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '10px',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <SoftBox style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {' '}
            <SoftBox style={{ border: '1px solid #cdc1c1', borderRadius: '8px' }}>
              <img
                src={location.pathname === '/pallet-pay/paytm' ?'https://5.imimg.com/data5/SELLER/Default/2021/7/WY/OP/ZW/133056971/paytm-all-in-one-pos-machine.png' : 'https://i.ibb.co/wJrDG1k/barandbench-2020-12-065cca8c-69da-4ef9-a6e4-e3eedd1a4532-we652dsax.jpg'}
                alt=""
                style={{ height: '50px', objectFit: 'contain', borderRadius: '8px' }}
              />
            </SoftBox>
            <SoftTypography style={{padding: '10px', fontSize: '1.1rem' }}>
              Payment Machines
            </SoftTypography>
          </SoftBox>

          <SoftBox style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto' }}>
            <SoftButton
              style={{
                marginLeft: 'auto',
                cursor: 'pointer',
              }}
              variant={buttonStyles.primaryVariant}
              className="contained-softbutton"
              onClick={handleOpenDialog}
            >
              +New
            </SoftButton>
            <SoftBox style={{ display: 'flex', justifyContent: 'end' }} onClick={onSettings}>
              <SettingsIcon fontSize="medium" />
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>

      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            SESSION ONGOING FOR THE LICENSE
          </Alert>
        </Snackbar>
      </Stack>

      <Container style={{ height: '100vh' }}>
        <SoftTypography style={{ margin: '15px' }}>{`${getActiveCount()} available`}</SoftTypography>

        {renderCards()}
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '450px',
            },
            backdropFilter: 'blur(5px)',
          },
        }}
      >
        <DialogTitle style={{ fontSize: '0.8rem' }}>Add Payment Machines</DialogTitle>

        <DialogContent>
          {location.pathname === '/pallet-pay/paytm' && (
            <>
              <FormField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxWidth="sm"
                fullWidth
                required
              />
              <FormField
                autoFocus
                margin="dense"
                label="TID"
                type="text"
                value={tid}
                onChange={(e) => setTid(e.target.value)}
                maxWidth="sm"
                fullWidth
                required
              />
            </>
          )}

          {location.pathname === '/pallet-pay/pinelabs' && (
            <>
              <FormField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxWidth="sm"
                fullWidth
                required
              />
              <FormField
                autoFocus
                margin="dense"
                label="IMEI"
                type="text"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                maxWidth="sm"
                fullWidth
                required
              />
              <FormField
                autoFocus
                margin="dense"
                label="TID"
                type="text"
                value={tid}
                onChange={(e) => setTid(e.target.value)}
                maxWidth="sm"
                fullWidth
                required
              />
              {/* <FormField
                autoFocus
                margin="dense"
                label="Merchant Store Pos Code"
                type="text"
                value={merchantStorePosCode}
                onChange={(e) => setMerchantStorePosCode(e.target.value)}
                maxWidth="sm"
                fullWidth
                required
              />
              <FormField
                autoFocus
                margin="dense"
                label="Paper Pos Id"
                type="text"
                value={paperPosId}
                onChange={(e) => setPaperPosId(e.target.value)}
                maxWidth="sm"
                fullWidth
                required
              /> */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <SoftButton
            variant={buttonStyles.secondaryVariant}
            className="outlined-softbutton"
            onClick={handleCloseDialog}
          >
            Cancel
          </SoftButton>
          <SoftButton variant={buttonStyles.primaryVariant} className="contained-softbutton" onClick={handleSave}>
            Save
          </SoftButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogdetails}
        onClose={handleCloseDialogdetails}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '450px',
            },
          },
        }}
      >
        <DialogTitle style={{ fontSize: '0.8rem' }}>Payment Machines Details</DialogTitle>

        <DialogContent>
          <FormField
            autoFocus
            disabled
            margin="dense"
            label="Machine Provider"
            value={selectedMachine?.vendor}
            maxWidth="sm"
            fullWidth
            required
          />

          {selectedMachine?.type && (
            <FormField
              autoFocus
              disabled
              margin="dense"
              label="Type"
              value={selectedMachine?.type}
              maxWidth="sm"
              fullWidth
              required
            />
          )}
          <FormField
            autoFocus
            margin="dense"
            label="Name"
            // type="number"
            name="machineName"
            value={selectedMachine?.machineName}
            onChange={(e) => handleNAME(e)}
            maxWidth="sm"
            fullWidth
            required
          />

          <FormField
            margin="dense"
            label="TID"
            value={deviceId}
            name="deviceId"
            onChange={(e) => handleDeviceId(e)}
            maxWidth="sm"
            fullWidth
          />
          {imei &&       <FormField
            autoFocus
            margin="dense"
            label="IMEI"
            type="text"
            value={imei}
            onChange={(e) => setImei(e.target.value)}
            maxWidth="sm"
            fullWidth
            required
          />}
         
          {machineLicenseData?.find((data) => data?.machineId === selectedMachine?.machineId)?.licenseName &&   <FormField
            disabled
            margin="dense"
            label="License Name"
            value={machineLicenseData?.find((data) => data?.machineId === selectedMachine?.machineId)?.licenseName}
            maxWidth="sm"
            fullWidth
          />}
        
          {/* <FormField
            disabled
            margin="dense"
            label="Rental Type"
            value={selectedMachine?.rentalType}
            maxWidth="sm"
            fullWidth
          /> */}
          <FormField disabled margin="dense" label="connectivity" value={'CLOUD'} maxWidth="sm" fullWidth />

          {/* <FormField
            autoFocus
            margin="dense"
            label="Type"
            type="number"
            value={counterValue}
            onChange={(e) => setCounterValue(e.target.value)}
            maxWidth="sm"
            fullWidth
          /> */}
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={handleCloseDialogdetails}>Cancel</SoftButton>
          <SoftButton color="error" variant="gradient" onClick={() => handleDeleteMachine(selectedMachine?.machineId)}>
            Delete
          </SoftButton>
          <SoftButton style={{ backgroundColor: '#0562FB', color: '#fff' }} onClick={handleUpdatedetails}>
            Save
          </SoftButton>
        </DialogActions>
      </Dialog>

      <Dialog
        ref={dialogRef}
        id="Dialog"
        PaperProps={{ style: { overflowY: 'visible' } }}
        open={openDialogActive}
        onClose={handleCloseDailogeActive}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '450px',
              minHeight: '250px',
            },
          },
        }}
      >
        {/* <DialogTitle style={{ fontSize: '0.8rem' }}>Payment Machines Details</DialogTitle> */}

        <DialogContent style={{ overflowY: 'visible' }}>
          <SoftBox
            sx={{
              zIndex: '4444 !important',
            }}
          >
            <SoftTypography style={{ fontSize: '1rem', marginBottom: '10px' }}>
              {' '}
              Select License for {selectedMachine?.machineName}{' '}
            </SoftTypography>

            <SoftSelect
              autoFocus
              options={formattedData}
              onChange={onLicensechange}
              label="License"
              placeholder="Select License"
              maxWidth="sm"
              fullWidth
              // menuPortalTarget={document.body}
            />
          </SoftBox>
          {sessionErrormsg && (
            <div
              style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '10px',
                border: '1px solid #f5c6cb',
                borderRadius: '5px',
                marginTop: '5px',
              }}
            >
              <p style={{ fontWeight: 'bold', margin: '0', fontSize: '1rem' }}>Warning:</p>
              <p style={{ margin: '0', fontSize: '0.8rem' }}>{sessionErrormsg}</p>
            </div>
          )}
          {hasLicense && (
            <div
              style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '10px',
                border: '1px solid #f5c6cb',
                borderRadius: '5px',
                marginTop: '5px',
              }}
            >
              <p style={{ fontWeight: 'bold', margin: '0', fontSize: '1rem' }}>Warning:</p>
              <p style={{ margin: '0', fontSize: '0.8rem' }}>This license is already linked with a machine.</p>
            </div>
          )}
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
          <SoftButton
            variant={buttonStyles.primaryVariant}
            className="contained-softbutton"
            onClick={handleSavedetails}
          >
            Activate
          </SoftButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default PaytmDashboard;
