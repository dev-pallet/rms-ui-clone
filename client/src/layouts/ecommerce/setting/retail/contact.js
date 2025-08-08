import { Box, Button, Grid, List, ListItem, Modal } from '@mui/material';
import {
  addNewRetailContact,
  deleteRetailContact,
  getAllRetailContact,
  updateRetailContactInfo,
} from '../../../../config/Services';
import { useEffect, useState } from 'react';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';

const OrganisationContacts = () => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const showSnackbar = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [editedItem, setEditedItem] = useState({});
  const [newItem, setNewItem] = useState({});
  const [allContacts, setAllContacts] = useState({});

  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    setLoader(true);
    getAllContacts();
  }, [updated]);

  const getAllContacts = () => {
    getAllRetailContact(orgId)
      .then((res) => {
        setAllContacts(res?.data?.data?.contacts);
        setLoader(false);
        setUpdated(false);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [openModal2, setOpenModal2] = useState(false);
  const handleOpenModal2 = () => {
    setOpenModal2(true);
  };

  const handleCloseModal2 = () => {
    setOpenModal2(false);
  };

  const handleEdit = (item) => {
    handleOpenModal();
    setEditedItem(item);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({
      ...editedItem,
      [name]: value,
    });
  };

  const handleSelectChange = (e) => {
    const value = e.value;
    const name = 'contactType';
    setEditedItem({ ...editedItem, [name]: value });
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
      setUpdated(true);
      updateRetailContactInfo(payload)
        .then((res) => {
          handleCloseModal();
          showSnackbar('Contact updates Successfully', 'success');
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message, 'error');
        });
      setEditedItem(null);
    }
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value,
    });
  };

  const handleSelectChange1 = (e) => {
    const value = e.value;
    const name = 'contactType';
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSave = () => {
    setUpdated(true);
    const payload = {
      phoneNo: newItem.phoneNo,
      email: newItem.email,
      // source: "string",
      entityId: orgId,
      entityType: 'RETAIL',
      contactType: newItem.contactType,
      createdBy: uidx,
      contactName: newItem.name,
    };
    addNewRetailContact(payload)
      .then((res) => {
        handleCloseModal2();
        showSnackbar('New Contact Added', 'success');
      })
      .catch((err) => {
        showSnackbar(err.response.data.message, 'error');
      });
  };

  const handleDelete = (item) => {
    setUpdated(true);
    const payload = {
      contactId: item.contactId,
      updatedBy: uidx,
    };
    deleteRetailContact(payload)
      .then((res) => {
        showSnackbar('Deleted Successfully','success');
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
            <SoftTypography sx={{ width: '33%', flexShrink: 0 }} className="basic-font">
              Contacts Information
            </SoftTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Button className="basic-font1" sx={{ marginTop: '-10px' }} onClick={handleOpenModal2}>
              Add new Contact
            </Button>
            <Modal
              open={openModal2}
              onClose={handleCloseModal2}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className="modal-pi-border"
            >
              <Box
                className="pi-box-inventory"
                sx={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  // p: 4,
                  overflow: 'auto',
                  maxHeight: '80vh',
                }}
              >
                <Grid container spacing={1} p={1}>
                  <Grid item xs={12} md={12}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                        Contact Name
                      </SoftTypography>
                      <SoftInput type="text" name="name" onChange={handleInputChange1} />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} md={12} mb={1}>
                    <SoftBox  ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                        Contact Type
                      </SoftTypography>
                    </SoftBox>
                    <SoftSelect
                      onChange={(e) => handleSelectChange1(e)}
                      options={[
                        { value: 'SUPPORT', label: 'SUPPORT' },
                        { value: 'DEFAULT', label: 'DEFAULT' },
                        { value: 'OTHER', label: 'OTHER' },
                      ]}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                        Email
                      </SoftTypography>
                      <SoftInput type="email" name="email" onChange={handleInputChange1} />
                    </SoftBox>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                        Phone Number
                      </SoftTypography>
                      <SoftInput type="number" name="phoneNo" onChange={handleInputChange1} />
                    </SoftBox>
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <SoftBox className="header-submit-box">
                      <SoftButton className="modal-cancel-pi" onClick={() => handleCloseModal2()}>
                        cancel
                      </SoftButton>
                      <SoftButton variant="gradient" color="info" onClick={() => handleSave()}>
                        save
                      </SoftButton>
                    </SoftBox>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
            {allContacts?.length > 0 &&
              allContacts?.map((item) => (
                <SoftBox className="setting-inner-main-cont2" key={item.contactId}>
                  <SoftBox className="setting-inner-heading-cont">
                    <SoftTypography className="basic-font">Contact </SoftTypography>
                    {permissions?.RETAIL_Settings?.WRITE ||
                    permissions?.WMS_Settings?.WRITE ||
                    permissions?.VMS_Settings?.WRITE ? (
                        <Box display="flex">
                          <Button className="basic-font1" onClick={() => handleEdit(item)}>
                          Edit
                          </Button>
                          {allContacts.length > 1 &&
                          <Button className="basic-font1" onClick={() => handleDelete(item)}>
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
                            <ListItem>Contact Type</ListItem>
                            <ListItem>E-mail</ListItem>
                            <ListItem>Phone</ListItem>
                          </List>
                        </SoftBox>
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={12} xl={12}>
                        <SoftBox className="orgi-softbox-input">
                          <SoftInput className="Edit-box-input" type="text" value={item.name} name="contactName" />
                          <br />
                        </SoftBox>

                        <SoftBox className="orgi-softbox-input">
                          <SoftInput
                            className="Edit-box-input"
                            type="text"
                            value={item.contactType}
                            name="contactType"
                          />
                          <br />
                        </SoftBox>

                        <SoftBox className="orgi-softbox-input">
                          <SoftInput className="Edit-box-input" type="text" value={item.email} name="email" />
                          <br />
                        </SoftBox>

                        <SoftBox className="orgi-softbox-input">
                          <SoftInput className="Edit-box-input" type="number" value={item.phoneNo} name="phoneNo" />
                          <br />
                        </SoftBox>
                      </Grid>
                    </Grid>
                  </SoftBox>
                  {editedItem ? (
                    <Modal
                      open={openModal}
                      onClose={handleCloseModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                      className="modal-pi-border"
                    >
                      <Box
                        className="pi-box-inventory"
                        sx={{
                          position: 'absolute',
                          top: '40%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          bgcolor: 'background.paper',
                          boxShadow: 24,
                          // p: 4,
                          overflow: 'auto',
                          maxHeight: '80vh',
                        }}
                      >
                        <Grid container spacing={1} p={1}>
                          <Grid item xs={12} md={12}>
                            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                              <SoftTypography
                                component="label"
                                variant="caption"
                                fontWeight="bold"
                                textTransform="capitalize"
                                fontSize="13px"
                              >
                                Contact Name
                              </SoftTypography>
                              <SoftInput type="text" name="name" value={editedItem.name} onChange={handleInputChange} />
                            </SoftBox>
                          </Grid>
                          <Grid item xs={12} md={12} mb={1}>
                            <SoftBox ml={0.5} lineHeight={0} display="inline-block">
                              <SoftTypography
                                component="label"
                                variant="caption"
                                fontWeight="bold"
                                textTransform="capitalize"
                                fontSize="13px"
                              >
                                Contact Type
                              </SoftTypography>
                            </SoftBox>
                            <SoftSelect
                              defaultValue={{ value: `${editedItem.contactType}`, label: `${editedItem.contactType}` }}
                              onChange={(e) => handleSelectChange(e)}
                              options={[
                                { value: 'SUPPORT', label: 'SUPPORT' },
                                { value: 'DEFAULT', label: 'DEFAULT' },
                                { value: 'OTHER', label: 'OTHER' },
                              ]}
                            />
                          </Grid>

                          <Grid item xs={12} md={12}>
                            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                              <SoftTypography
                                component="label"
                                variant="caption"
                                fontWeight="bold"
                                textTransform="capitalize"
                                fontSize="13px"
                              >
                                Email
                              </SoftTypography>
                              <SoftInput
                                type="email"
                                name="email"
                                value={editedItem.email}
                                onChange={handleInputChange}
                              />
                            </SoftBox>
                          </Grid>

                          <Grid item xs={12} md={12}>
                            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                              <SoftTypography
                                component="label"
                                variant="caption"
                                fontWeight="bold"
                                textTransform="capitalize"
                                fontSize="13px"
                              >
                                Phone Number
                              </SoftTypography>
                              <SoftInput
                                type="number"
                                name="phoneNo"
                                value={editedItem.phoneNo}
                                onChange={handleInputChange}
                              />
                            </SoftBox>
                          </Grid>

                          <Grid item xs={12} sm={12}>
                            <SoftBox className="header-submit-box">
                              <SoftButton className="modal-cancel-pi" onClick={() => handleCloseModal()}>
                                cancel
                              </SoftButton>
                              <SoftButton variant="gradient" color="info" onClick={() => handleUpdate(editedItem)}>
                                save
                              </SoftButton>
                            </SoftBox>
                          </Grid>
                        </Grid>
                      </Box>
                    </Modal>
                  ) : null}
                </SoftBox>
              ))}
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};

export default OrganisationContacts;
