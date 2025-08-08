import '../shop-location.css';
import { Box, Button, Grid } from '@mui/material';
import {
  addBranchContactRetail,
  deleteBrandContact,
  getAllBranchContact,
  updateBranchContactRetail,
} from '../../../../config/Services';
import { buttonStyles } from '../../Common/buttonColor';
import { useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import SetInterval from '../../setinterval';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../components/Spinner';
import sideNavUpdate from 'components/Utility/sidenavupdate';

const LocAddressDetail = ({ handleTab }) => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  sideNavUpdate();

  const { locationId } = useParams();
  const [open, setOpen] = useState(false);
  const [loader, setloader] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');
  const [errorhandler, setErrorHandler] = useState('');
  const [successUr, setSuccessUr] = useState(false);

  const orgId = localStorage.getItem('orgId');
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;

  const [newContactName, setNewContactName] = useState('');
  const [newContactType, setNewContactType] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhoneNo, setNewPhoneNo] = useState('');
  const [priority, setNewPriority] = useState('');

  const [opensnack, setOpensnack] = useState(false);
  const [alertmessage, setAlertmessage] = useState('');
  const [timelinerror, setTimelineerror] = useState('');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleopensnack = () => {
    setOpensnack(true);
  };

  const [IsreadOnly, setIsreadOnly] = useState(true);
  const [showedit, setShowedit] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [showAddAddress, setShowContact] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [editedItem, setEditedItem] = useState(false);

  const handleBasicEdit = (item) => {
    setShowedit(true);
    setIsreadOnly(false);
    setEditedItem(item);
  };

  const handleBasicDelete = (item) => {
    setUpdated(true);
    const payload = {
      contactId: item.contactId,
      updatedBy: uidx,
    };
    deleteBrandContact(payload)
      .then((res) => {
        setUpdated(false);
        setAlertmessage('Deleted Successfully');
        setTimelineerror('success');
        SetInterval(handleopensnack());
        allBranchDetails();
      })
      .catch((err) => {
        setAlertmessage('Some error occured');
        setTimelineerror('success');
        SetInterval(handleopensnack());
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({
      ...editedItem,
      [name]: value,
    });
  };
  const handleInputChange2 = (e) => {
    const value = e.value;
    const name = 'contactType';
    setEditedItem({ ...editedItem, [name]: value });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };
  const handleclosebutton = () => {
    setShowedit(false);
  };

  const handleUpdate = (item) => {
    const payload = {
      contactId: item.contactId,
      phoneNo: item.phoneNo,
      email: item.email,
      contactType: item.contactType,
      name: item.name,
      updatedBy: uidx,
    };
    if (payload?.phoneNo?.length !== 10) {
      setAlertmessage('Mobile Number should be of 10 digit');
      setTimelineerror('error');
      SetInterval(handleopensnack());
    } else {
      updateBranchContactRetail(payload).then((res) => {
        setUpdated(true);
      });
      setEditedItem(null);
      setShowedit(false);
    }
  };

  useEffect(() => {
    const tabChangeFromSku = localStorage.getItem('add-vendor-product-portfolio');
    if (tabChangeFromSku) {
      handleTab(1);
    }
  }, []);

  useEffect(() => {
    setloader(true);
    if (locationId) {
      allBranchDetails();
    }
  }, [updated]);

  const allBranchDetails = () => {
    getAllBranchContact(locationId).then((res) => {
      if (res.data.data.message === 'COTACTS_NOT_FOUND') {
        setloader(false);
        setAlertmessage('CONTACT NOT FOUND');
        setTimelineerror('error');
        SetInterval(handleopensnack());
        setMsg('Contact Not Found');
      } else {
        setAllContacts(res.data.data.contacts);
        setUpdated(false);
      }
      setloader(false);
    });
  };

  const handleNewContact = () => {
    setShowContact(true);
  };

  const handleAddNewContact = () => {
    const payload = {
      entityId: locationId,
      entityType: 'BRANCH',
      phoneNo: newPhoneNo,
      email: newEmail,
      contactType: newContactType,
      contactName: newContactName,
      createdBy: uidx,
    };
    const isEmptyField = Object.values(payload).some((value) => value === undefined || value === '');
    if (isEmptyField) {
      setAlertmessage('Fill in all the fields');
      setTimelineerror('error');
      SetInterval(handleopensnack());
    } else if (payload?.phoneNo?.length !== 10) {
      setAlertmessage('Mobile Number should be of 10 digit');
      setTimelineerror('error');
      SetInterval(handleopensnack());
    } else {
      addBranchContactRetail(payload)
        .then((res) => {
          setShowContact(false);
          setUpdated(true);
          if(res?.data?.data?.es===1){
            setAlertmessage(res?.data?.data?.message);
            setTimelineerror('error');
            SetInterval(handleopensnack());
          }
        })
        .catch((err) => {
          setAlertmessage(err?.response?.data?.message);
          setTimelineerror('error');
          SetInterval(handleopensnack());
        });
    }
  };

  const handlecloseContact = () => {
    setShowContact(false);
  };

  return (
    <>
      <Box mt={2}>
        {loader ? (
          <Spinner />
        ) : (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} xl={12}>
                {showAddAddress ? (
                  <SoftBox className="setting-main-cont">
                    <SoftBox className="setting-inner-main-cont1">
                      <SoftBox className="setting-inner-heading-cont">
                        <SoftTypography className="basic-font">New Contact</SoftTypography>

                        <SoftBox className="coco-box">
                          {loader ? (
                            <SoftBox margin="auto">
                              <Spinner />
                            </SoftBox>
                          ) : (
                            <SoftBox className="coco-box">
                              <SoftButton variant={buttonStyles.outlinedColor} onClick={() => handlecloseContact()} className="basic-font1 outlined-softbutton">
                                Cancel
                              </SoftButton>                              
                              <SoftButton variant={buttonStyles.primaryVariant} onClick={() => handleAddNewContact()} className="basic-font1 contained-softbutton">
                                Save
                              </SoftButton>
                            </SoftBox>
                          )}
                        </SoftBox>
                      </SoftBox>
                      <SoftBox className="setting-inner-body-cont">
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12} xl={12}>
                            <SoftBox className="setting-info-cont">
                              <List className="list-type-op">
                                <ListItem>Contact Name</ListItem>
                                <ListItem>Email</ListItem>
                                <ListItem>Mobile Number</ListItem>
                                <ListItem>Contact Type</ListItem>
                              </List>
                            </SoftBox>
                          </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12} xl={12}>
                            <SoftBox className="setting-info-cont1">
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  name="name"
                                  onChange={(e) => setNewContactName(e.target.value)}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="email"
                                  name="email"
                                  onChange={(e) => setNewEmail(e.target.value)}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="number"
                                  name="pincode"
                                  onChange={(e) => setNewPhoneNo(e.target.value)}
                                />
                                <br />
                              </SoftBox>
                              <SoftBox className="orgi-softbox-input">
                                <SoftSelect
                                  // className="Edit-box-input-hover"
                                  defaultValue={{ value: '', label: '' }}
                                  onChange={(e) => setNewContactType(e.value)}
                                  options={[
                                    { value: 'SUPPORT', label: 'SUPPORT' },
                                    { value: 'DEFAULT', label: 'DEFAULT' },
                                    { value: 'OTHER', label: 'OTHER' },
                                  ]}
                                />
                                {/* <SoftInput
                                                            className="Edit-box-input-hover"
                                                            type="text"
                                                            name="pincode"
                                                            onChange={(e) => setNewContactType(e.target.value)}
                                                        />
                                                        <br /> */}
                              </SoftBox>
                            </SoftBox>
                          </Grid>
                        </Grid>
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                ) : permissions?.RETAIL_Settings?.WRITE ||
                  permissions?.WMS_Settings?.WRITE ||
                  permissions?.VMS_Settings?.WRITE ? (
                    <SoftBox className="add-customer-file-box">
                      <SoftBox className="add-file-inner-box">
                        <SoftButton variant={buttonStyles.primaryVariant} className="basic-font1 contained-softbutton" onClick={handleNewContact}>
                          <AddIcon/> Add New Contact
                        </SoftButton>
                      </SoftBox>
                    </SoftBox>
                  ) : null}
              </Grid>
            </Grid>
            {showAddAddress || showedit ? null : (
              <Box>
                {allContacts?.map((item) => (
                  <SoftBox key={item.id}>
                    <SoftBox>
                      <SoftBox className="setting-main-cont">
                        <SoftBox className="setting-inner-main-cont1">
                          <SoftBox className="setting-inner-heading-cont">
                            <SoftTypography className="basic-font">Contact Information</SoftTypography>
                            {permissions?.RETAIL_Settings?.WRITE ||
                            permissions?.WMS_Settings?.WRITE ||
                            permissions?.VMS_Settings?.WRITE ? (
                                <Box display="flex">
                                  <Button onClick={() => handleBasicEdit(item)} className="basic-font1">
                                  Edit
                                  </Button>
                                  {allContacts?.length > 1 && 
                                    <Button onClick={() => handleBasicDelete(item)} className="basic-font1">
                                    Delete
                                    </Button>
                                  }
                                </Box>
                              ) : null}
                          </SoftBox>

                          <SoftBox className="setting-inner-body-cont">
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={12} xl={12}>
                                <SoftBox className="setting-info-cont">
                                  <List className="list-type-op">
                                    <ListItem>Contact Name</ListItem>
                                    <ListItem>Email</ListItem>
                                    <ListItem>Mobile Number</ListItem>
                                    <ListItem>Contact Type</ListItem>
                                  </List>
                                </SoftBox>
                              </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={12} xl={12}>
                                <SoftBox className="setting-info-cont1">
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={item.name || ''}
                                      name="name"
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="email"
                                      value={item?.email || ''}
                                      name="addressLine1"
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="number"
                                      value={item?.phoneNo || ''}
                                      name="addressLine2"
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={item?.contactType || ''}
                                      name="country"
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                </SoftBox>
                              </Grid>
                            </Grid>
                          </SoftBox>
                        </SoftBox>
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                ))}
              </Box>
            )}

            {showedit &&
            editedItem &&
            (permissions?.RETAIL_Settings?.WRITE ||
              permissions?.WMS_Settings?.WRITE ||
              permissions?.VMS_Settings?.WRITE) ? (
                <SoftBox className="setting-main-cont">
                  <SoftBox className="setting-inner-main-cont1">
                    <SoftBox className="setting-inner-heading-cont">
                      <SoftTypography className="basic-font">Edit Contact</SoftTypography>

                      <SoftBox className="coco-box">
                        {loader ? (
                          <SoftBox margin="auto">
                            <Spinner />
                          </SoftBox>
                        ) : (
                          <SoftBox className="coco-box">
                            <SoftButton variant={buttonStyles.primaryVariant} onClick={() => handleUpdate(editedItem)} className="basic-font1 contained-softbutton">
                            Save
                            </SoftButton>
                            <SoftButton variant={buttonStyles.outlinedColor} onClick={() => handleclosebutton()} className="basic-font1 outlined-softbutton">
                            Cancel
                            </SoftButton>
                          </SoftBox>
                        )}
                      </SoftBox>
                    </SoftBox>
                    <SoftBox className="setting-inner-body-cont">
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={12} xl={12}>
                          <SoftBox className="setting-info-cont">
                            <List className="list-type-op">
                              <ListItem>Contact Name</ListItem>
                              <ListItem>Email</ListItem>
                              <ListItem>Mobile Number</ListItem>
                              <ListItem>Contact Type</ListItem>
                            </List>
                          </SoftBox>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={12} xl={12}>
                          <SoftBox className="setting-info-cont1">
                            <SoftBox className="orgi-softbox-input">
                              <SoftInput
                                className="Edit-box-input-hover"
                                type="text"
                                name="name"
                                value={editedItem.name}
                                onChange={handleInputChange}
                                readOnly={IsreadOnly}
                              />
                              <br />
                            </SoftBox>
                            <SoftBox className="orgi-softbox-input">
                              <SoftInput
                                className="Edit-box-input-hover"
                                type="email"
                                name="email"
                                value={editedItem.email}
                                onChange={handleInputChange}
                                readOnly={IsreadOnly}
                              />
                              <br />
                            </SoftBox>
                            <SoftBox className="orgi-softbox-input">
                              <SoftInput
                                className="Edit-box-input-hover"
                                type="number"
                                name="phoneNo"
                                value={editedItem.phoneNo}
                                onChange={handleInputChange}
                                readOnly={IsreadOnly}
                              />
                              <br />
                            </SoftBox>
                            <SoftBox className="orgi-softbox-input">
                              <SoftSelect
                              // className="Edit-box-input-hover"
                                defaultValue={{ value: `${editedItem.contactType}`, label: `${editedItem.contactType}` }}
                                onChange={(e) => handleInputChange2(e)}
                                options={[
                                  { value: 'SUPPORT', label: 'SUPPORT' },
                                  { value: 'DEFAULT', label: 'DEFAULT' },
                                  { value: 'OTHER', label: 'OTHER' },
                                ]}
                              />
                              {/* <SoftInput
                                            className="Edit-box-input-hover"
                                            type="text"
                                            name="contactType"
                                            value={editedItem.contactType}
                                            onChange={handleInputChange}
                                            readOnly={IsreadOnly}
                                            />
                                        <br /> */}
                            </SoftBox>
                          </SoftBox>
                        </Grid>
                      </Grid>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              ) : null}
          </>
        )}
      </Box>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LocAddressDetail;
