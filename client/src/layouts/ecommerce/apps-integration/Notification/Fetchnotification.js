import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Tooltip,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FileUploadIcon from '@mui/icons-material/FileUpload';
import InfoIcon from '@mui/icons-material/Info';
import {
  deletePreferenceData,
  disableNotification,
  getAllPreferedData,
  getCommActionByCategory,
  getCustomerDetails,
  getEmailConnect,
  getEmailConnectedStatus,
  getSubUser,
  getWarehouseData,
  getWhatsAppConnected,
  postPreferenceData,
  postSMSTemplateById,
  postTemplateById,
  postTemplateUpdate,
  postWhatsAppTemplateById,
} from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import WELCOME_MESSAGE_file from './HTMLEmailTemplates/1.welcome_email.html';
import RESET_PASSWORD_EMAIL_file from './HTMLEmailTemplates/15.reset_password_email.html';
import PASSWORD_CHANGE_SUCCESSFULL_file from './HTMLEmailTemplates/16.password_change_successful.html';
import OTP_EMAIL_file from './HTMLEmailTemplates/2.otpEmail (1).html';
import CREDIT_NOTE_file from './HTMLEmailTemplates/credit-note.html';
import DAY_CLOSED_file from './HTMLEmailTemplates/day-closing-report-email.html';
import INVOICE_EMAIL_file from './HTMLEmailTemplates/invoice-pallet-subscription.html';
import PAYMENT_RECORDED_file from './HTMLEmailTemplates/payment-record.html';
import PAYMENT_REFUND_CONFIRMATION_file from './HTMLEmailTemplates/PAYMENT_REFUND_CONFIRMATION(60).html';
import PI_APPROVED_file from './HTMLEmailTemplates/pi-approved.html';
import PI_CLOSED_file from './HTMLEmailTemplates/pi-closed.html';
import PI_CREATED_file from './HTMLEmailTemplates/pi-created.html';
import PI_DELETED_file from './HTMLEmailTemplates/pi-deleted.html';
import PI_REJECTED_file from './HTMLEmailTemplates/pi-rejected.html';
import PO_APPROVED_file from './HTMLEmailTemplates/po-approved.html';
import PO_CLOSED_file from './HTMLEmailTemplates/po-closed.html';
import PO_CREATED_file from './HTMLEmailTemplates/po-created.html';
import PO_DELETED_file from './HTMLEmailTemplates/po-deleted.html';
import PO_REJECTED_file from './HTMLEmailTemplates/po-rejected.html';
import QUOTE_CREATED_file from './HTMLEmailTemplates/quote-added.html';
import QOUTE_APPROVED_file from './HTMLEmailTemplates/quote-approved.html';
import QUOTE_DELETED_file from './HTMLEmailTemplates/quote-deleted.html';
import QUOTE_REJECTED_file from './HTMLEmailTemplates/quote-rejected.html';
import REFUND_REQUEST_file from './HTMLEmailTemplates/refund-payment-confirmation.html';
import SALES_ORDER_CANCELLED_file from './HTMLEmailTemplates/sales-order-cancelled.html';
import SALES_ORDER_DELIVERED_file from './HTMLEmailTemplates/sales-order-delivered.html';
import SALES_ORDER_DELIVERED_FAILED_file from './HTMLEmailTemplates/sales-order-delivery-failed.html';
import SALES_ORDER_REFUND_INITIATED_file from './HTMLEmailTemplates/sales-order-payment-refund-confirmation.html';
import SALES_ORDER_PAYMENT_SUCCESSFULL_file from './HTMLEmailTemplates/sales-order-payment-successful.html';
import SALES_ORDER_PLACED_file from './HTMLEmailTemplates/sales-order-placed (1).html';
import SALES_ORDER_RETURNED_file from './HTMLEmailTemplates/sales-order-returned.html';
import SALES_ORDER_SHIPPED_file from './HTMLEmailTemplates/sales-order-shipped.html';
import SESSION_CLOSED_file from './HTMLEmailTemplates/session-closing-report-for-date-email.html';
import SET_PIN_file from './HTMLEmailTemplates/SET_PIN.html';
import BILL_CREATED_file from './HTMLEmailTemplates/T016_PO_bill_created.html';
import BILL_APPROVED_file from './HTMLEmailTemplates/T020_PO_bill_approved.html';
import BILL_REJECTED_file from './HTMLEmailTemplates/T021_PO_bill_rejected.html';
import BILL_DELETED_file from './HTMLEmailTemplates/T022_PO_bill_deleted.html';
import './Notificationsettings.css';

