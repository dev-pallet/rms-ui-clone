import './index.css';
import { CircularProgress, Grid } from '@mui/material';
import { ProductsTable } from './components/productstable';
import {
  changeReportStatus,
  getAllReports,
  getReportId,
  updateStockInventory,
} from '../../../../../../config/Services';
import { debounce } from 'lodash';
import { format, parseISO } from 'date-fns';
import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';

const formatDateFromISO = (date) => format(parseISO(date), 'dd-MM-yyyy');

export const StockDashBoard = () => {
  const { sessionId } = useParams();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState(1);
  const [rows, setRows] = useState([]);
  const [reportId, setReportId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isApprovingAll, setIsApprovingAll] = useState(false);
  const [isRejectingAll, setIsRejectingAll] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const user_details = localStorage.getItem('user_details');
  const { uidx } = user_details && JSON.parse(user_details);
  const PAGE_SIZE = 10;

  const { isLoading: isLoadingReportId } = useQuery({
    refetchOnWindowFocus: false,
    retry: 1,
    queryKey: ['reportId'],
    queryFn: () => getReportId({ sessionId, uidx }),
    onSuccess: (response) => {
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }
      setReportId(response?.data?.data?.data);
    },
    onError: (error) => {
      showSnackbar(error?.message || error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const {
    data: reportList,
    isLoading: isLoadingReportList,
    refetch: refetchReportList,
  } = useQuery({
    refetchOnWindowFocus: false,
    enabled: !!reportId,
    retry: 1,
    queryKey: ['jobList', pageNo, debouncedSearchTerm],
    queryFn: async () => {
      const payload = {
        pageNo: pageNo,
        pageSize: PAGE_SIZE,
        reportId: reportId,
        gtin: debouncedSearchTerm,
      };
      const response = await getAllReports(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        throw new Error(response?.data?.data?.message);
      }
      const rows = response?.data?.data?.data?.data.map((item) => {
        return {
          id: item?.itemId,
          barcode: item?.gtin,
          product_name: item?.itemName,
          exp: item?.stReportBatchList[0]?.expirationDate
            ? formatDateFromISO(item?.stReportBatchList[0]?.expirationDate)
            : 'N/A',
          inventory_count: item?.totalImsQuantity,
          stock_count: item?.totalUserCount || 0,
          verified: item?.productVerified === 'Y',
          approved: item?.productApproved === 'Y',
        };
      });
      setRows(rows);
      return response?.data?.data?.data;
    },
    onError: (error) => {
      showSnackbar(error?.message || error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const { mutate: changeReportStatusMutation, isLoading: isChangingReportStatus } = useMutation({
    mutationKey: 'changeReportStatus',
    mutationFn: (payload) => changeReportStatus(payload),
    onSuccess: (response) => {
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }
      showSnackbar('Report status updated successfully', 'success');
      refetchReportList();
    },
    onError: (error) => {
      showSnackbar(error?.message || error?.response?.data?.message || 'Some error occured', 'error');
    },
    onSettled: () => {
      setIsApprovingAll(false);
      setIsRejectingAll(false);
    },
  });

  const { mutate: updateStockInventoryMutation, isLoading: isUpdatingStockInventory } = useMutation({
    mutationKey: 'updateStockInventory',
    mutationFn: (payload) => updateStockInventory(payload),
    onSuccess: (response) => {
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }
      showSnackbar('Stock inventory updated successfully', 'success');
      navigate('/products/stock-taking');
    },
    onError: (error) => {
      showSnackbar(error?.message || error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const handleStatusChange = (status) => {
    const payload = { reportId };

    if (status === 'approveAll') {
      payload.state = 'Y';
      setIsApprovingAll(true);
    } else if (status === 'rejectAll') {
      payload.state = 'N';
      setIsRejectingAll(true);
    }

    changeReportStatusMutation(payload);
  };

  const handleUpdateInventory = () => {
    const payload = { reportId };
    updateStockInventoryMutation(payload);
  };

  const debounceSearch = useCallback(
    debounce((nextValue) => {
      setDebouncedSearchTerm(nextValue);
      setPageNo(1);
    }, 1000),
    [],
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={12} ld={12} xl={4} lg={3}>
            <StockTimeLine />
          </Grid>
          <Grid item xs={12} md={12} ld={12} xl={8} lg={9}>
            <DashBoardcard />
          </Grid> */}
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <ProductsTable
              rows={rows}
              reportList={reportList}
              isLoadingReportList={isLoadingReportList}
              pageNo={pageNo}
              setPageNo={setPageNo}
              pageSize={PAGE_SIZE}
              searchText={searchText}
              setSearchText={setSearchText}
              debounceSearch={debounceSearch}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12} display={'flex'} justifyContent={'space-between'} gap={2}>
            <div className="stock-dashboard-button-container">
              <SoftButton
                color="primary"
                startIcon={<DoneAllIcon />}
                disabled={isChangingReportStatus}
                onClick={() => handleStatusChange('approveAll')}
              >
                {isApprovingAll ? <CircularProgress size={20} color="inherit" /> : 'APPROVE ALL'}
              </SoftButton>
              <SoftButton
                color="error"
                startIcon={<CloseIcon />}
                disabled={isChangingReportStatus}
                onClick={() => handleStatusChange('rejectAll')}
              >
                {isRejectingAll ? <CircularProgress size={20} color="inherit" /> : 'REJECT ALL'}
              </SoftButton>
            </div>
            <div>
              <SoftButton color="primary" onClick={handleUpdateInventory} disabled={isUpdatingStockInventory}>
                {isUpdatingStockInventory ? <CircularProgress size={20} color="inherit" /> : 'UPDATE INVENTORY'}
              </SoftButton>
            </div>
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
};
