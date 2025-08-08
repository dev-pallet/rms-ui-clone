import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

// Soft UI Dashboard PRO React example components
import { useParams } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import GradientLineChart from 'examples/Charts/LineCharts/GradientLineChart';
import MuiAlert from '@mui/material/Alert';
import NorthIcon from '@mui/icons-material/North';
import Snackbar from '@mui/material/Snackbar';
import SouthIcon from '@mui/icons-material/South';
import StarRateOutlinedIcon from '@mui/icons-material/StarRateOutlined';
import Switch from '@mui/material/Switch';
import VerticalBarChart from 'examples/Charts/BarCharts/VerticalBarChart';
import WhereToVoteOutlinedIcon from '@mui/icons-material/WhereToVoteOutlined';
import WrongLocationOutlinedIcon from '@mui/icons-material/WrongLocationOutlined';

// ProductPage page components
import * as React from 'react';
import { useEffect, useState } from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import Spinner from 'components/Spinner/index';
// sweetalert2 components
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Swal from 'sweetalert2';

// style
import './product-detailspage.css';
import { Chip } from '@mui/material';
import {
  avgStockRatio,
  avgStockTurnover,
  getBatchIdOfferDetails,
  getProductDetails,
  productWiseTrend,
} from '../../../../../../config/Services';
import {
  expireDateChecker,
  isSmallScreen,
  withinSevenDaysChecker,
} from '../../../../Common/CommonFunction';
import {
  generateBarcodeWithNum,
  getInventoryDetails,
  getLatestInwarded,
  getPriceRevision,
  getPurchaseTrend,
} from 'config/Services';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import BatchPODetail from './poDetail';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import OfferPopup from './components/OfferPopup';
import ProductProfitCards from './productProfitCards';
import Status from '../../../../Common/Status';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import UpgradePlan from '../../../../../../UpgardePlan';
import clsx from 'clsx';
import moment from 'moment';

