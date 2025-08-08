import AddIcon from '@mui/icons-material/Add';
import CampaignIcon from '@mui/icons-material/Campaign';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Box, Modal, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import Spinner from '../../../../../components/Spinner';
import { getAllWhatsAppCampaignTemplateList } from '../../../../../config/Services';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const AllWhatsappTemplates = () => {
  const [rowData, setRowData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [marketingOpen, setMarketingOpen] = useState(false);
  const clientId = localStorage.getItem('clientId');

  const navigate = useNavigate();

  const createNewWhatsAppTemplateCampaign = () => {
    // navigate('/campaigns/whatsapp/create/template');
    handleOpen();
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  let dataArr;
  const allTemplates = () => {
    try {
      getAllWhatsAppCampaignTemplateList()
        .then((res) => {
          setLoader(false);
          dataArr = res?.data?.data?.filter((item) => item?.clientId === clientId) || [];

          const updatedDataRow = dataArr?.map((item) => {
            return {
              id: item?.tempRefId,
              template: item?.templateName,
              category: capitalizeFirstLetter(item?.category),
              header: capitalizeFirstLetter(item?.headerFormate),
            };
          });
          setRowData(updatedDataRow);
          setFilteredData(updatedDataRow);
        })
        .catch((error) => {
          setLoader(false);
        });
    } catch (error) {
      setLoader(false);
    }
  };

  const handleSearch = (searchText) => {
    // Filter data based on templateName
    const filtered = rowData?.filter((item) => item?.template?.toLowerCase().includes(searchText?.toLowerCase()));
    setFilteredData(filtered);
  };

  useEffect(() => {
    allTemplates();
  }, []);

  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      minWidth: 20,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'template',
      headerName: 'Template Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 120,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'header',
      headerName: 'Header',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'category',
      headerName: 'Category',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  return (
    <div>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              style={{
                fontWeight: '600',
                fontSize: '1rem',
                lineHeight: '1.5',
                color: '#0562FB',
                textAlign: 'left',
                margin: '10px 0px',
              }}
            >
              Category
            </Typography>
            <Typography
              style={{
                fontWeight: '200',
                fontSize: '0.8rem',
                lineHeight: '1.5',
                color: '#4b524d',
                textAlign: 'left',
              }}
            >
              Choose a category that best describes your message template.
            </Typography>
            <div style={{ marginTop: '10px' }}>
              <div>
                <div className="template-wa-choose-category-single" onClick={() => setMarketingOpen(!marketingOpen)}>
                  <div className="template-wa-choose-img">
                    <CampaignIcon sx={{ fontSize: '24px' }} />
                  </div>
                  <div>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                      }}
                    >
                      Marketing
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                      }}
                    >
                      Promotions or information about your business, products or services.
                    </Typography>
                  </div>
                </div>
                {marketingOpen && (
                  <div id="template-wa-choose-all">
                    <div
                      className="template-wa-choose-category-single2"
                      onClick={() => navigate('/campaigns/whatsapp/create/template')}
                    >
                      <div className="template-wa-choose-img2"></div>
                      <div>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            lineHeight: '1.5',
                            color: '#4b524d',
                            textAlign: 'left',
                          }}
                        >
                          Custom
                        </Typography>
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: '#4b524d',
                            textAlign: 'left',
                          }}
                        >
                          Send promotional offers, announcements and more to increase awareness and engagement.
                        </Typography>
                      </div>
                    </div>
                    <div
                      className="template-wa-choose-category-single2"
                      onClick={() => navigate('/campaigns/whatsapp/create/template/product')}
                    >
                      <div className="template-wa-choose-img2"></div>
                      <div>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            lineHeight: '1.5',
                            color: '#4b524d',
                            textAlign: 'left',
                          }}
                        >
                          Product Messages
                        </Typography>
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: '#4b524d',
                            textAlign: 'left',
                          }}
                        >
                          Send messages about your entire catalogue or multiple products from it.
                        </Typography>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                className="template-wa-choose-category-single"
                onClick={() => navigate('/campaigns/whatsapp/create/template')}
              >
                <div className="template-wa-choose-img">
                  <NotificationsIcon sx={{ fontSize: '24px' }} />
                </div>
                <div>
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                    }}
                  >
                    Utility
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                    }}
                  >
                    Messages about a specific transaction, account, order or customer request
                  </Typography>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <Box
          className="search-bar-filter-and-table-container"
          style={
            {
              // boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
              // position: 'relative',
            }
          }
        >
          <Box
            className="header-bulk-price-edit search-bar-filter-container"
            sx={{
              padding: '15px',
              bgcolor: 'var(--search-bar-filter-container-bg)',
              display: 'flex',
            }}
          >
            {/* <SoftBox style={{marginTop: "5px"}}>
                <BiArrowBack onClick={() => navigate('/campaigns/whatsapp')} style={{ cursor: 'pointer' }} />
              </SoftBox> */}
            <Box className="all-products-filter-product">
              <SoftInput
                className="all-products-filter-soft-input-box"
                placeholder="Search Templates"
                icon={{ component: 'search', direction: 'left' }}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Box>

            <SoftBox
              className="all-products-header-new-btn"
              display={'flex'}
              alignItems={'left'}
              justifyContent={'right'}
            >
              <SoftButton
                // className="vendor-add-btn"
                // sx={{
                //   backgroundColor: '#0562FB !important',
                //   color: '#ffffff !important',
                //   border: '2px solid #ffffff !important',
                //   marginRight: '10px',
                // }}
                variant="solidWhiteBackground"
                onClick={createNewWhatsAppTemplateCampaign}
              >
                <AddIcon />
                Template
              </SoftButton>
            </SoftBox>
          </Box>
          <SoftBox py={0} px={0}>
            {loader && <Spinner />}
            {!loader && (
              <SoftBox style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
                <DataGrid columns={columns} rows={filteredData} pagination pageSize={8} />
              </SoftBox>
            )}
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default AllWhatsappTemplates;
