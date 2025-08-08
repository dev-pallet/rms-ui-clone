import styled from '@emotion/styled';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Box, StepConnector, stepConnectorClasses } from '@mui/material';
import Badge from '@mui/material/Badge';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import breakpoints from 'assets/theme/base/breakpoints';
import SoftAvatar from 'components/SoftAvatar';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { VendorDetails } from 'layouts/ecommerce/vendor/components/vendor-details/index';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DefaultLogo from '../../../../../assets/images/default-profile-logo.jpg';
import {
  getVendorAutoSaveTme,
  getVendorBrandPayload,
  getVendorLegalPayload,
  getVendorOverviewPayload,
} from '../../../../../datamanagement/vendorPayloadSlice';
import AddBrandsforVendor from '../AddBrand/AddBrandsforVendor';
import AddLegalDocuments from '../AddLegalDocuments/AddLegalDocuments';
import AddpromotionstoVendor from '../AddPromotions/AddpromotionstoVendor';
import PaymentTerms from '../payment-terms';
import './addvendor.css';

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#367df3',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#367df3',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#367df3',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#367df3',
    zIndex: 1,
    fontSize: '25px !important',
  },
  '& .QontoStepIcon-circle': {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <div className="QontoStepIcon-circle done-all-vendor-create-div">
          {' '}
          <DoneAllIcon className="done-all-vendor-create" />
        </div>
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

export const AddVendor = ({ headOffice }) => {
  const [steps, setSteps] = useState([
    'Basic information',
    'Brands',
    'Terms',
    // 'legal & Kyc'
  ]);
  useEffect(() => {
    if (location.pathname !== '/purchase/add-vendor') {
      setSteps(['Basic information', 'Brands', 'Terms', 'legal & Kyc']);
    }
  }, [location.pathname]);

  const vendorOverviewPayload = useSelector(getVendorOverviewPayload);
  const vendorBrandPayload = useSelector(getVendorBrandPayload);
  const vendorLegalPayload = useSelector(getVendorLegalPayload);
  const vendorAutoSaveTime = useSelector(getVendorAutoSaveTme);
  const { editVendorId } = useParams();
  const [vendorLogo, setVendorLogo] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);

  const [status, setStatus] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
    tab5: false,
    tab6: false,
  });

  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);



  useEffect(() => {
    return () => {
      localStorage.removeItem('vendorDraftCode');
    };
  }, []);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation('vertical')
        : setTabsOrientation('horizontal');
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener('resize', handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    const newStatus = {};
    for (let i = 1; i <= 6; i++) {
      newStatus[`tab${i}`] = newValue === i - 1;
    }
    setStatus(newStatus);
  };

  const handleTab = (val) => {
    setTabValue(val);
    if (localStorage.getItem('add-vendor-product')) {
      localStorage.removeItem('add-vendor-product');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('add-vendor-product') || localStorage.getItem('vendorIdForProductPortfolioFromSku')) {
      handleTab(1);
    }
  }, []);

  const onSelectFile = (event) => {
    const file = event.target.files[0];
    setVendorLogo(file);

    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setSelectedImages(imagesArray[0]);
    // setPrev(imagesArray[0]);
    event.target.value = '';
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      {/* <SoftBox
        className="bg-url"
        display="flex"
        justifyContent="flex-start"
        position="relative"
        minHeight="6.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: `url(${'https://png.pngtree.com/background/20210712/original/pngtree-blue-abstract-background-picture-image_1170267.jpg'})`,
        }}
      /> */}
      <Card className="addbrand-Box">
        <Grid container spacing={2} alignItems="center" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid item xs={6} md={9.5}>
            <SoftTypography variant="caption" fontWeight="bold" fontSize="16px">
              {editVendorId ? 'Edit Vendor' : 'Add new vendor'}
            </SoftTypography>
          </Grid>

          <Grid item xs={6} md={2.5} justifyContent="flex-end">
            <SoftTypography
              variant="button"
              fontWeight="medium"
              fontSize="12px"
              alignItems="center"
              justifyContent="flex-end"
            >
              <InfoOutlinedIcon sx={{ color: '#0562fb' }} fontSize="small" /> Auto saved{' '}
              {moment(vendorAutoSaveTime).fromNow()}
            </SoftTypography>
          </Grid>

          <Grid
            item
            style={localStorage.getItem('vendorIdForProductPortfolioFromSku') ? { display: 'none' } : null}
            mt={-3}
          >
            <label variant="body2">
              <Badge
                color="secondary"
                className="pencil-icon"
                sx={{ position: 'relative', top: '-0.5rem', right: '-60px !important' }}
                badgeContent={<ModeEditIcon sx={{ fontSize: '5px' }} />}
              />
              <input
                type="file"
                name="images"
                onChange={onSelectFile}
                multiple
                accept="image/png ,image/jpeg, image/webp"
              />
            </label>
            <SoftAvatar
              src={selectedImages === null ? DefaultLogo : selectedImages}
              alt=""
              variant="rounded"
              // size="xl"
              shadow="sm"
              style={{ position: 'relative', bottom: '1.5rem', height: '90px', width: '90px' }}
            ></SoftAvatar>
          </Grid>

          <Grid item xs={12} md={10} mt={-3}>
            <Box sx={{ width: '100%' }}>
              <Stepper alternativeLabel activeStep={tabValue} connector={<QontoConnector />}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconComponent={QontoStepIcon}
                      onClick={() => setTabValue(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      {' '}
                      <span style={{ fontSize: '0.875rem' }}>{label}</span>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <SoftBox className="add-vendor-tab">
        {tabValue === 0 ? <VendorDetails handleTab={handleTab} vendorLogo={vendorLogo}></VendorDetails> : null}
        {/* {status.tab2 ? <ProductPortfolio handleTab={handleTab}></ProductPortfolio> : null} */}
        {tabValue === 1 ? <AddBrandsforVendor handleTab={handleTab} /> : null}
        {tabValue === 2 ? <PaymentTerms handleTab={handleTab} /> : null}
        {tabValue === 3 ? <AddLegalDocuments handleTab={handleTab} /> : null}
        {tabValue === 4 ? <AddpromotionstoVendor handleTab={handleTab} /> : null}
      </SoftBox>
    </DashboardLayout>
  );
};
