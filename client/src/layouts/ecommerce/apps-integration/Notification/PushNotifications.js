import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Slide,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import {
  deletePreferenceData,
  disableNotification,
  getAllPreferedData,
  getCommActionByCategory,
  getCustomerDetails,
  getWarehouseData,
  postPreferenceData,
  postSMSTemplateById,
} from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PushNotifications = ({ comCategoryId, selectedNotification }) => {
  const [actions, setActions] = useState([]);
  const [selectedItemArr, setSelectedItemArr] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dialogItem, setDialogItem] = useState('');
  const [fornatedactions, setFormatedactions] = useState([]);
  const [RetailOwner, setRetailOwner] = useState('');
  const [WMSOwner, setWMSOwner] = useState('');
  const [comActionId, setComActionId] = useState('');
  const [preferenceData, setPreferenceData] = useState([]);
  const [pushPreferenceData, setPushPreferenceData] = useState([]);
  const [openDisablePush, setOpenDisablePush] = useState(false);

  const showSnackbar = useSnackbar();

  const data = [];
  const pushData = [];

  const fetchData = async () => {
    try {
      await getCommActionByCategory(comCategoryId).then((res) => {
        setActions(res.data.data);

        for (let i = 0; i < res.data.data.length; i++) {
          getAllPreferedData(orgId, res.data.data[i].comActionName).then((response) => {
            const templateType = 'templateType';
            data.push(
              {
                [res.data.data[i].comActionName]: response.data.data.prefRefid !== '',
              },
              {
                [`${res.data.data[i].comActionName}_refId`]: response.data.data.prefRefid,
              },
            );

            if (response.data.data.templates.length !== 0) {
              pushData.push(
                {
                  [res.data.data[i].comActionName]: response.data.data.templates.some(
                    (obj) => obj.hasOwnProperty(templateType) && obj[templateType] === 'PUSH',
                  ),
                },
                {
                  [`${res.data.data[i].comActionName}_templateId`]: response.data.data.templates.find(
                    (obj) => obj.hasOwnProperty('templateType') && obj.templateType === 'PUSH',
                  )?.templateId,
                },
                {
                  [`${res.data.data[i].comActionName}_templateName`]: response.data.data.templates.find(
                    (obj) => obj.hasOwnProperty('templateType') && obj.templateType === 'PUSH',
                  )?.templateName,
                },
                {
                  [`${res.data.data[i].comActionName}_refId`]: response.data.data.templates.find(
                    (obj) => obj.hasOwnProperty('templateType') && obj.templateType === 'PUSH',
                  )?.refId,
                },
              );
            }
          });
        }

        setTimeout(() => {
          setPreferenceData(data);
          setPushPreferenceData(pushData);
        }, 1000);
      });
    } catch (error) {
      showSnackbar('Error: No data found', 'error');
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
  }, [actions, preferenceData]);

  const orgId = localStorage.getItem('orgId');
  const username = localStorage.getItem('user_name');
  const emailCc = localStorage.getItem('user_details');
  const clientId = localStorage.getItem('clientId');
  const obj = JSON.parse(emailCc);
  const orgType = localStorage.getItem('contextType');
  const sourceApp = localStorage.getItem('sourceApp');

  useEffect(() => {
    getCustomerDetails(orgId).then((res) => {
      setRetailOwner(res.data.data.retail.contacts[0].email);
    });
    getWarehouseData(orgId).then((res) => {
      setWMSOwner(res.data.data.warehouseOrganisationResponse.primaryContactDto.email);
    });
  }, []);

  const handleEnable = () => {
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

    if (Array.isArray(selectedItemArr)) {
      setSelectedItemArr((prevSelectedItems) => {
        const updatedSelectedItems = Array.isArray(prevSelectedItems)
          ? [...prevSelectedItems, dialogItem]
          : [dialogItem];
        return updatedSelectedItems;
      });
    }
    handleNotificationClose();

    try {
      postPreferenceData(payload);
      fetchData();
      showSnackbar(`Notification for ${dialogItem} Enabled`, 'success');
    } catch (error) {
      showSnackbar(`${dialogItem} not Selected`, 'error');
    }
  };

  const handleEnableNotifications = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedItemArr((prev) => [...prev, name]);
    } else {
      setSelectedItemArr((prev) => prev.filter((item) => item !== name));
    }
  };

  const handleNotificationOpen = (item, actionId) => {
    setNotificationOpen(true);
    setDialogItem(item);
    setComActionId(actionId);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleDisableNotification = () => {
    setSelectedItemArr((prevSelectedItems) => {
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
      handleNotificationClose();

      showSnackbar(`Notification Service for ${dialogItem} is disabled`, 'success');
      fetchData();
    } catch (error) {
      showSnackbar('Error: Not able to disable', 'error');
    }
  };

  //creating a unique template name
  const generateUniqueName = (id) => {
    const timestamp = Date.now();
    return `${id.replace(/ /g, '_')}_${timestamp}`;
  };

  let pushTemplate = '';

  const handlePushCheckboxChange = (event, id, type, actionId) => {
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
      case 'ORDER_PLACED':
        pushTemplate = "We've received your order. Sit back and relax!";
        break;
      case 'ORDER_PACKED':
        pushTemplate = 'Your order is being prepared for shipment.';
        break;
      case 'ORDER_SHIPPED':
        pushTemplate = 'Your order is on its way to you. Track its progress here.';
        break;
      case 'OUT_FOR_DELIVERY':
        pushTemplate = 'Your order is out for delivery. Expect it soon!';
        break;
      case 'DELIVERED_SUCCESSFULLY':
        pushTemplate = 'Hooray! Your order has been delivered. We hope you enjoy your purchase.';
        break;
      case 'ORDER_CANCELLED':
        pushTemplate =
          "We're sorry, but your order has been cancelled on ${date}. Please check your email for more details.";
        break;
      case 'NEW_ORDER_PLACED':
        pushTemplate = "New App Order\n You've received a new B2C app order in ${location}. Check it out now.";
        break;
      case 'NEW_ORDER_UNATTENDED':
        pushTemplate = "Attention\n You've ${orders} unfulfilled app orders. Review & complete the orders now.";
        break;
      case 'DELIVERY_AGENT_NOT_ASSIGNED':
        pushTemplate =
          "${orders} Delivery Pending\n Delivery agents hasn't been assigned for ${orders} app orders. Act quickly to avoid delays.";
        break;
      case 'ORDER_CANCELLED_FROM_STORE':
        pushTemplate = 'Order Cancelled\n Your order ${orderNo} from Twinleaves store has been cancelled.';
        break;
      case 'ORDER_DELAY':
        pushTemplate =
          'Order Delay!\n Your Twinleaves order is taking a bit longer to dispatch. We promise it’ll be worth the wait!';
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

  const handleDisableClose = () => {
    setOpenDisablePush(false);
  };

  const handlePushdisableAPI = () => {
    function findTemplateRefId(action) {
      const templateNameProperty = `${action}_refId`;
      const templateObject = pushPreferenceData.find((obj) => obj.hasOwnProperty(templateNameProperty));

      if (templateObject) {
        return templateObject[templateNameProperty];
      } else {
        return null;
      }
    }

    const payload = {
      templateType: 'PUSH',
      refId: findTemplateRefId(dialogItem.replace(/ /g, '_')),
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

  const formatActionName = (actionName) => {
    const words = actionName.split(' ');
    const formattedWords = words.map((word) => {
      if (word.length === 2) {
        return word.toUpperCase(); // Capitalize both letters if the length is 2
      } else {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter
      }
    });
    return formattedWords.join(' ');
  };

  const items = [
    { id: 'ORDER PLACED', title: 'Triggers a push notification when customer places order on app.' },
    { id: 'ORDER PACKED', title: 'Triggers a push notification when the app order is packed' },
    { id: 'ORDER SHIPPED', title: 'Triggers a push notification when the app order is shipped' },
    { id: 'OUT FOR DELIVERY', title: 'Triggers a push notification when the app order is out for delivery' },
    { id: 'DELIVERED SUCCESSFULLY', title: 'Triggers a push notification when order has been delivered' },
    { id: 'ORDER CANCELLED', title: 'Triggers a push notification when the app order has been cancelled' },

    // Add more items as needed
  ];

  const renderTooltipTitle = (itemId) => {
    // Find the item with the given id
    const selectedItem = items.find((item) => item.id === itemId);

    // If the item is found, return its title, otherwise return a default value
    return selectedItem ? selectedItem.title : 'Default Title';
  };

  return (
    <div>
      {/* enable disable notifications dialog box */}
      <div>
        <Dialog
          open={notificationOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleNotificationClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{`${
            selectedItemArr.includes(dialogItem) ? 'Enable' : 'Disable'
          } Notification service`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              You want to {selectedItemArr.includes(dialogItem) ? 'enable' : 'disable'} notifications for {dialogItem}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={!selectedItemArr.includes(dialogItem)} onClick={handleEnable}>
              Enable
            </Button>
            <Button disabled={selectedItemArr.includes(dialogItem)} onClick={handleDisableNotification}>
              Disable
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
          onClose={handleDisableClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Disable Email for {dialogItem}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to disable Push notifications for {dialogItem}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePushdisableAPI}>Yes</Button>
            <Button onClick={handleDisableClose}>No</Button>
          </DialogActions>
        </Dialog>
      </div>

      <Card sx={{ padding: '20px', paddingRight: '30px', marginTop: '2rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Typography style={{ fontWeight: '400', fontSize: '1rem', lineHeight: '2' }}>{/* App Name */}</Typography>
              <Typography variant="body1" style={{ fontWeight: '400', fontSize: '0.875rem', lineHeight: '2' }}>
                Enable Notifications
              </Typography>
              <Box display="flex" gap="90px" marginLeft="auto">
                <Typography variant="body1" style={{ fontWeight: '400', fontSize: '0.875rem', lineHeight: '2' }}>
                  Push Notifications
                </Typography>
              </Box>
            </Box>
          </Grid>
          {fornatedactions.map((item) => {
            return (
              <Grid item xs={12} key={item.id}>
                <Box display="flex" alignItems="center">
                  <FormControlLabel
                    control={<Checkbox name={item.id} className="CHECK" />}
                    label=""
                    checked={
                      (Array.isArray(selectedItemArr) && selectedItemArr.includes(item.id)) ||
                      preferenceData.some((data) => data[item.id.replace(/ /g, '_')] === true)
                    }
                    name={item.id}
                    onChange={handleEnableNotifications}
                    onClick={() => handleNotificationOpen(item.id, item.actionid)}
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
                      <Tooltip
                        title={
                          (Array.isArray(selectedItemArr) && selectedItemArr.includes(item.id)) ||
                          preferenceData.some((data) => data[item.id.replace(/ /g, '_')] === true)
                            ? ''
                            : 'Enable Notifications for respective action'
                        }
                      >
                        <FormControlLabel
                          control={<Switch color="primary" />}
                          label=""
                          checked={
                            item.push || pushPreferenceData.some((data) => data[item.id.replace(/ /g, '_')] === true)
                          }
                          onClick={() => {
                            if (
                              item.push ||
                              pushPreferenceData.some((data) => data[item.id.replace(/ /g, '_')] === true)
                            ) {
                              handleDisablePushOpen(item.actionid, item.id);
                            } else if (
                              (Array.isArray(selectedItemArr) && selectedItemArr.includes(item.id)) ||
                              preferenceData.some((data) => data[item.id.replace(/ /g, '_')] === true)
                            ) {
                              handlePushCheckboxChange(event, item.id, 'push', item.actionid);
                            }
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Card>
    </div>
  );
};

export default PushNotifications;
