import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { Box } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import SoftInput from '../../../../../components/SoftInput';
import Spinner from '../../../../../components/Spinner';
import { DataGrid } from '@mui/x-data-grid';
import { getAllPushScheduledCampaigns, getAllWhatsappScheduledCampaigns } from '../../../../../config/Services';

const ScheduledCampaigns = () => {
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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
      field: 'startDate',
      headerName: 'Start Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'scheduledTime',
      headerName: 'Scheduled Time',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  const clientId = localStorage.getItem('clientId');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const fetchCampaignList = () => {
    try {
      getAllPushScheduledCampaigns(clientId)
        .then((res) => {
          const dataArr = res?.data?.data || [];
          const updatedRow = dataArr?.map((item) => {
            const createdOn = new Date(item?.startDate);
            const formattedDate = `${createdOn?.getDate()} ${
              months[createdOn?.getMonth()]
            } ${createdOn?.getFullYear()}`;

            const endOn = new Date(item?.endDate);
            const formattedEndDate = `${endOn?.getDate()} ${months[endOn?.getMonth()]} ${endOn?.getFullYear()}`;

            let formattedScheduledTime = 'NA';
            if (item?.scheduledTime) {
              const scheduledTime = new Date(`1970-01-01T${item?.scheduledTime}`);
              scheduledTime?.setHours(scheduledTime?.getHours() + 5);
              scheduledTime?.setMinutes(scheduledTime?.getMinutes() + 30);
              formattedScheduledTime = scheduledTime?.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });
            }

            return {
              id: item?.schedulePushCampaignId,
              campaign: item?.campaignName,
              template: item?.templateName,
              endDate: formattedEndDate,
              startDate: formattedDate || 'NA',
              scheduledTime: formattedScheduledTime || 'NA',
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

  const fetchCampaignListWhatsapp = () => {
    try {
      getAllWhatsappScheduledCampaigns(clientId)
        .then((res) => {
          const dataArr = res?.data?.data || [];
          const updatedRow = dataArr?.map((item) => {
            const createdOn = new Date(item?.startDate);
            const formattedDate = `${createdOn?.getDate()} ${
              months[createdOn?.getMonth()]
            } ${createdOn?.getFullYear()}`;

            const endOn = new Date(item?.endDate);
            const formattedEndDate = `${endOn?.getDate()} ${months[endOn?.getMonth()]} ${endOn?.getFullYear()}`;

            let formattedScheduledTime = 'NA';
            if (item?.scheduledTime) {
              const scheduledTime = new Date(`1970-01-01T${item?.scheduledTime}`);
              scheduledTime?.setHours(scheduledTime?.getHours() + 5);
              scheduledTime?.setMinutes(scheduledTime?.getMinutes() + 30);
              // Format to 12-hour clock
              formattedScheduledTime = scheduledTime?.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });
            }

            return {
              id: item?.whatsappCampaignId,
              campaign: item?.campaignName,
              template: item?.templateName,
              endDate: formattedEndDate,
              startDate: formattedDate || 'NA',
              scheduledTime: formattedScheduledTime || 'NA',
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
    if (id === 'PUSH') {
      fetchCampaignList();
    } else if (id === 'WHATSAPP') {
      fetchCampaignListWhatsapp();
    }
  }, []);

  const handleSearch = (searchText) => {
    const filtered = rowData?.filter((item) => item?.campaign?.toLowerCase()?.includes(searchText?.toLowerCase()));
    setFilteredData(filtered);
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <Box className="search-bar-filter-and-table-container">
          <SoftBox
            className="header-bulk-price-edit search-bar-filter-container"
            sx={{
              padding: '15px',
              bgcolor: 'var(--search-bar-filter-container-bg)',
              display: 'flex',
              justifyContent: 'space-between !important',
            }}
          >
            <Box className="all-products-filter-product">
              <SoftInput
                className="all-products-filter-soft-input-box"
                placeholder="Search Campaigns"
                icon={{ component: 'search', direction: 'left' }}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Box>
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
                <DataGrid columns={columns} rows={filteredData} pagination pageSize={8} />
              </SoftBox>
            )}
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default ScheduledCampaigns;
