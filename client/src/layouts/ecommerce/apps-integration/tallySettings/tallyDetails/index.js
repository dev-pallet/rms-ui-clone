import './index.css';
import { Box, CircularProgress, Slider } from '@mui/material';
import { createSyncLogData, createTallyConfig, fetchTallyConfig, syncTallyData } from '../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import DatePicker from 'react-datepicker';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TallyFormEdit from '../tallyForm';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const TallyFormService = ({ openTally, setOpenTally, alreadyConfigured, setAlreadyConfigured }) => {
  const [open, setOpen] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [ipAddressError, setIpAddressError] = useState(false);
  const [port, setPort] = useState('');
  const [portError, setPortError] = useState(false);
  const [userName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [dataOptions, setDataOptions] = useState([]);
  const [syncDateFrom, setSyncDateFrom] = useState(null);
  const [syncDateTo, setSyncDateTo] = useState(null);
  const [frequencyOptions, setFrequencyOptions] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [syncData, setSyncData] = useState(false);
  const companyNames = ['ACME_INC_I', 'ACME_INC_II', 'ACME_INC_III', 'ACME_INC_IV', 'ACME_INC_V'];
  const [tallySavedData, setTallySavedData] = useState(false);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const showSnackbar = useSnackbar();
  const [tallyConfigured, setTallyConfigured] = useState(false);
  const [tallyConfiguredData, setTallyConfiguredData] = useState({});
  const [syncCompanyData, setSyncComapnyData] = useState();
  const [tallyFormEdit, setTallyFormEdit] = useState(false);
  const [syncXmlData, setSyncXmlData] = useState('');
  const [syncPort, setSyncPort] = useState('');
  const [syncDataInfo, setSyncDataInfo] = useState('');
  const user_details = localStorage.getItem('user_details');
  const userUidx = JSON.parse(user_details).uidx;
  const userNameDetails = JSON.parse(user_details).firstName + ' ' + JSON.parse(user_details).secondName;


  const companyNamesI = [
    'Vendor',
    'Vendor Credit',
    'Purchase Indent',
    'Purchase Order',
    'Sales',
    'GST',
    'Delivery Challans',
    'Eway-Bills',
    'Invoice',
    'Credit Note',
    'Debit Note',
    'Use multiple price level',
  ];
  const [stepErrors, setStepErrors] = useState({
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const syncDataLoader = 'https://codigofuente.io/wp-content/uploads/2018/09/progress.gif';

  useEffect(() => {
    setLoading(false);
  }, [open]);

  const handleTallyForm = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCompanyCheckbox = (company) => {
    setCompanyOptions((prevOptions) => {
      const updatedOptions = prevOptions.includes(company)
        ? prevOptions.filter((option) => option !== company)
        : [...prevOptions, company];
      setStepErrors((prevErrors) => ({ ...prevErrors, 3: updatedOptions.length === 0 }));
      return updatedOptions;
    });
  };

  const handleCompanyCheckboxI = (data) => {
    setDataOptions((prevOptions) => {
      const updatedOptions = prevOptions.includes(data)
        ? prevOptions.filter((option) => option !== data)
        : [...prevOptions, data];
      setStepErrors((prevErrors) => ({ ...prevErrors, 4: updatedOptions.length === 0 }));
      return updatedOptions;
    });
  };

  const handleFrequencyCheckbox = (frequency) => {
    setFrequencyOptions((prevOptions) => {
      const updatedOptions = prevOptions.includes(frequency)
        ? prevOptions.filter((option) => option !== frequency)
        : [...prevOptions, frequency];

      setStepErrors((prevErrors) => ({
        ...prevErrors,
        5: step === 5 && updatedOptions.length === 0,
        6: step === 6 && updatedOptions.length === 0,
      }));

      return updatedOptions;
    });
  };

  const getButtonText = () => {
    if (loading) {
      return <CircularProgress size={20} sx={{ color: '#fff' }} />;
    }
    return step === 8 ? 'Save' : 'Next';
  };
  const getCancelButtonText = () => {
    return step === 2 || step === 3 || step === 4 || step === 5 || step === 6 || step === 7 ? 'Back' : 'Cancel';
  };

  const selectedDataOptions = dataOptions.map((option, index) => ({ id: index, name: option }));

  const isVendorSelected = selectedDataOptions.some((option) => option.name === 'Vendor');
  const isPurchaseIndentSelected = selectedDataOptions.some((option) => option.name === 'Purchase Indent');
  const isPurchaseOrderSelected = selectedDataOptions.some((option) => option.name === 'Purchase Order');
  const isInvoiceSelected = selectedDataOptions.some((option) => option.name === 'Invoice');
  const iscreditSelected = selectedDataOptions.some((option) => option.name === 'Credit Note');
  const isDebitSelected = selectedDataOptions.some((option) => option.name === 'Debit Note');

  // tally post api

  const payload = {
    accountId: null,
    sourceOrgId: orgId,
    sourceLocId: locId,
    ipAddress: ipAddress || null,
    cloudIpAddress: null,
    port: port,
    cloudPort: null,
    syncTimeFrequency: 1,
    syncTimeUnit: 'MINUTES',
    syncConfig: {
      vendorName: isVendorSelected ? true : false,
      vendorGstName: isVendorSelected ? true : false,
      vendorGst: isVendorSelected ? true : false,
      vendorPan: isVendorSelected ? true : false,
      customerName: false,
      customerCompany: false,
      customerGst: false,
      customerPan: false,
      purchaseIndent: isPurchaseIndentSelected ? true : false,
      purchaseOrder: isPurchaseOrderSelected ? true : false,
      purchaseBill: isPurchaseOrderSelected ? true : false,
      vendorCredit: isVendorSelected ? true : false,
      logisticPackage: false,
      logisticDeliveryChallan: false,
      logisticEWayBill: false,
      logisticFleetManagement: false,
      invoice: isInvoiceSelected ? true : false,
      invoiceSaleCreditNote: isInvoiceSelected ? true : false,
      invoiceSeparateDiscount: isInvoiceSelected ? true : false,
      salesMultiplePriceLevel: false,
      salesInvoice: false,
      salesCreditNote: iscreditSelected ? true : false,
      salesDebitNote: isDebitSelected ? true : false,
      trackingNumber: false,
      rejectionInwardOutward: false,
      materialInOutVouchers: false,
      costTrackingStockItem: false,
      fundTransfer: false,
    },
  };

  const syncPayload = {
    orgId: orgId || null,
    locId: locId || null,
    importType: 'VENDOR' || null,
    from: syncDateFrom?.toISOString() || null,
    to: syncDateTo?.toISOString() || null,
    syncedByUidx: userUidx || null, 
    syncedByUser: userNameDetails || null,
  };

  const TallyService = () => {
    const payload = {
      port: '9000',
      ipAddress: null,
    };
    axios.post('http://localhost:8085/cs/api/v1/tally/authenticate', payload).then((res) => {
    });
  };

  useEffect(() => {
    TallyService();
  }, []);

  const handleNext = () => {
    setLoading(true);
    const authPortPayload = {
      port: port,
      ipAddress: ipAddress || null,
    };

    switch (step) {
      case 1:
        axios.post('http://localhost:8085/cs/api/v1/tally/authenticate', authPortPayload).then((res) => {
          showSnackbar(res?.data?.message);
        });
        if (!ipAddress || !port) {
          setIpAddressError(!ipAddress ? 'IP Address is required' : '');
          setPortError(!port ? 'Port Number is required' : '');
          setLoading(false);
          return;
        }
        break;
      case 2:
        if (!userName || !password) {
          setUserNameError(!userName ? 'Username is required' : '');
          setPasswordError(!password ? 'Password is required' : '');
          setLoading(false);
          return;
        }
        break;
      case 3:
        if (companyOptions.length === 0) {
          setStepErrors((prevErrors) => ({ ...prevErrors, 3: true }));
          setLoading(false);
          return;
        } else {
          setStepErrors((prevErrors) => ({ ...prevErrors, 3: false }));
        }
        break;
      case 4:
        if (dataOptions.length === 0) {
          setStepErrors((prevErrors) => ({ ...prevErrors, 4: true }));
          setLoading('false');
          return;
        } else {
          setStepErrors((prevErrors) => ({ ...prevErrors, 4: false }));
        }
        break;

      case 5:
        if (!syncDateFrom || !syncDateTo) {
          setStepErrors((prevErrors) => ({ ...prevErrors, 5: true }));
          setLoading(false);
          return;
        } else {
          setStepErrors((prevErrors) => ({ ...prevErrors, 5: false }));
        }
        break;
      case 6:
        if (frequencyOptions.length === 0) {
          setStepErrors((prevErrors) => ({ ...prevErrors, 6: true }));
          setLoading(false);
          return;
        } else {
          setStepErrors((prevErrors) => ({ ...prevErrors, 6: false }));
        }
        break;
      case 6:
        break;
      case 7:
        createTallyConfig(payload)
          .then((res) => {
            if (res?.data?.data?.es === 1) {
              showSnackbar(res?.data?.data?.message);
              setTallyConfigured(false);
              setAlreadyConfigured(true);
            } else {
              showSnackbar('Successfully Tally Configured');
              syncTallyData(syncPayload).then((res) => {
                if (res?.data?.data?.es === 1) {
                  showSnackbar(res?.data?.data?.message);
                } else {
                  setSyncXmlData(res?.data?.data?.xml);
                  setSyncPort(res?.data?.data?.port);
                }
              });
              fetchTallyConfig(orgId, locId).then((res) => {
                setTallyConfiguredData(res?.data?.data);
                setSyncComapnyData(res?.data?.data?.syncConfig);
              });

              setTallyConfigured(true);
              setLoading(false);
            }
          })
          .catch((err) => {
            showSnackbar(err?.message);
            setTallyConfigured(false);
            setLoading(false);
          });
        break;
      case 8:
        setAlreadyConfigured(true);
        setOpenTally(false);
        break;
      default:
        break;
    }

    setTimeout(() => {
      if (step < 8) {
        setStep(step + 1);
      }
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchTallyConfig(orgId, locId).then((res) => {
      if (res?.data?.data?.es === 1) {
        setAlreadyConfigured(false);
      } else {
        setAlreadyConfigured(true);
        setTallyConfiguredData(res?.data?.data);
        setSyncComapnyData(res?.data?.data?.tallyConfig?.syncConfig);
      }
    });
  }, []);

  const handleCancelTally = () => {
    setOpenTally(false);
  };

  const handleSyncData = () => {
    setTallyFormEdit(true);
  };

  useEffect(() => {
    const xmlPayload = {
      xml: syncXmlData,
    };
    axios.post(`http://localhost:8085/cs/api/v1/tally/import/${syncPort}`, xmlPayload).then((res) => {
      setSyncDataInfo(res?.data);
    });
  }, [syncPort]);

  const logPayload = {
    orgId: orgId,
    locId: locId,
    importType: 'VENDOR',
    from: syncDateFrom?.toISOString() || null,
    to: syncDateTo?.toISOString() || null,
    syncedByUidx: userUidx || null,
    syncedByUser: userNameDetails || null,
  };

  const newObjectpayload = {...syncDataInfo,...logPayload};


  useEffect(() => {
    createSyncLogData(newObjectpayload).then((res)=>{
    });
  }, [syncDataInfo]);

  return (
    <>
      {tallyFormEdit ? (
        <TallyFormEdit setOpenTally={setOpenTally} />
      ) : (
        <Box className="tally-wrapper-main-container">
          {alreadyConfigured === true ? (
            <div className="form-wrapper-container-after">
              <h3 className="header-text-tally">Tally Data Already Configured</h3>
              <div className="sync-history-table-container">
                <table className="sync-history-table">
                  <thead id="sync-history-table-header">
                    <tr>
                      <th>Ip Address</th>
                      <th>Port Number</th>
                      <th>Sync Data</th>
                      <th>From</th>
                      <th>Until</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        {tallyConfiguredData?.tallyConfig?.ipAddress
                          ? tallyConfiguredData?.tallyConfig?.ipAddress
                          : '-----'}
                      </td>
                      <td>
                        {tallyConfiguredData?.tallyConfig?.port ? tallyConfiguredData?.tallyConfig?.port : '-----'}
                      </td>
                      <td>
                        <div className="company-name-inner-text">credit note</div>
                      </td>
                      <td>14-12-2023 9:00 AM</td>
                      <td>15-12-2023 10:00 AM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="sync-data-wrapper-table-history">
                <button className="tally-wrapper-save-btn" onClick={handleCancelTally}>
                  Cancel
                </button>
                <button className="tally-wrapper-save-btn" onClick={handleSyncData}>
                  Sync Data
                </button>
              </div>
            </div>
          ) : (
            <div className="modal">
              <div className={`modal-content step-${step}`}>
                <h3 className="header-text-tally">
                  {step === 1
                    ? 'Configure IP Address and Port'
                    : step === 2
                      ? 'Set Username and Password'
                      : step === 3
                        ? 'Select Your Company'
                        : step === 4
                          ? 'Select Data you want to Sync'
                          : step === 5
                            ? 'Sync Date Range'
                            : step === 6
                              ? 'Frequency Settings'
                              : step === '7'
                                ? 'Sync Data Settings'
                                : 'Sync Data History'}
                  {/* New step title */}
                </h3>
                <div className="slider-slider-wrapper">
                  <Slider
                    className={`slider step-${step}`}
                    value={step}
                    withBars
                    step={1}
                    min={1}
                    max={8}
                    onChange={(e, value) => setStep(value)}
                  />
                </div>

                {step === 1 && (
                  <>
                    {/* Step 1 Content */}
                    <div className="form-wrapper-container">
                      <label htmlFor="companySelect" className="tally-label tally-advanced-label">
                        <span className="label-text">Choose the Ip address and port for Configuration in Tally</span>
                        <span className="label-description">
                          Select the Ip address and port for which you want to synchronize data with Tally. This
                          configuration will determine the settings for the chosen Ip address and port.
                        </span>
                      </label>
                      <label className="tally-form-wrapper-main-title-text">IP Address</label>
                      <input
                        type="text"
                        value={ipAddress}
                        onChange={(e) => {
                          setIpAddress(e.target.value);
                          setIpAddressError(false);
                        }}
                        className={`tally-input-feild${ipAddressError ? ' error' : ''}`}
                      />
                      {/* <button onClick={handleTallyAuth}>Auth</button> */}
                      {ipAddressError && <p className="error-message">IP Address is required</p>}
                    </div>

                    <div className="form-wrapper-container">
                      <label className="tally-form-wrapper-main-title-text">Port Number</label>
                      <input
                        type="number"
                        value={port}
                        onChange={(e) => {
                          setPort(e.target.value);
                          setPortError(false);
                        }}
                        className={`tally-input-feild${portError ? ' error' : ''}`}
                      />
                      {portError && <p className="error-message">Port Number is required</p>}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    {/* Step 2 Content */}
                    <div className="form-wrapper-container">
                      <label htmlFor="companySelect" className="tally-label tally-advanced-label">
                        <span className="label-text">Choose the Username and password for Configuration in Tally</span>
                        <span className="label-description">
                          Select the Username and password for which you want to synchronize data with Tally. This
                          configuration will determine the settings for the chosen Username and password.
                        </span>
                      </label>
                      <label className="tally-form-wrapper-main-title-text">Username:</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => {
                          setUserName(e.target.value);
                          setUserNameError(false);
                        }}
                        className={`tally-input-feild${userNameError ? ' error' : ''}`}
                      />
                      {userNameError && <p className="error-message">Username is required</p>}
                    </div>
                    <div className="form-wrapper-container">
                      <label className="tally-form-wrapper-main-title-text">Password</label>
                      <div className="password-input-container">
                        <input
                          type={passwordVisible ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(false);
                          }}
                          className={`tally-input-feild${passwordError ? ' error' : ''}`}
                        />
                        <span onClick={() => setPasswordVisible(!passwordVisible)}>
                          {!passwordVisible ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
                        </span>
                      </div>
                      {passwordError && <p className="error-message">Password is required</p>}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    {/* Step 3 Content */}
                    <div className="form-wrapper-container">
                      <label htmlFor="companySelect" className="tally-label tally-advanced-label">
                        <span className="label-text">Choose the Company for Configuration in Tally</span>
                        <span className="label-description">
                          Select the company for which you want to synchronize data with Tally. This configuration will
                          determine the settings for the chosen company.
                        </span>
                      </label>

                      <div className="comapny-name-wrapper-conatiner">
                        <div className="comapnay-name-inner-wrapper-conatiner-one">
                          {companyNames.slice(0, Math.ceil(companyNames.length / 2)).map((company, index) => (
                            <div className="single-comapny-name-wrapper-conatiner-one">
                              <label key={index}>
                                <input
                                  type="checkbox"
                                  value={company}
                                  checked={companyOptions.includes(company)}
                                  onChange={() => handleCompanyCheckbox(company)}
                                  s
                                  className="tally-unique-checkbox"
                                />
                              </label>
                              <h5 className="company-name-txt">{company}</h5>
                            </div>
                          ))}
                        </div>

                        <div className="comapnay-name-inner-wrapper-conatiner-two">
                          {companyNames.slice(Math.ceil(companyNames.length / 2)).map((company, index) => (
                            <div className="single-comapny-name-wrapper-conatiner-one">
                              <label key={index}>
                                <input
                                  type="checkbox"
                                  value={company}
                                  checked={companyOptions.includes(company)}
                                  onChange={() => handleCompanyCheckbox(company)}
                                  className="tally-unique-checkbox"
                                />
                              </label>
                              <h5 className="company-name-txt">{company}</h5>
                            </div>
                          ))}
                        </div>
                      </div>
                      {step === 3 && stepErrors[3] && <p className="error-message">Select at least one company</p>}
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    {/* Step 3 Content */}
                    <div className="form-wrapper-container">
                      <label htmlFor="companySelect" className="tally-label tally-advanced-label">
                        <span className="label-text">Choose the Data you want to sync for Configuration in Tally</span>
                        <span className="label-description">
                          Select the data you want to sync for which you want to synchronize data with Tally. This
                          configuration will determine the settings for the chosen data.
                        </span>
                      </label>

                      <div className="comapny-name-wrapper-conatiner">
                        <div className="comapnay-name-inner-wrapper-conatiner-one">
                          {companyNamesI.slice(0, Math.ceil(companyNamesI.length / 2)).map((data, index) => (
                            <div className="single-comapny-name-wrapper-conatiner-one">
                              <label key={index}>
                                <input
                                  type="checkbox"
                                  value={data}
                                  checked={dataOptions.includes(data)}
                                  onChange={() => handleCompanyCheckboxI(data)}
                                  s
                                  className="tally-unique-checkbox"
                                />
                              </label>
                              <h5 className="company-name-txt">{data}</h5>
                            </div>
                          ))}
                        </div>

                        <div className="comapnay-name-inner-wrapper-conatiner-two">
                          {companyNamesI.slice(Math.ceil(companyNamesI.length / 2)).map((data, index) => (
                            <div className="single-comapny-name-wrapper-conatiner-one">
                              <label key={index}>
                                <input
                                  type="checkbox"
                                  value={data}
                                  checked={dataOptions.includes(data)}
                                  onChange={() => handleCompanyCheckboxI(data)}
                                  className="tally-unique-checkbox"
                                />
                              </label>
                              <h5 className="company-name-txt">{data}</h5>
                            </div>
                          ))}
                        </div>
                      </div>
                      {step === 4 && stepErrors[4] && <p className="error-message">Select at least one company</p>}
                    </div>
                  </>
                )}

                {step === 5 && (
                  <>
                    {/* Step 4 Content */}
                    <div className="form-wrapper-containerI">
                      <label htmlFor="companySelect" className="tally-label tally-advanced-label">
                        <span className="label-text">Choose the Sync Date range for Configuration in Tally</span>
                        <span className="label-description">
                          Select the Sync Date range for which you want to synchronize data with Tally. This
                          configuration will determine the settings for the chosen Sync Date range.
                        </span>
                      </label>
                      <div className="form-wrapper-tally-inner-datepicker-conatiner">
                        <div className="date-picker-wrapper-tally">
                          <p className="datepicker-label-text">From:</p>
                          <DatePicker
                            selected={syncDateFrom}
                            onChange={(date) => setSyncDateFrom(date)}
                            placeholderText="00:00 AM"
                            className="datepicker-form-tally"
                            showTimeSelect
                            popperPlacement="top-start"
                          />
                        </div>
                        <div className="date-picker-wrapper-tally">
                          <p className="datepicker-label-text">Until:</p>
                          <DatePicker
                            selected={syncDateTo}
                            onChange={(date) => setSyncDateTo(date)}
                            placeholderText="00:00 AM"
                            className="datepicker-form-tally"
                            showTimeSelect
                            popperPlacement="top-start"
                          />
                        </div>
                      </div>
                      {step === 5 && stepErrors[5] && <p className="error-message">Select both From and Until dates</p>}
                    </div>
                  </>
                )}
                {step === 6 && (
                  <>
                    {/* Step 5 Content */}
                    <div className="form-wrapper-container">
                      <label htmlFor="companySelect" className="tally-label tally-advanced-label">
                        <span className="label-text">Choose the Frequency Settings for Configuration in Tally</span>
                        <span className="label-description">
                          Select the Frequency Settings for which you want to synchronize data with Tally. This
                          configuration will determine the settings for the chosen Frequency Settings.
                        </span>
                      </label>
                      <div className="checkbox-tally-wrapper-box">
                        <div className="single-comapny-name-wrapper-conatiner-one">
                          <label>
                            <input
                              type="checkbox"
                              value="Every2Hours"
                              checked={frequencyOptions.includes('Every2Hours')}
                              onChange={() => handleFrequencyCheckbox('Every2Hours')}
                              className="tally-unique-checkbox"
                            />
                          </label>
                          <h5 className="company-name-txt">Every 2 Hours</h5>
                        </div>
                        <div className="single-comapny-name-wrapper-conatiner-one">
                          <label>
                            <input
                              type="checkbox"
                              value="Every4Hours"
                              checked={frequencyOptions.includes('Every4Hours')}
                              onChange={() => handleFrequencyCheckbox('Every4Hours')}
                              className="tally-unique-checkbox"
                            />
                          </label>
                          <h5 className="company-name-txt">Every 4 Hours</h5>
                        </div>
                      </div>
                      {step === 6 && stepErrors[6] && (
                        <p className="error-message">Select at least one Frequency Setting</p>
                      )}
                    </div>
                  </>
                )}

                {step === 7 && (
                  <div className="form-wrapper-container">
                    <div className="sync-data-wrapper-conatiner">
                      <h3 className="sync-data-wrapper-text">
                        <span>Please wait while we synchronize the data you entered and configure it in Tally.</span>
                      </h3>
                      <div className="sync-data-loader-wrapper">
                        <img className="sync-data-wrapper-image" src={syncDataLoader} alt="" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 8 && (
                  <div className="form-wrapper-container">
                    <label htmlFor="syncHistory" className="tally-label tally-advanced-label">
                      <span className="label-text">Total Sync History</span>
                      <span className="label-description">
                        View the synchronization history for each company. This section provides details about the sync
                        data types and periods.
                      </span>
                    </label>
                    {tallyConfigured ? (
                      <div className="sync-history-table-container">
                        <table className="sync-history-table">
                          <thead id="sync-history-table-header">
                            <tr>
                              <th>Ip Address</th>
                              <th>Port Number</th>
                              <th>Sync Data</th>
                              <th>From</th>
                              <th>Until</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {tallyConfiguredData?.tallyConfig?.ipAddress
                                  ? tallyConfiguredData?.tallyConfig?.ipAddress
                                  : '-----'}
                              </td>
                              <td>
                                {tallyConfiguredData?.tallyConfig?.port
                                  ? tallyConfiguredData?.tallyConfig?.port
                                  : '-----'}
                              </td>
                              <td>
                                <div className="company-name-inner-text">credit note</div>
                              </td>
                              <td>14-12-2023 9:00 AM</td>
                              <td>15-12-2023 10:00 AM</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      'MY TALLY DATA'
                    )}
                  </div>
                )}

                <div className="tally-wrapper-btn-box">
                  <button className="tally-wrapper-cancel-btn" onClick={handleCancel}>
                    {getCancelButtonText()}
                  </button>
                  <button className="tally-wrapper-save-btn" onClick={handleNext}>
                    {getButtonText()}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Box>
      )}
    </>
  );
};

export default TallyFormService;
