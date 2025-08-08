import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { Button, Chip, CircularProgress } from '@mui/material';
import { CopyToClipBoard, productIdByBarcode } from '../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // main style file
import {
  exportEndofDayReport,
  exportSalesOverTime,
  getAllUserOrgs,
  getRetailnames_location,
  getWarehouseLocations,
  reportAvailabilityCheck,
  salesReportsChart,
  purchaseReportsChart,
  exportProfitReport,
  exportProductProfitReport,
  getProductWiseProfit,
  exportItemWiseReport,
  exportSelectedItemWiseReport,
  getItemsInfo,
  exportBigQuerySalesReports,
} from '../../../../config/Services'; // theme css file
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CustomGradientLineChart from './CustomGradientLineChart';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import GradientLineChart from '../../../../examples/Charts/LineCharts/GradientLineChart';
import DataTable from '../../../../examples/Tables/DataTable';
import { DateRangePicker } from 'react-date-range';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import downLoadLogo from '../components/assests/downloadLogo.png';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DatepickerReport from './Datepickerreport';
import React, { useEffect, useState } from 'react';
import SalesGradientLineChart from '../../../dashboard widgets/SalesGradient/salesGradient';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';
import moment from 'moment';
import { dataGridStyles } from '../../Common/NewDataGridStyle';
import CreateNewReportModal from './CreateNewReportModal';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { debounce } from 'lodash';
import SoftSelect from '../../../../components/SoftSelect';

