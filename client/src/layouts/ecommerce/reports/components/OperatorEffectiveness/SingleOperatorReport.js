import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Chip, Container, Drawer, List, ListItem, ListItemText, Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { getAllOperatorsByOrgId, getOperatorEffectiveReportByEventType } from '../../../../../config/Services';
import { isSmallScreen } from '../../../Common/CommonFunction';
import { useParams } from 'react-router-dom';
import CartDeleted from './components/CartDeleted';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import DatepickerReport from '../Datepickerreport';
import FaceIcon from '@mui/icons-material/Face';
import LoyaltyAwarded from './components/LoyaltyAwarded';
import MobileNavbar from '../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import Order from './components/Order';
import OrderMetrics from './components/OrderMetrics';
import PaymentModeChange from './components/PaymentModeChange';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';

const SingleOperatorReport = () => {
  const { id } = useParams();

  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 8,
  });


  const formatName = (name) => {
    const newName = name.replaceAll('_', ' ');
    return newName;
  };

  const [fromdate, setFromdate] = useState('');
  const [todate, setTodate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [cashierData, setCashierData] = useState([]);

  const [openOperator, setOpenOperator] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedOperatorVal, setSelectedOperatorVal] = useState('');
  const [openDate, setOpenDate] = useState(false);

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const getAllOperators = async () => {
    const orgId = localStorage.getItem('orgId');

    try {
      const res = await getAllOperatorsByOrgId(orgId);
      const data = res?.data?.data
        .filter((item) => item?.roles.includes('POS_USER'))
        .map(({ firstName, uidx }) => ({ label: firstName, value: uidx }));
      setCashierData(data);
    } catch (error) {}
  };

  useEffect(() => {
    getAllOperators();
  }, []);

  let dataArr; 

  const getData = () => {
    const payload = {
      pageNumber: pageState.page - 1,
      pageSize: pageState.pageSize,
      organizationIds: [orgId],
      locationIds: [locId],
      eventTypes: [id],
      uids: selectedOperatorVal ? [selectedOperatorVal] : null,
      startDate: fromdate,
      endDate: todate,
    };

    getOperatorEffectiveReportByEventType(payload).then((res) => {
      dataArr = res?.data?.events;
      setReportData(res?.data?.events);

      setPageState((old) => ({
        ...old,
        loader: false,
        datRows: dataArr || [],
        total: res?.data?.totalResults || 0,
      }));
    });
  };

  useEffect(() => {
    getData();
  }, [pageState.page, selectedOperatorVal, fromdate, todate]);

  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setOpenOperator(false);
    setOpenDate(false);
  };

  const anchor = 'bottom';

  const isMobileDevice = isSmallScreen();

  return (
    <div>
      <DashboardLayout isMobileDevice={isMobileDevice}>
        {!isMobileDevice && <DashboardNavbar prevLink={true} />}
        {isMobileDevice && (
          <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
            <MobileNavbar title={formatName(id)} prevLink={true} />
          </SoftBox>
        )}
        <Container fixed sx={{ paddingLeft: '0 !important', paddingRight: '0 !important', paddingBottom: '15px ' }}>
          <Box className="search-bar-filter-and-table-container">
            {!isMobileDevice && (
              <SoftBox className="search-bar-filter-container">
                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <SoftTypography sx={{ color: '#ffffff', fontSize: '16px' }}>{id === 'ORDER_METRICS' ? 'Manual Search Products' : formatName(id)}</SoftTypography>

                  {id !== 'ORDER_METRICS' && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                    <SoftSelect
                      placeholder="Select Operator"
                      insideHeader={true}
                      options={[{ label: 'All', value: '' }, ...cashierData]}
                      onChange={(option) => {
                        setSelectedOperator(option.label), setSelectedOperatorVal(option.value);
                      }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatepickerReport setFromdate={setFromdate} setTodate={setTodate} />
                    </LocalizationProvider>
                  </Box>}
                </Box>
              </SoftBox>
            )}
            {isMobileDevice && id !== 'ORDER_METRICS' && (
              <SoftBox className="mob-res-filter-box">
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={selectedOperator ? selectedOperator : 'Select Operator'}
                    onClick={() => setOpenOperator(true)}
                    icon={<FaceIcon />}
                    variant="outlined"
                  />
                  <Chip
                    label="Select Date Range"
                    onClick={() => setOpenDate(true)}
                    icon={<FaceIcon />}
                    variant="outlined"
                  />
                </Stack>
                <Drawer
                  anchor={anchor}
                  open={openOperator}
                  onClose={toggleDrawer()}
                  PaperProps={{
                    sx: {
                      width: '90%',
                      height: 'fit-content',
                    },
                  }}
                >
                  <Box
                    role="presentation"
                    onClick={toggleDrawer()}
                    onKeyDown={toggleDrawer()}
                    className="mob-res-filter-drawer-box"
                  >
                    <List>
                      {[{ label: 'All', value: '' }, ...cashierData].map((item) => (
                        <ListItem
                          key={item.label}
                          onClick={() => {
                            setSelectedOperator(item.label), setSelectedOperatorVal(item.value);
                          }}
                        >
                          <ListItemText primary={item.label} />
                          <hr />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Drawer>
                <Drawer
                  anchor={anchor}
                  open={openDate}
                  onClose={toggleDrawer()}
                  PaperProps={{
                    sx: {
                      width: '90%',
                      height: 'fit-content',
                    },
                  }}
                >
                  <Box role="presentation" className="mob-res-filter-drawer-box">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatepickerReport setFromdate={setFromdate} setTodate={setTodate} />
                    </LocalizationProvider>
                  </Box>
                </Drawer>
              </SoftBox>
            )}

            {pageState.loading && <Spinner />}
            {!pageState.loading && (
              <Box sx={{ padding: '15px' }}>
                {id === 'CART_DELETED' || id === 'CART_HOLD' || id === 'CART_ITEM_REMOVED' ? (
                  <CartDeleted id={id} pageState={pageState} setPageState={setPageState} />
                ) : id === 'ORDER_EDITED' || id === 'ORDER_RECEIPT_REPRINT' ? (
                  <Order id={id} pageState={pageState} setPageState={setPageState} />
                ) : id === 'LOYALTY_AWARDED' ? (
                  <LoyaltyAwarded pageState={pageState} setPageState={setPageState} id={id} />
                ) : id === 'PAYMENT_MODE_CHANGE' ? (
                  <PaymentModeChange pageState={pageState} setPageState={setPageState} id={id} />
                ) : id === 'ORDER_METRICS' ? (
                  <OrderMetrics />
                ) : null}
              </Box>
            )}
          </Box>
        </Container>
      </DashboardLayout>
    </div>
  );
};

export default SingleOperatorReport;
