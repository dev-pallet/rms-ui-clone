import {
  ActivatePaymentMachine,
  DeletePaymentMachine,
  UnlinkPaymentMachine,
  VendorInputFields,
  addPaymentMachine,
  allPaymentMachines,
  getLicenseDetails,
  machineDetailsApi,
  updateMachineDetails,
} from '../../../config/Services';
import {
  Card,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  Grid,
} from '@mui/material';
import { FormControlLabel } from '@mui/material';
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

const Paymentmachine = () => {
  const [activationStatus, setActivationStatus] = useState({});
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
  const [showErrormsg, setErrormessage] = useState(false);
  const navigate = useNavigate();
  const activeCount = machineDetails?.filter((obj) => obj.status === 'ACTIVE')?.length;
  const [pageReload, setPageReload] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loaderMachineId, setLoaderMachineId] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [individualMachine, setIndividualMachine] = useState('');
  const [SessionErrormsg, setSessionErrormsg] = useState('');
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
  const [machineLicenseData, SetMachineLicenseData] = useState();
  useEffect(() => {
    const payload = {
      orgId: orgId,
      locId: locId,
      vendor:'EZETAP',
      type:'PALLET'
    };
    const licensePayload = {
      orgId: orgId,
      locId: locId
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
    getLicenseDetails(licensePayload)
      .then((res) => {
        setLicenseName(res?.data?.data?.data[0]?.licenseName);
        const data = res?.data?.data?.data?.flatMap((license) => {
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
        SetMachineLicenseData(data);
      })
      .catch((err) => {});
    setPageReload(false);
  }, [pageReload]);
  useEffect(() => {
    // Initialize activation status for the initial counters
    const initialActivationStatus = {
      'Payment Machine 1': false,
      'Payment Machine 2': false,
      'Payment Machine 3': false,
    };
    setActivationStatus(initialActivationStatus);
  }, []);

  const [selectedValue, setSelectedValue] = React.useState('PALLET');
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const optiondata = [
    { value: 'NEW', label: 'New' },
    { value: 'REPLACEMENT', label: 'Replacement' },
  ];

  const [selectedVendor, setSelectedVendor] = useState('');

  const vendorData = [{ value: 'EZETAP', label: 'Ezetap' }];

  const ConnectivityData = [{ value: 'CLOUD', label: 'CLOUD' }];
  const [Connectivity, SetConnectivity] = useState('CLOUD');

  const RentalData = [
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'QUARTERLY', label: 'Quarterly' },
    { value: 'ANNUALLY', label: 'Annually' },
  ];

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

  useEffect(() => {
    if (selectedVendor !== '') {
      const payload = {
        vendor: 'EZETAP',
        actionName: 'ADD_MACHINE',
      };
      VendorInputFields(payload)
        .then((res) => {
          setVendorDetails(res?.data?.data?.data?.config);
          setVendorConfigId(res?.data?.data?.data.vendorConfigurationId);
        })
        .catch((err) => {});
    }
  }, [selectedVendor]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setTid('');

  };

  const onCategoryChange = (event) => {
    setSelectedVendor(event.value);
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
    setTid('');
  };

  const HandleDeactivate = (machineId) => {
    const uidx = JSON.parse(user_details).uidx;
    const userName = localStorage.getItem('user_name');

    const payload = {
      id: machineId,
      updatedBy: uidx,
      updatedByName: userName,
    };
    UnlinkPaymentMachine(payload)
      .then((res) => {
        setPageReload(true);
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
      setErrormessage(true);
    }
  };

  useEffect(() => {
    const machineId = selectedMachine?.machineId;

    const payload = {
      machineId: machineId,
    };
    machineDetailsApi(payload)
      .then((res) => {
        setIndividualMachine(res?.data?.data);
      })
      .catch((err) => {});
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
        setPageReload(true);
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
      data: { deviceId: deviceId },
      machineName: selectedMachine?.machineName,
      status: individualMachine?.data?.status,
      vendor: individualMachine?.data?.vendor,
      locId: locId,
      orgId: orgId,
      connectivity: 'CLOUD',
      paymentCapabilities: 'UPI,CARD',
      rentalType: individualMachine?.data?.rentalType,
      updatedBy: uidx,
      updatedByName: userName,
    };
    updateMachineDetails(payload)
      .then((res) => {
        setOpenDialogdetails(false);
        setPageReload(true);
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
        setPageReload(true);
      })
      .catch((err) => {});
    setOpenDialogdetails(false);
    setSessionErrormsg('');
  };
  const handleCloseDialogdetails = () => {
    setOpenDialogdetails(false);
  };

  const handleSave = () => {
    setLoader(true);
    const data = {};
    vendorDetails?.forEach((e) => {
      data[e.columnName] = e.columnValue;
    });

    const payload = {
      machineName: name,
      status: 'INACTIVE',
      vendor: selectedVendor,
      orgId: orgId,
      locId: locId,
      rentalType: 'MONTHLY',
      data: data,
      connectivity: 'CLOUD',
      paymentCapabilities: 'UPI,CARD',
      // paymentVendorConfigurationId: res?.data?.data?.data[0].paymentVendorConfigurationId,
      type: selectedValue,
      createdBy: createdById,
      createdByName: username,
      tid: tid,
    };
    addPaymentMachine(payload)
      .then((res) => {
        setPageReload(true);
        if (res?.data?.data?.es === 1) {
          showSnackBar(res?.data?.data?.message,'error');
        }
      })
      .catch((err) => {
      });
    // SetCreateReload(true);
    setOpenDialog(false);
    setSelectedVendor('');
    setName('');
    setTid('');

    setVendorDetails();
    // handleCloseDialog();
  };
  const dialogRef = useRef(null);
  const selectElement = dialogRef.current;
  const [hasLicense, SetHasLicense] = useState(false);

  useEffect(() => {
    const data = machineLicenseData?.some((entry) => entry.licenseID === selectedLicense);
    SetHasLicense(data);
  }, [selectedLicense]);

  const renderCards = () => {
    const initialCounters = [
      { name: 'Billing counter 1', editable: false },
      { name: 'Billing counter 2', editable: false },
      { name: 'Billing counter 3', editable: false },
    ];

    const additionalCounters = Object.keys(activationStatus).map((counterName) => ({
      name: counterName,
      editable: true,
    }));

    const counters = [...additionalCounters];

    return machineDetails?.map((counter) => (
      <Card
        style={{ margin: '15px', display: 'flex', flexWrap: 'wrap', width: '330px !important' }}
        key={counter.machineId}
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
              style={{ display: 'flex' }}
              onClick={() => {
                handleOpenDailogDetails();
                setSelectedMachine(counter);
                setDeviceId(counter?.machineDetails?.deviceId);
                setTid(counter?.tid);
              }}
            >
              <SoftBox style={{ fontSize: 'large', marginTop: '5px', marginInline: '10px' }}>
                <PointOfSaleIcon />
              </SoftBox>
              <SoftTypography style={{ fontSize: '1rem', marginTop: '3px', minWidth: '150px' }}>
                {counter.machineName}
              </SoftTypography>

              {/* {editedNames[counter.name] !== undefined ? (
              <>
                <TextField
                  value={editedNames[counter.name]}
                  onChange={(e) => handleEditName(counter.name, e.target.value)}
                />
                <SoftButton color="info" style={{ marginLeft: '10px' }} onClick={() => handleSaveName(counter.name)}>
                  Save
                </SoftButton>
              </>
            ) : (
              <>
                {counter.name}
                {!counter.editable && (
                  <SoftButton color="info" style={{ marginLeft: '10px' }} onClick={() => handleToggle(counter.name)}>
                    {activationStatus[counter.name] ? 'Deactivate' : 'Activate'}
                  </SoftButton>
                )}
                {counter.editable && (
                  <SoftBox style={{ fontSize: 'medium' }}>
                    <EditIcon
                      style={{ marginLeft: '10px' }}
                      onClick={() => handleEditName(counter.name, counter.name)}
                    />
                  </SoftBox>
                )}
              </>
            )}{' '} */}
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
                  {
                    counter?.status === 'INACTIVE'
                      ? handleToggle(counter.machineId)
                      : HandleDeactivate(counter.machineId);
                  }
                  setSelectedMachine(counter);
                  setLoaderMachineId(counter.machineId);
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
      <DashboardNavbar prevLink={true}/>
      {/* <SoftBox>
        <SoftButton style={{ float: 'right' }} onClick={handleRequest}>
          Requested Machines
        </SoftButton>
      </SoftBox> */}
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            SESSION ONGOING FOR THE LICENSE
          </Alert>
        </Snackbar>
      </Stack>
      <Card style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '15px', padding: '15px' }}>
        <SoftTypography style={{ marginInline: '20px', padding: '10px', fontSize: '1.1rem' }}>
          Payment Machines
        </SoftTypography>
        <SoftButton
          style={{
            marginLeft: 'auto',
            //   height: '20px',
            //   backgroundImage: 'linear-gradient(135deg, #0562FB, #87A0E5)',
            //   border: 'none',
            //   color: 'white',
            //   cursor: 'pointer',
          }}
          variant={buttonStyles.primaryVariant}
          className="contained-softbutton"
          onClick={handleOpenDialog}
        >
          +New
        </SoftButton>
      </Card>

      <Container style={{ height: '100vh' }}>
        <SoftTypography style={{ margin: '15px' }}>{`${getActiveCount()} available`}</SoftTypography>

        {renderCards()}

        <hr />
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
          },
        }}
      >
        <DialogTitle style={{ fontSize: '0.8rem' }}>Add Payment Machines</DialogTitle>

        <DialogContent>
          {/* <FormControl component="fieldset">
            <RadioGroup row value={selectedValue} onChange={handleChange} style={{ marginLeft: '30px', gap: '20px' }}>
              <FormControlLabel value="SELF" control={<Radio />} label="Self" />

              <FormControlLabel value="PALLET" control={<Radio />} label="Provided by Pallet" />
            </RadioGroup>
          </FormControl> */}

          <SoftBox style={{ marginTop: '10px' }}>
            <SoftSelect
              onChange={onCategoryChange}
              autoFocus
              options={vendorData}
              label="Vendor"
              placeholder="Select Provider"
              maxWidth="sm"
              fullWidth
              // menuPortalTarget={document.body}
            />
          </SoftBox>

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

          {/* <FormField
            autoFocus
            margin="dense"
            disabled={selectedValue !== 'self'}
            label="Api User Name"
            type="number"
            value={counterValue}
            onChange={(e) => setCounterValue(e.target.value)}
            maxWidth="sm"
            fullWidth
          />
          <FormField
            autoFocus
            margin="dense"
            disabled={selectedValue !== 'self'}
            label="Organization Code"
            type="number"
            value={counterValue}
            onChange={(e) => setCounterValue(e.target.value)}
            maxWidth="sm"
            fullWidth
          />
          <FormField
            autoFocus
            margin="dense"
            label="App Key"
            type="number"
            value={counterValue}
            onChange={(e) => setCounterValue(e.target.value)}
            maxWidth="sm"
            fullWidth
          /> */}
          {/* <FormField
            autoFocus
            margin="dense"
            label="Device Id"
            type="number"
            value={counterValue}
            onChange={(e) => setCounterValue(e.target.value)}
            maxWidth="sm"
            fullWidth
          /> */}
          {vendorDetails?.map((detail, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <FormField
                // disabled={selectedValue !== 'self'}
                label={detail.columnName}
                placeholder={detail.placeholderName}
                fullWidth
                value={detail.columnValue}
                onChange={(e) => handleInputChange(index, e.target.value)}
                margin="normal"
                variant="outlined"
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
            <SoftTypography style={{ fontSize: '0.8rem', margin: '6px' }}>Connectivity</SoftTypography>
            <SoftSelect
              options={ConnectivityData}
              defaultValue={{ value: Connectivity, label: Connectivity }}
              label="Connectivity"
              placeholder="Select Connectivity"
              maxWidth="sm"
              fullWidth
              // menuPortalTarget={document.body}
            />
          </Grid>
          <Grid item xs={12} sm={6} style={{ display: 'flex', marginLeft: '15px' }}>
            <SoftBox>
              <SoftTypography style={{ fontSize: '0.83rem', marginTop: '10px', marginLeft: '-10px' }}>
                Payment Capabilities
              </SoftTypography>
              <FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
                <FormControlLabel
                  required
                  control={
                    <Checkbox checked={selectedValues.includes('UPI')} onChange={() => handleCheckboxChange('UPI')} />
                  }
                  label="UPI"
                />
                <FormControlLabel
                  required
                  control={
                    <Checkbox checked={selectedValues.includes('CARD')} onChange={() => handleCheckboxChange('CARD')} />
                  }
                  label="CARD"
                />
              </FormGroup>
            </SoftBox>
          </Grid>

          {/* <SoftBox
            style={{ display: 'flex', flexDirection: 'Column', gap: '20px', marginTop: '20px', marginBottom: '80px' }}
          >
            {selectedValue !== 'self' && (
              <SoftSelect
                autoFocus
                options={RentalData}
                label="Rental Type"
                placeholder="Rental Type"
                maxWidth="sm"
                fullWidth
                menuPortalTarget={document.body}
              />
            )}

            {selectedValue !== 'self' && (
              <SoftSelect
                style={{ marginTop: '20px !important' }}
                autoFocus
                options={optiondata}
                label="Type"
                placeholder="Type"
                maxWidth="sm"
                fullWidth
                menuPortalTarget={document.body}
              />
            )}
          </SoftBox> */}
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
          {/* <FormControl component="fieldset" >
      <RadioGroup row value={selectedValue} onChange={handleChange} style={{marginLeft:"30px" , gap:"20px"}}>
        <FormControlLabel
          value="self"
          control={<Radio  />}
          label="Self"
        />

        <FormControlLabel
          value="provided_by_pallet"
          control={<Radio  />}
          label="Provided by Pallet"
        />
      </RadioGroup>
    </FormControl> */}

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
            disabled
            margin="dense"
            label="Device Id"
            value={deviceId}
            name="deviceId"
            onChange={(e) => handleDeviceId(e)}
            maxWidth="sm"
            fullWidth
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
          <FormField
            disabled
            margin="dense"
            label="License Name"
            value={machineLicenseData?.find((data) => data?.machineId === selectedMachine?.machineId)?.licenseName}
            maxWidth="sm"
            fullWidth
          />
          <FormField
            disabled
            margin="dense"
            label="Rental Type"
            value={selectedMachine?.rentalType}
            maxWidth="sm"
            fullWidth
          />
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
          {SessionErrormsg && (
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
              <p style={{ margin: '0', fontSize: '0.8rem' }}>{SessionErrormsg}</p>
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

export default Paymentmachine;
