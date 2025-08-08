import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import EastIcon from '@mui/icons-material/East';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import LocalParkingRoundedIcon from '@mui/icons-material/LocalParkingRounded';
import PercentIcon from '@mui/icons-material/Percent';
import SouthIcon from '@mui/icons-material/South';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  TextareaAutosize,
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
import {
  createDynamicCoupon,
  getAllBrands,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
  getAllManufacturerV2,
  getAllProductSuggestionV2,
  getLocationwarehouseData,
  getRetailUserLocationDetails,
  previPurchasePrice,
} from '../../../../config/Services';
import { useSoftUIController } from '../../../../context';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { isSmallScreen } from '../../Common/CommonFunction';
import SoftAsyncPaginate from '../../../../components/SoftSelect/SoftAsyncPaginate';

const CreateDynamicCouponForm = () => {
  const isMobileDevice = isSmallScreen();
  const [steps, setSteps] = useState(1);
  const [selectedOptionProduct, setSelectedOptionProduct] = useState('');
  const navigate = useNavigate();

  const [productIds, setProductIds] = useState([]);

  const [mainCate, setMainCate] = useState('');
  const [mainCatVal, setMainCatVal] = useState('');
  const [catLevel1, setCatLevel1] = useState('');
  const [catLevel1Val, setCatLevel1Val] = useState('');
  const [catLevel2, setCatLevel2] = useState('');
  const [catLevel2Val, setCatLevel2Val] = useState('');
  const [brandName, setBrandName] = useState('');
  const [brandNameVal, setBrandNameVal] = useState('');
  const [manuName, setManuName] = useState('');
  const [manuNameVal, setManuNameVal] = useState('');
  const [mainCatOption, setMainCatOption] = useState([]);
  const [catLevel1Option, setCatLevel1Option] = useState([]);
  const [catLevel2Option, setCatLevel2Option] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [manuOption, setManuOption] = useState([]);

  const [budget, setBudget] = useState();

  const [mainCatRed, setMainCatRed] = useState('');
  const [catLevel1Red, setCatLevel1Red] = useState('');
  const [catLevel2Red, setCatLevel2Red] = useState('');
  const [brandNameRed, setBrandNameRed] = useState('');
  const [manuNameRed, setManuNameRed] = useState('');
  const [mainCatRedVal, setMainCatRedVal] = useState('');
  const [catLevel1RedVal, setCatLevel1RedVal] = useState('');
  const [catLevel2RedVal, setCatLevel2RedVal] = useState('');
  const [brandNameRedVal, setBrandNameRedVal] = useState('');
  const [manuNameRedVal, setManuNameRedVal] = useState('');

  const [selectedDiscountOption, setSelectedDiscountOption] = useState([]);
  const [selectedDiscountType, setSelectedDiscountType] = useState('');
  const [amount, setAmount] = useState();
  const [percent, setPercent] = useState();
  const [flatPrice, setFlatPrice] = useState();
  const [discountUptoForPercent, setDiscountUptoForPercent] = useState();
  const [validityRew, setValidityRew] = useState();

  const [minCartVaue, setMinCartValue] = useState();
  const [maxUsage, setMaxUsage] = useState();
  const [locOp, setLocOp] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedLocationV, setSelectedLocationV] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptionLimit, setSelectedOptionLimit] = useState('');

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Adding 1 because month starts from
  const endMonth = String(today.getMonth() + 2).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  const endFormattedDate = `${year}-${endMonth}-${day}`;

  const [endDate, setEndDate] = useState(endFormattedDate);
  const [startDate, setStartDate] = useState(formattedDate);
  const [renderKey, setRenderKey] = useState(0);
  const [loader, setLoader] = useState(false);
  const [validTimeFrom, setValidTimeFrom] = useState('00:00:00');

  const [validTimeUpto, setValidTimeUpto] = useState('23:59:00');

  const [couponLimit, setCouponLimit] = useState(1);

  const [selectedCustomerType, setSelectedCustomerType] = useState([]);

  const [selectedChannelOptions, setSelectedChannelOptions] = useState([]);
  const [selectedOptionforPhone, setSelectedOptionforPhone] = useState('');
  const [selectedOptionforOTP, setSelectedOptionforOTP] = useState('');
  const [terms, setTerms] = useState('');

  const [selectedOptionforBarcode, setSelectedOptionforBarcode] = useState('');
  const [couponTitle, setCouponTitle] = useState('');
  const [couponDescription, setCouponDescription] = useState('');

  const [selectedOptionForRedeeming, setSelectedOptionForRedeeming] = useState('');
  const [minCartValueRed, setMinCartValueRed] = useState();

  const [issueCart, setIssueCart] = useState();
  const [redCart, setRedCart] = useState();

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const contextType = localStorage.getItem('contextType');

  const showSnackbar = useSnackbar();

  const [inputlist, setInputlist] = useState([]);
  const [autoCompleteDetailsRowIndex, setAutoCompleteDetailsRowIndex] = useState([0]);
  const [autoCompleteDetailsRowIndex1, setAutoCompleteDetailsRowIndex1] = useState([0]);
  const [autoCompleteDetailsRowIndex2, setAutoCompleteDetailsRowIndex2] = useState([0]);
  const [inputlist1, setInputlist1] = useState([
    {
      prodOptions: [],
      itemCode: '',
      spec: '',
      quantityOrdered: 0,
      previousPurchasePrice: 0,
      TotalAmtQty: 0,
      unit: '',
      preferredVendor: '',
      offerType: '',
      discountType: '',
      discountValue: '',
      discountUpto: '',
      itemlabel: 'Item Name',
      speclabel: 'Specification',
      quantilabel: 'Quantity',
      pricelabel: 'Total Amount',
      vendorlabel: 'Offer Type',
    },
  ]);
  const [inputlist2, setInputlist2] = useState([
    {
      prodOptions: [],
      itemCode: '',
      spec: '',
      quantityOrdered: 0,
      previousPurchasePrice: 0,
      TotalAmtQty: 0,
      unit: '',
      preferredVendor: '',
      offerType: '',
      discountType: '',
      discountValue: '',
      discountUpto: '',
      itemlabel: 'Item Name',
      speclabel: 'Specification',
      quantilabel: 'Quantity',
      pricelabel: 'Total Amount',
      vendorlabel: 'Offer Type',
    },
  ]);

  // retrieving the inputList from softUiContext
  const [controller, dispatch] = useSoftUIController();
  const { itemList } = controller;

  //getting item data from context
  useEffect(() => {
    setInputlist(itemList.data);

    if (!isMobileDevice) {
      setAutoCompleteDetailsRowIndex((prev) => [...itemList.imputListIndexArray, ...prev]);
    } else {
      setAutoCompleteDetailsRowIndex((prev) => [...itemList.imputListIndexArray]);
    }
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    // const list = JSON.parse(JSON.stringify(inputlist));
    const list = [...inputlist];
    list[index][name] = value;
    setInputlist(list);
  };

  const handleChange1 = (e, index) => {
    const { name, value } = e.target;
    // const list = JSON.parse(JSON.stringify(inputlist));
    const list = [...inputlist1];
    list[index][name] = value;
    setInputlist1(list);
  };
  const handleChange2 = (e, index) => {
    const { name, value } = e.target;
    // const list = JSON.parse(JSON.stringify(inputlist));
    const list = [...inputlist2];
    list[index][name] = value;
    setInputlist2(list);
  };

  const handleOptionChange2 = (option, index) => {
    const list = [...inputlist2];
    const name = 'discountType';
    // Ensure that the index is within bounds before modifying the array
    if (index >= 0 && index < list.length) {
      list[index][name] = option.value;
      setInputlist2(list);
    }
  };

  const selectProduct1 = (item, index) => {
    const list = [...inputlist1];
    list[index].itemCode = item.variant?.barcodes?.[0];
    list[index].itemName = item.name;
    // list[index].itemName = item.name;
    list[index].spec =
      item?.variant?.weightUnit !== null ? item?.variant?.weightUnit + ' ' + item?.variant?.weight : '';
    list[index].unit = item?.variant?.weightUnit !== null ? item?.variant.weightUnit : '';
    list[index].finalPrice = item?.variant?.mrpData?.[0]?.mrp;
    list[index].gst = item?.taxReference?.taxRate;

    setInputlist1(list);

    setAutoCompleteDetailsRowIndex1((prev) => [...prev, index]);
  };
  const selectProduct2 = (item, index) => {
    const list = [...inputlist2];
    list[index].itemCode = item.variant?.barcodes?.[0];
    list[index].itemName = item.name;
    // list[index].itemName = item.name;
    list[index].spec =
      item?.variant?.weightUnit !== null ? item?.variant?.weightUnit + ' ' + item?.variant?.weight : '';
    list[index].unit = item?.variant?.weightUnit !== null ? item?.variant.weightUnit : '';
    list[index].finalPrice = item?.variant?.mrpData?.[0]?.mrp;
    list[index].gst = item?.taxReference?.taxRate;

    setInputlist2(list);

    setAutoCompleteDetailsRowIndex2((prev) => [...prev, index]);
  };

  const handleChangeIO1 = (e, index) => {
    const searchText = e.target.value;
    const isNumber = !isNaN(+searchText);
    const filterObject = {
      page: 1,
      pageSize: '100',
      productStatuses: ['CREATED'],
      storeLocations: [locId],
      flattenResponse: true,
    };
    // if (contextType === 'RETAIL') {
    //   filterObject.supportedStore = ['TWINLEAVES', orgId];
    // } else if (contextType === 'WMS') {
    //   filterObject.supportedWarehouse = ['TWINLEAVES', orgId];
    // } else if (contextType === 'VMS') {
    //   payload.marketPlaceSeller = ['TWINLEAVES', orgId];
    // }
    // if (isNumber) {
    //   filterObject.gtin = [searchText];
    // } else {
    //   filterObject.names = [searchText];
    // }
    filterObject.query = searchText;
    if (searchText?.length >= 3) {
      //   setLoader(true);
      getAllProductSuggestionV2(filterObject).then(function (response) {
        const list = [...inputlist1];
        list[index].prodOptions = response.data.data.data.data;
        setInputlist1(list);
      });
    } else if (searchText == 0) {
      const list = [...inputlist1];
      list[index].prodOptions = [];
      setInputlist1(list);
    }
  };

  const handleChangeIO = (e, index) => {
    const searchText = e.target.value;
    const isNumber = !isNaN(+searchText);
    const filterObject = {
      page: 1,
      pageSize: '100',
      productStatuses: ['CREATED'],
      storeLocations: [locId],
      flattenResponse: true,
    };
    // if (contextType === 'RETAIL') {
    //   filterObject.supportedStore = ['ALL', orgId];
    // } else if (contextType === 'WMS') {
    //   filterObject.supportedWarehouse = ['ALL', orgId];
    // } else if (contextType === 'VMS') {
    //   payload.marketPlaceSeller = ['TWINLEAVES', orgId];
    // }
    // if (isNumber) {
    //   filterObject.gtin = [searchText];
    // } else {
    //   filterObject.names = [searchText];
    // }
    filterObject.query = searchText;
    if (searchText.length >= 3) {
      getAllProductSuggestionV2(filterObject).then(function (response) {
        const list = [...inputlist];
        // const list = JSON.parse(JSON.stringify(inputlist));

        if (response?.data?.data?.data?.data?.length === 0) {
          const data = [
            {
              gtin: '',
              name: '',
              purchaseIndentData: {},
            },
          ];
          if (isNumber) {
            data[0].gtin = `Add Product ${searchText}`;
          } else {
            data[0].name = `Add Product ${searchText}`;
          }
          list[index].prodOptions = [...data];
          setInputlist(list);
        } else {
          list[index].prodOptions = response?.data?.data?.data?.data;
          setInputlist(list);
        }
      });
    } else if (searchText == 0) {
      const list = [...inputlist];
      // const list = JSON.parse(JSON.stringify(inputlist));
      list[index].prodOptions = [];
      setInputlist(list);
    }
  };

  const handleChangeIO2 = (e, index) => {
    const searchText = e.target.value;
    const isNumber = !isNaN(+searchText);
    const filterObject = {
      page: 1,
      pageSize: '100',
      productStatuses: ['CREATED'],
      storeLocations: [locId],
      flattenResponse: true,
    };
    // if (contextType === 'RETAIL') {
    //   filterObject.supportedStore = ['TWINLEAVES', orgId];
    // } else if (contextType === 'WMS') {
    //   filterObject.supportedWarehouse = ['TWINLEAVES', orgId];
    // } else if (contextType === 'VMS') {
    //   payload.marketPlaceSeller = ['TWINLEAVES', orgId];
    // }
    // if (isNumber) {
    //   filterObject.gtin = [searchText];
    // } else {
    //   filterObject.names = [searchText];
    // }
    if (searchText?.length >= 3) {
      //   setLoader(true);
      getAllProductSuggestionV2(filterObject).then(function (response) {
        const list = [...inputlist2];
        list[index].prodOptions = response?.data?.data?.data?.data;
        setInputlist2(list);
      });
    } else if (searchText == 0) {
      const list = [...inputlist2];
      list[index].prodOptions = [];
      setInputlist2(list);
    }
  };

  const selectProduct = (item, index) => {
    // setItemLoader(true)
    const listNewIndex = inputlist.length - 1 + 1;

    const list = [...inputlist];
    // const list = JSON.parse(JSON.stringify(inputlist));
    // list[index].itemCode = item.variant?.barcodes?.[0];
    list[index].itemCode = item.variant?.barcodes?.[0];
    list[index].itemName = item.name;
    // list[index].itemName = item.name;
    list[index].spec =
      item?.variant?.weightUnit !== null ? item?.variant?.weightUnit + ' ' + item?.variant?.weight : '';
    list[index].unit = item?.variant?.weightUnit !== null ? item?.variant.weightUnit : '';
    list[index].finalPrice = item?.variant?.mrpData?.[0]?.mrp;
    list[index].gst = item?.taxReference?.taxRate;

    previPurchasePrice(item.variant?.barcodes?.[0], orgId).then((response) => {
      const quantityStr = response.data.data.quantityOrdered;
      const floatNumber = parseFloat(quantityStr);
      const integerNumber = Math.floor(floatNumber);

      const updatedItem = {
        ...list[index],
        previousPurchasePrice: response.data.data.previousPurchasePrice,
        quantityOrdered: integerNumber || 'NA',
      };
      list[index] = updatedItem;
      setInputlist(list);
    });
    setAutoCompleteDetailsRowIndex((prev) => [listNewIndex, ...prev]);
  };

  const handleClick = () => {
    setInputlist2((prevInputlist) => [
      ...prevInputlist,
      {
        prodOptions: [],
        itemCode: '',
        spec: '',
        quantityOrdered: 1,
        previousPurchasePrice: 0,
        TotalAmtQty: 0,
        unit: '',
        preferredVendor: '',
        offerType: '',
        discountType: '',
        discountValue: '',
        discountUpto: '',
        itemlabel: 'Item Name',
        speclabel: 'Specification',
        quantilabel: 'Quantity',
        pricelabel: 'Total Amount',
        vendorlabel: 'Offer Type',
      },
    ]);
  };

  const handleRemove = (e, item, index) => {
    e.stopPropagation();
    const newList = [...inputlist2.filter((e, i) => i !== index)];
    setInputlist2(newList);
    const newSelectAuto = [];
    const list = [...inputlist2];

    for (let i = 0; i < inputlist2.length; i++) {
      newSelectAuto.unshift(i);
    }
    setAutoCompleteDetailsRowIndex2((prev) => [...newSelectAuto]);

    const list1 = [...productIds];
    list1.splice(index, 1);
    setProductIds(list1);
  };

  useEffect(() => {
    handleMainCategory();
    handleBrand();
    handleManufacturer();
  }, []);

  const handleBrand = () => {
    const payload = {
      page: 1,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
    };
    getAllBrands(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.brandId,
              label: e?.brandName,
            })),
          );
          setBrandOption(arr[0]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleBrandRed = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
    };
    try {
      const res = await getAllBrands(payload);
      const data = res?.data?.data?.results || [];

      const brandsArr = data?.map((e) => ({
        value: e?.brandId,
        label: e?.brandName,
      }));

      return {
        options: brandsArr,
        hasMore: data?.length >= 50, // Check if there are more results
        additional: { page: page + 1 }, // Increment page for the next load
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const handleManufacturer = () => {
    const payload = {
      page: 1,
      pageSize: 20,
      sourceId: [orgId],
      sourceLocationId: [locId],
    };
    getAllManufacturerV2(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.brandId,
              label: e?.brandName,
            })),
          );
          setManuOption(arr[0]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleMainCategory = () => {
    const payload = {
      page: 1,
      pageSize: 100,
    };
    getAllMainCategory(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.mainCategoryId,
              label: e?.categoryName,
            })),
          );
          setMainCatOption(arr[0]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleCatLevel1 = (e) => {
    setMainCate(e.label);
    setMainCatVal(e.value);
    const payload = {
      page: 1,
      pageSize: 100,
      mainCategoryId: [e.value],
    };
    getAllLevel1Category(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.level1Id,
              label: e?.categoryName,
            })),
          );
          setCatLevel1Option(arr[0]);
          setCatLevel2Option([]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleCatLevel1Red = (e) => {
    setMainCatRed(e.label);
    setMainCatRedVal(e.value);
    const payload = {
      page: 1,
      pageSize: 100,
      mainCategoryId: [e.value],
    };
    getAllLevel1Category(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.level1Id,
              label: e?.categoryName,
            })),
          );
          setCatLevel1Option(arr[0]);
          setCatLevel2Option([]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleCatLevel2Red = (e) => {
    setCatLevel1Red(e.label);
    setCatLevel1RedVal(e.value);
    const payload = {
      page: 1,
      pageSize: 100,
      level1Id: [e.value],
    };
    getAllLevel2Category(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.level2Id,
              label: e?.categoryName,
            })),
          );
          setCatLevel2Option(arr[0]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleCatLevel2 = (e) => {
    setCatLevel1(e.label);
    setCatLevel1Val(e.value);
    const payload = {
      page: 1,
      pageSize: 100,
      level1Id: [e.value],
    };
    getAllLevel2Category(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.level2Id,
              label: e?.categoryName,
            })),
          );
          setCatLevel2Option(arr[0]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleRadioChangeProduct = (event) => {
    setSelectedOptionProduct(event.target.value);
  };

  const handleRadioChangeProductRedeeming = (event) => {
    setSelectedOptionForRedeeming(event.target.value);
  };

  const discountOptions = ['Discount in Rupees or Percentage', 'Offer product'];

  const handleDiscountChange = (discount) => {
    if (selectedDiscountOption.includes(discount)) {
      // If platform is already selected, remove it
      setSelectedDiscountOption((prevSelected) => prevSelected.filter((selected) => selected !== discount));
    } else {
      // If platform is not selected, add it
      setSelectedDiscountOption((prevSelected) => [...prevSelected, discount]);
    }
  };

  const handleRadioChangeLimit = (event) => {
    setSelectedOptionLimit(event.target.value);
  };

  const validityOptions = [
    {
      label: '30 days',
      value: 30,
    },
    {
      label: '60 days',
      value: 60,
    },
    {
      label: 'Custom',
      value: 'custom',
    },
  ];

  const [openCustomValidity, setOpenCustomValidity] = useState(false);

  const handleValidityChange = (option) => {
    if (option.value === 'custom') {
      setOpenCustomValidity(true);
    } else {
      setValidityRew(option.value);
      setOpenCustomValidity(false);
    }
  };

  useEffect(() => {
    if (contextType == 'RETAIL') {
      getRetailUserLocationDetails(orgId).then((res) => {
        const loc = res?.data?.data?.branches.map((e) => {
          return {
            value: e.branchId,
            label: e.displayName,
          };
        });
        setLocOp(loc);
      });
    } else if (contextType == 'WMS') {
      getLocationwarehouseData(orgId).then((res) => {
        const loc = res?.data?.data?.locationDataList.map((e) => {
          return {
            value: e.locationId,
            label: e.locationName,
          };
        });
        setLocOp(loc);
      });
    }
  }, []);

  const handleAutocompleteChange = (event, options) => {
    // If "All" is selected, set all locations as selected
    const allLocations = locOp.map((option) => option.label);
    const newSelectedLocation = options.map((option) => option.label);
    const allLocationsV = locOp.map((option) => option.value);
    const newSelectedLocationV = options.map((option) => option.value);
    setSelectedLocation(newSelectedLocation.includes('All') ? allLocations : newSelectedLocation);
    setSelectedLocationV(newSelectedLocationV.includes('All') ? allLocationsV : newSelectedLocationV);
  };

  const platFormOptions = ['RMS', 'POS', 'APP'];
  const channelOptions = ['SMS', 'EMAIL', 'WHATSAPP', 'PUSH', 'PRINT ON BILL'];
  const customerOptions = ['First Time customers only', 'Less than 1 month', 'Less than 6 months', 'All Customers'];

  const handlePlatformChange = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms((prevSelected) => prevSelected.filter((selected) => selected !== platform));
    } else {
      setSelectedPlatforms((prevSelected) => [...prevSelected, platform]);
    }
  };

  const handleCustomerChange = (customer) => {
    if (selectedCustomerType.includes(customer)) {
      setSelectedCustomerType((prevSelected) => prevSelected.filter((selected) => selected !== customer));
    } else {
      setSelectedCustomerType((prevSelected) => [...prevSelected, customer]);
    }
  };

  const handleChannelChange = (platform) => {
    if (selectedChannelOptions.includes(platform)) {
      setSelectedChannelOptions((prevSelected) => prevSelected.filter((selected) => selected !== platform));
    } else {
      setSelectedChannelOptions((prevSelected) => [...prevSelected, platform]);
    }
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleTimeChange = (event) => {
    setValidTimeFrom(event.target.value);
  };

  const handleTimeUptoChange = (event) => {
    setValidTimeUpto(event.target.value);
  };

  const handleRadioChangeforPhone = (event) => {
    setSelectedOptionforPhone(event.target.value);
  };
  const handleRadioChangeforOTP = (event) => {
    setSelectedOptionforOTP(event.target.value);
  };

  const handleRadioChangeforBarcode = (event) => {
    setSelectedOptionforBarcode(event.target.value);
  };

  const daysMapping = {
    'First Time customers only': [0],
    'Less than 1 month': [30],
    'Less than 6 months': [180],
    'All Customers': [999],
  };

  // Function to calculate days to add based on selected customer types
  const calculateDaysToAdd = (selectedCustomerType) => {
    let daysToAdd = [];

    selectedCustomerType.forEach((customer) => {
      daysToAdd = [...daysToAdd, ...daysMapping[customer]];
    });

    // Remove duplicates and sort the array
    daysToAdd = [...new Set(daysToAdd)].sort((a, b) => a - b);

    return daysToAdd;
  };

  const discountFreeBieOptions = [
    {
      label: 'Free',
      value: 'FREE',
    },
    {
      label: 'By Percentage',
      value: 'PERCENTAGE',
    },
    {
      label: 'By Amount',
      value: 'FLAT_OFF',
    },
  ];

  const handleCreateCoupon = () => {
    const locArr = [];
    setLoader(true);

    selectedLocationV.forEach((e) => {
      locArr.push(e);
    });

    if (
      selectedOptionProduct === '' ||
      couponTitle === '' ||
      locArr.length === 0 ||
      selectedPlatforms.length === 0 ||
      !validityRew ||
      !couponLimit ||
      !maxUsage
    ) {
      showSnackbar('Please fill all the required fields', 'warning');
      return;
    }

    let notifyChannels = [];
    if (selectedChannelOptions.includes('PRINT ON BILL')) {
      notifyChannels.push('PRINT_ON_BILL'); // Add 'PRINT_ON_BILL' to notify array
      // Add other selected channels
      selectedChannelOptions.forEach((option) => {
        if (option !== 'PRINT ON BILL') {
          notifyChannels.push(option);
        }
      });
    } else {
      notifyChannels = selectedChannelOptions; // Use selectedChannelOptions as is
    }

    const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;

    const freebieItemList = [];

    if (inputlist2[0].itemCode !== '') {
      const itemsToBeAdded = inputlist2.map((item) => {
        return {
          itemCode: item.itemCode,
          quantity: parseFloat(item.quantityOrdered) || 0,
          freebieType: item.discountType === 'PERCENTAGE' || item.discountType === 'FLAT_OFF' ? 'DISCOUNT' : 'FREE',
          discountType: item.discountType || 'NONE',
          discountValue: parseFloat(item.discountValue) || 0,
          discountUpto: parseFloat(item.discountUpto) || 0,
        };
      });

      freebieItemList.push(...itemsToBeAdded);
    }
    const payload = {
      configType:
        selectedOptionProduct === 'Cart'
          ? 'CART_VALUE'
          : selectedOptionProduct === 'Category'
          ? 'CATEGORY'
          : selectedOptionProduct === 'Product'
          ? 'PRODUCT'
          : selectedOptionProduct === 'Manufacturer'
          ? 'MANUFACTURER'
          : selectedOptionProduct === 'Brand'
          ? 'BRAND'
          : null,
      offerName: couponTitle,
      // newUser: selectedOptionNewUser === 'Yes' ? true : false,
      description: couponDescription,
      termsAndConditions: terms,
      sourceLocationId: locId,
      sourceOrgType: contextType,
      sourceOrgId: orgId,
      minOrderValue: minCartVaue || 0,
      generateCouponLimit: couponLimit || 0,
      validDays: validityRew || 0,
      maxUsagePerUser: maxUsage || 0,
      rewardingMinOrderValue: minCartValueRed || 0,
      rewardingDiscountType:
        selectedDiscountType === 'Amount'
          ? 'FLAT_OFF'
          : selectedDiscountType === 'Percentage'
          ? 'PERCENTAGE'
          : selectedDiscountType === 'FLAT_PRICE'
          ? 'FLAT_OFF'
          : 'NONE',
      rewardingDiscountValue:
        selectedDiscountType === 'Amount'
          ? amount || 0
          : selectedDiscountType === 'Percentage'
          ? percent || 0
          : selectedDiscountType === 'FLAT_PRICE'
          ? flatPrice || 0
          : 0,
      rewardingDiscountUpto: discountUptoForPercent || 0,
      redeemingOnType: false,
      rewardingOnType: false,
      rewardingCouponType:
        selectedOptionForRedeeming === 'Cart'
          ? 'CART_VALUE'
          : selectedOptionForRedeeming === 'Category'
          ? 'CATEGORY'
          : selectedOptionForRedeeming === 'Product'
          ? 'PRODUCT'
          : selectedOptionForRedeeming === 'Manufacturer'
          ? 'MANUFACTURER'
          : selectedOptionForRedeeming === 'Brand'
          ? 'BRAND'
          : null,
      channels: selectedPlatforms,
      applicableLocation: locArr,
      applicableMainCategory: mainCate ? [mainCate] : [],
      applicableCategory1: catLevel1 ? [catLevel1] : [],
      applicableCategory2: catLevel2 ? [catLevel2] : [],
      applicableBrand: brandName ? [brandName] : [],
      applicableManufacturer: manuName ? [manuName] : [],
      mainCategory: mainCatRed ? [mainCatRed] : [],
      category1: catLevel1Red ? [catLevel1Red] : [],
      category2: catLevel2Red ? [catLevel2Red] : [],
      brand: brandNameRed ? [brandNameRed] : [],
      manufacturer: manuNameRed ? [manuNameRed] : [],
      freebieItemConfigList: inputlist[0].itemCode
        ? [
            {
              itemCode: inputlist[0].itemCode,
              quantity: parseFloat(inputlist[0].quantityOrdered) || 0,
              minCartValue: issueCart || 0,
            },
          ]
        : [],
      freebieItemRewardList: inputlist2.length > 0 ? freebieItemList : [],
      staticItemList: inputlist1[0].itemCode
        ? [
            {
              itemCode: inputlist1[0].itemCode,
              quantity: parseFloat(inputlist1[0].quantityOrdered) || 0,
              minCartValue: redCart || 0,
            },
          ]
        : [],
      notify: notifyChannels,
      validPeriodExist: true,
      validFrom: startDate,
      validTo: endDate,
      validTimeFrom: validTimeFrom,
      validTimeTo: validTimeUpto,
      printWithBill: selectedChannelOptions.includes('PRINT ON BILL') ? true : false,
      combined: selectedOption === 'Yes' ? true : false,
      discountIncrement: 0,
      mobileNoRequired: selectedOptionforPhone === 'Yes' ? true : false,
      otpRedemption: selectedOptionforOTP === 'Yes' ? true : false,
      createdBy: uidx,
      enableWithBarCode: selectedOptionforBarcode === 'Yes' ? true : false,
      maxBudget: budget || 0,
      customerAge: calculateDaysToAdd(selectedCustomerType),
    };

    createDynamicCoupon(payload)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          setLoader(false);
          showSnackbar('Coupon Created Successfully', 'success');
          setTimeout(() => {
            navigate('/marketing/Coupons');
          }, 2000);
        } else {
          setLoader(false);
          showSnackbar(res?.data?.data?.message, 'error');
        }
      })
      .catch((err) => {
        setLoader(false);
        if (err?.message === 'Request failed with status code 400') {
          showSnackbar('Invalid max usage per customer', 'error');
        } else {
          showSnackbar(err?.message, 'error');
        }
      });
  };

  const handleNextClick = () => {
    setSteps((prevSteps) => (prevSteps < 4 ? prevSteps + 1 : prevSteps));
    if (steps === 3 && selectedCustomerType.length === 0) {
      showSnackbar('As no customer type is selected, the coupon will be applicable for all customers', 'warning');
    }
  };

  const handleStep4 = () => {
    setSteps(4);
    if (steps === 3 && selectedCustomerType.length === 0) {
      showSnackbar('As no customer type is selected, the coupon will be applicable for all customers', 'warning');
    }
  };

  const brandSelectRed = (
    <Box className="all-products-filter-product">
      <SoftAsyncPaginate
        className="all-products-filter-soft-select-box"
        placeholder="Brands"
        name="brand"
        loadOptions={(searchQuery, loadedOptions, additional) => handleBrandRed(searchQuery, loadedOptions, additional)}
        additional={{ page: 1 }} // Start with page 1
        value={brandNameRed ? { value: brandNameRedVal, label: brandNameRed } : { value: '', label: 'Select Brand' }}
        onChange={(option) => {
          setBrandNameRed(option?.label);
          setBrandNameRedVal(option?.value);
        }}
      />
    </Box>
  );

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <Box className="table-css-fix-box-scroll-vend" id="dynamic-coupon-creation-box">
          <SoftBox py={0} px={0}>
            <Grid container spacing={4}>
              <Grid item lg={12} sm={12} md={12} xs={12}>
                <SoftBox className="dynamic-coupon-creation-main-box">
                  <SoftButton
                    className="vendor-second-btn-2"
                    onClick={() => setSteps((prevSteps) => (prevSteps > 1 ? prevSteps - 1 : prevSteps))}
                    disabled={steps === 1}
                  >
                    <KeyboardBackspaceIcon />
                  </SoftButton>

                  <SoftButton className="vendor-add-btn-1" onClick={handleNextClick} disabled={steps === 4}>
                    <EastIcon />
                  </SoftButton>
                </SoftBox>
                <SoftBox style={{ paddingBottom: '10px' }}>
                  <div className="stepper-wrapper">
                    <div
                      onClick={() => setSteps(1)}
                      className={
                        steps === 1 ? 'stepper-item active' : steps > 1 ? 'stepper-item completed' : 'stepper-item'
                      }
                    >
                      <div className="step-counter">1</div>
                    </div>
                    <div
                      onClick={() => setSteps(2)}
                      className={
                        steps === 2 ? 'stepper-item active' : steps > 2 ? 'stepper-item completed' : 'stepper-item'
                      }
                    >
                      <div className="step-counter">2</div>
                    </div>
                    <div
                      onClick={() => setSteps(3)}
                      className={
                        steps === 3 ? 'stepper-item active' : steps > 3 ? 'stepper-item completed' : 'stepper-item'
                      }
                    >
                      <div className="step-counter">3</div>
                    </div>
                    <div className={steps === 4 ? 'stepper-item active' : 'stepper-item'} onClick={handleStep4}>
                      <div className="step-counter">4</div>
                    </div>
                  </div>
                </SoftBox>
                <hr />
                {steps === 1 && (
                  <>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">
                        Select the coupon type <span className="dynamic-coupon-imp">*</span>
                      </Typography>
                      <SoftBox>
                        <div>
                          <input
                            type="radio"
                            id="scheduleYes"
                            name="scheduleGroup"
                            value="Cart"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionProduct === 'Cart'}
                            onChange={handleRadioChangeProduct}
                          />
                          <label htmlFor="scheduleYes" className="dynamic-coupon-label-typo">
                            By Cart Value
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="scheduleYes"
                            name="scheduleGroup"
                            value="Product"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionProduct === 'Product'}
                            onChange={handleRadioChangeProduct}
                          />
                          <label htmlFor="scheduleYes" className="dynamic-coupon-label-typo">
                            By Product
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="scheduleNo"
                            name="scheduleGroup"
                            value="Category"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionProduct === 'Category'}
                            onChange={handleRadioChangeProduct}
                          />
                          <label htmlFor="scheduleNo" className="dynamic-coupon-label-typo">
                            By Category
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="scheduleNo1"
                            name="scheduleGroup"
                            value="Brand"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionProduct === 'Brand'}
                            onChange={handleRadioChangeProduct}
                          />
                          <label htmlFor="scheduleNo1" className="dynamic-coupon-label-typo">
                            By Brand
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="scheduleNo2"
                            name="scheduleGroup"
                            value="Manufacturer"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionProduct === 'Manufacturer'}
                            onChange={handleRadioChangeProduct}
                          />
                          <label htmlFor="scheduleNo2" className="dynamic-coupon-label-typo">
                            By Manufacturer
                          </label>
                        </div>
                      </SoftBox>
                    </SoftBox>
                  </>
                )}
                {steps === 2 && (
                  <div className="dynamic-coupon-padding">
                    <Typography className="dynamic-coupon-creation-main-heading">
                      Issue Criteria{' '}
                      <Tooltip
                        title="Coupon issuance criteria specify the conditions or requirements that must be met for the
                      distribution of coupons"
                        placement="top"
                      >
                        <IconButton>
                          <InfoIcon sx={{ fontSize: '15px' }} />
                        </IconButton>
                      </Tooltip>
                    </Typography>

                    {selectedOptionProduct === 'Category' ? (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Choose the {selectedOptionProduct}
                        </Typography>
                        <SoftBox className="dynamic-coupon-filter-box2">
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Main Category</Typography>
                            {mainCate ? (
                              <TextField
                                value={mainCate}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={mainCatOption}
                                onChange={(e) => handleCatLevel1(e)}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Category Level 1</Typography>
                            {catLevel1 ? (
                              <TextField
                                value={catLevel1}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel1Option}
                                // value={catLevel1}
                                onChange={(e) => handleCatLevel2(e)}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Category Level 2 </Typography>
                            {catLevel2 ? (
                              <TextField
                                value={catLevel2}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel2Option}
                                // value={catLevel2}
                                onChange={(e) => {
                                  setCatLevel2(e.label), setCatLevel2Val(e.value);
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Min Cart Value (Optional)</Typography>
                            <SoftInput
                              placeholder="Minimum Cart Value"
                              type="number"
                              style={{ width: '400px' }}
                              icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                              onChange={(e) => setMinCartValue(parseFloat(e.target.value))}
                            />
                          </div>
                        </SoftBox>
                      </SoftBox>
                    ) : selectedOptionProduct === 'Brand' ? (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Choose the {selectedOptionProduct}
                        </Typography>
                        <SoftBox className="dynamic-coupon-filter-box2">
                          {/* <div>
                            <Typography className="coupon-filter-box2-typo-head">Main Category</Typography>
                            {mainCate ? (
                              <TextField
                                value={mainCate}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={mainCatOption}
                                onChange={(e) => handleCatLevel1(e)}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Category Level 1</Typography>
                            {catLevel1 ? (
                              <TextField
                                value={catLevel1}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel1Option}
                                // value={catLevel1}
                                onChange={(e) => handleCatLevel2(e)}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Category Level 2 </Typography>
                            {catLevel2 ? (
                              <TextField
                                value={catLevel2}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel2Option}
                                // value={catLevel2}
                                onChange={(e) => {
                                  setCatLevel2(e.label), setCatLevel2Val(e.value);
                                }}
                              />
                            )}
                          </div> */}
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Brand </Typography>
                            {brandName ? (
                              <TextField
                                value={brandName}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={brandOption}
                                onChange={(e) => {
                                  setBrandName(e.label), setBrandNameVal(e.value);
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Min Cart Value (Optional)</Typography>
                            <SoftInput
                              placeholder="Minimum Cart Value"
                              type="number"
                              style={{ width: '400px' }}
                              icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                              onChange={(e) => setMinCartValue(parseFloat(e.target.value))}
                            />
                          </div>
                        </SoftBox>
                      </SoftBox>
                    ) : selectedOptionProduct === 'Manufacturer' ? (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Choose the {selectedOptionProduct}
                        </Typography>
                        <SoftBox className="dynamic-coupon-filter-box2">
                          {/* <div>
                            <Typography className="coupon-filter-box2-typo-head">Main Category</Typography>
                            {mainCate ? (
                              <TextField
                                value={mainCate}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={mainCatOption}
                                onChange={(e) => handleCatLevel1(e)}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Category Level 1</Typography>
                            {catLevel1 ? (
                              <TextField
                                value={catLevel1}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel1Option}
                                // value={catLevel1}
                                onChange={(e) => handleCatLevel2(e)}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Category Level 2 </Typography>
                            {catLevel2 ? (
                              <TextField
                                value={catLevel2}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel2Option}
                                // value={catLevel2}
                                onChange={(e) => {
                                  setCatLevel2(e.label), setCatLevel2Val(e.value);
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Brand </Typography>
                            {brandName ? (
                              <TextField
                                value={brandName}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={brandOption}
                                onChange={(e) => {
                                  setBrandName(e.label), setBrandNameVal(e.value);
                                }}
                              />
                            )}
                          </div> */}
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Manufacturer </Typography>
                            {manuName ? (
                              <TextField
                                value={manuName}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={manuOption}
                                onChange={(e) => {
                                  setManuName(e.label), setManuNameVal(e.value);
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Min Cart Value (Optional)</Typography>
                            <SoftInput
                              placeholder="Minimum Cart Value"
                              type="number"
                              style={{ width: '400px' }}
                              icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                              onChange={(e) => setMinCartValue(parseFloat(e.target.value))}
                            />
                          </div>
                        </SoftBox>
                      </SoftBox>
                    ) : selectedOptionProduct === 'Product' ? (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Choose the {selectedOptionProduct}
                        </Typography>
                        <SoftBox className="dynamic-coupon-filter-box2">
                          {inputlist.map((x, i) => {
                            return (
                              <>
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">Barcode</Typography>
                                  {autoCompleteDetailsRowIndex.includes(i) && x.itemCode.length ? (
                                    <TextField value={x.itemCode} readOnly={true} style={{ width: '180px' }} />
                                  ) : (
                                    <Autocomplete
                                      className="search-input"
                                      options={x.prodOptions}
                                      getOptionLabel={(option) => option?.variant?.barcodes?.[0] || ''}
                                      style={{ width: '218px' }}
                                      onChange={(e, v) => {
                                        if (v?.variant?.barcodes?.[0]?.includes('Add')) {
                                          // purchaseIndentDataReduxHandler(v);
                                          navigate('/products/all-products/add-products');
                                        } else {
                                          selectProduct(v, i);
                                        }
                                      }}
                                      onBlur={() => {
                                        handleChangeIO({ target: { value: '' } }, i);
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          value={x.itemCode}
                                          {...params}
                                          onChange={(e) => handleChangeIO(e, i)}
                                          variant="outlined"
                                          name="itemCode"
                                        />
                                      )}
                                    />
                                  )}
                                </div>
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">Item Name</Typography>
                                  {autoCompleteDetailsRowIndex.includes(i) && x.itemName.length ? (
                                    <TextField value={x.itemName} style={{ width: '200px' }} />
                                  ) : (
                                    <Autocomplete
                                      className="search-input"
                                      options={x.prodOptions}
                                      getOptionLabel={(option) => option.name}
                                      style={{ width: '218px' }}
                                      renderInput={(params) => (
                                        <TextField
                                          value={x.itemName}
                                          {...params}
                                          onChange={(e) => handleChangeIO(e, i)}
                                          variant="outlined"
                                          name="itemCode"
                                        />
                                      )}
                                    />
                                  )}
                                </div>

                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">Quantity</Typography>
                                  <SoftInput
                                    type="text"
                                    name="quantityOrdered"
                                    value={x?.quantityOrdered}
                                    onChange={(e) => handleChange(e, i)}
                                  />
                                </div>
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">
                                    Min Cart Value (Optional)
                                  </Typography>
                                  <SoftInput
                                    placeholder="Minimum Cart Value"
                                    type="number"
                                    style={{ width: '400px' }}
                                    icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                                    onChange={(e) => setIssueCart(parseFloat(e.target.value))}
                                  />
                                </div>
                              </>
                            );
                          })}
                        </SoftBox>
                      </SoftBox>
                    ) : selectedOptionProduct === 'Cart' ? (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Choose the minimum {selectedOptionProduct} value{' '}
                          <Tooltip title="Minimum cart value to issue the coupon." placement="top">
                            <IconButton>
                              <InfoIcon sx={{ fontSize: '15px' }} />
                            </IconButton>
                          </Tooltip>{' '}
                          <span className="dynamic-coupon-imp">*</span>
                        </Typography>
                        <SoftInput
                          placeholder="Minimum Cart Value"
                          type="number"
                          style={{ width: '400px' }}
                          icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                          onChange={(e) => setMinCartValue(parseFloat(e.target.value))}
                        />
                      </SoftBox>
                    ) : null}
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">
                        Do you want Mobile No. at the time of coupon issuance.{' '}
                        <Tooltip
                          title="During the use of the coupon code whether phone number is required for verification"
                          placement="top"
                        >
                          <IconButton>
                            <InfoIcon sx={{ fontSize: '15px' }} />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <SoftBox className="dynamic-coupon-gap">
                        <div>
                          <input
                            type="radio"
                            id="scheduleYese"
                            name="scheduleGroupe"
                            value="Yes"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionforPhone === 'Yes'}
                            onChange={handleRadioChangeforPhone}
                          />
                          <label htmlFor="scheduleYese" className="dynamic-coupon-label-typo">
                            Yes
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="scheduleNoe"
                            name="scheduleGroupe"
                            value="No"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionforPhone === 'No'}
                            onChange={handleRadioChangeforPhone}
                          />
                          <label htmlFor="scheduleNoe" className="dynamic-coupon-label-typo">
                            No
                          </label>
                        </div>
                      </SoftBox>
                      {/* <Typography className="dynamic-coupon-label-typo">
                        During the use of the coupon code whether phone number is required for verification
                      </Typography> */}
                    </SoftBox>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">
                        Set Validity for Coupon{' '}
                        <Tooltip
                          title="This validity is set from the day the coupon is rewarded to you."
                          placement="top"
                        >
                          <IconButton>
                            <InfoIcon sx={{ fontSize: '15px' }} />
                          </IconButton>
                        </Tooltip>
                        <span className="dynamic-coupon-imp">*</span>{' '}
                      </Typography>
                      {/* <Typography className="dynamic-coupon-label-typo">
                        Please note this validity is set from the day the coupon is rewarded to you.
                      </Typography> */}
                      <SoftBox className="dynamic-coupon-gap">
                        <SoftSelect
                          placeholder="Choose number of days"
                          options={validityOptions}
                          onChange={(option) => handleValidityChange(option)}
                        ></SoftSelect>
                        {openCustomValidity && (
                          <SoftInput
                            placeholder="Valid days"
                            type="number"
                            onChange={(e) => setValidityRew(parseFloat(e.target.value))}
                          />
                        )}
                      </SoftBox>
                    </SoftBox>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">
                        Maxiumum Budget{' '}
                        <Tooltip title="Maximum Budget for the coupons" placement="top">
                          <IconButton>
                            <InfoIcon sx={{ fontSize: '15px' }} />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <SoftInput
                        placeholder="Maximum Budget"
                        type="number"
                        style={{ width: '400px' }}
                        icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                        onChange={(e) => setBudget(parseFloat(e.target.value))}
                      />
                      {/* <Typography className="dynamic-coupon-label-typo">Maximum Budget to be applied.</Typography> */}
                    </SoftBox>
                    <Typography className="dynamic-coupon-creation-main-heading">Coupon Description</Typography>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <div>
                        <Typography className="dynamic-copupon-form-heading">
                          Coupon Title <span className="dynamic-coupon-imp">*</span>
                        </Typography>
                        <SoftInput
                          placeholder="Coupon Title"
                          value={couponTitle}
                          onChange={(e) => setCouponTitle(e.target.value)}
                        />
                      </div>
                    </SoftBox>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <div>
                        <Typography className="dynamic-copupon-form-heading">Coupon Description</Typography>
                        <SoftInput
                          placeholder="Coupon Description"
                          value={couponDescription}
                          onChange={(e) => setCouponDescription(e.target.value)}
                        />
                      </div>
                    </SoftBox>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">Enabled with Barcode</Typography>
                      <SoftBox className="dynamic-coupon-gap">
                        <div>
                          <input
                            type="radio"
                            id="scheduleYest"
                            name="scheduleGroupt"
                            value="Yes"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionforBarcode === 'Yes'}
                            onChange={handleRadioChangeforBarcode}
                          />
                          <label htmlFor="scheduleYest" className="dynamic-coupon-label-typo">
                            Yes
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="scheduleNot"
                            name="scheduleGroupt"
                            value="No"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionforBarcode === 'No'}
                            onChange={handleRadioChangeforBarcode}
                          />
                          <label htmlFor="scheduleNot" className="dynamic-coupon-label-typo">
                            No
                          </label>
                        </div>
                      </SoftBox>
                    </SoftBox>
                  </div>
                )}
                {steps === 3 && (
                  <div className="dynamic-coupon-padding">
                    <Typography className="dynamic-coupon-creation-main-heading">
                      Redeeming Conditions{' '}
                      <Tooltip
                        title="Coupon redeeming criteria outline the terms and conditions that must be met for customers to
                          successfully utilize or apply their coupons"
                        placement="top"
                      >
                        <IconButton>
                          <InfoIcon sx={{ fontSize: '15px' }} />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    <Typography className="dynamic-copupon-form-heading">
                      Select the type for coupon redemption at next purchase{' '}
                    </Typography>
                    <SoftBox>
                      <div>
                        <input
                          type="radio"
                          id="scheduleYes"
                          name="scheduleGroup"
                          value="Cart"
                          className="dynamic-coupon-marginright-10"
                          checked={selectedOptionForRedeeming === 'Cart'}
                          onChange={handleRadioChangeProductRedeeming}
                        />
                        <label htmlFor="scheduleYes" className="dynamic-coupon-label-typo">
                          By Cart Value
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="scheduleYes"
                          name="scheduleGroup"
                          value="Product"
                          className="dynamic-coupon-marginright-10"
                          checked={selectedOptionForRedeeming === 'Product'}
                          onChange={handleRadioChangeProductRedeeming}
                        />
                        <label htmlFor="scheduleYes" className="dynamic-coupon-label-typo">
                          By Product
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="scheduleNo"
                          name="scheduleGroup"
                          value="Category"
                          className="dynamic-coupon-marginright-10"
                          checked={selectedOptionForRedeeming === 'Category'}
                          onChange={handleRadioChangeProductRedeeming}
                        />
                        <label htmlFor="scheduleNo" className="dynamic-coupon-label-typo">
                          By Category
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="scheduleNo1"
                          name="scheduleGroup"
                          value="Brand"
                          className="dynamic-coupon-marginright-10"
                          checked={selectedOptionForRedeeming === 'Brand'}
                          onChange={handleRadioChangeProductRedeeming}
                        />
                        <label htmlFor="scheduleNo1" className="dynamic-coupon-label-typo">
                          By Brand
                        </label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="scheduleNo2"
                          name="scheduleGroup"
                          value="Manufacturer"
                          className="dynamic-coupon-marginright-10"
                          checked={selectedOptionForRedeeming === 'Manufacturer'}
                          onChange={handleRadioChangeProductRedeeming}
                        />
                        <label htmlFor="scheduleNo2" className="dynamic-coupon-label-typo">
                          By Manufacturer
                        </label>
                      </div>
                    </SoftBox>
                    {selectedOptionForRedeeming === 'Category' ? (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Choose the {selectedOptionForRedeeming}
                        </Typography>
                        <SoftBox className="dynamic-coupon-filter-box2">
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Main Category</Typography>
                            {mainCatRed ? (
                              <TextField
                                value={mainCatRed}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={mainCatOption}
                                onChange={(e) => handleCatLevel1Red(e)}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Category Level 1</Typography>
                            {catLevel1Red ? (
                              <TextField
                                value={catLevel1Red}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel1Option}
                                // value={catLevel1}
                                onChange={(e) => handleCatLevel2Red(e)}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Category Level 2 </Typography>
                            {catLevel2Red ? (
                              <TextField
                                value={catLevel2Red}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel2Option}
                                // value={catLevel2}
                                onChange={(e) => {
                                  setCatLevel2Red(e.label), setCatLevel2RedVal(e.value);
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Min Cart Value (Optional)</Typography>
                            <SoftInput
                              placeholder="Minimum Cart Value"
                              type="number"
                              style={{ width: '400px' }}
                              icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                              onChange={(e) => setMinCartValueRed(parseFloat(e.target.value))}
                            />
                          </div>
                        </SoftBox>
                      </SoftBox>
                    ) : selectedOptionForRedeeming === 'Brand' ? (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Choose the {selectedOptionForRedeeming}
                        </Typography>
                        <SoftBox className="dynamic-coupon-filter-box2">
                          {/* <div>
                            <Typography className="coupon-filter-box2-typo-head">Main Category</Typography>
                            {mainCatRed ? (
                              <TextField
                                value={mainCatRed}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={mainCatOption}
                                onChange={(e) => handleCatLevel1Red(e)}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Category Level 1</Typography>
                            {catLevel1Red ? (
                              <TextField
                                value={catLevel1Red}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel1Option}
                                // value={catLevel1}
                                onChange={(e) => handleCatLevel2Red(e)}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Category Level 2 </Typography>
                            {catLevel2Red ? (
                              <TextField
                                value={catLevel2Red}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel2Option}
                                // value={catLevel2}
                                onChange={(e) => {
                                  setCatLevel2Red(e.label), setCatLevel2RedVal(e.value);
                                }}
                              />
                            )}
                          </div> */}
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Brand </Typography>
                            {brandNameRed ? (
                              <TextField
                                value={brandNameRed}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              // <SoftSelect
                              //   menuPortalTarget={document.body}
                              //   styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                              //   options={brandOption}
                              //   onChange={(e) => {
                              //     setBrandNameRed(e.label), setBrandNameRedVal(e.value);
                              //   }}
                              // />
                              <>{brandSelectRed}</>
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Min Cart Value (Optional)</Typography>
                            <SoftInput
                              placeholder="Minimum Cart Value"
                              type="number"
                              style={{ width: '400px' }}
                              icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                              onChange={(e) => setMinCartValueRed(parseFloat(e.target.value))}
                            />
                          </div>
                        </SoftBox>
                      </SoftBox>
                    ) : selectedOptionForRedeeming === 'Manufacturer' ? (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Choose the {selectedOptionForRedeeming}
                        </Typography>
                        <SoftBox className="dynamic-coupon-filter-box2">
                          {/* <div>
                            <Typography className="coupon-filter-box2-typo-head">Main Category</Typography>
                            {mainCatRed ? (
                              <TextField
                                value={mainCatRed}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={mainCatOption}
                                onChange={(e) => handleCatLevel1Red(e)}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Category Level 1</Typography>
                            {catLevel1Red ? (
                              <TextField
                                value={catLevel1Red}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel1Option}
                                // value={catLevel1}
                                onChange={(e) => handleCatLevel2Red(e)}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Category Level 2 </Typography>
                            {catLevel2Red ? (
                              <TextField
                                value={catLevel2Red}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel2Option}
                                // value={catLevel2}
                                onChange={(e) => {
                                  setCatLevel2Red(e.label), setCatLevel2RedVal(e.value);
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Brand </Typography>
                            {brandNameRed ? (
                              <TextField
                                value={brandNameRed}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={brandOption}
                                onChange={(e) => {
                                  setBrandNameRed(e.label), setBrandNameRedVal(e.value);
                                }}
                              />
                            )}
                          </div> */}
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Manufacturer </Typography>
                            {manuNameRed ? (
                              <TextField
                                value={manuNameRed}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={manuOption}
                                onChange={(e) => {
                                  setManuNameRed(e.label), setManuNameRedVal(e.value);
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <Typography className="coupon-filter-box2-typo-head">Min Cart Value (Optional)</Typography>
                            <SoftInput
                              placeholder="Minimum Cart Value"
                              type="number"
                              style={{ width: '400px' }}
                              icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                              onChange={(e) => setMinCartValueRed(parseFloat(e.target.value))}
                            />
                          </div>
                        </SoftBox>
                      </SoftBox>
                    ) : selectedOptionForRedeeming === 'Product' ? (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Choose the {selectedOptionForRedeeming}
                        </Typography>
                        <SoftBox className="dynamic-coupon-filter-box2">
                          {inputlist1.map((x, i) => {
                            return (
                              <>
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">Barcode</Typography>
                                  {autoCompleteDetailsRowIndex1.includes(i) && x?.itemCode?.length ? (
                                    <TextField value={x.itemCode} readOnly={true} style={{ width: '180px' }} />
                                  ) : (
                                    <Autocomplete
                                      className="search-input"
                                      options={x.prodOptions}
                                      getOptionLabel={(option) => option?.variant?.barcodes?.[0] || ''}
                                      style={{ width: '218px' }}
                                      onChange={(e, v) => {
                                        if (v?.variant?.barcodes?.[0]?.includes('Add')) {
                                          // purchaseIndentDataReduxHandler(v);
                                          navigate('/products/all-products/add-products');
                                        } else {
                                          selectProduct1(v, i);
                                        }
                                      }}
                                      onBlur={() => {
                                        handleChangeIO1({ target: { value: '' } }, i);
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          value={x.itemCode}
                                          {...params}
                                          onChange={(e) => handleChangeIO1(e, i)}
                                          variant="outlined"
                                          name="itemCode"
                                        />
                                      )}
                                    />
                                  )}
                                </div>
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">Item Name</Typography>
                                  {autoCompleteDetailsRowIndex1.includes(i) && x?.itemName?.length ? (
                                    <TextField value={x.itemName} style={{ width: '200px' }} />
                                  ) : (
                                    <Autocomplete
                                      className="search-input"
                                      options={x.prodOptions}
                                      getOptionLabel={(option) => option.name}
                                      style={{ width: '218px' }}
                                      renderInput={(params) => (
                                        <TextField
                                          value={x.itemName}
                                          {...params}
                                          onChange={(e) => handleChangeIO1(e, i)}
                                          variant="outlined"
                                          name="itemCode"
                                        />
                                      )}
                                    />
                                  )}
                                </div>
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">Quantity</Typography>
                                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <SoftInput
                                      type="text"
                                      name="quantityOrdered"
                                      value={x?.quantityOrdered}
                                      onChange={(e) => handleChange1(e, i)}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">
                                    Min Cart Value (Optional)
                                  </Typography>
                                  <SoftInput
                                    placeholder="Minimum Cart Value"
                                    type="number"
                                    style={{ width: '400px' }}
                                    icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                                    onChange={(e) => setRedCart(parseFloat(e.target.value))}
                                  />
                                </div>
                              </>
                            );
                          })}
                        </SoftBox>
                      </SoftBox>
                    ) : selectedOptionForRedeeming === 'Cart' ? (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Choose the minimum {selectedOptionForRedeeming} value{' '}
                          <Tooltip title="Minimum cart value to use the coupon." placement="top">
                            <IconButton>
                              <InfoIcon sx={{ fontSize: '15px' }} />
                            </IconButton>
                          </Tooltip>
                        </Typography>
                        <SoftInput
                          placeholder="Minimum Cart Value"
                          type="number"
                          style={{ width: '400px' }}
                          icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                          onChange={(e) => setMinCartValueRed(parseFloat(e.target.value))}
                        />
                      </SoftBox>
                    ) : null}
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">
                        Select discount type{' '}
                        <Tooltip
                          title="Select the right discount type to enhance sales by reducing the regular price of a product."
                          placement="top"
                        >
                          <IconButton>
                            <InfoIcon sx={{ fontSize: '15px' }} />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <SoftBox className="selected-platform-box2">
                        {discountOptions.map((platform) => (
                          <div key={platform}>
                            <input
                              type="checkbox"
                              id={`platform-${platform}`}
                              name={`platform-${platform}`}
                              checked={selectedDiscountOption.includes(platform)}
                              onChange={() => handleDiscountChange(platform)}
                            />
                            <label htmlFor={`platform-${platform}`} className="dynamic-coupon-label-typo">
                              {' '}
                              {platform}
                            </label>
                          </div>
                        ))}
                      </SoftBox>
                    </SoftBox>
                    {selectedDiscountOption.includes('Discount in Rupees or Percentage') && (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Discount Type{' '}
                          <span style={{ fontWeight: '200', fontSize: '0.9rem', lineHeight: '1.5', color: '#4b524d' }}>
                            (Select any one)
                          </span>
                        </Typography>
                        <SoftBox style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '20px' }}>
                          <div
                            className={
                              selectedDiscountType === 'Amount'
                                ? 'coupon-discount-type-button-selected'
                                : 'coupon-discount-type-button'
                            }
                            onClick={() => setSelectedDiscountType('Amount')}
                          >
                            <CurrencyRupeeIcon fontSize="16px" />
                            <Typography
                              style={{ fontWeight: '200', fontSize: '0.8rem', lineHeight: '1.5' }}
                              className={
                                selectedDiscountType === 'Amount'
                                  ? 'coupon-discount-type-typo-selected'
                                  : 'coupon-discount-type-typo'
                              }
                            >
                              Amount
                            </Typography>
                          </div>
                          <div
                            className={
                              selectedDiscountType === 'Percentage'
                                ? 'coupon-discount-type-button-selected'
                                : 'coupon-discount-type-button'
                            }
                            onClick={() => setSelectedDiscountType('Percentage')}
                          >
                            <PercentIcon sx={{ fontSize: '16px' }} />
                            <Typography
                              style={{ fontWeight: '200', fontSize: '0.8rem', lineHeight: '1.5' }}
                              className={
                                selectedDiscountType === 'Percentage'
                                  ? 'coupon-discount-type-typo-selected'
                                  : 'coupon-discount-type-typo'
                              }
                            >
                              Percentage
                            </Typography>
                          </div>
                        </SoftBox>
                        {selectedDiscountType !== '' && (
                          <SoftBox className="dynamic-coupon-margintop-2">
                            <Typography className="dynamic-coupon-label-typo">
                              {selectedDiscountType === 'Amount'
                                ? 'Amount Off'
                                : selectedDiscountType === 'Percentage'
                                ? 'Percentage Off'
                                : selectedDiscountType === 'FLAT_PRICE'
                                ? 'Flat Price'
                                : null}
                            </Typography>
                            <div style={{ width: '400px' }}>
                              {selectedDiscountType === 'Amount' ? (
                                <SoftInput
                                  icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                                  placeholder="Enter Amount"
                                  value={amount}
                                  type="number"
                                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                                />
                              ) : selectedDiscountType === 'Percentage' ? (
                                <>
                                  <SoftInput
                                    icon={{ component: 'percent', direction: 'right' }}
                                    placeholder="Enter Percentage"
                                    value={percent}
                                    type="number"
                                    onChange={(e) => setPercent(parseFloat(e.target.value))}
                                  />
                                  <Typography className="dynamic-coupon-label-typo">Discount Upto</Typography>
                                  <SoftInput
                                    icon={{ component: <CurrencyRupeeIcon />, direction: 'left' }}
                                    placeholder="Enter Discount Upto"
                                    value={discountUptoForPercent}
                                    type="number"
                                    onChange={(e) => setDiscountUptoForPercent(parseFloat(e.target.value))}
                                  />
                                </>
                              ) : selectedDiscountType === 'FLAT_PRICE' ? (
                                <SoftInput
                                  icon={{ component: 'percent', direction: 'right' }}
                                  placeholder="Enter price"
                                  value={flatPrice}
                                  type="number"
                                  onChange={(e) => setFlatPrice(parseFloat(e.target.value))}
                                />
                              ) : null}
                            </div>
                          </SoftBox>
                        )}
                      </SoftBox>
                    )}
                    {selectedDiscountOption.includes('Offer product') && (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Choose the Product that Customer Gets
                        </Typography>
                        <SoftTypography className="dynamic-coupon-add-more-btn" onClick={handleClick}>
                          + Add more
                        </SoftTypography>
                        <SoftBox>
                          {inputlist2.map((x, i) => {
                            return (
                              <div className="dynamic-coupon-filter-box3">
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">Barcode</Typography>
                                  {autoCompleteDetailsRowIndex2.includes(i) && x?.itemCode?.length ? (
                                    <TextField value={x.itemCode} readOnly={true} style={{ width: '180px' }} />
                                  ) : (
                                    <Autocomplete
                                      className="search-input"
                                      options={x.prodOptions}
                                      getOptionLabel={(option) => option?.variant?.barcodes?.[0] || ''}
                                      style={{ width: '218px' }}
                                      onChange={(e, v) => {
                                        if (v?.variant?.barcodes?.[0]?.includes('Add')) {
                                          // purchaseIndentDataReduxHandler(v);
                                          navigate('/products/all-products/add-products');
                                        } else {
                                          selectProduct2(v, i);
                                        }
                                      }}
                                      onBlur={() => {
                                        handleChangeIO2({ target: { value: '' } }, i);
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          value={x.itemCode}
                                          {...params}
                                          onChange={(e) => handleChangeIO2(e, i)}
                                          variant="outlined"
                                          name="itemCode"
                                        />
                                      )}
                                    />
                                  )}
                                </div>
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">Item Name</Typography>
                                  {autoCompleteDetailsRowIndex2.includes(i) && x?.itemName?.length ? (
                                    <TextField value={x.itemName} style={{ width: '200px' }} />
                                  ) : (
                                    <Autocomplete
                                      className="search-input"
                                      options={x.prodOptions}
                                      getOptionLabel={(option) => option.name}
                                      style={{ width: '218px' }}
                                      renderInput={(params) => (
                                        <TextField
                                          value={x.itemName}
                                          {...params}
                                          onChange={(e) => handleChangeIO2(e, i)}
                                          variant="outlined"
                                          name="itemCode"
                                        />
                                      )}
                                    />
                                  )}
                                </div>
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">Quantity</Typography>
                                  <div className="dynamic-coupon-product-box">
                                    <SoftInput
                                      type="text"
                                      name="quantityOrdered"
                                      value={x?.quantityOrdered}
                                      onChange={(e) => handleChange2(e, i)}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">Discount Type</Typography>
                                  <div className="dynamic-coupon-product-box">
                                    <SoftSelect
                                      // name="discountType"
                                      options={discountFreeBieOptions}
                                      onChange={(option) => handleOptionChange2(option, i)}
                                    />
                                  </div>
                                </div>
                                {x?.discountType === 'PERCENTAGE' ? (
                                  <>
                                    <div>
                                      <Typography className="coupon-filter-box2-typo-head">
                                        Discount Value (%)
                                      </Typography>
                                      <div className="dynamic-coupon-product-box">
                                        <SoftInput
                                          type="text"
                                          name="discountValue"
                                          value={x?.discountValue}
                                          onChange={(e) => handleChange2(e, i)}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <Typography className="coupon-filter-box2-typo-head">
                                        Discount Upto (₹)
                                      </Typography>
                                      <div className="dynamic-coupon-product-box">
                                        <SoftInput
                                          type="text"
                                          name="discountUpto"
                                          value={x?.discountUpto}
                                          onChange={(e) => handleChange2(e, i)}
                                        />
                                        <SoftBox className="close-icons" style={{ cursor: 'pointer' }}>
                                          <Grid item>
                                            <CloseIcon onClick={(e) => handleRemove(e, x, i)} />
                                          </Grid>
                                        </SoftBox>
                                      </div>
                                    </div>
                                  </>
                                ) : x?.discountType === 'FLAT_OFF' ? (
                                  <>
                                    <div>
                                      <Typography className="coupon-filter-box2-typo-head">
                                        Discount Value (₹)
                                      </Typography>
                                      <div className="dynamic-coupon-product-box">
                                        <SoftInput
                                          type="text"
                                          name="discountValue"
                                          value={x?.discountValue}
                                          onChange={(e) => handleChange2(e, i)}
                                        />
                                        <SoftBox className="close-icons" style={{ cursor: 'pointer' }}>
                                          <Grid item>
                                            <CloseIcon onClick={(e) => handleRemove(e, x, i)} />
                                          </Grid>
                                        </SoftBox>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <SoftBox style={{ cursor: 'pointer', marginTop: '20px', color: '#0562fb' }}>
                                    <Grid item>
                                      <CloseIcon onClick={(e) => handleRemove(e, x, i)} />
                                    </Grid>
                                  </SoftBox>
                                )}
                              </div>
                            );
                          })}
                        </SoftBox>
                      </SoftBox>
                    )}
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">
                        Maximum usage of coupon per customer{' '}
                        <Tooltip
                          title="Maximum number of times a single customer can use a particular coupon."
                          placement="top"
                        >
                          <IconButton>
                            <InfoIcon sx={{ fontSize: '15px' }} />
                          </IconButton>
                        </Tooltip>
                        <span className="dynamic-coupon-imp">*</span>
                      </Typography>
                      <SoftInput
                        placeholder="Maximum usage of coupon per customer"
                        style={{ width: '400px' }}
                        type="number"
                        onChange={(e) => setMaxUsage(parseFloat(e.target.value))}
                      />
                    </SoftBox>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">
                        Do you want to set limit of generating coupon per customer{' '}
                        <Tooltip title="Coupon can/cannot be generated for every purchase" placement="top">
                          <IconButton>
                            <InfoIcon sx={{ fontSize: '15px' }} />
                          </IconButton>
                        </Tooltip>
                        <span className="dynamic-coupon-imp">*</span>
                      </Typography>
                      <SoftBox className="dynamic-coupon-gap">
                        <div>
                          <input
                            type="radio"
                            id="scheduleYesss"
                            name="scheduleGroups"
                            value="Yes"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionLimit === 'Yes'}
                            onChange={handleRadioChangeLimit}
                          />
                          <label htmlFor="scheduleYesss" className="dynamic-coupon-label-typo">
                            Yes
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="scheduleNoss"
                            name="scheduleGroups"
                            value="No"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionLimit === 'No'}
                            onChange={handleRadioChangeLimit}
                          />
                          <label htmlFor="scheduleNoss" className="dynamic-coupon-label-typo">
                            No
                          </label>
                        </div>
                        {selectedOptionLimit === 'No' ? (
                          <Typography
                            style={{
                              fontWeight: '200',
                              fontSize: '0.8rem',
                              lineHeight: '1.5',
                              color: 'red',
                              textAlign: 'left',
                              margin: '10px 0px',
                            }}
                          ></Typography>
                        ) : selectedOptionLimit === 'Yes' ? (
                          <div style={{ display: 'flex', gap: '10px', height: '40px' }}>
                            <SoftInput
                              type="number"
                              placeholder="Set Limit"
                              onChange={(e) => setCouponLimit(parseFloat(e.target.value))}
                            />
                            <Typography className="dynamic-coupon-label-typo">Set Limit</Typography>
                          </div>
                        ) : null}
                      </SoftBox>
                    </SoftBox>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">
                        Locations{' '}
                        <Tooltip title="Locations where a coupon can be redeemed or utilized." placement="top">
                          <IconButton>
                            <InfoIcon sx={{ fontSize: '15px' }} />
                          </IconButton>
                        </Tooltip>
                        <span className="dynamic-coupon-imp">*</span>
                      </Typography>

                      <Autocomplete
                        multiple
                        options={[{ label: 'All', value: 'All' }, ...locOp]} // Add "All" option
                        onChange={handleAutocompleteChange}
                        value={
                          locOp.length === selectedLocation.length
                            ? [{ label: 'All', value: 'All' }]
                            : locOp.filter((option) => selectedLocation.includes(option.label))
                        }
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => <TextField {...params} placeholder="Select Location" />}
                      />
                    </SoftBox>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">Coupon Validity</Typography>
                      <SoftBox
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '10px',
                        }}
                      >
                        <div>
                          <Typography className="coupon-filter-box2-typo-head">Valid From</Typography>
                          <SoftBox>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                key={renderKey}
                                {...(startDate && {
                                  value: dayjs(startDate),
                                })}
                                views={['year', 'month', 'day']}
                                format="DD-MM-YYYY"
                                onChange={(date) => setStartDate(format(date.$d, 'yyyy-MM-dd'))}
                              />
                            </LocalizationProvider>
                          </SoftBox>
                        </div>
                        <div>
                          <Typography className="coupon-filter-box2-typo-head">Valid Upto</Typography>
                          <SoftBox>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                key={renderKey}
                                {...(endDate && {
                                  value: dayjs(endDate),
                                })}
                                views={['year', 'month', 'day']}
                                format="DD-MM-YYYY"
                                onChange={(date) => setEndDate(format(date.$d, 'yyyy-MM-dd'))}
                              />
                            </LocalizationProvider>
                          </SoftBox>
                        </div>
                        <div>
                          <Typography className="coupon-filter-box2-typo-head">Time From</Typography>
                          <SoftBox>
                            <input
                              type="time"
                              id="timeInput"
                              value={validTimeFrom}
                              onChange={handleTimeChange}
                              className="time-input-dynamic-coupon"
                            />
                          </SoftBox>
                        </div>
                        <div>
                          <Typography className="coupon-filter-box2-typo-head">Time Upto</Typography>
                          <SoftBox>
                            <input
                              type="time"
                              id="timeOutput"
                              value={validTimeUpto}
                              onChange={handleTimeUptoChange}
                              className="time-input-dynamic-coupon"
                            />
                          </SoftBox>
                        </div>
                      </SoftBox>
                      {/* <Typography className="dynamic-coupon-label-typo">Set the validity of coupon</Typography> */}
                    </SoftBox>

                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">
                        Combine with others coupons/offers{' '}
                        <Tooltip title="Coupon can be combined with other coupons/offers or not." placement="top">
                          <IconButton>
                            <InfoIcon sx={{ fontSize: '15px' }} />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <SoftBox style={{ display: 'flex', gap: '40px' }}>
                        <div>
                          <input
                            type="radio"
                            id="scheduleYesq"
                            name="scheduleGroupq"
                            value="Yes"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOption === 'Yes'}
                            onChange={handleRadioChange}
                          />
                          <label htmlFor="scheduleYesq" className="dynamic-coupon-label-typo">
                            Yes
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="scheduleNoq"
                            name="scheduleGroupq"
                            value="No"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOption === 'No'}
                            onChange={handleRadioChange}
                          />
                          <label htmlFor="scheduleNoq" className="dynamic-coupon-label-typo">
                            No
                          </label>
                        </div>
                      </SoftBox>
                    </SoftBox>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">
                        Sales Channel{' '}
                        <Tooltip title="Specify the sales channels where the coupons can be redeemed." placement="top">
                          <IconButton>
                            <InfoIcon sx={{ fontSize: '15px' }} />
                          </IconButton>
                        </Tooltip>
                        <span className="dynamic-coupon-imp">*</span>
                      </Typography>
                      <SoftBox className="selected-platform-box1">
                        {platFormOptions.map((platform) => (
                          <div key={platform}>
                            <input
                              type="checkbox"
                              id={`platform-${platform}`}
                              name={`platform-${platform}`}
                              checked={selectedPlatforms.includes(platform)}
                              onChange={() => handlePlatformChange(platform)}
                            />
                            <label htmlFor={`platform-${platform}`} className="dynamic-coupon-label-typo">
                              {' '}
                              {platform}
                            </label>
                          </div>
                        ))}
                      </SoftBox>
                    </SoftBox>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">
                        Distribution Channels{' '}
                        <Tooltip title="Coupon can be sent to you via the selected channels" placement="top">
                          <IconButton>
                            <InfoIcon sx={{ fontSize: '15px' }} />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <SoftBox className="selected-platform-box12">
                        {channelOptions.map((platform) => (
                          <div key={platform}>
                            <input
                              type="checkbox"
                              id={`platform-${platform}`}
                              name={`platform-${platform}`}
                              checked={selectedChannelOptions.includes(platform)}
                              onChange={() => handleChannelChange(platform)}
                            />
                            <label htmlFor={`platform-${platform}`} className="dynamic-coupon-label-typo">
                              {' '}
                              {platform}
                            </label>
                          </div>
                        ))}
                      </SoftBox>
                    </SoftBox>

                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">
                        OTP required at the time of coupon redemption{' '}
                        <Tooltip
                          title="During the use of the coupon code whether OTP is required for verification"
                          placement="top"
                        >
                          <IconButton>
                            <InfoIcon sx={{ fontSize: '15px' }} />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                      <SoftBox className="dynamic-coupon-gap">
                        <div>
                          <input
                            type="radio"
                            id="scheduleYesr"
                            name="scheduleGroupr"
                            value="Yes"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionforOTP === 'Yes'}
                            onChange={handleRadioChangeforOTP}
                          />
                          <label htmlFor="scheduleYesr" className="dynamic-coupon-label-typo">
                            Yes
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="scheduleNor"
                            name="scheduleGroupr"
                            value="No"
                            className="dynamic-coupon-marginright-10"
                            checked={selectedOptionforOTP === 'No'}
                            onChange={handleRadioChangeforOTP}
                          />
                          <label htmlFor="scheduleNor" className="dynamic-coupon-label-typo">
                            No
                          </label>
                        </div>
                      </SoftBox>
                    </SoftBox>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">Select the customer type</Typography>
                      <SoftBox className="selected-platform-box123">
                        {customerOptions.map((platform) => (
                          <div key={platform}>
                            <input
                              type="checkbox"
                              id={`platform-${platform}`}
                              name={`platform-${platform}`}
                              checked={selectedCustomerType.includes(platform)}
                              onChange={() => handleCustomerChange(platform)}
                            />
                            <label htmlFor={`platform-${platform}`} className="dynamic-coupon-label-typo">
                              {' '}
                              {platform}
                            </label>
                          </div>
                        ))}
                      </SoftBox>
                    </SoftBox>
                    <SoftBox className="dynamic-coupon-margintop-2">
                      <Typography className="dynamic-copupon-form-heading">Other Terms & Conditions:</Typography>
                      <SoftBox className="text-half-area" style={{ borderRadius: '10px' }}>
                        <TextareaAutosize
                          className="text-area"
                          aria-label="empty textarea"
                          placeholder="Terms and Conditions"
                          onChange={(e) => setTerms(e.target.value)}
                        />
                      </SoftBox>
                    </SoftBox>
                  </div>
                )}

                {steps === 4 && (
                  <div className="dynamic-coupon-padding">
                    <Typography className="dynamic-coupon-creation-main-heading">Preview</Typography>
                    <div className="dynamic-coupon-step-4-box">
                      <SoftBox className="automated-entry-box">
                        <div className="coupon-preview-box-style">
                          <Typography className="coupon-preview-single-heading">Coupon Issuance Criteria</Typography>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                          <Typography className="coupon-preview-single-desc">
                            {selectedOptionProduct === 'Cart'
                              ? `Buy items worth Rs. ${minCartVaue ? minCartVaue : '100'}`
                              : selectedOptionProduct === 'Product'
                              ? `Buy Product ${inputlist[0].itemName ? inputlist[0].itemName : 'XYZ'}`
                              : selectedOptionProduct === 'Category'
                              ? `Buy any product from the category ${
                                  catLevel2 ? catLevel2 : catLevel1 ? catLevel1 : mainCate ? mainCate : 'XYZ'
                                }`
                              : selectedOptionProduct === 'Brand'
                              ? `Buy any item from the brand ${brandName ? brandName : 'XYZ'}`
                              : selectedOptionProduct === 'Manufacturer'
                              ? `Buy any item from the manufacturer ${manuName ? manuName : 'XYZ'}`
                              : 'Buy'}
                          </Typography>
                        </div>
                      </SoftBox>
                      <SoftBox className="dynamic-coupon-step-4-box">
                        <SouthIcon sx={{ fontSize: '30px' }} />
                      </SoftBox>

                      <SoftBox className="automated-entry-box">
                        <div className="coupon-preview-box-style">
                          <div className="automated-entry-icon-box">
                            <ConfirmationNumberOutlinedIcon color="#fff" />
                          </div>
                          <Typography className="coupon-preview-single-heading">Get a coupon</Typography>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                          <Typography className="coupon-preview-single-desc">Valid for {validityRew} days</Typography>
                        </div>
                      </SoftBox>
                      <SoftBox className="dynamic-coupon-step-4-box">
                        <SouthIcon sx={{ fontSize: '30px' }} />
                      </SoftBox>
                      <SoftBox className="dynamic-coupon-step-4-box">
                        <Typography className="dynamic-coupon-label-typo">on your next purchase</Typography>
                      </SoftBox>
                      {selectedOptionForRedeeming !== '' && (
                        <SoftBox className="dynamic-coupon-step-4-box">
                          <SouthIcon sx={{ fontSize: '30px' }} />
                        </SoftBox>
                      )}

                      {selectedOptionForRedeeming !== '' && (
                        <SoftBox className="automated-entry-box">
                          <div className="coupon-preview-box-style">
                            <Typography className="coupon-preview-single-heading">Coupon Redeeming Criteria</Typography>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                            <Typography className="coupon-preview-single-desc">
                              {selectedOptionForRedeeming === 'Cart'
                                ? `Buy items worth Rs. ${minCartValueRed ? minCartValueRed : '100'}`
                                : selectedOptionForRedeeming === 'Product'
                                ? `Buy Product ${inputlist1[0].itemName ? inputlist1[0].itemName : 'XYZ'}`
                                : selectedOptionForRedeeming === 'Category'
                                ? `Buy any product from the category ${
                                    catLevel2Red
                                      ? catLevel2Red
                                      : catLevel1Red
                                      ? catLevel1Red
                                      : mainCatRed
                                      ? mainCatRed
                                      : 'XYZ'
                                  }`
                                : selectedOptionForRedeeming === 'Brand'
                                ? `Buy any item from the brand ${brandNameRed}`
                                : selectedOptionForRedeeming === 'Manufacturer'
                                ? `Buy any item from the manufacturer ${manuNameRed}`
                                : 'Buy'}
                            </Typography>
                          </div>
                        </SoftBox>
                      )}
                      {selectedDiscountOption.length === 2 && (
                        <>
                          <SoftBox className="coupon-step4-alignment">
                            <CallReceivedIcon sx={{ fontSize: '50px' }} />
                            <SouthEastIcon sx={{ fontSize: '50px' }} />
                          </SoftBox>
                          <SoftBox className="coupon-step4-alignment-123">
                            <SoftBox className="automated-entry-box">
                              <div className="coupon-preview-box-style">
                                <div
                                  className="automated-entry-icon-box"
                                  style={{ backgroundColor: 'rgb(139, 131, 231)' }}
                                >
                                  <DiscountOutlinedIcon color="#fff" />
                                </div>
                                <Typography className="coupon-preview-single-heading">Discount</Typography>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                                <Typography className="coupon-preview-single-desc">
                                  {selectedDiscountType === 'Amount'
                                    ? `Get Rs ${amount ? amount : '100'}. off`
                                    : selectedDiscountType === 'Percentage'
                                    ? `Get ${percent ? percent : '10'}% off upto Rs. ${
                                        discountUptoForPercent ? discountUptoForPercent : '100'
                                      }`
                                    : 'dicount'}
                                </Typography>
                              </div>
                            </SoftBox>
                            <SoftBox className="automated-entry-box">
                              <div className="coupon-preview-box-style">
                                <div
                                  className="automated-entry-icon-box"
                                  style={{ backgroundColor: 'rgb(30, 184, 184)' }}
                                >
                                  <LocalParkingRoundedIcon className="product-p-icon" />
                                </div>
                                <Typography className="coupon-preview-single-heading">Product</Typography>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                                {inputlist2?.map((item) => {
                                  return (
                                    <Typography className="coupon-preview-single-desc">
                                      Get {item.itemName} for{' '}
                                      {item.discountType === 'FREE'
                                        ? 'free'
                                        : item.discountType === 'PERCENTAGE'
                                        ? `${item.discountValue}% off upto Rs. ${item.discountUpto}`
                                        : item.discountType === 'AMOUNT'
                                        ? `discount of Rs. ${item.discountValue}`
                                        : 'free'}
                                    </Typography>
                                  );
                                })}
                              </div>
                            </SoftBox>
                          </SoftBox>
                        </>
                      )}
                      {selectedDiscountOption.length === 1 && (
                        <>
                          <SoftBox className="dynamic-coupon-step-4-box">
                            <SouthIcon sx={{ fontSize: '30px' }} />
                          </SoftBox>
                          <SoftBox className="automated-entry-box">
                            <div className="coupon-preview-box-style">
                              <div
                                className="automated-entry-icon-box"
                                style={{ backgroundColor: 'rgb(139, 131, 231)' }}
                              >
                                {selectedDiscountOption.includes('Discount in Rupees or Percentage') ? (
                                  <DiscountOutlinedIcon color="#fff" />
                                ) : (
                                  <LocalParkingRoundedIcon className="product-p-icon" />
                                )}
                              </div>
                              <Typography className="coupon-preview-single-heading">
                                {selectedDiscountOption.includes('Discount in Rupees or Percentage')
                                  ? 'Discount'
                                  : 'Product'}
                              </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                              {selectedDiscountOption.includes('Offer product') ? (
                                <>
                                  {inputlist2?.map((item) => (
                                    <Typography className="coupon-preview-single-desc">
                                      Get {item.itemName} for{' '}
                                      {item.discountType === 'FREE'
                                        ? 'free'
                                        : item.discountType === 'PERCENTAGE'
                                        ? `${item.discountValue}% off upto Rs. ${item.discountUpto}`
                                        : item.discountType === 'AMOUNT'
                                        ? `discount of Rs. ${item.discountValue}`
                                        : 'free'}
                                    </Typography>
                                  ))}
                                </>
                              ) : (
                                <Typography className="coupon-preview-single-desc">
                                  {selectedDiscountType === 'Amount' &&
                                  selectedDiscountOption.includes('Discount in Rupees or Percentage')
                                    ? `Get Rs ${amount ? amount : '100'}. off`
                                    : selectedDiscountType === 'Percentage' &&
                                      selectedDiscountOption.includes('Discount in Rupees or Percentage')
                                    ? `Get ${percent ? percent : '10'}% off upto Rs. ${
                                        discountUptoForPercent ? discountUptoForPercent : '100'
                                      }`
                                    : 'discount'}
                                </Typography>
                              )}
                            </div>
                          </SoftBox>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>
            {steps === 4 && (
              <SoftBox display="flex" justifyContent="flex-end" mt={4}>
                <SoftBox display="flex">
                  <SoftButton className="vendor-second-btn" onClick={() => navigate(-1)}>
                    Cancel
                  </SoftButton>
                  <SoftBox ml={2}>
                    <SoftButton color="info" className="vendor-add-btn" onClick={handleCreateCoupon}>
                      {loader ? (
                        <CircularProgress
                          size={18}
                          sx={{
                            color: '#fff',
                          }}
                        />
                      ) : (
                        <>Create</>
                      )}
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            )}
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default CreateDynamicCouponForm;
