import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAllBulkPushTemplates } from '../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import Spinner from '../../../../../components/Spinner';

const AllPushTemplates = () => {
  const navigate = useNavigate();
  const [allTemplates, setAllTemplates] = useState([]);
  const [loader, setLoader] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const clientId = localStorage.getItem('clientId');

  const handleCreatePushCampaign = () => {
    navigate('/campaigns/push/template/create');
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
      field: 'category',
      headerName: 'Type',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let dataArr;
  const getListOfTemplates = async () => {
    try {
      setLoader(true);
      const res = await getAllBulkPushTemplates();
      setLoader(false);

      dataArr =
        res?.data?.data?.filter((template) => template?.templateType === 'PUSH' && template?.clientId === clientId) ||
        [];

      const updatedDataRow = dataArr.map((item) => {
        const createdOn = new Date(item?.creationDate);
        const formattedDate = `${createdOn?.getDate()} ${months[createdOn?.getMonth()]} ${createdOn?.getFullYear()}`;
        return {
          id: item?.templateId,
          template: item?.templateName,
          category: item?.templateType,
          createdON: formattedDate,
        };
      });
      setAllTemplates(updatedDataRow);
      setFilteredData(updatedDataRow);
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    getListOfTemplates();
  }, []);

  const handleSearch = (searchText) => {
    // Filter data based on templateName
    const filtered = allTemplates.filter((item) => item.template.toLowerCase().includes(searchText.toLowerCase()));
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
                placeholder="Search Templates"
                icon={{ component: 'search', direction: 'left' }}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Box>
            <SoftButton
              // className="vendor-add-btn"
              onClick={handleCreatePushCampaign}
              // sx={{
              //   backgroundColor: '#0562FB !important',
              //   color: '#ffffff !important',
              //   border: '2px solid #ffffff !important',
              // }}
              variant="solidWhiteBackground"
            >
              <AddIcon />
              Template
            </SoftButton>
          </SoftBox>
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

export default AllPushTemplates;
