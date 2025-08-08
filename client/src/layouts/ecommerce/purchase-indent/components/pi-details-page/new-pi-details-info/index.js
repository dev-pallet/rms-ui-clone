import './new-pi-details-info.css';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import { useMemo } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CommentComponent from '../../../../Common/new-ui-common-components/comment-component';
import CommonAddressCard from '../../../../Common/new-ui-common-components/purchase-common-components/common-addresses';
import CommonDataGrid from '../../../../Common/new-ui-common-components/common-datagrid';
import NewPurchaseDetailsPage from '../../../../Common/new-ui-common-components/purchase-common-components/purchase-details-page';

const NewPurchaseIndentDetailsPage = () => {
  const isMobileDevice = isSmallScreen();

  const purchaseInsightsArray = [
    {
      tabName: 'Out of Stock Analysis',
      tabValue: '3',
      tabDescription: 'product might be out of stock befor next cycle',
      tabIcon: '',
    },
    {
      tabName: 'Over Stock Analysis',
      tabValue: '7',
      tabDescription: 'product might be over stocked befor next cycle',
      tabIcon: '',
    },
    {
      tabName: 'Stock Turnover Analysis',
      tabValue: '45 days',
      tabDescription: '3 products might exceed 45 days or more',
      tabIcon: '',
    },
  ];

  const indentDetailsColumns = useMemo(
    () => [
      {
        field: 'orderedOn',
        headerName: 'Date',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 110,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'poNumber',
        headerName: 'PO ID',
        minWidth: 150,
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'grossAmount',
        headerName: 'Purchase value',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 150,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      // {
      //   field: 'orderedBy',
      //   headerName: 'Vendor',
      //   headerClassName: 'datagrid-columns',
      //   headerAlign: 'left',
      //   width: 200,
      //   cellClassName: 'datagrid-rows',
      //   align: "left",
      // },
      {
        field: 'status',
        headerName: 'Delivery',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 120,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
      {
        field: 'bills',
        headerName: 'Bills',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 80,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
        renderCell: (params) => {
          return <FiCheckCircle fontSize="large" color="green" />;
        },
      },
      {
        field: 'payments',
        headerName: 'Payments',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 80,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
        renderCell: (params) => {
          return <FiCheckCircle fontSize="large" />;
        },
      },
      {
        field: 'location',
        headerName: 'Location',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 80,
        cellClassName: 'datagrid-rows',
        align: 'left',
        flex: 1,
      },
    ],
    [],
  );

  const indentDetailsArray = [];

  return (
    <div>
      <NewPurchaseDetailsPage>
        <div className="vendor-details-pi">
          <CommonAddressCard title="Vendor Details" />
          <CommonAddressCard title="Billing Address" />
          <CommonAddressCard title="Shipping Address" />
        </div>
        {!isMobileDevice && (
          <div className="purchase-details-pinsights">
            <div className="pinsghts-title-main-container">
              <span className="purch-det-heading-title pinsights-title">Purchase Insights</span>
              <AutoAwesomeIcon className="copy-icon" />
            </div>
            <div className="purchase-insights-cards-main-container">
              {purchaseInsightsArray.map((item, index) => (
                <div className="pinsights-tab-main-container component-bg-br-sh-p" key={index}>
                  <span className="pinsights-tab-name">{item.tabName}</span>
                  <span className="pinsights-tab-value">{item.tabValue}</span>
                  <span className="pinsights-tab-desc">{item.tabDescription}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="purchase-details-datagrid">
          <div className="pinsghts-title-main-container">
            <span className="purch-det-heading-title pinsights-title">Indent Details</span>
          </div>
          <CommonDataGrid columns={indentDetailsColumns} rows={indentDetailsArray} />
          <div className="pinsghts-title-main-container">
            <span className="purch-det-heading-title pinsights-title">Puchase Related Details</span>
          </div>
          <CommonDataGrid columns={indentDetailsColumns} rows={indentDetailsArray} />
        </div>
        <div>
          <CommentComponent />
        </div>
      </NewPurchaseDetailsPage>
    </div>
  );
};

export default NewPurchaseIndentDetailsPage;
