import { Box, CircularProgress, Menu, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SoftBox from '../../../../../../components/SoftBox';
import Spinner from '../../../../../../components/Spinner';
import { getAllrepackingProduct } from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { dateFormatter, isSmallScreen, productIdByBarcode } from '../../../../Common/CommonFunction';
import RepackingMobileCard from './mobile-card';
import NoDataFoundMob from '../../../../Common/mobile-new-ui-components/no-data-found';
import MobileFilterComponent from '../../../../Common/mobile-new-ui-components/mobile-filter';
import ViewMore from '../../../../Common/mobile-new-ui-components/view-more';

const RepackingTable = () => {
  const showSnackbar = useSnackbar();
  const [openMenus, setOpenMenus] = useState({});

  const handleClick = (event, id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleClose = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: null }));
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Repacking ID',
      minWidth: 100,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'primaryGtin',
      headerName: 'Primary GTIN',
      minWidth: 170,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'createdOn',
      headerName: 'Created On',
      minWidth: 130,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'batchNo',
      headerName: 'Batch Number',
      minWidth: 150,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      renderCell: (params) => {
        const batchesList = params?.row?.batches;
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e, params?.row?.id);
            }}
            style={{ cursor: 'pointer' }}
          >
            {batchesList?.length > 0 ? (
              <>
                {batchesList[0]}
                {batchesList?.length > 1 && (
                  <span style={{ color: '#0860E6', fontWeight: 'bold' }}> + {batchesList?.length - 1} more </span>
                )}
              </>
            ) : (
              <>{params?.row?.batchNo}</>
            )}
            <Menu
              id="basic-menu"
              anchorEl={openMenus[params?.row?.id]}
              open={Boolean(openMenus[params?.row?.id])}
              onClose={() => handleClose(params?.row?.id)}
            >
              {batchesList
                ?.map((batch, index) => (
                  <MenuItem key={index} onClick={() => handleClose(params?.row?.id)}>
                    {batch}
                  </MenuItem>
                ))
                ?.filter((_, index) => index > 0)}
            </Menu>
          </div>
        );
      },
    },
    {
      field: 'quantityConsume',
      headerName: 'Quantity Consumed',
      minWidth: 120,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'wastage',
      headerName: 'Wastage',
      minWidth: 120,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'reason',
      headerName: 'Wastage Reason',
      minWidth: 120,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
  ];

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const isMobileDevice = isSmallScreen();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [errorComing, setErrorComing] = useState(false);
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    totalResults: 0,
    totalPages: 0,
    page: 1,
    pageSize: 8,
  });
  const [showViewMore, setShowViewMore] = useState(true);

  // Update page based on the URL when component mounts
  useEffect(() => {
    const pageQueryParam = searchParams.get('page');
    if (pageQueryParam && pageQueryParam !== pageState.page) {
      // Only update pageState if the pageQueryParam is different from the current state
      setPageState((prev) => ({ ...prev, page: Number(pageQueryParam) }));
    } else if (!pageQueryParam) {
      // If there's no page param in the URL, set it to 1
      const updatedSearchParams = new URLSearchParams(searchParams);
      updatedSearchParams.set('page', 1); // Always set page=1 in the URL
      setSearchParams(updatedSearchParams);
    }
  }, [searchParams, pageState.page]);

  const handlePageNumber = (pageNo) => {
    setPageState((prev) => ({ ...prev, page: pageNo }));

    // Create a new instance of searchParams to modify both values
    const updatedSearchParams = new URLSearchParams(searchParams);

    // Always add the page parameter, even if it's 1
    updatedSearchParams.set('page', pageNo);

    // Update the URL with parameters
    setSearchParams(updatedSearchParams);
  };

  const fetchRepackingProducts = async () => {
    try {
      setLoader(true);
      setPageState((prev) => ({ ...prev, loader: true }));

      const res = await getAllrepackingProduct(locId, orgId, pageState.page, pageState.pageSize);
      setLoader(false);

      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message, 'error');
        setInfiniteLoader(false);
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: [],
        }));
        setErrorComing(true);
        return;
      }

      const arr = [];
      const response = res?.data?.data?.data;

      if (response?.data?.length > 0) {
        arr.push(
          response?.data?.map((row) => ({
            id: row?.repackingId ? row?.repackingId : '---',
            primaryGtin: row?.primaryGtin ? row?.primaryGtin : '---',
            createdOn: row?.createdOn ? dateFormatter(row?.createdOn) : '---',
            batches: row?.batches,
            batchNo: row?.batchNo ? row?.batchNo : 'NA',
            quantityConsume: row?.totalQuantityConsumed ? row?.totalQuantityConsumed.toFixed(3) : 'NA',
            wastage: row?.wastage ? row?.wastage.toFixed(3) : 0,
            reason: row?.reason ? row?.reason : 'NA',
          })),
        );
        setErrorComing(false);

        const showViewMoreButton = Number(pageState?.page) < res?.data?.data?.data?.totalPageNumber;
        setShowViewMore(showViewMoreButton);
      }

      if (isMobileDevice) {
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: [...old.datRows, ...(Array.isArray(arr[0]) ? arr[0] : [])],
          totalPages: res?.data?.data?.data?.totalPageNumber || 0,
          totalResults: res?.data?.data?.data?.totalResults || 0,
        }));
      } else {
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: Array.isArray(arr[0]) ? arr[0] : [],
          totalPages: res?.data?.data?.data?.totalPageNumber || 0,
          totalResults: res?.data?.data?.data?.totalResults || 0,
        }));
      }
      setInfiniteLoader(false);
    } catch (err) {
      setLoader(false);
      showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
      setPageState((prev) => ({ ...prev, datRows: [], totalPages: 0, totalResults: 0, loader: false }));
      setInfiniteLoader(false);
    }
  };

  useEffect(() => {
    if (!pageState.loader) {
      fetchRepackingProducts();
    }
  }, [pageState.page]);

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      } else {
        showSnackbar('Product Not Found', 'error');
      }
    } catch (error) {
      showSnackbar('Product Not Found', 'error');
      setIsFetching(false);
    }
  };

  return (
    <SoftBox>
      {!isMobileDevice ? (
        <>
          <Box
            className="dat-grid-table-box"
            style={{ height: isMobileDevice ? '70vh' : 525, width: '100%' }}
            sx={{
              '& .super-app.Open': {
                color: 'orange',
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
              '& .super-app.Complete': {
                color: 'green',
                fontSize: '0.7em',
                fontWeight: '600',
                margin: '0px auto 0px auto',
                padding: '5px',
              },
            }}
          >
            {loader ? (
              <Box className="content-center centerspinnerI">
                <Spinner />
              </Box>
            ) : (
              <DataGrid
                rows={pageState?.datRows}
                columns={columns}
                className="data-grid-table-boxo"
                pagination
                page={pageState?.page - 1}
                pageSize={pageState?.pageSize}
                rowCount={pageState?.totalResults}
                paginationMode="server"
                onPageChange={(newPage) => {
                  handlePageNumber(newPage + 1);
                }}
                onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                getRowId={(row) => row?.id}
                disableSelectionOnClick
                onCellDoubleClick={(rows) => handleProductNavigation(rows?.row?.primaryGtin)}
                sx={{
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px',
                  cursor: 'pointer',
                }}
              />
            )}
          </Box>
        </>
      ) : (
        <>
          <div>
            <MobileFilterComponent createButtonTitle={'Repacking'} />
          </div>
          <div className="ros-app-purchase-component-main-div">
            <div className="pi-listing-card-main-div" style={{ marginTop: '10px' }}>
              {isMobileDevice &&
                pageState?.datRows?.length > 0 &&
                pageState?.datRows?.map((data) => <RepackingMobileCard data={data} key={data?.id} />)}

              {showViewMore && (
                <ViewMore
                  loading={infiniteLoader}
                  handleNextFunction={() => {
                    if (
                      !pageState?.loader && // Ensure no API is in progress
                      Number(pageState?.page) < pageState?.totalPages && // Only if more pages are available
                      isMobileDevice // Only if it's a mobile device
                    ) {
                      setInfiniteLoader(true);
                      handlePageNumber(Number(pageState?.page) + 1); // Fetch next page
                    }
                  }}
                />
              )}

              {isMobileDevice && ((pageState?.datRows?.length === 0 && !pageState.loader) || errorComing) && (
                <SoftBox className="src-imgg-data width-100">
                  <NoDataFoundMob />
                </SoftBox>
              )}

              {infiniteLoader && (
                <SoftBox className="infinite-loader content-center width-100">
                  <CircularProgress size={30} color="info" />
                </SoftBox>
              )}
            </div>
          </div>
        </>
      )}
    </SoftBox>
  );
};

export default RepackingTable;
