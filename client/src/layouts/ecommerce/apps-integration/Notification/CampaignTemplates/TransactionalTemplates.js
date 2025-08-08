import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftSelect from '../../../../../components/SoftSelect';
import { getAllCategories, getCommAction } from '../../../../../config/Services';
import WELCOME_MESSAGE_file from '../HTMLEmailTemplates/1.welcome_email.html';
import RESET_PASSWORD_EMAIL_file from '../HTMLEmailTemplates/15.reset_password_email.html';
import PASSWORD_CHANGE_SUCCESSFULL_file from '../HTMLEmailTemplates/16.password_change_successful.html';
import OTP_file from '../HTMLEmailTemplates/2.otpEmail (1).html';
import CREDIT_NOTE_file from '../HTMLEmailTemplates/credit-note.html';
import DAY_CLOSED_file from '../HTMLEmailTemplates/day-closing-report-email.html';
import INVOICE_EMAIL_file from '../HTMLEmailTemplates/invoice-pallet-subscription.html';
import PAYMENT_RECORDED_file from '../HTMLEmailTemplates/payment-record.html';
import PAYMENT_REFUND_CONFIRMATION_file from '../HTMLEmailTemplates/PAYMENT_REFUND_CONFIRMATION(60).html';
import PI_APPROVED_file from '../HTMLEmailTemplates/pi-approved.html';
import PI_CLOSED_file from '../HTMLEmailTemplates/pi-closed.html';
import PI_CREATED_file from '../HTMLEmailTemplates/pi-created.html';
import PI_DELETED_file from '../HTMLEmailTemplates/pi-deleted.html';
import PI_REJECTED_file from '../HTMLEmailTemplates/pi-rejected.html';
import PO_APPROVED_file from '../HTMLEmailTemplates/po-approved.html';
import PO_CLOSED_file from '../HTMLEmailTemplates/po-closed.html';
import PO_CREATED_file from '../HTMLEmailTemplates/po-created.html';
import PO_DELETED_file from '../HTMLEmailTemplates/po-deleted.html';
import PO_REJECTED_file from '../HTMLEmailTemplates/po-rejected.html';
import QUOTE_CREATED_file from '../HTMLEmailTemplates/quote-added.html';
import QOUTE_APPROVED_file from '../HTMLEmailTemplates/quote-approved.html';
import QUOTE_DELETED_file from '../HTMLEmailTemplates/quote-deleted.html';
import QUOTE_REJECTED_file from '../HTMLEmailTemplates/quote-rejected.html';
import REFUND_REQUEST_file from '../HTMLEmailTemplates/refund-payment-confirmation.html';
import SALES_ORDER_CANCELLED_file from '../HTMLEmailTemplates/sales-order-cancelled.html';
import SALES_ORDER_DELIVERED_file from '../HTMLEmailTemplates/sales-order-delivered.html';
import SALES_ORDER_DELIVERED_FAILED_file from '../HTMLEmailTemplates/sales-order-delivery-failed.html';
import SALES_ORDER_REFUND_INITIATED_file from '../HTMLEmailTemplates/sales-order-payment-refund-confirmation.html';
import SALES_ORDER_PAYMENT_SUCCESSFULL_file from '../HTMLEmailTemplates/sales-order-payment-successful.html';
import SALES_ORDER_PLACED_file from '../HTMLEmailTemplates/sales-order-placed (1).html';
import SALES_ORDER_RETURNED_file from '../HTMLEmailTemplates/sales-order-returned.html';
import SALES_ORDER_SHIPPED_file from '../HTMLEmailTemplates/sales-order-shipped.html';
import SESSION_CLOSED_file from '../HTMLEmailTemplates/session-closing-report-for-date-email.html';
import SET_PIN_file from '../HTMLEmailTemplates/SET_PIN.html';
import BILL_CREATED_file from '../HTMLEmailTemplates/T016_PO_bill_created.html';
import BILL_APPROVED_file from '../HTMLEmailTemplates/T020_PO_bill_approved.html';
import BILL_REJECTED_file from '../HTMLEmailTemplates/T021_PO_bill_rejected.html';
import BILL_DELETED_file from '../HTMLEmailTemplates/T022_PO_bill_deleted.html';
import './templates.css';

