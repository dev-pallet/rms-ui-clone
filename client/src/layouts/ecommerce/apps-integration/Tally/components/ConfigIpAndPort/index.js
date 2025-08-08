import { authenticateTally } from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import React, { useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import VerifiedIcon from '@mui/icons-material/Verified';

const ConfigIpAndPort = ({
  verifyTallyOnDevice,
  handleVerifyTallyOnDevice,
  ipAddressAndPortData,
  handleIpAndPort,
  setBtnAuthenticated,
  btnAuthenticated,
}) => {
  const showSnackbar = useSnackbar();
  const [authenticateLoader, setAuthenticateLoader] = useState(false);

  const verifyPayload = (data) => {
    if (data.port.length < 4) {
      showSnackbar('Port number should be at least of 4 digits', 'warning');
      return false;
    }
    return true;
  };

  const handleAuthenticate = async () => {
    if (verifyTallyOnDevice == true && ipAddressAndPortData.ipAddress == '') {
      showSnackbar('Please enter ip address', 'warning');
      return;
    }
    if (verifyTallyOnDevice == true && ipAddressAndPortData.ipAddress.startsWith('http://')) {
      showSnackbar('Please remove http:// just provide the ip address', 'warning');
      return;
    }
    if (ipAddressAndPortData.port == '') {
      showSnackbar('Please enter port number', 'warning');
      return;
    }

    const payload = {
      ipAddress: verifyTallyOnDevice == true ? 'http://' + ipAddressAndPortData.ipAddress : null,
      port: ipAddressAndPortData.port,
    };
    // console.log('authenticate', ipAddressAndPortData);

    if (!verifyPayload(payload)) {
      return;
    }

    try {
      setAuthenticateLoader(true);
      const response = await authenticateTally(payload);
      //   console.log(response);
      if (response.data.es == 1) {
        setAuthenticateLoader(false);
        setBtnAuthenticated(false);
        showSnackbar(response.data.message, 'success');
        return;
      }
      setAuthenticateLoader(false);
      setBtnAuthenticated(true);
      showSnackbar(response.data.message, 'success');
      // console.log(response);
    } catch (err) {
      setAuthenticateLoader(false);
      setBtnAuthenticated(false);
    }
  };

  return (
    <SoftBox className="ip-port">
      <SoftBox className="ip-port-details">
        <SoftTypography className="ip-top-heading">
          Choose the Ip address and port for configuration in Tally
        </SoftTypography>
        <SoftTypography className="ip-sub-heading">
          Select the Ip address and port for which you want to synchronize data with tally. This configuration will
          determine the settings for the chosen Ip address and port.
        </SoftTypography>
      </SoftBox>
      <SoftBox className="ip-port-form">
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={verifyTallyOnDevice} onChange={(e) => handleVerifyTallyOnDevice(e)} />}
            label="Tally on other device"
          />
        </FormGroup>
        {verifyTallyOnDevice ? (
          <SoftBox className="ip-input-details">
            <SoftTypography className="ip-top-heading">Ip address</SoftTypography>
            <SoftInput
              value={ipAddressAndPortData.ipAddress}
              disabled={(verifyTallyOnDevice && !btnAuthenticated) || !btnAuthenticated ? false : true}
              name="ipAddress"
              placeholder="Enter ip address e.g: 127.0.0.1"
              onChange={(e) => handleIpAndPort(e)}
            />
          </SoftBox>
        ) : null}
        <SoftBox className="ip-port-details">
          <SoftTypography className="ip-top-heading">Port</SoftTypography>
          <SoftInput
            value={ipAddressAndPortData.port}
            disabled={(verifyTallyOnDevice && !btnAuthenticated) || !btnAuthenticated ? false : true}
            name="port"
            placeholder="Enter port e.g: 8080"
            onChange={(e) => handleIpAndPort(e)}
          />
        </SoftBox>
      </SoftBox>
      <SoftBox className="ip-port-authenticate">
        {authenticateLoader ? (
          <SoftBox
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginLeft: '1rem',
            }}
          >
            <Spinner />
          </SoftBox>
        ) : (
          <SoftButton
            className="authenticate-btn"
            onClick={() => handleAuthenticate()}
            disabled={(verifyTallyOnDevice && !btnAuthenticated) || !btnAuthenticated ? false : true}
          >
            {btnAuthenticated ? <VerifiedIcon sx={{ marginRight: '0.6rem' }} /> : null}
            {!btnAuthenticated ? 'Authenticate' : 'Authenticated'}
          </SoftButton>
        )}
      </SoftBox>
    </SoftBox>
  );
};

export default ConfigIpAndPort;