const defaultEmails = ['no-reply@twinleave.co', 'user02@gmail.com'];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Fetchnotification = ({ comCategoryId, selectedNotification }) => {
  //
  const [open, setOpen] = useState(false);
  const [waopen, setWaopen] = useState(false);
  const [actions, setActions] = useState([]);
  const [fornatedactions, setFormatedactions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(defaultEmails[0]);
  const [currentactionid, setCurrentActionid] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [dialogItem, setDialogItem] = useState('');
  const [comActionId, setComActionId] = useState('');
  const [preferenceData, setPreferenceData] = useState([]);
  const [checked, setChecked] = useState(false);
  const [templateFile, setTemplateFile] = useState('');
  const [currentActionName, setCurrentActionName] = useState('');
  const [notificationChannelOpen, setNotificationChannelOpen] = useState(false);
  const [emailPreferenceData, setEmailPreferenceData] = useState([]);
  const [SMSPreferenceData, setSMSPreferenceData] = useState([]);
  const [WhatsAppPreferenceData, setWhatsAppPreferenceData] = useState([]);
  const [subUser, setSubUser] = useState(false);
  const [SMSMessage, setSMSMessage] = useState('');
  const [email, setEmail] = useState(false);
  const [disable, setDisable] = useState(false);
  const [RetailOwner, setRetailOwner] = useState('');
  const [WMSOwner, setWMSOwner] = useState('');
  const [disableUpdateBtn, setDisableUpdateBtn] = useState(true);
  const [preferenceRefId, setPreferenceRefId] = useState([]);
  const [openDisableEmail, setOpenDisableEmail] = useState(false);
  const [openDisableWa, setOpenDisableWa] = useState(false);
  const [openDisableSMS, setOpenDisableSMS] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [whatsAppConnect, setWhatsAppConnect] = useState(false);
  const [pushPreferenceData, setPushPreferenceData] = useState([]);
  const [openDisablePush, setOpenDisablePush] = useState(false);

  const showSnackbar = useSnackbar();

  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (email) => {
    setOpenDialog(false);
    setSelectedEmail(email);
  };

  const handlewasubscribe = (action) => {
    navigate('/notificationconnect');
    setWaopen(false);
  };

  const handleSmssubscribe = (action) => {
    navigate('/notificationconnect');
    setSmsOpen(false);
  };

  // for enable notifications
  const handleOpenNotification = (item, actionid) => {
    // console.log('Click notification 123 : ', item);

    setNotificationOpen(true);
    setDialogItem(item);
    setComActionId(actionid);
    // console.log(dialogItem, '123');
  };

  const handleCheckboxChanged = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedItem((prev) => [...prev, name]);
      setDisable(true);
    } else {
      setSelectedItem((prev) => prev.filter((item) => item !== name));
      setDisable(false);
    }
  };

  const orgId = localStorage.getItem('orgId');
  const username = localStorage.getItem('user_name');
  const emailCc = localStorage.getItem('user_details');
  const clientId = localStorage.getItem('clientId');
  const obj = JSON.parse(emailCc);
  const orgType = localStorage.getItem('contextType');
  const sourceApp = localStorage.getItem('sourceApp');

  useEffect(() => {
    getCustomerDetails(orgId).then((res) => {
      // console.log(res.data.data.retail.contacts[0].email)
      setRetailOwner(res.data.data.retail.contacts[0].email);
    });
    getWarehouseData(orgId).then((res) => {
      // console.log(res.data.data.warehouseOrganisationResponse.primaryContactDto.email)
      setWMSOwner(res.data.data.warehouseOrganisationResponse.primaryContactDto.email);
    });
  }, []);

  useEffect(() => {
    const fetchSubuser = async () => {
      try {
        getEmailConnectedStatus(clientId).then((res) => {
          if (res?.data?.data?.message === 'Email Connected') {
            setSubUser(true);
          }
        });
      } catch (error) {
        showSnackbar('Error: Email not Connected', 'error');
      }
    };
    const fetchWhatsappConnect = async () => {
      try {
        await getWhatsAppConnected(clientId).then((res) => {
          if (res?.data?.data?.clientStatus === 'SUBSCRIBED') {
            setWhatsAppConnect(true);
          } else if (res?.data?.data?.clientStatus === 'UNSUBSCRIBED') {
            setWhatsAppConnect(false);
          }
        });
      } catch (error) {
        showSnackbar('Error: WhatsApp not connected', 'error');
      }
    };
    fetchWhatsappConnect();
    fetchSubuser();
  }, []);

  const payload = {
    orgId: orgId,
    comActionId: comActionId,
    limit: '',
    usedLimit: '',
    createdBy: '',
    emailCc: [
      {
        email: WMSOwner !== '' ? WMSOwner : RetailOwner,
        name: username,
      },
    ],
    emailBcc: [
      {
        email: 'support@palletnow.co',
        name: '',
      },
    ],
    subject: dialogItem,
  };

  const [checkboxData, setCheckboxData] = useState([
    { id: 'Customer Created', sms: false, email: false, whatsapp: false },
  ]);

  const data = [];
  const emailData = [];
  const SMSData = [];
  const WhatsAppData = [];
  const pushData = [];
  const fetchData = async () => {
    try {
      await getCommActionByCategory(comCategoryId).then((res) => {
        //console.log(res.data.data);
        setActions(res?.data?.data);

        for (let i = 0; i < res?.data?.data?.length; i++) {
          getAllPreferedData(orgId, res?.data?.data[i]?.comActionName).then((response) => {
            //console.log(res.data.data[i].comActionName, response.data.data.templates[0].templateType)
            const templateType = 'templateType';
            data.push(
              {
                [res?.data?.data[i]?.comActionName]: response?.data?.data?.prefRefid !== '',
              },
              {
                [`${res?.data?.data[i]?.comActionName}_refId`]: response?.data?.data?.prefRefid,
              },
            );
            if (response?.data?.data?.templates?.length !== 0) {
              emailData.push(
                {
                  [res?.data?.data[i]?.comActionName]: response?.data?.data?.templates?.some(
                    (obj) => obj.hasOwnProperty(templateType) && obj[templateType] === 'EMAIL',
                  ),
                },
                {
                  [`${res?.data?.data[i]?.comActionName}_templateId`]: response?.data?.data?.templates?.find(
                    (obj) => obj.hasOwnProperty('templateType') && obj.templateType === 'EMAIL',
                  )?.templateId,
                },
                {
                  [`${res?.data?.data[i]?.comActionName}_templateName`]: response?.data?.data?.templates?.find(
                    (obj) => obj.hasOwnProperty('templateType') && obj?.templateType === 'EMAIL',
                  )?.templateName,
                },
                {
                  [`${res?.data?.data[i]?.comActionName}_refId`]: response?.data?.data?.templates?.find(
                    (obj) => obj.hasOwnProperty('templateType') && obj?.templateType === 'EMAIL',
                  )?.refId,
                },
              );
              SMSData.push(
                {
                  [res?.data?.data[i]?.comActionName]: response?.data?.data?.templates?.some(
                    (obj) => obj.hasOwnProperty(templateType) && obj[templateType] === 'SMS',
                  ),
                },
                {
                  [`${res?.data?.data[i]?.comActionName}_templateId`]: response?.data?.data?.templates?.find(
                    (obj) => obj.hasOwnProperty('templateType') && obj?.templateType === 'SMS',
                  )?.templateId,
                },
                {
                  [`${res?.data?.data[i]?.comActionName}_templateName`]: response?.data?.data?.templates?.find(
                    (obj) => obj.hasOwnProperty('templateType') && obj?.templateType === 'SMS',
                  )?.templateName,
                },
                {
                  [`${res?.data?.data[i]?.comActionName}_refId`]: response?.data?.data?.templates?.find(
                    (obj) => obj.hasOwnProperty('templateType') && obj?.templateType === 'SMS',
                  )?.refId,
                },
              );
            }

            if (response?.data?.data?.socialTemplates?.length !== 0) {
              const templateType = 'templateType';
              WhatsAppData.push(
                {
                  [res?.data?.data[i]?.comActionName]: response?.data?.data?.socialTemplates?.some(
                    (obj) => obj.hasOwnProperty(templateType) && obj[templateType] === 'WHATSAPP',
                  ),
                },
                {
                  [`${res?.data?.data[i]?.comActionName}_refId`]: response?.data?.data?.socialTemplates?.find(
                    (obj) => obj.hasOwnProperty(templateType) && obj[templateType] === 'WHATSAPP',
                  )?.refId,
                },
              );
            }

            if (response?.data?.data?.templates?.length !== 0) {
              pushData?.push(
                {
                  [res?.data?.data[i]?.comActionName]: response?.data?.data?.templates?.some(
                    (obj) => obj.hasOwnProperty(templateType) && obj[templateType] === 'PUSH',
                  ),
                },
                {
                  [`${res?.data?.data[i]?.comActionName}_templateId`]: response?.data?.data?.templates?.find(
                    (obj) => obj.hasOwnProperty('templateType') && obj?.templateType === 'PUSH',
                  )?.templateId,
                },
                {
                  [`${res?.data?.data[i]?.comActionName}_templateName`]: response?.data?.data?.templates?.find(
                    (obj) => obj.hasOwnProperty('templateType') && obj?.templateType === 'PUSH',
                  )?.templateName,
                },
                {
                  [`${res?.data?.data[i]?.comActionName}_refId`]: response?.data?.data?.templates?.find(
                    (obj) => obj.hasOwnProperty('templateType') && obj?.templateType === 'PUSH',
                  )?.refId,
                },
              );
            }
          });
        }

        setTimeout(() => {
          setEmailPreferenceData(emailData);
          setPreferenceData(data);
          setSMSPreferenceData(SMSData);
          setWhatsAppPreferenceData(WhatsAppData);
          setPushPreferenceData(pushData);
        }, 1000);
      });
    } catch (error) {
      showSnackbar('Error: Not able to fetch Data', 'error');
      // console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedNotification]);

  useEffect(() => {
    const formattedData = actions.map((action) => ({
      actionid: `${action.comActionId}`,
      id: `${action.comActionName}`.replace(/_/g, ' '),
    }));
    setFormatedactions(formattedData);
    // preferenceData.forEach((obj) => {
    //   Object.entries(obj).forEach(([key, value]) => {
    //   });
    // });
    // console.log('preference', preferenceData);
    // console.log('email-preference', emailPreferenceData);
    // console.log("SMS-preference",SMSPreferenceData)
    // console.log("preferenceId", preferenceRefId)
    // console.log("whats", WhatsAppPreferenceData)
  }, [actions, emailPreferenceData, SMSPreferenceData, WhatsAppPreferenceData]);

  const handleDisable = () => {
    setChecked(false);
    setSelectedItem((prevSelectedItems) => {
      if (prevSelectedItems) {
        return prevSelectedItems.filter((item) => item !== dialogItem);
      }
      return [];
    });

    function findTemplateRefId(action) {
      const templateNameProperty = `${action}_refId`;
      const templateObject = preferenceData.find((obj) => obj.hasOwnProperty(templateNameProperty));

      if (templateObject) {
        return templateObject[templateNameProperty];
      } else {
        return null;
      }
    }

    const payload = {
      refId: findTemplateRefId(dialogItem.replace(/ /g, '_')),
    };

    try {
      deletePreferenceData(payload);
      setComActionId('');
      handleClose();

      showSnackbar(`Notification Service for ${dialogItem} is disabled`, 'success');
      fetchData();
    } catch (error) {
      showSnackbar('Error: Not able to disable', 'error');
    }
  };

  const handleEnable = () => {
    setChecked(true);
    // setSelectedItem(prevSelectedItems => [...prevSelectedItems, dialogItem]);
    // setSelectedItem(prevSelectedItems => prevSelectedItems.concat(dialogItem));
    if (Array.isArray(selectedItem)) {
      setSelectedItem((prevSelectedItems) => {
        const updatedSelectedItems = Array.isArray(prevSelectedItems)
          ? [...prevSelectedItems, dialogItem]
          : [dialogItem];
        return updatedSelectedItems;
      });
    }
    handleClose();

    try {
      postPreferenceData(payload);
      fetchData();

      showSnackbar(`Notification for ${dialogItem} Enabled`, 'success');
      setTemplateFile(dialogItem.replace(/ /g, '_'));
      setSMSMessage(dialogItem.replace(/ /g, '_'));
    } catch (error) {
      showSnackbar(`${dialogItem} not Selected`, 'error');
    }
  };

  const [savedcheckbox, SetSavedcheckbox] = useState([]);

  const handleClickOpen = (actionid, actionName) => {
    setOpen(true);
    //
    setCurrentActionid(actionid);
    setCurrentActionName(actionName);
  };

  const handleSMSClickOpen = (actionid, actionName) => {
    setSmsOpen(true);
    //
    setCurrentActionid(actionid);
    setCurrentActionName(actionName);
  };

  const handleClose = () => {
    setOpen(false);
    setWaopen(false);
    setSmsOpen(false);
    setNotificationOpen(false);
    setDialogItem('');
  };

  const handlewaClickOpen = (actionid) => {
    setWaopen(true);
    //
    setCurrentActionid(actionid);
  };

  //creating a unique template name
  const generateUniqueName = (id) => {
    const timestamp = Date.now();
    return `${id.replace(/ /g, '_')}_${timestamp}`;
  };

  let templateFileName = '';

  // handle new template update

  const handleUpdateTemplate = (id, actionId) => {
    switch (id.replace(/ /g, '_')) {
      case 'PI_CREATED':
        templateFileName = PI_CREATED_file;
        break;
      case 'PI_APPROVED':
        templateFileName = PI_APPROVED_file;
        break;
      case 'PI_REJECTED':
        templateFileName = PI_REJECTED_file;
        break;
      case 'PI_DELETED':
        templateFileName = PI_DELETED_file;
        break;
      case 'QUOTE_CREATED':
        templateFileName = QUOTE_CREATED_file;
        break;
      case 'QUOTE_APPROVED':
        templateFileName = QOUTE_APPROVED_file;
        break;
      case 'QUOTE_REJECTED':
        templateFileName = QUOTE_REJECTED_file;
        break;
      case 'QUOTE_DELETED':
        templateFileName = QUOTE_DELETED_file;
        break;
      case 'PI_CLOSED':
        templateFileName = PI_CLOSED_file;
        break;
      case 'PO_CREATED':
        templateFileName = PO_CREATED_file;
        break;
      case 'PO_APPROVED':
        templateFileName = PO_APPROVED_file;
        break;
      case 'PO_REJECTED':
        templateFileName = PO_REJECTED_file;
        break;
      case 'PO_CLOSED':
        templateFileName = PO_CLOSED_file;
        break;
      case 'PO_DELETED':
        templateFileName = PO_DELETED_file;
        break;
      case 'OTP':
        templateFileName = OTP_EMAIL_file;
        break;
      case 'PASSWORD_RESET_SUCESSFUL':
        templateFileName = PASSWORD_CHANGE_SUCCESSFULL_file;
        break;
      case 'RESET_PASSWORD':
        templateFileName = RESET_PASSWORD_EMAIL_file;
        break;
      case 'BILL_CREATED':
        templateFileName = BILL_CREATED_file;
        break;
      case 'BILL_APPROVED':
        templateFileName = BILL_APPROVED_file;
        break;
      case 'BILL_REJECTED':
        templateFileName = BILL_REJECTED_file;
        break;
      case 'BILL_DELETED':
        templateFileName = BILL_DELETED_file;
        break;
      case 'PAYMENT_RECORDED':
        templateFileName = PAYMENT_RECORDED_file;
        break;
      case 'REFUND_PAYMENT_RECEIVED':
        templateFileName = REFUND_REQUEST_file;
        break;
      case 'CREDIT_NOTE':
        templateFileName = CREDIT_NOTE_file;
        break;
      case 'WELCOME_MESSAGE':
        templateFileName = WELCOME_MESSAGE_file;
        break;
      case 'SET_PIN':
        templateFileName = SET_PIN_file;
        break;
      case 'SALES_ORDER_PLACED':
        templateFileName = SALES_ORDER_PLACED_file;
        break;
      case 'SALES_ORDER_CANCELLED':
        templateFileName = SALES_ORDER_CANCELLED_file;
        break;
      case 'SALES_ORDER_PAYMENT_SUCCESSFUL':
        templateFileName = SALES_ORDER_PAYMENT_SUCCESSFULL_file;
        break;
      case 'SALES_ORDER_SHIPPED':
        templateFileName = SALES_ORDER_SHIPPED_file;
        break;
      case 'SALES_ORDER_PAYMENT_REFUNDED_CONFIRMATION':
        templateFileName = PAYMENT_REFUND_CONFIRMATION_file;
        break;
      case 'SALES_ORDER_DELIVER_FAILED':
        templateFileName = SALES_ORDER_DELIVERED_FAILED_file;
        break;
      case 'SALES_ORDER_RETURNED':
        templateFileName = SALES_ORDER_RETURNED_file;
        break;
      case 'SALES_ORDER_REFUND_INITIATED':
        templateFileName = SALES_ORDER_REFUND_INITIATED_file;
        break;
      case 'SALES_ORDER_DELIVERED':
        templateFileName = SALES_ORDER_DELIVERED_file;
        break;
      case 'SESSION_CLOSED':
        templateFileName = SESSION_CLOSED_file;
        break;
      case 'DAY_CLOSED':
        templateFileName = DAY_CLOSED_file;
        break;
      case 'INVOICE_EMAIL':
        templateFileName = INVOICE_EMAIL_file;
        break;
      default:
        templateFileName = '';
        break;
    }
    function findTemplateName(action) {
      const templateNameProperty = `${action}_templateName`;
      const templateObject = emailPreferenceData.find((obj) => obj.hasOwnProperty(templateNameProperty));

      if (templateObject) {
        return templateObject[templateNameProperty];
      } else {
        return null;
      }
    }

    function findTemplateId(action) {
      const templateNameProperty = `${action}_templateId`;
      const templateObject = emailPreferenceData.find((obj) => obj.hasOwnProperty(templateNameProperty));

      if (templateObject) {
        return templateObject[templateNameProperty];
      } else {
        return null;
      }
    }

    const payload = {
      templateId: findTemplateId(id.replace(/ /g, '_')),
      templateName: findTemplateName(id.replace(/ /g, '_')),
      templateFormate: 'string',
      templateType: 'EMAIL',
      userId: obj.uidx,
      clientId: clientId,
    };
    const jsonPayload = JSON.stringify(payload);
    const filePayload = new Blob([templateFileName], { type: 'text/html' });
    const templatePayload = new Blob([JSON.stringify(payload)], { type: 'application/json' });

    const formData = new FormData();
    formData.append('file', filePayload);
    formData.append('updateEmailTemplateModel', templatePayload);

    try {
      postTemplateUpdate(formData).then((res) => {
        showSnackbar(`Email Template for ${id} Updated`, 'success');
      });
    } catch (error) {
      showSnackbar(`Error: Template for ${id} not updated`, 'error');
    }
  };

  // handle Email Change

  const handleCheckboxChange = (event, id, type, actionId) => {
    const updatedCheckboxData = fornatedactions.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [type]: event.target.checked,
        };
      }
      return item;
    });

    setFormatedactions(updatedCheckboxData);
    switch (id.replace(/ /g, '_')) {
      case 'PI_CREATED':
        templateFileName = PI_CREATED_file;
        break;
      case 'PI_APPROVED':
        templateFileName = PI_APPROVED_file;
        break;
      case 'PI_REJECTED':
        templateFileName = PI_REJECTED_file;
        break;
      case 'PI_DELETED':
        templateFileName = PI_DELETED_file;
        break;
      case 'QUOTE_CREATED':
        templateFileName = QUOTE_CREATED_file;
        break;
      case 'QUOTE_APPROVED':
        templateFileName = QOUTE_APPROVED_file;
        break;
      case 'QUOTE_REJECTED':
        templateFileName = QUOTE_REJECTED_file;
        break;
      case 'QUOTE_DELETED':
        templateFileName = QUOTE_DELETED_file;
        break;
      case 'PI_CLOSED':
        templateFileName = PI_CLOSED_file;
        break;
      case 'PO_CREATED':
        templateFileName = PO_CREATED_file;
        break;
      case 'PO_APPROVED':
        templateFileName = PO_APPROVED_file;
        break;
      case 'PO_REJECTED':
        templateFileName = PO_REJECTED_file;
        break;
      case 'PO_CLOSED':
        templateFileName = PO_CLOSED_file;
        break;
      case 'PO_DELETED':
        templateFileName = PO_DELETED_file;
        break;
      case 'OTP':
        templateFileName = OTP_EMAIL_file;
        break;
      case 'PASSWORD_RESET_SUCESSFUL':
        templateFileName = PASSWORD_CHANGE_SUCCESSFULL_file;
        break;
      case 'RESET_PASSWORD':
        templateFileName = RESET_PASSWORD_EMAIL_file;
        break;
      case 'BILL_CREATED':
        templateFileName = BILL_CREATED_file;
        break;
      case 'BILL_APPROVED':
        templateFileName = BILL_APPROVED_file;
        break;
      case 'BILL_REJECTED':
        templateFileName = BILL_REJECTED_file;
        break;
      case 'BILL_DELETED':
        templateFileName = BILL_DELETED_file;
        break;
      case 'PAYMENT_RECORDED':
        templateFileName = PAYMENT_RECORDED_file;
        break;
      case 'REFUND_PAYMENT_RECEIVED':
        templateFileName = REFUND_REQUEST_file;
        break;
      case 'CREDIT_NOTE':
        templateFileName = CREDIT_NOTE_file;
        break;
      case 'WELCOME_MESSAGE':
        templateFileName = WELCOME_MESSAGE_file;
        break;
      case 'SET_PIN':
        templateFileName = SET_PIN_file;
        break;
      case 'SALES_ORDER_PLACED':
        templateFileName = SALES_ORDER_PLACED_file;
        break;
      case 'SALES_ORDER_CANCELLED':
        templateFileName = SALES_ORDER_CANCELLED_file;
        break;
      case 'SALES_ORDER_PAYMENT_SUCCESSFUL':
        templateFileName = SALES_ORDER_PAYMENT_SUCCESSFULL_file;
        break;
      case 'SALES_ORDER_SHIPPED':
        templateFileName = SALES_ORDER_SHIPPED_file;
        break;
      case 'SALES_ORDER_PAYMENT_REFUNDED_CONFIRMATION':
        templateFileName = PAYMENT_REFUND_CONFIRMATION_file;
        break;
      case 'SALES_ORDER_DELIVER_FAILED':
        templateFileName = SALES_ORDER_DELIVERED_FAILED_file;
        break;
      case 'SALES_ORDER_RETURNED':
        templateFileName = SALES_ORDER_RETURNED_file;
        break;
      case 'SALES_ORDER_REFUND_INITIATED':
        templateFileName = SALES_ORDER_REFUND_INITIATED_file;
        break;
      case 'SALES_ORDER_DELIVERED':
        templateFileName = SALES_ORDER_DELIVERED_file;
        break;
      case 'SESSION_CLOSED':
        templateFileName = SESSION_CLOSED_file;
        break;
      case 'DAY_CLOSED':
        templateFileName = DAY_CLOSED_file;
        break;
      case 'INVOICE_EMAIL':
        templateFileName = INVOICE_EMAIL_file;
        break;
      default:
        templateFileName = '';
        break;
    }

    //setTemplateFile(actionId)

    const payload = {
      templateName: generateUniqueName(id),
      templateFormat: 'string',
      templateType: 'EMAIL',
      userId: obj.uidx,
      clientId: clientId,
    };
    const jsonPayload = JSON.stringify(payload);
    const filePayload = new Blob([templateFileName], { type: 'text/html' });
    const templatePayload = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('file', filePayload);
    formData.append('template', templatePayload);
    try {
      postTemplateById(formData, actionId).then((res) => {
        showSnackbar(`Email Service for ${id} Connected`, 'success');
        fetchData();
      });
    } catch (error) {
      showSnackbar('Email Service not Connected', 'error');
    }
  };

  let SMSTemplate = '';
  let SMSdltTemplateId = '';

  // handle new SMS template update
  const handleSMSUpdateTemplate = (id, action) => {
    switch (id.replace(/ /g, '_')) {
      case 'OTP':
        SMSTemplate =
          '#${otp} is your one time password for Pallet authentication. Pallet never calls to ask for OTP. This OTP expires in ${time} minutes /${hash}';
        SMSdltTemplateId = '1007862408994241521';
        break;
      case 'PI_CREATED':
        SMSTemplate =
          'Hey ${name} a new Purchase Indent ${piNumber} is created. Please review and approve it.\r\n\r\nThank You!\r\n—\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007491825928717670';
        break;
      case 'PI_APPROVED':
        SMSTemplate =
          'Hey, a new Purchase Indent ${piNumber} has been approved by ${name} and assigned to you.\r\nThank You! Team Pallet.';
        SMSdltTemplateId = '1007729421531479294';
        break;
      case 'PI_REJECTED':
        SMSTemplate =
          'Your Purchase Indent ${piNumber} is rejected by ${name}. Kindly review the reasons for rejection by clicking on the following link: https://app.palletnow.co/\r\n\r\n\r\nThank You!\r\n—-\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007027058490024942';
        break;
      case 'PI_DELETED':
        SMSTemplate =
          'Hey ${name}, the Purchase Indent ${piNumber} you created has been deleted. Click https://app.palletnow.co/ for details. \r\n\r\nThank You! \r\n—-\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007373095168069670';
        break;
      case 'QUOTE_CREATED':
        SMSTemplate =
          'Hey ${name}, a new quote has been added to the Purchase Indent ${piNumber}. Please review the quote by clicking on the following link: https://app.palletnow.co/. \r\n\r\nThank You!\r\n—-\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007989590289897344';
        break;
      case 'QUOTE_APPROVED':
        SMSTemplate =
          'Hey ${name}, your quote has been approved in the Purchase Indent ${piNumber}. Please find the approved quote using the following link: https://app.palletnow.co/.\r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007969775125568206';
        break;
      case 'QUOTE_REJECTED':
        SMSTemplate =
          'Your quote has been rejected in Purchase Indent ${piNumber} by ${name}. Please review the reasons provided via the following link https://app.palletnow.co/.\r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007301452932336598';
        break;
      case 'QUOTE_DELETED':
        SMSTemplate =
          'Your quote for Purchase Indent ${name} has been deleted by ${piNumber}. Please find the reason for deletion at the following link: https://app.palletnow.co/.\r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007366102371536452';
        break;
      case 'PI_CLOSED':
        SMSTemplate =
          'Hey ${name}, your Purchase Indent ${piNumber} has been successfully processed and closed. Click on the link: https://app.palletnow.co/ to view the details. \r\n\r\nThank You!\r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007944647350774368';
        break;
      case 'PO_CREATED':
        SMSTemplate =
          'Hey ${poApprover}, a Purchase Order ${poNumber} has been created and requires your approval. Please review and authorize by clicking the following link: https://app.palletnow.co/\r\n\r\nThank You! \r\n—-\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007791202080811153';
        break;
      case 'PO_APPROVED':
        SMSTemplate =
          'Hey ${vendorName}, a Purchase Order ${poNumber} has been created. Please find the details by clicking the following link: https://app.palletnow.co/\r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007162757814974448';
        break;
      case 'PO_REJECTED':
        SMSTemplate =
          'Hey ${poCreator}, your Purchase Order ${poNumber} has been rejected. To review the rejection details please visit the following link: https://app.palletnow.co/ \r\n\r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007986960253570382';
        break;
      case 'PO_CLOSED':
        SMSTemplate =
          'Hey ${poCreator}, a Purchase Order ${poNumber} has been successfully processed and closed. No further action is required. Please find the details by clicking the following link: https://app.palletnow.co/. \r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007983398550673738';
        break;
      case 'PO_DELETED':
        SMSTemplate =
          'Hey ${poCreator}, your Purchase Order ${poNumber} has been deleted. Please click on the link for more information: https://app.palletnow.co/ \r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007680905307721275';
        break;
      case 'BILL_CREATED':
        SMSTemplate =
          'Hey ${billApprover}, a new bill for ${poNumber} has been generated and requires your approval. Please review and approve the bill by clicking on the following link: https://app.palletnow.co/\r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007895297369418202';
        break;
      case 'BILL_APPROVED':
        SMSTemplate =
          'Hey ${vendorName}, your bill for Purchase Order ${poNumber} has been approved. Please check the details via the following link: https://app.palletnow.co/ \r\n\r\n\r\nThank You!\r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007545473522586398';
        break;
      case 'BILL_REJECTED':
        SMSTemplate =
          'Hey ${billCreator}, your bill for Purchase Order ${poNumber} has been rejected. Please check the details via the following link: https://app.palletnow.co/. \r\n\r\n\r\nThank You!\r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007008918926162783';
        break;
      case 'BILL_DELETED':
        SMSTemplate =
          'Hey ${billCreator}, the bill for Purchase Order ${poNumber} has been deleted. Please check the details via the following link https://app.palletnow.co/\r\n\r\nThank You!\r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007617300376578498';
        break;
      case 'PAYMENT_RECORDED':
        SMSTemplate =
          'Hey ${vendorName}, we have successfully made the payment for ${poNumber}. \r\n\r\nThank You!\r\n—-\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007067129886760234';
        break;
      case 'REFUND_PAYMENT_RECEIVED':
        SMSTemplate =
          'Hey ${vendorName}, we have successfully received the refund amount of ${refundAmount} for bill number ${billNumber}.\r\n\r\nThank You!\r\n—\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007924547204017819';
        break;
      case 'CREDIT_NOTE':
        SMSTemplate =
          'Hey ${vendorName}, we have issued the credit note for ${poNumber}. Please click on the link for more details: https://app.palletnow.co/\r\n\r\n\r\nThank You!\r\n—-\r\nPowered by Pallet';
        SMSdltTemplateId = '1007937744193837491';
        break;
      case 'ORDER_COMPLETED':
        SMSTemplate =
          'Thanks for shopping with ${organizationName}. Your bill amount is Rs. ${grandTotal}. Please review your receipt here ${link}\r\n\r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007503847224753190';
        break;
      case 'APP_ORDER_PLACED':
        SMSTemplate =
          "Great News! We've received your order ${orderId} of Rs. ${grandTotal}. Sit back and relax! -- Powered by Twinleaves";
        SMSdltTemplateId = '1007954466796642307';
        break;
      case 'APP_ORDER_PACKED':
        SMSTemplate =
          'Your order ${orderId} has been packed and is ready to make its way to you. Powered by Twinleaves';
        SMSdltTemplateId = '1007655297034944498';
        break;
      case 'APP_ORDER_OUT_FOR_DELIVERY':
        SMSTemplate =
          'Your order ${orderId} has been shipped! You’ll be receiving it soon. Thanks for choosing us! Powered by Twinleaves';
        SMSdltTemplateId = '1007855017269028916';
        break;
      case 'APP_ORDER_DELIVERED':
        SMSTemplate =
          'Hooray! Your order ${orderId} has been delivered. We hope you enjoy your purchase. Thanks for choosing us! Powered by Twinleaves';
        SMSdltTemplateId = '1007621758827135302';
        break;
      case 'APP_ORDER_CANCELLED':
        SMSTemplate =
          "We're sorry, but your order ${orderId} has been cancelled on ${date}. Please check your email for more details. Powered by Twinleaves";
        SMSdltTemplateId = '1007464455904126270';
        break;
      case 'SALES_ORDER_PLACED':
        SMSTemplate =
          'Hey ${organizationName}, Thank you for your order! Your order number is ${orderId}. When it has been dispatched we’ll notify you. Thank You! —';
        SMSdltTemplateId = '1007897759013322581';
        break;
      case 'SALES_ORDER_DELIVERED':
        SMSTemplate =
          'Hey ${organizationName}, Great news! Your order from ${vendorName} has been successfully delivered. Thank You! — Powered by Pallet';
        SMSdltTemplateId = '1007559849330463613';
        break;
      case 'SALES_ORDER_SHIPPED':
        SMSTemplate =
          'Order Shipped: your order from ${vendorName} has shipped via ${courierService}. Thank You! — Powered by Pallet';
        SMSdltTemplateId = '1007220895164976874';
        break;
      case 'SALES_ORDER_CANCELLED':
        SMSTemplate =
          'Hey ${organizationName}, your order ${orderId} has been successfully cancelled. Thank You! — Powered by Pallet';
        SMSdltTemplateId = '1007636883682962904';
        break;
      case 'APP_NEW_ORDER_PLACED':
        SMSTemplate = 'New Order Alert: a new app order has been placed on your store. Check ODS screen now';
        SMSdltTemplateId = '1007030428106173176';
        break;
      case 'APP_NEW_ORDER_UNATTENDED':
        SMSTemplate = "Action Required: You've ${orders} unfulfilled app orders. Review & complete the orders now.";
        SMSdltTemplateId = '1007430426892794451';
        break;
      case 'APP_DELIVERY_NOT_ASSIGNED':
        SMSTemplate =
          "Action Required: Delivery agents haven't been assigned for ${orders} app order. Assign quickly to avoid delays.";
        SMSdltTemplateId = '1007565165636133331';
        break;
      case 'APP_ORDER_CANCELLED_FROM_STORE':
        SMSTemplate = 'Order Cancelled: Twinleaves store has cancelled your order ${orderNo} due to ${reason}.';
        SMSdltTemplateId = '1007886924092926967';
        break;
      case 'APP_ORDER_DELAY':
        SMSTemplate = "Quick Update: There's a slight delay in your order ${orderNo}. We appreciate your patience";
        SMSdltTemplateId = '1007117315327551489';
        break;
      default:
        SMSTemplate = '';
        SMSdltTemplateId = '';
        break;
    }

    function findTemplateName(action) {
      const templateNameProperty = `${action}_templateName`;
      const templateObject = SMSPreferenceData.find((obj) => obj.hasOwnProperty(templateNameProperty));

      if (templateObject) {
        return templateObject[templateNameProperty];
      } else {
        return null;
      }
    }

    function findTemplateId(action) {
      const templateNameProperty = `${action}_templateId`;
      const templateObject = SMSPreferenceData.find((obj) => obj.hasOwnProperty(templateNameProperty));

      if (templateObject) {
        return templateObject[templateNameProperty];
      } else {
        return null;
      }
    }

    const payload = {
      templateId: findTemplateId(id.replace(/ /g, '_')),
      templateName: findTemplateName(id.replace(/ /g, '_')),
      templateFormate: SMSTemplate,
      templateType: 'SMS',
      userId: obj.uidx,
      clientId: clientId,
      dltTemplateId: SMSdltTemplateId,
      airtelMsgType: 'SERVICE_IMPLICIT',
    };
    const filePayload = new Blob([], { type: 'text/html' });
    const templatePayload = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('file', filePayload);
    formData.append('updateEmailTemplateModel', templatePayload);

    try {
      postTemplateUpdate(formData).then((res) => {
        showSnackbar(`SMS Template for ${id} Updated`, 'success');
      });
    } catch (error) {
      showSnackbar(`Error: Template for ${id} not updated`, 'error');
    }
  };

  // handle SMS change
  const handleSMSCheckboxChange = (event, id, type, actionId) => {
    const updatedCheckboxData = fornatedactions.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [type]: event.target.checked,
        };
      }
      return item;
    });

    setFormatedactions(updatedCheckboxData);
    // setSMSMessage(id)

    //setTemplateSMS(actionId)
    switch (id.replace(/ /g, '_')) {
      case 'OTP':
        SMSTemplate =
          '#${otp} is your one time password for Pallet authentication. Pallet never calls to ask for OTP. This OTP expires in ${time} minutes /${hash}';
        SMSdltTemplateId = '1007862408994241521';
        break;
      case 'PI_CREATED':
        SMSTemplate =
          'Hey ${name} a new Purchase Indent ${piNumber} is created. Please review and approve it.\r\n\r\nThank You!\r\n—\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007491825928717670';
        break;
      case 'PI_APPROVED':
        SMSTemplate =
          'Hey, a new Purchase Indent ${piNumber} has been approved by ${name} and assigned to you.\r\nThank You! Team Pallet.';
        SMSdltTemplateId = '1007729421531479294';
        break;
      case 'PI_REJECTED':
        SMSTemplate =
          'Your Purchase Indent ${piNumber} is rejected by ${name}. Kindly review the reasons for rejection by clicking on the following link: https://app.palletnow.co/\r\n\r\n\r\nThank You!\r\n—-\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007027058490024942';
        break;
      case 'PI_DELETED':
        SMSTemplate =
          'Hey ${name}, the Purchase Indent ${piNumber} you created has been deleted. Click https://app.palletnow.co/ for details. \r\n\r\nThank You! \r\n—-\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007373095168069670';
        break;
      case 'QUOTE_CREATED':
        SMSTemplate =
          'Hey ${name}, a new quote has been added to the Purchase Indent ${piNumber}. Please review the quote by clicking on the following link: https://app.palletnow.co/. \r\n\r\nThank You!\r\n—-\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007989590289897344';
        break;
      case 'QUOTE_APPROVED':
        SMSTemplate =
          'Hey ${name}, your quote has been approved in the Purchase Indent ${piNumber}. Please find the approved quote using the following link: https://app.palletnow.co/.\r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007969775125568206';
        break;
      case 'QUOTE_REJECTED':
        SMSTemplate =
          'Your quote has been rejected in Purchase Indent ${piNumber} by ${name}. Please review the reasons provided via the following link https://app.palletnow.co/.\r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007301452932336598';
        break;
      case 'QUOTE_DELETED':
        SMSTemplate =
          'Your quote for Purchase Indent ${name} has been deleted by ${piNumber}. Please find the reason for deletion at the following link: https://app.palletnow.co/.\r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007366102371536452';
        break;
      case 'PI_CLOSED':
        SMSTemplate =
          'Hey ${name}, your Purchase Indent ${piNumber} has been successfully processed and closed. Click on the link: https://app.palletnow.co/ to view the details. \r\n\r\nThank You!\r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007944647350774368';
        break;
      case 'PO_CREATED':
        SMSTemplate =
          'Hey ${poApprover}, a Purchase Order ${poNumber} has been created and requires your approval. Please review and authorize by clicking the following link: https://app.palletnow.co/\r\n\r\nThank You! \r\n—-\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007791202080811153';
        break;
      case 'PO_APPROVED':
        SMSTemplate =
          'Hey ${vendorName}, a Purchase Order ${poNumber} has been created. Please find the details by clicking the following link: https://app.palletnow.co/\r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007162757814974448';
        break;
      case 'PO_REJECTED':
        SMSTemplate =
          'Hey ${poCreator}, your Purchase Order ${poNumber} has been rejected. To review the rejection details please visit the following link: https://app.palletnow.co/ \r\n\r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007986960253570382';
        break;
      case 'PO_CLOSED':
        SMSTemplate =
          'Hey ${poCreator}, a Purchase Order ${poNumber} has been successfully processed and closed. No further action is required. Please find the details by clicking the following link: https://app.palletnow.co/. \r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007983398550673738';
        break;
      case 'PO_DELETED':
        SMSTemplate =
          'Hey ${poCreator}, your Purchase Order ${poNumber} has been deleted. Please click on the link for more information: https://app.palletnow.co/ \r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007680905307721275';
        break;
      case 'BILL_CREATED':
        SMSTemplate =
          'Hey ${billApprover}, a new bill for ${poNumber} has been generated and requires your approval. Please review and approve the bill by clicking on the following link: https://app.palletnow.co/\r\n\r\nThank You! \r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007895297369418202';
        break;
      case 'BILL_APPROVED':
        SMSTemplate =
          'Hey ${vendorName}, your bill for Purchase Order ${poNumber} has been approved. Please check the details via the following link: https://app.palletnow.co/ \r\n\r\n\r\nThank You!\r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007545473522586398';
        break;
      case 'BILL_REJECTED':
        SMSTemplate =
          'Hey ${billCreator}, your bill for Purchase Order ${poNumber} has been rejected. Please check the details via the following link: https://app.palletnow.co/. \r\n\r\n\r\nThank You!\r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007008918926162783';
        break;
      case 'BILL_DELETED':
        SMSTemplate =
          'Hey ${billCreator}, the bill for Purchase Order ${poNumber} has been deleted. Please check the details via the following link https://app.palletnow.co/\r\n\r\nThank You!\r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007617300376578498';
        break;
      case 'PAYMENT_RECORDED':
        SMSTemplate =
          'Hey ${vendorName}, we have successfully made the payment for ${poNumber}. \r\n\r\nThank You!\r\n—-\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007067129886760234';
        break;
      case 'REFUND_PAYMENT_RECEIVED':
        SMSTemplate =
          'Hey ${vendorName}, we have successfully received the refund amount of ${refundAmount} for bill number ${billNumber}.\r\n\r\nThank You!\r\n—\r\nPowered by Pallet\r\n';
        SMSdltTemplateId = '1007924547204017819';
        break;
      case 'CREDIT_NOTE':
        SMSTemplate =
          'Hey ${vendorName}, we have issued the credit note for ${poNumber}. Please click on the link for more details: https://app.palletnow.co/\r\n\r\n\r\nThank You!\r\n—-\r\nPowered by Pallet';
        SMSdltTemplateId = '1007937744193837491';
        break;
      case 'ORDER_COMPLETED':
        SMSTemplate =
          'Thanks for shopping with ${organizationName}. Your bill amount is Rs. ${grandTotal}. Please review your receipt here ${link}\r\n\r\n—\r\nPowered by Pallet';
        SMSdltTemplateId = '1007503847224753190';
        break;
      case 'APP_ORDER_PLACED':
        SMSTemplate =
          "Great News! We've received your order ${orderId} of Rs. ${grandTotal}. Sit back and relax! -- Powered by Twinleaves";
        SMSdltTemplateId = '1007954466796642307';
        break;
      case 'APP_ORDER_PACKED':
        SMSTemplate =
          'Your order ${orderId} has been packed and is ready to make its way to you. Powered by Twinleaves';
        SMSdltTemplateId = '1007655297034944498';
        break;
      case 'APP_ORDER_OUT_FOR_DELIVERY':
        SMSTemplate =
          'Your order ${orderId} has been shipped! You’ll be receiving it soon. Thanks for choosing us! Powered by Twinleaves';
        SMSdltTemplateId = '1007855017269028916';
        break;
      case 'APP_ORDER_DELIVERED':
        SMSTemplate =
          'Hooray! Your order ${orderId} has been delivered. We hope you enjoy your purchase. Thanks for choosing us! Powered by Twinleaves';
        SMSdltTemplateId = '1007621758827135302';
        break;
      case 'APP_ORDER_CANCELLED':
        SMSTemplate = "We're sorry, but your order ${orderId} has been cancelled on ${date}. Powered by Twinleaves";
        SMSdltTemplateId = '1007464455904126270';
        break;
      case 'SALES_ORDER_PLACED':
        SMSTemplate =
          'Hey ${organizationName}, Thank you for your order! Your order number is ${orderId}. When it has been dispatched we’ll notify you. Thank You! —';
        SMSdltTemplateId = '1007897759013322581';
        break;
      case 'SALES_ORDER_DELIVERED':
        SMSTemplate =
          'Hey ${organizationName}, Great news! Your order from ${vendorName} has been successfully delivered. Thank You! — Powered by Pallet';
        SMSdltTemplateId = '1007559849330463613';
        break;
      case 'SALES_ORDER_SHIPPED':
        SMSTemplate =
          'Order Shipped: your order from ${vendorName} has shipped via ${courierService}. Thank You! — Powered by Pallet';
        SMSdltTemplateId = '1007220895164976874';
        break;
      case 'SALES_ORDER_CANCELLED':
        SMSTemplate =
          'Hey ${organizationName}, your order ${orderId} has been successfully cancelled. Thank You! — Powered by Pallet';
        SMSdltTemplateId = '1007636883682962904';
        break;
      case 'APP_NEW_ORDER_PLACED':
        SMSTemplate = 'New Order Alert: a new app order has been placed on your store. Check ODS screen now';
        SMSdltTemplateId = '1007030428106173176';
        break;
      case 'APP_NEW_ORDER_UNATTENDED':
        SMSTemplate = "Action Required: You've ${orders} unfulfilled app orders. Review & complete the orders now.";
        SMSdltTemplateId = '1007430426892794451';
        break;
      case 'APP_DELIVERY_NOT_ASSIGNED':
        SMSTemplate =
          "Action Required: Delivery agents hasn't been assigned for ${orders} app order yet. Assign quickly to avoid delays.";
        SMSdltTemplateId = '1007565165636133331';
        break;
      case 'APP_ORDER_CANCELLED_FROM_STORE':
        SMSTemplate = 'Order Cancelled: Twinleaves store has cancelled your order ${orderNo} due to ${reason}.';
        SMSdltTemplateId = '1007886924092926967';
        break;
      case 'APP_ORDER_DELAY':
        SMSTemplate = "Quick Update: There's a slight delay in your order ${orderNo}. We appreciate your patience";
        SMSdltTemplateId = '1007117315327551489';
        break;

      default:
        SMSTemplate = '';
        SMSdltTemplateId = '';
        break;
    }

    const payload = {
      templateName: generateUniqueName(id),
      templateFormat: SMSTemplate,
      templateType: 'SMS',
      userId: obj.uidx,
      clientId: clientId,
      dltTemplateId: SMSdltTemplateId,
      airtelMsgType: 'SERVICE_IMPLICIT',
    };
    // console.log(SMSMessage)
    // console.log(SMSTemplate)
    // console.log(dialogItem)
    try {
      postSMSTemplateById(payload, actionId).then((res) => {
        showSnackbar(`SMS Service for ${id} Connected`, 'success');
        fetchData();
      });
    } catch (error) {
      showSnackbar(`SMS Service for ${id} not Connected`, 'error');
    }
  };

  // handle WhatsApp change

  let whatsAppTemplate = '';
  let whatsAppTemplateName = '';
  const handleWhatsAppCheckboxChange = (event, id, type, actionId) => {
    const updatedCheckboxData = fornatedactions.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [type]: event.target.checked,
        };
      }
      return item;
    });

    setFormatedactions(updatedCheckboxData);

    switch (id.replace(/ /g, '_')) {
      case 'PI_CREATED':
        whatsAppTemplate = 'Hey {{1}}, a new Purchase Indent {{2}} is created. Please review and approve it.';
        whatsAppTemplateName = 'pi_created';
        break;
      case 'PI_APPROVED':
        whatsAppTemplate = 'Hey {{1}} , a new Purchase Indent {{2}} has been approved and assigned to you.';
        whatsAppTemplateName = 'pi_approved';
        break;
      case 'PI_REJECTED':
        whatsAppTemplate = 'Your Purchase Indent {{1}} has been rejected by {{2}}.';
        whatsAppTemplateName = 'pi_rejected';
        break;
      case 'PI_CLOSED':
        whatsAppTemplate = 'Hey {{1}}, your Purchase Indent {{2}} has been successfully processed and closed.';
        whatsAppTemplateName = 'pi_closed';
        break;
      case 'PI_DELETED':
        whatsAppTemplate = 'Hey {{1}}, the Purchase Indent {{2}} you created has been deleted.';
        whatsAppTemplateName = 'pi_deleted';
        break;
      case 'QUOTE_CREATED':
        whatsAppTemplate =
          'Hey {{1}}, a new quote has been added to the Purchase Indent {{2}}. Please review the quote.';
        whatsAppTemplateName = 'quote_created';
        break;
      case 'QUOTE_APPROVED':
        whatsAppTemplate = 'Hey {{1}}, your quote has been approved in the Purchase Indent {{2}}.';
        whatsAppTemplateName = 'quote_approved';
        break;
      case 'QUOTE_REJECTED':
        whatsAppTemplate = 'Your quote has been rejected in Purchase Indent {{1}} by {{2}}. Please review the reasons.';
        whatsAppTemplateName = 'quote_rejected';
        break;
      case 'QUOTE_DELETED':
        whatsAppTemplate =
          'Your quote for Purchase Indent {{1}} has been deleted by {{2}}. Please find the reason for the deletion.';
        whatsAppTemplateName = 'quote_deleted';
        break;
      case 'PO_CREATED':
        whatsAppTemplate = 'Hey {{1}}, a Purchase Order {{2}} has been created and requires your approval.';
        whatsAppTemplateName = 'po_created';
        break;
      case 'PO_APPROVED':
        whatsAppTemplate = 'Hey {{1}}, a Purchase Order {{2}} has been created.';
        whatsAppTemplateName = 'po_approved';
        break;
      case 'PO_REJECTED':
        whatsAppTemplate = 'Hey {{1}}, your Purchase Order {{2}} has been rejected.';
        whatsAppTemplateName = 'po_rejected';
        break;
      case 'PO_CLOSED':
        whatsAppTemplate = 'Hey {{1}}, a Purchase Order {{2}} has been successfully processed and closed.';
        whatsAppTemplateName = 'po_closed';
        break;
      case 'PO_DELETED':
        whatsAppTemplate = 'Hey {{1}}, your Purchase Order {{2}} has been deleted.';
        whatsAppTemplateName = 'po_deleted';
        break;
      case 'BILL_CREATED':
        whatsAppTemplate = '';
        whatsAppTemplateName = 'bill_created';
        break;
      case 'BILL_APPROVED':
        whatsAppTemplate = 'Hey {{1}}, your bill for Purchase Order {{2}} has been approved.';
        whatsAppTemplateName = 'bill_approved';
        break;
      case 'BILL_REJECTED':
        whatsAppTemplate = 'Hey {{1}}, your bill for Purchase Order {{2}} has been rejected.';
        whatsAppTemplateName = 'bill_rejected';
        break;
      case 'BILL_DELETED':
        whatsAppTemplate = 'Hey {{1}}, the bill for Purchase Order {{2}} has been deleted.';
        whatsAppTemplateName = 'bill_deleted';
        break;
      case 'PAYMENT_RECORDED':
        whatsAppTemplate = 'Hey {{1}}, {{2}} has successfully made the payment for {{3}}.';
        whatsAppTemplateName = 'payment_recorded';
        break;
      case 'REFUND_PAYMENT_RECEIVED':
        whatsAppTemplate =
          'Hey {{1}}, {{2}} successfully received the refund amount of Rs. {{3}} for bill number {{4}}.';
        whatsAppTemplateName = 'payment_refund_received_against_bill_number';
        break;
      case 'CREDIT_NOTE':
        whatsAppTemplate = 'Hey {{1}}, {{2}} has issued the credit note for {{3}}.';
        whatsAppTemplateName = 'credit_note_po_number';
        break;
      case 'SESSION_CLOSED':
        whatsAppTemplate = 'Hey, your Terminal Reports for {{1}} are ready and attached as a PDF for your reference.';
        whatsAppTemplateName = 'terminal_reports';
        break;
      case 'DAY_CLOSED':
        whatsAppTemplate = 'Hey, your Daily Sales Report for {{1}} is ready and attached as a PDF for your reference.';
        whatsAppTemplateName = 'daily_sales_report';
        break;
      case 'ORDER_COMPLETED':
        whatsAppTemplate =
          'Details of your Sales Invoice from {{1}}. Invoice amount is Rs. {{2}}. Thank you for your purchase! {{3}} {{4}}';
        whatsAppTemplateName = 'pos_order_completed';
        break;
      case 'SALES_ORDER_PLACED':
        whatsAppTemplate =
          'Hey {{1}}, Thank you for your order! Your order number is {{2}}. When it has been dispatched we’ll notify you.';
        whatsAppTemplateName = 'sales_order_order_placed';
        break;
      case 'SALES_ORDER_DELIVERED':
        whatsAppTemplate = 'Hey {{1}}, Great news! Your order from {{2}} has been successfully delivered.';
        whatsAppTemplateName = 'sales_order_order_delivered';
        break;
      case 'SALES_ORDER_SHIPPED':
        whatsAppTemplate = 'Order Shipped: your order from {{1}} has shipped via {{2}}.';
        whatsAppTemplateName = 'sales_order_order_shipped';
        break;
      case 'SALES_ORDER_CANCELLED':
        whatsAppTemplate = 'Hey {{1}}, your order {{2}} has been successfully cancelled.';
        whatsAppTemplateName = 'sales_order_order_cancelled';
        break;
      case 'APP_ORDER_PLACED':
        whatsAppTemplate = "Great News! 🥳 We've received your order {{1}} of Rs.{{2}}. Sit back and relax!";
        whatsAppTemplateName = 'b2c_order_placed';
        break;
      case 'APP_ORDER_PACKED':
        whatsAppTemplate = 'Your order {{1}} has been packed and is ready to make its way to you.📦🎉';
        whatsAppTemplateName = 'b2c_order_packed';
        break;
      case 'APP_ORDER_OUT_FOR_DELIVERY':
        whatsAppTemplate = 'Your order {{1}} has been shipped!🚚 You’ll be receiving it soon. Thanks for choosing us!';
        whatsAppTemplateName = 'b2c_order_shipped';
        break;
      case 'APP_ORDER_DELIVERED':
        whatsAppTemplate =
          'Hooray!🎉 Your order {{1}} has been delivered. We hope you enjoy your purchase. Thanks for choosing us!';
        whatsAppTemplateName = 'b2c_order_delivered';
        break;
      case 'APP_ORDER_CANCELLED':
        whatsAppTemplate = "We're sorry, but your order {{1}} has been cancelled on {{2}}.";
        whatsAppTemplateName = 'b2c_order_cancelled';
        break;
      case 'APP_NEW_ORDER_PLACED':
        whatsAppTemplate = "New Order Alert: you've received a new B2C app order in {{1}}. Check ODS screen now.";
        whatsAppTemplateName = 'app_new_order_placed';
        break;
      case 'APP_NEW_ORDER_UNATTENDED':
        whatsAppTemplate = "Action Required: You've 3 unfulfilled app orders. Review & compete the orders now.";
        whatsAppTemplateName = 'app_new_order_unattended';
        break;
      case 'APP_DELIVERY_NOT_ASSIGNED':
        whatsAppTemplate =
          "Action Required: Delivery agents hasn't been assigned for 4 app order yet. Assign quickly to avoid delays.";
        whatsAppTemplateName = 'app_delivery_agent_not_assigned';
        break;
      case 'APP_ORDER_CANCELLED_FROM_STORE':
        whatsAppTemplate = 'Order Cancelled: Dear Customer, Twinleaves store has cancelled your {{1}}. Reason: {{2}}.';
        whatsAppTemplateName = 'app_order_cancelled_form_store_side';
        break;
      case 'APP_ORDER_DELAY':
        whatsAppTemplate =
          "Order Update: There's a slight delay in your order {{1}}. We’re on it and will get it to you soon!";
        whatsAppTemplateName = 'app_order_delay';
        break;
      default:
        whatsAppTemplate = '';
        whatsAppTemplateName = '';
        break;
    }

    const payload = {
      socialTemplateName: whatsAppTemplateName,
      templateFormat: whatsAppTemplate,
      templateType: 'WHATSAPP',
      clientId: clientId,
      userId: orgId,
    };

    try {
      postWhatsAppTemplateById(payload, actionId).then((res) => {
        showSnackbar(`WhatsApp Service for ${id} Connected`, 'success');
        fetchData();
      });
    } catch (error) {
      showSnackbar(`WhatsApp Service for ${id} not Connected`, 'error');
    }
  };

  const handlesubscribe = (action) => {
    navigate('/notificationconnect');
    handleClose();
  };

  function findSMSPriority(action) {
    const templateNameProperty = action.replace(/ /g, '_');
    const templateObject = SMSPreferenceData.find((obj) => obj.hasOwnProperty(templateNameProperty));

    if (templateObject) {
      return templateObject[templateNameProperty];
    } else {
      return null;
    }
  }

  function findEmailPriority(action) {
    const templateNameProperty = action.replace(/ /g, '_');
    const templateObject = emailPreferenceData.find((obj) => obj.hasOwnProperty(templateNameProperty));

    if (templateObject) {
      return templateObject[templateNameProperty];
    } else {
      return null;
    }
  }

  const handleSave = () => {
    // Do something with the checkbox data
    SetSavedcheckbox(checkboxData);
  };
  const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#36454F',
        color: '#fff',
        boxShadow: theme.shadows[1],
        fontSize: 12,
      },
    }),
  );

  const handleDisableEmailClose = () => {
    setOpenDisableEmail(false);
  };

  const handleDisableWaClose = () => {
    setOpenDisableWa(false);
  };

  const handleEmailDisableOpen = (id, name) => {
    setOpenDisableEmail(true);
    setDialogItem(name);
  };

  const handleSMSDisableOpen = (id, name) => {
    setOpenDisableSMS(true);
    setDialogItem(name);
  };

  const handleEmaildisableAPI = (event) => {
    function findTemplateRefId(action) {
      // console.log(action)
      const templateNameProperty = `${action}_refId`;
      const templateObject = emailPreferenceData.find((obj) => obj.hasOwnProperty(templateNameProperty));

      if (templateObject) {
        return templateObject[templateNameProperty];
        // console.log(templateObject[templateNameProperty])
      } else {
        return null;
      }
    }

    const payload = {
      templateType: 'EMAIL',
      refId: findTemplateRefId(dialogItem.replace(/ /g, '_')),
    };

    try {
      disableNotification(payload).then((res) => {
        fetchData();
        setOpenDisableEmail(false);

        showSnackbar(`Email preference for ${dialogItem} disabled`, 'success');
      });
    } catch (error) {
      setOpenDisableEmail(false);
      showSnackbar(`Email preference for ${dialogItem} not disabled`, 'error');
    }
  };

  const handleWhatsappdisableAPI = () => {
    function findTemplateRefId(action) {
      // console.log(action)
      const templateNameProperty = `${action}_refId`;
      const templateObject = WhatsAppPreferenceData.find((obj) => obj.hasOwnProperty(templateNameProperty));

      if (templateObject) {
        return templateObject[templateNameProperty];
        // console.log(templateObject[templateNameProperty])
      } else {
        return null;
      }
    }

    const payload = {
      templateType: 'WHATSAPP',
      refId: findTemplateRefId(dialogItem.replace(/ /g, '_')),
    };

    try {
      disableNotification(payload).then((res) => {
        fetchData();
        setOpenDisableWa(false);

        showSnackbar(`Whatsapp preference for ${dialogItem} disabled`, 'success');
      });
    } catch (error) {
      setOpenDisableWa(false);
      showSnackbar(`Whatsapp preference for ${dialogItem} not disabled`, 'error');
    }
  };

  const handleWaDisableOpen = (id, name) => {
    setOpenDisableWa(true);
    setDialogItem(name);
  };

  const handleDisableSmsClose = () => {
    setOpenDisableSMS(false);
  };

  const handleSMSdisableAPI = () => {
    function findTemplateRefId(action) {
      // console.log(action)
      const templateNameProperty = `${action}_refId`;
      const templateObject = SMSPreferenceData.find((obj) => obj.hasOwnProperty(templateNameProperty));

      if (templateObject) {
        return templateObject[templateNameProperty];
        // console.log(templateObject[templateNameProperty])
      } else {
        return null;
      }
    }

    const payload = {
      templateType: 'SMS',
      refId: findTemplateRefId(dialogItem.replace(/ /g, '_')),
    };

    try {
      disableNotification(payload).then((res) => {
        fetchData();
        setOpenDisableSMS(false);

        showSnackbar(`SMS preference for ${dialogItem} disabled`, 'success');
      });
    } catch (error) {
      setOpenDisableSMS(false);
      showSnackbar(`SMS preference for ${dialogItem} not disabled`, 'error');
    }
  };

  const formatActionName = (actionName) => {
    const words = actionName.split(' ');
    const formattedWords = words.map((word) => {
      if (word.length === 2) {
        return word.toUpperCase();
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
    });
    return formattedWords.join(' ');
  };

  const items = [
    {
      id: 'PI CREATED',
      title: 'Triggers messages when purchase indent is created and sent to creator, super admin and approver',
    },
    {
      id: 'PI APPROVED',
      title: 'Triggers messages when purchase indent is approved by the approver and assigned back to assignee',
    },
    { id: 'PI DELETED', title: 'Triggers messages when purchase indent is deleted to the super admin' },
    { id: 'PI REJECTED', title: 'Triggers messages when purchase indent is rejected to the super admin' },
    { id: 'PI CLOSED', title: 'Triggers messages when purchase indent is closed to the super admin' },
    {
      id: 'QUOTE CREATED',
      title:
        'Triggers messages when quote is created for a purchase indent to super admin and purchase indent approver',
    },
    { id: 'QUOTE APPROVED', title: 'Triggers messages when quote is approved by the approver' },
    { id: 'QUOTE REJECTED', title: 'Triggers messages when quote is rejected by the approver' },
    { id: 'QUOTE DELETED', title: 'Triggers messages when quote is deleted for the particular purchase indent' },
    {
      id: 'PO CREATED',
      title: 'Triggers messages when purchase order is created and sent to creator, super admin and approver',
    },
    {
      id: 'PO APPROVED',
      title: 'Triggers messages when purchase order is approved by the approver and sent to super admin and vendor',
    },
    {
      id: 'PO REJECTED',
      title: 'Triggers messages when purchase order is rejected by the approver and assigned to assignee',
    },
    { id: 'PO DELETED', title: 'Triggers messages when purchase order is deleted and sent to super admin' },
    { id: 'BILL CREATED', title: 'Triggers messages when bill is created and sent to super admin and the approver' },
    {
      id: 'BILL APPROVED',
      title: 'Triggers messages when bill is approved by the approver  and sent to the super admin',
    },
    { id: 'BILL REJECTED', title: 'Triggers messages when bill is rejected by the approver and sent to super admin' },
    { id: 'BILL DELETED', title: 'Triggers messages when bill is deleted and sent to super admin' },
    { id: 'SALES ORDER PACKED', title: 'Triggers messages when sales order is packed' },
    { id: 'SALES ORDER PLACED', title: 'Triggers messages when sales order is placed' },
    { id: 'SALES ORDER DELIVERED', title: 'Triggers messages when sales order is delivered' },
    { id: 'SALES ORDER SHIPPED', title: 'Triggers messages when sales order is shipped' },
    { id: 'SALES ORDER CANCELLED', title: 'Triggers messages when sales order is cancelled' },
    { id: 'SALES ORDER DELIVERED CUSTOMER', title: 'Triggers messages when sales order is delivered to the customer' },
    { id: 'ORDER COMPLETED', title: 'Triggers messages when POS order is completed' },
    { id: 'SESSION CLOSED', title: 'Triggers a report message when a session of POS is completed' },
    { id: 'DAY COSED', title: 'Triggers a day closed resport at the end of day for every POS machine' },
    { id: 'APP ORDER PLACED', title: 'Triggers notification when a customer places order on the app' },
    { id: 'APP ORDER PACKED', title: 'Triggers notification when the app order is packed' },
    { id: 'APP ORDER OUT FOR DELIVERY', title: 'Triggers notification when the app order is out for delivery' },
    { id: 'APP ORDER IN TRANSIT', title: 'Triggers notification when app order is in transit' },
    { id: 'APP ORDER DELIVERED', title: 'Triggers notification when app order is delivered' },
    { id: 'APP ORDER CANCELLED', title: 'Triggers notification when app order is cancelled.' },
  ];

  const renderTooltipTitle = (itemId) => {
    const selectedItem = items.find((item) => item.id === itemId);
    return selectedItem ? selectedItem.title : 'Default Title';
  };

  let pushTemplate = '';

  const handlePushCheckboxChange = (event, id, type, actionId) => {
    const updatedCheckboxData = fornatedactions?.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [type]: event.target.checked,
        };
      }
      return item;
    });

    setFormatedactions(updatedCheckboxData);

    switch (id.replace(/ /g, '_')) {
      case 'DAY_CLOSED':
        pushTemplate =
          "${locationName}, Day Closed Summary\nToday's Sales Rs. ${todaySales} | Today's Profit Rs. ${todayProfit} | Tap to view more";
        break;
      case 'SESSION_CLOSED':
        pushTemplate =
          '${locationName}, Session Closed Successfully\nTerminal ID - ${terminalId} | Cashier - ${cashierNo} | Session No - ${sessionNo} | Discrepancies Recorded - ${discrepenciesRecorded} | Tap to view more';
        break;
      case 'ORDER_COMPLETED':
        pushTemplate = '';
        break;
      case 'TIME_STAMP_SALES_UPDATE':
        pushTemplate =
          '${location}, Sales Update\nTotal Sales till ${time}PM - Rs.${totalSales} | See full details here';
        break;
      case 'PI_CREATED':
        pushTemplate =
          '${orgId}-${locId}, New PI created\nA new PI ${piNumber} has been created and requires approval | Check now';
        break;
      case 'PI_APPROVED':
        pushTemplate = '${orgId}-${locId}, New PI approved\nA new PI ${piNumber} has been approved | Tap to view more';
        break;
      case 'PI_REJECTED':
        pushTemplate = '${orgId}-${locId}, PI rejected\nA new PI ${piNumber} has been rejected | Tap to view more';
        break;
      case 'PI_CLOSED':
        pushTemplate = '${orgId}-${locId} PI closed\nA new PI ${piNumber} has been closed | Tap to view more';
        break;
      case 'PO_CREATED':
        pushTemplate =
          '${orgId}-${locId}, New PO created\nA new PO ${poNumber} has been created and requires approval | Items ordered ${itemOrdered} | Amount ${amount} | Tap to view more';
        break;
      case 'PO_APPROVED':
        pushTemplate =
          '${orgId}-${locId}, New PO approved\nA new PO ${poNumber} has been approved | Items ordered ${itemOrdered} | Amount ${amount} | Tap to view more';
        break;
      case 'PO_REJECTED':
        pushTemplate =
          '${orgId}-${locId}, New PO approved\nA new PO ${poNumber} has been rejected | Items ordered ${itemOrdered} | Amount ${amount} | Tap to view more';
        break;
      case 'GRN_CREATED':
        pushTemplate =
          '${orgId}-${locId}, New GRN created\nA new GRN ${grnId} has been created and requires approval | Total Value Rs. ${amount} | From ${vendorName}';
        break;
      case 'GRN_APPROVED':
        pushTemplate =
          '${orgId}-${locId}, New GRN approved\nA new GRN ${grnId} has been approved and ready to inward | Total Value Rs. ${amount} | From ${vendorName}';
        break;
      case 'GRN_DELETED':
        pushTemplate =
          '${orgId}-${locId}, GRN Deleted\nA new GRN ${grnId} has been deleted | Total Value Rs. ${amount} | Check now';
        break;
      case 'GRN_COMPLETED':
        pushTemplate =
          '${orgId}-${locId}, GRN done successfully\nA new GRN worth Rs. ${amount} has been recorded | Tap to view more';
        break;
      case 'BILL_CREATED':
        pushTemplate =
          '${orgId}-${locId}, New bill created\nA new bill ${poNumber} has been created and requires approval | Bill Amount ${amount} | Tap to view more';
        break;
      case 'BILL_APPROVED':
        pushTemplate =
          '${orgId}-${locId}, New bill approved\nA new bill ${poNumber} has been approved | Bill Amount ${amount} | Tap to view more';
        break;
      case 'TICKET_CREATED_CREATOR':
        pushTemplate =
          'Ticket sent successfully.\nYour ticket ${ticketId} has been successfully created. Our team will address it shortly.';
        break;
      case 'TICKET_CREATED_SUPERADMIN':
        pushTemplate = 'New ticket ${ticketId} raised in ${orgId}-${locId}.\n${title}';
        break;
      case 'TICKET_IN_PROGRESS':
        pushTemplate =
          'Ticket status updated.\nThe status of your ticket ${ticketId} has changed. Please check for more details';
        break;
      case 'COMMENT_ON_TICKET':
        pushTemplate =
          'New comment added.\nA new comment has been added to your ticket ${ticketId}. Check the ticket for more details.';
        break;
      case 'TICKET_CLOSED':
        pushTemplate = 'Ticket is closed.\nYour ticket ${ticketId} has been resolved and is now closed.';
        break;
      case 'TICKET_CLOSED_SUPERADMIN':
        pushTemplate =
          'Ticket closed.\nThe ticket ${ticketId} in ${orgId}-${locId} has been resolved and is now marked as Closed.';
        break;
      case 'OVERSOLD_PRODUCT':
        pushTemplate = '${locId} Oversold Product Alert\n${quantity} products oversold today | Tap for more details';
        break;

      case 'PURCHASE_RETURN_CREATED':
        pushTemplate =
          '${orgId}-${locId}, Purchase Return Pending Approval\nVendor: ${vendorName} | Total Qty: ${totalQty} | Amount: ₹${amount} | Kindly approve';
        break;
      case 'PURCHASE_RETURN_APPROVED':
        pushTemplate =
          '${orgId}-${locId}, Purchase Return Approved\nPurchase Return ${returnId} has been successfully approved! Amount: ₹${amount} | Click to view more';
        break;
      case 'PURCHASE_RETURN_COMPLETED':
        pushTemplate =
          '${orgId}-${locId}, Purchase Return ${returnId} completed\nGreat news! Your purchase return has been completed | Vendor: ${vendorName} | Total Qty: ${totalQty} | Amount: ₹${amount} | Tap to see details';
        break;
      case 'PURCHASE_RETURN_REJECTED':
        pushTemplate =
          '${orgId}-${locId}, Purchase Return ${returnId} rejected\nVendor ${vendorName} | Total Qty ${totalQty} | Amount: ₹${amount} | Tap to see details';
        break;
      case 'STOCK_TRANSFER_CREATED':
        pushTemplate =
          '${orgId}-${locId},New transfer created.\nStock Transfer %{stnNumber} has been created | Destination: ${destination} | Total Qty: ${totalQty} | Amount: ₹${amount} | Tap to view details';
        break;
      case 'STOCK_TRANSFER_OUTWARD_APPROVED':
        pushTemplate =
          '${orgId}-${locId},Outward approved ${stnNumber}.\nStock transfer ${stnNumber} to ${destination} is ready for the next step | Check details now';
        break;
      case 'STOCK_TRANSFER_INWARD_APPROVED':
        pushTemplate =
          '${orgId}-${locId},Inward approved ${stnNumber}.\nInward for stock transfer ${stnNumber} from ${source} is approved | Tap for more info';
        break;
      case 'STOCK_TRANSFER_COMPLETED':
        pushTemplate =
          '${orgId}-${locId},Transfer completed ${stnNumber}.\nStock transfer has been successfully completed to ${destination} | Total Qty: ${totalQty} | Amount: ₹${amount} | Tap to see details';
        break;

      case 'DAY_CLOSED_PURCHASE':
        pushTemplate =
          'Today’s Purchase Summary \n{orgId - locId} | Total GRN Orders: {qty} | Total Amount: ₹{amount} recorded.\nTap to view more';
        break;
      default:
        pushTemplate = '';
        break;
    }

    const payload = {
      templateName: generateUniqueName(id),
      templateFormat: pushTemplate,
      templateType: 'PUSH',
      userId: obj.uidx,
      clientId: clientId,
      dltTemplateId: '',
      airtelMsgType: '',
    };

    try {
      postSMSTemplateById(payload, actionId).then((res) => {
        showSnackbar(`Push Notifications for ${id} Connected`, 'success');
        fetchData();
      });
    } catch (error) {
      showSnackbar(`Push Notifications for ${id} not Connected`, 'error');
    }
  };

  const handleDisablePushOpen = (id, name) => {
    setOpenDisablePush(true);
    setDialogItem(name);
  };

  const handleDisableClosePush = () => {
    setOpenDisablePush(false);
  };

  const handlePushdisableAPI = () => {
    function findTemplateRefId(action) {
      const templateNameProperty = `${action}_refId`;
      const templateObject = pushPreferenceData?.find((obj) => obj.hasOwnProperty(templateNameProperty));

      if (templateObject) {
        return templateObject[templateNameProperty];
      } else {
        return null;
      }
    }

    const payload = {
      templateType: 'PUSH',
      refId: findTemplateRefId(dialogItem?.replace(/ /g, '_')),
    };

    try {
      disableNotification(payload).then((res) => {
        fetchData();
        setOpenDisablePush(false);

        showSnackbar(`Push Notifications for ${dialogItem} disabled`, 'success');
      });
    } catch (error) {
      setOpenDisablePush(false);
      showSnackbar(`Push notifications for ${dialogItem} not disabled`, 'error');
    }
  };

  return (
    <>
      {/* enable disable notifications dialog box */}
      <div>
        <Dialog
          open={notificationOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{`${
            selectedItem.includes(dialogItem) ? 'Enable' : 'Disable'
          } Notification service`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You want to {selectedItem.includes(dialogItem) ? 'enable' : 'disable'} notifications for {dialogItem}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDisable} disabled={selectedItem.includes(dialogItem)}>
              Disable
            </Button>
            <Button onClick={handleEnable} disabled={!selectedItem.includes(dialogItem)}>
              Enable
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* disable Email dialog box */}
      <div>
        <Dialog
          open={openDisableEmail}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleDisableEmailClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Disable Email for {dialogItem}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to disable Email notifications for {dialogItem}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEmaildisableAPI}>Yes</Button>
            <Button onClick={handleDisableEmailClose}>No</Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* disable wa dialog box */}
      <div>
        <Dialog
          open={openDisableWa}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleDisableWaClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Disable WhatsApp for {dialogItem}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to disable WhatsApp notifications for {dialogItem}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleWhatsappdisableAPI}>Yes</Button>
            <Button onClick={handleDisableWaClose}>No</Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* disable sms dialog box */}
      <div>
        <Dialog
          open={openDisableSMS}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleDisableSmsClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Disable SMS for {dialogItem}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to disable SMS notifications for {dialogItem}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSMSdisableAPI}>Yes</Button>
            <Button onClick={handleDisableSmsClose}>No</Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* connect to email dialog box */}
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{'Enable Notification service'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You are not connected please connect with you Email address
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                handlesubscribe(currentactionid);
              }}
            >
              Connect
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* connect to whatsapp dialog box */}
      <div>
        <Dialog
          open={waopen}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{'Enable Notification service'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You are not connected please connect your Whatsapp
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                handlewasubscribe(currentactionid);
              }}
            >
              Connect
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* connect to sms dialog box */}
      <div>
        <Dialog
          open={smsOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{'Enable Notification service'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You are not connected please connect your SMS
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={() => {
                handleSmssubscribe(currentactionid);
              }}
            >
              Connect
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* disable Email dialog box */}
      <div>
        <Dialog
          open={openDisablePush}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleDisableClosePush}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Disable Push for {dialogItem}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to disable Push notifications for {dialogItem}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePushdisableAPI}>Yes</Button>
            <Button onClick={handleDisableClosePush}>No</Button>
          </DialogActions>
        </Dialog>
      </div>

      <div></div>
      <Card sx={{ padding: '20px', paddingRight: '30px', marginTop: '2rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Typography style={{ fontWeight: '400', fontSize: '1rem', lineHeight: '2' }}>{/* App Name */}</Typography>
              <Typography variant="body1" style={{ fontWeight: '400', fontSize: '0.875rem', lineHeight: '2' }}>
                Enable Notifications
              </Typography>
              <Box display="flex" gap="90px" marginLeft="auto">
                {(selectedNotification === 'POS Order' ||
                  selectedNotification === 'Purchase Indent' ||
                  selectedNotification === 'Purchase Order' ||
                  selectedNotification === 'Express Grn' ||
                  selectedNotification === 'Tickets' ||
                  selectedNotification === 'Oversold Products' ||
                  selectedNotification === 'Purchase Returns' ||
                  selectedNotification === 'Stock Transfer' ||
                  selectedNotification === 'Purchase Summary') && (
                  <Typography variant="body1" style={{ fontWeight: '400', fontSize: '0.875rem', lineHeight: '2' }}>
                    Push
                  </Typography>
                )}
                <Typography variant="body1" style={{ fontWeight: '400', fontSize: '0.875rem', lineHeight: '2' }}>
                  SMS
                </Typography>
                <Typography variant="body1" style={{ fontWeight: '400', fontSize: '0.875rem', lineHeight: '2' }}>
                  Email
                </Typography>
                <Typography variant="body1" style={{ fontWeight: '400', fontSize: '0.875rem', lineHeight: '2' }}>
                  WhatsApp
                </Typography>
              </Box>
            </Box>
          </Grid>
          {fornatedactions.map((item, i) => (
            <Grid item xs={12} key={item.id}>
              <Box display="flex" alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      // checked={() => checkboxChecked(item.id)}
                      checked={
                        (Array.isArray(selectedItem) && selectedItem.includes(item.id)) ||
                        preferenceData.some((data) => data[item.id.replace(/ /g, '_')] === true)
                      }
                      name={item.id}
                      onChange={handleCheckboxChanged}
                      onClick={() => handleOpenNotification(item.id, item.actionid)}
                      className="CHECK"
                      // color="success"
                    />
                  }
                  label=""
                  style={{ marginLeft: '40px' }}
                />

                <Typography
                  variant="body1"
                  style={{ fontWeight: '400', fontSize: '0.875rem', lineHeight: '2', marginLeft: '60px' }}
                >
                  {formatActionName(item.id)}
                  <Tooltip key={item.id} title={renderTooltipTitle(item.id)}>
                    <IconButton>
                      <InfoIcon sx={{ fontSize: '14px', marginBottom: '10px' }} />
                    </IconButton>
                  </Tooltip>
                </Typography>

                <Box display="flex" gap="60px" marginLeft="auto">
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {(selectedNotification === 'POS Order' ||
                      selectedNotification === 'Purchase Indent' ||
                      selectedNotification === 'Purchase Order' ||
                      selectedNotification === 'Express Grn' ||
                      selectedNotification === 'Tickets' ||
                      selectedNotification === 'Oversold Products' ||
                      selectedNotification === 'Purchase Returns' ||
                      selectedNotification === 'Stock Transfer' ||
                      selectedNotification === 'Purchase Summary') && (
                      <Tooltip
                        title={
                          (Array.isArray(selectedItem) && selectedItem?.includes(item?.id)) ||
                          preferenceData?.some((data) => data[item?.id?.replace(/ /g, '_')] === true)
                            ? ''
                            : 'Enable Notifications for respective action'
                        }
                      >
                        <FormControlLabel
                          control={<Switch color="primary" />}
                          label=""
                          checked={
                            item?.push ||
                            pushPreferenceData?.some((data) => data[item?.id?.replace(/ /g, '_')] === true)
                          }
                          onClick={() => {
                            if (
                              item?.push ||
                              pushPreferenceData?.some((data) => data[item?.id?.replace(/ /g, '_')] === true)
                            ) {
                              handleDisablePushOpen(item?.actionid, item?.id);
                            } else if (
                              (Array.isArray(selectedItem) && selectedItem?.includes(item.id)) ||
                              preferenceData?.some((data) => data[item?.id?.replace(/ /g, '_')] === true)
                            ) {
                              handlePushCheckboxChange(event, item?.id, 'push', item?.actionid);
                            }
                          }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Tooltip
                      title={
                        (Array.isArray(selectedItem) && selectedItem.includes(item.id)) ||
                        preferenceData.some((data) => data[item.id.replace(/ /g, '_')] === true)
                          ? ''
                          : 'Enable Notifications for respective action'
                      }
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            color="primary"
                            checked={
                              item.sms || SMSPreferenceData.some((data) => data[item.id.replace(/ /g, '_')] === true)
                            }
                            // onChange={(event) => handleSMSCheckboxChange(event, item.id, 'sms', item.actionid)}
                          />
                        }
                        label=""
                        onClick={() => {
                          if (item.sms || SMSPreferenceData.some((data) => data[item.id.replace(/ /g, '_')] === true)) {
                            // The Switch is checked
                            handleSMSDisableOpen(item.actionid, item.id);
                          } else if (
                            (Array.isArray(selectedItem) && selectedItem.includes(item.id)) ||
                            preferenceData.some((data) => data[item.id.replace(/ /g, '_')] === true)
                          ) {
                            handleSMSCheckboxChange(event, item.id, 'sms', item.actionid);
                          }
                          // else {
                          //   handleSMSClickOpen(item.actionid, item.id.replace(/ /g, '_'));
                          // }
                        }}
                      />
                    </Tooltip>
                    {/* {findSMSPriority(item.id) === true ? (
                      <LightTooltip title="Upload Latest Template">
                        <IconButton>
                          <FileUploadIcon
                            onClick={() => handleSMSUpdateTemplate(item.id, item.actionId)}
                            fontSize="14px"
                            color="#7393B3"
                          />
                        </IconButton>
                      </LightTooltip>
                    ) : (
                      <LightTooltip>
                        <IconButton>
                          <FileUploadIcon fontSize="14px" color="#fafafa" />
                        </IconButton>
                      </LightTooltip>
                    )} */}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
                    <Tooltip
                      title={
                        (Array.isArray(selectedItem) && selectedItem?.includes(item.id)) ||
                        preferenceData?.some((data) => data[item?.id?.replace(/ /g, '_')] === true)
                          ? ''
                          : 'Enable Notifications for respective action'
                      }
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            color="primary"
                            checked={
                              item?.email ||
                              emailPreferenceData?.some((data) => data[item?.id?.replace(/ /g, '_')] === true)
                            }
                            // onChange={(event) =>
                            //   (!item.email ||
                            //     emailPreferenceData.some((data) => data[item.id.replace(/ /g, '_')] === false)) && subUser && handleCheckboxChange(event, item.id, 'email', item.actionid)
                            // }
                          />
                        }
                        label=""
                        onClick={(event) => {
                          if (
                            item?.email ||
                            emailPreferenceData?.some((data) => data[item?.id?.replace(/ /g, '_')] === true)
                          ) {
                            // The Switch is checked
                            handleEmailDisableOpen(item?.actionid, item?.id);
                          } else if (!subUser) {
                            // The Switch is not checked
                            // Handle the case when the Switch is not checked, if needed
                            handleClickOpen(item?.actionid, item?.id?.replace(/ /g, '_'));
                          } else if (
                            (Array.isArray(selectedItem) && selectedItem?.includes(item?.id)) ||
                            preferenceData?.some((data) => data[item?.id?.replace(/ /g, '_')] === true)
                          ) {
                            handleCheckboxChange(event, item?.id, 'email', item?.actionid);
                          }
                        }}
                        // onClick={() => !subUser && handleClickOpen(item.actionid, item.id.replace(/ /g, '_'))}
                      />
                    </Tooltip>
                    {findEmailPriority(item?.id) === true ? (
                      <LightTooltip title="Upload Latest Template">
                        <IconButton>
                          <FileUploadIcon
                            onClick={() => handleUpdateTemplate(item?.id, item?.actionid)}
                            sx={{ fontSize: '14px', color: '#7393B3' }}
                          />
                        </IconButton>
                      </LightTooltip>
                    ) : (
                      <LightTooltip>
                        <IconButton>
                          <FileUploadIcon sx={{ fontSize: '14px', color: '#fafafa' }} />
                        </IconButton>
                      </LightTooltip>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Tooltip
                      title={
                        (Array.isArray(selectedItem) && selectedItem?.includes(item.id)) ||
                        preferenceData?.some((data) => data[item?.id?.replace(/ /g, '_')] === true)
                          ? ''
                          : 'Enable Notifications for respective action'
                      }
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            color="primary"
                            checked={
                              item?.whatsapp ||
                              WhatsAppPreferenceData?.some((data) => data[item?.id?.replace(/ /g, '_')] === true)
                            }
                            // onChange={(event) =>
                            //  whatsAppConnect && handleWhatsAppCheckboxChange(event, item.id, 'whatsapp', item.actionid)
                            // }
                          />
                        }
                        label=""
                        onClick={() => {
                          if (
                            item?.whatsapp ||
                            WhatsAppPreferenceData?.some((data) => data[item?.id?.replace(/ /g, '_')] === true)
                          ) {
                            handleWaDisableOpen(item?.actionid, item?.id);
                          } else if (!whatsAppConnect) {
                            handlewaClickOpen(item?.actionid);
                          } else if (
                            (Array.isArray(selectedItem) && selectedItem?.includes(item.id)) ||
                            preferenceData?.some((data) => data[item?.id?.replace(/ /g, '_')] === true)
                          ) {
                            handleWhatsAppCheckboxChange(event, item?.id, 'whatsapp', item?.actionid);
                          }
                        }}
                      />
                    </Tooltip>
                    {/* <LightTooltip title="Upload Latest Template">
                      <IconButton>
                        <FileUploadIcon fontSize="14px" color="#7393B3" />
                      </IconButton>
                    </LightTooltip> */}
                  </Box>
                  {/* <Button onClick={() => handleUpdateTemplate(item.id, item.actionid)} disabled={disableUpdateBtn}>Update</Button> */}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>
    </>
  );
};

export default Fetchnotification;
