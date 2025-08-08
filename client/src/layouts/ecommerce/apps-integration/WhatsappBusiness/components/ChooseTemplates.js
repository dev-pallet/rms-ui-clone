import InfoIcon from '@mui/icons-material/Info';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import {
  whatsappBusinessCatalogDetails,
  whatsappBusinessCreateCatalog,
  whatsappBusinessCreateTemplate,
} from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import TextEditor from '../../Notification/CustomComponents/TextEditor';

const ChooseTemplates = ({ setSelectedTab, itemsState, setItems }) => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [WelcomeOpen, setWelcomeOpen] = useState(false);
  const [welcomeTemplate, setWelcomeTemplate] = useState('');
  const [welcomeBody, setWelcomeBody] = useState('');
  const [welcomeLoader, setWelcomeLoader] = useState(false);

  const [welcomePresent, setWelcomePresent] = useState(false);

  const [addressOpen, setAddressOpen] = useState(false);
  const [addressText, setAddressText] = useState('');
  const [addressTemplate, setAddressTemplate] = useState('');
  const [addressLoader, setAddressLoader] = useState(false);

  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogBody, setCatalogBody] = useState('');
  const [catalogFooter, setCatalogFooter] = useState('');
  const [catalogName, setCatalogName] = useState('');
  const [catalogButton, setCatalogButton] = useState('View catalog');
  const [catalogLoader, setCatalogLoader] = useState(false);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentTemplateName, setPaymentTemplateName] = useState('');
  const [paymentBody, setPaymentBody] = useState('');
  const [paymentButton, setPaymentButton] = useState('');
  const [paymentLoader, setPaymentLoader] = useState(false);

  const [catalogPresent, setCatalogPresent] = useState(false);
  const [addressPresent, setAddressPresent] = useState(false);

  const [paymentPresent, setPaymentPresent] = useState(false);
  const [servPresent, setServPresent] = useState(false);

  const [serviceableOpen, setServiceableOpen] = useState(false);
  const [serviceableText, setServiceableText] = useState('');
  const [serviceableTemplateName, setServiceableTemplateName] = useState('');
  const [serviceableFooter, setServiceableFooter] = useState('');
  const [servLoader, setServLoader] = useState(false);

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const chars = 1024;

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle, isDragDisabled, index) => {
    const originalIndex = itemsState.findIndex((item) => item.id === itemsState[index].id);
    const isOriginalPosition = originalIndex === index;

    return {
      userSelect: 'none',
      padding: grid * 2,
      margin: `0 0 ${grid}px 0`,
      background: isDragging ? 'lightgreen' : isDragDisabled ? 'lightgrey' : 'linear-gradient(60deg, #0562FB, #fff)',
      color: isDragging ? '#4b524d' : isDragDisabled || !isOriginalPosition ? '#4b524d' : '#fff',
      borderRadius: '10px',
      cursor: 'pointer',
      ...draggableStyle,
    };
  };

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    borderRadius: '10px',
    padding: grid,
  });

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    if (destination.index >= 0) {
      return;
    }

    const updatedItems = reorder(itemsState, source.index, destination.index);
    setItems(updatedItems);
  };

  const handleClick = (itemId) => {
    if (itemId === 'item1') {
      if (welcomePresent) {
        showSnackbar('Welcome Template already created', 'warning');
      } else {
        setWelcomeOpen(true);
      }
    } else if (itemId === 'item2') {
      if (addressPresent) {
        showSnackbar('Address Template already created', 'warning');
      } else {
        setAddressOpen(true);
      }
    } else if (itemId === 'item3') {
      if (catalogPresent) {
        showSnackbar('Catalog Template already created', 'warning');
      } else {
        setCatalogOpen(true);
      }
    } else if (itemId === 'item4') {
      if (paymentPresent) {
        showSnackbar('Payment Template already created', 'warning');
      } else {
        setPaymentOpen(true);
      }
    } else if (itemId === 'item5') {
      if (servPresent) {
        showSnackbar('Non-serviceable Template already created', 'warning');
      } else {
        setServiceableOpen(true);
      }
    }
  };

  const createAddressTemplate = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const catalogId = localStorage.getItem('catalogId');
    setAddressLoader(true);

    const payload = {
      orgId: orgId,
      locId: locId,
      catalogId: catalogId,
      type: 'ADDRESS',
      templateName: addressTemplate,
      bodyText: convertNewlines(addressText),
      createdBy: uidx,
    };

    try {
      whatsappBusinessCreateTemplate(payload)
        .then((res) => {
          if (res?.data?.status === 'SUCCESS') {
            setAddressLoader(false);
            showSnackbar('Template for Address Created Successfully', 'success');
            setAddressOpen(false);
          } else if (res?.data?.status === 'ERROR') {
            setAddressLoader(false);
            showSnackbar('Template for Address for this org is already created', 'error');
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data?.message) {
            setAddressLoader(false);
            showSnackbar(error?.response?.data?.message, 'error');
          }
        });
    } catch (error) {
      setAddressLoader(false);
      showSnackbar(error?.message, 'error');
    }
  };

  const convertNewlines = (text) => {
    return text.replace(/\\n/g, '\n');
  };

  const createCatalogTemplate = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const catalogId = localStorage.getItem('catalogId');
    setCatalogLoader(true);

    const payload = {
      orgId: orgId,
      locId: locId,
      // name: 'catalog',
      type: 'CATALOG',
      templateName: catalogName,
      bodyText: convertNewlines(catalogBody),
      // footerText: catalogFooter,
      buttonText: catalogButton,
      buttonType: 'CATALOG',
      createdBy: uidx,
      catalogId: catalogId,
    };

    try {
      whatsappBusinessCreateCatalog(payload)
        .then((res) => {
          if (res?.data?.status === 'SUCCESS') {
            setCatalogLoader(false);
            showSnackbar('Template for Catalog Created Successfully', 'success');
            setCatalogOpen(false);
          } else if (res?.data?.status === 'ERROR') {
            if (res?.data?.message === 'For this store the catalog message template is already set') {
              setCatalogLoader(false);
              showSnackbar('Catalog message template is already set for this store', 'error');
            } else {
              setCatalogLoader(false);
              showSnackbar(res?.data?.message, 'error');
            }
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data?.message) {
            setCatalogLoader(false);
            showSnackbar(error?.response?.data?.message, 'error');
          }
        });
    } catch (error) {
      setCatalogLoader(false);
      showSnackbar('Catalog message template is already set for this store', 'error');
    }
  };

  const handleCreationPayment = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const catalogId = localStorage.getItem('catalogId');
    setPaymentLoader(true);

    const payload = {
      orgId: orgId,
      locId: locId,
      type: 'PAYMENT',
      templateName: paymentTemplateName,
      bodyText: convertNewlines(paymentBody),
      buttonType: 'QUICK_REPLY',
      buttonText: paymentButton,
      createdBy: uidx,
      catalogId: catalogId,
    };

    try {
      whatsappBusinessCreateTemplate(payload)
        .then((res) => {
          if (res?.data?.status === 'SUCCESS') {
            setPaymentLoader(false);
            showSnackbar('Template for Payment Created Successfully', 'success');
            setCatalogOpen(false);
          } else if (res?.data?.status === 'ERROR') {
            if (res?.data?.message === 'For this store the payment message template is already set') {
              setPaymentLoader(false);
              showSnackbar('Payment message template is already set for this store', 'error');
            } else {
              setPaymentLoader(false);
              showSnackbar(res?.data?.message, 'error');
            }
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data?.message) {
            setPaymentLoader(false);
            showSnackbar(error?.response?.data?.message, 'error');
          }
        });
    } catch (error) {
      setPaymentLoader(false);
      showSnackbar('Payment message template is already set for this store', 'error');
    }
  };

  const handleServiceabilityCreation = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const catalogId = localStorage.getItem('catalogId');
    setServLoader(true);

    const payload = {
      orgId: orgId,
      locId: locId,
      type: 'NON-SERVICEABLE',
      templateName: serviceableTemplateName,
      bodyText: convertNewlines(serviceableText),
      // buttonType: 'QUICK_REPLY',
      // buttonText: serviceableFooter,
      createdBy: uidx,
      catalogId: catalogId,
    };

    try {
      whatsappBusinessCreateTemplate(payload)
        .then((res) => {
          if (res?.data?.status === 'SUCCESS') {
            setServLoader(false);
            showSnackbar('Template for Non-serviceability Created Successfully', 'success');
            setCatalogOpen(false);
          } else if (res?.data?.status === 'ERROR') {
            if (res?.data?.message === 'For this store the Non-serviceability message template is already set') {
              setServLoader(false);
              showSnackbar('Non-serviceability message template is already set for this store', 'error');
            } else {
              setServLoader(false);
              showSnackbar(res?.data?.message, 'error');
            }
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data?.message) {
            setServLoader(false);
            showSnackbar(error?.response?.data?.message, 'error');
          }
        });
    } catch (error) {
      setServLoader(false);
      showSnackbar('Non-serviceability message template is already set for this store', 'error');
    }
  };

  const handleWelcomeCreation = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const catalogId = localStorage.getItem('catalogId');
    setWelcomeLoader(true);

    const payload = {
      orgId: orgId,
      locId: locId,
      type: 'WELCOME',
      templateName: welcomeTemplate,
      bodyText: convertNewlines(welcomeBody),
      createdBy: uidx,
      catalogId: catalogId,
    };

    try {
      whatsappBusinessCreateTemplate(payload)
        .then((res) => {
          if (res?.data?.status === 'SUCCESS') {
            setWelcomeLoader(false);
            showSnackbar('Template for Welcome Created Successfully', 'success');
            setCatalogOpen(false);
          } else if (res?.data?.status === 'ERROR') {
            if (res?.data?.message === 'For this store the Welcome message template is already set') {
              setWelcomeLoader(false);
              showSnackbar('Welcome message template is already set for this store', 'error');
            } else {
              setWelcomeLoader(false);
              showSnackbar(res?.data?.message, 'error');
            }
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data?.message) {
            setWelcomeLoader(false);
            showSnackbar(error?.response?.data?.message, 'error');
          }
        });
    } catch (error) {
      setWelcomeLoader(false);
      showSnackbar('Welcome message template is already set for this store', 'error');
    }
  };

  const getWelcomedetails = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const catalogId = localStorage.getItem('catalogId');
    const type = 'WELCOME';
    try {
      whatsappBusinessCatalogDetails(orgId, catalogId, type).then((res) => {
        setWelcomePresent(true);
      });
    } catch (error) {
      showSnackbar('No template details found', 'error');
    }
  };

  const getCatalogDetails = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const catalogId = localStorage.getItem('catalogId');
    const type = 'CATALOG';
    try {
      whatsappBusinessCatalogDetails(orgId, catalogId, type).then((res) => {
        setCatalogPresent(true);
      });
    } catch (error) {
      showSnackbar('No template details found', 'error');
    }
  };

  const getPaymentDetails = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const catalogId = localStorage.getItem('catalogId');
    const type = 'PAYMENT';
    try {
      whatsappBusinessCatalogDetails(orgId, catalogId, type).then((res) => {
        setPaymentPresent(true);
      });
    } catch (error) {
      showSnackbar('No template details found', 'error');
    }
  };

  const getServiceabilityDetails = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const catalogId = localStorage.getItem('catalogId');
    const type = 'NON-SERVICEABLE';
    try {
      whatsappBusinessCatalogDetails(orgId, catalogId, type).then((res) => {
        setServPresent(true);
      });
    } catch (error) {
      showSnackbar('No template details found', 'error');
    }
  };

  const getAddressDetails = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const catalogId = localStorage.getItem('catalogId');
    const type = 'ADDRESS';
    try {
      whatsappBusinessCatalogDetails(orgId, catalogId, type).then((res) => {
        setAddressPresent(true);
      });
    } catch (error) {
      showSnackbar('No template details found', 'error');
    }
  };

  useEffect(() => {
    getCatalogDetails();
    getAddressDetails();
    getPaymentDetails();
    getServiceabilityDetails();
    getWelcomedetails();
  }, []);

  return (
    <div>
      <Dialog open={WelcomeOpen} onClose={() => setWelcomeOpen(false)}>
        <DialogTitle>
          <Typography
            style={{
              fontWeight: '600',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: '#4b524d',
              textAlign: 'left',
              margin: '10px 0px',
            }}
          >
            Welcome Message.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can create an interactive message now. Give the body text for welcoming customer to whatsapp shopping.
          </DialogContentText>

          <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Template Name <span className="dynamic-coupon-imp">*</span>
              <Tooltip
                title='The name of the template should be in small letters and two letters should be joined by "_"'
                placement="top"
              >
                <IconButton>
                  <InfoIcon sx={{ fontSize: '15px' }} />
                </IconButton>
              </Tooltip>
            </Typography>
            <SoftInput
              placeholder="Enter Template Name"
              style={{ width: '400px' }}
              type="text"
              value={welcomeTemplate}
              onChange={(e) => {
                const newValue = e.target.value.toLowerCase().replace(/\s+/g, '_');
                setWelcomeTemplate(newValue);
              }}
            />
          </SoftBox>

          <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Body Text <span className="dynamic-coupon-imp">*</span>
            </Typography>
            {/* <SoftInput
              placeholder="Enter Body Text"
              style={{ width: '400px' }}
              type="text"
              value={welcomeBody}
              onChange={(e) => setWelcomeBody(e.target.value)}
            /> */}
            <TextEditor chars={chars} text={welcomeBody} setText={setWelcomeBody} />
          </SoftBox>
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={() => setWelcomeOpen(false)} className="vendor-second-btn">
            Cancel
          </SoftButton>
          <SoftButton className="vendor-add-btn" onClick={handleWelcomeCreation}>
            {welcomeLoader ? (
              <CircularProgress
                sx={{ color: 'white !important', height: '15px !important', width: '15px !important' }}
              />
            ) : (
              'Submit'
            )}
          </SoftButton>
        </DialogActions>
      </Dialog>

      <Dialog open={addressOpen} onClose={() => setAddressOpen(false)}>
        <DialogTitle>
          <Typography
            style={{
              fontWeight: '600',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: '#4b524d',
              textAlign: 'left',
              margin: '10px 0px',
            }}
          >
            Address Message.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can create an interactive message now. Give the body text for asking address from the user.
          </DialogContentText>
          <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Template Name <span className="dynamic-coupon-imp">*</span>
              <Tooltip
                title='The name of the template should be in small letters and two letters should be joined by "_"'
                placement="top"
              >
                <IconButton>
                  <InfoIcon sx={{ fontSize: '15px' }} />
                </IconButton>
              </Tooltip>
            </Typography>
            <SoftInput
              placeholder="Enter Template Name"
              style={{ width: '400px' }}
              type="text"
              value={addressTemplate}
              onChange={(e) => {
                const newValue = e.target.value.toLowerCase().replace(/\s+/g, '_');
                setAddressTemplate(newValue);
              }}
            />
          </SoftBox>

          <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Body Text <span className="dynamic-coupon-imp">*</span>
            </Typography>
            {/* <SoftInput
              placeholder="Enter Body Text"
              style={{ width: '400px' }}
              type="text"
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
            /> */}
            <TextEditor chars={chars} text={addressText} setText={setAddressText} />
          </SoftBox>
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={() => setAddressOpen(false)} className="vendor-second-btn">
            Cancel
          </SoftButton>
          <SoftButton className="vendor-add-btn" onClick={createAddressTemplate}>
            {addressLoader ? (
              <CircularProgress
                sx={{ color: 'white !important', height: '15px !important', width: '15px !important' }}
              />
            ) : (
              'Submit'
            )}
          </SoftButton>
        </DialogActions>
      </Dialog>

      <Dialog open={catalogOpen} onClose={() => setCatalogOpen(false)}>
        <DialogTitle>
          <Typography
            style={{
              fontWeight: '600',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: '#4b524d',
              textAlign: 'left',
              margin: '10px 0px',
            }}
          >
            Catalog Message.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can create an interactive message now. Give the message for sending catalog to the user.
          </DialogContentText>

          <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Template Name <span className="dynamic-coupon-imp">*</span>
              <Tooltip
                title='The name of the template should be in small letters and two letters should be joined by "_"'
                placement="top"
              >
                <IconButton>
                  <InfoIcon sx={{ fontSize: '15px' }} />
                </IconButton>
              </Tooltip>
            </Typography>
            <SoftInput
              placeholder="Enter Template Name"
              style={{ width: '400px' }}
              type="text"
              value={catalogName}
              onChange={(e) => {
                const newValue = e.target.value.toLowerCase().replace(/\s+/g, '_');
                setCatalogName(newValue);
              }}
            />
          </SoftBox>
          <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Body Text <span className="dynamic-coupon-imp">*</span>
            </Typography>
            {/* <SoftInput
              placeholder="Enter Body Text"
              style={{ width: '400px' }}
              type="text"
              value={catalogBody}
              onChange={(e) => setCatalogBody(e.target.value)}
            /> */}
            <TextEditor chars={chars} text={catalogBody} setText={setCatalogBody} />
          </SoftBox>

          {/* <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Footer Text{' '}
              <span className="dynamic-coupon-imp">
                *
              </span>
            </Typography>
            <SoftInput
              placeholder="Enter Footer Text"
              style={{ width: '400px' }}
              type="text"
              value={catalogFooter}
              onChange={(e) => setCatalogFooter(e.target.value)}
            />
          </SoftBox> */}

          <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Button Text <span className="dynamic-coupon-imp">*</span>
            </Typography>
            <SoftInput
              placeholder="Enter Button Text"
              style={{ width: '400px' }}
              type="text"
              value={catalogButton}
              // onChange={(e) => setCatalogButton(e.target.value)}
            />
          </SoftBox>
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={() => setCatalogOpen(false)} className="vendor-second-btn">
            Cancel
          </SoftButton>
          <SoftButton className="vendor-add-btn" onClick={createCatalogTemplate}>
            {catalogLoader ? (
              <CircularProgress
                sx={{ color: 'white !important', height: '15px !important', width: '15px !important' }}
              />
            ) : (
              'Submit'
            )}
          </SoftButton>
        </DialogActions>
      </Dialog>

      <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)}>
        <DialogTitle>
          <Typography
            style={{
              fontWeight: '600',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: '#4b524d',
              textAlign: 'left',
              margin: '10px 0px',
            }}
          >
            Payment Message.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can create an interactive message now. Give the body text for asking for payment options from the user.
          </DialogContentText>
          <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Template Name <span className="dynamic-coupon-imp">*</span>
              <Tooltip
                title='The name of the template should be in small letters and two letters should be joined by "_"'
                placement="top"
              >
                <IconButton>
                  <InfoIcon sx={{ fontSize: '15px' }} />
                </IconButton>
              </Tooltip>
            </Typography>
            <SoftInput
              placeholder="Enter Template Name"
              style={{ width: '400px' }}
              type="text"
              value={paymentTemplateName}
              onChange={(e) => {
                const newValue = e.target.value.toLowerCase().replace(/\s+/g, '_');
                setPaymentTemplateName(newValue);
              }}
            />
          </SoftBox>

          <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Body Text <span className="dynamic-coupon-imp">*</span>
            </Typography>
            {/* <SoftInput
              placeholder="Enter Body Text"
              style={{ width: '400px' }}
              type="text"
              value={paymentBody}
              onChange={(e) => setPaymentBody(e.target.value)}
            /> */}
            <TextEditor chars={chars} text={paymentBody} setText={setPaymentBody} />
          </SoftBox>

          {/* <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Footer Text{' '}
              <span className="dynamic-coupon-imp">
                *
              </span>
            </Typography>
            <SoftInput
              placeholder="Enter Footer Text"
              style={{ width: '400px' }}
              type="text"
              value={paymentFooter}
              onChange={(e) => setPaymentFooter(e.target.value)}
            />
          </SoftBox> */}

          <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Button Text <span className="dynamic-coupon-imp">*</span>
            </Typography>
            <SoftInput
              placeholder="Enter Button Text"
              style={{ width: '400px' }}
              type="text"
              value={paymentButton}
              onChange={(e) => setPaymentButton(e.target.value)}
            />
          </SoftBox>
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={() => setPaymentOpen(false)} className="vendor-second-btn">
            Cancel
          </SoftButton>
          <SoftButton className="vendor-add-btn" onClick={handleCreationPayment}>
            {paymentLoader ? (
              <CircularProgress
                sx={{ color: 'white !important', height: '15px !important', width: '15px !important' }}
              />
            ) : (
              'Submit'
            )}
          </SoftButton>
        </DialogActions>
      </Dialog>

      <Dialog open={serviceableOpen} onClose={() => setServiceableOpen(false)}>
        <DialogTitle>
          <Typography
            style={{
              fontWeight: '600',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: '#4b524d',
              textAlign: 'left',
              margin: '10px 0px',
            }}
          >
            Not Serviceable Message.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can create an interactive message now. Give the body text for telling the customer that the address they
            provided is not serviceable.
          </DialogContentText>

          <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Template Name <span className="dynamic-coupon-imp">*</span>
              <Tooltip
                title='The name of the template should be in small letters and two letters should be joined by "_"'
                placement="top"
              >
                <IconButton>
                  <InfoIcon sx={{ fontSize: '15px' }} />
                </IconButton>
              </Tooltip>
            </Typography>
            <SoftInput
              placeholder="Enter Template Name"
              style={{ width: '400px' }}
              type="text"
              value={serviceableTemplateName}
              onChange={(e) => {
                const newValue = e.target.value.toLowerCase().replace(/\s+/g, '_');
                setServiceableTemplateName(newValue);
              }}
            />
          </SoftBox>

          <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Body Text <span className="dynamic-coupon-imp">*</span>
            </Typography>
            {/* <SoftInput
              placeholder="Enter Body Text"
              style={{ width: '400px' }}
              type="text"
              value={serviceableText}
              onChange={(e) => setServiceableText(e.target.value)}
            /> */}
            <TextEditor chars={chars} text={serviceableText} setText={setServiceableText} />
          </SoftBox>

          {/* <SoftBox className="dynamic-coupon-margintop-2">
            <Typography className="dynamic-copupon-form-heading-1">
              Button Text{' '}
              <span className="dynamic-coupon-imp">
                *
              </span>
            </Typography>
            <SoftInput
              placeholder="Enter Button Text"
              style={{ width: '400px' }}
              type="text"
              value={serviceableFooter}
              onChange={(e) => setServiceableFooter(e.target.value)}
            />
          </SoftBox> */}
        </DialogContent>
        <DialogActions>
          <SoftButton onClick={() => setServiceableOpen(false)} className="vendor-second-btn">
            Cancel
          </SoftButton>
          <SoftButton className="vendor-add-btn" onClick={handleServiceabilityCreation}>
            {servLoader ? (
              <CircularProgress
                sx={{ color: 'white !important', height: '15px !important', width: '15px !important' }}
              />
            ) : (
              'Submit'
            )}
          </SoftButton>
        </DialogActions>
      </Dialog>

      <SoftBox className="add-catalog-products-box">
        <>
          <Typography className="whatsapp-bus-process-typo">Create Templates</Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              style={{
                fontWeight: '200',
                fontSize: '0.8rem',
                lineHeight: '1.5',
                color: '#4b524d',
                textAlign: 'left',
                margin: '5px 0px',
              }}
            >
              Create templates for different messages you want to send as a part of the Whatsapp Business.
            </Typography>
          </div>

          <div style={{ marginTop: '10px' }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {itemsState.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={index >= 0}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleClick(item.id)}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, index < 0, index)}
                          >
                            <Typography
                              style={{
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                lineHeight: '1.5',
                                textAlign: 'left',
                                margin: '5px 0px',
                              }}
                            >
                              {item.content}
                            </Typography>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </>

        {/* {catalogPresent && addressPresent && servPresent && paymentPresent && welcomePresent && (
          <>
            <Typography className="whatsapp-bus-process-typo" mt={2}>
              Preview Templates
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Stack alignItems="center">
                <Typography fontSize="16px" fontWeight={700}>
                  Catalog
                </Typography>
                <SoftBox className="message-preview-inner" style={{ marginTop: '10px', width: '270px' }}>
                  <div className="message-preview-top-box">
                    <div className="message-preview-top-img">
                      <FaRegImage fontSize="30px" color="#fff" />
                    </div>
                    <div>
                      <Typography className="template-header-typo">View (BIZ_NAME)'s Catalog on Whatsapp</Typography>

                      <Typography className="template-header-typo2">
                        Browse pictures and details of their offerings
                      </Typography>
                    </div>
                  </div>
                  <Typography className="template-body-text">{catalogDetails?.bodyText}</Typography>

                  <Typography className="template-footer-text">{catalogDetails?.footerText}</Typography>
                  <p className="message-preview-time">12:08</p>
                  <SoftBox>
                    <hr />
                    <div className="template-button-body">
                      <FaListUl color="#0562FB" size="14px" />
                      <Typography className="template-button-text">View Catalog</Typography>
                    </div>
                  </SoftBox>
                </SoftBox>
              </Stack>
              {addressPresent && (
                <Stack alignItems="center">
                  <Typography fontSize="16px" fontWeight={700}>
                    Address
                  </Typography>
                  <SoftBox className="message-preview-inner" style={{ marginTop: '10px', width: '270px' }}>
                    <Typography className="template-body-text">{addressDetails?.bodyText}</Typography>
                    <p className="message-preview-time">12:08</p>

                    <SoftBox>
                      <hr />
                      <div className="template-button-body">
                        <Typography className="template-button-text">Provide Address</Typography>
                      </div>
                    </SoftBox>
                  </SoftBox>
                </Stack>
              )}
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mt={2}>
              <Stack alignItems="center">
                <Typography fontSize="16px" fontWeight={700}>
                  Payment
                </Typography>
                <SoftBox className="message-preview-inner" style={{ marginTop: '10px', width: '270px' }}>
                  <Typography className="template-body-text">{paymentDetails?.bodyText}</Typography>

                  
                  <p className="message-preview-time">12:08</p>
                  <SoftBox>
                    <hr />
                    <div className="template-button-body">
                      <Typography className="template-button-text">
                        {paymentDetails?.buttonText ? paymentDetails?.buttonText : 'CONFIRM'}
                      </Typography>
                    </div>
                  </SoftBox>
                </SoftBox>
              </Stack>

              <Stack alignItems="center">
                <Typography fontSize="16px" fontWeight={700}>
                  Non-Serviceability
                </Typography>
                <SoftBox className="message-preview-inner" style={{ marginTop: '10px', width: '270px' }}>
                  <Typography className="template-body-text">{servDetails?.bodyText}</Typography>

                 
                  <p className="message-preview-time">12:08</p>
                </SoftBox>
                <SoftBox>
                    <hr />
                    <div className="template-button-body">
                      <Typography className="template-button-text">
                        {servDetails?.buttonText ? servDetails?.buttonText : 'CONFIRM'}
                      </Typography>
                    </div>
                  </SoftBox>
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mt={2}>
              <Stack alignItems="center">
                <Typography fontSize="16px" fontWeight={700}>
                  Welcome
                </Typography>
                <SoftBox className="message-preview-inner" style={{ marginTop: '10px', width: '270px' }}>
                  <Typography className="template-body-text">{welcomeDetails?.bodyText}</Typography>
                  <p className="message-preview-time">12:08</p>
                </SoftBox>
              </Stack>
            </Stack>
          </>
        )} */}

        <SoftBox className="whatsapp-bus-button-box">
          <SoftButton className="vendor-add-btn" onClick={() => setSelectedTab('Preview')}>
            Next
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </div>
  );
};

export default ChooseTemplates;
