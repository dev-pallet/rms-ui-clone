import { Divider, Grid, Stack } from '@mui/material';
import { useMediaQuery } from 'usehooks-ts';
import { textFormatter } from '../../../../../Common/CommonFunction';
import CustomMobileButton from '../../../../../Common/mobile-new-ui-components/button';

export const completeDetailColumns = [
  {
    field: 'title',
    headerName: 'Title',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 150,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'barcode',
    headerName: 'Barcode',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 120,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'mrp',
    headerName: 'MRP',
    minWidth: 50,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'rate',
    headerName: 'Rate',
    minWidth: 50,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 70,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'purchasePrice',
    headerName: 'Purchase Price',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 115,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'offers',
    headerName: 'Offers',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 60,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'discount',
    headerName: 'Discount',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 80,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'finalSalePrice',
    headerName: 'Final sale price',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 120,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'taxableValue',
    headerName: 'Taxable value',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 110,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'tax',
    headerName: 'Tax',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 50,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'cess',
    headerName: 'Cess',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 50,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'totalAmount',
    headerName: 'Amount',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 70,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
];

export const limitedDetailColumns = [
  {
    field: 'title',
    headerName: 'Title',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 150,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'barcode',
    headerName: 'Barcode',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 120,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'mrp',
    headerName: 'MRP',
    minWidth: 80,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'rate',
    headerName: 'Rate',
    minWidth: 80,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 80,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'quantityFullfilled',
    headerName: 'Quantity fulfilled',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 150,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'fillRate',
    headerName: 'Fill rate',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 80,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'totalAmount',
    headerName: 'Amount',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 100,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
];

export const discountArray = [
  {
    field: 'discountType',
    headerName: 'Discount type',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 160,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'title',
    headerName: 'Title (or) code',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 160,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'discountValue',
    headerName: 'Discount value',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 60,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'products',
    headerName: 'Products',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 60,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 60,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 60,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
];

export const shipmentArray = [
  {
    field: 'shipmentDate',
    headerName: 'Shipment date',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 100,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'shipmentMode',
    headerName: 'Shipment Mode',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 150,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 80,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'pickUpTime',
    headerName: 'Pick up time',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 100,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'deliveryDate',
    headerName: 'Delivery date',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 100,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'deliveryTime',
    headerName: 'Delivery time',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 80,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'deliveryBy',
    headerName: 'Delivery by',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 80,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
];

export const returnArray = [
  {
    field: 'title',
    headerName: 'Title',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 150,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'barcode',
    headerName: 'barcode',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 150,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'orderQuantity',
    headerName: 'Order quantity',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 80,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'salePrice',
    headerName: 'Sale price',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 100,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'returnQuantity',
    headerName: 'Return Quantity',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 100,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'deliveryTime',
    headerName: 'Delivery time',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 80,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    minWidth: 80,
    cellClassName: 'datagrid-rows',
    align: 'left',
    flex: 1,
  },
];

export const additionalInfoArray = [
  { infoName: 'Channel', infoValue: 'NA' },
  { infoName: 'Payment mode', infoValue: 'NA' },
  { infoName: 'PO date', infoValue: 'NA' },
  { infoName: 'PO number', infoValue: 'NA' },
  { infoName: 'Payment due on', infoValue: 'NA' },
  { infoName: 'Shipment', infoValue: 'NA' },
  { infoName: 'Cancelled reason', infoValue: 'NA' },
];

export const additionalInfoPOSArray = [
  { infoName: 'Channel', infoValue: 'NA' },
  { infoName: 'Payment mode', infoValue: 'NA' },
  { infoName: 'Order Type', infoValue: 'NA' },
  { infoName: 'Session ID', infoValue: 'NA' },
  { infoName: 'Terminal', infoValue: 'NA' },
  { infoName: 'Cashier', infoValue: 'NA' },
];

export const createGridChipArray = (salesChannel) => {
  return [
    { chipName: 'Order details', chipValue: 'order_details', toShow: true },
    {
      chipName: 'Discount',
      chipValue: 'discount',
      toShow: true,
    },
    {
      chipName: 'Shipment',
      chipValue: 'shipment',
      toShow: salesChannel === 'PALLET_POS' ? false : true,
    },
    {
      chipName: 'Returns',
      chipValue: 'returns',
      toShow: true,
    },
  ];
};

export const createAdditionalDetailsArray = (allData) => {
  return [
    {
      tabName: 'PO value',
      tabValue: 'poValue',
      tabDescription: `${allData?.baseOrderResponse?.purchaseDescValue || '0'}% difference`,
      tabIcon: '',
    },
    {
      tabName: 'Fill Rate',
      tabValue: 'fillRate',
      tabDescription: `${allData?.baseOrderResponse?.fillRateFrom || '0'} products`,
      tabIcon: '',
    },
    {
      tabName: 'Discounts',
      tabValue: 'discount',
      tabDescription: 'on this order',
      tabIcon: '',
    },
    {
      tabName: 'Returns',
      tabValue: 'returns',
      tabDescription: 'from this order',
      tabIcon: '',
    },
    {
      tabName: 'Additional expense',
      tabValue: 'addtionalCharge',
      tabDescription: `from ${allData?.orderBillingDetails?.billCount ?? 1} bill`,
      tabIcon: '',
    },
    {
      tabName: 'Quantity',
      tabValue: 'quantity',
      tabDescription: `from ${allData?.baseOrderResponse?.numberOfLineItems || '0'} products`,
      tabIcon: '',
    },
  ];
};

export const createPosArray = (allData) => {
  return [
    {
      tabName: 'Discounts',
      tabValue: 'discount',
      tabDescription: 'from MRP value',
      tabIcon: '',
    },
    {
      tabName: 'Coupons',
      tabValue: 'coupons',
      tabDescription: `${allData?.orderBillingDetails?.coupons || '0'} coupon applied`,
      tabIcon: '',
    },
    {
      tabName: 'Earned loyalty',
      tabValue: 'earnedLoyalty',
      tabDescription: `from ${allData?.orderBillingDetails?.earnedPoints || '0'} points`,
      tabIcon: '',
    },
    {
      tabName: 'Redeemed loyalty',
      tabValue: 'redeemLoyalty',
      tabDescription: `from ${allData?.orderBillingDetails?.loyaltyPointsValue || '0'} points`,
      tabIcon: '',
    },
    {
      tabName: 'Returns',
      tabValue: 'returns',
      tabDescription: `from ${allData?.returnDetails?.returnedItems?.length ?? 0} items`,
      tabIcon: '',
    },
    {
      tabName: 'Quantity',
      tabValue: 'quantity',
      tabDescription: `from ${allData?.baseOrderResponse?.numberOfLineItems ?? '0'} products`,
      tabIcon: '',
    },
  ];
};

export const createIndentDetailsChipArray = (addressDetails, salesChannel) => {
  return [
    { chipName: 'Order Timeline', chipValue: 'order_timeline', toShow: true },
    {
      chipName: 'Billing Address',
      chipValue: 'billing_address',
      toShow: addressDetails && salesChannel !== 'PALLET_POS',
    },
    {
      chipName: 'Shipping Address',
      chipValue: 'shipping_address',
      toShow: addressDetails && salesChannel !== 'PALLET_POS',
    },
    {
      chipName: 'Quick links',
      chipValue: 'quick_link',
      toShow: false,
    },
    {
      chipName: 'Cart Metrics',
      chipValue: 'cart_metric',
      toShow: salesChannel === 'PALLET_POS',
    },
    {
      chipName: 'Cart search items ',
      chipValue: 'cart_search_items',
      toShow: salesChannel === 'PALLET_POS',
    },
  ];
};

export const createMetricsData = (allData) => {
  return [
    { label: 'Scan %', value: `${allData?.cartMetrics?.scan || '0'}%` },
    { label: 'Items deleted', value: `${allData?.cartMetrics?.itemsDeleted || '0'}` },
    { label: 'Average time/ scan', value: `${allData?.cartMetrics?.avgTimePerScan || '0'}` },
    { label: 'Receipt prints', value: `${allData?.cartMetrics?.receiptPrints || '0'}` },
  ];
};

const handleProductNavigation = async (barcode) => {
  try {
    const productId = await productIdByBarcode(barcode);
    if (productId) {
      navigate(`/products/product/details/${productId}`);
    }
  } catch (error) {}
};

export const renderItemDetails = (data, index, handleProductNavigation) => {
  return (
    <div className="card-purchase-main-div">
      <div
        className="card-main-component pi-item-card-main-component"
        key={index}
        onClick={() => handleProductNavigation(data?.barcode)}
      >
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="card-title">
              {data?.title?.length > 30 ? textFormatter(data?.title)?.slice(0, 30) + '...' : textFormatter(data?.title)}
            </span>
            <span className="card-sub-title">Code: {data?.barcode}</span>
          </div>
        </div>
        <hr className="horizontal-line-app-ros" />
        <div className="indent-details-info-div width-100">
          <div className="stack-row-center-between width-100 display-item-in-center">
            <div className="flex-colum-align-start">
              <span className="card-sub-title">MRP</span>
              <span className="card-title">{`₹ ${data?.mrp ?? '0'}`}</span>
            </div>
            <div className="flex-colum-align-center">
              <span className="card-sub-title">Rate</span>
              <span className="card-title">₹ {data?.rate}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="card-sub-title">Qty</span>
              <span className="card-title">{`${data?.quantity ?? '0'}`}</span>
            </div>
          </div>

          <div className="stack-row-center-between width-100 display-item-in-center">
            <div className="flex-colum-align-start">
              <span className="card-sub-title">Cess</span>
              <span className="card-title">{data?.cess}</span>
            </div>
            <div className="flex-colum-align-center">
              <span className="card-sub-title">Tax</span>
              <span className="card-title">{data?.tax}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="card-sub-title">Final Price</span>
              <span className="card-title">{`${data?.finalSalePrice ?? 'NA'}`}</span>
            </div>
          </div>
          <div className="stack-row-center-between width-100 display-item-in-center">
            <div className="flex-colum-align-start">
              <span className="card-sub-title">Purchase price</span>
              <span className="card-title">{data?.purchasePrice}</span>
            </div>
            <div className="flex-colum-align-center">
              <span className="card-sub-title">Discounts</span>
              <span className="card-title">{data?.discount}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="card-sub-title">Offers</span>
              <span className="card-title">{data?.offers}</span>
            </div>
          </div>
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="card-title">Amount</span>
            </div>
            <div className="flex-colum-align-end">
              <CustomMobileButton variant="black-D" title={`₹ ${data?.totalAmount ?? '0'}`}>
                {data?.totalAmount}
              </CustomMobileButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const renderDiscountDetails = (data, index) => (
  <div className="card-purchase-main-div">
    <div className="card-main-component pi-item-card-main-component" key={index}>
      <div className="indent-details-info-div width-100">
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="card-sub-title">Dicount type</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="card-title">{data?.discountType}</span>
          </div>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="card-sub-title">Title</span>
          <span className="card-title">{data?.title}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="card-sub-title">Discount value</span>
          <span className="card-title">{data?.discountValue}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="card-sub-title">Products</span>
          <span className="card-title">{data?.products}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="card-sub-title">Quantity</span>
          <span className="card-title">{data?.quantity}</span>
        </div>
      </div>
      <hr className="horizontal-line-app-ros" />
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="card-sub-title">Amount</span>
        </div>
        <div className="flex-colum-align-end">
          <CustomMobileButton variant="black-D" title={`₹${data?.amount ?? '0'}`}>
            {data?.amount}
          </CustomMobileButton>
        </div>
      </div>
    </div>
  </div>
);

export const renderShipmentDetails = (data, index) => {
  return (
    <div className="card-purchase-main-div">
      <div className="card-main-component pi-item-card-main-component" key={index}>
        <div className="indent-details-info-div width-100">
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="card-sub-title">Status</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="card-title">{data?.shipmentStatus}</span>
            </div>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="card-sub-title">Mode</span>
            <span className="card-title">{data?.shipmentMode}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="card-sub-title">Pick up time</span>
            <span className="card-title">{data?.pickUpTime}</span>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="card-sub-title">Delivery date</span>
            <span className="card-title">{data?.delivery}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="card-sub-title">Delivery time</span>
            <span className="card-title">{data?.deliveryTime}</span>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="card-sub-title">Delivery by</span>
            <span className="card-title">{data?.deliveryBy}</span>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="card-sub-title">{data?.shipmentDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const renderReturnDetails = (data, index, handleProductNavigation) => {
  return (
    <div className="card-purchase-main-div">
      <div
        className="card-main-component pi-item-card-main-component"
        key={index}
        onClick={() => handleProductNavigation(data?.barcode)}
      >
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="card-title">
              {data?.title?.length > 30 ? textFormatter(data?.title)?.slice(0, 30) + '...' : textFormatter(data?.title)}
            </span>
            <span className="card-sub-title">Code: {data?.barcode}</span>
          </div>
        </div>
        <hr className="horizontal-line-app-ros" />
        <div className="indent-details-info-div width-100">
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="card-sub-title">Qunaity</span>
              <span className="card-title">{data?.orderQuantity}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="card-sub-title">Sale Price</span>
              <span className="card-title">{`${data?.salePrice ?? 'NA'}`}</span>
            </div>
          </div>
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="card-sub-title">Return Quantity</span>
              <span className="card-title">{data?.returnQuantity}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="card-sub-title">Delivery time</span>
              <span className="card-title">{data?.deliveryTime}</span>
            </div>
          </div>
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="card-title">Amount</span>
            </div>
            <div className="flex-colum-align-end">
              <CustomMobileButton variant="black-D" title={`₹ ${data?.amount ?? '0'}`}>
                {data?.totalAmount}
              </CustomMobileButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OtherDetailRow = ({ labelLeft, valueLeft, labelRight, valueRight, colorRight }) => (
  <div className="stack-row-center-between width-100">
    <div className="flex-colum-align-start">
      <span className="additional-name">{labelLeft}</span>
      <span className="additional-value">{valueLeft || 'NA'}</span>
    </div>
    <div className="flex-colum-align-end">
      <span className="additional-name">{labelRight}</span>
      <span className="additional-value" style={{ color: colorRight }}>
        {valueRight || 'NA'}
      </span>
    </div>
  </div>
);
