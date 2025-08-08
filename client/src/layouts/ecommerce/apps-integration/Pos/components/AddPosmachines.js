import { Card, Container } from '@mui/material';
import { createNewCounterLicense } from './../../../../../config/Services';
import { getAllPosTerminals, updateCounterDetails, updateCouterLisenceStatus } from '../../../../../config/Services';
import { isSmallScreen } from '../../../Common/CommonFunction';
import { useParams } from 'react-router-dom';
import DailogeComponent from './DailogeComponent';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import MuiAlert from '@mui/material/Alert';
import PosMachineCard from './PosMachineCard';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddPosmachines = () => {
  const { licenseType } = useParams();
  const isMobileDevice = isSmallScreen();
  const [countersList, setCounterList] = useState([]);
  const [isediting, setIsediting] = useState(false);
  const [active, setActive] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [licenseId, setLicenseId] = useState('');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [errormsg, setErrorMsg] = useState('');
  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const activePosCount = (() => {
    let count = 0;
    countersList.map((e) => {
      if (e?.active) {
        count++;
      }
    });
    return count;
  })();

  const handleActivate = async (id, status) => {
    const payload = {
      licenseId: id,
      status: status,
    };
    const loading = countersList.map((counter) => {
      if (counter.licenseId == id) {
        return { ...counter, loader: true };
      }
      return { ...counter, loader: false };
    });
    setCounterList(loading);
    try {
      const response = await updateCouterLisenceStatus(payload);
      setActive(!active);
      setLicenseId(id);
      setSeverity('success');
      if (status) {
        setErrorMsg('Successfully Activated');
      } else {
        setErrorMsg('Successfully Deactivated');
      }

      setOpen(true);
      const data = countersList.map((counter) => {
        if (counter.licenseId == id) {
          return { ...counter, loader: false };
        }
        return { ...counter, loader: false };
      });
    } catch (err) {
      setSeverity('error');
      setErrorMsg(err.message);
      setOpen(true);
    }
  };

  const [additionalcounter, SetAdditionalcounter] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEdit = (index) => {
    const arr = countersList.map((e, i) => {
      if (i === index) {
        return { ...e, editable: true };
      } else {
        return { ...e, editable: false };
      }
    });
    setCounterList(arr);
    setIsediting(true);
  };

  const handleSave = async (e, index, id) => {
    const payload = {
      licenseId: id,
      licenseName: e,
      updatedBy: object.uidx,
      updatedByName: object.firstName + ' ' + object.secondName,
    };
    try {
      const response = await updateCounterDetails(payload);
      setActive(!active);
      setSeverity('success');
      setErrorMsg('Successfully updated');
      setOpen(true);
    } catch (err) {
      setSeverity('error');
      setErrorMsg(err.message);
      setOpen(true);
    }
    const arr = countersList.map((e, i) => {
      if (i === index) {
        return { ...e, editable: false };
      } else {
        return { ...e, editable: false };
      }
    });
    setCounterList(arr);
    setIsediting(false);
  };

  const fetchData = async () => {
    const payload = {
      orgId: orgId,
      locId: locId,
    };
    if (licenseType === 'pos') {
      payload.featureName = 'NO_OF_POS_USERS';
    } else if (licenseType === 'mpos') {
      payload.featureName = 'NO_OF_MPOS_USERS';
    }

    if (!isLoading) {
      setIsloading(true);
      try {
        const res = await getAllPosTerminals(payload);
        setIsloading(false);
        const data = res.data.data.data.responses;
        const response = data.map((e) => {
          return { ...e, loader: false, editable: false };
        });
        setCounterList(response);
      } catch (e) {
        setIsloading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [active]);

  const handleNewCounter = async (newCounter) => {
    handleCloseDialog();
    const payload = { email: object?.email, licenses: newCounter };
    try {
      const response = await createNewCounterLicense(payload);
      setActive(!active);
    } catch (err) {}
  };

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      <Card
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
          flexDirection: 'row',
          alignItems: 'baseline',
          marginTop: '20px',
        }}
        className={`${isMobileDevice && 'po-box-shadow'}`}
      >
        <SoftBox>
          <SoftTypography style={{ marginInline: '18px' }}> {licenseType?.toUpperCase()} Licenses</SoftTypography>
        </SoftBox>
        <SoftBox>
          <SoftButton onClick={handleOpenDialog} color="info" variant="gradient">
            + New
          </SoftButton>
        </SoftBox>
      </Card>

      <SoftBox style={{ display: 'flex', alignItems: 'baseline', marginInline: '30px' }}>
        <SoftTypography style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '10px' }}>
          {activePosCount} of {countersList.length}
        </SoftTypography>
        <SoftTypography>Available</SoftTypography>
      </SoftBox>

      <Container sx={{ paddingLeft: isMobileDevice && '0px', paddingRight: isMobileDevice && '0px' }}>
        {isLoading ? (
          <SoftBox>
            <Spinner />
          </SoftBox>
        ) : (
          <>
            {' '}
            {countersList.map((counter, i) => (
              <PosMachineCard
                item={counter}
                key={i}
                index={i}
                handleBtn={handleActivate}
                handleEdit={handleEdit}
                handleSave={handleSave}
                isediting={isediting}
                isLoading={isLoading}
                licenseId={licenseId}
              />
            ))}
          </>
        )}

        {openDialog && (
          <DailogeComponent
            openDialog={openDialog}
            handleSave={(e) => {
              setCounterList([...countersList, ...e]);
            }}
            handleCloseDialog={handleCloseDialog}
            handleNewCounter={handleNewCounter}
          />
        )}
      </Container>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
          {errormsg}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default AddPosmachines;
