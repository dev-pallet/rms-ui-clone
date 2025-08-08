import './shop-location.css';
import { Button, Grid } from '@mui/material';
import { getSinglewarehouseData, setLocationData } from '../../../config/Services';
import { useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../components/Spinner';
import sideNavUpdate from 'components/Utility/sidenavupdate';
import { noDatagif } from '../Common/CommonFunction';

const ShoplocationWMS = () => {
  sideNavUpdate();
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const useForceUpdate = () => {
    const [value, setValue] = useState(0);
    return () => setValue((value) => value + 1);
  };

  const forceUpdate = useForceUpdate();

  const { locationId } = useParams();
  const [open, setOpen] = useState(false);
  const [loader, setloader] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');
  const [selectedImages, setSelectedImages] = useState('');
  const [image, setImage] = useState('');
  const [noData, setNoData] = useState([]);
  const [errorhandler, setErrorHandler] = useState('');
  const [successUr, setSuccessUr] = useState(false);

  const orgId = localStorage.getItem('orgId');
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setImage(imagesArray[0]);
    setSelectedImages(event.target.files[0]);
    // FOR BUG IN CHROME
    event.target.value = '';
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const [newContactRow, setNewContactRow] = useState([{ id: 1 }]);
  const [newBankRow, setNewBankRow] = useState([{ id: 1 }]);
  const [newAddressRow, setNewAddressRow] = useState([{ id: 1 }]);
  const handleContactRow = (a) => {
    setNewContactRow([...newContactRow, { id: newContactRow.length + a }]);
  };
  const handleBankRow = (a) => {
    setNewBankRow([...newBankRow, { id: newBankRow.length + a }]);
  };
  const handleAddressRow = (a) => {
    setNewAddressRow([...newAddressRow, { id: newAddressRow.length + a }]);
  };

  const handleSupportRemove = (payload) => {
    setNewContactRow([...newContactRow.filter((e, i) => i !== payload)]);

    if (supContactDetails[payload]?.contactDto?.id) {
      setSupContactDetails([...supContactDetails.filter((e, i) => i !== payload)]);
    } else {
      setNewSupContacts([...newSupContacts.filter(Boolean).filter((e, i) => i !== payload - supContactDetails.length)]);
    }
  };

  const handleBankRemove = (payload) => {
    setNewBankRow([...newBankRow.filter((e, i) => i !== payload)]);

    if (bankDetails[payload]?.bankDetail?.id) {
      setBankDetails([...bankDetails.filter((e, i) => i !== payload)]);
    } else {
      setNewBankDetails([...newBankDetails.filter(Boolean).filter((e, i) => i !== payload - bankDetails.length)]);
    }
  };

  const handleAddressRemove = (payload) => {
    setNewAddressRow([...newAddressRow.filter((e, i) => i !== payload)]);

    if (addressDetails[payload]?.addressDto?.id) {
      setAddressDetails([...addressDetails.filter((e, i) => i !== payload)]);
    } else {
      setNewAddressDetails([
        ...newAddressDetails.filter(Boolean).filter((e, i) => i !== payload - addressDetails.length),
      ]);
    }
  };

  const [IsreadOnly, setIsreadOnly] = useState(true);
  const [showedit, setShowedit] = useState(false);
  const [templocationData, setTemplocationData] = useState({});
  const [orgData, setOrgData] = useState([]);
  const [msgOrg, setMsgOrg] = useState('');
  const [datStat, setdatStat] = useState(false);
  const [locationData, setlocationData] = useState({
    accountId: '',
    businessId: '',
    locationName: '',
    description: '',
    createdAt: '',
    primaryContactDto: {
      id: '',
      contactName: '',
      phoneNo: '',
      email: '',
      contactType: '',
      emailVerified: true,
    },
    supportContactMap: [
      {
        contactDto: {
          id: '',
          contactName: '',
          phoneNo: '',
          email: '',
          contactType: 'SECONDARY',
          emailVerified: true,
        },
      },
    ],
    removedFlag: '',
    removedOn: '',
    tan: '',
    userId: '',
    warehouseAddressMapping: [],
    warehouseBillingMapping: [],
    warehouseContactMapping: [],
    warehouseId: '',
    warehouseLocation: [],
    website: '',
  });

  const [contactDetails, setContactDetails] = useState({
    id: '',
    contactName: '',
    contactType: '',
    email: '',
    phoneNo: '',
  });

  const [bankDetails, setBankDetails] = useState([
    {
      bankDetail: {
        id: '',
        accountHolderName: '',
        bankAccountNumber: '',
        ifscNumber: '',
        bankName: '',
        bankAddress: '',
        accountType: '',
      },
    },
  ]);

  const [newBankDetails, setNewBankDetails] = useState([]);

  const [addressDetails, setAddressDetails] = useState([
    {
      addressDto: {
        id: '',
        addressLine1: '',
        addressLine2: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        addressType: '',
      },
    },
  ]);

  const [newAddressDetails, setNewAddressDetails] = useState([]);

  const [supContactDetails, setSupContactDetails] = useState([
    {
      contactDto: {
        id: '',
        contactName: '',
        phoneNo: '',
        email: '',
        contactType: '',
        emailVerified: true,
      },
    },
  ]);

  const [newSupContacts, setNewSupContacts] = useState([]);

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setlocationData({ ...locationData, [name]: value });
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setContactDetails({ ...contactDetails, [name]: value });
  };

  const handleChange3 = (index, e) => {
    const { name, value } = e.target;
    const clone = [...newSupContacts];
    if (clone[index]) {
      clone[index][name] = value;
    } else {
      clone[index] = {
        [name]: value,
      };
    }
    setNewSupContacts([...clone]);
  };

  const handleChange4 = (index, e) => {
    const { name, value } = e.target;
    const clone = [...newBankDetails];
    if (clone[index]) {
      clone[index][name] = value;
    } else {
      clone[index] = {
        [name]: value,
      };
    }
    setNewBankDetails([...clone]);
  };

  const handleChange5 = (index, e) => {
    const { name, value } = e.target;
    const clone = [...newAddressDetails];
    if (clone[index]) {
      clone[index][name] = value;
    } else {
      clone[index] = {
        [name]: value,
      };
    }
    setNewAddressDetails([...clone]);
  };
  const handleInput = () => {
    setShowedit(true);
    setIsreadOnly(false);

    setTemplocationData({ ...locationData });
  };

  const handleclosebutton = () => {
    setlocationData({ ...templocationData });
    setShowedit(false);
    setIsreadOnly(true);
  };

  const handleSave = () => {
    setloader(true);

    //SUPPORT CONTACTS

    let supportContacts = [...newSupContacts];
    supportContacts = supportContacts.filter(Boolean);
    supportContacts = supportContacts.map(function (item) {
      return { contactDto: { ...item } };
    });
    supportContacts = [...supportContacts, ...supContactDetails];

    //BANK DETAILS

    let tempBankDetails = [...newBankDetails];
    tempBankDetails = tempBankDetails.filter(Boolean);
    tempBankDetails = tempBankDetails.map(function (item) {
      return { bankDetail: { ...item } };
    });
    tempBankDetails = [...tempBankDetails, ...bankDetails];

    //ADDRESS DETAILS

    let tempAddressDetails = [...newAddressDetails];
    tempAddressDetails = tempAddressDetails.filter(Boolean);
    tempAddressDetails = tempAddressDetails.map(function (item) {
      return { addressDto: { ...item } };
    });
    tempAddressDetails = [...tempAddressDetails, ...addressDetails];

    const payload = {
      userId: uidx,
      name: locationData?.locationName,
      description: locationData?.description,
      primaryContactId: null,
      primaryContactDto: null,
      addressMap: tempAddressDetails,
      supportContactMap: supportContacts,
      bankDetailMap: tempBankDetails,
    };

    setLocationData(orgId, locationId, payload)
      .then((res) => {
        setSuccessUr(true);
        setloader(false);
        setErrorHandler(res.data.data.message);
        setOpen(true);
      })
      .catch((err) => {
        setSuccessUr(false);
        setloader(false);
        setErrorHandler(err.response.data.message);
        setOpen(true);
      });
    setShowedit(false);
    setIsreadOnly(true);
  };

  useEffect(() => {
    setloader(true);

    getSinglewarehouseData(orgId, locationId)
      .then((res) => {
        if (!res.data.data.warehouseLocationInfo) {
          setOrgData(true);
          setMsgOrg(res.data.data.message);
        } else {
          setOrgData(false);
          setlocationData(res.data.data?.warehouseLocationInfo);
          setContactDetails(res.data.data?.warehouseLocationInfo.primaryContact);
          setSupContactDetails(res.data.data?.warehouseLocationInfo.contactMap);
          setBankDetails(res.data.data.warehouseLocationInfo.bankMap);
          setAddressDetails(res.data.data.warehouseLocationInfo.addressMap);
        }

        // setTemplocationData({...locationData})
        setSuccessUr(true);
        setErrorHandler(res.data.data.message);
        setOpen(true);
        setloader(false);
      })
      .catch((err) => {
        setSuccessUr(false);
        setErrorHandler(res.data.data.message);
        setOpen(true);
        setloader(false);
      });
  }, []);

  return (
    <>
      <SoftBox>
        {loader ? (
          <Spinner />
        ) : (
          <>
            {orgData.length == 0 ? (
              <SoftBox>
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>
                <SoftBox className="loc-not-found">
                  <SoftTypography variant="h5">{msgOrg}</SoftTypography>
                </SoftBox>
              </SoftBox>
            ) : (
              <SoftBox>
                <SoftBox>
                  <SoftBox className="setting-main-cont">
                    <SoftBox className="setting-inner-main-cont1">
                      <SoftBox className="setting-inner-heading-cont">
                        <SoftTypography className="basic-font">Basic Information</SoftTypography>
                        {showedit ? (
                          <SoftBox className="coco-box">
                            {loader ? (
                              <SoftBox margin="auto">
                                <Spinner />
                              </SoftBox>
                            ) : (
                              <SoftBox className="coco-box">
                                <Button
                                  onClick={() => handleSave()}
                                  disabled={
                                    locationData?.locationName &&
                                    [...newSupContacts.filter(Boolean)].every(
                                      (e) => e?.contactName && e?.contactType && e?.phoneNo,
                                    ) &&
                                    [...newBankDetails.filter(Boolean)].every(
                                      (e) =>
                                        e?.accountHolderName &&
                                        e?.bankAccountNumber &&
                                        e?.ifscNumber &&
                                        e?.bankName &&
                                        e?.bankAddress &&
                                        e?.accountType,
                                    ) &&
                                    [...newAddressDetails.filter(Boolean)].every(
                                      (e) => e?.addressLine1 && e?.country && e?.state && e?.city && e?.pincode,
                                    )
                                      ? false
                                      : true
                                  }
                                  className="basic-font1"
                                >
                                  Save
                                </Button>
                                <Button onClick={() => handleclosebutton()} className="basic-font1">
                                  Cancel
                                </Button>
                              </SoftBox>
                            )}
                          </SoftBox>
                        ) : permissions?.RETAIL_Settings?.WRITE ||
                          permissions?.WMS_Settings?.WRITE ||
                          permissions?.VMS_Settings?.WRITE ? (
                          <Button onClick={() => handleInput()} className="basic-font1">
                            Edit
                          </Button>
                        ) : null}
                      </SoftBox>

                      <SoftBox className="setting-inner-body-cont">
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12} xl={12}>
                            <SoftBox className="setting-info-cont">
                              <List className="list-type-op">
                                <ListItem>Location Name</ListItem>
                                <ListItem>Description</ListItem>
                                <ListItem>Created at</ListItem>
                              </List>
                            </SoftBox>
                          </Grid>
                        </Grid>
                        {showedit ? (
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={12} xl={12}>
                              <SoftBox className="setting-info-cont1">
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input-hover"
                                    type="text"
                                    value={locationData?.locationName}
                                    name="locationName"
                                    onChange={handleChange1}
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                  <div className="req">{'  '}*</div>
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input-hover"
                                    type="text"
                                    value={locationData?.description || ''}
                                    name="description"
                                    onChange={handleChange1}
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                </SoftBox>

                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={locationData?.createdAt}
                                    name="createdAt"
                                    onChange={handleChange1}
                                    readOnly
                                  />
                                  <br />
                                </SoftBox>
                              </SoftBox>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={12} xl={12}>
                              <SoftBox className="setting-info-cont1">
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={locationData?.locationName}
                                    name="locationName"
                                    onChange={handleChange1}
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={locationData?.description || ''}
                                    name="description"
                                    onChange={handleChange1}
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                </SoftBox>

                                <SoftBox className="orgi-softbox-input">
                                  <SoftInput
                                    className="Edit-box-input"
                                    type="text"
                                    value={locationData?.createdAt}
                                    name="createdAt"
                                    onChange={handleChange1}
                                    readOnly={IsreadOnly}
                                  />
                                  <br />
                                </SoftBox>
                              </SoftBox>
                            </Grid>
                          </Grid>
                        )}
                      </SoftBox>
                    </SoftBox>

                    <SoftBox
                      className="setting-inner-main-cont2"
                      style={{ display: !contactDetails ? 'none' : 'block' }}
                    >
                      <SoftBox className="setting-inner-heading-cont">
                        <SoftTypography className="basic-font">Contact Information</SoftTypography>
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

                        {showedit ? (
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={12} xl={12}>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  value={contactDetails?.contactName}
                                  name="contactName"
                                  onChange={handleChange2}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                                <div className="req">{'  '}*</div>
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={contactDetails?.contactType}
                                  name="contactType"
                                  onChange={handleChange2}
                                  readOnly
                                />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input-hover"
                                  type="text"
                                  value={contactDetails?.email}
                                  name="email"
                                  onChange={handleChange2}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                                <div className="req">{'  '}*</div>
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="number"
                                  value={contactDetails?.phoneNo}
                                  name="phoneNo"
                                  onChange={handleChange2}
                                  readOnly
                                />
                                <br />
                              </SoftBox>
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={12} xl={12}>
                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={contactDetails?.contactName}
                                  name="contactName"
                                  onChange={handleChange2}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={contactDetails?.contactType}
                                  name="contactType"
                                  onChange={handleChange2}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="text"
                                  value={contactDetails?.email}
                                  name="email"
                                  onChange={handleChange2}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>

                              <SoftBox className="orgi-softbox-input">
                                <SoftInput
                                  className="Edit-box-input"
                                  type="number"
                                  value={contactDetails?.phoneNo}
                                  name="phoneNo"
                                  onChange={handleChange2}
                                  readOnly={IsreadOnly}
                                />
                                <br />
                              </SoftBox>
                            </Grid>
                          </Grid>
                        )}
                      </SoftBox>
                    </SoftBox>

                    <SoftBox className="setting-inner-main-cont4">
                      {showedit ? (
                        <SoftBox className="setting-inner-heading-cont-I">
                          <SoftTypography className="basic-font">Support Contact</SoftTypography>
                          <SoftBox className="orgi-softbox-icon div">
                            <Button className="basic-font2" onClick={() => handleContactRow(1)}>
                              Add more +
                            </Button>
                          </SoftBox>
                        </SoftBox>
                      ) : (
                        <SoftBox className="setting-inner-heading-cont-I">
                          <SoftTypography className="basic-font">Support Contact</SoftTypography>
                        </SoftBox>
                      )}

                      {newContactRow.map((e, i) => {
                        return (
                          <SoftBox key={e.id} className="setting-inner-body-cont-I">
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

                            {showedit ? (
                              <Grid container spacing={3} className="hshj">
                                <SoftBox className="close-sup-icons">
                                  <CloseIcon
                                    sx={{ display: supContactDetails[i]?.contactDto?.id ? 'none' : 'block' }}
                                    onClick={() => handleSupportRemove(i)}
                                  />
                                </SoftBox>
                                <Grid item xs={12} md={12} xl={12} className="ppp">
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      readOnly={IsreadOnly}
                                      onChange={(e) => handleChange3(i, e)}
                                      name="contactName"
                                      value={supContactDetails[i]?.contactDto?.contactName}
                                      required={true}
                                      disabled={supContactDetails[i]?.contactDto?.id ? true : false}
                                    />
                                    <br /> <div className="req">{'  '}*</div>
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={supContactDetails[i]?.contactDto?.contactType}
                                      name="contactType"
                                      onChange={(e) => handleChange3(i, e)}
                                      readOnly={IsreadOnly}
                                      required
                                      disabled={supContactDetails[i]?.contactDto?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={supContactDetails[i]?.contactDto?.email}
                                      name="email"
                                      onChange={(e) => handleChange3(i, e)}
                                      readOnly={IsreadOnly}
                                      required
                                      disabled={supContactDetails[i]?.contactDto?.id ? true : false}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={supContactDetails[i]?.contactDto?.phoneNo}
                                      name="phoneNo"
                                      onChange={(e) => handleChange3(i, e)}
                                      readOnly={IsreadOnly}
                                      required
                                      disabled={supContactDetails[i]?.contactDto?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container spacing={3} className="hshj">
                                <Grid item xs={12} md={12} xl={12} className="ppp">
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      readOnly={IsreadOnly}
                                      onChange={handleChange3}
                                      name="contactName"
                                      value={supContactDetails[i]?.contactDto?.contactName}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={supContactDetails[i]?.contactDto?.contactType}
                                      name="contactType"
                                      onChange={handleChange3}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={supContactDetails[i]?.contactDto?.email}
                                      name="email"
                                      onChange={handleChange3}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={supContactDetails[i]?.contactDto?.phoneNo}
                                      name="phoneNo"
                                      onChange={handleChange3}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                </Grid>
                              </Grid>
                            )}
                          </SoftBox>
                        );
                      })}
                    </SoftBox>

                    <SoftBox className="setting-inner-main-cont2">
                      {showedit ? (
                        <SoftBox className="setting-inner-heading-cont">
                          <SoftTypography className="basic-font">Bank Details</SoftTypography>
                          <SoftBox className="orgi-softbox-icon div">
                            <Button className="basic-font2" onClick={() => handleBankRow(1)}>
                              Add more +
                            </Button>
                          </SoftBox>
                        </SoftBox>
                      ) : (
                        <SoftBox className="setting-inner-heading-cont">
                          <SoftTypography className="basic-font">Bank Details</SoftTypography>
                        </SoftBox>
                      )}
                      {newBankRow.map((e, i) => {
                        return (
                          <SoftBox key={e.id} className="setting-inner-body-cont-I">
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={12} xl={12}>
                                <SoftBox className="setting-info-cont">
                                  <List className="list-type-op">
                                    <ListItem>Account Holder Name</ListItem>
                                    <ListItem>Account Number</ListItem>
                                    <ListItem>IFSC code</ListItem>
                                    <ListItem>Bank Name</ListItem>
                                    <ListItem>Bank Address</ListItem>
                                    <ListItem>Account Type</ListItem>
                                  </List>
                                </SoftBox>
                              </Grid>
                            </Grid>

                            {showedit ? (
                              <Grid container spacing={3}>
                                <SoftBox className="close-bank-icons">
                                  <CloseIcon
                                    sx={{ display: bankDetails[i]?.bankDetail?.id ? 'none' : 'block' }}
                                    onClick={() => handleBankRemove(i)}
                                  />
                                </SoftBox>
                                <Grid item xs={12} md={12} xl={12}>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={bankDetails[i]?.bankDetail?.accountHolderName}
                                      name="accountHolderName"
                                      onChange={(e) => handleChange4(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={bankDetails[i]?.bankDetail?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={bankDetails[i]?.bankDetail?.bankAccountNumber}
                                      name="bankAccountNumber"
                                      onChange={(e) => handleChange4(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={bankDetails[i]?.bankDetail?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={bankDetails[i]?.bankDetail?.ifscNumber}
                                      name="ifscNumber"
                                      onChange={(e) => handleChange4(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={bankDetails[i]?.bankDetail?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={bankDetails[i]?.bankDetail?.bankName}
                                      name="bankName"
                                      onChange={(e) => handleChange4(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={bankDetails[i]?.bankDetail?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={bankDetails[i]?.bankDetail?.bankAddress}
                                      name="bankAddress"
                                      onChange={(e) => handleChange4(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={bankDetails[i]?.bankDetail?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={bankDetails[i]?.bankDetail?.accountType}
                                      name="accountType"
                                      onChange={(e) => handleChange4(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={bankDetails[i]?.bankDetail?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={12} xl={12}>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={bankDetails[i]?.bankDetail?.accountHolderName}
                                      name="accountHolderName"
                                      onChange={handleChange4}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={bankDetails[i]?.bankDetail?.bankAccountNumber}
                                      name="bankAccountNumber"
                                      onChange={handleChange4}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={bankDetails[i]?.bankDetail?.ifscNumber}
                                      name="ifscNumber"
                                      onChange={handleChange4}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={bankDetails[i]?.bankDetail?.bankName}
                                      name="bankName"
                                      onChange={handleChange4}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={bankDetails[i]?.bankDetail?.bankAddress}
                                      name="bankAddress"
                                      onChange={handleChange4}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={bankDetails[i]?.bankDetail?.accountType}
                                      name="accountType"
                                      onChange={handleChange4}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                </Grid>
                              </Grid>
                            )}
                          </SoftBox>
                        );
                      })}
                    </SoftBox>

                    <SoftBox className="setting-inner-main-cont2">
                      {showedit ? (
                        <SoftBox className="setting-inner-heading-cont">
                          <SoftTypography className="basic-font">Address Details</SoftTypography>
                          <SoftBox className="orgi-softbox-icon div">
                            <Button className="basic-font2" onClick={() => handleAddressRow(1)}>
                              Add more +
                            </Button>
                          </SoftBox>
                        </SoftBox>
                      ) : (
                        <SoftBox className="setting-inner-heading-cont">
                          <SoftTypography className="basic-font">Address Details</SoftTypography>
                        </SoftBox>
                      )}
                      {newAddressRow.map((e, i) => {
                        return (
                          <SoftBox key={e.id} className="setting-inner-body-cont-I">
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={12} xl={12}>
                                <SoftBox className="setting-info-cont">
                                  <List className="list-type-op">
                                    <ListItem>Address Line 1</ListItem>
                                    <ListItem>Address Line 2</ListItem>
                                    <ListItem>Country</ListItem>
                                    <ListItem>State</ListItem>
                                    <ListItem>City</ListItem>
                                    <ListItem>Pincode</ListItem>
                                    <ListItem>Address Type</ListItem>
                                  </List>
                                </SoftBox>
                              </Grid>
                            </Grid>

                            {showedit ? (
                              <Grid container spacing={3}>
                                <SoftBox className="close-bank-icons">
                                  <CloseIcon
                                    sx={{ display: addressDetails[i]?.addressDto?.id ? 'none' : 'block' }}
                                    onClick={() => handleAddressRemove(i)}
                                  />
                                </SoftBox>
                                <Grid item xs={12} md={12} xl={12}>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.addressLine1}
                                      name="addressLine1"
                                      onChange={(e) => handleChange5(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={addressDetails[i]?.addressDto?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.addressLine2}
                                      name="addressLine2"
                                      onChange={(e) => handleChange5(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={addressDetails[i]?.addressDto?.id ? true : false}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.country}
                                      name="country"
                                      onChange={(e) => handleChange5(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={addressDetails[i]?.addressDto?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.state}
                                      name="state"
                                      onChange={(e) => handleChange5(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={addressDetails[i]?.addressDto?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.city}
                                      name="city"
                                      onChange={(e) => handleChange5(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={addressDetails[i]?.addressDto?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.pincode}
                                      name="pincode"
                                      onChange={(e) => handleChange5(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={addressDetails[i]?.addressDto?.id ? true : false}
                                    />
                                    <br />
                                    <div className="req">{'  '}*</div>
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input-hover"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.addressType}
                                      name="addressType"
                                      onChange={(e) => handleChange5(i, e)}
                                      readOnly={IsreadOnly}
                                      disabled={addressDetails[i]?.addressDto?.id ? true : false}
                                    />
                                    <br />
                                  </SoftBox>
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={12} xl={12}>
                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.addressLine1}
                                      name="addressLine1"
                                      onChange={handleChange5}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.addressLine2}
                                      name="addressLine2"
                                      onChange={handleChange5}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.country}
                                      name="country"
                                      onChange={handleChange5}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.state}
                                      name="state"
                                      onChange={handleChange5}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.city}
                                      name="city"
                                      onChange={handleChange5}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.pincode}
                                      name="pincode"
                                      onChange={handleChange5}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>

                                  <SoftBox className="orgi-softbox-input">
                                    <SoftInput
                                      className="Edit-box-input"
                                      type="text"
                                      value={addressDetails[i]?.addressDto?.addressType}
                                      name="addressType"
                                      onChange={handleChange5}
                                      readOnly={IsreadOnly}
                                    />
                                    <br />
                                  </SoftBox>
                                </Grid>
                              </Grid>
                            )}
                          </SoftBox>
                        );
                      })}
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            )}
          </>
        )}
      </SoftBox>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleCloseAlert} severity={successUr ? 'success' : 'error'} sx={{ width: '100%' }}>
          {errorhandler}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShoplocationWMS;
