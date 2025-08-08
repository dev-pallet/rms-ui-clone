import './newPurchase.css';
import { Autocomplete, TextField } from '@mui/material';
import { getItemsInfo } from '../../../../../../config/Services';
import { useState } from 'react';
import AttachmentSharpIcon from '@mui/icons-material/AttachmentSharp';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import EditIcon from '@mui/icons-material/Edit';
import FormField from 'layouts/ecommerce/product/all-products/components/edit-product/components/FormField/index';
import Grid from '@mui/material/Grid';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import TextareaAutosize from '@mui/material/TextareaAutosize';

const NewSalesPurchase = () => {
  const [selectedFiles, setSelectedFiles] = useState();

  const [customerName, setCustomerName] = useState('');
  const [reference, setReference] = useState('');
  const [salesOrderDate, setSalesOrderDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [salesPerson, setSalesPerson] = useState('');
  const [shipmentDate, setShipmentDate] = useState('');

  const [noteTxt, setNoteTxt] = useState('');
  const [loader, setLoader] = useState(false);
  const [custDetails, setCustDetails] = useState(false);
  const [curItemIndex, setcurItemIndex] = useState(0);
  const [inputlist, setInputlist] = useState([
    {
      prodOptions: [],
      itemCode: '',
      quantityOrdered: '',
      rate: '',
      igst: '',
      cgst: '',
      sgst: '',
      subtotal: '',
    },
  ]);

  const [sellingPrice, setSellingPrice] = useState('');
  const [subTotal, setSubTotal] = useState('');
  const [iGST, setIGST] = useState('');
  const [cGST, setCGST] = useState('');
  const [sGST, setSGST] = useState('');
  const [grandTotal, setGrandTotal] = useState('');
  const [itemNo, setItemNo] = useState('');
  const [quantityUnits, setQuantityUnits] = useState('');
  const [productIds, setProductIds] = useState([]);

  const handleUploadFile = (event) => {
    setSelectedFiles(event.target.files[0]);
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputlist];
    list[index][name] = value;
    setInputlist(list);
  };

  const handleStateChange = (index, e) => {
    const preferObj = {
      name: 'preferVendor',
      value: e,
    };

    const { name, value } = preferObj;
    const list = [...inputlist];
    list[index][name] = value;
    setInputlist(list);
  };

  const handleClick = () => {
    setInputlist([
      ...inputlist,
      { prodOptions: [], itemCode: '', rate: '', quantityOrdered: '', discount: '', tax: '', amt: '' },
    ]);
    setcurItemIndex(curItemIndex + 1);
  };

  const handleRemove = (index) => {
    const list = [...inputlist];
    const list1 = [...productIds];
    list.splice(index, 1);
    list1.splice(index, 1);
    setInputlist(list);
    setProductIds(list1);
    setcurItemIndex(curItemIndex - 1);
  };

  const handleDetailCust = (e) => {
    setCustomerName(e.value);
    setCustDetails(true);
  };

  const selectProduct = (item) => {
    const list = [...inputlist];
    list[curItemIndex].itemCode = item.gtin;
    list[curItemIndex].rate = item.mrp.mrp;
    list[curItemIndex].igst = item.igst;
    list[curItemIndex].cgst = item.cgst;
    list[curItemIndex].sgst = item.sgst;
    list[curItemIndex].prodOptions = [];

    setInputlist(list);

    if (item.gtin !== '') {
      const list1 = [...productIds];
      list1.push(item.gtin);
      setProductIds(list1);
    }
  };

  const handleChangeIO = (e, index) => {
    const searchText = e.target.value;
    const payload = {
      page: '1',
      pageSize: '10',
      names: [searchText],
      supportedWarehouse: [],
      supportedStore: [locId],
    };
    if (searchText.length >= 3) {
      setLoader(true);
      getItemsInfo(payload).then(function (response) {
        setLoader(false);
        const list = [...inputlist];
        list[index].prodOptions = response.data.data.products;
        setInputlist(list);
      });
    } else if (searchText == 0) {
      const list = [...inputlist];
      list[index].prodOptions = [];
      setInputlist(list);
    }
  };

  const handleSaveData = () => {
    setLoader(true);
    const allPayload = JSON.parse(localStorage.getItem('allPayload') || '[]');
    const payloads = {
      userName: customerName,
      referenceId: reference,
      salesOrderDate: salesOrderDate,
      shipmentDate: shipmentDate,
      paymentTerms: paymentTerms,
      deliveryMethod: deliveryMethod,
      salesPerson: salesPerson,
      itemDetails: inputlist,

      sellingPrice: sellingPrice,
      subTotal: subTotal,
      igst: iGST,
      cgst: cGST,
      sgst: sGST,
      grandTotal: grandTotal,
      itemNo: itemNo,
      quantityUnits: quantityUnits,
    };

    allPayload.push(payloads);
    localStorage.setItem('allPayload', JSON.stringify(allPayload));
    const formData = new FormData();
    formData.append('file', selectedFiles);
    formData.append(
      'salesOrder',
      new Blob([JSON.stringify(payloads)], {
        type: 'application/json',
      }),
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <SoftBox className="sales-details-box">
        <Grid container spacing={3}>
          <Grid item xs={12} xl={12}>
            {loader && <Spinner />}
            <Grid item xs={12} sm={5.15} mb={2}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                  Customer Name
                </SoftTypography>
              </SoftBox>
              <SoftSelect
                name="customerName"
                defaultValue={{ value: 'clothing', label: 'Customer name' }}
                onChange={handleDetailCust}
                options={[
                  { value: 'clothing', label: 'Clothing' },
                  { value: 'electronics', label: 'Electronics' },
                  { value: 'furniture', label: 'Furniture' },
                  { value: 'others', label: 'Others' },
                  { value: 'real estate', label: 'Real Estate' },
                ]}
              />
              {custDetails ? (
                <SoftBox display="flex" justifyContent="space-between" ml={4}>
                  <SoftBox variant="h6" fontSize="14px">
                    BILLING ADDRESS
                  </SoftBox>
                  <SoftBox variant="h6" fontSize="14px">
                    {' '}
                    SHIPPING ADDRESS{' '}
                  </SoftBox>
                </SoftBox>
              ) : (
                <></>
              )}
            </Grid>

            <Grid item xs={12} sm={5.15} mb={2}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                  Sales Order
                </SoftTypography>
              </SoftBox>
              <SoftSelect
                name="customerName"
                defaultValue={{ value: 'clothing', label: 'Customer name' }}
                onChange={handleDetailCust}
                options={[
                  { value: 'clothing', label: 'Clothing' },
                  { value: 'electronics', label: 'Electronics' },
                  { value: 'furniture', label: 'Furniture' },
                  { value: 'others', label: 'Others' },
                  { value: 'real estate', label: 'Real Estate' },
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={5.15} mb={2}>
              <FormField type="date" label="Package Slip" onChange={(e) => setSalesOrderDate(e.target.value)} />
            </Grid>

            <Grid item xs={12} sm={5.15} mb={2}>
              <FormField type="date" label="Date" onChange={(e) => setShipmentDate(e.target.value)} />
            </Grid>
          </Grid>
        </Grid>
      </SoftBox>

      <SoftBox className="sales-details-scroll-table-box">
        <SoftBox className="infinite-input-box-I" p="10px" border="none !important">
          <Grid sx={{ flexGrow: 1 }} mb="10px" container>
            <Grid item xs={4}>
              <SoftBox fontSize="16px" fontWeight="bold">
                Item details
              </SoftBox>
            </Grid>
            <Grid item xs>
              <SoftBox fontSize="16px" fontWeight="bold">
                Ordered Id
              </SoftBox>
            </Grid>
            <Grid item xs>
              <SoftBox fontSize="16px" fontWeight="bold">
                Packaged ID
              </SoftBox>
            </Grid>
            <Grid item xs>
              <SoftBox fontSize="16px" fontWeight="bold">
                Quantity To Pack
              </SoftBox>
            </Grid>
          </Grid>

          {inputlist.map((x, i) => {
            return (
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Autocomplete
                    className="search-input"
                    options={x.prodOptions}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, v) => selectProduct(v)}
                    style={{ width: 275 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        //   onChange={(e) => handleChangeIO(e, i)}
                        variant="outlined"
                        name="itemCode"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs>
                  <SoftInput
                    className="soft-spec-box"
                    type="number"
                    size="50"
                    onChange={(e) => setQuantityUnits(e.target.value)}
                    name="quantityOrdered"
                    defaultValue="1"
                  />
                </Grid>
                <Grid item xs textAlign="center">
                  <SoftTypography
                    className="soft-spec-box"
                    type="number"
                    fontSize="16px"
                    fontWeight="normal"
                    onChange={(e) => handleChange(i, e)}
                  >
                    {x.rate}
                  </SoftTypography>
                </Grid>
                <Grid item xs textAlign="center">
                  <SoftTypography
                    className="soft-spec-box"
                    type="number"
                    fontSize="16px"
                    fontWeight="normal"
                    onChange={(e) => handleChange(i, e)}
                    defaultValue="0"
                  >
                    {x.igst}
                  </SoftTypography>
                </Grid>
                <SoftBox className="close-icons" mt="35px" ml="15px" width="30px">
                  <CloseIcon onClick={() => handleRemove(i)} />
                </SoftBox>
              </Grid>
            );
          })}

          <Button onClick={handleClick} className="add-button">
            + Add more items
          </Button>
        </SoftBox>
      </SoftBox>

      <SoftBox className="sales-details-comment-box">
        <Grid container spacing={5} m="auto" width="100%">
          <Grid item xs={12} md={6} xl={5} mr={4}>
            <SoftBox className="textarea-box-o" mt={2}>
              <SoftBox className="attach-btn-cust">
                <SoftTypography fontSize="12px" fontWeight="bold">
                  {' '}
                  Customer Notes{' '}
                </SoftTypography>
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
                  <SoftBox className="profile-box">
                    <input
                      type="file"
                      name="file"
                      id="my-file"
                      className="hidden"
                      onChange={handleUploadFile}
                      multiple
                    />
                    <label htmlFor="my-file">
                      <SoftTypography className="upload-text-I">
                        <AttachmentSharpIcon className="file-upload" fontSize="30px" />
                      </SoftTypography>
                    </label>
                  </SoftBox>
                )}
              </SoftBox>
              <SoftBox>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Will be displayed on purchased order"
                  className="add-pi-textarea-i"
                  border="1px solid rgb(211,211,211)"
                  value={noteTxt}
                  onChange={(e) => setNoteTxt(e.target.value)}
                />
              </SoftBox>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={5} xl={4}></Grid>

          <Grid item xs={12} md={6} xl={6}></Grid>
          <Grid item xs={12} md={6} xl={6}></Grid>
          <Grid item xs={12} md={6} xl={6}></Grid>

          <Grid item xs={12} md={5} xl={5} ml="-30px">
            <SoftBox className="sales-details-save-box">
              <SoftButton>Cancel</SoftButton>
              <SoftButton color="info" variant="gradient" onClick={handleSaveData}>
                Save
              </SoftButton>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
};

export default NewSalesPurchase;
