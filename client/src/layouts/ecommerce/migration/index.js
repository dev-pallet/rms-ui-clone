import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Alert,
  Box,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftInput from '../../../components/SoftInput';
import SoftSelect from '../../../components/SoftSelect';
import SoftTypography from '../../../components/SoftTypography';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';
import {
  getAllBulkProducts,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
  getProductIdByBarcode,
} from '../../../config/Services';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import './migration.css';

const Migration = () => {
  // State hooks
  sideNavUpdate();
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [categoryLevel1List, setCategoryLevel1List] = useState([]);
  const [categoryLevel2List, setCategoryLevel2List] = useState([]);
  const [inputs, setInputs] = useState([
    { barcode: '', title: '', mrp: '', purchasePrice: '', salePrice: '', openingStock: '' },
  ]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedLevel1, setSelectedLevel1] = useState('');
  const [selectedLevel2, setSelectedLevel2] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [igst, setIgst] = useState('');
  const [purchaseMargin, setPurchaseMargin] = useState('');
  const [showOpeningStock, setShowOpeningStock] = useState(false);
  const [showSalePrice, setShowSalePrice] = useState(true);
  const [autoCreateBatches, setAutoCreateBatches] = useState(true);
  const [addAveragePurchaseMargin, setAddAveragePurchaseMargin] = useState(false);
  const [continueSellingNegativeStock, setContinueSellingNegativeStock] = useState(false);
  const [addOption, setAddOption] = useState('');
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const fullName = localStorage.getItem('user_name');
  const [lastInputTime, setLastInputTime] = useState(null);
  const typingTimeoutRef = useRef(null);
  const [barcodeError, setBarcodeError] = useState('');
  const newBarcodeRef = useRef(null);
  const newTitleRef = useRef(null);
  const titleRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    loadMainCategories(currentPage);
  }, [currentPage]);

  const loadMainCategories = (page) => {
    const payload = {
      page: page,
      pageSize: 100,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type : ['APP']

    };
    getAllMainCategory(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const newCategories = response.map((e) => ({
            value: e?.mainCategoryId,
            label: e?.categoryName,
          }));
          setMainCategoryList((prevList) => [...prevList, ...newCategories]);
          setHasMorePages(response.length === 10);
        } else {
          setHasMorePages(false);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
      });
  };

  // Fetch Level 1 categories
  useEffect(() => {
    if (selectedMainCategory) {
      const payload = {
        page: 1,
        pageSize: 100,
        mainCategoryId: [selectedMainCategory],
        sourceId: [orgId],
        sourceLocationId: [locId],
        type : ['APP']
      };
      getAllLevel1Category(payload).then((response) => {
        const arr = response?.data?.data?.results || [];
        const level1Categories = arr.map(({ level1Id, categoryName }) => ({
          value: level1Id,
          label: categoryName,
        }));
        setCategoryLevel1List(level1Categories);
      });
    }
  }, [selectedMainCategory]);

  // Fetch Level 2 categories
  useEffect(() => {
    if (selectedLevel1) {
      const payload = {
        page: 1,
        pageSize: 100,
        level1Id: [selectedLevel1],
        sourceId: [orgId],
        sourceLocationId: [locId],
        type : ['APP']
      };
      getAllLevel2Category(payload).then((response) => {
        const arr = response?.data?.data?.results || [];
        const level2Categories = arr.map(({ level2Id, categoryName, hsnCode, igst }) => ({
          value: level2Id,
          label: categoryName,
          hsnCode,
          igst,
        }));
        setCategoryLevel2List(level2Categories);
      });
    }
  }, [selectedLevel1]);

  // Handle category changes
  const handleCategoryChange =
    (setter, clearCategorySetter, resetCategoryLists = true) =>
    (option) => {
      setter(option.value);
      if (resetCategoryLists) {
        clearCategorySetter([]);
      }
    };

  const handleLevel2Change = (option) => {
    setSelectedLevel2(option.value);
    setHsnCode(option.hsnCode || '');
    setIgst(option.igst || '');
  };

  const handleInputChange = (index, field, value) => {
    setInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs[index][field] = value;

      if (field === 'barcode') {
        // Check if the barcode is unique in the current inputs
        const isDuplicate = updatedInputs.some((input, idx) => idx !== index && input.barcode === value);

        if (isDuplicate) {
          showSnackbar(`Hey, this barcode ${value} is already entered!`, 'error');
        } else {
          setBarcodeError('');

          // Clear the previous typing timeout
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }

          // Set the current time as the last input time
          setLastInputTime(Date.now());

          // Set a new timeout to check if the user stops typing for 3 seconds
          typingTimeoutRef.current = setTimeout(() => {
            const now = Date.now();

            if (now - lastInputTime >= 3000) {
              // Call the API to check if the barcode exists in the backend
              getProductIdByBarcode(value, locId)
                .then((response) => {
                  if (response?.status === 'success' || response?.data?.data?.statusCode === 200) {
                    showSnackbar(`Hey, this barcode ${value} product is already there in the Store!`, 'error');

                    // Reset the barcode field
                    updatedInputs[index].barcode = '';
                    setInputs(updatedInputs);
                  } else if (response?.data?.data?.statusCode === 10001) {
                  }
                })
                .catch((error) => {
                  showSnackbar('Error checking barcode, please try again.', 'error');
                });
            }
          }, 3000); // Adjust the timeout if needed

          // If the full barcode is scanned and it's at the last index, add a new row immediately
          if (value.trim().length >= 8 && index === prevInputs.length - 1) {
            updatedInputs.push({ barcode: '', title: '', mrp: '', salePrice: '', openingStock: '' });

            setTimeout(() => {
              if (titleRefs.current[index]) {
                titleRefs.current[index].focus(); // Focus on the Product Title field in the same row
              }
            }, 0);
          }
        }
      }

      return updatedInputs;
    });
  };

  const handleAddMoreDetails = () => {
    setInputs((prevInputs) => {
      if (prevInputs.length < 24) {
        return [...prevInputs, { barcode: '', title: '', mrp: '', purchasePrice: '', salePrice: '', openingStock: '' }];
      } else {
        showSnackbar('Hey! For now you can create Maximum of 25 Barcodes.', 'error');
        return prevInputs;
      }
    });
  };

  const handleRemoveInput = (index) => {
    setInputs((prevInputs) => prevInputs.filter((_, i) => i !== index));
  };

  const handleSaveDetails = async () => {
    if (!selectedLevel2) return;

    if (!selectedLevel2) return;

    setLoading(true);
    if (!orgId || !locId || !uidx || !fullName || inputs.some(input => !input.title || !input.mrp || !input.barcode)) {
      showSnackbar('Please fill in all required fields', 'error');
      setLoading(false);
      return;
    }

    const payload = {
      categoryLevel3Id: selectedLevel2,
      categoryLevel3Name: categoryLevel2List.find((cat) => cat.value === selectedLevel2)?.label || '',
      addPurchasePrice: addOption === 'purchasePrice',
      addOpeningStock: showOpeningStock,
      averagePurchaseMargin: parseFloat(purchaseMargin) || 0,
      continueSellingNegativeStock,
      autoCreateBatches,
      taxCode: '',
      taxName: 'GST',
      taxValue: igst,
      taxType: 'GST',
      storeId: orgId,
      storeName: orgId,
      storeLocationName: locId,
      storeType: '',
      storeLocationId: locId,
      createdBy: uidx,
      createdByName: fullName,
      bulkProducts: inputs.map((input) => {
        const price = !showSalePrice ? parseFloat(input.mrp) || 0 : parseFloat(input.salePrice) || 0;
        return {
          name: input.title,
          barcode: input.barcode,
          purchasePrice:
            addOption === 'purchasePrice'
              ? input.mrp - (input.mrp * purchaseMargin) / 100
              : parseFloat(input.mrp) || 0,
          mrp: parseFloat(input.mrp) || 0,
          sellingPrice: price,
          openingStock: parseFloat(input.openingStock) || 0,
        };
      }),
    };

    try {
      // Set loading state if applicable
      setLoading(true);

      const response = await getAllBulkProducts(payload);

      // Handle success, show snackbar
      showSnackbar(response?.data?.data?.message || 'Migration of Products Successful', 'success');

      // Set loading to false when the API call is completed
      setLoading(false);
      setPurchaseMargin('');
      setAddOption('');
      setShowOpeningStock(false);
      setShowSalePrice(true);
      setInputs([{ barcode: '', title: '', mrp: '', purchasePrice: '', salePrice: '', openingStock: '' }]);
    } catch (error) {
      // Handle error, show snackbar
      showSnackbar(error?.response?.data?.message || 'Some error occurred', 'error');

      // Set loading to false on error
      setLoading(false);
    }
  };

  const handleCancelDetails = () => {
    setSelectedMainCategory('');
    setSelectedLevel1('');
    setSelectedLevel2('');
    setHsnCode('');
    setIgst('');
    setPurchaseMargin('');
    setAddOption('');
    setShowOpeningStock(false);
    setShowSalePrice(true);
    setInputs([{ barcode: '', title: '', mrp: '', purchasePrice: '', salePrice: '', openingStock: '' }]);

    // Reset category lists
    setCategoryLevel1List([]);
    setCategoryLevel2List([]);
    setAutoCreateBatches(false);
    setContinueSellingNegativeStock(false);
    setAddAveragePurchaseMargin(false);
  };

  const handleIgst = (value) => {
    setIgst(value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <SoftBox p={2}>
        <Stack sx={{ width: '100%', mt: 2, mb: 2 }} spacing={2} variant="outlined">
          <Alert
            severity="info"
            sx={{
              fontWeight: 'bold',
              fontSize: '0.8rem',
            }}
          >
            <span
              style={{
                animation: 'glowColor 2.5s ease-in-out infinite',
              }}
            >
              Hey Pallet user, this screen is only for creating standard products. <br />
              It is not used for loose items such as fruits and vegetables, or for weight-scale products. If you want to
              add loose products, please use the Product creation page and the GRN process.
            </span>
          </Alert>
        </Stack>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <SoftTypography fontWeight="bold" fontSize="1.1rem">
            Scan and Add the products
          </SoftTypography>
        </div>

        {/* First Card Component */}
        <Card variant="outlined" sx={{ p: 3 }} className="addbrand-Box">
          <div className="element-flex" style={{ margin: '10px 0px 0px 0px' }}>
            <InputLabel className="labeltitle">Category</InputLabel>
            <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
          </div>

          <Grid container spacing={2}>
            {/* Level 1 */}
            <Grid item xs={12} sm={4} lg={4}>
              <SoftBox style={{ width: '95%' }}>
                <div className="duplicate-warning-msg">
                  Level 1<span style={{ color: 'red' }}> *</span> {/* Required Field Asterisk */}
                </div>
                <SoftSelect
                  size="small"
                  className="select-box-category"
                  placeholder="Select Main Category"
                  value={mainCategoryList.find((option) => option.value === selectedMainCategory) || ''}
                  options={mainCategoryList}
                  onChange={handleCategoryChange(setSelectedMainCategory, setCategoryLevel1List)}
                  sx={{
                    '.MuiOutlinedInput-root': {
                      borderColor: !selectedMainCategory ? 'red' : '', // Highlight in red if not filled
                    },
                  }}
                />
              </SoftBox>
            </Grid>

            {/* Level 2 */}
            <Grid item xs={12} md={4} lg={4}>
              <SoftBox style={{ width: '95%' }}>
                <div className="duplicate-warning-msg">
                  Level 2<span style={{ color: 'red' }}> *</span> {/* Required Field Asterisk */}
                </div>
                <SoftSelect
                  size="small"
                  className="select-box-category"
                  placeholder="Select Next Category"
                  value={categoryLevel1List.find((option) => option.value === selectedLevel1) || ''}
                  options={categoryLevel1List}
                  onChange={handleCategoryChange(setSelectedLevel1, setCategoryLevel2List)}
                  sx={{
                    '.MuiOutlinedInput-root': {
                      borderColor: !selectedLevel1 ? 'red' : '',
                    },
                  }}
                />
              </SoftBox>
            </Grid>

            {/* Level 3 */}
            <Grid item xs={12} md={4} lg={4}>
              <SoftBox style={{ width: '95%' }}>
                <div className="duplicate-warning-msg">
                  Level 3<span style={{ color: 'red' }}> *</span>
                </div>
                <SoftSelect
                  size="small"
                  className="select-box-category"
                  placeholder="Select Last Category"
                  value={categoryLevel2List.find((option) => option.value === selectedLevel2) || ''}
                  options={categoryLevel2List}
                  onChange={handleLevel2Change}
                  sx={{
                    '.MuiOutlinedInput-root': {
                      borderColor: !selectedLevel2 ? 'red' : '',
                    },
                  }}
                />
              </SoftBox>
            </Grid>
          </Grid>

          <Grid container mt={1} direction="row" justifyContent="flex-start" alignItems="center" gap="10px">
            {/* HSN Code Section */}
            <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
              <SoftBox className="common-display-flex">
                <div className="duplicate-warning-msg"> HSN</div>
                <SoftInput
                  size="small"
                  className="select-box-category"
                  placeholder="HSN CODE"
                  variant="outlined"
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                  sx={{ width: '150px' }}
                  InputProps={{
                    inputProps: { min: 0, max: 100, step: 'any' },
                    sx: {
                      '& input::placeholder': {
                        fontSize: '0.6rem',
                      },
                    },
                  }}
                />
              </SoftBox>
            </Grid>
            {/* GST % Section */}
            <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
              <SoftBox className="common-display-flex">
                <div className="duplicate-warning-msg"> GST%</div>
                <SoftSelect
                  size="small"
                  className="select-box-category"
                  variant="outlined"
                  placeholder="Select GST"
                  name="igst"
                  {...(igst
                    ? {
                        value: {
                          value: igst,
                          label: `${igst}%`,
                        },
                      }
                    : {
                        value: {
                          value: '',
                          label: 'Select GST',
                        },
                      })}
                  options={[
                    { value: 0, label: '0%' },
                    { value: 5, label: '5%' },
                    { value: 12, label: '12%' },
                    { value: 18, label: '18%' },
                    { value: 28, label: '28%' },
                  ]}
                  onChange={(option) => {
                    handleIgst(option.value);
                  }}
                />
              </SoftBox>
            </Grid>
          </Grid>

          {/* Add with Opening Stock */}
          <Box mt={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOpeningStock}
                  onChange={() => setShowOpeningStock((prev) => !prev)}
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 18 }, // Smaller checkbox size
                    color: 'primary.main', // Add a primary color to make it more impressive
                  }}
                />
              }
              label={<div className="duplicate-warning-msg">Add with Opening Stock</div>}
              sx={{
                maxWidth: 'fit-content',
                marginRight: '8px',
              }}
            />
          </Box>

          {/* Add Options */}
          <Box mt={2}>
            <RadioGroup value={addOption} onChange={(e) => setAddOption(e.target.value)} row>
              <FormControlLabel
                value="purchasePrice"
                control={
                  <Radio
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 18 },
                      color: 'primary.main',
                    }}
                  />
                }
                label={<div className="duplicate-warning-msg">Add with Purchase Price</div>}
              />
              <FormControlLabel
                value="purchaseLater"
                control={
                  <Radio
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 18 },
                      color: 'primary.main',
                    }}
                  />
                }
                label={<div className="duplicate-warning-msg">Add with MRP</div>}
              />
            </RadioGroup>
          </Box>

          {/* Conditionally render Add Average Purchase Margin based on selected option */}
          {addOption === 'purchasePrice' && (
            <Box mt={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addAveragePurchaseMargin}
                    onChange={() => setAddAveragePurchaseMargin((prev) => !prev)}
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 18 },
                      color: 'primary.main',
                    }}
                  />
                }
                label={<div className="duplicate-warning-msg">Add Average Purchase Margin %</div>}
              />

              {addAveragePurchaseMargin && (
                <SoftInput
                  size="small"
                  className="select-box-category"
                  value={purchaseMargin}
                  sx={{ maxWidth: '260px', marginLeft: 1 }}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Check if the value is either '0', an empty string, or a valid number between 1 and 100
                    if (value === '0' || value === '' || (/^(0|[1-9]\d*)$/.test(value) && Number(value) <= 100)) {
                      setPurchaseMargin(value);
                    }
                  }}
                  placeholder="Average Purchase Margin"
                  variant="outlined"
                  InputProps={{
                    inputProps: { min: 0, max: 100, step: 'any' },
                    sx: {
                      '& input::placeholder': {
                        fontSize: '0.6rem',
                      },
                    },
                  }}
                />
              )}
            </Box>
          )}

          {/* Checkboxes */}
          <Box mt={2} display="flex" justifyContent="space-between">
            <FormControlLabel
              control={
                <Checkbox
                  checked={autoCreateBatches}
                  onChange={() => setAutoCreateBatches((prev) => !prev)}
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 18 },
                    color: 'primary.main',
                  }}
                />
              }
              label={<div className="duplicate-warning-msg">Auto Create Batches</div>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={continueSellingNegativeStock}
                  onChange={() => setContinueSellingNegativeStock((prev) => !prev)}
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 18 },
                    color: 'primary.main',
                  }}
                />
              }
              label={<div className="duplicate-warning-msg">Continue Selling Negative Stock</div>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!showSalePrice}
                  onChange={() => setShowSalePrice((prev) => !prev)}
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 18 },
                    color: 'primary.main',
                  }}
                />
              }
              label={<div className="duplicate-warning-msg">Selling Price same as MRP</div>}
            />
          </Box>
        </Card>

        <Card variant="outlined" sx={{ p: 3, mt: 2, maxHeight: '600px', overflow: 'auto' }} className="addbrand-Box">
          {/* Header Section */}
          <div
            className="element-flex"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            {/* Left-aligned: Add Product */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <InputLabel className="labeltitle">Add Product</InputLabel>
              <InfoOutlinedIcon style={{ color: '#367df3', marginLeft: '8px' }} fontSize="small" />
            </div>

            {/* Right-aligned: Number of Barcodes Added */}
            <InputLabel className="inputLabel-style" sx={{ fontSize: '0.8rem' }}>
              Number of Barcodes Added: {inputs.filter((input) => input.barcode.trim() !== '').length}
            </InputLabel>
          </div>

          {/* Second Card with Inputs */}
          <Card
            sx={{
              p: 1,
              overflow: 'hidden', // Prevent scrolling on the outer card
            }}
          >
            {/* Sticky Input Labels */}
            <Grid container spacing={0.5} wrap="nowrap">
              <Grid item xs={2} sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
                <InputLabel className="inputLabel-style">Barcode (EAN)</InputLabel>
              </Grid>
              <Grid item xs={2} sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
                <InputLabel className="inputLabel-style">Product Title</InputLabel>
              </Grid>
              <Grid item xs={1.5} sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
                <InputLabel className="inputLabel-style">MRP</InputLabel>
              </Grid>
              {addOption === 'purchasePrice' && (
                <Grid item xs={2} sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
                  <InputLabel className="inputLabel-style">Purchase Price</InputLabel>
                </Grid>
              )}
              {showSalePrice && (
                <Grid item xs={2} sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
                  <InputLabel className="inputLabel-style">Sale Price</InputLabel>
                </Grid>
              )}
              {showOpeningStock && (
                <Grid item xs={2} sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white' }}>
                  <InputLabel className="inputLabel-style">Opening Stock</InputLabel>
                </Grid>
              )}
            </Grid>

            {/* Scrollable Text Fields */}
            <div
              style={{
                overflowY: 'auto',
                maxHeight: '250px',
                scrollbarWidth: 'thin',
              }}
            >
              {inputs.map((input, index) => (
                <Grid container spacing={0.5} key={index} alignItems="center" wrap="nowrap">
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      value={input.barcode}
                      onChange={(e) => handleInputChange(index, 'barcode', e.target.value)}
                      placeholder="Barcode"
                      variant="outlined"
                      error={!!barcodeError}
                      helperText={barcodeError}
                      inputRef={index === inputs.length - 1 ? newBarcodeRef : null}
                      size="small"
                      sx={{ width: '90%', marginTop: '1px' }}
                      InputProps={{
                        sx: {
                          '& input::placeholder': {
                            fontSize: '0.6rem',
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      value={input.title}
                      onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                      placeholder="Product"
                      variant="outlined"
                      inputRef={(el) => (titleRefs.current[index] = el)}
                      size="small"
                      sx={{ width: '80%', marginTop: '1px' }}
                      InputProps={{
                        sx: {
                          '& input::placeholder': {
                            fontSize: '0.6rem',
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={1.5}>
                    <TextField
                      fullWidth
                      type="number"
                      value={input.mrp}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange(index, 'mrp', value >= 0 ? value : 0);
                      }}
                      placeholder="MRP"
                      variant="outlined"
                      size="small"
                      onWheel={(e) => e.target.blur()}
                      sx={{ width: '90%', marginTop: '1px' }}
                      InputProps={{
                        inputProps: { min: 0 },
                        sx: {
                          '& input::placeholder': {
                            fontSize: '0.6rem',
                          },
                        },
                      }}
                    />
                  </Grid>

                  {/* Purchase Price (if applicable) */}
                  {addOption === 'purchasePrice' && (
                    <Grid item xs={2}>
                      <TextField
                        size="small"
                        type="number"
                        value={input.mrp - (input.mrp * purchaseMargin) / 100}
                        onChange={(e) => handleInputChange(index, 'purchasePrice', e.target.value)}
                        placeholder="Purchase Price"
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                          sx: {
                            '& input::placeholder': {
                              fontSize: '0.6rem',
                            },
                          },
                        }}
                        sx={{ width: '90%', marginTop: '1px' }}
                      />
                    </Grid>
                  )}

                  {/* Sale Price (if applicable) */}
                  {showSalePrice && (
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        value={input.salePrice}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^0+$/.test(value)) {
                            value = '0';
                          }
                          // Ensure sale price does not exceed MRP
                          if (Number(value) <= input.mrp) {
                            handleInputChange(index, 'salePrice', value);
                            handleInputChange(index, 'salePriceError', '');
                          } else {
                            handleInputChange(index, 'salePriceError', 'Sale Price cannot exceed MRP');
                          }
                        }}
                        placeholder="Sale Price"
                        variant="outlined"
                        size="small"
                        sx={{ width: '90%', marginTop: '1px' }}
                        InputProps={{
                          inputProps: { min: 0 },
                          sx: {
                            '& input::placeholder': {
                              fontSize: '0.6rem',
                            },
                          },
                        }}
                      />
                    </Grid>
                  )}

                  {/* Opening Stock (if applicable) */}
                  {showOpeningStock && (
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        value={input.openingStock}
                        onChange={(e) => handleInputChange(index, 'openingStock', e.target.value)}
                        placeholder="Open Stock"
                        variant="outlined"
                        size="small"
                        sx={{ width: '90%', marginTop: '1px' }}
                        InputProps={{
                          sx: {
                            '& input::placeholder': {
                              fontSize: '0.6rem',
                            },
                          },
                        }}
                      />
                    </Grid>
                  )}

                  {/* Delete Icon */}
                  <Grid item>
                    <IconButton sx={{ color: red[500] }} onClick={() => handleRemoveInput(index)} aria-label="remove">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </div>
          </Card>

          {/* Bottom Section with "Add More" and Buttons */}
          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            {/* Add More Details Button */}
            <SoftTypography
              onClick={handleAddMoreDetails}
              className="add-more-text"
              component="label"
              variant="caption"
              fontWeight="bold"
              sx={{ marginLeft: '15px' }}
            >
              + Add More
            </SoftTypography>

            {/* Cancel and Save Buttons */}
            <Box display="flex" gap={1}>
              <SoftButton
                variant="contained"
                onClick={handleCancelDetails}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary',
                  border: 'primary',
                }}
              >
                Cancel
              </SoftButton>
              <SoftButton
                variant="contained"
                color="primary"
                onClick={handleSaveDetails}
                disabled={!selectedLevel2 || loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
              </SoftButton>
            </Box>
          </Box>
        </Card>
      </SoftBox>
    </DashboardLayout>
  );
};

export default Migration;