export const ProductDetails = () => {
  const featureSettings = JSON.parse(localStorage.getItem('featureSettings'));

  // console.log('featureSettings', featureSettings);

  const navigate = useNavigate();
  const editProductForm = () => {
    navigate('/product/edit-product/' + id);
  };

  const [notAvailable, setNotAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorHandler, setErrorHandler] = useState('');
  const [clrMsg, setClrMsg] = useState('');
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');
  const [purchaseToggle, setPurchaseToggle] = useState(false);
  const [salesToggle, setSalesToggle] = useState(false);
  const [salesSelect, setSalesSelect] = useState(null);
  const [purchaseSelect, setPurchaseSelect] = useState(null);
  const [purchaseData, setPurchaseData] = useState({
    price: [],
    volume: [],
  });
  const [label, setLabel] = useState([]);
  const [intervalOptions, setIntervalOptions] = useState([
    { value: '1_month', label: 'Last month' },
    { value: '3_months', label: 'Last 3 months' },
    { value: '6_months', label: 'Last 6 months' },
  ]);

  const { id } = useParams();
  const [datRows, setTableRows] = useState(() => {
    // const cachedData = sessionStorage.getItem('tableData');
    // return cachedData ? JSON.parse(cachedData) : null;
  });
  const [packagingType, setPackagingType] = useState('');
  const [lastSixmonths, setLastSixMonths] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [salesValues, setSalesValues] = useState([]);
  const [titalVal, setTitle] = useState('');
  const [avgStockTurnoverRatio, setAvgStockTurnoverRatio] = useState('0 days ');
  const [loader, setLoader] = useState(false);
  const [priceInfo, setPriceInfo] = useState(null);
  const [inwardedData, setInwardedData] = useState({});
  const [stockRatio, setStockRatio] = useState({});
  const [pricingDetail, setPricingDetail] = useState([]);
  const [barImage, setBarImage] = useState('');
  const [expiredChipCount, setExpiredChipCount] = useState('noExpiry');
  const [expiredName, setExpiredName] = useState('Expired');
  const [expiredCount, setExpiredCount] = useState({});
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    totalPages: 0,
    pageSize: 5,
  });

  //0ffer
  // const [offerPriceDetails,setOfferPriceDetails]
  const [openPOModal, setOpenPOModal] = useState(false);
  const [selectedPONum, setSelectedPONum] = useState('');
  const [selectedReqType, setSelectedReqType] = useState('');
  const [errorComing, setErrorComing] = useState(false);
  const [pageState2, setPageState2] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    totalPages: 0,
    pageSize: 5,
  });
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleSalesSelect = (selectedOption) => {
    setSalesSelect(selectedOption);
    //TODO: API call handling dates
  };

  const handlePurchaseSelect = (selectedOption) => {
    setPurchaseSelect(selectedOption);
    //TODO: API call handling dates
  };
  const createPurchaseData = (res) => {
    const currentMonth = Number(new Date(res?.toDate).toLocaleString('en-us', { month: 'numeric' })) + 1;

    const createMonthArray = (startMonth) => {
      const months = [
        { monthNo: 1, month: 'Jan', price: 0, volume: 0 },
        { monthNo: 2, month: 'Feb', price: 0, volume: 0 },
        { monthNo: 3, month: 'Mar', price: 0, volume: 0 },
        { monthNo: 4, month: 'Apr', price: 0, volume: 0 },
        { monthNo: 5, month: 'May', price: 0, volume: 0 },
        { monthNo: 6, month: 'Jun', price: 0, volume: 0 },
        { monthNo: 7, month: 'Jul', price: 0, volume: 0 },
        { monthNo: 8, month: 'Aug', price: 0, volume: 0 },
        { monthNo: 9, month: 'Sep', price: 0, volume: 0 },
        { monthNo: 10, month: 'Oct', price: 0, volume: 0 },
        { monthNo: 11, month: 'Nov', price: 0, volume: 0 },
        { monthNo: 12, month: 'Dec', price: 0, volume: 0 },
      ];

      const startMonthIndex = months?.findIndex((month) => month?.monthNo === (startMonth === 13 ? 1 : startMonth));

      const resultArray = [];
      for (let i = 0; i < 12; i++) {
        const monthIndex = (startMonthIndex + i) % 12;
        resultArray.push(months[monthIndex]);
      }

      return resultArray?.map((monthObj) => {
        const matchingMonth = res?.trendMonth.find((trendObj) => trendObj?.month === monthObj?.monthNo.toString());
        if (matchingMonth) {
          return {
            ...monthObj,
            volume: matchingMonth.volume,
            price: matchingMonth.price,
            year: matchingMonth.year,
          };
        }
        return monthObj;
      });
    };

    const monthArray = createMonthArray(currentMonth);

    const [months, prices, volumes] = monthArray?.reduce(
      (acc, { month, price, volume }) => {
        acc[0].push(month);
        acc[1].push(price);
        acc[2].push(volume);
        return acc;
      },
      [[], [], []],
    );

    setPurchaseData({
      price: prices,
      volume: volumes,
    });
    setLabel(months);
  };

  const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
      },
    }),
  );

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'batchNo',
      headerName: 'Batch',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'selling',
      headerName: 'Selling price',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'purchase',
      headerName: 'Purchase price',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'name',
      headerName: 'Revised By',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  const columns2 = [
    {
      field: 'inwardedOn',
      headerName: 'Inwarded Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'quantityUnits',
      headerName: 'Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'batchNo',
      headerName: 'Batch',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'availableUnits',
      headerName: 'Available Units',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 120,
      flex: 0.75,
      align: 'left',
      cellClassName: (params) => {
        if (params.value == 'SOLD') {
          return clsx('super-app', {
            Sold: params.value === 'SOLD',
          });
        }
        return params.value;
      },
      renderCell: (params) => {
        if (params.row.estimatedDays === null) {
          return (
            <div
            // style={{
            //   width: '120px',
            //   height: '25px',
            //   backgroundColor: '#F6F6F6',
            //   borderRadius: '5px',
            //   textAlign: 'center',
            //   border: '1px solid lightgreen',
            //   color: 'lightgreen',
            // }}
            >
              {/* {params.value} */}
              <Status label={params.value} />
            </div>
          );
        } else {
          return (
            <div
              style={{
                fontSize: '0.75rem',
                color: '#67748e',
                fontWeight: '500',
              }}
            >
              {params.value}
            </div>
          );
        }
      },
    },
    {
      field: 'stockTurnover',
      headerName: 'Stock turnover',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 250,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        if (params?.row?.estimatedDays !== null) {
          const title = ` ${params?.row?.estimatedDays} days left`;
          return (
            <LightTooltip title={title}>
              <div style={{ display: 'flex', width: '100%', gap: '15px' }}>
                <div style={{ width: '30%' }}>{params?.value}</div>
                <div
                // style={{
                //   width: '30%',
                //   height: '25px',
                //   backgroundColor: '#F6F6F6',
                //   borderRadius: '5px',
                //   textAlign: 'center',
                //   border: '1px solid #2f81ff',
                //   color: '#2f81ff',
                // }}
                >
                  <Status label={'ESTIMATED'} />
                </div>
              </div>
            </LightTooltip>
          );
        } else {
          return params.value;
        }
      },
    },
  ];

  //showing offer details functionality
  // const [isHovered,setIshovered] = useState(false)

  const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 'none',
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
        boxShadow: ' 3px 3px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'gold !important',
        fontWeight: '600',
      },
    }),
  );

  const handlePODetail = (requestNumber, requestNumberType) => {
    setOpenPOModal(true);
    setSelectedPONum(requestNumber);
    setSelectedReqType(requestNumberType);
  };

  const columns3 = [
    {
      field: 'batchId',
      headerName: 'Batch No',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 200,
      marginLeft: 20,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const isFirstRow = params.row.id === 0;
        const offerId = params.row.offerId;
        const offerName = params.row.offerName;
        const freebie = params.row.freebie;
        const pp = params.row.purchasePrice;
        let showLabel = true;
        const requestNumber = params.row.requestNumber;
        const requestNumberType = params.row.requestNumberType;
        const expiredDate = params?.row?.expiryDateApi;
        const isAboutToExpired = withinSevenDaysChecker(expiredDate);
        let iconColor = '';
        if (isAboutToExpired <= 0) {
          iconColor = 'error';
        } else if (isAboutToExpired <= 7) {
          iconColor = 'warning';
        } else {
          iconColor = 'success';
        }

        // console.log(offerName);
        if (
          typeof offerName === 'string' &&
          offerName !== undefined &&
          offerName.includes('Free Product') &&
          !freebie
        ) {
          showLabel = false;
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isFirstRow ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '5px',
                }}
              >
                <div style={{ marginRight: '15px' }}>
                  <CircleRoundedIcon
                    color={iconColor}
                    sx={{ width: '10px !important', height: '10px !important', top: '-5px' }}
                  />{' '}
                </div>

                <div style={{ marginLeft: '-12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LightTooltip title="Latest Batch">
                    <KeyboardDoubleArrowRightIcon color="info" fontSize="small" />
                  </LightTooltip>
                </div>
                <div
                  style={{
                    marginLeft: requestNumber ? '-2px' : '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                  }}
                >
                  {requestNumber && (
                    <InfoOutlinedIcon
                      color="info"
                      fontSize="small"
                      onClick={() => handlePODetail(requestNumber, requestNumberType)}
                    />
                  )}
                  {params?.value}
                </div>
                {offerId !== null && showLabel ? (
                  <HtmlTooltip title={offerName} arrow={false} placement="right">
                    <LocalOfferIcon
                      ml={1}
                      color="success"
                      sx={{
                        fontSize: '18px !important',
                      }}
                    />
                  </HtmlTooltip>
                ) : pp === 0 ? (
                  <HtmlTooltip title={'Free Product'} arrow={false} placement="right">
                    <LocalOfferIcon
                      ml={1}
                      color="success"
                      sx={{
                        fontSize: '18px !important',
                        marginLeft: '8px !important',
                      }}
                    />
                  </HtmlTooltip>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <>
                <div style={{ marginRight: '15px' }}>
                  <CircleRoundedIcon
                    color={iconColor}
                    sx={{ width: '10px !important', height: '10px !important', top: '-5px' }}
                  />{' '}
                </div>
                <SoftBox width="20px" height="20px"></SoftBox>
                <div
                  style={{
                    marginLeft: requestNumber ? '-7px' : '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                  }}
                >
                  {requestNumber && (
                    <InfoOutlinedIcon
                      color="info"
                      fontSize="small"
                      onClick={() => handlePODetail(requestNumber, requestNumberType)}
                    />
                  )}
                  {params?.value}
                </div>
                {offerId !== null && showLabel ? (
                  <HtmlTooltip title={offerName} arrow={false} placement="right">
                    <LocalOfferIcon
                      color="success"
                      sx={{
                        fontSize: '18px !important',
                        marginLeft: '8px !important',
                      }}
                    />
                  </HtmlTooltip>
                ) : pp === 0 ? (
                  <HtmlTooltip title={'Free Product'} arrow={false} placement="right">
                    <LocalOfferIcon
                      ml={1}
                      color="success"
                      sx={{
                        fontSize: '18px !important',
                        marginLeft: '8px !important',
                      }}
                    />
                  </HtmlTooltip>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        );
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'availableUnits',
      headerName: 'Available Units',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'sellingPrice',
      headerName: 'Selling Price',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {params.row.downArrow === 'false' ? (
              params.row.upArrow === 'true' ? (
                <>
                  <div style={{ marginLeft: '-5px' }}>
                    <LightTooltip title={'Selling Price based on Purchase Price marked up'}>
                      <NorthIcon color="success" fontSize="small" />
                    </LightTooltip>
                  </div>
                  <div style={{ marginLeft: '5px' }}>{params?.value} </div>
                </>
              ) : (
                <>
                  <SoftBox width="20px" height="20px"></SoftBox>
                  <div>{params.value}</div>
                </>
              )
            ) : params.row.upArrow === 'false' ? (
              <>
                <div style={{ marginLeft: '-5px' }}>
                  <LightTooltip title={'Selling Price based on MRP marked down'}>
                    <SouthIcon color="success" fontSize="small" />
                  </LightTooltip>
                </div>
                <div style={{ marginLeft: '5px' }}>{params?.value} </div>
              </>
            ) : (
              <>
                <SoftBox width="20px" height="20px"></SoftBox>
                <div>{params.value}</div>
              </>
            )}
          </div>
        );
      },
    },
    {
      field: 'purchasePrice',
      headerName: 'Purchase Price',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];
  const filterObject = {
    pageNumber: pageState.page,
    // pageSize: '5',
    pageSize: pageState.pageSize,
  };
  let dataArr,
    dataRow = [];
  const banner =
    'https://media.istockphoto.com/id/1292561924/vector/coming-soon-banner-speech-bubble-label-ribbon-template-vector-stock-illustration.jpg?s=612x612&w=0&k=20&c=xmA-tJaoCbt-OYjXshjBAa9STKzzfIJkP5iZ4eqWkNA=';

  const access_token = sessionStorage.getItem('access_token');
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  function CustomPagination() {
    const apiRef = useGridApiContext();

    return (
      <Pagination
        color="info"
        count={pageState?.totalPages}
        page={pageState?.page}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  }
  function CustomPagination2() {
    const apiRef = useGridApiContext();

    return (
      <Pagination
        color="info"
        count={pageState2?.totalPages}
        page={pageState2?.page}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  }

  let pricingArr,
    pricingRow = [];

  const batchOfferNameFunc = async (batchArr) => {
    const transformedBatchArr = await Promise.all(
      batchArr?.map(async (batch, index) => {
        let offerName;
        if (batch?.offerId !== null) {
          const response = await getBatchIdOfferDetails(batch.offerId);
          const productResponse = await getProductDetails(response?.data?.data?.data?.mainGtin);
          const type = response?.data?.data?.data?.offerType;
          const res = response?.data?.data?.data;
          // const mrp = ''
          const buyName = productResponse?.data?.data?.name;
          // const sellingPrice = ''
          if (type === 'BUY_X_GET_Y' || type === 'OFFER_ON_MRP' || type === 'BUY X GET Y' || type === 'OFFER ON MRP') {
            offerName = (
              <OfferPopup
                mrp={batch?.mrp}
                sellingPrice={batch?.sellingPrice}
                name={buyName}
                type={type}
                offerResponse={res}
                freebie={batch?.freebie}
                // freeParentBuyMRP={freeParentBuyMRP}
                // freeParentBuySP={freeParentBuySP}
              />
            );
          } else if (type === 'FREE_PRODUCTS' || type === 'FREE PRODUCTS') {
            offerName = `Free Product - ${res?.offerDetailsEntityList?.[0]?.itemName}`;
          }

          return {
            ...batch,
            offerName: offerName,
          };
        } else {
          return batch;
        }
      }),
    );

    return transformedBatchArr;
  };

  useEffect(() => {
    async function get() {
      setLoader(true);
      await getProductDetails(id)
        .then(function (responseTxt) {
          if (!responseTxt?.data) {
            navigate('/products/all-products');
            return;
          }
          setTableRows(responseTxt?.data?.data);
          setPackagingType(
            responseTxt?.data?.data?.packaging_type
              ? responseTxt?.data?.data?.packaging_type.toLowerCase().replace(/\s/g, '')
              : '',
          );
          sessionStorage.setItem('tableData', JSON.stringify(responseTxt?.data?.data));
          generateBarcodeWithNum(responseTxt?.data?.data?.gtin)
            .then((response) => {
              setBarImage(`data:image/png;base64,${response?.data?.data?.image}`);
              setLoader(false);
            })
            .catch((err) => {
              setLoader(false);
              setBarImage('NA');
            });
          getInventoryDetails(locId, id)
            .then(async (res) => {
              if (res?.data?.data?.es === 1) {
                setNotAvailable(true);
                setErrorHandler(res?.data?.data?.message);
                setClrMsg('error');
                setOpen(true);
                setLoader(false);
              } else {
                setPriceInfo(res?.data?.data?.data);
                setLoader(false);
                pricingArr = res?.data?.data?.data?.multipleBatchCreations;
                if (pricingArr.length === 0) {
                  setNotAvailable(true);
                }
                pricingArr.sort((a, b) => {
                  // Extract the numerical part of inventoryId for comparison
                  const idA = parseInt(a.inventoryId.substr(2), 10);
                  const idB = parseInt(b.inventoryId.substr(2), 10);

                  // Compare and return the result
                  return idB - idA;
                });
                const offerExist = res?.data?.data?.data?.multipleBatchCreations?.find((data) => data.offerId !== null);
                const newPricingarr = await batchOfferNameFunc(pricingArr);
                setPricingDetail(
                  newPricingarr?.map((row, index) => {
                    const marginBasedOn = res?.data?.data?.data?.marginBasedOn;
                    const marginType = res?.data?.data?.data?.marginType;
                    const marginValue =
                      marginBasedOn === 'pp' ? row?.sellingPrice - row?.purchasePrice : row?.mrp - row?.sellingPrice;

                    const marginDisplay =
                      marginType === '%'
                        ? `${Math.round(
                          (marginValue / (marginBasedOn === 'pp' ? row?.purchasePrice : row?.mrp)) * 100,
                        )}%`
                        : `${Math.round(marginValue)}`;
                    const newMargin =
                      marginDisplay !== 'NaN%' && marginDisplay !== Infinity && marginDisplay !== 'Infinity%'
                        ? marginDisplay
                        : 'NA';
                    return {
                      id: index,
                      quantity: row.quantity >= 0 ? row.quantity : '-----',
                      expiryDate: row?.expiryDate
                        ? // (row?.expiryDate).split('T')[0].replace(/-/g, '/')
                      // dateFormatter(row.expiryDate)
                        moment(row?.expiryDate).format('Do MMM, YYYY')
                        : '-----',
                      expiryDateApi: row?.expiryDate,
                      purchasePrice: row?.purchasePrice >= 0 ? row?.purchasePrice : '-----',
                      sellingPrice: row?.sellingPrice >= 0 ? `${row?.sellingPrice} (${newMargin})` : '-----',
                      batchId: row?.batchId ? row?.batchId : '-----',
                      availableUnits: row?.availableUnits >= 0 ? row?.availableUnits : '-----',
                      mrp: row?.mrp >= 0 ? row?.mrp : '-----',
                      upArrow: marginBasedOn === 'pp' && row?.sellingPrice > row?.purchasePrice ? 'true' : 'false',
                      downArrow: marginBasedOn !== 'pp' && row?.sellingPrice < row?.mrp ? 'true' : 'false',
                      offerId: row.offerId,
                      haveOffer: row.haveOffer,
                      freebie: row.freebie,
                      offerName: row.offerName,
                      requestNumber: row?.requestNumber,
                      requestNumberType: row?.requestNumberType,
                      expired: expireDateChecker(row?.expiryDate),
                      createdOn: res?.data?.data?.data?.createdOn,
                      modifiedOn: row?.modifiedOn,
                      // showLabel : (row.offerName !== undefined && row.offerName.includes("Free Product")) && row.freebie ? false : true
                    };
                  }),
                );
              }
            })
            .catch((err) => {
              setErrorHandler(err?.response?.data?.message || 'Some error occured');
              setClrMsg('error');
              setOpen(true);
              setLoader(false);
            });
          const payload = {
            locationId: locId,
            gtins: [id],
          };
          getLatestInwarded(payload)
            .then((res) => {
              if (res?.data?.data?.es) {
                setLoader(false);
                return;
              }
              setInwardedData(res?.data?.data?.data[0]);
              setLoader(false);
            })
            .catch((err) => {
              setErrorHandler(err?.response?.data?.message || 'Some error occured');
              setClrMsg('error');
              setOpen(true);
              setLoader(false);
            });

          getPurchaseTrend(orgId, locId, id)
            .then((res) => {
              createPurchaseData(res?.data?.data);
              setLoader(false);
            })
            .catch((err) => {
              setErrorHandler(err?.response?.data?.message);
              setClrMsg('error');
              setOpen(true);
              setLoader(false);
            });
          salesTrend();
          stockTurnOver();
        })
        .catch((err) => {
          if (err?.response?.data?.message === 'Product Is deleted') {
            Swal.fire({
              icon: 'error',
              title: 'Product has already been deleted',
              showConfirmButton: true,
              confirmButtonText: 'OK',
            }).then(() => {
              navigate('/products/all-products');
            });
          }
        });
    }
    get();
  }, []);

  useEffect(() => {
    setPageState((old) => ({ ...old, loader: true }));

    getPriceRevision(locId, id, filterObject)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          // dataArr = res?.data?.data?.data;
          const dataRes = res?.data?.data?.data;
          dataArr = res?.data?.data?.data?.data;
          // dataRow.push(
          //   dataArr?.object?.map((row, i) => ({
          //     id: i,
          //     date: row?.createdOn,
          //     mrp: row?.mrp,
          //     purchase: row?.purchasePrice,
          //     selling: row?.sellingPrice,
          //     name: row?.createdBy,
          //     batchNo: row?.batchNo,
          //   })),
          // );
          dataRow.push(
            dataArr?.map((row, i) => ({
              id: i,
              date: row?.createdOn,
              mrp: row?.mrp,
              purchase: row?.purchasePrice,
              selling: row?.sellingPrice,
              name: row?.createdBy,
              batchNo: row?.batchNo,
            })),
          );
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: dataRow[0] || [],
            page: dataRes?.pageNumber || 1,
            totalPages: dataRes?.totalResults || 1,
            total: dataArr?.totalPageNumber || 0,
          }));
        }
        setPageState((old) => ({ ...old, loader: false }));
      })
      .catch((err) => {
        setErrorHandler('Failed to fetch price details');
        setClrMsg('error');
        setOpen(true);
        setPageState((old) => ({ ...old, loader: false }));
      });
  }, [pageState.page]);

  const currMonth = new Date().getMonth() + 1;
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const startDate = `${year - 1}-${currMonth.toString().padStart(2, '0')}-01`;
  const lastDay = new Date(year, currMonth, 0).getDate();
  const endDate = `${year}-${currMonth.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

  const salesTrend = () => {
    const payload = {
      startDate: startDate,
      endDate: endDate,
      orgId: orgId,
      locationId: locId,
      gtin: id,
    };
    productWiseTrend(payload)
      .then((res) => {
        handleProductWiseData(res?.data?.data);
      })
      .catch((err) => {});
  };

  const handleProductWiseData = (res) => {
    const currentMonth = Number(new Date(res?.toDate).toLocaleString('en-us', { month: 'numeric' })) + 1;

    const createMonthArray = (startMonth) => {
      const months = [
        { monthNo: 1, month: 'Jan', price: 0, volume: 0 },
        { monthNo: 2, month: 'Feb', price: 0, volume: 0 },
        { monthNo: 3, month: 'Mar', price: 0, volume: 0 },
        { monthNo: 4, month: 'Apr', price: 0, volume: 0 },
        { monthNo: 5, month: 'May', price: 0, volume: 0 },
        { monthNo: 6, month: 'Jun', price: 0, volume: 0 },
        { monthNo: 7, month: 'Jul', price: 0, volume: 0 },
        { monthNo: 8, month: 'Aug', price: 0, volume: 0 },
        { monthNo: 9, month: 'Sep', price: 0, volume: 0 },
        { monthNo: 10, month: 'Oct', price: 0, volume: 0 },
        { monthNo: 11, month: 'Nov', price: 0, volume: 0 },
        { monthNo: 12, month: 'Dec', price: 0, volume: 0 },
      ];

      const startMonthIndex = months?.findIndex((month) => month?.monthNo === (startMonth === 13 ? 1 : startMonth));

      const resultArray = [];
      for (let i = 0; i < 12; i++) {
        const monthIndex = (startMonthIndex + i) % 12;
        resultArray.push(months[monthIndex]);
      }

      return resultArray?.map((monthObj) => {
        const matchingMonth = res?.trendMonth.find((trendObj) => trendObj?.month === monthObj?.monthNo);
        if (matchingMonth) {
          return {
            ...monthObj,
            volume: matchingMonth.volume,
            price: matchingMonth.price,
            year: matchingMonth.year,
          };
        }
        return monthObj;
      });
    };

    const monthArray = createMonthArray(currentMonth);

    const [months, prices, volumes] = monthArray?.reduce(
      (acc, { month, price, volume }) => {
        acc[0].push(month);
        acc[1].push(price);
        acc[2].push(volume);
        return acc;
      },
      [[], [], []],
    );

    const data = {
      price: prices,
      volume: volumes,
    };
    setSalesData(data);
    setLabel(months);
  };

  const stockPayload = {
    pageNo: pageState2.page,
    pageSize: pageState2.pageSize,
    locationId: locId,
    gtin: id,
    startDate: new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate())
      .toISOString()
      .split('T')[0],
    endDate: currentDate.toISOString().split('T')[0],
  };

  let stockArr,
    stockRow = [];

  useEffect(() => {
    setPageState2((old) => ({ ...old, loader: true }));
    let stockRes;
    avgStockRatio(stockPayload)
      .then((res) => {
        stockRes = res?.data?.data?.data;
        stockArr = res?.data?.data?.data?.data;
        stockArr.sort((a, b) => new Date(b.inwardedOn) - new Date(a.inwardedOn));
        stockRow.push(
          stockArr?.map((row, index) => ({
            id: index,
            batchNo: row.batchNo ? row.batchNo : '-----',
            inwardedOn: row?.inwardedOn
              ? // (row?.inwardedOn).split('T')[0].replace(/-/g, '/')
            //
              moment(row?.inwardedOn).format('Do MMM, YYYY')
              : '-----',
            availableUnits: row?.estimatedDays !== null ? row?.availableUnits : 'SOLD',
            quantityUnits: row?.quantityUnits ? row?.quantityUnits : '-----',
            daysTakenToSold: row?.daysTakenToSold ? row?.daysTakenToSold : '-----',
            stockTurnover:
              row?.estimatedDays !== null
                ? row?.daysTakenToSold + row?.estimatedDays + ' days'
                : row?.daysTakenToSold + ' days',
            estimatedDays: row?.estimatedDays,
          })),
        );
        setStockRatio(stockRow[0]);
        setPageState2((old) => ({
          ...old,
          loader: false,
          datRows: stockRow[0] || [],
          page: stockRes?.pageNumber || 1,
          total: stockRes?.totalResult || 0,
          totalPages: stockRes?.totalResult || 1,
        }));
      })
      .catch((err) => {
        setPageState2((old) => ({ ...old, loader: false }));
        // setErrorHandler('Failed to fetch Stock details');
        // setClrMsg('error');
        // setOpen(true);
      });
  }, [pageState2.page]);

  const stockTurnOver = () => {
    avgStockTurnover(locId, id)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          setAvgStockTurnoverRatio(res.data.data.data + ' days');
        } else if (res?.data?.data?.es === 1) {
          setAvgStockTurnoverRatio('NA');
        }
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        setAvgStockTurnoverRatio('NA');
      });
  };

  const getChipColor = (rowData) => {
    const expiredCount = rowData?.filter((item) => item?.expired)?.length;
    const data = rowData.map((item) => item?.expired);
    const count = { totalCount: rowData?.length, expiredCount: expiredCount };
    if (expiredCount !== rowData?.length || rowData?.length !== 1) {
      setExpiredCount(count);
    }
    const halfLength = rowData?.length / 2;
    if (expiredCount === 0) {
      return 'noExpiry';
    }

    if (expiredCount === rowData?.length) {
      return 'error';
    } else if (expiredCount !== rowData?.length) {
      return 'warning';
    }
    // return expiredCount >= halfLength ? 'error' : 'warning';
  };
  const getChipName = (rowData) => {
    const expiredCount = rowData?.filter((item) => item?.expired)?.length;
    const data = rowData?.map((item) => item?.expired);
    const halfLength = rowData?.length / 2;
    if (expiredCount === 0) {
      return 'noExpiry';
    }
    return expiredCount >= halfLength ? 'Expired' : 'Expiring Soon';
  };

  const changingChipStatus = (data) => {
    switch (data) {
      case 'A':
        return 'success';
      case 'B':
        return 'warning';
      case 'C':
        return 'error';
      default:
        return 'info';
    }
  };

  useEffect(() => {
    if (pricingDetail?.length > 0) {
      const data = getChipColor(pricingDetail);
      // const name = getChipName(pricingDetail);
      setExpiredChipCount(data);
      // setExpiredName(name);
    }
  }, [pricingDetail]);

  const isMobileDevice = isSmallScreen();

  return (
    <DashboardLayout>
      {/* <DashboardNavbar prevLink={true} /> */}
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {isMobileDevice && (
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
          <MobileNavbar title={'Product Details'} prevLink={true} isNavigateNull={true} />
        </SoftBox>
      )}
      <SoftBox pt={3}>
        <Card sx={{ maxWidth: '100vw' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
          <SoftBox p={3}>
            <SoftBox mb={3} className="productDetailsTag_Align">
              {/* <SoftTypography  variant="h5" fontWeight="medium">
                Product Details
              </SoftTypography> */}
              <SoftBox className="product-side-menu-list">
                <SoftBox>
                  <ModeEditIcon
                    sx={{
                      display:
                        permissions?.RETAIL_Products?.WRITE ||
                        permissions?.WMS_Products?.WRITE ||
                        permissions?.VMS_Products?.WRITE
                          ? 'block'
                          : 'none',
                      float: 'right',
                      cursor: 'pointer',
                    }}
                    // className="edit-icon-product"
                    onClick={() => editProductForm()}
                  ></ModeEditIcon>
                  {loader || notAvailable ? (
                    <Tooltip title={'Unavailable for Selling'}>
                      <WrongLocationOutlinedIcon
                        fontSize="medium"
                        sx={{ float: 'right', marginRight: '5px', cursor: 'pointer' }}
                        color="error"
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title={'Available for Selling'}>
                      <WhereToVoteOutlinedIcon
                        fontSize="medium"
                        sx={{ float: 'right', marginRight: '5px', cursor: 'pointer' }}
                        color="success"
                      />
                    </Tooltip>
                  )}
                  {loader || datRows?.productSource?.sourceId === orgId ? null : (
                    <Tooltip title={'Global Product'}>
                      <StarRateOutlinedIcon
                        fontSize="medium"
                        sx={{ float: 'right', color: '#ffd700', marginRight: '5px', cursor: 'pointer' }}
                      />
                    </Tooltip>
                  )}
                </SoftBox>
              </SoftBox>
              {expiredChipCount !== 'noExpiry' && (
                <SoftBox style={{ margin: '5px' }}>
                  <Chip
                    color={expiredChipCount}
                    label={`Expired ${
                      expiredCount &&
                      expiredCount?.totalCount > 0 &&
                      expiredCount.expiredCount !== expiredCount.totalCount
                        ? `${expiredCount.expiredCount || ''}/${expiredCount.totalCount}`
                        : ''
                    }`}
                  />
                </SoftBox>
              )}
            </SoftBox>

            <Grid container spacing={3}>
              <Grid item xs={12} lg={5} xl={5}>
                {loader ? (
                  <Spinner />
                ) : (
                  <ProductImages Imgs={datRows?.images} price={priceInfo} pricingDetail={pricingDetail} />
                )}
              </Grid>

              <Grid item xs={12} lg={7} sx={{ marginLeft: '-5px' }}>
                <ProductInfo
                  avgStockTurnoverRatio={avgStockTurnoverRatio}
                  datRows={datRows}
                  inwardedData={inwardedData}
                  price={priceInfo}
                  barImage={barImage}
                  loader={loader}
                  packagingType={packagingType}
                  pricingDetail={pricingDetail}
                />
              </Grid>
            </Grid>

            <SoftBox mt={3} mb={0}>
              <SoftBox mb={1} ml={1} className="content-space-between">
                <SoftTypography variant="h6" fontWeight="medium">
                  Batch Details
                </SoftTypography>
                {/*batch details filter  */}
                {/* <BatchDetailsFilter/> */}
              </SoftBox>
              <SoftBox mb={2}>
                <DataGrid
                  sx={{
                    cursor: 'pointer',
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                  // loading={batchLoader}
                  autoHeight
                  columns={columns3}
                  rows={pricingDetail}
                  getRowId={(row) => row.batchId}
                  pagination
                  // pageSize={5}
                  disableHover
                  // components={{
                  //   Pagination: () => <Pagination color="info" />,
                  // }}
                  // getRowClassName={(params) => {
                  //   return expireDateChecker(params?.row?.expiryDateApi)
                  //     ? 'dataGrid-productExpiry'
                  //     : 'dataGrid-productunExpired';
                  // }}
                  pageSize={5}
                  // components={{
                  //   Pagination: () => (
                  //     <Pagination color="info" />
                  //   )
                  //     }}
                  disableSelectionOnClick
                />
                {openPOModal && (
                  <BatchPODetail
                    openPOModal={openPOModal}
                    setOpenPOModal={setOpenPOModal}
                    setSelectedPONum={setSelectedPONum}
                    selectedPONum={selectedPONum}
                    setSelectedReqType={setSelectedReqType}
                    selectedReqType={selectedReqType}
                  />
                )}
              </SoftBox>
              <SoftBox mb={1} ml={1} className="content-space-between">
                <SoftTypography variant="h6" fontWeight="medium">
                  Price Revision
                </SoftTypography>
                {/* price revision filter  */}
                {/* <PriceRevisionFilter/> */}
              </SoftBox>
              {pageState.loader && <Spinner />}
              {!pageState.loader && (
                <SoftBox mb={2}>
                  <div
                    style={{
                      height:
                        featureSettings !== null && featureSettings['PRICE_REVISION_HISTORY'] == 'FALSE' ? 525 : null,
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    {featureSettings !== null && featureSettings['PRICE_REVISION_HISTORY'] == 'FALSE' ? (
                      <UpgradePlan />
                    ) : null}
                    <DataGrid
                      columns={columns}
                      rows={pageState.datRows}
                      getRowId={(row) => row.id}
                      rowCount={parseInt(pageState.totalPages)}
                      loading={pageState.loader}
                      pagination
                      page={pageState.page - 1}
                      pageSize={pageState.pageSize}
                      paginationMode="server"
                      // components={{
                      //   Pagination: CustomPagination,
                      // }}
                      onPageChange={(newPage) => {
                        setPageState((old) => ({ ...old, page: newPage + 1 }));
                      }}
                      onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                      disableSelectionOnClick
                      disableColumnMenu
                      autoHeight
                    />
                  </div>
                </SoftBox>
              )}
              <SoftBox my={1} ml={1} mt={2} className="content-space-between">
                <SoftTypography variant="h6" fontWeight="medium">
                  Average stock turnover ratio
                </SoftTypography>
                {/* Average stock turnover ratio filter  */}
                {/* <AverageStockTurnoverFilter /> */}
              </SoftBox>
              {pageState2.loader && <Spinner />}
              {!pageState2.loader && (
                <SoftBox mb={1}>
                  <div
                    style={{
                      height:
                        featureSettings !== null && featureSettings['AVERAGE_STOCK_TURNOVER_RATIO'] == 'FALSE'
                          ? 525
                          : null,
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    {featureSettings !== null && featureSettings['AVERAGE_STOCK_TURNOVER_RATIO'] == 'FALSE' ? (
                      <UpgradePlan />
                    ) : null}
                    <DataGrid
                      sx={{ cursor: 'pointer' }}
                      columns={columns2}
                      rows={pageState2.datRows}
                      getRowId={(row) => row.batchNo}
                      rowCount={parseInt(pageState2.total)}
                      loading={pageState2.loader}
                      pagination
                      page={pageState2.page - 1}
                      pageSize={pageState2.pageSize}
                      paginationMode="server"
                      // components={{
                      //   Pagination: CustomPagination2,
                      // }}
                      onPageChange={(newPageSize) => {
                        setPageState2((old) => ({ ...old, page: newPageSize + 1 }));
                      }}
                      onPageSizeChange={(newPageSize) => setPageState2((old) => ({ ...old, pageSize: newPageSize }))}
                      disableColumnMenu
                      autoHeight
                      disableSelectionOnClick
                    />
                  </div>
                </SoftBox>
              )}

              <ProductProfitCards gtin={id} />

              <Grid container spacing={3}>
                <Grid item xs={12} lg={6} xl={6}>
                  <SoftBox mt={3}>
                    <SoftBox mb={1} display="flex" alignItems="center" justifyContent="space-between">
                      {/* <SoftSelect 
                            value={salesSelect}
                            onChange={handleSalesSelect}
                            className="interval-select"
                            placeholder="Select interval"
                            options={intervalOptions}
                          /> */}
                      <SoftBox display="flex" gap={1} alignItems="center">
                        <SoftTypography variant="caption" fontWeight="medium" ml={1}>
                          {purchaseToggle ? 'Price' : 'Volume'}
                        </SoftTypography>
                        <Switch checked={purchaseToggle} onChange={() => setPurchaseToggle(!purchaseToggle)} />
                      </SoftBox>
                    </SoftBox>
                    <div
                      style={{
                        height: featureSettings !== null && featureSettings['PURCHASE_TREND'] == 'FALSE' ? 525 : null,
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      {featureSettings !== null && featureSettings['PURCHASE_TREND'] == 'FALSE' ? (
                        <UpgradePlan />
                      ) : null}
                      <GradientLineChart
                        title="Purchase Trend"
                        chart={{
                          labels: label,
                          datasets: [
                            {
                              label: purchaseToggle ? 'Price' : 'Volume',
                              color: purchaseToggle ? 'primary' : 'info',
                              data: purchaseToggle ? purchaseData?.price : purchaseData?.volume,
                            },
                          ],
                        }}
                      />
                    </div>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} lg={6} xl={6}>
                  <SoftBox mt={3}>
                    <SoftBox mb={1} display="flex" alignItems="center" justifyContent="space-between">
                      {/* <SoftSelect
                            value={purchaseSelect}
                            onChange={handlePurchaseSelect}
                            className="interval-select"
                            placeholder="Select interval"
                            options={intervalOptions}
                          /> */}
                      <SoftBox display="flex" gap={1} alignItems="center">
                        <SoftTypography variant="caption" fontWeight="medium" ml={1}>
                          {salesToggle ? 'Price' : 'Units'}
                        </SoftTypography>
                        <Switch checked={salesToggle} onChange={() => setSalesToggle(!salesToggle)} />
                      </SoftBox>
                    </SoftBox>
                    <div
                      style={{
                        height:
                          featureSettings !== null && featureSettings['PRODUCT_LEVEL_SALES_HISTORY'] == 'FALSE'
                            ? 525
                            : null,
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      {featureSettings !== null && featureSettings['PRODUCT_LEVEL_SALES_HISTORY'] == 'FALSE' ? (
                        <UpgradePlan />
                      ) : null}

                      <VerticalBarChart
                        title="Sales Trend"
                        chart={{
                          labels: label || [],
                          datasets: [
                            {
                              label: salesToggle ? 'Price' : 'Units',
                              color: salesToggle ? 'dark' : 'info',
                              data: salesToggle ? salesData?.price || [] : salesData?.volume || [],
                            },
                          ],
                        }}
                      />
                    </div>
                  </SoftBox>
                </Grid>
              </Grid>
            </SoftBox>
          </SoftBox>
        </Card>
      </SoftBox>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleCloseAlert} severity={clrMsg} sx={{ width: '100%' }}>
          {errorHandler}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};
