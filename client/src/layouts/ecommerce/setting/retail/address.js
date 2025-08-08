import { Autocomplete, Box, Button, Checkbox, Grid, List, ListItem, Modal, TextField } from '@mui/material';
import { city as cityList } from '../../softselect-Data/city';
import { countries } from './components/countrydetails';
import { deleteRetailAddress, getAllRetailAddress, saveRetailNewAddress, updateRetailAddress } from '../../../../config/Services';
import { states } from './components/statedetails';
import {useEffect, useState} from 'react';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';

const OrganisationAddress = () => {
  const showSnackbar = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [allAddresses, setAllAddresses] = useState({});
  const [newaddressLine1, setNewaddressLine1] = useState('');
  const [newaddressLine2, setNewaddressLine2] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newstate, setNewstate] = useState('');
  const [newcity, setNewcity] = useState('');
  const [newpincode, setNewpincode] = useState('');
  const [newpmobileNumber, setNewmobileNumber] = useState('');
  const [newaddressName, setNewaddressName] = useState('');
  const [cities, setCities] = useState([]);
  const [defaultBilling, setDefaultBilling] = useState(false);
  const [defaultShipping, setDefaultShipping] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(false);

  const [editedItem, setEditedItem] = useState({});
  const [newItem, setNewItem] = useState({});
    
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const orgId = localStorage.getItem('orgId');
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  useEffect(() => {
    setLoader(true);
    allRetailAddress();
  },[updated]);
    
  const allRetailAddress = () => {
    getAllRetailAddress(orgId)
      .then((res) => {
        const newArray = res?.data?.data?.addresses.filter((item) => item.entityId.includes('RET'));
        setAllAddresses(newArray);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({
      ...editedItem,
      [name]: value
    });
  };
    
    
  const handleSave = () => {
    const payload = {
      entityId: orgId,
      entityType: 'RETAIL',
      addressLine1: newaddressLine1,
      addressLine2: newaddressLine2,
      country: newCountry,
      state: newstate,
      city: newcity,
      pincode: newpincode,
      defaultShipping: defaultShipping,
      defaultBilling: defaultBilling,
      defaultAddress: defaultAddress,
      createdBy: uidx,
      name: newaddressName,
      mobileNumber: newpmobileNumber
    };
    if(newaddressName == ''){
      showSnackbar('Enter name', 'warning');
    }
    else if(newaddressLine1 == ''){
      showSnackbar('Enter Address', 'warning');
    }
    else if(newCountry == ''){
      showSnackbar('Enter Country', 'warning');
    }
    else if(newstate == ''){
      showSnackbar('Enter State','warning');
    }
    else if(newcity == ''){
      showSnackbar('Enter City','warning');
    }
    else if(newpincode == ''){
      showSnackbar('Enter pincode','warning');
    }
    else if(newpincode.length !== 6){
      showSnackbar('Pincode should be of 6 digits','warning');
    }
    else if(newpmobileNumber == ''){
      showSnackbar('Enter mobile number','warning');
    }
    else if(newpmobileNumber.length !== 10){
      showSnackbar('Mobile Number should be of 10 digits', 'warning');
    }
    else{
      setUpdated(true);
      saveRetailNewAddress(payload)
        .then((res) => {
          if(res.data.data.message === 'ENTER_UNIQUE_ADDRESS_NAME')
          {
            showSnackbar('ENTER UNIQUE ADDRESS NAME', 'error');
          }
          else{
            setNewCountry('');
            setNewstate('');
            setNewcity('');
            handleCloseModal2();
            showSnackbar('Address added Successfully', 'success');
          }
        }).catch((err) => {
          showSnackbar(err?.response?.data?.message,'error');
        });
    }
  };

  const handleEdit = (item) => {
    handleOpenModal();
    setEditedItem(item);
  };
    
  const handleUpdate = (item) => {
        
    const payload = {
      addressId: parseInt(item.id),
      name:item?.name,
      addressLine1: item?.addressLine1,
      addressLine2: item?.addressLine2,
      country: item?.country,
      state: item?.state,
      city: item?.city,
      pincode: item?.pincode,
      defaultShipping: item?.defaultShipping,
      defaultBilling: item?.defaultBilling,
      defaultAddress: item?.defaultAddress,
      mobileNumber: item?.mobileNumber,
      updatedBy: uidx
    };
    if(payload?.pincode?.length !== 6){
      showSnackbar('Pincode should be of 6 digits', 'warning');
    }
    else if(payload?.mobileNumber?.length !== 10){
      showSnackbar('Mobile Number should be of 10 digits','warning');
    }
    else{
      setUpdated(true);
      updateRetailAddress(payload).then((res) => {
        if(res.data.data.message == 'ENTER_UNIQUE_ADDRESS_NAME'){
          showSnackbar('ENTER UNIQUE ADDRESS NAME','error');
        }
        if(res.data.data.message == 'ADDRESS_NOT_FOUND'){
          showSnackbar('ADDRESS NOT FOUND','error');
        }
        else if(res.data.data.message == 'Success'){
          handleCloseModal();
          showSnackbar('Updated Successfully', 'success');
        }
      })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message,'error');
        });
    }
  };

  const handleDelete = (item) => {
    setUpdated(true);
    const payload = {
      addressId: item.id,
      updatedBy: uidx
    };
    deleteRetailAddress(payload)
      .then((res) => {
        showSnackbar('Deleted Successfully','success');
      })
      .catch((err) => {
        showSnackbar(err.response.data.message,'error');
      });
  };

  return (
    <div>
      {loader
        ?<Spinner />
        :
        <Accordion >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <SoftTypography sx={{ width: '33%', flexShrink: 0 }} className="basic-font">
                    Address Information
            </SoftTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Button className="basic-font1" sx={{marginTop:'-10px'}} onClick={handleOpenModal2}>
                            Add new Address
            </Button>
            <Modal
              open={openModal2}
              onClose={handleCloseModal2}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className="modal-pi-border"
              sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
              maxWidth="xs"
            >
              <Box className="pi-box-inventory" 
                sx={{position: 'absolute',top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  // p: 4,
                  overflow: 'auto',
                  maxHeight: '80vh'
                }}>
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
                                        Address Name
                      </SoftTypography>
                      <SoftInput
                        type="text"
                        name="name"
                        onChange={(e) => setNewaddressName(e.target.value)}
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
                                        Address Line 1
                      </SoftTypography>
                      <SoftInput
                        type="text"
                        name="adressLine1"
                        onChange={(e) => setNewaddressLine1(e.target.value)}
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
                                        Address Line 2
                      </SoftTypography>
                      <SoftInput
                        type="text"
                        name="adressLine2"
                        onChange={(e) => setNewaddressLine2(e.target.value)}
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
                                        Country
                      </SoftTypography>
                      <Autocomplete
                        onChange={(event, value) => setNewCountry(value.label)}
                        disablePortal
                        id="Edit-box-input-hover"
                        options={countries}
                        value={newCountry}
                        freeSolo
                        fullWidth
                        // sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} />}
                        required
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
                                        State
                      </SoftTypography>
                      <Autocomplete
                        onChange={(event, value) => {
                          setNewstate(value.label);
                          if (value) {
                            const tempCities = [...cityList].filter((city) => {
                              return city.value === value.label;
                            });
                            setCities(tempCities);
                          } else {
                            setCities([]);
                          }
                        }}
                        disablePortal
                        id="Edit-box-input-hover"
                        options={states}
                        value={newstate}
                        freeSolo
                        fullWidth
                        // sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} />}
                        required
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
                                        City
                      </SoftTypography>
                      <Autocomplete
                        onChange={(event, value) => setNewcity(value.label)}
                        disablePortal
                        id="Edit-box-input-hover"
                        options={cities}
                        value={newcity}
                        freeSolo
                        fullWidth
                        // sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} />}
                        required
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
                                        Pincode
                      </SoftTypography>
                      <SoftInput
                        type="number"
                        name="pincode"
                        onChange={(e) => setNewpincode(e.target.value)}
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
                                        Mobile Number
                      </SoftTypography>
                      <SoftInput
                        type="number"
                        name="phoneNo"
                        onChange={(e) => setNewmobileNumber(e.target.value)}
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                      <Box marginRight={1}>
                        <Checkbox onChange={(e) => setDefaultBilling(e.target.checked)} />
                      </Box>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                                        Default Billing
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                      <Box marginRight={1}>
                        <Checkbox onChange={(e) => setDefaultShipping(e.target.checked)}/>
                      </Box>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                                        Default Shipping
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                      <Box marginRight={1}>
                        <Checkbox onChange={(e) => setDefaultAddress(e.target.checked)}/>
                      </Box>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                                        Default Address
                      </SoftTypography>
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
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className="modal-pi-border"
              sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
              maxWidth="xs"
            >
              <Box className="pi-box-inventory" 
                sx={{position: 'absolute',
                  top: '35%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'transparent',
                  boxShadow: 24,
                  // p: 4,
                  overflow: 'auto',
                  maxHeight: '80vh'
                }}>
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
                                        Address Name
                      </SoftTypography>
                      <SoftInput
                        className="Edit-box-input-hover"
                        type="text"
                        name="name"
                        value={editedItem.name}
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
                                        Address Line 1
                      </SoftTypography>
                      <SoftInput
                        className="Edit-box-input-hover"
                        type="text"
                        name="addressLine1"
                        value={editedItem.addressLine1}
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
                                        Address Line 2
                      </SoftTypography>
                      <SoftInput
                        className="Edit-box-input-hover"
                        type="text"
                        name="addressLine2"
                        value={editedItem?.addressLine2}
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
                                        Country
                      </SoftTypography>
                      <SoftInput
                        className="Edit-box-input-hover"
                        type="text"
                        name="country"
                        value={editedItem.country}
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
                                        State
                      </SoftTypography>
                      <SoftInput
                        className="Edit-box-input-hover"
                        type="text"
                        name="state"
                        value={editedItem.state}
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
                                        City
                      </SoftTypography>
                      <SoftInput
                        className="Edit-box-input-hover"
                        type="text"
                        name="city"
                        value={editedItem.city}
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
                                        Pincode
                      </SoftTypography>
                      <SoftInput
                        className="Edit-box-input-hover"
                        type="number"
                        name="pincode"
                        value={editedItem.pincode}
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
                                        Mobile Number
                      </SoftTypography>
                      <SoftInput
                        className="Edit-box-input-hover"
                        type="number"
                        name="mobileNumber"
                        value={editedItem.mobileNumber}
                        onChange={handleInputChange}
                      />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                      <Box marginRight={1}>
                        <Checkbox checked={editedItem.defaultBilling} onChange={(e) => {setEditedItem(prevItem => ({
                          ...prevItem,
                          defaultBilling: e.target.checked
                        }));
                        }} 
                        />
                      </Box>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                                        Default Billing
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                      <Box marginRight={1}>
                        <Checkbox checked={editedItem.defaultShipping} onChange={(e) => { setEditedItem(prevItem => ({
                          ...prevItem,
                          defaultShipping: e.target.checked
                        }));
                        }}
                        />
                      </Box>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                                        Default Shipping
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                      <Box marginRight={1}>
                        <Checkbox checked={editedItem.defaultAddress} onChange={(e) => {setEditedItem(prevItem => ({
                          ...prevItem,
                          defaultAddress: e.target.checked
                        }));
                        }}/>
                      </Box>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                                        Default Address
                      </SoftTypography>
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
            { allAddresses.length > 0 &&
                            allAddresses.map((item) => {
                              return (
                                <SoftBox className="setting-inner-main-cont2">
                                  <SoftBox className="setting-inner-heading-cont">
                                    <SoftTypography className="basic-font">Address</SoftTypography>
                                    {permissions?.RETAIL_Settings?.WRITE || permissions?.WMS_Settings?.WRITE || permissions?.VMS_Settings?.WRITE
                                      ?
                                      <Box display='flex'>
                                        <Button  className="basic-font1" onClick={() => handleEdit(item)}>
                                                    Edit
                                        </Button>
                                        {allAddresses.length > 1 && 
                                                    <Button className="basic-font1" onClick={() => handleDelete(item)}>
                                                        Delete
                                                    </Button>
                                        }
                                      </Box>
                                      :null
                                    }
                                  </SoftBox>
                                  <SoftBox className="setting-inner-body-cont">
                                    <Grid container spacing={3}>
                                      <Grid item xs={12} md={12} xl={12}>
                                        <SoftBox className="setting-info-cont">
                                          <List className="list-type-op">
                                            <ListItem>Name</ListItem>
                                            <ListItem>Address Line 1</ListItem>
                                            <ListItem>Address Line 1</ListItem>
                                            <ListItem>City</ListItem>
                                            <ListItem>State</ListItem>
                                            <ListItem>Country</ListItem>
                                            <ListItem>Pincode</ListItem>
                                            <ListItem>Mobile Number</ListItem>
                                            <ListItem>Default Billing</ListItem>
                                            <ListItem>Default Shipping</ListItem>
                                            <ListItem>Default Address</ListItem>
                                          </List>
                                        </SoftBox>
                                      </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                      <Grid item xs={12} md={12} xl={12} >
                                        <SoftBox className="orgi-softbox-input">
                                          <SoftInput
                                            className="Edit-box-input"
                                            type="text"
                                            value={item.name}
                                            name="contactName"
                                          />
                                          <br />
                                        </SoftBox>

                                        <SoftBox className="orgi-softbox-input">
                                          <SoftInput
                                            className="Edit-box-input"
                                            type="text"
                                            value={item.addressLine1}
                                            name="addressLine1"
                                          />
                                          <br />
                                        </SoftBox>

                                        <SoftBox className="orgi-softbox-input">
                                          <SoftInput
                                            className="Edit-box-input"
                                            type="text"
                                            value={item.addressLine2}
                                            name="addressLine2"
                                          />
                                          <br />
                                        </SoftBox>

                                        <SoftBox className="orgi-softbox-input">
                                          <SoftInput
                                            className="Edit-box-input"
                                            type="text"
                                            value={item.city}
                                            name="city"
                                          />
                                          <br />
                                        </SoftBox>
                                        <SoftBox className="orgi-softbox-input">
                                          <SoftInput
                                            className="Edit-box-input"
                                            type="text"
                                            value={item.state}
                                            name="state"
                                          />
                                          <br />
                                        </SoftBox>

                                        <SoftBox className="orgi-softbox-input">
                                          <SoftInput
                                            className="Edit-box-input"
                                            type="text"
                                            value={item.country}
                                            name="country"
                                          />
                                          <br />
                                        </SoftBox>
                                        <SoftBox className="orgi-softbox-input">
                                          <SoftInput
                                            className="Edit-box-input"
                                            type="number"
                                            value={item.pincode}
                                            name="pincode"
                                          />
                                          <br />
                                        </SoftBox>
                                        <SoftBox className="orgi-softbox-input">
                                          <SoftInput
                                            className="Edit-box-input"
                                            type="number"
                                            value={item.mobileNumber}
                                            name="mobileNumber"
                                          />
                                          <br />
                                        </SoftBox>
                                        <SoftBox className="orgi-softbox-input">
                                          {item?.defaultBilling === true
                                            ?<Checkbox  disabled checked />
                                            :<Checkbox disabled  />
                                          }
                                          <br/>
                                        </SoftBox>
                                        <SoftBox className="orgi-softbox-input">
                                          {item?.defaultShipping === true
                                            ?<Checkbox  disabled checked />
                                            :<Checkbox disabled  />
                                          }
                                          <br/>
                                        </SoftBox>
                                        <SoftBox className="orgi-softbox-input">
                                          {item?.defaultAddress === true
                                            ?<Checkbox  disabled checked />
                                            :<Checkbox disabled  />
                                          }
                                          <br/>
                                        </SoftBox>
                                      </Grid>
                                            
                                    </Grid>
                                  </SoftBox>
                                </SoftBox>
                              );
                            })
            }
          </AccordionDetails>
        </Accordion>
      }
      
    </div>
  );
};

export default OrganisationAddress;