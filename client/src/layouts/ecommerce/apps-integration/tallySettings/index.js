import { Box, Button, CircularProgress, Slider } from '@mui/material';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import DatePicker from 'react-datepicker';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const TallySettings = () => {
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

  const handleNext = () => {
    setLoading(true);

    switch (step) {
      case 1:
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
          setLoading(false);
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
        break;
      case 8:
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

  // tally post api

  const payload = {
    accountId: 'string',
    sourceOrgId: 'string',
    sourceLocId: 'string',
    ipAddress: 'string',
    cloudIpAddress: 'string',
    port: 'string',
    cloudPort: 'string',
    syncTimeFrequency: 0,
    syncTimeUnit: 'Nanos',
    syncTime: 'string',
    syncConfig: {
      vendorName: true,
      vendorGstName: true,
      vendorGst: true,
      vendorPan: true,
      customerName: true,
      customerCompany: true,
      customerGst: true,
      customerPan: true,
      purchaseIndent: true,
      purchaseOrder: true,
      purchaseBill: true,
      vendorCredit: true,
      logisticPackage: true,
      logisticDeliveryChallan: true,
      logisticEWayBill: true,
      logisticFleetManagement: true,
      invoice: true,
      invoiceSaleCreditNote: true,
      invoiceSeparateDiscount: true,
      salesMultiplePriceLevel: true,
      salesInvoice: true,
      salesCreditNote: true,
      salesDebitNote: true,
      trackingNumber: true,
      rejectionInwardOutward: true,
      materialInOutVouchers: true,
      costTrackingStockItem: true,
      fundTransfer: true,
    },
  };


  const TallyService = () =>{
    const payload = {
      port:'9000'
    };
    axios.post('http://localhost:8085/cs/api/v1/tally/authenticate',payload).then((res)=>{
      console.log('res',res?.data);
    });
  };

  useEffect(()=>{
    TallyService();
  },[]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ height: 400, width: '100%' }}>
        <Box className="tally-table-wrapper-btn">
          <Button onClick={handleTallyForm} className="tally-new-btn">
            + New
          </Button>
        </Box>
        {open ? (
          <Box className="tally-wrapper-main-container">
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
                    <div className="sync-history-table-container">
                      <table className="sync-history-table">
                        <thead id="sync-history-table-header">
                          <tr>
                            <th>Company Name</th>
                            <th>Sync Data</th>
                            <th>From</th>
                            <th>Until</th>
                          </tr>
                        </thead>
                        <tbody>
                          {companyNames.map((company, index) => (
                            <tr key={index}>
                              <td>{company}</td>
                              <td>
                                <div className="company-name-inner-text">credit note</div>
                              </td>
                              <td>14-12-2023 9:00 AM</td>
                              <td>15-12-2023 10:00 AM</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
          </Box>
        ) : null}
      </Box>
    </DashboardLayout>
  );
};

export default TallySettings;
