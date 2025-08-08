import './create-bills.css';
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextareaAutosize } from '@mui/material';
import { eligiblePOforBill, getbillsvendordetails, postNewbills } from '../../../config/Services';
import { format } from 'date-fns';
import { isSmallScreen } from '../Common/CommonFunction';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import { useState } from 'react';
import Card from '@mui/material/Card';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import MobileNavbar from '../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const Createbills = () => {
  const { poNumber } = useParams();
  const showSnackbar = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [purchaseorder, setPurchaseorder] = useState(poNumber);
  const [referencenumber, setReferenceNumber] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [date, setDate] = useState('');
  const [billLogo, setBillLogo] = useState();
  const [selectedImages, setSelectedImages] = useState('');
  const [prev, setPrev] = useState('');
  const [datRows, setTableRows] = useState([]);
  const [idFound, setIdFound] = useState(false);
  const [comment, setComment] = useState('');
  const isMobileDevice = isSmallScreen();

  const orgId = localStorage.getItem('orgId');
  const sourceLocationId  = localStorage.getItem('locId');

  const paymentOption = [
    { value: 'due on receipts', label: 'Due On receipts' },
    { value: 'net 30', label: 'Net 30' },
    { value: 'DUE END OF MONTH', label: 'DUE END OF MONTH' },
    { value: 'net 15', label: 'NET 15' },
    { value: 'due on delivery', label: 'Due On Delivery' },
  ];

  let poArr,
    poListsArr = [];
  React.useEffect(() => {
    if(poNumber) {
      setIdFound(true);
      getPoDetails(poNumber);
    }
    else{
      getAllPoList();
    }
  }, []);

  const getAllPoList = () => {
    setLoader(true);
    eligiblePOforBill(orgId, sourceLocationId).then((responseTxt) => {
      poArr = responseTxt.data.data;
      poListsArr.push(
        poArr?.map((row) => ({
          value: row.poNumber,
          label: row.poNumber,
        })),
      );
      setTableRows(poListsArr[0]);
      setLoader(false);
    })
      .catch((err) => {
        setLoader(false);
      });
  };

  const getPoDetails = (event) => {
    setLoader(true);
    let poValue = '';
    if(poNumber){
      poValue = event;
    }
    else{
      poValue = event.value;
    }
    try {
      setLoader(false);
      setPurchaseorder(poValue);
      getbillsvendordetails(poValue)
        .then((res) => {
          setVerify(true);
          setVendorId(res?.data?.data?.vendorId);
          setVendorName(res?.data?.data?.vendorName);
          setBillingaddress(res?.data?.data);
          showSnackbar('Success PO Verified','success');
          setLoaderTime(false);
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message,'error');
          setLoaderTime(false);
          location.window.reload(true);
        });
    } catch (err) {
      setErrorMessage(res?.message);
    }
  };

  const defaultSelected = paymentOption.find((opt) => !!opt.value);
  const [paymentTermsType, setpaymentTermsType] = useState(defaultSelected);

  //file upload
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files[0]);
  };

  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);

  const handleSubmitForm = (event) => {
    setLoader(true);
    const payload = {
      poNumber: purchaseorder,
      referenceNumber: referencenumber,
      dueDate: date,
      paymentMethod: paymentTermsType.label,
      vendorId: vendorId,
      vendorName: vendorName,
      createdBy:object?.uidx,
      comments : comment
    };

    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFiles);
    formData.append(
      'purchaseOrderBill',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );

    for (const pair of formData.entries()) {
    }
    postNewbills(formData)
      .then((res) => {
        setLoader(false);
        navigate('/purchase/purchase-bills');
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar(err?.response?.data?.message,'error');
      });
  };

  const [inputlist, setInputlist] = useState([
    {
      item: '',
      spec: '',
      quantity: '',
      price: '',
    },
  ]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputlist];
    list[index][name] = value;
    setInputlist(list);
  };

  const handleClick = () => {
    setInputlist([...inputlist, { item: '', spec: '', quantity: '', price: '' }]);
  };

  const handleRemove = (index) => {
    const list = [...inputlist];
    list.splice(index, 1);
    setInputlist(list);
  };

  const [verify, setVerify] = useState(false);
  const [show, setShow] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [billingaddress, setBillingaddress] = useState({});

  const columns = [
    {
      field: 'id',
      headerName: 'Description of the goods to be supplied',
      width: 300,
      headerAlign: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'quantityorder',
      headerName: 'Quantity Ordered',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 300,
    },
    {
      field: 'rate',
      headerName: 'Rate (INR)',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      width: 300,
    },
    {
      field: 'amount',
      headerName: 'Amount (INR)',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      width: 300,
    },
  ];

  const [loaderTime, setLoaderTime] = useState(false);

  let dataArr,
    dataRow = [];

  const onVerify = (purchaseorder) => {
    setLoaderTime(true);
    
  };

  const handleCancel = () =>{
    navigate('/purchase/purchase-bills');
  };

  return (
    <DashboardLayout>
      {!isMobileDevice ? (
        <DashboardNavbar prevLink={true} />
      ) : (
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
          <MobileNavbar title={'Bill Creation'} prevLink={true}/>
        </SoftBox>
      )}
      <SoftBox mb={3} mt={isMobileDevice && 2}>
        {loader && <Spinner />}
        {!loader &&
          (idFound ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} xl={6}>
                <Card sx={{ padding: '25px', overflow: 'visible' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="15px"
                    >
                      PURCHASE ORDER No: {poNumber}
                    </SoftTypography>
                  </SoftBox>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} xl={6}>
                <Card sx={{ padding: '25px', overflow: 'visible' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      Select PO No
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect defaultValue={{ value: '', label: '' }} options={datRows} onChange={getPoDetails} />
                </Card>
              </Grid>
            </Grid>
          ))}
      </SoftBox>
      <Grid container spacing={3} mb={1.5}>
        {verify ? (
          <Grid item xs={12} sm={12} md={6} xl={6}>
            <Card sx={{ padding: '25px', overflow: 'visible' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
              <SoftBox className="create-bills-flex-box">
                <SoftBox className="billing-box">
                  <SoftTypography className="billing-text" variant="h6">
                    Vendor Details
                  </SoftTypography>
                  <SoftTypography variant="p" fontSize="14px">
                    {' '}
                    Vendor Name - {billingaddress.vendorName}
                  </SoftTypography>
                  <br />
                  <SoftTypography variant="p" fontSize="14px">
                    Purchase Value - ₹{billingaddress.grossAmount}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        ) : null}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6} xl={6}>
          <Card sx={{ padding: '25px', overflow: 'visible' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <SoftTypography variant="h6">Due Date </SoftTypography>
                <LocalizationProvider dateAdapter={AdapterDayjs} sx={{width:'100%'}}>
                  <DatePicker
                    disablePast
                    views={['year', 'month', 'day']}
                    format="DD-MM-YYYY"
                    onChange={(date) => setDate(format(date.$d, 'yyyy-MM-dd'))}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={12}>
                <SoftTypography variant="h6">Reference Number</SoftTypography>
                <SoftBox>
                  <SoftInput type="text" onChange={(e) => setReferenceNumber(e.target.value)} />
                </SoftBox>
              </Grid>

              <Grid item xs={12} md={12}>
                <SoftTypography variant="h6">Payment Terms</SoftTypography>
                <SoftBox>
                  <SoftSelect
                    value={paymentTermsType}
                    onChange={(option) => setpaymentTermsType(option)}
                    options={paymentOption}
                  />
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={12}>
                <SoftBox className="textarea-box">
                  <SoftTypography fontSize="12px" fontWeight="bold">
                  Customer Notes
                  </SoftTypography>
                  <SoftBox>
                    <TextareaAutosize
                      onChange={(e) => setComment(e.target.value)}
                      aria-label="minimum height"
                      minRows={3}
                      placeholder="Will be displayed on Bill Details"
                      className="add-pi-textarea"
                    />
                  </SoftBox>
                </SoftBox>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} xl={6}></Grid>
          </Card>
        </Grid>
      </Grid>

      <SoftBox className="attach-file-box" mt={3}>
        {selectedFiles ? (
          <SoftBox className="logo-box-org-I">
            <img src={selectedFiles} className="logo-box-org" />
            <Grid item xs={12} md={6} xl={6}>
              <SoftButton onClick={() => setSelectedFiles('')}>
                <EditIcon />
              </SoftButton>
            </Grid>
          </SoftBox>
        ) : (
          <SoftBox className={`${isMobileDevice ? 'po-box-shadow attach-file-ismobiledevice' : 'add-customer-file-box-I'}`}>
            <SoftTypography className="add-customer-file-head">Attach File(s) to Bill</SoftTypography>
            <SoftBox className="profile-box-up">
              <form className="profile-box-up">
                <input type="file" name="file" id="my-file" className="hidden" onChange={handleFileChange} />
                <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                  <SoftTypography className="upload-text-I">
                    Upload <UploadFileIcon />{' '}
                  </SoftTypography>
                </label>
              </form>
            </SoftBox>
          </SoftBox>
        )}
      </SoftBox>
      <SoftBox className="create-bills-last-box" style={{gap: '10px'}}>
        <SoftButton className="vendor-second-btn" onClick={handleCancel}>Cancel</SoftButton>
        <SoftButton className="vendor-add-btn" onClick={handleSubmitForm}>
          Save
        </SoftButton>
      </SoftBox>
    </DashboardLayout>
  );
};
export default Createbills;
