import './index.css';
import { Box, Grid, Switch } from '@mui/material';
import { ClearSoftInput, dateFormatter, textFormatter } from '../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { editServiceData, getServiceDataList } from '../../../../config/Services';
import {
  setAddLocation,
  setAddLocationByRadius,
  setAreaName,
  setCheckboxState,
  setDeliveryCost,
  setDeliverySlots,
  setInstantDelivery,
  setInstantDeliveryId,
  setPickupAddress,
  setPickupName,
  setRateArray,
  setRateByDistance,
  setRateByPrice,
  setRateByWeight,
  setRegionId,
  setSameDeliveryYear,
  setSelectOption,
  setShippingId,
  setcutOffTime,
  setpickUpCheckBox,
  setpickupInstruction,
} from '../../../../datamanagement/serviceSlice';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import DeleteIcon from '@mui/icons-material/Delete';
import Filter from '../../Common/Filter';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';


const ServiceabilityHyperlocal = () => {
  const navigate = useNavigate();

  const contextType = localStorage.getItem('contextType');


  const [datRows, setTableRows] = useState([]);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const showSnackBar = useSnackbar();
  const [areaName, setAreaNameData] = useState(null);
  const dispatch = useDispatch();
  const [deleteRegion, setDelete] = useState(false);
  const [active, setActive] = useState(false);

  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  // to handle Ios switch button function

  const columns = [
    {
      field: 'createdOn',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'id',
      headerName: 'Region ID',
      minWidth: 150,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      flex: 0.75,
    },
    {
      field: 'name',
      headerName: 'Area Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 180,
      flex: 0.75,
    },
    {
      field: 'pickupname',
      headerName: 'Pickup Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
    {
      field: 'pickupaddress',
      headerName: 'Pickup Address',
      type: 'number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'center',
      minWidth: 150,
      flex: 0.75,
    },
    {
      field: 'Active',
      headerName: 'active',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 30,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <>
            <Box className="switch-box-wrapper">
              <Switch
                {...label}
                onChange={() => handleSwitchHandler(params.row)}
                size="large"
                checked={params.row.active}
                color="success"
                className="switch-icon-service"
              />
            </Box>
          </>
        );
      },
    },
    {
      field: 'Delete',
      headerName: 'delete',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 30,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <>
            <Box>
              <DeleteIcon
                {...label}
                onClick={() => handleDeleteHandler(params.row)}
                size="large"
                value={params.row.delete}
                className="delete-icon-service"
                sx={{ height: '1.5rem' }}
              />
            </Box>
          </>
        );
      },
    },
  ];

  // for active and inctive of slots
  const handleSwitchHandler = (row) => {
    const updatedRows = datRows.map((dataRow) => {
      if (dataRow.id === row.id) {
        dataRow.active = !dataRow.active;
      }
      return dataRow;
    });

    const payload = {
      regionId: row.id,
      isActive: row.active,
    };
    setActive(row.active);
    editServiceData(payload)
      .then((res) => {
        showSnackBar(res?.data?.data?.data, 'success');
      })
      .catch((err) => {
        showSnackBar(err?.message, 'error');
      });
    setTableRows(updatedRows);
  };

  const handleDeleteHandler = (row) => {
    const updatedRows = datRows.map((dataRow) => {
      if (dataRow.id === row.id) {
        dataRow.delete = !dataRow.delete;
      }
      return dataRow;
    });

    const payload = {
      regionId: row.id,
      isDeleted: row.delete,
    };
    setDelete(row.delete);
    editServiceData(payload)
      .then((res) => {
        showSnackBar(res?.data?.data?.data, 'success');
      })
      .catch((err) => {
        showSnackBar(err?.message, 'error');
      });
    setTableRows(updatedRows);
  };

  // service table apis

  const newPayload = {
    areaName: areaName ? [areaName] : null,
    regionCode: null,
    pinCodes: null,
    radius: null,
    pickupName: null,
    pickupAddress: null,
    pickupInstructions: null,
    chargeableType: null,
    sourceId: [orgId],
    sourceLocationId: [locId],
    createdAtStart: null,
    createdAtEnd: null,
    modifiedAtStart: null,
    modifiedAtEnd: null,
    createdBy: null,
    modifiedBy: null,
    deletedBy: null,
    isDeleted: [false],
    deletedAtStart: null,
    deletedAtEnd: null,
    freeDeliveryAbove: null,
    min: null,
    max: null,
    rate: null,
  };

  let dataArr,
    dataRow = [];

  // const [pageState, setPageState] = useState({
  //   loader: false,
  //   datRows: [],
  //   total: 0,
  //   page: 1,
  //   pageSize: 8,
  //   // invoiceId:getOrderText,
  // });

  const serviceList = () => {
    // setPageState((old) => ({ ...old, loader: true }));
    getServiceDataList(newPayload)
      .then((res) => {
        showSnackBar('Success data fetched', 'success');
        dataArr = res?.data?.data?.results;
        dataRow?.push(
          dataArr.map((e) => ({
            createdOn: e.createdAt
              ? // new Date(e.createdAt).toLocaleString()
              dateFormatter(e.createdAt)
              : '-----',
            id: e.regionId ? e.regionId : '-----',
            name: e.areaName ? textFormatter(e.areaName) : '-----',
            pickupname: e.pickupName ? textFormatter(e.pickupName) : '-----',
            pickupaddress: e.pickupAddress ? textFormatter(e.pickupAddress) : '-----',
            active: e.isActive ? e.isActive : false,
            delete: e.isDeleted ? e.isDeleted : false,
          })),
        );
        setTableRows(dataRow[0]);
        // setPageState((old) => ({
        //   ...old,
        //   loader: false,
        //   datRows: dataRow[0] || [],
        //   total: res?.data?.data?.results || 0,
        // }));
      })
      .catch((err) => {
        showSnackBar(err?.message, 'error');
      });
  };

  useEffect(() => {
    serviceList();
  }, [areaName, active, deleteRegion]);

  const navigateToDetailsPage = (id) => {
    navigate(`/pallet-hyperlocal/serviceability/pincode/${id}`);
  };

  // to search in table using regionId

  const handleRegionSearch = (e) => {
    const inputText = e.target.value;
    setAreaNameData(inputText);
  };

  // clear purchase indent search input fn
  const handleClearRegionSearch = () =>{
    setAreaNameData(null);
  };

  const handleRegion = () => {
    dispatch(setAreaName(''));
    dispatch(setAddLocation([{ pinCode: '', areaName: '' }]));
    dispatch(setAddLocationByRadius([]));
    dispatch(setInstantDelivery([{ startTime: '', endTime: '', orderCapicty: '' }]));
    dispatch(setDeliverySlots([]));
    dispatch(setPickupName(''));
    dispatch(setPickupAddress(''));
    dispatch(setpickupInstruction(''));
    dispatch(setSelectOption({ value: '', label: '' }));
    dispatch(setRateByWeight([{ min: 0, max: 0, rate: 0 }]));
    dispatch(setRateByDistance([{ min: 0, max: 0, rate: 0 }]));
    dispatch(setRateByPrice([{ min: 0, max: 0, rate: 0 }]));
    dispatch(setRateArray([{ min: 0, max: 0, rate: 0 }]));
    dispatch(setCheckboxState(false));
    dispatch(setDeliveryCost(''));
    dispatch(setcutOffTime(''));
    dispatch(setSameDeliveryYear(false));
    dispatch(setpickUpCheckBox(false));
    dispatch(setRegionId(''));
    dispatch(setShippingId(''));
    dispatch(setInstantDeliveryId(''));
    navigate('/pallet-hyperlocal/serviceability/pincode');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="search-bar-filter-and-table-container">
        <SoftBox className="search-bar-filter-container">
          <Grid container spacing={2}>
            <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
              <SoftBox sx={{position:'relative'}}>
                <SoftInput
                  placeholder="Search region"
                  value={areaName!==null ? areaName : ''}
                  icon={{ component: 'search', direction: 'left' }}
                  onChange={(e) => handleRegionSearch(e)}
                />
                {areaName!==null && <ClearSoftInput clearInput={ handleClearRegionSearch }/>}
              </SoftBox>
            </Grid>

            <Grid
              item
              lg={6.5}
              md={6.5}
              sm={6}
              xs={12}
              sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', gap: '10px' }}
            >
              <SoftBox>
                <SoftButton
                  // className="vendor-add-btn"
                  variant="solidWhiteBackground"
                  onClick={handleRegion}
                >
                  <AddIcon /> Add Region
                </SoftButton>
              </SoftBox>
              <Filter />
            </Grid>
          </Grid>
        </SoftBox>
        <Box sx={{ height: 525, width: '100%' }}>
          <DataGrid
            rows={datRows}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[8]}
            // pagination
            // page={pageState.page - 1}
            // pageSize={pageState.pageSize}
            // paginationMode="server"
            // rowsPerPageOptions={[8]}
            // onPageChange={(newPage) => {
            //   setPageState((old) => ({ ...old, page: newPage + 1 }));
            // }}

            checkboxSelection
            disableSelectionOnClick
            getRowId={(row) => row.id}
            onCellDoubleClick={(rows) => {
              if (rows?.row.active === true) {
                navigateToDetailsPage(rows.row['id']);
              }
            }}
            sx={{
              borderBottomLeftRadius: '10px',
              borderBottomRightRadius: '10px',
            }}
            getRowClassName={(params) => (params.row.active === true ? 'highlighted-row' : 'unhighlighted-row')}
          />
        </Box>
      </SoftBox>
    </DashboardLayout>
  );
};

export default ServiceabilityHyperlocal;
