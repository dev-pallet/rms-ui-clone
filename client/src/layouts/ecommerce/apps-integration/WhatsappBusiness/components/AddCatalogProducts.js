import { Box, CircularProgress, IconButton, Popover, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftSelect from '../../../../../components/SoftSelect';
import Spinner from '../../../../../components/Spinner';
import {
  getAllMainCategory,
  getAllProductsV2,
  getAllProductsV2New,
  whatsappBusinessAddProducts,
} from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import {
  ClearSoftInput,
  CopyToClipBoardValue,
  productIdByBarcode,
  textFormatter,
} from '../../../Common/CommonFunction';
import '../whatsappBusiness.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SoftInput from '../../../../../components/SoftInput';

const AddCatalogProducts = ({ selectedTab, setSelectedTab }) => {
  const [mainCatArr, setMainCatArr] = useState([]);
  const showSnackbar = useSnackbar();
  const [mainCatSelected, setMainCatSelected] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [productName, setProductName] = useState('');
  const [barcodeNo, setBarcodeNo] = useState([]);
  const [searchProductName, setSearchProductName] = useState([]);

  const navigate = useNavigate();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const AppAccountId = localStorage.getItem('AppAccountId');

  const [selectedGTINs, setSelectedGTINs] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCatLabel, setSelectedCatLabel] = useState('');
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState();
  const [pageSize, setPageSize] = useState(10); // Page size
  const [allSelectedGtins, setAllSelectedGtins] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchAndAdd = () => {
    if (selectedProducts.length > 0) {
      for (let i = 0; i < selectedProducts.length; i++) {
        if (selectedProducts[i].title === selectedCatLabel) {
          selectedProducts[i].items = selectedGTINs;
        }
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleMainCategory = () => {
    const payload = {
      page: 1,
      pageSize: 50,
      accountId: [AppAccountId],
      sourceId: [orgId],
      sourceLocationId: [locId],
      sourceType: ['RETAIL'],
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
          setMainCatArr(arr[0]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  useEffect(() => {
    handleMainCategory();
  }, []);

  let lowerCaseLocId = locId.toLocaleLowerCase();

  const filterObject = {
    page: page,
    names: [],
    brands: [],
    barcode: [],
    manufacturers: [],
    query: '',
    appCategories: {
      categoryLevel1: mainCatSelected,
      categoryLevel2: [],
      categoryLevel3: [],
    },
    productStatus: [],
    preferredVendors: [],
    sortByPrice: 'DEFAULT',
    // sortByCreatedAt: 'DESC',
    // displayWithoutInventoryProducts: true,
    storeLocations: [locId],
    pageSize: pageSize,
  };
  const d_img = 'https://i.imgur.com/dL4ScuP.png';

  const handleMainCat = (option) => {
    const input = option.value;
    if (input) {
      setSelectedCatLabel(option.label);
      setMainCatSelected([option.label]);
      setRowData([]);
      setSelectedGTINs([]);
      setAllSelectedGtins([]);

      const newSelectedData = {
        title: option.label,
        items: selectedGTINs,
      };

      setSelectedProducts((prev) => [...prev, newSelectedData]);
    }
  };

  const fetchAllProducts = (payload) => {
    getAllProductsV2New(payload).then(
      function (responseTxt) {
        setLoading(false);
        const dataArr = responseTxt?.data?.data?.data?.data;
        setTotalData((prevTotalData) => dataArr?.data?.totalResults);
        const newDataRow = dataArr?.map((row, index) => {
          return {
            id: index,
            image:
              row?.variants[0]?.images?.front?.trim() ||
              row?.variants[0]?.images?.back?.trim() ||
              row?.variants[0]?.images?.top_left?.trim() ||
              row?.variants[0]?.images?.top_right?.trim() ||
              d_img,
            product: textFormatter(row?.name),
            gtin: row?.variants,
            brand: textFormatter(row?.companyDetail?.brand) || 'NA',
            productId: row?.id,
          };
        });

        setRowData(newDataRow);
      },
      [mainCatSelected, page],
    );
  };

  useEffect(() => {
    fetchAllProducts(filterObject);
  }, [mainCatSelected, page]);

  const handleAddToCart = (gtin) => {
    // Check if the length is less than 300 before allowing addition
    if (allSelectedGtins.length < 300) {
      if (selectedGTINs.includes(gtin) || allSelectedGtins.includes(gtin)) {
        // If it is, remove it from the array
        setSelectedGTINs((prevGTINs) => prevGTINs.filter((item) => item !== gtin));
        setAllSelectedGtins((prevGTINs) => prevGTINs.filter((item) => item !== gtin));
      } else {
        // If it's not, add it to the array
        setSelectedGTINs((prevGTINs) => [...prevGTINs, gtin]);
        setAllSelectedGtins((prevGTINs) => [...prevGTINs, gtin]);
      }
    } else {
      showSnackbar('You cannot add more than 300 items.', 'warning');
    }
  };

  const [openDropdowns, setOpenDropdowns] = useState({});
  const toggleDropdown = (rowId) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [rowId]: !prevState[rowId],
    }));
  };

  const popoverAnchorRefs = useRef({});

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      minWidth: 40,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        return <img src={params.value} className="all-product-image" width="60px" height="60px" />;
      },
    },

    {
      field: 'product',
      headerName: 'Product',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 120,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'gtin',
      headerName: 'Barcode',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 60,
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        const rowId = params.id;
        const variants = params.row?.gtin || [];
        const barcodes = variants.flatMap((variant) => variant.barcodes || []);
        const firstBarcode = barcodes.length > 0 ? barcodes[0] : 'NA';
        const hasMultipleVariants = variants.length > 1;

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Typography style={{ fontSize: '12px' }}>{firstBarcode}</Typography>
              {!hasMultipleVariants && <CopyToClipBoardValue params={firstBarcode} />}
            </div>
            {hasMultipleVariants && (
              <>
                <IconButton
                  ref={(el) => {
                    if (el) popoverAnchorRefs.current[rowId] = el;
                  }}
                  onClick={() => toggleDropdown(rowId)}
                  size="small"
                >
                  {openDropdowns[rowId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <Popover
                  open={Boolean(openDropdowns[rowId])}
                  anchorEl={popoverAnchorRefs.current[rowId]}
                  onClose={() => toggleDropdown(rowId)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  PaperProps={{ style: { backgroundColor: '#ffffff', boxShadow: '0px 8px 16px rgba(0,0,0,0.1)' } }}
                >
                  <div style={{ padding: '10px' }}>
                    {barcodes.map((barcode, index) => (
                      <div key={index} style={{ marginBottom: '5px', fontSize: '12px', display: 'flex', gap: '5px' }}>
                        <Typography style={{ fontSize: '12px' }}>{barcode}</Typography>
                        <CopyToClipBoardValue params={barcode} />
                      </div>
                    ))}
                  </div>
                </Popover>
              </>
            )}
          </div>
        );
      },
    },
    {
      field: 'brand',
      headerName: 'Brand',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 60,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'Add',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 40,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const isAdded = allSelectedGtins.includes(params.row.gtin);

        return (
          <SoftButton
            className={isAdded ? 'vendor-second-btn' : 'vendor-add-btn'}
            onClick={() => handleAddToCart(params.row.gtin)}
          >
            {isAdded ? 'Remove' : 'Add'}
          </SoftButton>
        );
      },
    },
  ];

  useEffect(() => {
    searchAndAdd();
  }, [selectedGTINs]);

  const handleAddProducts = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    setLoader(true);
    const payload = {
      locId: locId,
      catagory: mainCatSelected[0],
      productGtin: allSelectedGtins,
      createdBy: uidx,
    };
    try {
      whatsappBusinessAddProducts(payload).then((res) => {
        if (res.data.status === 'SUCCESS') {
          setLoader(false);
          showSnackbar('Products added successfully', 'success');
        } else if (res.data.data.status === 'ERROR') {
          setLoader(false);
          showSnackbar('Products are not added. Please try again', 'error');
          setAllSelectedGtins([]);
        }
      });
    } catch (error) {
      setLoader(false);
      showSnackbar('error', 'error');
    }
  };

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  const handleFilterChange = (e) => {
    const search = e.target.value;
    const productSearchPayload = {
      page: 1,
      names: [],
      brands: [],
      barcode: [],
      manufacturers: [],
      query: '',
      appCategories: {
        categoryLevel1: mainCatSelected,
        categoryLevel2: [],
        categoryLevel3: [],
      },
      productStatus: [],
      preferredVendors: [],
      sortByPrice: 'DEFAULT',
      sortByCreatedAt: 'DESC',
      storeLocationId: lowerCaseLocId,
      pageSize: '10',
    };

    if (search !== '') {
      const isNumber = !isNaN(+search);
      if (isNumber) {
        setBarcodeNo([search]);
        setProductName('');
        setSearchProductName([]);
        const payload = {
          ...productSearchPayload,
          barcode: [e.target.value],
        };

        fetchAllProducts(payload);
      } else {
        setBarcodeNo([]);
        setProductName(search);
        setSearchProductName([]);
        const payload = {
          ...productSearchPayload,
          query: e.target.value,
        };

        fetchAllProducts(payload);
      }
    } else {
      setBarcodeNo([]);
      setSearchProductName([]);
      fetchAllProducts(productSearchPayload);
    }
  };

  const handleClearProductSearch = () => {
    setBarcodeNo([]);
    setProductName('');
    setSearchProductName([]);
    handleFilterChange({ target: { value: '' } });
  };

  return (
    <div>
      <SoftBox className="add-catalog-products-box">
        <Typography
          style={{
            fontWeight: '600',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            color: '#4b524d',
            textAlign: 'left',
          }}
        >
          Add Products to your catalog.
        </Typography>
        <Typography
          style={{
            fontWeight: '200',
            fontSize: '0.7rem',
            lineHeight: '1.5',
            color: '#4b524d',
            textAlign: 'left',
          }}
        >
          Only 300 products can be added
          <span className="dynamic-coupon-imp">*</span>
        </Typography>
        <SoftBox
          py={0}
          px={0}
          sx={{
            marginTop: '1rem',
          }}
        >
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
              Choose the Category
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
                <SoftSelect
                  placeholder="Main Category"
                  options={mainCatArr}
                  insideHeader={true}
                  onChange={(option, e) => {
                    handleMainCat(option);
                  }}
                />
              </div>
            </SoftBox>
          </SoftBox>
          {loading && <Spinner />}
          {mainCatSelected.length !== 0 && (
            <Box className="search-bar-filter-and-table-container" style={{ marginTop: '15px' }}>
              <SoftBox
                className="header-bulk-price-edit search-bar-filter-container"
                sx={{
                  padding: '15px',
                  bgcolor: 'var(--search-bar-filter-container-bg)',
                  display: 'flex',
                  justifyContent: 'space-between !important',
                }}
              >
                <Box className="all-products-filter-product">
                  <SoftInput
                    className="all-products-filter-soft-input-box"
                    placeholder="Search Products"
                    icon={{ component: 'search', direction: 'left' }}
                    onChange={(e) => handleFilterChange(e)}
                    // value={
                    //   searchProductName?.length !== 0
                    //     ? searchProductName?.[0]
                    //     : barcodeNo?.length !== 0
                    //     ? barcodeNo
                    //     : ''
                    // }
                  />
                  {(searchProductName?.length !== 0 || barcodeNo?.length !== 0) && (
                    <ClearSoftInput clearInput={handleClearProductSearch} />
                  )}
                </Box>
              </SoftBox>
              <SoftBox>
                <Box sx={{ height: 525, width: '100%', background: '#fff' }}>
                  <DataGrid
                    columns={columns}
                    rows={rowData ? rowData : []}
                    pagination
                    pageSize={pageSize}
                    paginationMode="server"
                    rowCount={totalData} // Total number of rows
                    page={page - 1}
                    onPageChange={(newPage) => handlePageChange(newPage + 1)}
                    disableSelectionOnClick
                    getRowId={(row) => row.id}
                    onCellClick={(params) => {
                      // Check if the clicked column index is less than 4 (first 4 columns)
                      if (params.field !== 'Add') {
                        handleProductNavigation(params?.row?.gtin);
                      }
                    }}
                  />
                </Box>
              </SoftBox>
            </Box>
          )}
        </SoftBox>
        {allSelectedGtins.length !== 0 && (
          <SoftBox className="whatsapp-bus-button-box">
            <SoftButton className="vendor-add-btn" onClick={handleAddProducts}>
              {loader ? (
                <CircularProgress
                  sx={{ color: 'white !important', height: '15px !important', width: '15px !important' }}
                />
              ) : (
                'Add All Products'
              )}
            </SoftButton>
          </SoftBox>
        )}
      </SoftBox>
    </div>
  );
};

export default AddCatalogProducts;
