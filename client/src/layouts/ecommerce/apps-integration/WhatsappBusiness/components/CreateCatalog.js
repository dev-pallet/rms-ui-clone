import { CircularProgress, Typography } from '@mui/material';
import { getWhatsAppConnected, whatsappBusinessOnboardStore } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';

const CreateCatalog = ({ setSelectedTab }) => {
  const [catalogId, setCatalogId] = useState('');
  const [whatsappbusinessAccountId, setWhatsappBusinessAccountId] = useState();
  const [whatsappBearerToken, setWhatsappBearerToken] = useState();
  const [whatsappPhoneId, setWhatsappPhoneId] = useState();
  const [loader, setLoader] = useState(false);
  const showSnackbar = useSnackbar();
  const handleOpenSteps = () => {
    const newTab = window.open('/marketing/whatsapp-business/steps', '_blank');
    newTab.focus();
  };

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const accountId = localStorage.getItem('AppAccountId');
  const clientId = localStorage.getItem('clientId');

  const fetchWhatsappConnect = async () => {
    try {
      await getWhatsAppConnected(clientId).then((res) => {
        setWhatsappBusinessAccountId(res?.data?.data?.whatsAppBusinessAccountID);
        setWhatsappBearerToken(res?.data?.data?.bearerToken);
        setWhatsappPhoneId(res?.data?.data?.phoneNumberID);
      });
    } catch (error) {
      showSnackbar('Error: Whatsapp not Connected', 'error');
    }
  };

  useEffect(() => {
    fetchWhatsappConnect();
  }, []);

  const handleOnboardStore = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    setLoader(true);
    const payload = {
      orgId: orgId,
      locId: locId,
      accountId: whatsappbusinessAccountId,
      status: 'ONBOARDING_REQUESTED',
      catalogId: catalogId,
      createdBy: uidx,
      bearerToken: whatsappBearerToken,
      phNumberId: whatsappPhoneId,
    };

    try {
      whatsappBusinessOnboardStore(payload)
        .then((res) => {
          showSnackbar('Store Onboarded successfully', 'success');
          localStorage.setItem('catalogId', catalogId);
          setLoader(false);
          setTimeout(() => {
            setSelectedTab('Add');
          }, 800);
        })
        .catch((error) => {
          showSnackbar(error?.response?.data?.message, 'warning');
          setLoader(false);
        });
    } catch (error) {
      showSnackbar(error?.response?.data?.message, 'warning');
      setLoader(false);
    }
  };

  return (
    <div>
      <SoftBox className="add-catalog-products-box">
        <Typography className="whatsapp-bus-process-typo">Create Catalog</Typography>
        {/* <Typography
          style={{
            fontWeight: '200',
            fontSize: '0.7rem',
            lineHeight: '1.5',
            color: '#4b524d',
            textAlign: 'left',
            margin: '5px 0px',
          }}
        >
          WhatsApp Business catalogs enable businesses to showcase products or services through images, descriptions,
          and prices, streamlining customer browsing and purchasing directly on the platform for a more efficient and
          engaging experience.
        </Typography> */}
        <Typography
          style={{
            fontWeight: '200',
            fontSize: '0.8rem',
            lineHeight: '1.5',
            color: '#4b524d',
            textAlign: 'left',
            margin: '5px 0px',
          }}
        >
          Please provide your catalog Id to add products to that catalog. If not created a catalog{' '}
          <span onClick={handleOpenSteps} style={{ color: '#0562FB', fontWeight: 600, cursor: 'pointer' }}>
            follow these steps
          </span>{' '}
          to create one.
        </Typography>
        <SoftBox style={{ marginTop: '20px' }}>
          <Typography
            style={{
              fontWeight: '600',
              fontSize: '0.8rem',
              lineHeight: '1.5',
              color: '#0562FB',
              textAlign: 'left',
              margin: '10px 0px',
            }}
          >
            Catalog Id
          </Typography>
          <SoftInput
            placeholder="Catalog Id"
            style={{ width: '400px' }}
            onChange={(e) => setCatalogId(e.target.value)}
            value={catalogId}
          />
        </SoftBox>
        <SoftBox className="whatsapp-bus-button-box">
          <SoftButton className="vendor-add-btn" onClick={handleOnboardStore}>
            {loader ? (
              <CircularProgress
                sx={{ color: 'white !important', height: '15px !important', width: '15px !important' }}
              />
            ) : (
              'Create'
            )}
          </SoftButton>
          <SoftButton className="vendor-second-btn" onClick={() => setSelectedTab('Add')}>
            Next
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </div>
  );
};

export default CreateCatalog;
