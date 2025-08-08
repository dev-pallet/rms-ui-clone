import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Button, Chip, Menu, MenuItem, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import {
  dynamicCouponsList,
  updateCouponStatus,
  updateDynamicCouponStatus,
  viewCoupons,
} from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import Filter from '../../Common/Filter';
import { ChipBoxHeading } from '../../Common/Filter Components/filterComponents';
import Status from '../../Common/Status';
import './CartCoupon.css';

const Coupondetails = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [couponDetails, setCouponDetails] = useState();
  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);
  const markUpOpen = Boolean(anchorMarkupEl);
  const [rowData, setRowData] = useState([]);
  const [reloadTable, setReloadTable] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Static');
  const [dynamicCouponDetails, setDynamicCouponDetails] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalCount, setTotalCount] = useState();
  const [totalPage, setTotalPage] = useState();

  const [couponSearchText, setCouponSearchText] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [couponType1, setCouponType1] = useState('');
  const [channelType1, setChannelType1] = useState('');
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  const [filtersAppliedCustomPriceEdit, setFiltersAppliedCustomPriceEdit] = useState(0);
  const [filterStateCustomPriceEdit, setFilterStateCustomPriceEdit] = useState({
    startDate: 0,
    endDate: 0,
    discountType: 0,
    couponType: 0,
    channelType: 0,
  });

  const [dynamicFiltersApplied, setDynamicFiltersApplied] = useState(0);
  const [dynamicFiltersState, setDynamicFiltersState] = useState({
    startDate: 0,
    endDate: 0,
    redeemingCouponType: 0,
    rewardingCouponType: 0,
    channelType: 0,
    discountType: 0,
  });

  const [startDateDynamic, setStartDateDynamic] = useState(null);
  const [endDateDynamic, setEndDateDynamic] = useState(null);
  const [selectChannelDynamic, setSelectChannelDynamic] = useState('');
  const [selectDiscountDynamic, setSelectDiscountDynamic] = useState('');
  const [rewardingCoupon, setRewardingCoupon] = useState('');
  const [redeemingCoupon, setRedeemingCoupon] = useState('');

  const dynamicCouponOptions = [
    {
      label: 'Cart Value',
      value: 'CART_VALUE',
    },
    {
      label: 'Product',
      value: 'PRODUCT',
    },
    {
      label: 'Category',
      value: 'CATEGORY',
    },
    {
      label: 'Brand',
      value: 'BRAND',
    },
    {
      label: 'Manufacturer',
      value: 'MANUFACTURER',
    },
  ];

  const discountOptions = [
    {
      label: 'By Percentage',
      value: 'PERCENTAGE',
    },

    {
      label: 'Flat Price',
      value: 'FLAT_OFF',
    },
  ];

  const couponType = [
    {
      label: 'By Cart Value',
      value: 'CART_VALUE',
    },
    {
      label: 'By product',
      value: 'PRODUCT',
    },
    {
      label: 'By Freebie',
      value: 'FREEBIE',
    },
    {
      label: 'By Category',
      value: 'CATEGORY',
    },
  ];

  const channelType = [
    {
      label: 'POS',
      value: 'POS',
    },
    {
      label: 'RMS',
      value: 'RMS',
    },
    {
      label: 'APP',
      value: 'APP',
    },
  ];

  const columns = [
    {
      field: 'CouponID',
      headerName: 'Coupon ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 90,
      flex: 1,
    },
    {
      field: 'CouponCode',
      headerName: 'Coupon Code',
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'CouponType',
      headerName: 'Coupon Type',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'Status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 70,
      flex: 1,
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
    {
      field: 'DiscountType',
      headerName: 'Discount Type',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 110,
      flex: 1,
    },
    {
      field: 'DiscountValue',
      headerName: 'Discount Value',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'center',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'ChannelType',
      headerName: 'Channel',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'usage',
      headerName: 'Usage',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'Date',
      headerName: 'Last Modified',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 160,
      flex: 1,
    },
    {
      field: 'delete',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 40,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const handleClick = (event) => {
          setAnchorMarkupEl(event.currentTarget);
          setRowData(params?.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const OnUpdate = (status, row) => {
          const user_details = localStorage.getItem('user_details');
          const uidx = JSON.parse(user_details).uidx;
          const payload = {
            couponId: rowData.CouponID,
            couponStatus: status,
            updatedBy: uidx,
          };
          updateCouponStatus(payload)
            .then((res) => {
              setReloadTable(!reloadTable);
            })
            .catch((err) => {
              showSnackbar('Failed to update status', 'error');
            });
        };

        return (
          <div>
            <Button
              id="basic-button"
              aria-controls={markUpOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={markUpOpen ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon fontSize="14px" />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorMarkupEl}
              open={markUpOpen}
              onClose={handleCloseOp}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem>
                <Button
                  style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                  onClick={() => {
                    handleCloseOp();
                    OnUpdate('ACTIVE');
                  }}
                >
                  Active
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  style={{
                    backgroundColor: '#7c86de',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                  onClick={() => {
                    handleCloseOp();
                    OnUpdate('INACTIVE');
                  }}
                >
                  Inactive
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  style={{
                    backgroundColor: '#ff0000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                  onClick={() => {
                    handleCloseOp();
                    OnUpdate('DISABLED');
                  }}
                >
                  Delete
                </Button>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  const dynamicColumns = [
    {
      field: 'CouponID',
      headerName: 'Coupon ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 90,
      flex: 1,
    },
    {
      field: 'CouponName',
      headerName: 'Coupon Name',
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'CouponType',
      headerName: 'Redeeming Condition',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'Status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 70,
      flex: 1,
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
    {
      field: 'DiscountType',
      headerName: 'Discount Type',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 110,
      flex: 1,
    },
    {
      field: 'DiscountValue',
      headerName: 'Discount Value',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'center',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'ChannelType',
      headerName: 'Channel',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'applicableOn',
      headerName: 'Rewarding Condition',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'Date',
      headerName: 'Last Modified',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 160,
      flex: 1,
    },
    {
      field: 'delete',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 40,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const handleClick = (event) => {
          setAnchorMarkupEl(event.currentTarget);
          setRowData(params?.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const OnUpdate = (status, row) => {
          const user_details = localStorage.getItem('user_details');
          const uidx = JSON.parse(user_details).uidx;
          const payload = {
            configId: rowData.CouponID,
            status: status,
            updatedBy: uidx,
          };
          updateDynamicCouponStatus(payload)
            .then((res) => {
              setReloadTable(!reloadTable);
            })
            .catch((err) => {
              showSnackbar('Failed to Update the status', 'error');
            });
        };

        return (
          <div>
            <Button
              id="basic-button"
              aria-controls={markUpOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={markUpOpen ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon fontSize="14px" />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorMarkupEl}
              open={markUpOpen}
              onClose={handleCloseOp}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem>
                <Button
                  className="dynamic-coupon-button-Style"
                  style={{
                    backgroundColor: '#4caf50',
                  }}
                  onClick={() => {
                    handleCloseOp();
                    OnUpdate('ACTIVE');
                  }}
                >
                  Active
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  className="dynamic-coupon-button-Style"
                  style={{
                    backgroundColor: '#7c86de',
                  }}
                  onClick={() => {
                    handleCloseOp();
                    OnUpdate('INACTIVE');
                  }}
                >
                  Inactive
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  className="dynamic-coupon-button-Style"
                  style={{
                    backgroundColor: '#ff0000',
                  }}
                  onClick={() => {
                    handleCloseOp();
                    OnUpdate('DISABLED');
                  }}
                >
                  Delete
                </Button>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const showDynamicCouponData = () => {
    const orgId = localStorage.getItem('orgId');
    const locID = localStorage.getItem('locId');
    const payload = {
      page: page - 1,
      size: pageSize,
      sortBy: null,
      sortOrder: null,
      orgId: orgId,
      locId: [locID],
      status: ['ACTIVE', 'INACTIVE', 'DISABLED'],
    };

    dynamicCouponsList(payload).then((res) => {
      setTotalCount(res?.data?.data?.count);
      setTotalPage(res?.data?.data?.totalPage);
      setDynamicCouponDetails(res?.data?.data?.dynamicCouponConfigList);
    });
  };

  const rowCount = totalCount && totalPage ? totalCount * totalPage : 0;

  const dynamicRowData = dynamicCouponDetails?.map((row) => {
    return {
      CouponID: row?.configId,
      CouponName: row?.offerName,
      Date: row?.createdOn
        ? new Date(row?.createdOn).toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : 'NA',
      CouponType: row?.configType ? row?.configType : 'NA',
      Status: row?.status,
      DiscountType: row?.rewardingDiscountType
        ? row?.rewardingDiscountType
        : row?.freebieItemRewardList[0]?.itemCode !== ''
        ? 'FREEBIE'
        : 'NA',
      ChannelType: row?.channels,
      DiscountValue: row?.rewardingDiscountValue ? row?.rewardingDiscountValue : 'NA',
      delete: '',
      applicableOn: row?.rewardingCouponType,
    };
  });

  const showCouponData = () => {
    const orgId = localStorage.getItem('orgId');
    const locID = localStorage.getItem('locId');
    const payload = {
      sourceOrgId: [orgId],
      sourceLocId: [locID],
      // status: ['ACTIVE','INACTIVE'],
    };

    viewCoupons(payload)
      .then((res) => {
        setCouponDetails(res?.data?.data?.coupon);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (selectedTab === 'Static') {
      showCouponData();
    } else if (selectedTab === 'Dynamic') {
      showDynamicCouponData();
    }
  }, [reloadTable, selectedTab, page]);

  const handleClearAllFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setDiscountType('');
    setCouponType1('');
    setChannelType1('');
    showCouponData();
    setFiltersAppliedCustomPriceEdit(0);
    setFilterStateCustomPriceEdit({
      startDate: 0,
      endDate: 0,
      discountType: 0,
      couponType: 0,
      channelType: 0,
    });
  };

  const handleAllFilters = () => {
    const orgId = localStorage.getItem('orgId');
    const locID = localStorage.getItem('locId');
    const payload = {
      sourceOrgId: [orgId],
      sourceLocId: [locID],
    };

    // Add filters based on discountType, couponType1, and couponCode
    if (discountType) {
      payload.discountType = [discountType];
    }

    if (couponType1) {
      payload.couponType1 = [couponType1];
    }

    if (channelType1) {
      payload.channelType1 = [channelType1];
    }

    if (startDate) {
      payload.startDate = [startDate];
    }

    if (endDate) {
      payload.endDate = [endDate];
    }

    viewCoupons(payload)
      .then((res) => {
        const filteredCouponDetails = res?.data?.data?.coupon.filter((row) => {
          // Apply filters based on discountType, couponType1, and valid dates
          if (
            (discountType && row.discountType !== discountType) ||
            (couponType1 && row.couponType !== couponType1) ||
            (startDate && new Date(row.startDate) < new Date(startDate)) ||
            (endDate && new Date(row.endDate) > new Date(endDate))
          ) {
            return false;
          }

          // Apply filter for couponCode (case-insensitive)
          const lowerCaseCouponCode = row.couponCode.toLowerCase();
          if (couponSearchText && !lowerCaseCouponCode.includes(couponSearchText.toLowerCase())) {
            return false;
          }

          return true;
        });

        setCouponDetails(filteredCouponDetails);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    handleAllFilters();
  }, [discountType, couponType1, channelType1, startDate, endDate, couponSearchText]);

  const rows = couponDetails?.map((row) => {
    return {
      CouponID: row?.couponId,
      CouponCode: row?.couponCode,
      Date: row.createdOn
        ? new Date(row.createdOn).toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : 'NA',
      CouponType: row.couponType ? row.couponType : 'NA',
      Status: row?.status,
      DiscountType: row?.discountType,
      ChannelType: 'NA',
      DiscountValue: row?.discountValue,
      delete: '',
      usage: row?.maxTotalUsage,
    };
  });

  const handleValidFromChange = (date) => {
    setStartDate(format(date.$d, 'yyyy-MM-dd'));
    if (filterStateCustomPriceEdit['startDate'] === 0) {
      setFiltersAppliedCustomPriceEdit((prev) => prev + 1);
      setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, startDate: 1 });
    }
  };

  const startDayFilter = (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          key={renderKey}
          value={startDate ? dayjs(startDate) : null}
          views={['year', 'month', 'day']}
          format="DD-MM-YYYY"
          label="Valid From"
          onChange={(date) => handleValidFromChange(date)}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '0.8rem',
              top: '-0.4rem',
              color: '#344767',
            },
          }}
        />
      </LocalizationProvider>
    </>
  );

  const endDayFilter = (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          key={renderKey}
          value={endDate ? dayjs(endDate) : null}
          views={['year', 'month', 'day']}
          format="DD-MM-YYYY"
          label="Valid Upto"
          onChange={(date) => {
            setEndDate(format(date.$d, 'yyyy-MM-dd'));
            if (filterStateCustomPriceEdit['endDate'] === 0) {
              setFiltersAppliedCustomPriceEdit((prev) => prev + 1);
              setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, endDate: 1 });
            }
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '0.8rem',
              top: '-0.4rem',
              color: '#344767',
            },
          }}
        />
      </LocalizationProvider>
    </>
  );

  const discountTypeFilter = (
    <>
      <div>
        {/* <Typography className="coupon-filter-box2-typo-head">Discount Type</Typography> */}
        <SoftSelect
          placeholder="Select Discount"
          options={discountOptions}
          onChange={(option) => {
            setDiscountType(option.value);
            if (filterStateCustomPriceEdit['discountType'] === 0) {
              setFiltersAppliedCustomPriceEdit((prev) => prev + 1);
              setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, discountType: 1 });
            }
          }}
        />
      </div>
    </>
  );

  const couponTypeFilter = (
    <>
      <div>
        {/* <Typography className="coupon-filter-box2-typo-head">Coupon Type</Typography> */}
        <SoftSelect
          placeholder="Select Coupon"
          options={couponType}
          onChange={(option) => {
            setCouponType1(option.value);
            if (filterStateCustomPriceEdit['couponType'] === 0) {
              setFiltersAppliedCustomPriceEdit((prev) => prev + 1);
              setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, couponType: 1 });
            }
          }}
        />
      </div>
    </>
  );

  const channelTypeFilter = (
    <>
      <div>
        {/* <Typography className="coupon-filter-box2-typo-head">Channel</Typography> */}
        <SoftSelect
          placeholder="Select Channel"
          options={channelType}
          onChange={(option) => {
            setChannelType1(option.value);
            if (filterStateCustomPriceEdit['channelType'] === 0) {
              setFiltersAppliedCustomPriceEdit((prev) => prev + 1);
              setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, channelType: 1 });
            }
          }}
        />
      </div>
    </>
  );

  const selectBoxArray = [startDayFilter, endDayFilter, discountTypeFilter, couponTypeFilter, channelTypeFilter];

  const removeSelectedCustomCampaignFilter = (filterType) => {
    switch (filterType) {
      case 'startDate':
        setFiltersAppliedCustomPriceEdit((prev) => prev - 1);
        setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, startDate: 0 });
        setStartDate('');
        break;
      case 'endDate':
        setFiltersAppliedCustomPriceEdit((prev) => prev - 1);
        setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, endDate: 0 });
        setEndDate('');
        break;
      case 'discountType':
        setFiltersAppliedCustomPriceEdit((prev) => prev - 1);
        setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, discountType: 0 });
        setDiscountType('');
        break;
      case 'couponType':
        setFiltersAppliedCustomPriceEdit((prev) => prev - 1);
        setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, couponType: 0 });
        setCouponType1('');
        break;
      case 'channelType':
        setFiltersAppliedCustomPriceEdit((prev) => prev - 1);
        setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, channelType: 0 });
        setChannelType1('');
        break;
      default:
        return;
    }
  };

  const filterChipBoxes = (
    <>
      {filterStateCustomPriceEdit.startDate === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Valid From" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={startDate}
              onDelete={() => removeSelectedCustomCampaignFilter('startDate')}
              deleteIcon={<HighlightOffIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
      {filterStateCustomPriceEdit.endDate === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Valid Upto" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={endDate}
              onDelete={() => removeSelectedCustomCampaignFilter('endDate')}
              deleteIcon={<HighlightOffIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
      {filterStateCustomPriceEdit.discountType === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Discount Type" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={
                discountType === 'PERCENTAGE'
                  ? 'By Percentage'
                  : discountType === 'AMOUNT'
                  ? 'By Amount'
                  : discountType === 'FLAT_OFF'
                  ? 'Flat Price'
                  : null
              }
              onDelete={() => removeSelectedCustomCampaignFilter('discountType')}
              deleteIcon={<HighlightOffIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
      {filterStateCustomPriceEdit.couponType === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Coupon Type" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={
                couponType1 === 'CART_VALUE'
                  ? 'By Cart Value'
                  : couponType1 === 'PRODUCT'
                  ? 'By Product'
                  : couponType1 === 'FREEBIE'
                  ? 'Freebie'
                  : couponType1 === 'CATEGORY'
                  ? 'By Category'
                  : null
              }
              onDelete={() => removeSelectedCustomCampaignFilter('couponType')}
              deleteIcon={<HighlightOffIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {filterStateCustomPriceEdit.channelType === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Channel" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={channelType1}
              onDelete={() => removeSelectedCustomCampaignFilter('channelType')}
              deleteIcon={<HighlightOffIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  const startDayFilterDynamic = (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          key={renderKey}
          value={startDateDynamic ? dayjs(startDateDynamic) : null}
          views={['year', 'month', 'day']}
          format="DD-MM-YYYY"
          label="Valid From"
          onChange={(date) => {
            setStartDateDynamic(format(date.$d, 'yyyy-MM-dd'));
            if (dynamicFiltersState['startDate'] === 0) {
              setDynamicFiltersApplied((prev) => prev + 1);
              setDynamicFiltersState({ ...dynamicFiltersState, startDate: 1 });
            }
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '0.8rem',
              top: '-0.4rem',
              color: '#344767',
            },
          }}
        />
      </LocalizationProvider>
    </>
  );

  const endDayFilterDynamic = (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          key={renderKey}
          value={endDateDynamic ? dayjs(endDateDynamic) : null}
          views={['year', 'month', 'day']}
          format="DD-MM-YYYY"
          label="Valid From"
          onChange={(date) => {
            setEndDateDynamic(format(date.$d, 'yyyy-MM-dd'));
            if (dynamicFiltersState['endDate'] === 0) {
              setDynamicFiltersApplied((prev) => prev + 1);
              setDynamicFiltersState({ ...dynamicFiltersState, endDate: 1 });
            }
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '0.8rem',
              top: '-0.4rem',
              color: '#344767',
            },
          }}
        />
      </LocalizationProvider>
    </>
  );

  const channelTypeFilterDynamic = (
    <>
      <div>
        {/* <Typography className="coupon-filter-box2-typo-head">Channel</Typography> */}
        <SoftSelect
          placeholder="Select Channel"
          options={channelType}
          onChange={(option) => {
            setSelectChannelDynamic(option.value);
            if (dynamicFiltersState['channelType'] === 0) {
              setDynamicFiltersApplied((prev) => prev + 1);
              setDynamicFiltersState({ ...dynamicFiltersState, channelType: 1 });
            }
          }}
        />
      </div>
    </>
  );

  const discountTypeFilterDynamic = (
    <>
      <div>
        {/* <Typography className="coupon-filter-box2-typo-head">Discount Type</Typography> */}
        <SoftSelect
          placeholder="Select Discount"
          options={discountOptions}
          onChange={(option) => {
            setSelectDiscountDynamic(option.value);
            if (dynamicFiltersState['discountType'] === 0) {
              setDynamicFiltersApplied((prev) => prev + 1);
              setDynamicFiltersState({ ...dynamicFiltersState, discountType: 1 });
            }
          }}
        />
      </div>
    </>
  );

  const rewardingCouponFilterDynamic = (
    <>
      <div>
        {/* <Typography className="coupon-filter-box2-typo-head">Discount Type</Typography> */}
        <SoftSelect
          placeholder="Select Rewarding Coupon"
          options={dynamicCouponOptions}
          onChange={(option) => {
            setRewardingCoupon(option.value);
            if (dynamicFiltersState['rewardingCouponType'] === 0) {
              setDynamicFiltersApplied((prev) => prev + 1);
              setDynamicFiltersState({ ...dynamicFiltersState, rewardingCouponType: 1 });
            }
          }}
        />
      </div>
    </>
  );

  const redeemingCouponTypeFilterDynamic = (
    <>
      <div>
        {/* <Typography className="coupon-filter-box2-typo-head">Discount Type</Typography> */}
        <SoftSelect
          placeholder="Select Rewarding Coupon"
          options={dynamicCouponOptions}
          onChange={(option) => {
            setRedeemingCoupon(option.value);
            if (dynamicFiltersState['redeemingCouponType'] === 0) {
              setDynamicFiltersApplied((prev) => prev + 1);
              setDynamicFiltersState({ ...dynamicFiltersState, redeemingCouponType: 1 });
            }
          }}
        />
      </div>
    </>
  );

  const dynamicSelectBoxArray = [
    startDayFilterDynamic,
    endDayFilterDynamic,
    channelTypeFilterDynamic,
    discountTypeFilterDynamic,
    rewardingCouponFilterDynamic,
    redeemingCouponTypeFilterDynamic,
  ];

  const filterChipBoxesDynamic = (
    <>
      {dynamicFiltersState.startDate === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Valid From" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={startDateDynamic}
              onDelete={() => removeSelectedCustomCampaignFilterDynamic('startDate')}
              deleteIcon={<HighlightOffIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
      {dynamicFiltersState.endDate === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Valid Upto" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={endDateDynamic}
              onDelete={() => removeSelectedCustomCampaignFilterDynamic('endDate')}
              deleteIcon={<HighlightOffIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
      {dynamicFiltersState.discountType === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Discount Type" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={
                selectDiscountDynamic === 'PERCENTAGE'
                  ? 'By Percentage'
                  : selectDiscountDynamic === 'AMOUNT'
                  ? 'By Amount'
                  : selectDiscountDynamic === 'FLAT_OFF'
                  ? 'Flat Price'
                  : null
              }
              onDelete={() => removeSelectedCustomCampaignFilterDynamic('discountType')}
              deleteIcon={<HighlightOffIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
      {dynamicFiltersState.rewardingCouponType === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Rewarding Coupon Type" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={
                rewardingCoupon === 'CART_VALUE'
                  ? 'By Cart Value'
                  : rewardingCoupon === 'PRODUCT'
                  ? 'By Product'
                  : rewardingCoupon === 'BRAND'
                  ? 'By Brand'
                  : rewardingCoupon === 'CATEGORY'
                  ? 'By Category'
                  : rewardingCoupon === 'MANUFACTURER'
                  ? 'By Manufacturer'
                  : null
              }
              onDelete={() => removeSelectedCustomCampaignFilterDynamic('rewardingCouponType')}
              deleteIcon={<HighlightOffIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
      {dynamicFiltersState.redeemingCouponType === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Redeeming Coupon Type" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={
                redeemingCoupon === 'CART_VALUE'
                  ? 'By Cart Value'
                  : redeemingCoupon === 'PRODUCT'
                  ? 'By Product'
                  : redeemingCoupon === 'BRAND'
                  ? 'By Brand'
                  : redeemingCoupon === 'CATEGORY'
                  ? 'By Category'
                  : redeemingCoupon === 'MANUFACTURER'
                  ? 'By Manufacturer'
                  : null
              }
              onDelete={() => removeSelectedCustomCampaignFilterDynamic('redeemingCouponType')}
              deleteIcon={<HighlightOffIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {dynamicFiltersState.channelType === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Channel" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={selectChannelDynamic}
              onDelete={() => removeSelectedCustomCampaignFilterDynamic('channelType')}
              deleteIcon={<HighlightOffIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  const removeSelectedCustomCampaignFilterDynamic = (filterType) => {
    switch (filterType) {
      case 'startDate':
        setDynamicFiltersApplied((prev) => prev - 1);
        setDynamicFiltersState({ ...dynamicFiltersState, startDate: 0 });
        setStartDateDynamic('');
        break;
      case 'endDate':
        setDynamicFiltersApplied((prev) => prev - 1);
        setDynamicFiltersState({ ...dynamicFiltersState, endDate: 0 });
        setEndDateDynamic('');
        break;
      case 'discountType':
        setDynamicFiltersApplied((prev) => prev - 1);
        setDynamicFiltersState({ ...dynamicFiltersState, discountType: 0 });
        setSelectDiscountDynamic('');
        break;
      case 'rewardingCouponType':
        setDynamicFiltersApplied((prev) => prev - 1);
        setDynamicFiltersState({ ...dynamicFiltersState, rewardingCouponType: 0 });
        setRewardingCoupon('');
        break;
      case 'redeemingCouponType':
        setDynamicFiltersApplied((prev) => prev - 1);
        setDynamicFiltersState({ ...dynamicFiltersState, redeemingCouponType: 0 });
        setRedeemingCoupon('');
        break;
      case 'channelType':
        setDynamicFiltersApplied((prev) => prev - 1);
        setDynamicFiltersState({ ...dynamicFiltersState, channelType: 0 });
        setSelectChannelDynamic('');
        break;
      default:
        return;
    }
  };

  const handleAllFiltersDynamic = () => {
    const filteredCouponDetails = dynamicCouponDetails.filter((row) => {
      if (
        (selectDiscountDynamic && row.rewardingDiscountType !== selectDiscountDynamic) ||
        (rewardingCoupon && row.rewardingCouponType !== rewardingCoupon) ||
        (redeemingCoupon && row.configType !== redeemingCoupon) ||
        (selectChannelDynamic && !row.channels.includes(selectChannelDynamic)) ||
        (startDateDynamic && new Date(row.validFrom) < new Date(startDateDynamic)) ||
        (endDateDynamic && new Date(row.validTo) > new Date(endDateDynamic)) ||
        (couponSearchText && !row.offerName.toLowerCase().includes(couponSearchText.toLowerCase()))
      ) {
        return false;
      }
      return true;
    });

    setDynamicCouponDetails(filteredCouponDetails);
  };

  useEffect(() => {
    handleAllFiltersDynamic();
  }, [
    selectDiscountDynamic,
    rewardingCoupon,
    redeemingCoupon,
    selectChannelDynamic,
    startDateDynamic,
    endDateDynamic,
    couponSearchText,
  ]);

  const handleClearAllFiltersDynamic = () => {
    setStartDateDynamic(null);
    setEndDateDynamic(null);
    setSelectDiscountDynamic('');
    setRewardingCoupon('');
    setSelectChannelDynamic('');
    setRedeemingCoupon('');
    showDynamicCouponData();
    setDynamicFiltersApplied(0);
    setDynamicFiltersState({
      startDate: 0,
      endDate: 0,
      redeemingCouponType: 0,
      rewardingCouponType: 0,
      channelType: 0,
      discountType: 0,
    });
  };

  return (
    <SoftBox className="search-bar-filter-and-table-container">
      <SoftBox className="search-bar-filter-container">
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '20px' }}>
          <Typography
            onClick={() => setSelectedTab('Static')}
            className={selectedTab === 'Static' ? 'coupon-static-selected' : 'coupon-static'}
          >
            Static Coupons
          </Typography>
          <Typography
            onClick={() => setSelectedTab('Dynamic')}
            className={selectedTab === 'Dynamic' ? 'coupon-static-selected' : 'coupon-static'}
          >
            Dynamic Coupons
          </Typography>
        </div>

        <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Box className="all-products-filter-product" style={{ width: '350px' }}>
            <SoftInput
              className="all-products-filter-soft-input-box"
              placeholder="Search Coupons"
              icon={{ component: 'search', direction: 'left' }}
              onChange={(e) => setCouponSearchText(e.target.value)}
            />
          </Box>
          {selectedTab === 'Static' ? (
            <Filter
              selectBoxArray={selectBoxArray}
              filterChipBoxes={filterChipBoxes}
              filtersApplied={filtersAppliedCustomPriceEdit}
              handleApplyFilter={handleAllFilters}
              handleClearFilter={handleClearAllFilters}
            />
          ) : selectedTab === 'Dynamic' ? (
            <Filter
              selectBoxArray={dynamicSelectBoxArray}
              filtersApplied={dynamicFiltersApplied}
              filterChipBoxes={filterChipBoxesDynamic}
              handleClearFilter={handleClearAllFiltersDynamic}
              handleApplyFilter={handleAllFiltersDynamic}
            />
          ) : null}
        </SoftBox>
      </SoftBox>
      {selectedTab === 'Static' && (
        <SoftBox>
          <Box sx={{ height: 525, width: '100%' }}>
            <DataGrid
              rows={rows ? rows : []}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              getRowId={(row) => row.CouponID}
              onCellClick={(params) => {
                if (params.field !== 'delete') {
                  navigate(`/marketing/Coupons/static/${params.row.CouponID}`);
                }
              }}
            />
          </Box>
        </SoftBox>
      )}

      {selectedTab === 'Dynamic' && (
        <SoftBox>
          <Box sx={{ height: 525, width: '100%' }}>
            <DataGrid
              rows={dynamicRowData ? dynamicRowData : []}
              columns={dynamicColumns}
              pagination
              pageSize={pageSize}
              paginationMode="server"
              rowCount={rowCount} // Total number of rows
              page={page - 1}
              onPageChange={(newPage) => handlePageChange(newPage + 1)}
              disableSelectionOnClick
              getRowId={(row) => row.CouponID}
              onCellClick={(params) => {
                if (params.field !== 'delete') {
                  navigate(`/marketing/Coupons/dynamic/${params.row.CouponID}`);
                }
              }}
            />
          </Box>
        </SoftBox>
      )}
    </SoftBox>
  );
};

export default Coupondetails;
