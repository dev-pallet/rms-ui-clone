import './franchise-details.css';
import { AppBar, Badge, Card, Grid, Tab, Tabs } from '@mui/material';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import FranchiseLiscense from '../adding-franchise/components/Franchise-liscenses';
import FranchiseOverview from './components/franchise-overview';
import FranchiseTerms from '../adding-franchise/components/FranchiseTerms';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import React, { useState } from 'react';
import SoftAvatar from '../../../../components/SoftAvatar';
import SoftBox from '../../../../components/SoftBox';

const FranchiseDetailsPage = () => {
  const [tabValue, setTabValue] = useState('0');
  const [isTermPage, setIsTermPage] = useState(true);
  const [isLiscensePage, setIsLiscensePage] = useState(true);

  const tabHandler = (e, newValue) => {
    setTabValue(newValue);
  };

  const selectedComponent = () => {
    return tabValue === '0' ? (
      <FranchiseOverview />
    ) : tabValue === '1' ? (
      <FranchiseTerms isDetailPage={isTermPage} setIsDetailsPage={setIsTermPage} />
    ) : tabValue === '2' ? (
      <FranchiseLiscense isDetailPage={isLiscensePage} setIsDetailsPage={setIsLiscensePage}/>
    ) : null;
  };

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
          <Grid item xs={12} md={6} lg={6}>
            <AppBar position="static">
              <Tabs
                // orientation={tabsOrientation}
                value={tabValue}
                onChange={tabHandler}
                sx={{ background: 'transparent' }}
                className="tabs-box"
              >
                <Tab sx={{ width: 'max-content', fontSize: '13px' }} label="Franchise Details" value="0" />
                <Tab sx={{ width: 'max-content', fontSize: '13px' }} label="Terms" value="1" />
                <Tab sx={{ width: 'max-content', fontSize: '13px' }} label="Liscenses" value="2" />
                <Tab sx={{ width: 'max-content', fontSize: '13px' }} label="Legal" value="3" />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Card>
      {selectedComponent()}
    </DashboardLayout>
  );
};

export default FranchiseDetailsPage;
