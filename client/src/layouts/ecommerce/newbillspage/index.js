import './new-bills.css';
import * as React from 'react';
import { getbillsvendordetails, postNewbills } from '../../../config/Services';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import MuiAlert from '@mui/material/Alert';
import SetInterval from '../setinterval';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const Newbills = () => {
  const { poNumber } = useParams();
  const [loader, setLoader] = useState(false);
  const [purchaseorder, setPurchaseorder] = useState(poNumber);
  const [referencenumber, setReferenceNumber] = useState('');
  const [date, setDate] = useState('');

  const paymentOption = [
    { value: 'due on receipts', label: 'Due On receipts' },
    { value: 'net 30', label: 'Net 30' },
    { value: 'DUE END OF MONTH', label: 'DUE END OF MONTH' },
    { value: 'net 15', label: 'NET 15' },
    { value: 'due on delivery', label: 'Due On Delivery' },
  ];

  const defaultSelected = paymentOption.find((opt) => !!opt.value);
  const [paymentTermsType, setpaymentTermsType] = useState(defaultSelected);

  //File upload ---

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
      createdBy: object?.uidx,
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
        setAlertmessage('Success PO Verified');
        setTimelineerror('success');
        setTimeout(() => {
          handleopensnack();
        });
        setLoader(false);
        navigate('/purchase/purchase-bills');
      })
      .catch((err) => {
        setAlertmessage(err.response.data.message);
        setTimelineerror('error');
        setTimeout(() => {
          handleopensnack();
        });
        setLoader(false);
      });
  };

  // const [openmodel, setOpenmodel] = useState(false);
  // const handleopen = () => {
  //     setOpenmodel(true)
  // }

  const products = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: 'Schindler\'s List', year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
  ];

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

  const [timelineloader, setTimelineloader] = useState(true);
  // snackbar alert

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [loaderTime, setLoaderTime] = useState(false);

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const [datRows, setTableRows] = useState([]);
  let dataArr,
    dataRow = [];
  const onVerify = (purchaseorder) => {
    setLoaderTime(true);

    try {
      getbillsvendordetails(purchaseorder)
        .then((res) => {
          setVerify(true);
          setBillingaddress(res.data.data);
          setTableRows(dataRow[0]);
          setAlertmessage('Success PO Verified');
          setTimelineerror('success');
          // setTimeout(() => {
          //   handleopensnack();
          // });
          SetInterval(handleopensnack());
          setLoaderTime(false);
        })
        .catch((err) => {
          setAlertmessage(err.response.data.message);
          setTimelineerror('error');
          SetInterval(handleopensnack());
          setLoaderTime(false);
          location.window.reload(true);
        });
    } catch (err) {
      setAlertmessage(err.response.data.message);
      setTimelineerror('error');
      SetInterval(handleopensnack());
      setLoaderTime(false);
      location.window.reload(true);
    }
  };

  const handleCancel = () => {
    navigate('/purchase/purchase-bills');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>

      <SoftBox mb={3}>
        {loader && <Spinner />}
        {!loader && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} xl={6}>
              <Card>
                <SoftBox p={3}>
                  <SoftTypography variant="h6">P.O Number</SoftTypography>
                  <SoftBox className="flex-main-box">
                    <SoftInput
                      required
                      type="text"
                      onChange={(e) => setPurchaseorder(e.target.value)}
                      value={purchaseorder}
                    />
                    {loaderTime ? (
                      <CircularProgress className="spin-box" />
                    ) : (
                      <SoftBox className="create-bills-verify-btn" onClick={() => onVerify(purchaseorder)}>
                        <SoftTypography variant="h6" className="verify-text-verify">
                          Verify
                        </SoftTypography>
                      </SoftBox>
                    )}
                  </SoftBox>
                </SoftBox>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} xl={6}></Grid>
            {verify ? (
              <Grid item xs={12} sm={12} md={6} xl={6}>
                <Card sx={{ padding: '30px' }}>
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
        )}
      </SoftBox>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6} xl={6}>
          <Card sx={{ padding: '25px', overflow: 'visible' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <SoftTypography variant="h6">Reference Number</SoftTypography>
                <SoftBox>
                  <SoftInput type="text" onChange={(e) => setReferenceNumber(e.target.value)} />
                </SoftBox>
              </Grid>

              <Grid item xs={12} md={12}>
                <SoftTypography variant="h6">Due Date</SoftTypography>
                <SoftBox>
                  <SoftInput type="date" onChange={(e) => setDate(e.target.value)} />
                </SoftBox>
              </Grid>
              {/* <Grid item xs={12} md={12} xl={12}>
                <SoftBox mt={1.5}>
                  <SoftTypography fontSize="13px" fontWeight="bold">
                    Due Date
                  </SoftTypography>
                  <SoftDatePicker onChange={(e) => setDate(e.target.value)} />
                </SoftBox>
              </Grid> */}

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
          <SoftBox className="add-customer-file-box-I">
            <SoftTypography className="add-customer-file-head">Attach File(s) to Bill</SoftTypography>
            <SoftBox className="profile-box-up">
              <form className="profile-box-up">
                <input type="file" name="file" id="my-file" className="hidden" onChange={handleFileChange} />
                <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                  <SoftTypography className="upload-text-I">
                    Upload <UploadFileIcon />
                  </SoftTypography>
                </label>
              </form>
            </SoftBox>
          </SoftBox>
        )}
      </SoftBox>

      <SoftBox className="create-bills-last-box">
        <SoftButton className="cancel-create-bills" onClick={handleCancel}>
          Cancel
        </SoftButton>
        <SoftButton className="save-create-bills" onClick={handleSubmitForm}>
          Save
        </SoftButton>
      </SoftBox>
    </DashboardLayout>
  );
};
export default Newbills;