const SalesReportchart = () => {
  const { reportId } = useParams();
  const [tabledata, setTabledata] = useState([]);
  const [fromdate, setFromdate] = useState();
  const [todate, setTodate] = useState();
  const [status, setStatus] = useState('ACCEPTED');
  const [retail, setRetail] = useState([]);
  const [warehousdata, setWarehouseData] = useState();
  const [vmsData, setVmsData] = useState();
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const [loader, setLoader] = useState(false);
  const [productWiseProfitData, setProductWiseProfitData] = useState([]);
  const [reportAvailabilityData, setReportAvailabilityData] = useState([]);
  const [itemSearch, setItemSearch] = useState('');
  const [itemNo, setSelectedItemNo] = useState();
  const [itemOptions, setItemOptions] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState();
  const [paymentMode, setPaymentMode] = useState();
  const [orderType, setOrderType] = useState();

  const [open, setOpen] = useState(false);
  let val = localStorage.getItem('user_details');
  let user_name = localStorage.getItem('user_name');
  let object = JSON.parse(val);
  const showSnackbar = useSnackbar();

  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const productWiseProfitColumns = [
    {
      field: 'productName',
      headerName: 'Item Name',
      minWidth: 250,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'gtin',
      headerName: 'GTIN',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
      renderCell: (params) => {
        return <CopyToClipBoard params={params} />;
      },
    },
    {
      field: 'quantitySold',
      headerName: 'Quantity Sold',
      minWidth: 80,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'totalPurchaseCost',
      headerName: 'Purchase Cost',
      minWidth: 120,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'totalSales',
      headerName: 'Total Sales',
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'profitMargin',
      headerName: 'Profit margin',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
  ];

  const chipStyle = {
    height: 'auto',
    '& .MuiChip-label': {
      fontSize: '0.75rem !Important',
    },
  };
  const reportAvailabilityColumns = [
    {
      field: 'docId',
      headerName: 'Doc Id',
      minWidth: 80,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'createdOn',
      headerName: 'created on',
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      minWidth: 180,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
      renderCell: (params) => {
        const firstLetter = params.value ? params.value.charAt(0).toUpperCase() : '';
        const isPallet = params.value === 'Pallet';
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                backgroundColor: isPallet ? 'transparent' : 'cornflowerblue',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8px',
                fontSize: '10px',
                color: '#fff',
              }}
            >
              {isPallet ? (
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/Youtube%20Channel%20Logo%20(1).png"
                  alt="Pallet"
                  style={{ width: '18px', height: '18px' }}
                />
              ) : (
                firstLetter
              )}
            </div>
            {params.value}
          </div>
        );
      },
    },
    {
      field: 'reportStartDate',
      headerName: 'start Date',
      minWidth: 80,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'reportEndDate',
      headerName: 'end Date',
      minWidth: 80,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },

    {
      field: 'status',
      headerName: 'status',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
      renderCell: (params) => {
        if (params?.row?.status === 'CREATED' || params?.row?.status === 'GENERATED') {
          return <Chip label={params?.row?.status || '---'} color="success" sx={chipStyle} />;
        } else if (params?.row?.status === 'IN-PROGRESS' || params?.row?.status === 'IN_PROGRESS') {
          return <Chip label="IN-PROGRESS" color="warning" sx={chipStyle} />;
        }
      },
    },
    {
      field: 'docUrl',
      headerName: 'Url',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
      renderCell: (params) => {
        if (params?.row?.status === 'CREATED' || params?.row?.status === 'GENERATED') {
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <img
                src={downLoadLogo}
                alt="Download"
                style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                onClick={() => window.location.assign(params?.row?.docUrl)}
              />
            </div>
          );
        }
      },
    },
  ];

  const itemSelect = (
    <>
      <SoftSelect
        placeholder="Select Item"
        size="small"
        id="Item"
        isMulti
        options={itemOptions || []}
        classNamePrefix="soft-select"
        menuPortalTarget={document.body}
        onChange={(e) => setSelectedItemNo(e)}
        onInputChange={(inputValue, event) => {
          if (event.action === 'input-change') {
            setItemSearch(inputValue);
          } else if (event.action === 'menu-close') {
            setItemSearch('');
          }
        }}
      ></SoftSelect>
    </>
  );
  const paymentMethodSelect = (
    <>
      <SoftSelect
        placeholder="Select Payment Method"
        size="small"
        id="Item"
        options={[
          { value: 'CASH', label: 'Cash' },
          { value: 'CARD', label: 'Card' },
          { value: 'UPI', label: 'UPI' },
          { value: 'SPLIT', label: 'Split' },
          { value: 'SODEXO', label: 'Sodexo' },
        ]}
        classNamePrefix="soft-select"
        menuPortalTarget={document.body}
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e)}
        isClearable={true}
      ></SoftSelect>
    </>
  );
  const paymentModeSelect = (
    <>
      <SoftSelect
        placeholder="Select Payment Mode"
        size="small"
        id="Item"
        options={[
          { value: 'ONLINE', label: 'Online' },
          { value: 'OFFLINE', label: 'Offline' },
          { value: 'COD', label: 'Cash on Delivery' },
        ]}
        classNamePrefix="soft-select"
        menuPortalTarget={document.body}
        onChange={(e) => setPaymentMode(e)}
        value={paymentMode}
        isClearable={true}
      ></SoftSelect>
    </>
  );
  const orderTypeSelect = (
    <>
      <SoftSelect
        placeholder="Select order type"
        size="small"
        id="Item"
        options={[
          { value: 'POS_ORDER', label: 'POS Order' },
          { value: 'B2C_ORDER', label: 'B2C Order' },
          { value: 'SALES_ORDER', label: 'Sales Order' },
        ]}
        classNamePrefix="soft-select"
        menuPortalTarget={document.body}
        onChange={(e) => setOrderType(e)}
        value={orderType}
        isClearable={true}
      ></SoftSelect>
    </>
  );

  let selectBoxArray = [];
  if (reportId === 'Sales by Product' || reportId === 'Item wise sales report') {
    selectBoxArray.push(itemSelect);
  } else if (reportId === 'Sales by Payment method') {
    selectBoxArray = [paymentMethodSelect, paymentModeSelect, orderTypeSelect];
  }

  const fetchProducts = debounce(async (searchText) => {
    const isNumber = !isNaN(+itemSearch);
    const payload = {
      page: 1,
      pageSize: '10',
      // names: [itemSearch],
      productStatuses: ['CREATED'],
      supportedStore: [locId],
    };

    if (itemSearch !== '') {
      if (isNumber) {
        payload.gtin = [itemSearch];
        payload.names = [];
      } else {
        payload.gtin = [];
        payload.names = [itemSearch];
      }
    } else {
      payload.gtin = [];
      payload.names = [];
    }

    try {
      const response = await getItemsInfo(payload);
      if (response?.data?.data?.code === 'ECONNRESET') {
        if (retryCount < 3) {
          fetchProducts(searchText);
          retryCount++;
        } else {
          console.error('Some Error Occurred, Try again');
        }
      } else if (response?.data?.status === 'SUCCESS') {
        const products = response?.data?.data?.products || [];
        const options = products?.map((item) => ({
          value: item?.gtin,
          label: `(${item?.name}) ${item.gtin}`,
        }));
        setItemOptions(options);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, 300);

  useEffect(() => {
    fetchProducts(itemSearch);

    return () => {
      fetchProducts.cancel();
    };
  }, [itemSearch]);

  const handleFetchBigQueryReportType = (reportType) => {
    const reportsList = {
      'Item wise sales report': 'ITEMS_WISE_SALES_REPORT',
      'Daily profit report': 'DAILY_PROFIT_REPORT',
      'Sales Over Time': 'SOT',
      'Sales by Product': 'ITEM_WISE_REPORT',
      'Sales by Payment method': 'SALES_REPORT',
      'Profit and loss report': 'PNL_REPORT',
      'Day wise Business report': 'DAY_WISE_BUSINESS_REPORT',
      'HSN wise sales report': 'HSN_WISE_SALES_REPORT',
      'Daily profit report': 'DAILY_PROFIT_REPORT',
      'Sales GST registration report': 'SALES_GST_REGISTRATION_REPORT',
    };

    return reportsList[reportType] || '';
  };

  useEffect(() => {
    const fetchReportAvailability = () => {
      const payload = {
        locationId: locId,
        reportType: handleFetchBigQueryReportType(reportId),
      };

      const dateTimeFormatter = (dateString) => {
        return moment(dateString).format('DD MMM, YYYY HH:mm:ss');
      };
      reportAvailabilityCheck(payload)
        .then((res) => {
          const results = res?.data?.data;
          const data = results?.map((item) => ({
            docId: item?.docId || '',
            status: item?.status || '---',
            reportStartDate: item?.reportStartDate || '---',
            reportEndDate: item?.reportEndDate || '---',
            createdOn: item?.createdOn ? dateTimeFormatter(item?.createdOn) : '---',
            docUrl: item?.docUrl || '',
            documentName: item?.documentName,
            createdBy: item?.createdBy,
          }));
          setReportAvailabilityData(data);
        })
        .catch(() => {});
    };

    fetchReportAvailability();

    const interval = setInterval(fetchReportAvailability, 30000);
    return () => clearInterval(interval);
  }, [loader]);

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  const handleNavigae = (row) => {
    handleProductNavigation(row);
  };

  useEffect(() => {
    const payload = {
      uidx: object.uidx,
    };
    getAllUserOrgs(payload).then((response) => {
      setVmsData(response.data.data.VMS);
      if (response.data.data.WMS.length) {
        getWarehouseLocations(response?.data?.data?.WMS).then((res) => {
          setWarehouseData(res?.data?.data?.data?.orgAndLocDetailList);
          res?.data?.data?.data?.orgAndLocDetailList.forEach((warehouse) => {
            if (warehouse?.warehouseLocDetailList.length === 0) {
              // handleClick(warehouse?.orgBusinessName);
            }
          });
        });
      }

      const payload = {
        retailIds: response?.data?.data?.RETAIL,
      };
      getRetailnames_location(payload)
        .then((res) => {
          setRetail(res?.data?.data?.retails);
          res?.data?.data?.retails?.forEach((retail) => {
            if (retail?.branches?.length === 0) {
              // handleClick(res?.data?.data?.retails[0].displayName);
            }
          });
        })
        .catch((err) => {
          setLoading(false);
        });
    });
  }, []);

  const onPrint = () => {
    window.print();
  };

  const onExport = () => {
    setLoader(true);
    if (reportId === 'Sales by Product') {
      handleProfitExport();
    } else if (reportId === 'Sales Over Time') {
      handleSalesOverTime();
    } else if (reportId === 'Sales by Payment method') {
      handleSalesPaymentMethodExport();
    } else if (reportId === 'Profit and loss report') {
      handleSalesProfitExport();
    } else {
      handleSalesBigQueryReports(reportId);
    }
  };

  const handleSalesOverTime = async () => {
    const payload = {
      startDate: fromdate,
      endDate: todate,
      locationId: locId,
      orgId: orgId,
      reportType: 'SOT',
      exportType: 'excel',
      createdBy: user_name,
    };
    exportSalesOverTime(payload)
      .then((res) => {
        setLoader(false);
        if (res?.data?.data?.docUrl) {
          window.open(res?.data?.data?.docUrl, '_self');
        }
        showSnackbar('Report is beign generated', 'success');

        handleClose();
      })
      .catch(() => {
        setLoader(false);
        showSnackbar('Report generation failed', 'error');
        handleClose();
      });
  };
  const handleProfitExport = async () => {
    if (itemNo) {
      handleSalesBySelectedProduct();
      return;
    }
    const payload = {
      startDate: fromdate,
      endDate: todate,
      locationId: locId,
      orgId: orgId,
      frequency: 'day',
      reportType: 'ITEM_WISE_REPORT',
      exportType: 'excel',
      createdBy: user_name,
    };

    exportItemWiseReport(payload)
      .then((res) => {
        setLoader(false);
        const docUrl = res?.data?.data?.docUrl;
        if (docUrl) {
          window.open(docUrl, '_blank');
        } else {
          showSnackBar('Report is being generated', 'success');
        }
        handleClose();
      })
      .catch((error) => {
        setLoader(false);
        showSnackbar('Report generation failed', 'error');
        handleClose();
      });
  };

  const handleSalesBySelectedProduct = () => {
    const payload = {
      startDate: fromdate,
      endDate: todate,
      locationId: locId,
      orgId: orgId,
      frequency: 'day',
      reportType: 'ITEM_WISE_REPORT',
      exportType: 'excel',
      createdBy: user_name,
      gtins: itemNo?.map((item) => item?.value) || [],
    };

    exportSelectedItemWiseReport(payload)
      .then((res) => {
        const docUrl = res?.data?.data?.docUrl;
        if (docUrl) {
          window.open(docUrl, '_blank');
        }
        setLoader(false);
        handleClose();
        showSnackbar('Report is Generated', 'success');
      })
      .catch((err) => {
        setLoader(false);
        handleClose();
        showSnackbar('Report generation failed', 'error');
      });
  };

  // const handleFetch
  const handleSalesBigQueryReports = (reportType) => {
    if (!fromdate && !todate) {
      showSnackbar('Select date range to generate report', 'error');
      setLoader(false);
      return;
    }
    const payload = {
      startDate: fromdate,
      endDate: todate,
      locationId: locId,
      orgId: orgId,
      reportType: handleFetchBigQueryReportType(reportType),
      exportType: 'csv',
      createdBy: user_name,
    };
    if (reportId === 'Item wise sales report') {
      payload.gtins = itemNo?.map((item) => item?.value) || [];
    }
    exportBigQuerySalesReports(payload)
      .then((res) => {
        const docUrl = res?.data?.data?.docUrl;
        if (docUrl) {
          window.open(docUrl, '_blank');
        }
        setSelectedItemNo();
        setLoader(false);
        handleClose();
        showSnackbar('Report is being generated', 'success');
      })
      .catch((err) => {
        setLoader(false);
      });
  };
  const handleSalesProfitExport = () => {
    const payload = {
      startDate: fromdate,
      endDate: todate,
      locationId: locId,
      orgId: orgId,
      reportType: 'PNL_REPORT',
      exportType: 'excel',
      createdBy: user_name,
    };

    exportBigQuerySalesReports(payload)
      .then((res) => {
        const docUrl = res?.data?.data?.docUrl;
        if (docUrl) {
          window.open(docUrl, '_blank');
        }
        setLoader(false);
        handleClose();
        showSnackbar('Report is being generated', 'success');
      })
      .catch((err) => {
        setLoader(false);
        handleClose();
        showSnackbar('Report generation failed', 'error');
      });
  };

  const handleSalesPaymentMethodExport = () => {
    const payload = {
      startDate: fromdate,
      endDate: todate,
      locationId: locId,
      orgId: orgId,
      frequency: 'day',
      reportType: 'SALES_REPORT',
      exportType: 'excel',
      createdBy: user_name,
    };
    if (paymentMethod?.value) {
      payload.paymentMethod = paymentMethod?.value;
    }
    if (paymentMode?.value) {
      payload.paymentMode = paymentMode?.value;
    }
    if (orderType?.value) {
      payload.orderType = orderType?.value;
    }
    exportBigQuerySalesReports(payload)
      .then((res) => {
        const docUrl = res?.data?.data?.docUrl;
        if (docUrl) {
          window.open(docUrl, '_blank');
        }
        setLoader(false);
        handleClose();
        showSnackbar('Report is being generated', 'success');
      })
      .catch((err) => {
        setLoader(false);
        handleClose();
        showSnackbar('Report generation failed', 'error');
      });
  };
  const onSave = () => {
    window.print();
  };

  const transformedOptions = retail?.map((retail) => ({
    value: retail?.branches?.map((branch) => branch.displayName),
    label: retail?.branches.map((branch) => branch.displayName),
  }));

  // const ItemSelect = <></>
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      {open && (
        <CreateNewReportModal
          open={open}
          handleClose={handleClose}
          loader={loader}
          setFromdate={setFromdate}
          setTodate={setTodate}
          onExport={onExport}
          selectBoxArray={selectBoxArray}
        />
      )}
      <Container fixed>
        <div className="reportHeader">
          <SoftTypography variant="h6" color="white">
            {' '}
            <strong> {reportId ? reportId : 'Sales over time'} </strong>
          </SoftTypography>
          <SoftButton size="small" onClick={handleOpen}>
            + Create new report
          </SoftButton>
        </div>
        <SoftBox>
          <p style={{ fontSize: '0.7rem', margin: '5px 3px', color: 'dimgray', display: 'flex', alignItems: 'center' }}>
            <InfoOutlinedIcon style={{ marginRight: '8px', color: 'info' }} /> Data will be fetched every 30 seconds
          </p>
          <Box style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
            <DataGrid
              sx={{
                ...dataGridStyles.header,
                borderRadius: '20px',
              }}
              rows={reportAvailabilityData || []}
              columns={reportAvailabilityColumns}
              pageSize={10}
              pagination
              disableSelectionOnClick
              getRowId={(row) => row.docId}
              className="data-grid-table-boxo"
              // onRowClick={(row) => handleNavigae(row?.id)}
            />
          </Box>
        </SoftBox>
      </Container>
    </DashboardLayout>
  );
};

export default SalesReportchart;
