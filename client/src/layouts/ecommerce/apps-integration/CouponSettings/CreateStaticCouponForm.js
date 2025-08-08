import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import PercentIcon from '@mui/icons-material/Percent';
import { Autocomplete, Box, CircularProgress, Grid, TextField, TextareaAutosize, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';

import CloseIcon from '@mui/icons-material/Close';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import SoftTypography from '../../../../components/SoftTypography';
import {
  createCouponV2,
  getAllBrands,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
  getAllManufacturerV2,
  getAllProductSuggestionV2,
  getRetailUserLocationDetails,
  previPurchasePrice,
} from '../../../../config/Services';
import { useSoftUIController } from '../../../../context';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { dateFormatter, isSmallScreen } from '../../Common/CommonFunction';

const CreateStaticCouponForm = () => {
  const isMobileDevice = isSmallScreen();
  const [selectedCouponType, setSelectedCouponType] = useState(localStorage.getItem('couponType'));
  const [selectedDiscountType, setSelectedDiscountType] = useState('');
  const [steps, setSteps] = useState(1);
  const navigate = useNavigate();

  const [endDate, setEndDate] = useState('2024-01-05');
  const [startDate, setStartDate] = useState('2023-12-12');
  const [renderKey, setRenderKey] = useState(0);
  const [loader, setLoader] = useState(false);

  const [couponTitle, setCouponTitle] = useState('20% off on all Products');
  const [couponCode, setCouponCode] = useState('FLAT20');
  const [amount, setAmount] = useState('200');
  const [percent, setPercent] = useState('20');
  const [flatPrice, setFlatPrice] = useState('30');
  const [maxUsage, setMaxUsage] = useState('1');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedLocationV, setSelectedLocationV] = useState([]);
  const [terms, setTerms] = useState('');
  const [validTimeFrom, setValidTimeFrom] = useState('00:00:00');

  const [validTimeUpto, setValidTimeUpto] = useState('23:59:00');
  const [minCartVaue, setMinCartValue] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [totalCoupons, setTotalCoupons] = useState('');
  const [discountUptoForPercent, setDiscountUptoForPercent] = useState('');
  const [selectedDiscountOption, setSelectedDiscountOption] = useState([]);
  const [selectedOptionProduct, setSelectedOptionProduct] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const showSnackbar = useSnackbar();
  const [locOp, setLocOp] = useState([]);

  const [mainCate, setMainCate] = useState('');
  const [catLevel1, setCatLevel1] = useState('');
  const [catLevel2, setCatLevel2] = useState('');
  const [brandName, setBrandName] = useState('');
  const [manuName, setManuName] = useState('');
  const [mainCatOption, setMainCatOption] = useState([]);
  const [catLevel1Option, setCatLevel1Option] = useState([]);
  const [catLevel2Option, setCatLevel2Option] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [manuOption, setManuOption] = useState([]);
  const locId = localStorage.getItem('locId');
  const [productIds, setProductIds] = useState([]);
  const [mainCateVal, setMainCateVal] = useState();
  const [catLevel1Val, setCatLevel1Val] = useState();
  const [catLevel2Val, setCatLevel2Val] = useState();
  const [brandNameVal, setBrandNameVal] = useState('');
  const [manuNameVal, setManuNameVal] = useState('');

  const [selectedPriceSlab, setSelectedPriceSlab] = useState('');

  const [inputlist, setInputlist] = useState([]);
  const [autoCompleteDetailsRowIndex, setAutoCompleteDetailsRowIndex] = useState([0]);
  const [autoCompleteDetailsRowIndex1, setAutoCompleteDetailsRowIndex1] = useState([0]);
  const [inputlist1, setInputlist1] = useState([
    {
      prodOptions: [],
      itemCode: '',
      itemName: '',
      spec: '',
      quantityOrdered: 0,
      finalPrice: '',
      unit: '',
      previousPurchasePrice: 0,
      TotalAmtQty: 0,
      preferredVendor: '',
      offerType: '',
      discountType: '',
      discountValue: '',
      discountUpto: '',
      itemlabel: 'Item Name',
      quantilabel: 'Quantity',
      speclabel: 'Specification',
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

  useEffect(() => {
    handleMainCategory();
    handleBrand();
    handleManufacturer();
  }, [selectedCouponType]);

  const handleBrand = () => {
    const payload = {
      page: 1,
      pageSize: 20,
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
      sortByUpdatedDate: 'DESCENDING',
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
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
    setMainCateVal(e.value);
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

  const handleTimeChange = (event) => {
    setValidTimeFrom(event.target.value);
  };

  const handleTimeUptoChange = (event) => {
    setValidTimeUpto(event.target.value);
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleRadioChangeProduct = (event) => {
    setSelectedOptionProduct(event.target.value);
  };

  const handlePlatformChange = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      // If platform is already selected, remove it
      setSelectedPlatforms((prevSelected) => prevSelected.filter((selected) => selected !== platform));
    } else {
      // If platform is not selected, add it
      setSelectedPlatforms((prevSelected) => [...prevSelected, platform]);
    }
  };

  const handleDiscountChange = (discount) => {
    if (selectedDiscountOption.includes(discount)) {
      // If platform is already selected, remove it
      setSelectedDiscountOption((prevSelected) => prevSelected.filter((selected) => selected !== discount));
    } else {
      // If platform is not selected, add it
      setSelectedDiscountOption((prevSelected) => [...prevSelected, discount]);
    }
  };

  const couponType = [
    {
      label: 'By Cart Value',
      value: 'Cart Value',
    },
    {
      label: 'By Product',
      value: 'Product',
    },
    {
      label: 'Preapproved',
      value: 'Preapproved',
    },
  ];

  const discountFreeBieOptions = [
    {
      label: 'By Percentage',
      value: 'PERCENTAGE',
    },
    {
      label: 'By Flat Price',
      value: 'FLAT_PRICE',
    },
  ];

  const discountOptions = ['Discount in Rupees or Percentage', 'Offer free product'];

  const platFormOptions = ['RMS', 'POS', 'APP'];
  const platformString = selectedPlatforms.map((platform) => (platform === 'POS' ? 'In-store' : platform)).join(', ');

  const locationString = selectedLocation.join(', ');

  const handleFlatCheck = () => {
    if (selectedCouponType !== 'Cart Value' && selectedCouponType !== 'Preapproved') {
      setSelectedDiscountType('Flat price');
    }
  };

  const orgId = localStorage.getItem('orgId');
  const contextType = localStorage.getItem('contextType');

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

  const handleOptionChange2 = (option, index) => {
    const list = [...inputlist1];
    const name = 'discountType';
    // Ensure that the index is within bounds before modifying the array
    if (index >= 0 && index < list.length) {
      list[index][name] = option.value;
      setInputlist1(list);
    }
  };

  const selectProduct1 = (item, index) => {
    const list = [...inputlist1];
    list[index].itemCode = item.variant?.barcodes?.[0];
    list[index].itemName = item.name;
    list[index].itemName = item.name;
    list[index].spec =
      item?.variant?.weightUnit !== null ? item?.variant?.weightUnit + ' ' + item?.variant?.weight : '';
    list[index].unit = item?.variant?.weightUnit !== null ? item?.variant.weightUnit : '';
    list[index].finalPrice = item?.variant?.mrpData?.[0]?.mrp;
    list[index].gst = item?.taxReference?.taxRate;

    setInputlist1(list);

    setAutoCompleteDetailsRowIndex1((prev) => [...prev, index]);
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
    //   // filterObject.supportedStore = ['TWINLEAVES', orgId];
    // } else if (contextType === 'WMS') {
    //   filterObject.supportedWarehouse = ['TWINLEAVES', orgId];
    // } else if (contextType === 'VMS') {
    //   payload.marketPlaceSeller = ['TWINLEAVES', orgId];
    // }
    // if (isNumber) {
    //   filterObject.query = searchText;
    // } else {
    //   filterObject.query = searchText;
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

  const selectProduct = (item, index) => {
    // setItemLoader(true)
    const listNewIndex = inputlist.length - 1 + 1;

    const list = [...inputlist];
    // const list = JSON.parse(JSON.stringify(inputlist));
    list[index].itemCode = item?.variant?.barcodes[0];
    list[index].itemName = item.name;
    list[index].spec =
      item?.variant?.weightUnit !== null ? item?.variant?.weightUnit + ' ' + item?.variant?.weight : '';
    list[index].unit = item?.variant?.weightUnit !== null ? item?.variant.weightUnit : '';
    list[index].finalPrice = item?.variant?.mrpData?.[0]?.mrp;
    list[index].gst = item?.taxReference?.taxRate;

    previPurchasePrice(item.gtin, orgId).then((response) => {
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
    // if (inputlist1.length >= 1 && (inputlist1[0]?.itemName === '' || inputlist1[0]?.itemCode === '')) {
    //   showSnackbar('Add Product in the first field', 'warning');
    //   return;
    // }

    setInputlist1([
      ...inputlist1,
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
    const newList = [...inputlist1.filter((e, i) => i !== index)];
    setInputlist1(newList);
    const newSelectAuto = [];
    const list = [...inputlist1];

    for (let i = 0; i < inputlist1.length; i++) {
      newSelectAuto.unshift(i);
    }
    setAutoCompleteDetailsRowIndex1((prev) => [...newSelectAuto]);

    const list1 = [...productIds];
    list1.splice(index, 1);
    setProductIds(list1);
  };

  const priceOptions = [
    { value: 'Price Slab 1', label: 'Price Slab 1' },
    { value: 'Price Slab 2', label: 'Price Slab 2' },
    { value: 'Price Slab 3', label: 'Price Slab 3' },
    { value: 'Price Slab 4', label: 'Price Slab 4' },
    { value: 'Price Slab 5', label: 'Price Slab 5' },
  ];

  const handleCouponTypeChange = (option) => {
    setSelectedCouponType(option.value);
    localStorage.setItem('couponType', option.value);
    setSelectedDiscountType('');
    setStartDate('2024-01-05');
    setEndDate('2024-03-05');
    setCouponTitle('20% off on all products');
    setCouponCode('FLAT20');
    setAmount('200');
    setPercent('20');
    setFlatPrice('30');
    setMaxUsage('');
    setSelectedPlatforms([]);
    setSelectedOption('');
    setSelectedLocation([]);
    setSelectedLocationV([]);
    setTerms('');
    setValidTimeFrom('00:00:00');

    setValidTimeUpto('23:59:00');
    setMinCartValue('');
    setMaxBudget('');
    setTotalCoupons('');
    setDiscountUptoForPercent('');
    setSelectedDiscountOption([]);
    setSelectedOptionProduct('');
    setMainCate('');
    setCatLevel1('');
    setCatLevel2('');
    setBrandName('');
    setManuName('');
    setMainCatOption([]);
    setCatLevel1Option([]);
    setCatLevel2Option([]);
    setBrandOption([]);
    setManuOption([]);
  };

  const handleSave = () => {
    let limitExist = false;
    const customerArr = [];
    let applicableOn = '';
    if (selectedPlatforms.length !== 0) {
      limitExist = true;

      // Check each platform individually
      if (selectedPlatforms.includes('POS')) {
        const orgId = localStorage.getItem('orgId');

        applicableOn = 'END_USER';
        customerArr.push({
          orgId: orgId,
          orgLocationId: locId,
          orgType: 'RETAIL',
          customerType: 'POS',
        });
      }

      if (selectedPlatforms.includes('RMS')) {
        const orgId = localStorage.getItem('orgId');
        applicableOn = 'ORG';
        customerArr.push({
          orgId: orgId,
          orgLocationId: locId,
          orgType: 'RETAIL',
          customerType: 'RMS',
        });
      }

      if (selectedPlatforms.includes('APP')) {
        const orgId = localStorage.getItem('orgId');
        applicableOn = 'ALL';
        customerArr.push({
          orgId: orgId,
          orgLocationId: locId,
          orgType: 'RETAIL',
          customerType: 'APP',
        });
      }
    }

    if (
      !couponCode ||
      !couponTitle ||
      !maxBudget ||
      !totalCoupons ||
      !selectedLocation?.length ||
      !minCartVaue ||
      !startDate ||
      !endDate ||
      !customerArr.length
    ) {
      showSnackbar('Please fill all required fields', 'warning');
      return;
    }
    const orgId = localStorage.getItem('orgId');
    const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
    const contextType = localStorage.getItem('contextType');

    const locArr = [];
    selectedLocationV.forEach((e) => {
      locArr.push(e);
    });

    if (
      customerArr.length > 1 &&
      customerArr.some((c) => c.customerType === 'POS') &&
      customerArr.some((c) => c.customerType === 'RMS' || c.customerType === 'APP')
    ) {
      applicableOn = 'ALL';
    }

    const freebieItemList = [];

    const itemsToBeAdded = inputlist1.map((item) => {
      return {
        itemCode: item.itemCode,
        quantity: parseFloat(item.quantityOrdered) || 0,
        freebieType: 'FREE',
        discountType: item.discountType,
        discountValue: parseFloat(item.discountValue) || 0,
        discountUpto: parseFloat(item.discountUpto) || 0,
        applied: true,
      };
    });

    freebieItemList.push(...itemsToBeAdded);

    const cartPayload = {
      couponCode: couponCode,
      couponType: 'CART_VALUE',
      createdBy: uidx,
      offerName: couponTitle,
      description: '',
      termsAndConditions: terms,
      discountType:
        selectedDiscountType === 'Amount' ? 'FLAT_OFF' : selectedDiscountType === 'Percentage' ? 'PERCENTAGE' : '',
      discountValue: selectedDiscountType === 'Amount' ? amount : selectedDiscountType === 'Percentage' ? percent : '',
      discountUpto: discountUptoForPercent || 0,
      sourceLocationId: locId,
      sourceOrgType: contextType,
      sourceOrgId: orgId,
      validPeriodExist: true,
      validFrom: startDate || null,
      validTo: endDate || null,
      validTimeFrom: validTimeFrom || '00:00',
      validTimeTo: validTimeUpto || '23:59',
      minOrderValue: minCartVaue || 0,
      maxUsagePerUser: maxUsage || 'NO_LIMIT',
      usageLimitExist: maxUsage ? true : false,
      maxTotalUsage: totalCoupons || 0,
      budget: maxBudget || 0,
      combined: selectedOption === 'Yes' ? true : false,
      preApproved: false,
      applicableOn: applicableOn,
      applicableProductType: [],
      applicableBrand: [],
      applicableLocation: locArr,
      couponApplicableCustomersList: customerArr,
      freebieItemList: freebieItemList,
    };

    const productPayload = {
      couponCode: couponCode,
      couponType: 'PRODUCT',
      createdBy: uidx,
      offerName: couponTitle,
      description: '',
      termsAndConditions: terms,
      discountType:
        selectedDiscountType === 'Amount'
          ? 'FLAT_OFF'
          : selectedDiscountType === 'Percentage'
          ? 'PERCENTAGE'
          : selectedDiscountType === 'Flat price'
          ? 'FLAT_OFF'
          : '',
      discountValue:
        selectedDiscountType === 'Amount'
          ? amount
          : selectedDiscountType === 'Percentage'
          ? percent
          : selectedDiscountType === 'Flat price'
          ? flatPrice
          : '',
      discountUpto: discountUptoForPercent,
      sourceLocationId: locId,
      sourceOrgType: contextType,
      sourceOrgId: orgId,
      validPeriodExist: true,
      validFrom: startDate || null,
      validTo: endDate || null,
      validTimeFrom: validTimeFrom || '00:00',
      validTimeTo: validTimeUpto || '23:59',
      minOrderValue: minCartVaue,
      maxUsagePerUser: maxUsage || 'NO_LIMIT',
      usageLimitExist: maxUsage ? true : false,
      maxTotalUsage: totalCoupons,
      budget: maxBudget,
      combined: selectedOption === 'Yes' ? true : false,
      preApproved: false,
      applicableOn: applicableOn,
      applicableProductType: [mainCateVal],
      applicableBrand: [brandNameVal],
      applicableCategory1: [catLevel1Val],
      applicableCategory2: [catLevel2Val],
      applicableManufacturer: [manuNameVal],
      applicableLocation: locArr,
      couponApplicableCustomersList: customerArr,
      freebieItemList: freebieItemList,
      couponItemList: [
        {
          itemCode: inputlist[0].itemCode,
          quantity: parseFloat(inputlist[0].quantityOrdered),
        },
      ],
    };

    const preapprovedPayload = {
      couponCode: couponCode,
      couponType: 'CART_VALUE',
      createdBy: uidx,
      offerName: selectedPriceSlab,
      description: couponTitle,
      termsAndConditions: terms,
      discountType:
        selectedDiscountType === 'Amount' ? 'FLAT_OFF' : selectedDiscountType === 'Percentage' ? 'PERCENTAGE' : '',
      discountValue: selectedDiscountType === 'Amount' ? amount : selectedDiscountType === 'Percentage' ? percent : '',
      discountUpto: discountUptoForPercent,
      sourceLocationId: locId,
      sourceOrgType: contextType,
      sourceOrgId: orgId,
      validPeriodExist: true,
      validFrom: startDate || null,
      validTo: endDate || null,
      validTimeFrom: validTimeFrom || '00:00',
      validTimeTo: validTimeUpto || '23:59',
      minOrderValue: minCartVaue,
      maxUsagePerUser: maxUsage || 'NO_LIMIT',
      usageLimitExist: maxUsage ? true : false,
      maxTotalUsage: totalCoupons,
      budget: maxBudget,
      combined: selectedOption === 'Yes' ? true : false,
      preApproved: true,
      applicableOn: applicableOn,
      applicableProductType: [],
      applicableBrand: [],
      applicableLocation: locArr,
      couponApplicableCustomersList: customerArr,
      freebieItemList: freebieItemList,
    };

    if (selectedCouponType === 'Cart Value') {
      createCouponV2(cartPayload)
        .then((res) => {
          if (res?.data?.data?.es === 0) {
            setLoader(false);
            showSnackbar('Coupon Created Successfully', 'success');
            setTimeout(() => {
              navigate('/marketing/Coupons');
            }, 2000);
          } else {
            setLoader(false);
            showSnackbar(res?.data?.data?.message || 'There was an error creating a coupon', 'error');
          }
        })
        .catch((err) => {
          setLoader(false);
          if (err?.message === 'Request failed with status code 400') {
            showSnackbar('Invalid max usage per customer', 'error');
          } else {
            showSnackbar(err?.message || 'There was an error creating a coupon', 'error');
          }
        });
    }

    if (selectedCouponType === 'Product') {
      createCouponV2(productPayload)
        .then((res) => {
          if (res?.data?.data?.es === 0) {
            setLoader(false);
            showSnackbar('Coupon Created Successfully', 'success');
            setTimeout(() => {
              navigate('/marketing/Coupons');
            }, 2000);
          } else {
            setLoader(false);

            showSnackbar(res?.data?.data?.message || 'There was an error creating a coupon', 'error');
          }
        })
        .catch((err) => {
          setLoader(false);
          if (err?.message === 'Request failed with status code 400') {
            showSnackbar('Invalid max usage per customer', 'error');
          } else {
            showSnackbar(err?.message || 'There was an error creating a coupon', 'error');
          }
        });
    }

    if (selectedCouponType === 'Preapproved') {
      createCouponV2(preapprovedPayload)
        .then((res) => {
          if (res?.data?.data?.es === 0) {
            setLoader(false);
            showSnackbar('Coupon Created Successfully', 'success');
            setTimeout(() => {
              navigate('/marketing/Coupons');
            }, 2000);
          } else {
            setLoader(false);

            showSnackbar(res?.data?.data?.message || 'There was an error creating a coupon', 'error');
          }
        })
        .catch((err) => {
          setLoader(false);
          if (err?.message === 'Request failed with status code 400') {
            showSnackbar('Invalid max usage per customer', 'error');
          } else {
            showSnackbar(err?.message || 'There was an error creating a coupon', 'error');
          }
        });
    }
  };

  const handleCouponCodeChange = (e) => {
    const inputValue = e.target.value;

    // Limit input to 12 characters
    if (inputValue.length <= 12) {
      setCouponCode(inputValue);
    } else {
      // Display a message when the limit is reached
      setErrorMessage('Coupon code can have up to 12 characters.');
    }
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
            padding: '20px',
          }}
        >
          <SoftBox py={0} px={0}>
            <Grid container spacing={4}>
              <Grid item lg={6} sm={12} md={6} xs={12}>
                <SoftBox style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                  <SoftBox className="coupon-preview-main-box">
                    <div className="coupon-preview-second-box">
                      <div style={{ padding: '10px' }}>
                        <Typography
                          style={{ fontSize: '23px', fontWeight: '600', color: '#4b524d', textAlign: 'left' }}
                        >
                          {couponTitle}
                        </Typography>
                        <Typography style={{ fontSize: '16px', fontWeight: '200', color: '#a6a6a6' }}>
                          USE CODE:{' '}
                          <span style={{ fontSize: '27px', fontWeight: '900', marginLeft: '10px', color: '#CC994A' }}>
                            {couponCode}
                          </span>
                        </Typography>
                        <Typography style={{ fontSize: '16px', fontWeight: '200', color: '#a6a6a6' }}>
                          Validity:{' '}
                          <span style={{ fontSize: '13px', fontWeight: '200', color: '#4b524d' }}>
                            {dateFormatter(startDate)} to {dateFormatter(endDate)}
                          </span>
                        </Typography>
                      </div>
                    </div>
                    <div>
                      <Typography
                        style={{ fontSize: '50px', fontWeight: 900, color: '#fff', margin: '50px 0px 0px 50px' }}
                      >
                        {selectedDiscountType === 'Amount'
                          ? `₹${amount}`
                          : selectedDiscountType === 'Percentage'
                          ? `${percent}%`
                          : selectedDiscountType === 'Flat price'
                          ? `${flatPrice}%`
                          : '50%'}
                      </Typography>
                    </div>
                  </SoftBox>
                  {steps === 4 && (
                    <SoftBox>
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.6rem',
                          lineHeight: '1.5',
                          color: '#4b524d',
                          textAlign: 'left',
                          margin: '20px 0px 0px 10px',
                        }}
                      >
                        TERMS AND CONDITIONS
                      </Typography>
                      <ul style={{ padding: '0px 20px 0px 20px' }} className="coupons-terms-list">
                        {selectedCouponType && <li>Coupon is valid only for {selectedCouponType}.</li>}
                        {maxUsage && <li>Limited to {maxUsage} coupon per customer per transaction.</li>}
                        {selectedLocation.length !== 0 && <li>Valid only in location {locationString}.</li>}
                        {platformString && <li>Valid only on {platformString} purchases.</li>}
                        {startDate && (
                          <li>
                            Coupon valid from {dateFormatter(startDate)} to {dateFormatter(endDate)}.
                          </li>
                        )}
                        {selectedOption && (
                          <li>
                            Coupon {selectedOption === 'Yes' ? 'can' : 'cannot'} be combined with any other offer,
                            discount, or promotion.
                          </li>
                        )}

                        {terms && <li>{terms}</li>}
                      </ul>
                    </SoftBox>
                  )}
                </SoftBox>
              </Grid>
              <Grid item lg={6} sm={12} md={6} xs={12}>
                <SoftBox
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', marginBottom: '10px' }}
                >
                  <SoftButton
                    className="vendor-second-btn"
                    onClick={() => setSteps((prevSteps) => (prevSteps > 1 ? prevSteps - 1 : prevSteps))}
                    disabled={steps === 1}
                  >
                    Back
                  </SoftButton>
                  <SoftButton
                    className="vendor-add-btn"
                    onClick={() => setSteps((prevSteps) => (prevSteps < 4 ? prevSteps + 1 : prevSteps))}
                    disabled={steps === 4}
                  >
                    Next
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
                    <div className={steps === 4 ? 'stepper-item active' : 'stepper-item'} onClick={() => setSteps(4)}>
                      <div className="step-counter">4</div>
                    </div>
                  </div>
                </SoftBox>
                <hr />
                {steps === 1 && (
                  <div style={{ padding: '20px' }}>
                    <SoftBox style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          color: '#0562FB',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Coupon Type
                      </Typography>
                      <SoftSelect
                        placeholder="Select Coupon Type"
                        options={couponType}
                        onChange={(option) => {
                          handleCouponTypeChange(option);
                        }}
                      />
                    </SoftBox>

                    {selectedCouponType !== '' && (
                      <SoftBox style={{ marginTop: '20px' }}>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            lineHeight: '1.5',
                            color: '#0562FB',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
                          {`${selectedCouponType} Coupon`}
                        </Typography>
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: '#4b524d',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
                          {selectedCouponType === 'Cart Value' ? (
                            <>
                              Provide a percentage or fixed amount off on your customer purchase when the total value of
                              their cart reaches a certain threshold. For example: Use coupon{' '}
                              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>CART10</span> and get 10% off on
                              orders above Rs.6000.
                            </>
                          ) : selectedCouponType === 'Product' ? (
                            <>
                              Provide a percentage or fixed amount off on a specific product. “For example: Use coupon{' '}
                              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>PRODUCT25</span> and get Rs.25 off
                              on 2kg Toor Dal”'
                            </>
                          ) : selectedCouponType === 'Preapproved' ? (
                            <>
                              These coupons allow your customers to get a second item for free when they purchase one.
                              For example: Use coupon{' '}
                              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>FREEDOVE</span> and get 1 170ml
                              Dove shampoo free when buy 2 500ml Dove shampoo
                            </>
                          ) : (
                            ''
                          )}
                        </Typography>
                      </SoftBox>
                    )}
                  </div>
                )}
                {steps === 1 && (
                  <div style={{ padding: '0px 20px 20px 20px' }}>
                    <SoftBox style={{ marginTop: '15px' }}>
                      <div>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: '#0562FB',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
                          Coupon Title <span className="dynamic-coupon-imp">*</span>
                        </Typography>
                        <SoftInput
                          placeholder="Coupon Title"
                          style={{ width: '400px' }}
                          value={couponTitle}
                          onChange={(e) => setCouponTitle(e.target.value)}
                        />
                      </div>
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#4b524d',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Provide a quick overview of the discount or offer.
                      </Typography>
                    </SoftBox>
                    <SoftBox style={{ marginTop: '15px' }}>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          color: '#0562FB',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Coupon Code <span className="dynamic-coupon-imp">*</span>
                      </Typography>
                      <SoftInput
                        placeholder="Coupon Code"
                        style={{ width: '400px' }}
                        value={couponCode}
                        onChange={handleCouponCodeChange}
                      />
                      {errorMessage !== '' && (
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: 'red',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
                          {errorMessage}
                        </Typography>
                      )}
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#4b524d',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        An alphanumeric sequence to provide discount or special offer on a product.
                      </Typography>
                    </SoftBox>
                    {selectedCouponType === 'Product' && (
                      <SoftBox style={{ marginTop: '15px' }}>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: '#0562FB',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
                          Select the option to which coupon applied <span className="dynamic-coupon-imp">*</span>
                        </Typography>
                        <SoftBox>
                          <div>
                            <input
                              type="radio"
                              id="scheduleYes"
                              name="scheduleGroup"
                              value="Product"
                              style={{ marginRight: '10px' }}
                              checked={selectedOptionProduct === 'Product'}
                              onChange={handleRadioChangeProduct}
                            />
                            <label
                              htmlFor="scheduleYes"
                              style={{
                                fontWeight: '200',
                                fontSize: '0.8rem',
                                lineHeight: '1.5',
                                color: '#4b524d',
                                textAlign: 'left',
                                margin: '10px 0px',
                              }}
                            >
                              By Product
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="scheduleNo"
                              name="scheduleGroup"
                              value="Category"
                              style={{ marginRight: '10px' }}
                              checked={selectedOptionProduct === 'Category'}
                              onChange={handleRadioChangeProduct}
                            />
                            <label
                              htmlFor="scheduleNo"
                              style={{
                                fontWeight: '200',
                                fontSize: '0.8rem',
                                lineHeight: '1.5',
                                color: '#4b524d',
                                textAlign: 'left',
                                margin: '10px 0px',
                              }}
                            >
                              By Category
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="scheduleNo1"
                              name="scheduleGroup"
                              value="Brand"
                              style={{ marginRight: '10px' }}
                              checked={selectedOptionProduct === 'Brand'}
                              onChange={handleRadioChangeProduct}
                            />
                            <label
                              htmlFor="scheduleNo1"
                              style={{
                                fontWeight: '200',
                                fontSize: '0.8rem',
                                lineHeight: '1.5',
                                color: '#4b524d',
                                textAlign: 'left',
                                margin: '10px 0px',
                              }}
                            >
                              By Brand
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="scheduleNo2"
                              name="scheduleGroup"
                              value="Manufacturer"
                              style={{ marginRight: '10px' }}
                              checked={selectedOptionProduct === 'Manufacturer'}
                              onChange={handleRadioChangeProduct}
                            />
                            <label
                              htmlFor="scheduleNo2"
                              style={{
                                fontWeight: '200',
                                fontSize: '0.8rem',
                                lineHeight: '1.5',
                                color: '#4b524d',
                                textAlign: 'left',
                                margin: '10px 0px',
                              }}
                            >
                              By Manufacturer
                            </label>
                          </div>
                        </SoftBox>
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: '#4b524d',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
                          Fill more details in the next step.
                        </Typography>
                      </SoftBox>
                    )}
                    {selectedCouponType === 'Preapproved' && (
                      <SoftBox className="dynamic-coupon-margintop-2">
                        <Typography className="dynamic-copupon-form-heading">
                          Select the price slab of customers <span className="dynamic-coupon-imp">*</span>
                        </Typography>
                        <SoftBox className="dynamic-coupon-gap">
                          <SoftSelect
                            placeholder="Select Price Slab"
                            options={priceOptions}
                            onChange={(option) => setSelectedPriceSlab(option.value)}
                          />
                        </SoftBox>
                      </SoftBox>
                    )}
                  </div>
                )}

                {steps === 2 && (
                  <div style={{ padding: '20px' }}>
                    {selectedCouponType === 'Product' && selectedOptionProduct === 'Category' ? (
                      <SoftBox style={{ marginTop: '15px' }}>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: '#0562FB',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
                          Choose the {selectedOptionProduct}
                        </Typography>
                        <SoftBox
                          className="coupon-filter-box2"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '10px',
                            marginTop: '0px',
                          }}
                        >
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
                        </SoftBox>
                      </SoftBox>
                    ) : selectedCouponType === 'Product' && selectedOptionProduct === 'Product' ? (
                      <SoftBox style={{ marginTop: '15px' }}>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: '#0562FB',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
                          Choose the {selectedOptionProduct}
                        </Typography>
                        <SoftBox
                          className="coupon-filter-box2"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '10px',
                            marginTop: '0px',
                          }}
                        >
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
                                        if (v.variant?.barcodes?.[0]?.includes('Add')) {
                                          // purchaseIndentDataReduxHandler(v);
                                          // navigate('/products/all-products/add-products');
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
                              </>
                            );
                          })}
                        </SoftBox>
                      </SoftBox>
                    ) : selectedCouponType === 'Product' && selectedOptionProduct === 'Brand' ? (
                      <SoftBox style={{ marginTop: '15px' }}>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: '#0562FB',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
                          Choose the {selectedOptionProduct}
                        </Typography>
                        <SoftBox
                          className="coupon-filter-box2"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '10px',
                            marginTop: '0px',
                          }}
                        >
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
                        </SoftBox>
                      </SoftBox>
                    ) : selectedCouponType === 'Product' && selectedOptionProduct === 'Manufacturer' ? (
                      <SoftBox style={{ marginTop: '15px' }}>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: '#0562FB',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
                          Choose the {selectedOptionProduct}
                        </Typography>
                        <SoftBox
                          className="coupon-filter-box2"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '10px',
                            marginTop: '0px',
                          }}
                        >
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
                            <Typography className="coupon-filter-box2-typo-head">Manufacturer </Typography>
                            {brandName ? (
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
                        </SoftBox>
                      </SoftBox>
                    ) : null}
                    <SoftBox style={{ marginTop: '15px' }}>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          color: '#0562FB',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Select Discount option <span className="dynamic-coupon-imp">*</span>
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
                            <label
                              htmlFor={`platform-${platform}`}
                              style={{
                                fontWeight: '200',
                                fontSize: '0.8rem',
                                lineHeight: '1.5',
                                color: '#4b524d',
                                textAlign: 'left',
                                margin: '10px 10px',
                              }}
                            >
                              {' '}
                              {platform}
                            </label>
                          </div>
                        ))}
                      </SoftBox>
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#4b524d',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Select the right discount type to enhance sales by reducing the regular price of a product.
                      </Typography>
                    </SoftBox>
                    {selectedDiscountOption.includes('Discount in Rupees or Percentage') && (
                      <SoftBox style={{ marginTop: '15px' }}>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: '#0562FB',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
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
                            <CurrencyRupeeRoundedIcon sx={{ fontSize: '16px' }} />
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
                          <div
                            className={
                              selectedCouponType === 'Cart Value' || selectedCouponType === 'Preapproved'
                                ? 'coupon-discount-type-button-disable'
                                : selectedDiscountType === 'Flat price'
                                ? 'coupon-discount-type-button-selected'
                                : 'coupon-discount-type-button'
                            }
                            onClick={handleFlatCheck}
                          >
                            <LocalOfferRoundedIcon sx={{ fontSize: '16px' }} />
                            <Typography
                              style={{ fontWeight: '200', fontSize: '0.8rem', lineHeight: '1.5' }}
                              className={
                                selectedDiscountType === 'Flat price'
                                  ? 'coupon-discount-type-typo-selected'
                                  : 'coupon-discount-type-typo'
                              }
                            >
                              Flat Price
                            </Typography>
                          </div>
                        </SoftBox>
                        {selectedDiscountType !== '' && (
                          <SoftBox style={{ marginTop: '15px' }}>
                            <Typography
                              style={{
                                fontWeight: '200',
                                fontSize: '0.8rem',
                                lineHeight: '1.5',
                                color: '#4b524d',
                                textAlign: 'left',
                                margin: '10px 0px',
                              }}
                            >
                              {selectedDiscountType === 'Amount'
                                ? 'Amount Off'
                                : selectedDiscountType === 'Percentage'
                                ? 'Percentage Off'
                                : selectedDiscountType === 'Flat price'
                                ? 'Flat Price'
                                : null}
                            </Typography>
                            <div style={{ width: '400px' }}>
                              {selectedDiscountType === 'Amount' ? (
                                <SoftInput
                                  icon={{ component: <CurrencyRupeeRoundedIcon />, direction: 'left' }}
                                  placeholder="Enter Amount"
                                  value={amount}
                                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                                />
                              ) : selectedDiscountType === 'Percentage' ? (
                                <>
                                  <SoftInput
                                    icon={{ component: 'percent', direction: 'right' }}
                                    placeholder="Enter Percentage"
                                    value={percent}
                                    onChange={(e) => setPercent(parseFloat(e.target.value))}
                                  />
                                  <Typography
                                    style={{
                                      fontWeight: '200',
                                      fontSize: '0.8rem',
                                      lineHeight: '1.5',
                                      color: '#4b524d',
                                      textAlign: 'left',
                                      margin: '10px 0px',
                                    }}
                                  >
                                    Discount Upto
                                  </Typography>
                                  <SoftInput
                                    icon={{ component: <CurrencyRupeeRoundedIcon />, direction: 'left' }}
                                    placeholder="Enter Discount Upto"
                                    value={discountUptoForPercent}
                                    onChange={(e) => setDiscountUptoForPercent(parseFloat(e.target.value))}
                                  />
                                </>
                              ) : selectedDiscountType === 'Flat price' ? (
                                <SoftInput
                                  icon={{ component: 'percent', direction: 'right' }}
                                  placeholder="Enter price"
                                  value={flatPrice}
                                  onChange={(e) => setFlatPrice(parseFloat(e.target.value))}
                                />
                              ) : null}
                            </div>
                          </SoftBox>
                        )}
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: '#4b524d',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
                          Discount type to reduce a product's regular price.
                        </Typography>
                      </SoftBox>
                    )}
                    {selectedDiscountOption.includes('Offer free product') && (
                      <SoftBox style={{ marginTop: '15px' }}>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: '#0562FB',
                            textAlign: 'left',
                            margin: '10px 0px',
                          }}
                        >
                          Choose the Product that Customer Gets
                        </Typography>
                        <SoftTypography
                          style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: '#0562FB',
                            textAlign: 'right',
                            cursor: 'pointer',
                          }}
                          onClick={handleClick}
                        >
                          + Add more
                        </SoftTypography>
                        <SoftBox
                          className="coupon-filter-box2"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '10px',
                            marginTop: '0px',
                          }}
                        >
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
                                  <Typography className="coupon-filter-box2-typo-head">Discount Type</Typography>
                                  <div className="dynamic-coupon-product-box">
                                    <SoftSelect
                                      // name="discountType"
                                      options={discountFreeBieOptions}
                                      onChange={(option) => handleOptionChange2(option, i)}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">Discount Value</Typography>
                                  <div className="dynamic-coupon-product-box">
                                    <SoftInput
                                      type="text"
                                      name="discountValue"
                                      value={x?.discountValue}
                                      onChange={(e) => handleChange1(e, i)}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Typography className="coupon-filter-box2-typo-head">Discount Upto</Typography>
                                  <div className="dynamic-coupon-product-box">
                                    <SoftInput
                                      type="text"
                                      name="discountUpto"
                                      value={x?.discountUpto}
                                      onChange={(e) => handleChange1(e, i)}
                                    />
                                    <SoftBox className="close-icons" style={{ cursor: 'pointer' }}>
                                      <Grid item>
                                        <CloseIcon onClick={(e) => handleRemove(e, x, i)} />
                                      </Grid>
                                    </SoftBox>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </SoftBox>
                      </SoftBox>
                    )}
                  </div>
                )}

                {steps === 3 && (
                  <div style={{ padding: '20px' }}>
                    <SoftBox style={{ marginTop: '15px' }}>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          color: '#0562FB',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Minimum Cart Value <span className="dynamic-coupon-imp">*</span>
                      </Typography>
                      <SoftInput
                        placeholder="Minimum Cart Value"
                        style={{ width: '400px' }}
                        icon={{ component: <CurrencyRupeeRoundedIcon />, direction: 'left' }}
                        onChange={(e) => setMinCartValue(parseFloat(e.target.value))}
                      />
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#4b524d',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Minimum amount to use the coupon.
                      </Typography>
                    </SoftBox>
                    <SoftBox style={{ marginTop: '15px' }}>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          color: '#0562FB',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Maximum Budget <span className="dynamic-coupon-imp">*</span>
                      </Typography>
                      <SoftInput
                        placeholder="Maximum Budget"
                        style={{ width: '400px' }}
                        onChange={(e) => setMaxBudget(parseFloat(e.target.value))}
                      />
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#4b524d',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Budget allocated for creating coupons.
                      </Typography>
                    </SoftBox>
                    <SoftBox style={{ marginTop: '15px' }}>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          color: '#0562FB',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Total coupons to be issued <span className="dynamic-coupon-imp">*</span>
                      </Typography>
                      <SoftInput
                        placeholder="Total coupons to be issued"
                        style={{ width: '400px' }}
                        onChange={(e) => setTotalCoupons(parseFloat(e.target.value))}
                      />
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#4b524d',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Predefined quantity of coupons to distribute in coupon campaign.
                      </Typography>
                    </SoftBox>
                  </div>
                )}
                {steps === 4 && (
                  <SoftBox style={{ marginTop: '15px', padding: '20px' }}>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'left',
                      }}
                    >
                      Terms and Conditions
                    </Typography>
                    <SoftBox style={{ marginTop: '15px' }}>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          color: '#0562FB',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Coupon Validity
                      </Typography>
                      <SoftBox
                        className="coupon-filter-box2"
                        style={{
                          flexDirection: 'column',
                          gap: '10px',
                          marginTop: '0px',
                          alignItems: 'flex-start',
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
                              className="time-input-static-coupon"
                            />
                          </SoftBox>
                        </div>
                        <div>
                          <Typography className="coupon-filter-box2-typo-head">Time Upto</Typography>
                          <SoftBox>
                            <SoftBox>
                              <input
                                type="time"
                                id="timeOutput"
                                value={validTimeUpto}
                                onChange={handleTimeUptoChange}
                                className="time-input-static-coupon"
                              />
                            </SoftBox>
                          </SoftBox>
                        </div>
                      </SoftBox>
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#4b524d',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Set the validity of coupon
                      </Typography>
                    </SoftBox>
                    <SoftBox style={{ marginTop: '15px' }}>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          color: '#0562FB',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Sales Channel <span className="dynamic-coupon-imp">*</span>
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
                            <label
                              htmlFor={`platform-${platform}`}
                              style={{
                                fontWeight: '200',
                                fontSize: '0.8rem',
                                lineHeight: '1.5',
                                color: '#4b524d',
                                textAlign: 'left',
                                margin: '10px 10px',
                              }}
                            >
                              {' '}
                              {platform}
                            </label>
                          </div>
                        ))}
                      </SoftBox>
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#4b524d',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Specify the sales channels where the coupons can be redeemed.
                      </Typography>
                    </SoftBox>
                    <SoftBox style={{ marginTop: '15px' }}>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          color: '#0562FB',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Combine with others coupons/offers
                      </Typography>
                      <SoftBox style={{ display: 'flex', gap: '40px' }}>
                        <div>
                          <input
                            type="radio"
                            id="scheduleYes"
                            name="scheduleGroup"
                            value="Yes"
                            style={{ marginRight: '10px' }}
                            checked={selectedOption === 'Yes'}
                            onChange={handleRadioChange}
                          />
                          <label
                            htmlFor="scheduleYes"
                            style={{
                              fontWeight: '200',
                              fontSize: '0.8rem',
                              lineHeight: '1.5',
                              color: '#4b524d',
                              textAlign: 'left',
                              margin: '10px 0px',
                            }}
                          >
                            Yes
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="scheduleNo"
                            name="scheduleGroup"
                            value="No"
                            style={{ marginRight: '10px' }}
                            checked={selectedOption === 'No'}
                            onChange={handleRadioChange}
                          />
                          <label
                            htmlFor="scheduleNo"
                            style={{
                              fontWeight: '200',
                              fontSize: '0.8rem',
                              lineHeight: '1.5',
                              color: '#4b524d',
                              textAlign: 'left',
                              margin: '10px 0px',
                            }}
                          >
                            No
                          </label>
                        </div>
                      </SoftBox>
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#4b524d',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Coupon can be combined with other coupons/offers or not.
                      </Typography>
                    </SoftBox>
                    <SoftBox style={{ marginTop: '15px' }}>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          color: '#0562FB',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Locations <span className="dynamic-coupon-imp">*</span>
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
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#4b524d',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Locations where a coupon can be redeemed or utilized.
                      </Typography>
                    </SoftBox>
                    <SoftBox style={{ marginTop: '15px' }}>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          color: '#0562FB',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Maximum usage of coupon per customer
                      </Typography>
                      <SoftInput
                        placeholder="Maximum usage of coupon per customer"
                        style={{ width: '400px' }}
                        onChange={(e) => setMaxUsage(parseFloat(e.target.value))}
                      />
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#4b524d',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        Maximum number of times a single customer can use a particular coupon.
                      </Typography>
                    </SoftBox>
                    {/* <SoftInput placeholder="Terms and Conditions" style={{ width: '400px', height: "100px" }} /> */}
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      Others
                    </Typography>
                    <SoftBox className="text-half-area" style={{ borderRadius: '10px' }}>
                      <TextareaAutosize
                        className="text-area"
                        aria-label="empty textarea"
                        placeholder="Terms and Conditions"
                        onChange={(e) => setTerms(e.target.value)}
                      />
                    </SoftBox>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      Provide other terms and conditions.
                    </Typography>
                  </SoftBox>
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
                    <SoftButton
                      // variant="gradient"
                      color="info"
                      className="vendor-add-btn"
                      onClick={handleSave}
                    >
                      {loader ? (
                        <CircularProgress
                          size={18}
                          sx={{
                            color: '#fff',
                          }}
                        />
                      ) : (
                        <>Save</>
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

export default CreateStaticCouponForm;
