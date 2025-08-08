import { Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAllDeliveryAgent } from '../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import Spinner from '../../../../components/Spinner';
import { noDatagif } from '../../Common/CommonFunction';

const DeliveryAgent = () => {
  const contextType = localStorage.getItem('contextType');

  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      minWidth: 140,
      flex: 1,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'createdOn',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 90,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'orgId',
      headerName: 'Organization ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'locId',
      headerName: 'Location ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 1,
    },
  ];

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [errorComing, setErrorComing] = useState(true);
  const [loader, setLoader] = useState(false);
  const [allAgent, setAllAgent] = useState([]);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const handleNewAgent = () => {
    navigate('/pallet-hyperlocal/add-delivery-agent');
  };

  let dataArr,
    dataRow = [];

  useEffect(() => {
    setLoader(true);
    listAllAgent();
  }, []);

  const listAllAgent = () => {
    getAllDeliveryAgent(orgId, locId)
      .then((res) => {
        setLoader(false);
        if (res?.data?.data?.es) {
          setErrorComing(true);
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        dataArr = res?.data?.data?.data;
        dataRow.push(
          dataArr?.map((row) => ({
            id: row?.deliveryAgentId ? row?.deliveryAgentId : '-----',
            name: row?.deliveryAgentName ? row?.deliveryAgentName : '-----',
            date: row?.createOn ? row?.createdOn : '-----',
            orgId: row?.orgId ? row?.orgId : '-----',
            locId: row?.locId ? row?.locId : '-----',
            locId: row?.locId ? row?.locId : '-----',
          })),
        );
        setAllAgent(dataRow[0]);
        setErrorComing(false);
        showSnackbar(res?.data?.data?.message, 'success');
      })
      .catch((err) => {
        setLoader(false);
        setErrorComing(true);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox
        //  className="softbox-box-shadow view"
        className="search-bar-filter-and-table-container"
      >
        <SoftBox
          className="search-bar-filter-container"
          // sx={{
          //   display: 'flex',
          //   alignItem: 'center',
          //   justifyContent: 'space-between',
          // }}
        >
          <Grid container spacing={2}>
            <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
              {/* <SoftBox className="filter-product-list-cont"> */}
              <SoftInput
                // className="filter-soft-input-box"
                placeholder="Search delivery agents"
                icon={{ component: 'search', direction: 'left' }}
              />
              {/* </SoftBox> */}
            </Grid>

            <Grid
              item
              lg={6.5}
              md={6.5}
              sm={6}
              xs={12}
              sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', gap: '10px' }}
            >
              {/* <SoftButton className="vendor-second-btn" onClick={() => navigate('/apps_integration')}>
                MP
              </SoftButton> */}
              <SoftButton
                variant="solidWhiteBackground"
                // className="vendor-add-btn"
                onClick={handleNewAgent}
              >
                New
              </SoftButton>

              {/* filter  */}
              {/* <Filter /> */}
            </Grid>
          </Grid>
        </SoftBox>
        {loader ? (
          <Box className="centerspinner">
            <Spinner />
          </Box>
        ) : (
          <Box sx={{ height: 525, width: '100%' }}>
            {errorComing ? (
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>

                <h3 className="no-data-text-I">NO DATA FOUND</h3>
              </SoftBox>
            ) : (
              <DataGrid
                rows={allAgent}
                columns={columns}
                pageSize={8}
                rowsPerPageOptions={[8]}
                onCellClick={(rows) => {
                  navigate(`/pallet-hyperlocal/delivery-agent/details/${rows.row.id}`);
                }}
                sx={{
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px',
                }}
              />
            )}
          </Box>
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default DeliveryAgent;
