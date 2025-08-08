import './index.css';
import { Box, Card, CircularProgress, Grid, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { components } from 'react-select';
import {
  createStockSchedule,
  getCategoriesBulkPriceEdit,
  getInventoryListMobile,
  getManufacturerBulkPriceEdit,
  getUsersByRole,
} from '../../../../../../config/Services';
import { filterStateAndFiltersAppliedHandleFn } from '../../../../Common/Filter Components/filterComponents';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import Filter from '../../../../Common/Filter';
import FormField from 'layouts/ecommerce/product/all-products/components/edit-product/components/FormField/index';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import { noDatagif } from '../../../../Common/CommonFunction';

export const StockTaking = () => {
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const user_details = localStorage.getItem('user_details');
  const { uidx, firstName, secondName } = user_details && JSON.parse(user_details);
  const [schedulerName, setSchedulerName] = useState('');
  const [date, setDate] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filterState, setFilterState] = useState({
    brandList: 0,
    categoryList: 0,
  });
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    changePageCount: 0,
  });
  const [filters, setFilters] = useState({
    pageNumber: pageState?.page,
    pageSize: pageState?.pageSize,
    categoryList: [],
    locationId: locId,
    brandList: [],
    gtinList: [],
    storageIds: [],
    vendorIds: [],
    orgId: orgId,
    outOfStock: false,
    searchBox: '',
  });
  const styles = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  const goBack = () => navigate(-1);

  const { data: categoryList } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['categoryList'],
    queryFn: async () => {
      const response = await getCategoriesBulkPriceEdit(locId);
      const list = response?.data?.data?.data.map((item) => {
        return {
          value: item,
          label: item,
        };
      });
      return list;
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const { data: brandList } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['brandList'],
    queryFn: async () => {
      const response = await getManufacturerBulkPriceEdit(locId);
      const list = response?.data?.data?.data.map((item) => {
        return {
          value: item,
          label: item,
        };
      });
      return list;
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const { data: usersList } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['usersList'],
    queryFn: async () => {
      const payload = {
        contextId: locId,
        roles: ['RETAIL_USER'],
      };
      const response = await getUsersByRole(payload);
      const list = response?.data?.data.map((item) => {
        return {
          value: item?.uidx,
          label: item?.first_name + ' ' + item?.second_name,
        };
      });
      return list;
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const {
    data: productList,
    isFetching: isFetchingProductList,
    refetch: refetchProductList,
  } = useQuery({
    refetchOnWindowFocus: false,
    retry: 1,
    queryKey: ['productList'],
    queryFn: async () => {
      const filterObj = {
        ...filters,
        pageNumber: pageState?.page,
        pageSize: pageState?.pageSize,
        brandList: filters?.brandList.map((item) => item.value) || [],
        categoryList: filters?.categoryList.map((item) => item.value) || [],
      };
      const response = await getInventoryListMobile(filterObj);
      if (response?.data?.data?.es) {
        throw new Error(response?.data?.data?.message);
      }
      const dataList = response?.data?.data?.data?.data?.map((item) => {
        return {
          id: item?.gtin,
          product_name: item?.itemName,
          barcode: item?.gtin,
          inventory_count: item?.totalAvailableUnits,
          batches: item?.numberOfBatches,
        };
      });
      setPageState((old) => ({
        ...old,
        datRows: dataList,
        total: response?.data?.data?.data?.totalResult,
        page: response?.data?.data?.data?.pageNumber,
        loader: false,
      }));
      return dataList;
    },
    onError: (error) => {
      showSnackbar(error?.message || error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const { mutate: createStockScheduleMutation, isLoading: isCreatingStockSchedule } = useMutation({
    mutationFn: (payload) => createStockSchedule(payload),
    onSuccess: (response) => {
      showSnackbar(response?.data?.message || 'Stock schedule created successfully', 'success');
      goBack();
    },
    onError: (error) => {
      showSnackbar(
        error?.response?.data?.message?.error || error?.response?.data?.message || 'Some error occured',
        'error',
      );
    },
  });

  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      flex: 1,
      minWidth: 90,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'product_name',
      headerName: 'Product name',
      editable: true,
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'barcode',
      headerName: 'Barcode',
      editable: true,
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'inventory_count',
      headerName: 'Inventory Count',
      editable: true,
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'batches',
      headerName: 'Batches',
      editable: true,
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
  ];

  const handleFilterSelect = (value, name) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    handleFilterStateAndFiltersApplied(name);
  };

  const ValueContainer = ({ children, ...props }) => {
    let [values, input] = children;
    if (Array.isArray(values)) {
      const { length } = values;
      values = `${length} selected`;
    }
    return (
      <components.ValueContainer {...props}>
        {values}
        {input}
      </components.ValueContainer>
    );
  };

  const BrandSelect = (
    <SoftSelect
      placeholder="Select Brands"
      components={{ ValueContainer }}
      hideSelectedOptions={false}
      value={filters.brandList}
      options={brandList}
      isMulti
      name="brand"
      onChange={(value) => handleFilterSelect(value, 'brandList')}
    />
  );

  const CategorySelect = (
    <SoftSelect
      placeholder="Select Category"
      components={{ ValueContainer }}
      hideSelectedOptions={false}
      value={filters.categoryList}
      options={categoryList}
      isMulti
      name="category"
      onChange={(value) => handleFilterSelect(value, 'categoryList')}
    />
  );

  const selectBoxArray = [BrandSelect, CategorySelect];

  const handleClearFilter = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 10,
      categoryList: [],
      locationId: locId,
      brandList: [],
      gtinList: [],
      storageIds: [],
      vendorIds: [],
      orgId: orgId,
      outOfStock: false,
      searchBox: '',
    });
    setFilterState({
      brandList: 0,
      categoryList: 0,
    });
    setPageState((old) => ({ ...old, page: 1, changePageCount: old.changePageCount + 1 }));
  };

  const applyFilter = () => {
    setPageState((old) => ({ ...old, page: 1, changePageCount: old.changePageCount + 1 }));
  };

  useEffect(() => {
    refetchProductList();
  }, [pageState.changePageCount]);

  const handleSave = () => {
    if (!date) {
      showSnackbar('Please enter date', 'error');
      return;
    }
    if (!selectedUsers?.length) {
      showSnackbar('Please select users', 'error');
      return;
    }

    const brandList = filters.brandList.map((item) => item.value) || [];
    const categoryList = filters.categoryList.map((item) => item.value) || [];
    const payload = {
      schedulerName: schedulerName,
      sourceOrgId: orgId,
      sourceLocId: locId,
      schedulerType: 'CYCLE_COUNT',
      byLayout: false,
      scStorageId: [],
      scBrand: brandList,
      manufacturer: [],
      scMainCategory: categoryList,
      scCategory1: [],
      scCategory2: [],
      scLineOfBusiness: [],
      scDepartment: [],
      startDate: date,
      productPerSession: null,
      frequency: null,
      createdBy: uidx,
      createdByName: `${firstName} ${secondName}`,
      schedulerAssignedList:
        selectedUsers?.map((item) => {
          return {
            assignedUidx: item.value,
          };
        }) || [],
    };
    createStockScheduleMutation(payload);
  };

  // applied filters count
  const filterLength = Object.values(filterState).filter((value) => value === 1).length;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox>
        <SoftTypography variant="h4" fontSize="1.2rem">
          Stock Calendar
        </SoftTypography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} xl={6}>
            <Card className="stock-calender-name-box">
              <FormField
                type="text"
                label="Stock Schedule Name"
                name="name"
                value={schedulerName}
                onChange={(e) => setSchedulerName(e.target.value)}
              />
            </Card>
          </Grid>
        </Grid>

        <SoftBox className="header-bulk-price-edit all-products-filter-wrapper search-bar-filter-container">
          <Grid container spacing={2} className="all-products-filter" alignItems={'center'}>
            <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
              <Box className="all-products-filter-product">
                <SoftInput
                  className="all-products-filter-soft-input-box"
                  placeholder="Search Products"
                  value={''}
                  icon={{ component: 'search', direction: 'left' }}
                />
              </Box>
            </Grid>
            <Grid item lg={6.5} md={6.5} sm={6} xs={12} justifyContent={'right'}>
              <Box
                className="all-products-header-new-btn"
                display={'flex'}
                alignItems={'center'}
                justifyContent={'right'}
              >
                <div className="stock-dashboard-table-count">{pageState.total} Products</div>
                <Filter
                  filtersApplied={filterLength}
                  // filterChipBoxes={filterChipBoxes}
                  selectBoxArray={selectBoxArray}
                  // removeSelectedFilter={removeSelectedFilter}
                  handleApplyFilter={applyFilter}
                  handleClearFilter={handleClearFilter}
                />
              </Box>
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox style={{ height: 525, width: '100%' }} className="dat-grid-table-box" mb={2}>
          <DataGrid
            className="data-grid-table-boxo"
            columns={columns}
            rows={pageState?.datRows}
            getRowId={(row) => row.id}
            rowCount={parseInt(pageState?.total)}
            loading={isFetchingProductList}
            pagination
            paginationMode="server"
            page={pageState?.page - 1}
            pageSize={pageState?.pageSize}
            onPageChange={(newPage) => {
              setPageState((old) => ({ ...old, page: newPage + 1, changePageCount: old.changePageCount + 1 }));
            }}
            disableSelectionOnClick
            components={{
              NoRowsOverlay: () => (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </SoftBox>
                  <h3 className="no-data-text-I"> No transaction available</h3>
                </SoftBox>
              ),
              NoResultsOverlay: () => (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </SoftBox>
                  <h3 className="no-data-text-I"> No transaction available</h3>
                </SoftBox>
              ),
            }}
          />
        </SoftBox>
        <Card className="stock-calender-roles-assign">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <SoftBox>
                <SoftBox display="inline-block">
                  <InputLabel required sx={styles}>
                    Assignee
                  </InputLabel>
                </SoftBox>
                <SoftSelect
                  isMulti
                  hideSelectedOptions={false}
                  components={{ ValueContainer }}
                  options={usersList}
                  value={selectedUsers}
                  menuPortalTarget={document.body}
                  classNamePrefix="soft-select"
                  onChange={(value) => setSelectedUsers(value)}
                />
              </SoftBox>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                type="date"
                label="Start Date"
                name="name"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>
          </Grid>
          <SoftBox className="stock-taking-buttons">
            <SoftButton variant="outlined" className="outlined-softbutton" onClick={goBack}>
              CANCEL
            </SoftButton>
            <SoftButton varinat="contained" className="contained-softbutton" onClick={handleSave}>
              {isCreatingStockSchedule ? <CircularProgress size={20} color="inherit" /> : 'SAVE'}
            </SoftButton>
          </SoftBox>
        </Card>
      </SoftBox>
    </DashboardLayout>
  );
};
