import './tally.css';
import {
  createSyncLogData,
  createTallyConfig,
  fetchTallyConfig,
  importDataToTally,
  syncTallyData,
} from '../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import BusinessIcon from '@mui/icons-material/Business';
import CancelIcon from '@mui/icons-material/Cancel';
import ConfigIpAndPort from './components/ConfigIpAndPort';
import DateRange from './components/DateRange';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import SelectCompany from './components/SelectCompany';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import SyncData from './components/SyncData';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

const Tally = ({ setOpenTally, setAlreadyConfigured }) => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const accountId = localStorage.getItem('AppAccountId');
  const userName = localStorage.getItem('user_name');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const [nextLoader, setNextLoader] = useState(false);
  const [companyList, setCompanyList] = useState([
    {
      companyName: '',
      number: '',
    },
  ]);
  const [totalCompany, setTotalCompany] = useState([]);
  const [companyforImportData, setCompanyImportData] = useState(null);
  const [syncResult, setSyncResult] = useState(null);
  const [verifyTallyOnDevice, setVerifyTallyOnDevice] = useState(false);
  const [btnAuthenticated, setBtnAuthenticated] = useState(false);

  const [syncData, setSyncData] = useState([
    { name: 'Vendor', isChecked: false },
    { name: 'Purchase Order', isChecked: false },
    { name: 'Customer', isChecked: false },
    { name: 'Sales', isChecked: false },
    { name: 'Purchase Indent', isChecked: false },
    { name: 'GST', isChecked: false },
    { name: 'Vendor Credit', isChecked: false },
    { name: 'Delivery Challans', isChecked: false },
    { name: 'Eway-Bills', isChecked: false },
    { name: 'Invoice', isChecked: false },
    { name: 'Credit Note', isChecked: false },
    { name: 'Debit Note', isChecked: false },
  ]);

  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Ip Address & Port', 'Company', 'Sync Data', 'Date Range', 'Sync Result'];
  const stepIcons = [
    <DomainVerificationIcon style={{ color: activeStep === 0 ? '#0562fb' : '#888888' }} />,
    <BusinessIcon style={{ color: activeStep === 1 ? '#0562fb' : '#888888' }} />,
    <DriveFileMoveIcon style={{ color: activeStep === 2 ? '#0562fb' : '#888888' }} />,
    <DateRangeIcon style={{ color: activeStep === 3 ? '#0562fb' : '#888888' }} />,
    <WorkHistoryIcon style={{ color: activeStep === 4 ? '#0562fb' : '#888888' }} />,
  ];

  const [ipAddressAndPortData, setIpAddressAndPortData] = useState({
    ipAddress: '',
    port: '',
  });

  const [startDateTimeRange, setStartDateTimeRange] = useState('');
  const [endDateTimeRange, setEndDateTimeRange] = useState('');

  const handleVerifyTallyOnDevice = (e) => {
    if (e.target.checked == true && btnAuthenticated) {
      setBtnAuthenticated(false);
    }
    setVerifyTallyOnDevice(e.target.checked);
  };

  const handleIpAndPort = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setIpAddressAndPortData({
      ...ipAddressAndPortData,
      [name]: value,
    });
  };

  const handleCompanyChange = (e, index) => {
    const name = e.target.name;
    const value = e.target.value;
    const list = [...companyList];
    // console.log(list);
    list[index][name] = value;
    setCompanyList(list);
    // console.log(name, checked);
  };

  const handleRemoveCompany = (index) => {
    // console.log('index', index);
    const list = [...companyList];
    list.splice(index, 1);
    setCompanyList(list);
  };

  const handleAddCompany = (a) => {
    setCompanyList([...companyList, { companyName: '', number: '' }]);
  };

  const handleSyncDataChange = (e, index) => {
    const name = e.target.name;
    const newSyncData = [...syncData];
    newSyncData[index] = {
      name: name,
      isChecked: e.target.checked,
    };
    setSyncData(newSyncData);
  };

  const handleSelectCompanyToImportData = (option) => {
    setCompanyImportData(option);
  };

  const handleStartDateTimeChange = (date) => {
    const startDate = new Date(date.$d).toISOString();
    setStartDateTimeRange(startDate);
  };

  const handleEndDateTimeChange = (date) => {
    const endDate = new Date(date.$d).toISOString();
    setEndDateTimeRange(endDate);
  };

  const getTallyConfig = async () => {
    try {
      const response = await fetchTallyConfig(orgId, locId);
      const result = response.data.data.tallyConfig;
      // console.log(response);
      const companyListData = result.tallyCompanyList.map((item) => ({
        label: item.companyName,
        value: item.companyName,
      }));
      // console.log(companyListData);
      setTotalCompany(companyListData);
    } catch (err) {}
  };

  const verifyCompanyList = (data) => {
    return data.every((item, index) => {
      if (item.companyName === '') {
        showSnackbar(`Please enter some company name at row ${index + 1} or remove if not needed`, 'warning');
        return false;
      }
      if (item.number === '') {
        showSnackbar(`Please enter some company number at row ${index + 1} or remove if not`, 'warning');
        return false;
      }
      return true;
    });
  };

  const configCheck = (label) => {
    return syncData.find((item) => item.name == label).isChecked;
  };

  const createConfig = async () => {
    const filteredCompanyData = companyList.filter((item) => item.companyName !== '' && item.number !== '');

    const payload = {
      accountId: accountId,
      sourceOrgId: orgId,
      sourceLocId: locId,
      ipAddress: !verifyTallyOnDevice ? 'http://' + ipAddressAndPortData.ipAddress : null,
      cloudIpAddress: null,

      port: ipAddressAndPortData.port,
      cloudPort: null,
      syncConfig: {
        vendor: configCheck('Vendor'),
        vendorCredit: configCheck('Vendor Credit'),
        purchaseOrder: configCheck('Purchase Order'),
        purchaseIndent: configCheck('Purchase Indent'),
        sales: configCheck('Sales'),
        customer: configCheck('Customer'),
        deliveryChallan: configCheck('Delivery Challans'),
        salesInvoice: configCheck('Invoice'),
        salesCreditNote: configCheck('Credit Note'),
        salesDebitNote: configCheck('Debit Note'),
        multiplePriceLevel: false,
        bank: false,
        ewayBill: configCheck('Eway-Bills'),
      },
      createdBy: uidx,
      userCreated: userName,
      sameDevice: !verifyTallyOnDevice,
      tallyCompanyList: filteredCompanyData,
    };

    try {
      setNextLoader(true);
      const response = await createTallyConfig(payload);
      getTallyConfig();
      setNextLoader(false);
      showSnackbar('Offline tally configured', 'success');

      // console.log('response', response);
    } catch (err) {
      setNextLoader(false);
    }
  };

  const saveSyncLogData = async (data) => {
    const syncAllData = syncData
      .filter((item) => item.isChecked)
      .map((item) => item.name.replace(/\s+/g, '_').toUpperCase());

    const payload = {
      ...data,
      orgId: orgId,
      locId: locId,
      // importType: syncAllData,
      importType: 'VENDOR',
      from: startDateTimeRange,
      to: endDateTimeRange,
      syncedByUidx: uidx,
      syncedByUser: userName,
    };
    // console.log(payload);

    try {
      const result = await createSyncLogData(payload);
      // console.log(result);
    } catch (err) {}
  };

  const importTallyData = async (data) => {
    const payload = {
      ipAddress: !verifyTallyOnDevice ? 'NA' : ipAddressAndPortData.ipAddress,
      port: ipAddressAndPortData.port,
      data: data?.xml,
    };
    // console.log('importTallyData');
    try {
      setNextLoader(true);
      const result = await importDataToTally(payload);
      setSyncResult(result.data);
      saveSyncLogData(result.data);
      setNextLoader(false);
      if (result.data.es == 1) {
        showSnackbar(result.data.message, 'error');
      }
      // console.log('import result', result);
    } catch (err) {}
  };

  const syncDataForTally = async () => {
    const syncAllData = syncData
      .filter((item) => item.isChecked)
      .map((item) => item.name.replace(/\s+/g, '_').toUpperCase());

    const payload = {
      orgId: orgId,
      locId: locId,
      companyName: companyforImportData.value,
      importType: syncAllData,
      from: startDateTimeRange,
      to: endDateTimeRange,
      syncedByUidx: uidx,
      syncedByUser: userName,
    };

    try {
      setNextLoader(true);
      const result = await syncTallyData(payload);
      // console.log('syncTallyResult', result);
      const importData = result.data.data;
      importTallyData(importData);
      setNextLoader(false);
    } catch (err) {}
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    // console.log(activeStep);
    if (activeStep == 0) {
      if (verifyTallyOnDevice == true && ipAddressAndPortData.ipAddress == '') {
        showSnackbar('Please enter ip address', 'warning');
        return;
      }
      if (verifyTallyOnDevice == true && ipAddressAndPortData.ipAddress.startsWith('http://')) {
        showSnackbar('Please remove http:// just provide the ip address', 'warning');
        return;
      }
      if (ipAddressAndPortData.port == '' || ipAddressAndPortData.port.length < 4) {
        showSnackbar('Please check port number, it should be of 4 digits', 'warning');
        return;
      }
    }

    if (activeStep == 1) {
      if (!verifyCompanyList(companyList)) {
        return;
      }
    }

    if (activeStep == 3) {
      createConfig();
    }
    if (activeStep == 4) {
      syncDataForTally();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleFinish = () => {
    // Implement logic for finishing the stepper, e.g., submitting the form
    setOpenTally(false);
    // setConfiguredTally(true);
    setAlreadyConfigured(true);
    navigate('/app/Tally');
  };

  useEffect(() => {
    if (activeStep == 3) {
      createConfig();
    }
    if (activeStep == 4) {
      syncDataForTally();
    }
  }, [activeStep]);

  const DataHistory = () => {
    return (
      <SoftBox className="data-history">
        <SoftBox className="data-history-details">
          <SoftTypography className="date-history-top-heading">
            {/* Please wait while we synchronize the data you entered and configure it in Tally. */}
          </SoftTypography>
        </SoftBox>
        <SoftBox className="data-history-sync-dtails">
          {nextLoader ? (
            <SoftBox className="syn-details-loader">
              <SoftTypography className="date-history-top-heading">
                Please wait while we synchronize the data you entered and configure it in Tally.
              </SoftTypography>
              <Spinner />
            </SoftBox>
          ) : (
            <SoftBox className="sync-result-data">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox className="sync-data-details-result">
                    <SoftTypography className="sync-data-name">Created</SoftTypography>
                    <SoftTypography className="sync-data-count">{syncResult?.created}</SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox className="sync-data-details-result">
                    <SoftTypography className="sync-data-name">Altered</SoftTypography>
                    <SoftTypography className="sync-data-count">{syncResult?.altered}</SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox className="sync-data-details-result">
                    <SoftTypography className="sync-data-name">Deleted</SoftTypography>
                    <SoftTypography className="sync-data-count">{syncResult?.deleted}</SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox className="sync-data-details-result">
                    <SoftTypography className="sync-data-name">Combined</SoftTypography>
                    <SoftTypography className="sync-data-count">{syncResult?.combined}</SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox className="sync-data-details-result">
                    <SoftTypography className="sync-data-name">Ignored</SoftTypography>
                    <SoftTypography className="sync-data-count">{syncResult?.ignored}</SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox className="sync-data-details-result">
                    <SoftTypography className="sync-data-name">Errors</SoftTypography>
                    <SoftTypography className="sync-data-count">{syncResult?.errors}</SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox className="sync-data-details-result">
                    <SoftTypography className="sync-data-name">Cancelled</SoftTypography>
                    <SoftTypography className="sync-data-count">{syncResult?.cancelled}</SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox className="sync-data-details-result">
                    <SoftTypography className="sync-data-name">Last v chid</SoftTypography>
                    <SoftTypography className="sync-data-count">{syncResult?.lastVchid}</SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox className="sync-data-details-result">
                    <SoftTypography className="sync-data-name">Last Mid</SoftTypography>
                    <SoftTypography className="sync-data-count">{syncResult?.lastMid}</SoftTypography>
                  </SoftBox>
                </Grid>
              </Grid>
            </SoftBox>
          )}
        </SoftBox>
      </SoftBox>
    );
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ConfigIpAndPort
            verifyTallyOnDevice={verifyTallyOnDevice}
            handleVerifyTallyOnDevice={handleVerifyTallyOnDevice}
            ipAddressAndPortData={ipAddressAndPortData}
            handleIpAndPort={handleIpAndPort}
            setActiveStep={setActiveStep}
            setBtnAuthenticated={setBtnAuthenticated}
            btnAuthenticated={btnAuthenticated}
          />
        );
      case 1:
        return (
          <SelectCompany
            companyList={companyList}
            handleAddCompany={handleAddCompany}
            handleRemoveCompany={handleRemoveCompany}
            handleCompanyChange={handleCompanyChange}
          />
        );
      case 2:
        return <SyncData syncData={syncData} handleSyncDataChange={handleSyncDataChange} />;
      case 3:
        return (
          <DateRange
            handleStartDateTimeChange={handleStartDateTimeChange}
            handleEndDateTimeChange={handleEndDateTimeChange}
            totalCompany={totalCompany}
            handleSelectCompanyToImportData={handleSelectCompanyToImportData}
          />
        );
      case 4:
        return <DataHistory />;
      default:
        return 'unknown step';
    }
  };

  // useEffect(() => {
  //   console.log('activeStep', activeStep);
  // }, [activeStep]);

  const handleCloseTally = () => {
    setOpenTally(false);
    // setConfiguredTally(true);
  };

  return (
    <SoftBox className="tally">
      {/* <p>sdds</p> */}
      <SoftBox className="tally-info">
        <SoftBox className="tally-close">
          <CancelIcon onClick={() => handleCloseTally()} />
        </SoftBox>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel icon={stepIcons[index]}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <SoftBox className="step-content">{getStepContent(activeStep)}</SoftBox>
      </SoftBox>

      <SoftBox className="tally-btns">
        <SoftButton className="tally-back-btn" onClick={handleBack} disabled={activeStep === 0}>
          Back
        </SoftButton>
        {nextLoader ? (
          <Spinner />
        ) : (
          <SoftButton className="tally-next-btn" onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </SoftButton>
        )}
      </SoftBox>
    </SoftBox>
  );
};

export default Tally;
