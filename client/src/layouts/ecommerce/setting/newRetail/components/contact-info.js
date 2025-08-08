import { Box, Grid, List, ListItem } from '@mui/material';
import { addNewRetailContact, deleteRetailContact, getAllRetailContact, updateRetailContactInfo } from '../../../../../config/Services';
import { buttonStyles } from '../../../Common/buttonColor';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import Swal from 'sweetalert2';
import sideNavUpdate from '../../../../../components/Utility/sidenavupdate';

const OrgContactInfo = ({ handleTab }) => {
  sideNavUpdate();
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const showSnackbar = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [isreadOnly, setIsreadOnly] = useState(true);
  const [showedit, setShowedit] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [showAddAddress, setShowContact] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [editedItem, setEditedItem] = useState(false);

  const [newContactName, setNewContactName] = useState('');
  const [newContactType, setNewContactType] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhoneNo, setNewPhoneNo] = useState('');

  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    setLoader(true);
    getAllContacts();
  }, []);

  const getAllContacts = () => {
    getAllRetailContact(orgId)
      .then((res) => {
        setAllContacts(res?.data?.data?.contacts);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleBasicEdit = (item) => {
    setShowedit(true);
    setIsreadOnly(false);
    setEditedItem(item);
  };

  const handleBasicDelete = (item) => {
    const newSwal = Swal.mixin({
      customClass: {
        confirmButton: 'button button-success',
        cancelButton: 'button button-error',
      },
      buttonsStyling: false,
    });
    newSwal
      .fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      })
      .then((result) => {
        if (result.isConfirmed) {
          setLoader(true);
          const payload = {
            contactId: item.contactId,
            updatedBy: uidx,
          };
          deleteRetailContact(payload)
            .then((res) => {
              getAllContacts();
              showSnackbar('Deleted Successfully', 'success');
            })
            .catch((err) => {
              setLoader(false);
              Swal.fire({
                icon: 'error',
                title: 'Unable to delete address',
                showConfirmButton: true,
                confirmButtonText: 'OK',
              });
            });
        }
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
      showSnackbar('Mobile Number should be of 10 digit', 'error');
    } else {
      setLoader(true);
      updateRetailContactInfo(payload)
        .then((res) => {
          getAllContacts();
          showSnackbar('Contact updates Successfully', 'success');
        })
        .catch((err) => {
          setLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
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

  const handleNewContact = () => {
    setShowContact(true);
  };

  const handleAddNewContact = () => {
    const payload = {
      phoneNo: newPhoneNo,
      email: newEmail,
      entityId: orgId,
      entityType: 'RETAIL',
      contactType: newContactType,
      createdBy: uidx,
      contactName: newContactName,
    };
    const isEmptyField = Object.values(payload).some((value) => value === undefined || value === '');
    if (isEmptyField) {
      showSnackbar('Fill in all the fields', 'error');
    } else if (payload?.phoneNo?.length !== 10) {
      showSnackbar('Mobile Number should be of 10 digit', 'error');
    } else {
      setLoader(true);
      addNewRetailContact(payload)
        .then((res) => {
          setShowContact(false);
          getAllContacts();
          if (res?.data?.data?.es) {
            showSnackbar(res?.data?.data?.message, 'error');
            return;
          }
          showSnackbar('Contact Added Successfully', 'success');
        })
        .catch((err) => {
          setLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  const handlecloseContact = () => {
    setShowContact(false);
  };

  return (
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
                                <SoftButton onClick={() => handleBasicEdit(item)} className="basic-font1 settingsBtn">
                                Edit
                                </SoftButton>
                                {allContacts?.length > 1 && (
                                  <SoftButton onClick={() => handleBasicDelete(item)} className="basic-font1 settingsBtn">
                                  Delete
                                  </SoftButton>
                                )}
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
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="email"
                                    value={item?.email || ''}
                                    name="addressLine1"
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="number"
                                    value={item?.phoneNo || ''}
                                    name="addressLine2"
                                    readOnly={isreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={item?.contactType || ''}
                                    name="country"
                                    readOnly={isreadOnly}
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
                          <SoftButton variant={buttonStyles.outlinedColor} onClick={() => handleclosebutton()} className="basic-font1 outlined-softbutton">
                          Cancel
                          </SoftButton>
                          <SoftButton variant={buttonStyles.primaryVariant} onClick={() => handleUpdate(editedItem)} className="basic-font1 contained-softbutton">
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
                              value={editedItem.name}
                              onChange={handleInputChange}
                              readOnly={isreadOnly}
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
                              readOnly={isreadOnly}
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
                              readOnly={isreadOnly}
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
  );
};

export default OrgContactInfo;
