import './product-portfolio.css';
import {
  addVendorPortfolioInCMS,
  addVendorPortfolioInVMS,
  getVendorProdPortfolioInfoSuggest,
} from 'config/Services';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import CreateNewProduct from '../../../purchase-exclusive/components/addNew/components/createProd';
import Grid from '@mui/material/Grid';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import TextField from '@mui/material/TextField';

export const ProductPortfolio = ({ handleTab }) => {
  const navigate = useNavigate();

  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;

  const locId = localStorage.getItem('locId');

  const [autoCompleteDetailsRowIndex, setAutoCompleteDetailsRowIndex] = useState([]);
  const [loader, setLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [prodName, setProdName] = useState('');
  const [barNum, setBarNum] = useState('');
  const [currIndex, setCurrIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState(20);
  const [sellingPrice, setSellingPrice] = useState(20);
  const [totalPurchasePrice, setTotalPurchasePrice] = useState(35);
  const [inputlist, setInputlist] = useState([
    {
      prodOptions: [],
      productName: '',
      quantity: '',
      unit: '',
      productPrice: '',
      gst: '',
      discount: '',
      vendorProductPrice: '',
      gtin: '',
    },
  ]);

  const handleChange = (e, index) => {
    const searchText = e.target.value;
    setProdName(searchText);
    if (searchText.length >= 3) {
      const payload = {
        page: '1',
        pageSize: '10',
        names: [searchText],
        brand: [],
        gtin: [],
        companyName: [],
        mainCategory: [],
        categoryLevel1: [],
        categoryLevel2: [],
        supportedStore: [],
        supportedWarehouse: [locId],
        supportedVendor: [],
        marketPlaceSeller: [],
      };

      setLoader(true);
      getVendorProdPortfolioInfoSuggest(payload).then(function (response) {
        if (response?.data?.data?.products?.length > 1) {
          setLoader(false);
          const list = [...inputlist];
          list[index].prodOptions = response?.data?.data?.products || [];
          setInputlist(list);
        } else {
          setOpenModal(true);
        }
      });
    } else if (searchText == 0) {
      const list = [...inputlist];
      list[index].prodOptions = [];
      setInputlist(list);
    }
  };

  const selectProduct = (item, index) => {
    const list = [...inputlist];
    list[index].productName = item.name;
    list[index].quantity = item.weights_and_measures.net_content;
    list[index].unit = item.weights_and_measures.measurement_unit;
    list[index].productPrice = item.mrp.mrp;
    list[index].gst = item.igst;
    list[index].gtin = item.gtin;
    list[index].prodOptions = [];
    setInputlist(list);
    setAutoCompleteDetailsRowIndex((prev) => [...prev, index]);

    setCurentProductName('');
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    if (item?.gtin !== undefined && item?.gtin !== '') {
      if (contextType === 'WMS' && !item?.productSource?.supportedWarehouses.includes(locId)) {
        handleCreateGlobalProd(item);
      } else if (contextType === 'RETAIL' && !item?.productSource?.supportedRetails.includes(locId)) {
        handleCreateGlobalProd(item);
      } else if (contextType === 'VMS' && !item?.productSource?.marketPlaceSellers.includes(locId)) {
        handleCreateGlobalProd(item);
      }
      setBarNum('');
      setProdName('');
      setProductPresentIndex(index);

      const updatedProductName = [...productName];
      updatedProductName[index] = item?.name;
      setProductName(updatedProductName);

      getPreviousPurchsePrice(item?.gtin, index);

      const updatedSpecification = [...specification];
      updatedSpecification[index] =
        item?.weights_and_measures?.net_weight + ' ' + item?.weights_and_measures?.measurement_unit;
      setSpecification(updatedSpecification);

      const updatedBarcodeNum = [...barcodeNum];
      updatedBarcodeNum[index] = item?.gtin;
      setBarcodeNum(updatedBarcodeNum);

      const updatedCMSIGST = [...cmsIGST];
      updatedCMSIGST[index] = Number(item?.igst);
      setCMSIgst(updatedCMSIGST);

      const updatedCess = [...itemCess];
      updatedCess[index] = Number(item?.cess);
      setItemCess(updatedCess);

      const updatedmrp = [...mrp];
      updatedmrp[index] = item?.mrp?.mrp;
      setMrp(updatedmrp);

      const updatedProductSelected = [...productSelected];
      updatedProductSelected[index] = true;
      setProductSelected(updatedProductSelected);

      setCurentValueChangeIndex(index);
      setAddDraftProduct(true);
    } else {
      const updatedProductName = [...productName];
      updatedProductName[index] = '';
      setProductName(updatedProductName);

      const updatedProductSelected = [...productSelected];
      updatedProductSelected[index] = false;
      setProductSelected(updatedProductSelected);

      const updatedSpecification = [...specification];
      updatedSpecification[index] = '';
      setSpecification(updatedSpecification);

      const updatedBarcodeNum = [...barcodeNum];
      updatedBarcodeNum[index] = '';
      setBarcodeNum(updatedBarcodeNum);

      const updatedCMSIGST = [...cmsIGST];
      updatedCMSIGST[index] = 0;
      setCMSIgst(updatedCMSIGST);

      const updatedmrp = [...mrp];
      updatedmrp[index] = '';
      setMrp(updatedmrp);
    }
  };

  const handleClick = () => {
    setInputlist([
      ...inputlist,
      {
        prodOptions: [],
        productName: '',
        quantity: '',
        unit: '',
        productPrice: '',
        gst: '',
        discount: '',
        vendorProductPrice: '',
        gtin: '',
      },
    ]);
  };

  const handleRemove = (item, index) => {
    const newList = [...inputlist.filter((e, i) => i !== index)];
    setInputlist(newList);
    const newSelectAuto = [];
    for (let i = 0; i < newList.length; i++) {
      if (newList[i].productName.length) {
        newSelectAuto.push(i);
      }
    }
    setAutoCompleteDetailsRowIndex(newSelectAuto);
  };

  const handleSpecChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputlist];
    list[index][name] = value;
    setInputlist(list);
  };

  const handleGstChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputlist];
    list[index][name] = value;
    setInputlist(list);
  };

  const handleProductPriceChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputlist];
    list[index][name] = value;
    setInputlist(list);
  };

  const handleDiscount = (e, index) => {
    const { name, value } = e.target;

    const list = [...inputlist];
    list[index][name] = value;

    const productPrice = parseInt(list[index]['productPrice']);
    const discountOnProductPrice = (value / 100) * productPrice;
    const finalVendorProductPrice = productPrice - discountOnProductPrice;
    list[index]['vendorProductPrice'] = finalVendorProductPrice.toString();
    setInputlist(list);
  };

  const addProtfolio = (index, e) => {
    let vendorId = '';
    if (localStorage.getItem('vendorIdForProductPortfolioFromSku')) {
      vendorId = localStorage.getItem('vendorIdForProductPortfolioFromSku');
    } else {
      vendorId = localStorage.getItem('vendorId');
    }

    const vendorName = localStorage.getItem('vendorName');

    const filterProductIds = inputlist.filter((item) => item.productName !== '').map((item) => item.gtin);

    const payloadForVendorPortfolioInCMS = {
      vendorId: vendorId,
      vendorName: vendorName,
      productIds: filterProductIds,
    };

    const payloadForVendorPortfolioInVMS = inputlist
      .filter((item) => item.productName !== '')
      .map((item) => ({
        gtin: item.gtin,
        productName: item.productName,
        productPrice: item.productPrice.toString(),
        vendorProductPrice: item.vendorProductPrice.toString(),
        discount: item.discount.toString(),
        createdBy: uidx,
      }));

    //filtering product with gtin to avoid redundance
    const uniquePayloadVMS = payloadForVendorPortfolioInVMS.filter(
      (obj, index) => payloadForVendorPortfolioInVMS.findIndex((item) => item.gtin === obj.gtin) === index,
    );

    setLoader(true);
    addVendorPortfolioInCMS(payloadForVendorPortfolioInCMS).then(function (response) {
      setLoader(false);
    });

    addVendorPortfolioInVMS(uniquePayloadVMS, vendorId).then(function (response) {
      setLoader(false);
      if (localStorage.getItem('vendorIdForProductPortfolioFromSku')) {
        localStorage.removeItem('vendorIdForProductPortfolioFromSku');
        localStorage.setItem('navigateToSku', 2);
        navigate(`/purchase/vendors/details/${vendorId}`);
      }
      handleTab(2);
    });
  };

  return (
    <>
      {openModal && (
        <CreateNewProduct
          openModal={openModal}
          setOpenModal={setOpenModal}
          prodName={prodName}
          barNum={barNum}
          selectProduct={selectProduct}
          currIndex={currIndex}
          quantity={quantity}
          purchasePrice={purchasePrice}
          totalPurchasePrice={totalPurchasePrice}
          sellingPrice={sellingPrice}
          setQuantity={setQuantity}
          setPurchasePrice={setPurchasePrice}
          setTotalPurchasePrice={setTotalPurchasePrice}
          setSellingPrice={setSellingPrice}
        />
      )}

      <SoftBox className="vendor-portfolio-card">
        <SoftTypography variant="label" className="label-heading">
          Product details
          <SoftBox className="infinite-input-box-I-vendor" style={{ marginTop: '20px' }}>
            {inputlist?.map((x, i) => {
              return (
                <SoftBox className="inline-input-box-table" sx={{ marginBottom: '2rem' }}>
                  <SoftBox className="soft-corner-box2" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <SoftTypography
                      component="label"
                      variant="caption"
                      textTransform="capitalize"
                      fontSize="13px"
                      sx={{ marginBottom: '0.5rem' }}
                    >
                      Item Name
                    </SoftTypography>
                    {autoCompleteDetailsRowIndex.includes(i) && x.productName.length ? (
                      <TextField
                        value={x.productName}
                        readOnly={true}
                        style={{
                          width: '175px',
                          height: '40px',
                        }}
                      />
                    ) : (
                      <Autocomplete
                        options={x.prodOptions}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, v) => selectProduct(v, i)}
                        style={{ width: 175 }}
                        renderInput={(params) => (
                          <TextField {...params} onChange={(e) => handleChange(e, i)} variant="outlined" fullWidth />
                        )}
                      />
                    )}
                  </SoftBox>
                  <SoftBox className="soft-corner-box1">
                    <SoftBox className="soft-corner-inner-box1" sx={{ display: 'flex', flexDirection: 'column' }}>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        textTransform="capitalize"
                        fontSize="13px"
                        sx={{ marginBottom: '0.5rem' }}
                      >
                        Specification
                      </SoftTypography>
                      <SoftInput
                        className="soft-inner-input-i"
                        type="number"
                        name="quantity"
                        value={x.quantity}
                        onChange={(e) => handleSpecChange(e, i)}
                      />
                    </SoftBox>
                    <SoftBox className="soft-corner-inner-box2" sx={{ display: 'flex', flexDirection: 'column' }}>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        textTransform="capitalize"
                        fontSize="13px"
                        sx={{ marginTop: '0.2rem' }}
                      >
                        Unit
                      </SoftTypography>
                      <SoftInput
                        type="text"
                        name="unit"
                        // className="box"
                        value={x.unit}
                        readOnly={true}
                        sx={{ marginTop: '0.5rem' }}
                      />
                    </SoftBox>
                  </SoftBox>

                  <SoftBox className="soft-corner-box" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <SoftTypography
                      component="label"
                      variant="caption"
                      textTransform="capitalize"
                      fontSize="13px"
                      sx={{ marginBottom: '0.5rem' }}
                    >
                      MRP
                    </SoftTypography>
                    <SoftInput
                      type="number"
                      name="productPrice"
                      // className="box"
                      value={x.productPrice}
                      readOnly={true}
                      // onChange={(e) => handleProductPriceChange(e, i)}
                    />
                  </SoftBox>
                  <SoftBox className="soft-corner-box" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <SoftTypography
                      component="label"
                      variant="caption"
                      textTransform="capitalize"
                      fontSize="13px"
                      sx={{ marginBottom: '0.5rem' }}
                    >
                      GST
                    </SoftTypography>
                    <SoftInput
                      type="text"
                      name="gst"
                      // className="box"
                      value={x.gst}
                      onChange={(e) => handleGstChange(e, i)}
                    />
                  </SoftBox>
                  <SoftBox className="soft-corner-box" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <SoftTypography
                      component="label"
                      variant="caption"
                      textTransform="capitalize"
                      fontSize="13px"
                      sx={{ marginBottom: '0.5rem' }}
                    >
                      Discount
                    </SoftTypography>
                    <SoftInput
                      type="number"
                      name="discount"
                      // className="box"
                      placeholder="e.g. 10 %"
                      value={x.discount}
                      onChange={(e) => handleDiscount(e, i)}
                    />
                  </SoftBox>
                  <SoftBox className="soft-corner-box" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <SoftTypography
                      component="label"
                      variant="caption"
                      textTransform="capitalize"
                      fontSize="13px"
                      sx={{ marginBottom: '0.5rem' }}
                    >
                      Product Price
                    </SoftTypography>
                    <SoftInput
                      type="number"
                      name="vendorProductPrice"
                      // className="box"
                      readOnly={true}
                      value={inputlist[i]['vendorProductPrice']}
                    />
                  </SoftBox>

                  <SoftBox className="close-icons">
                    <CloseIcon
                      className="close"
                      onClick={() => handleRemove(x, i)}
                      style={{ cursor: 'pointer', marginTop: '20px', color: '#0562FB' }}
                    />
                  </SoftBox>
                </SoftBox>
              );
            })}
            <Button
              onClick={handleClick}
              className="add-button-vendor"
              style={{ textTransform: 'capitalize', color: '#0562FB' }}
            >
              + Add More Items
            </Button>

            {loader && <Spinner />}

            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <SoftBox className="form-button-customer">
                {/* <SoftButton className="form-button-cancel" >Cancel</SoftButton> */}
                <SoftButton className="vendor-add-btn" onClick={addProtfolio}>
                  <AddIcon />
                  Add
                </SoftButton>
              </SoftBox>
            </Grid>
          </SoftBox>
        </SoftTypography>
      </SoftBox>
    </>
  );
};
