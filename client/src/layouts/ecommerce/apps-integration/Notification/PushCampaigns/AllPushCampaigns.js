import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAllWhatsAppCampaignList } from '../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import Spinner from '../../../../../components/Spinner';

const AllPushCampaigns = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  const handleCreatePushCampaign = () => {
    navigate('/campaigns/push/create');
  };

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
      field: 'campaign',
      headerName: 'Campaign Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 120,
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
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 120,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'createdON',
      headerName: 'Created Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'startTime',
      headerName: 'Start Time',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'requested',
      headerName: 'Requested Messages',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'processed',
      headerName: 'Processed Messages',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'sent',
      headerName: 'Messages Sent',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  const clientId = localStorage.getItem('clientId');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const fetchCampaignList = () => {
    try {
      getAllWhatsAppCampaignList(clientId)
        .then((res) => {
          const dataArr = res?.data?.data || [];
          const filteredData = dataArr?.filter((item) => item?.requestType === 'PUSH');
          const updatedRow = filteredData?.map((item) => {
            const createdOn = new Date(item?.startTime);
            const createdDate = new Date(item?.createdDate);
            // Add 5 hours and 30 minutes
            createdOn?.setHours(createdOn?.getHours() + 5);
            createdOn?.setMinutes(createdOn?.getMinutes() + 30);
            const formattedDate = `${createdDate?.getDate()} ${
              months[createdDate?.getMonth()]
            } ${createdDate?.getFullYear()}`;
            const formattedStartDate = createdOn?.toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });

            const endDate = new Date(item?.endTime);
            // Add 5 hours and 30 minutes
            endDate?.setHours(endDate?.getHours() + 5);
            endDate?.setMinutes(endDate?.getMinutes() + 30);
            const formattedEndDate = endDate?.toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });
            return {
              id: item?.bulkJobID,
              template: item?.templateName,
              campaign: item?.campaignName,
              createdON: formattedDate,
              startTime: formattedStartDate || 'NA',
              endTime: formattedEndDate || 'NA',
              requested: item?.totalRequestedData,
              processed: item?.totalProcessedData,
              sent: item?.totalSuccessData,
              status: item?.status,
            };
          });
          setLoader(false);
          setRowData(updatedRow);
          setFilteredData(updatedRow);
        })
        .catch((error) => {
          setLoader(false);
        });
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchCampaignList();
  }, []);

  const handleSearch = (searchText) => {
    // Filter data based on templateName
    const filtered = rowData.filter((item) => item.template.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredData(filtered);
  };

  return (
    <div>
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
          <SoftBox
            className="header-bulk-price-edit search-bar-filter-container"
            sx={{
              padding: '15px',
              bgcolor: 'var(--search-bar-filter-container-bg)',
              display: 'flex',
              justifyContent: 'space-between !important',
            }}
          >
            {/* <SoftBox style={{ marginTop: '5px' }}>
              <BiArrowBack onClick={() => navigate('/campaigns')} style={{ cursor: 'pointer' }} />
            </SoftBox> */}
            <Box className="all-products-filter-product">
              <SoftInput
                className="all-products-filter-soft-input-box"
                placeholder="Search Templates"
                icon={{ component: 'search', direction: 'left' }}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Box>
            <div style={{ display: 'flex', gap: '10px' }}>
              <SoftButton
                // className="vendor-add-btn"
                variant="solidWhiteBackground"
                onClick={() => navigate(`/marketing/campaign/scheduled/PUSH`)}
                // sx={{
                //   backgroundColor: '#0562FB !important',
                //   color: '#ffffff !important',
                //   border: '2px solid #ffffff !important',
                // }}
              >
                Scheduled Campaigns
              </SoftButton>
              <SoftButton
                // className="vendor-add-btn"
                variant="solidWhiteBackground"
                onClick={handleCreatePushCampaign}
                // sx={{
                //   backgroundColor: '#0562FB !important',
                //   color: '#ffffff !important',
                //   border: '2px solid #ffffff !important',
                // }}
              >
                <AddIcon />
                Campaign
              </SoftButton>
            </div>
          </SoftBox>

          <SoftBox py={0} px={0}>
            {loader && (
              <Box
                sx={{
                  height: '70vh',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner />
              </Box>
            )}
            {!loader && (
              <SoftBox style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
                <DataGrid
                  columns={columns}
                  rows={filteredData}
                  pagination
                  pageSize={8}
                  onCellClick={(params) => navigate(`/campaigns/push/${params.row.id}`)}
                />
              </SoftBox>
            )}
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default AllPushCampaigns;
