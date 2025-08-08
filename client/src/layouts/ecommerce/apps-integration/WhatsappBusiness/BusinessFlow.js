import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import Filter4Icon from '@mui/icons-material/Filter4';
import Filter5Icon from '@mui/icons-material/Filter5';
import Filter6Icon from '@mui/icons-material/Filter6';
import Filter7Icon from '@mui/icons-material/Filter7';
import { Box, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import ShowProducts from '././components/ShowProducts';
import AddCatalogProducts from './components/AddCatalogProducts';
import ChooseTemplates from './components/ChooseTemplates';
import CreateCatalog from './components/CreateCatalog';
import PreviewWorkflow from './components/PreviewWorkflow';
import Process from './components/Process';
import Workflow from './components/Workflow';

const BusinessFlow = () => {
  const catalogId = localStorage.getItem('catalogId');
  const initialTab = !catalogId ? 'Create' : 'Add';
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const navigate = useNavigate();
  const items = [
    { id: 'item1', content: '1. Welcome Message' },
    { id: 'item2', content: '2. Address' },
    { id: 'item3', content: '3. Send Catalog' },
    { id: 'item4', content: '4. Payment Status' },
    { id: 'item5', content: '5. Not Serviceable' },
    // { id: 'item6', content: '6. Delivery Notification' },
    // { id: 'item7', content: '7. Delivery Success' },
    // { id: 'item8', content: '8. Delivery Failed' },
  ];
  const [itemsState, setItems] = useState(items);

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
            padding: '20px',
          }}
        >
          <Typography>Setup Whatsapp Catalog Messages</Typography>
          <Typography
            style={{
              fontWeight: '200',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: 'rgb(102, 102, 102)',
              textAlign: 'left',
              margin: '10px 0px',
            }}
          >
            Complete steps below to enable catalog messages
          </Typography>
          <SoftBox
            py={0}
            px={0}
            sx={{
              marginTop: '1rem',
            }}
          >
            <Grid container spacing={4} style={{ marginTop: '10px' }}>
              <Grid item lg={3} sm={12} md={6} xs={12}>
                <SoftBox className="wa-business-flow-box">
                  <div
                    className={selectedTab === 'Create' ? 'wa-business-flow-div-selected' : 'wa-business-flow-div'}
                    onClick={() => setSelectedTab('Create')}
                  >
                    <Filter1Icon />
                    <Typography
                      className={selectedTab === 'Create' ? 'wa-business-flow-typo-selected' : 'wa-business-flow-typo'}
                    >
                      Create Catalog
                    </Typography>
                  </div>
                  <div
                    className={selectedTab === 'Add' ? 'wa-business-flow-div-selected' : 'wa-business-flow-div'}
                    onClick={() => setSelectedTab('Add')}
                  >
                    <Filter2Icon />
                    <Typography
                      className={selectedTab === 'Add' ? 'wa-business-flow-typo-selected' : 'wa-business-flow-typo'}
                    >
                      Add Products
                    </Typography>
                  </div>

                  <div
                    className={selectedTab === 'Show' ? 'wa-business-flow-div-selected' : 'wa-business-flow-div'}
                    onClick={() => setSelectedTab('Show')}
                  >
                    <Filter3Icon />
                    <Typography
                      className={selectedTab === 'Show' ? 'wa-business-flow-typo-selected' : 'wa-business-flow-typo'}
                    >
                      Show Products
                    </Typography>
                  </div>
                  <div
                    className={selectedTab === 'Flow' ? 'wa-business-flow-div-selected' : 'wa-business-flow-div'}
                    onClick={() => setSelectedTab('Flow')}
                  >
                    <Filter4Icon />
                    <Typography
                      className={selectedTab === 'Flow' ? 'wa-business-flow-typo-selected' : 'wa-business-flow-typo'}
                    >
                      Work Flow
                    </Typography>
                  </div>
                  <div
                    className={selectedTab === 'Templates' ? 'wa-business-flow-div-selected' : 'wa-business-flow-div'}
                    onClick={() => setSelectedTab('Templates')}
                  >
                    <Filter5Icon />
                    <Typography
                      className={
                        selectedTab === 'Templates' ? 'wa-business-flow-typo-selected' : 'wa-business-flow-typo'
                      }
                    >
                      Create Templates
                    </Typography>
                  </div>
                  <div
                    className={selectedTab === 'Preview' ? 'wa-business-flow-div-selected' : 'wa-business-flow-div'}
                    onClick={() => setSelectedTab('Preview')}
                  >
                    <Filter6Icon />
                    <Typography
                      className={selectedTab === 'Preview' ? 'wa-business-flow-typo-selected' : 'wa-business-flow-typo'}
                    >
                      Preview
                    </Typography>
                  </div>
                  <div
                    className={selectedTab === 'Process' ? 'wa-business-flow-div-selected' : 'wa-business-flow-div'}
                    onClick={() => setSelectedTab('Process')}
                  >
                    <Filter7Icon />
                    <Typography
                      className={selectedTab === 'Process' ? 'wa-business-flow-typo-selected' : 'wa-business-flow-typo'}
                    >
                      Process
                    </Typography>
                  </div>
                </SoftBox>
              </Grid>
              <Grid item lg={9} sm={12} md={6} xs={12}>
                {selectedTab === 'Add' ? (
                  <AddCatalogProducts selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                ) : selectedTab === 'Create' ? (
                  <CreateCatalog setSelectedTab={setSelectedTab} />
                ) : selectedTab === 'Show' ? (
                  <ShowProducts setSelectedTab={setSelectedTab} />
                ) : selectedTab === 'Templates' ? (
                  <ChooseTemplates setSelectedTab={setSelectedTab} itemsState={itemsState} setItems={setItems} />
                ) : selectedTab === 'Flow' ? (
                  <Workflow itemsState={itemsState} setSelectedTab={setSelectedTab} />
                ) : selectedTab === 'Process' ? (
                  <Process itemsState={itemsState} />
                ) : selectedTab === 'Preview' ? (
                  <PreviewWorkflow itemsState={itemsState} setSelectedTab={setSelectedTab} />
                ) : null}
              </Grid>
            </Grid>
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default BusinessFlow;