const TransactionalTemplates = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [allActions, setAllActions] = useState([]);
  const [formattedCategories, setFormattedCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const [templateFileName, setTemplateFileName] = useState('');

  useEffect(() => {
    const formattedData = allCategories.map((category) => ({
      value: `${category.comCategoryId}`,
      label: `${category.comCategoryName}`,
    }));
    setFormattedCategories(formattedData);
  }, [allCategories]);

  useEffect(() => {
    getAllCategories().then((res) => {
      setAllCategories(res.data.data);
    });

    getCommAction().then((response) => {
      setAllActions(response.data.data);
    });
  }, []);

  const actionsByCategory = {};
  allActions.forEach((action) => {
    const categoryId = action.comCategoryId;
    if (!actionsByCategory[categoryId]) {
      actionsByCategory[categoryId] = [];
    }
    actionsByCategory[categoryId].push(action);
  });

  const formatActionName = (actionName) => {
    const words = actionName.split('_');
    const formattedWords = words.map((word) => {
      if (word.length === 2) {
        return word.toUpperCase(); // Capitalize both letters if the length is 2
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter
      }
    });
    return formattedWords.join(' ');
  };

  const handlePreviewTemplate = (actionName) => {
    switch (actionName) {
      case 'OTP':
        openNewTabWithHTMLContent(OTP_file);
        break;
      case 'PI_CREATED':
        openNewTabWithHTMLContent(PI_CREATED_file);
        break;
      case 'PI_APPROVED':
        openNewTabWithHTMLContent(PI_APPROVED_file);
        break;
      case 'PI_REJECTED':
        openNewTabWithHTMLContent(PI_REJECTED_file);
        break;
      case 'PI_DELETED':
        openNewTabWithHTMLContent(PI_DELETED_file);
        break;
      case 'QUOTE_CREATED':
        openNewTabWithHTMLContent(QUOTE_CREATED_file);
        break;
      case 'QUOTE_APPROVED':
        openNewTabWithHTMLContent(QOUTE_APPROVED_file);
        break;
      case 'QUOTE_REJECTED':
        openNewTabWithHTMLContent(QUOTE_REJECTED_file);
        break;
      case 'QUOTE_DELETED':
        openNewTabWithHTMLContent(QUOTE_DELETED_file);
        break;
      case 'PI_CLOSED':
        openNewTabWithHTMLContent(PI_CLOSED_file);
        break;
      case 'PO_CREATED':
        openNewTabWithHTMLContent(PO_CREATED_file);
        break;
      case 'PO_APPROVED':
        openNewTabWithHTMLContent(PO_APPROVED_file);
        break;
      case 'PO_REJECTED':
        openNewTabWithHTMLContent(PO_REJECTED_file);
        break;
      case 'PO_CLOSED':
        openNewTabWithHTMLContent(PO_CLOSED_file);
        break;
      case 'PO_DELETED':
        openNewTabWithHTMLContent(PO_DELETED_file);
        break;
      case 'PASSWORD_RESET_SUCESSFUL':
        openNewTabWithHTMLContent(PASSWORD_CHANGE_SUCCESSFULL_file);
        break;
      case 'RESET_PASSWORD':
        openNewTabWithHTMLContent(RESET_PASSWORD_EMAIL_file);
        break;
      case 'BILL_CREATED':
        openNewTabWithHTMLContent(BILL_CREATED_file);
        break;
      case 'BILL_APPROVED':
        openNewTabWithHTMLContent(BILL_APPROVED_file);
        break;
      case 'BILL_REJECTED':
        openNewTabWithHTMLContent(BILL_REJECTED_file);
        break;
      case 'BILL_DELETED':
        openNewTabWithHTMLContent(BILL_DELETED_file);
        break;
      case 'PAYMENT_RECORDED':
        openNewTabWithHTMLContent(PAYMENT_RECORDED_file);
        break;
      case 'REFUND_PAYMENT_RECEIVED':
        openNewTabWithHTMLContent(REFUND_REQUEST_file);
        break;
      case 'CREDIT_NOTE':
        openNewTabWithHTMLContent(CREDIT_NOTE_file);
        break;
      case 'WELCOME_MESSAGE':
        openNewTabWithHTMLContent(WELCOME_MESSAGE_file);
        break;
      case 'SET_PIN':
        openNewTabWithHTMLContent(SET_PIN_file);
        break;
      case 'SALES_ORDER_PLACED':
        openNewTabWithHTMLContent(SALES_ORDER_PLACED_file);
        break;
      case 'SALES_ORDER_CANCELLED':
        openNewTabWithHTMLContent(SALES_ORDER_CANCELLED_file);
        break;
      case 'SALES_ORDER_PAYMENT_SUCCESSFUL':
        openNewTabWithHTMLContent(SALES_ORDER_PAYMENT_SUCCESSFULL_file);
        break;
      case 'SALES_ORDER_SHIPPED':
        openNewTabWithHTMLContent(SALES_ORDER_SHIPPED_file);
        break;
      case 'SALES_ORDER_PAYMENT_REFUNDED_CONFIRMATION':
        openNewTabWithHTMLContent(PAYMENT_REFUND_CONFIRMATION_file);
        break;
      case 'SALES_ORDER_DELIVER_FAILED':
        openNewTabWithHTMLContent(SALES_ORDER_DELIVERED_FAILED_file);
        break;
      case 'SALES_ORDER_RETURNED':
        openNewTabWithHTMLContent(SALES_ORDER_RETURNED_file);
        break;
      case 'SALES_ORDER_REFUND_INITIATED':
        openNewTabWithHTMLContent(SALES_ORDER_REFUND_INITIATED_file);
        break;
      case 'SALES_ORDER_DELIVERED':
        openNewTabWithHTMLContent(SALES_ORDER_DELIVERED_file);
        break;
      case 'SESSION_CLOSED':
        openNewTabWithHTMLContent(SESSION_CLOSED_file);
        break;
      case 'DAY_CLOSED':
        openNewTabWithHTMLContent(DAY_CLOSED_file);
        break;
      case 'INVOICE_EMAIL':
        openNewTabWithHTMLContent(INVOICE_EMAIL_file);
        break;
      default:
        openNewTabWithHTMLContent('');
        break;
    }
  };

  const openNewTabWithHTMLContent = (htmlContent) => {
    const newWindow = window.open();
    setTimeout(() => {
      newWindow.document.write(htmlContent);
    }, 100); // Adjust the delay (in milliseconds) as needed
  };

  return (
    <div>
      <Box
        // className="table-css-fix-box-scroll-vend"
        className="search-bar-filter-and-table-container"
        style={{
          // boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
          position: 'relative',
          marginTop: '20px',
        }}
      >
        <SoftBox
          className="header-bulk-price-edit all-products-filter-wrapper"
          sx={{
            padding: '15px',
            bgcolor: 'var(--search-bar-filter-container-bg)',
          }}
          // variant="gradient"
          // bgColor="info"
        >
          <SoftSelect
            placeholder="Select Category"
            options={formattedCategories}
            insideHeader={true}
            className="all-products-filter-soft-select-box color"
            onChange={(option) => {
              setStatusFilter(option);
            }}
          />
        </SoftBox>
        <SoftBox
          py={0}
          px={0}
          sx={{
            padding: '20px',
          }}
        >
          {statusFilter && (
            <div key={statusFilter.value} style={{ marginTop: '10px' }}>
              <Typography>{statusFilter.label}</Typography>
              <SoftBox className="transactional-templates-box">
                {actionsByCategory[statusFilter.value]?.map((action) => (
                  <div className="transactional-template-single" key={action.comActionId}>
                    <Typography className="transactional-template-typo">
                      {formatActionName(action.comActionName)}
                    </Typography>
                    <Tooltip title="Preview Template">
                      <IconButton>
                        <VisibilityIcon
                          onClick={() => handlePreviewTemplate(action.comActionName)}
                          sx={{ color: '#0562fb', fontSize: '16px' }}
                        />
                      </IconButton>
                    </Tooltip>
                  </div>
                ))}
              </SoftBox>
              <hr />
            </div>
          )}

          {/* Render remaining categories beneath the selected category */}
          {allCategories.map((category) =>
            !statusFilter || category.comCategoryId !== statusFilter.value ? (
              <div key={category.comCategoryId} style={{ marginTop: '10px' }}>
                <Typography>{category.comCategoryName}</Typography>
                <SoftBox className="transactional-templates-box">
                  {actionsByCategory[category.comCategoryId]?.map((action) => (
                    <div className="transactional-template-single" key={action.comActionId}>
                      <Typography className="transactional-template-typo">
                        {formatActionName(action.comActionName)}
                      </Typography>
                      <Tooltip title="Preview Template">
                        <IconButton>
                          <VisibilityIcon
                            onClick={() => handlePreviewTemplate(action.comActionName)}
                            sx={{ color: '#0562fb', fontSize: '16px' }}
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ))}
                </SoftBox>
                <hr />
              </div>
            ) : null,
          )}
        </SoftBox>
      </Box>
    </div>
  );
};

export default TransactionalTemplates;
