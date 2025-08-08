import './adding-franchise.css';
import { Badge, Breadcrumbs, Card, Grid, Link } from '@mui/material';
import { useState } from 'react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import FranchiseDetails from './components/Franchise-details';
import FranchiseLegal from './components/Franchise-Legal';
import FranchiseLiscense from './components/Franchise-liscenses';
import FranchiseTerms from './components/FranchiseTerms';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SoftAvatar from '../../../../components/SoftAvatar';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';


const AddingFranchise = () => {
  const [tabValue, setTabValue] = useState('0');
  const [businessInformation, setBusinessInformation] = useState({
    franchiseName: '',
    displayName: '',
    businessType: '',
    businessPan: '',
    gstin: '',
    franchiseDescription: '',
  });
  const [addressInformation, setAddressInformation] = useState({
    addressOne: '',
    addressTwo: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });

  const [contactInformation, setContactInformation] = useState([
    {
      isPrimary: false,
      firstName: '',
      lastName: '',
      mobileNumber: '',
      email: '',
      key: 0,
    },
  ]);

  const [otherInformation, setOtherInformation] = useState({
    gstTreatment: '',
    placeOfSupply: '',
    taxPrefernce: '',
    currency: '',
  });
  const [bankInformation, setBankInformation] = useState({
    bankAccountNumber: '',
    ifscCode: '',
  });

  //breadcrumps state
  const [franchiseComplete, setFranchiseComplete] = useState(false);
  const [termsComplete, setTermsComplete] = useState(false);
  const [liscneseComplete, setLiscneseComplete] = useState(false);
  const [legalComplete, setLegalComplete] = useState(false);

  //breadcrumps
  function handleClick(e) {
    e.preventDefault();
    setTabValue(e.target.name);
  }

  //next handler
  const nextHandler = () => {
    if(tabValue === '0'){
      setFranchiseComplete(true);
    }else if(tabValue === '1'){
      setTermsComplete(true);
    }else if(tabValue === '2'){
      setLiscneseComplete(true);
    }else{
      setLegalComplete(true);
    }
    const prevTabValue = Number(tabValue);
    console.log({ prevTabValue });
    if (prevTabValue <= 2) {
      setTabValue(String(prevTabValue + 1));
    }
  };

  const prevHandler = () => {
    const prevTabValue = Number(tabValue);
    console.log({ prevTabValue });
    if (prevTabValue >= 1) {
      setTabValue(String(prevTabValue - 1));
    }
  };

  const breadcrumbs = [
    <Link
      underline="hover"
      name="0"
      key="0"
      sx={{ color: franchiseComplete ? 'green' : tabValue === '0' ? 'black' : 'lightgray' }}
      href="/"
      onClick={handleClick}
      className="breadcrumps-center"
    >
      {franchiseComplete && <CheckCircleRoundedIcon sx={{color: 'green !important'}}/>}
      Franchise Details
    </Link>,
    <Link
      underline="hover"
      name="1"
      key="1"
      sx={{ color: termsComplete ? 'green' : tabValue === '1' ? 'black' : 'lightgray' }}
      href="/material-ui/getting-started/installation/"
      onClick={handleClick}
      className="breadcrumps-center"
    >
      {termsComplete && <CheckCircleRoundedIcon sx={{color: 'green !important'}}/>}
      Terms
    </Link>,
    <Link
      underline="hover"
      name="2"
      key="2"
      sx={{ color: liscneseComplete ? 'green' : tabValue === '2' ? 'black' : 'lightgray' }}
      href="/material-ui/getting-started/installation/"
      onClick={handleClick}
      className="breadcrumps-center"
    >
      {liscneseComplete && <CheckCircleRoundedIcon sx={{color: 'green !important'}}/>}
      Liscenses
    </Link>,
    <Link
      underline="hover"
      name="3"
      key="3"
      sx={{ color: legalComplete ? 'green' : tabValue === '3' ? 'black' : 'lightgray' }}
      href="/material-ui/getting-started/installation/"
      onClick={handleClick}
      className="breadcrumps-center"
    >
      {legalComplete && <CheckCircleRoundedIcon sx={{color: 'green !important'}}/>}
      Legal
    </Link>,
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox
        className="bg-url"
        display="flex"
        justifyContent="flex-start"
        position="relative"
        minHeight="6.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: `url(${'https://i.postimg.cc/hvjSRvvW/pngtree-simple-light-blue-background-image-396574.jpg'})`,
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
        <Grid container spacing={3} className="div-normal-flex">
          <Grid item>
            <label variant="body2">
              <Badge
                color="secondary"
                className="pencil-icon"
                sx={{ position: 'relative', top: '-0.5rem' }}
                badgeContent={<ModeEditIcon sx={{ fontSize: '5px' }} />}
              />
              <input
                type="file"
                name="images"
                // onChange={onSelectFile}
                multiple
                accept="image/png ,image/jpeg, image/webp"
              />
            </label>
            <SoftAvatar
              //   src={selectedImages === null ? DefaultLogo : selectedImages}
              alt=""
              variant="rounded"
              size="xl"
              shadow="sm"
              style={{ position: 'relative', bottom: '1.5rem' }}
            ></SoftAvatar>
          </Grid>
          {/* <Grid item xs={12} md={6} lg={6}>
            <AppBar position="static">
              <Tabs
                // orientation={tabsOrientation}
                value={tabValue}
                onChange={handleTabChange}
                sx={{ background: 'transparent' }}
                className="tabs-box"
              >
                <Tab sx={{ width: 'max-content', fontSize: '13px' }} label="Franchise Details" value="0" />
                <Tab sx={{ width: 'max-content', fontSize: '13px' }} label="Terms" value="1" />
                <Tab sx={{ width: 'max-content', fontSize: '13px' }} label="Liscenses" value="2" />
                <Tab sx={{ width: 'max-content', fontSize: '13px' }} label="Legal" value="3" />
              </Tabs>
            </AppBar>
          </Grid> */}
        </Grid>
      </Card>
      <SoftBox className="flex-div-ho" p={1}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" mt={2} mb={2}>
          {breadcrumbs}
        </Breadcrumbs>
        <SoftBox>
          <SoftButton variant="outlined" color="info" onClick={prevHandler} sx={{display: tabValue === '0' ? 'none' : 'inline-block',marginRight: '10px !important'}}>
            Prev
          </SoftButton>
          <SoftButton variant="contained" color="info" onClick={nextHandler}>
            {tabValue === '3'? 'Save' : 'Next'}
          </SoftButton>
        </SoftBox>
      </SoftBox>
      {tabValue === '0' && (
        <FranchiseDetails
          businessInformation={businessInformation}
          setBusinessInformation={setBusinessInformation}
          addressInformation={addressInformation}
          setAddressInformation={setAddressInformation}
          contactInformation={contactInformation}
          setContactInformation={setContactInformation}
          otherInformation={otherInformation}
          setOtherInformation={setOtherInformation}
          bankInformation={bankInformation}
          setBankInformation={setBankInformation}
        />
      )}
      {tabValue === '1' && <FranchiseTerms isDetailPage={false}/>}
      {tabValue === '2' && <FranchiseLiscense isDetailPage={false}/>}
      {tabValue === '3' && <FranchiseLegal />}
    </DashboardLayout>
  );
};

export default AddingFranchise;
