import './style.css';
import { convertUTCtoIST } from '../../../../Common/CommonFunction';
import { exportTaxInvoice, salesPaymentDetails } from '../../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Spinner from '../../../../../../components/Spinner';

const SalesPaymentDetails = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { paymentId, orderId } = useParams();
  const [allData, setAllData] = useState({});
  const [paymentData, setPaymentData] = useState();
  const [orderValue, setOrderValue] = useState(0);
  const [fileLoader, setFileLoader] = useState(false);

  useEffect(() => {
    getSalesData();
  }, []);

  const getSalesData = () => {
    salesPaymentDetails(paymentId, orderId)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        if (res?.data?.data?.es === 2) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data;
        setAllData(response);
        setPaymentData(response?.paymentDetails);
        if (response?.baseOrderResponse?.amountPaid === 0) {
          setOrderValue(response?.baseOrderResponse?.outstandingAmount);
        } else if (
          response?.baseOrderResponse?.amountPaid !== 0 &&
          response?.baseOrderResponse?.outstandingAmount !== 0
        ) {
          setOrderValue(response?.baseOrderResponse?.amountPaid + response?.baseOrderResponse?.outstandingAmount);
        } else if (
          response?.baseOrderResponse?.amountPaid !== 0 &&
          response?.baseOrderResponse?.outstandingAmount === 0
        ) {
          setOrderValue(response?.baseOrderResponse?.amountPaid);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleInvoiceDownload = async () => {
    const payload = {
      orderId: orderId,
      orderType: allData?.baseOrderResponse?.salesChannel,
    };
    setFileLoader(true);
    try {
      const response = await exportTaxInvoice(payload);
      if (response?.status === 200) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Tax Invoice ${orderId} ${paymentId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        showSnackbar('Some error occurred', 'error');
        return null;
      }
      setFileLoader(false);
    } catch (err) {
      setFileLoader(false);
      showSnackbar('Payment Needs to be confirmed', 'error');
    }
  };

  const handleNavigate = () => {
    navigate(`/sales/returns/add/${orderId}`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      {/* Header */}
      <div className="sales-payment-main">
        {/* Payment header */}
        <div className="sales-payment-main-header" style={{ alignItems: 'center' }}>
          <div>
            <span className="sales-payment-main-head">Payments ₹ {paymentData?.amountPaid || 0}</span>
            <span
              className={
                paymentData?.paymentStatus === 'COMPLETED'
                  ? 'sales-payment-main-status-error'
                  : 'sales-payment-main-status-success'
              }
            >
              {paymentData?.paymentStatus || 'NA'}
            </span>
          </div>
          <div>
            <span className="sales-payment-main-refund-btn" onClick={handleNavigate}>
              + Refund
            </span>
            {/* <span>
              <MoreHorizIcon color="info" />{' '}
            </span> */}
          </div>
        </div>
        {/* Payment ID */}
        <div className="sales-payment-main-naming">Payment ID {paymentId}</div>
        <br />
        {/* Additional data */}
        <div className="sales-payment-main-header">
          <div className="sales-payment-main-header">
            <div className="sales-payment-additional-data">
              <span className="sales-payment-main-naming">Order value</span>
              <span className="sales-payment-additional-data-value">₹ {orderValue}</span>
            </div>
            <div className="sales-payment-additional-data">
              <span className="sales-payment-main-naming">Total amount paid</span>
              <span className="sales-payment-additional-data-value">
                ₹ {paymentData?.baseOrderResponse?.amountPaid || 0}
              </span>
            </div>
            <div className="sales-payment-additional-data">
              <span className="sales-payment-main-naming">Outstanding</span>
              <span className="sales-payment-additional-data-value">
                ₹ {allData?.baseOrderResponse?.outstandingAmount || '0'}
              </span>
            </div>
          </div>
          <div>
            <span className="sales-payment-main-naming">
              Tax Invoice {allData?.baseOrderResponse?.invoiceId || 'NA'}
              {'  '}
              {allData?.baseOrderResponse?.invoiceId &&
                (fileLoader ? (
                  <div>
                    <Spinner size={20} />
                  </div>
                ) : (
                  <FileDownloadIcon
                    color="success"
                    onClick={handleInvoiceDownload}
                    sx={{ cursor: 'pointer', fontSize: '20px' }}
                  />
                ))}
            </span>
          </div>
        </div>
      </div>
      {/* Payment details */}
      <div className="sales-payment-main-sub-heading">Payment details</div>
      <div className="sales-payment-main sales-payment-main-header">
        <div className="sales-payment-additional-data" style={{ maxWidth: '40%' }}>
          <span className="sales-payment-cust-name">Customer</span>
          <span className="sales-payment-cust-value">{allData?.baseOrderResponse?.customerName || 'NA'}</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Payment date</span>
          <span className="sales-payment-cust-value">{convertUTCtoIST(paymentData?.paymentDate) || 'NA'}</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Payment method</span>
          <span className="sales-payment-cust-value">{allData?.baseOrderResponse?.paymentMethod || 'NA'}</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Payment machine ID</span>
          <span className="sales-payment-cust-value">{paymentData?.paymentMachineId ?? 'NA'}</span>
        </div>
      </div>
      {/* Order details */}
      <div className="sales-payment-main-sub-heading">Order details</div>
      <div className="sales-payment-main sales-payment-main-header">
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Order ID</span>
          <span className="sales-payment-cust-value">{orderId}</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Order date</span>
          <span className="sales-payment-cust-value">
            {allData?.baseOrderResponse?.createdAt ? convertUTCtoIST(allData?.baseOrderResponse?.createdAt) : 'NA'}
          </span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Channel</span>
          <span className="sales-payment-cust-value">{allData?.baseOrderResponse?.salesChannel || 'NA'}</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Cashier</span>
          <span className="sales-payment-cust-value">{allData?.baseOrderResponse?.createdBy ?? 'NA'}</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Total items</span>
          <span className="sales-payment-cust-value">{allData?.baseOrderResponse?.numberOfLineItems || '0'}</span>
        </div>
      </div>

      {/* PO details */}
      {/* <div className="sales-payment-main-sub-heading">Purchase order details</div>
      <div className="sales-payment-main sales-payment-main-header">
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">PO number</span>
          <span className="sales-payment-cust-value">{allData?.baseOrderResponse?.poNumber || 'NA'}</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">PO date</span>
          <span className="sales-payment-cust-value">{allData?.baseOrderResponse?.poDate || 'NA'}</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">PO value</span>
          <span className="sales-payment-cust-value">{allData?.baseOrderResponse?.poValue || 'NA'}</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Payment due on</span>
          <span className="sales-payment-cust-value">{allData?.baseOrderResponse?.paymentDueOn || 'NA'}</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Total items</span>
          <span className="sales-payment-cust-value">{allData?.baseOrderResponse?.numberOfLineItems || 'NA'}</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Order status</span>
          <span className="sales-payment-cust-value">{allData?.baseOrderResponse?.orderStatus || 'NA'}</span>
        </div>
      </div> */}

      {/* Refund details */}
      {/* <div className="sales-payment-main-sub-heading">Refund details</div>
      <div className="sales-payment-main sales-payment-main-header">
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Refund ID</span>
          <span className="sales-payment-cust-value">RO020802</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Refund date</span>
          <span className="sales-payment-cust-value">23 May, 2024</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Refund value</span>
          <span className="sales-payment-cust-value">3245</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Refund mode</span>
          <span className="sales-payment-cust-value">UPI customer@okhdfcbank</span>
        </div>
        <div className="sales-payment-additional-data">
          <span className="sales-payment-cust-name">Total items</span>
          <span className="sales-payment-cust-value">34</span>
        </div>
      </div> */}
    </DashboardLayout>
  );
};

export default SalesPaymentDetails;
