import { CircularProgress, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { whatsappBusinessProcess, whatsappBusinessProcessBulk } from '../../../../../config/Services';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftTypography from '../../../../../components/SoftTypography';

const Process = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const showSnackbar = useSnackbar();
  const [contactCSVFile, setContactCSVFile] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [testLoader, setTestLoader] = useState(false);

  const [show, setShow] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Check if a file is selected
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        const rows = content.split('\n');
        const header = rows[0].trim(); // Get the header (first row) and remove leading/trailing spaces

        // Check if the header contains "phone_number"
        if (header.toLowerCase() === 'phone_number') {
          setContactCSVFile(selectedFile);
          setErrorMessage('');
        } else {
          setErrorMessage('Error: The CSV file must contain a header row with the title "phone_number".');
          setContactCSVFile(null);
        }
      };

      reader.readAsText(selectedFile);
    } else {
      // No file selected, reset everything
      setContactCSVFile(null);
      setErrorMessage('');
    }
  };

  const handleSendTest = () => {
    const locId = localStorage.getItem('locId');
    const orgId = localStorage.getItem('orgId');
    const catalogId = localStorage.getItem('catalogId');
    setTestLoader(true);
    if (phoneNumber === '') {
      showSnackbar('Please provide the contact', 'warning');
      return;
    }
    try {
      whatsappBusinessProcess(locId, phoneNumber, orgId, catalogId)
        .then((res) => {
          if (res?.data?.status === 'SUCCESS') {
            setTestLoader(false);
            showSnackbar('Test Message sent successfully', 'success');
          } else if (res?.data?.status === 'ERROR') {
            setTestLoader(false);
            showSnackbar('Sorry! There was an error processing.', 'error');
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data?.message) {
            setTestLoader(false);
            showSnackbar(error?.response?.data?.message, 'error');
          }
        });
    } catch (error) {
      setTestLoader(false);
      showSnackbar(error?.message, 'error');
    }
  };

  const handleStart = () => {
    const locId = localStorage.getItem('locId');
    const orgId = localStorage.getItem('orgId');
    const catalogId = localStorage.getItem('catalogId');
    if (contactCSVFile === '') {
      showSnackbar('Please provide the csv for contacts', 'warning');
      return;
    }

    const filePayload = new Blob([contactCSVFile], { type: 'text/csv' });

    const formData = new FormData();
    formData.append('file', filePayload);
    setLoader(true);

    try {
      whatsappBusinessProcessBulk(formData, orgId, locId, catalogId)
        .then((res) => {
          if (res?.data?.status === 'SUCCESS') {
            setLoader(false);
            showSnackbar('Workflow processed successfully', 'success');
            localStorage.removeItem('catalogId');
            setTimeout(() => {
              navigate('/marketing/whatsapp-commerce');
            }, 800);
          } else if (res?.data?.status === 'ERROR') {
            setLoader(false);
            showSnackbar('Sorry! There was an error processing.', 'error');
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data?.message) {
            setLoader(false);
            showSnackbar(error?.response?.data?.message, 'error');
          }
        });
    } catch (error) {
      setLoader(false);
      showSnackbar(error?.message, 'error');
    }
  };

  return (
    <div>
      <SoftBox className="add-catalog-products-box">
        <Typography className="whatsapp-bus-process-typo">Process</Typography>
        <Typography className="whatsapp-bus-process-typo-2">
          Just one click away to sell your products on Whatsapp. As you have completed the process upload your contacts
          to begin your selling.
        </Typography>
        <SoftBox className="whatsapp-bus-button-box">
          <SoftButton className="vendor-second-btn" onClick={() => setShow(!show)}>
            Send Test Message
          </SoftButton>
        </SoftBox>

        {show && (
          <SoftBox style={{ marginTop: '20px' }}>
            <Typography className="whatsapp-bus-process-typo-3">Contact Number</Typography>
            <SoftInput
              placeholder="Contact Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phoneNumber}
            />
            <SoftBox className="whatsapp-bus-button-box">
              <SoftButton className="vendor-add-btn" onClick={handleSendTest}>
                {testLoader ? (
                  <CircularProgress
                    sx={{ color: 'white !important', height: '15px !important', width: '15px !important' }}
                  />
                ) : (
                  'Send'
                )}
              </SoftButton>
            </SoftBox>
          </SoftBox>
        )}
        <SoftBox style={{ marginTop: '20px' }}>
          <Typography
            style={{
              fontWeight: '600',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: '#0562FB',
              textAlign: 'left',
              margin: '10px 0px',
            }}
          >
            Recipients
          </Typography>
          <SoftBox className="attach-file-box" mt={3}>
            {contactCSVFile ? (
              <SoftBox className="logo-box-org-II">
                <div style={{ display: 'flex', gap: '10px' }}>
                  <img src={contactCSVFile} className="logo-box-org" />
                  <Grid item xs={12} md={6} xl={6}>
                    <SoftButton
                      onClick={() => {
                        setContactCSVFile('');
                      }}
                    >
                      <EditIcon />
                    </SoftButton>
                  </Grid>
                </div>
                <SoftBox className="header-submit-box" mt={2} mb={1} lineHeight={0} display="inline-block">
                  <SoftButton
                    className="vendor-second-btn"
                    style={{ marginLeft: '10px' }}
                    onClick={() => {
                      setContactCSVFile('');
                    }}
                  >
                    Cancel
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            ) : (
              <SoftBox className="add-customer-file-box-I">
                <SoftTypography className="add-customer-file-head">Attach File(s)</SoftTypography>
                <SoftBox className="profile-box-up">
                  <input
                    type="file"
                    name="file"
                    id="my-file"
                    className="hidden"
                    accept="application/csv, text/csv"
                    // onChange={(event) => setContactCSVFile(event.target.files[0])}
                    onChange={handleFileChange}
                  />
                  <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                    <SoftTypography className="upload-text-I">Upload File</SoftTypography>
                  </label>
                </SoftBox>
                {errorMessage && (
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: 'red',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    {errorMessage}
                  </Typography>
                )}
              </SoftBox>
            )}
          </SoftBox>
          <Typography
            style={{
              fontWeight: '200',
              fontSize: '0.8rem',
              lineHeight: '1.5',
              color: '#4b524d',
              textAlign: 'left',
              margin: '10px 0px',
            }}
          >
            Choose a contact list to whom this message should be sent.
          </Typography>
        </SoftBox>
        <SoftBox className="whatsapp-bus-button-box">
          <SoftButton className="vendor-add-btn" onClick={handleStart}>
            {loader ? (
              <CircularProgress
                sx={{ color: 'white !important', height: '15px !important', width: '15px !important' }}
              />
            ) : (
              'Get Started'
            )}
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </div>
  );
};

export default Process;
