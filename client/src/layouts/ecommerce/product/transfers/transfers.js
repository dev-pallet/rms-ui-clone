import { ClearSoftInput, dateFormatter, isSmallScreen, noDatagif } from '../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { allStockTransfer } from '../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import CommonSearchBar from '../../Common/MobileSearchBar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Filter from '../../Common/Filter';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';
import Status from '../../Common/Status';
import TransferOutCard from './components/Transferout-mobile-card';

export const Transfers = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const isMobileDevice = isSmallScreen();
  const [dataRows, setTableRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const [errorComing, setErrorComing] = useState(false);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const newTransferType = localStorage.getItem('Transfer_Type');
  const [transferType, setTransferType] = useState(localStorage.getItem('Transfer_Type') || 'Transfer Out');
  const [tabs, setTabs] = useState({
    tab1: transferType === 'Transfer Out' ? true : false,
    tab2: transferType === 'Transfer In' ? true : false,
  });
  const [currentTab, setCurrentTab] = useState('');

  const [searchNumber, setSearchNumber] = useState('');
  const handleSearchFliter = (e) => {
    const orderName = e.target.value;
    if (orderName?.length === 0) {
      setSearchNumber('');
    } else {
      setSearchNumber(e.target.value);
    }
  };

  // clear search input fn
  const handleClearSearchInput = () => {
    setSearchNumber('');
  };

  const columns = [
    {
      field: 'id',
      headerName: 'STN No',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 180,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'origin',
      headerName: 'Origin',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'destination',
      headerName: 'Destination',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'transferValue',
      headerName: 'Transfer Value',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 180,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  const filterObject = {
    searchInput: searchNumber,
    sourceOrgId: [orgId],
    // status: ['string'],
    // stnNumber: ['string'],
    // createdBy: ['string'],
    // destinationLocId: ['string'],
    // from: '2023-11-21',
    // to: '2023-11-21',
  };
  if (transferType !== '') {
    if (transferType === 'Transfer In') {
      filterObject.destinationLocId = [locId];
    } else if (transferType === 'Transfer Out') {
      filterObject.sourceLocId = [locId];
    }
  } else {
    filterObject.sourceLocId = [locId];
  }
  let dataArr,
    dataRow = [];

  useEffect(() => {
    setLoader(true);
    listAllStock();
  }, [searchNumber, transferType]);

  const listAllStock = () => {
    allStockTransfer(filterObject)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          dataArr = res?.data?.data?.expressPurchaseOrderList;
          dataRow.push(
            dataArr?.map((row) => ({
              id: row?.stnNumber ? row?.stnNumber : '-----',
              origin: row?.sourceLocationId ? row?.sourceLocationId : '-----',
              destination: row?.destinationLocationId ? row?.destinationLocationId : '-----',
              date: row?.createdOn ? dateFormatter(row?.createdOn) : '-----',
              transferValue: row?.grossAmount ? row?.grossAmount : '-----',
              status: row?.status ? row?.status : '-----',
            })),
          );
          setTableRows(dataRow[0]);
          setLoader(false);
          showSnackbar('Success', 'success');
          setErrorComing(false);
        } else if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
          setLoader(false);
          setErrorComing(true);
        }
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
        setErrorComing(true);
      });
  };
  const handleNew = () => {
    setErrorComing(true);
    navigate('/products/new-transfers');
  };

  const handleTransfer = (event) => {
    const transferType = event.value;
    setTransferType(transferType);
    localStorage.setItem('Transfer_Type', event.value);
  };

  // Transfer Out / Transfer In, tabs Select Function
  const handleTabClick = (tab) => {
    setTabs((prev) => ({ ...prev, [tab]: true }));
    Object.keys(tabs)
      .filter((key) => key !== tab)
      .forEach((key) => {
        setTabs((prev) => ({ ...prev, [key]: false }));
      });
    if (tab === 'tab1') {
      setCurrentTab('TransferOUT');
      setTransferType('Transfer Out');
      localStorage.setItem('Transfer_Type', 'Transfer Out');
    } else if (tab === 'tab2') {
      setCurrentTab('TransferIN');
      setTransferType('Transfer In');
      localStorage.setItem('Transfer_Type', 'Transfer In');
    }
  };

  // filters

  // const transferTypeSelect = (
  //   <>
  //     <SoftBox>
  //       <SoftSelect
  //         placeholder={
  //           newTransferType === 'Transfer Out'
  //             ? 'Transfer Out'
  //             : newTransferType === 'Transfer In'
  //             ? 'Transfer In'
  //             : 'Transfer Out'
  //         }
  //         options={[
  //           { value: 'Transfer Out', label: 'Transfer Out' },
  //           { value: 'Transfer In', label: 'Transfer In' },
  //         ]}
  //         onChange={handleTransfer}
  //       />
  //     </SoftBox>
  //   </>
  // );

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [];

  // fn to clear the stock transfers filter
  const handleClearStockTransfersFilter = () => {
    localStorage.getItem('Transfer_Type') || 'Transfer Out';
    setLoader(true);
    listAllStock();
  };

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      {isMobileDevice && (
        <SoftBox
          className="new-search-header po-box-shadow"
          sx={{ flexDirection: 'column', height: '125px !important' }}
        >
          <MobileNavbar title={'Stock Transfers'} />
          <SoftBox style={{ display: 'flex' }}>
            <SoftTypography
              className={tabs.tab1 ? 'filter-div-tag' : 'filter-div-paid'}
              varient="h6"
              // onClick={() => changesTab(true, false)}
              onClick={() => handleTabClick('tab1')}
              sx={{ color: '#ffffff', borderBottomColor: 'rgb(0,100,254)', cursor: 'pointer' }}
            >
              Transfer Out
            </SoftTypography>
            <SoftTypography
              className={tabs.tab2 ? 'filter-div-tag mange' : 'filter-div-paid'}
              varient="h6"
              // onClick={() => changesTab(false, true)}
              onClick={() => handleTabClick('tab2')}
              sx={{
                color: '#ffffff',
                borderBottomColor: 'rgb(0,100,254)',
                marginLeft: '2rem',
                width: '100px',
                cursor: 'pointer',
              }}
            >
              Transfer In
            </SoftTypography>
          </SoftBox>
          <CommonSearchBar
            searchFunction={handleSearchFliter}
            handleNewBtnFunction={handleNew}
            placeholder="Search..."
          />
        </SoftBox>
      )}
      {!isMobileDevice ? (
        <Box
          // className="table-css-fix-box-scroll-vend"
          className="search-bar-filter-and-table-container"
        >
          <SoftBox className="search-bar-filter-container">
            {/* tabs - transfer in / transfer out -----> */}
            <SoftBox style={{ display: 'flex' }}>
              <SoftTypography
                className={tabs.tab1 ? 'filter-div-tag' : 'filter-div-paid'}
                varient="h6"
                // onClick={() => changesTab(true, false)}
                onClick={() => handleTabClick('tab1')}
                sx={{ color: '#ffffff', borderBottomColor: 'rgb(0,100,254)', cursor: 'pointer' }}
              >
                Transfer Out
              </SoftTypography>
              <SoftTypography
                className={tabs.tab2 ? 'filter-div-tag mange' : 'filter-div-paid'}
                varient="h6"
                // onClick={() => changesTab(false, true)}
                onClick={() => handleTabClick('tab2')}
                sx={{
                  color: '#ffffff',
                  borderBottomColor: 'rgb(0,100,254)',
                  marginLeft: '2rem',
                  width: '100px',
                  cursor: 'pointer',
                }}
              >
                Transfer In
              </SoftTypography>
            </SoftBox>
            {/* <----- tabs - transfer in / transfer out */}

            <Grid
              container
              spacing={2}
              className="filter-product-list-cont"
              sx={{
                paddingTop: '16px ',
              }}
            >
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <SoftBox sx={{ position: 'relative' }}>
                  <SoftInput
                    className="filter-add-list-cont-bill-search"
                    value={searchNumber}
                    placeholder="Search"
                    icon={{ component: 'search', direction: 'left' }}
                    onChange={handleSearchFliter}
                  />
                  {searchNumber !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                </SoftBox>
              </Grid>
              <Grid item md={4} sm={4} xs={12} style={{ marginLeft: 'auto' }}>
                <SoftBox sx={{ display: 'flex', justifyContent: 'end !important', alignItems: 'center' }}>
                  <SoftButton onClick={handleNew} variant="solidWhiteBackground">
                    <AddIcon />
                    New
                  </SoftButton>
                  {/* filter  */}
                  <Filter
                  // selectBoxArray={selectBoxArray}
                  // handleClearFilter={handleClearStockTransfersFilter}
                  />
                </SoftBox>
              </Grid>
            </Grid>
            {/* <SoftBox className="filter-product-list-cont">
            <SoftBox className="filter-product-list-cont">
              <SoftInput
                className="filter-soft-input-box"
                placeholder="Search Purchases Order"
                onChange={handleSearchFliter}
                icon={{ component: 'search', direction: 'left' }}
              />
            </SoftBox>
          </SoftBox>
          <SoftBox sx={{ display: 'flex' }}>
            <SoftBox className="import-div" sx={{ padding: '0' }}>
              <SoftButton className="vendor-add-btn" onClick={handleNew} variant="insideHeader">
                <AddIcon />
                New
              </SoftButton>
            </SoftBox>
          </SoftBox> */}
          </SoftBox>
          <Box>
            <div
              style={{
                width: '100%',
              }}
            >
              <SoftBox
                py={0}
                px={0}
                style={{ height: 525, width: '100%' }}
                className="dat-grid-table-box"
                sx={{
                  '& .super-app.Approved': {
                    color: '#69e86d',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Reject': {
                    color: '#df5231',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Create': {
                    color: '#888dec',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Assign': {
                    color: 'purple',
                    fontSize: '0.7em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                }}
              >
                {errorComing ? (
                  <SoftBox className="No-data-text-box">
                    <SoftBox className="src-imgg-data">
                      <img className="src-dummy-img" src={noDatagif} />
                    </SoftBox>

                    <h3 className="no-data-text-I">NO DATA FOUND</h3>
                  </SoftBox>
                ) : (
                  <>
                    {loader ? (
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
                    ) : (
                      <DataGrid
                        rows={dataRows}
                        sx={{ cursor: 'pointer' }}
                        className="data-grid-table-boxo"
                        autoPageSize
                        pagination
                        disableSelectionOnClick
                        columns={columns}
                        getRowId={(row) => row.id}
                        onCellClick={(rows) => navigate(`/inventory/transfers/${rows.id}`)}
                      />
                    )}
                  </>
                )}
              </SoftBox>
              {/* )
            )} */}
            </div>
          </Box>
        </Box>
      ) : (
        <Box>
          {loader ? (
            <Spinner />
          ) : !errorComing ? (
            dataRows.map((product) => <TransferOutCard data={product} />)
          ) : (
            <SoftBox className="no-data-found">
              <SoftTypography fontSize="14px">No Data Found</SoftTypography>
            </SoftBox>
          )}
        </Box>
      )}
    </DashboardLayout>
  );
};
