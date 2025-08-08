import { ArrowLeftIcon, ArrowLongRightIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Grid, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import { getAllVendorDetails, getAllVendorSegrgation } from '../../../../../../config/Services';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import BottomNavbar from '../../../../../../examples/Navbars/BottomNavbarMob';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import CustomMobileButton from '../../../../Common/mobile-new-ui-components/button';
import './index.css';
import { ArrowRightIcon } from '@mui/x-date-pickers';
import CommonId from '../../../../Common/mobile-new-ui-components/common-id';
import ConvertPOtoCart from './convertPOtoCart';

const ConvertToPOPage = () => {
  const isMobileDevice = isSmallScreen();
  const { piNum } = useParams();
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const showSnackbar = useSnackbar();
  const [data, setData] = useState([]);
  const [allVendorData, setAllVendorData] = useState([]);
  const [loader, setLoader] = useState(false);

  const calculateTotalAmount = (items) => {
    const totalAmount = items?.reduce((acc, item) => {
      const price =
        item?.previousPurchasePrice && item?.previousPurchasePrice !== '0' && item?.previousPurchasePrice !== 0
          ? parseFloat(item?.previousPurchasePrice)
          : parseFloat(item?.finalPrice);
      return acc + item?.quantityOrdered * price;
    }, 0);
    return totalAmount.toFixed(2);
  };

  useEffect(() => {
    setLoader(true);
    getAllVendorSegrgation(piNum)
      .then((res) => {
        if (res?.data?.status === 'SUCCESS') {
          const response = res?.data?.data;
          const emptyStringItems = response['0'] || response['']; // Extract items with an empty string key
          const otherItems = Object.entries(response)
            .filter(([key]) => key !== '' && key !== '0') // Filter out items with an empty string key
            .map(([vendorId, items]) => {
              const totalItems = items?.length;
              const approvedItems = items?.filter((item) => item?.poNumber && item?.poNumber !== '')?.length;
              const totalQuantity = items?.reduce((acc, item) => acc + item?.quantityOrdered, 0);
              const amount = calculateTotalAmount(items);
              const isVerified = approvedItems > 0 ? true : false;
              return { id: vendorId, totalItems: `${approvedItems}/${totalItems}`, totalQuantity, amount, isVerified };
            });
          const newData = [
            ...otherItems, // Add items with other vendor IDs
            {
              id: '', // Handle items with an empty string key
              totalItems: emptyStringItems
                ? `${emptyStringItems?.filter((item) => item?.poNumber && item?.poNumber !== '')?.length}/${
                    emptyStringItems?.length
                  }`
                : '0/0',
              totalQuantity: emptyStringItems
                ? emptyStringItems?.reduce((acc, item) => acc + item?.quantityOrdered, 0)
                : 0,
              amount: emptyStringItems ? calculateTotalAmount(emptyStringItems) : 0,
              vendorName: 'NA',
              purchaseTerms: 'NA',
              isVerified:
                emptyStringItems?.filter((item) => item?.poNumber && item?.poNumber !== '')?.length > 0 ? true : false,
            },
          ];
          setData(emptyStringItems ? newData : otherItems);
        } else {
          setLoader(false);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Something went wrong!', 'error');
        setLoader(false);
      });
  }, []);

  useEffect(() => {
    if (data?.length > 0) {
      getVendorData();
    }
  }, [data]);

  function formatString(str) {
    return str
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const getVendorData = async () => {
    try {
      const vendorIds = data?.filter((item) => item.id !== '' && item.id !== '0').map((item) => item?.id);
      if (vendorIds?.length === 0) {
        setLoader(false);
        return;
      }
      const payload = { vendorId: vendorIds };
      const res = await getAllVendorDetails(payload);

      if (res?.data?.status === 'SUCCESS') {
        const vendorDetails = res?.data?.data?.object;
        const vendorDetailsMap = {};
        vendorDetails.forEach((vendor) => {
          vendorDetailsMap[vendor?.vendorId] = {
            vendorName: vendor?.displayName,
            purchaseTerms: vendor?.purchaseTerms
              ? vendor?.purchaseTerms?.map((term) => formatString(term?.paymentOption)).join(', ')
              : 'NA',
          };
        });
        const newData = data?.map((item) => {
          const vendorDetail = vendorDetailsMap[item?.id];
          if (vendorDetail) {
            return {
              ...item,
              vendorName: vendorDetail?.vendorName,
              purchaseTerms: vendorDetail?.purchaseTerms,
            };
          }
          return item;
        });
        setAllVendorData(newData);
      }

      setLoader(false);
    } catch (error) {
      setLoader(false);
      showSnackbar('Error processing vendor data:', 'error');
    }
  };

  const navigateToDetailsPage = (ele) => {
    if (ele?.id !== '') {
      navigate(`/purchase/purchase-orders/create-purchase-order/${piNum}/${ele?.id}`);
    } else {
      navigate(`/purchase/purchase-orders/create-purchase-order/${piNum}`);
    }
  };

  return (
    <DashboardLayout isMobileDevice={isMobileDevice}>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}

      <SoftBox className="convert-to-po-main-box-1" sx={{ paddingBottom: isMobileDevice ? '100px' : '15px' }}>
        <SoftBox className={`${isMobileDevice && 'purchase-indent-new-header'}`}>
          {!isMobileDevice ? (
            <SoftBox className="convert-to-po-item-main-box">
              {allVendorData?.map((ele, index) => {
                return (
                  <Grid
                    container
                    spacing={1}
                    className="convert-to-po-item-box"
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    p={0}
                    mb={1}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigateToDetailsPage(ele)}
                    key={index}
                  >
                    <Grid item xs={0.2} md={0.2} lg={0.2} ml={2}>
                      <SoftBox style={{ width: '20px' }}>
                        <VerifiedIcon color={`${ele?.isVerified ? 'success' : 'disabled'}`} />
                      </SoftBox>
                    </Grid>
                    <Grid item xs={2.5} md={2.5} lg={2.5}>
                      <SoftTypography className="convert-to-po-text">Vendor Name</SoftTypography>
                      <SoftTypography className="convert-to-po-text-2">{ele?.vendorName || 'NA'}</SoftTypography>
                    </Grid>
                    <Grid item xs={1.5} md={1.5} lg={1.5}>
                      <SoftTypography className="convert-to-po-text">Total items</SoftTypography>
                      <SoftTypography className="convert-to-po-text-2">{ele?.totalItems}</SoftTypography>
                    </Grid>
                    <Grid item xs={1.5} md={1.5} lg={1.5}>
                      <SoftTypography className="convert-to-po-text">Total quantity</SoftTypography>
                      <SoftTypography className="convert-to-po-text-2">{ele?.totalQuantity}</SoftTypography>
                    </Grid>
                    <Grid item xs={1.5} md={2} lg={2} mt={1}>
                      <Tooltip title={ele?.purchaseTerms || 'NA'}>
                        <SoftTypography className="convert-to-po-text">Purchase Terms</SoftTypography>
                        <SoftTypography
                          className="convert-to-po-text-2"
                          style={{ height: '29.5px', overflowY: 'scroll' }}
                        >
                          {ele?.purchaseTerms || 'NA'}
                        </SoftTypography>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={1.5} md={1.5} lg={1.5}>
                      <SoftTypography className="convert-to-po-text">Amount</SoftTypography>
                      <SoftTypography className="convert-to-po-text-2">{ele?.amount || 0}</SoftTypography>
                    </Grid>
                  </Grid>
                );
              })}
            </SoftBox>
          ) : (
            <>
              <CommonId id={piNum} />
              <div className="ros-app-purchase-component-main-div" style={{ marginTop: '0.125rem' }}>
                <div className="bill-card-value">
                  <span>Select a vendor, since multiple vendor exist in this PI.</span>
                </div>
                <div
                  className="vendor-list"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.625rem',
                  }}
                >
                  {allVendorData?.map((ele, index) => (
                    <ConvertPOtoCart key={index} ele={ele} />
                  ))}
                </div>
              </div>
            </>
          )}
        </SoftBox>
        {allVendorData?.length > 0 && (
          <SoftBox className="convert-to-po-btn">
            <SoftButton
              className="vendor-second-btn picancel-btn"
              onClick={() => navigate(`/purchase/purchase-indent/details/${piNum}`)}
            >
              Cancel
            </SoftButton>
          </SoftBox>
        )}
      </SoftBox>
      {isMobileDevice && <BottomNavbar />}
    </DashboardLayout>
  );
};

export default ConvertToPOPage;
