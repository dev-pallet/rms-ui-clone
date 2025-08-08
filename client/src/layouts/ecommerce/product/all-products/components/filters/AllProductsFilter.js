import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Chip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SoftSelect from '../../../../../../components/SoftSelect';
import {
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
  getAllVendors,
  getMainCategory,
  getManufacturerListV2,
} from '../../../../../../config/Services';
import {
  getAllProductsFilterStateData,
  getAllProductsFilters,
  getAllProductsFiltersCount,
  setAllProductsFilterStateData,
  setAllProductsFilters,
  setAllProductsFiltersAppliedCount,
  setAllProductsPage,
} from '../../../../../../datamanagement/Filters/allProductsSlice';
import { textFormatter, truncateWord } from '../../../../Common/CommonFunction';
import Filter from '../../../../Common/Filter';
import SoftAsyncPaginate from '../../../../../../components/SoftSelect/SoftAsyncPaginate';

// single chip box heading
const ChipBoxHeading = ({ heading }) => (
  <>
    <Typography
      style={{
        position: 'absolute',
        // top: '-15px',
        top: '2px',
        // left: '10px',
        fontSize: '10px',
        fontWeight: 'bold',
      }}
    >
      {heading}
    </Typography>
  </>
);

export const AllProductsPageFilter = ({ applyFilter, clearFilter, isSearchValue }) => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const dispatch = useDispatch();
  const persistedFilters = useSelector(getAllProductsFilters);
  const persistedFiltersAppliedCount = useSelector(getAllProductsFiltersCount);
  const persistedFilterStateData = useSelector(getAllProductsFilterStateData);

  //   <--- filter states
  //   main category
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(persistedFilters?.selectedMainCategory || {});
  //   category level 1
  const [categoryLevel1List, setCategoryLevel1List] = useState([]);
  const [selectedCategoryLevel1, setSelectedCategoryLevel1] = useState(persistedFilters?.selectedCategoryLevel1 || {});

  // category level 2
  const [categoryLevel2List, setCategoryLevel2List] = useState([]);
  const [selectedCategoryLevel2, setSelectedCategoryLevel2] = useState(persistedFilters?.selectedCategoryLevel2 || {});

  //   sort by price
  const [sortByPrice, setSortByPrice] = useState(persistedFilters?.sortByPrice || {});
  //   scale(packaging type)
  const [scale, setScale] = useState(persistedFilters?.scale || {});

  // for product status ex - draft,created,deleted
  const [productStatus, setProductStatus] = useState(persistedFilters?.productStatus || {});

  // for vendor
  const [vendorList, setVendorList] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(persistedFilters?.selectedVendor || {});
  // for manufacturer
  const [manufacturerList, setManufacturerList] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(persistedFilters?.selectedManufacturer || {});
  // filter states--->

  // filters applied & applied filter count states
  // to manage filters applied state for all products filters
  const [filtersApplied, setFiltersApplied] = useState(persistedFiltersAppliedCount || 0);
  const [filterState, setFilterState] = useState({
    mainCategory: persistedFilterStateData?.mainCategory || 0,
    sortByPrice: persistedFilterStateData?.sortByPrice || 0,
    productStatus: persistedFilterStateData?.productStatus || 0,
    scale: persistedFilterStateData?.scale || 0,
    vendor: persistedFilterStateData?.vendor || 0,
    manufacturer: persistedFilterStateData?.manufacturer || 0,
  });

  // chipBoxes for filter
  const filterChipBoxes = (
    <>
      {/* categories  */}
      {filterState.mainCategory === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Categories" />
          <Box
            sx={{
              marginTop: '5px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              // gap: '10px',
            }}
          >
            {selectedMainCategory.label && ( //show main category selected
              <Chip //main category
                label={selectedMainCategory.label}
                onDelete={() => removeSelectedFilter('category')}
                deleteIcon={<CancelOutlinedIcon />}
                color="primary"
                variant="outlined"
              />
            )}
            {selectedCategoryLevel1.label && (
              <>
                <Box sx={{ display: 'inline' }}>
                  <KeyboardArrowRightIcon sx={{ fontSize: '20px' }} />
                </Box>
              </>
            )}
            {selectedCategoryLevel1.label && (
              <Chip //category level 1
                label={selectedCategoryLevel1.label}
                onDelete={() => removeSelectedFilter('categoryLevel1')}
                deleteIcon={<CancelOutlinedIcon />}
                color="primary"
                variant="outlined"
              />
            )}
            {selectedCategoryLevel2.label && (
              <>
                <Box sx={{ display: 'inline' }}>
                  <KeyboardArrowRightIcon sx={{ fontSize: '20px' }} />
                </Box>
              </>
            )}
            {selectedCategoryLevel2.label && (
              <Chip //category level 2
                label={selectedCategoryLevel2.label}
                onDelete={() => removeSelectedFilter('categoryLevel2')}
                deleteIcon={<CancelOutlinedIcon />}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}

      {/* price  */}
      {filterState.sortByPrice === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Sort By Price" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={
                sortByPrice.value === 'ASC' ? 'Low to High' : sortByPrice.value === 'DESC' ? 'High to Low' : 'Default'
              }
              onDelete={() => removeSelectedFilter('sortByPrice')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* product status  */}
      {filterState.productStatus === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Product Status" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={
                productStatus.value === 'ACTIVE'
                  ? 'Active'
                  : productStatus.value === 'IN_ACTIVE'
                  ? 'Inactive'
                  : productStatus.value === 'OUT_OF_STOCK'
                  ? 'Out of stock'
                  : productStatus.value === 'IN_STOCK'
                  ? 'In stock'
                  : productStatus.value
              }
              onDelete={() => removeSelectedFilter('productStatus')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* scale  */}
      {filterState.scale === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Scale" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={scale.label}
              onDelete={() => removeSelectedFilter('scale')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* vendor  */}
      {selectedVendor.label && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Vendor" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={truncateWord(selectedVendor.label)}
              onDelete={() => removeSelectedFilter('vendor')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* manufacturer  */}
      {selectedManufacturer.label && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Manufacturer" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={selectedManufacturer.label}
              onDelete={() => removeSelectedFilter('manufacturer')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  // <--- select boxes
  // const categorySelect = (
  //   <>
  //     <Box className="all-products-filter-product" sx={{ position: 'relative' }}>
  //       {selectedMainCategory.value === undefined && (
  //         <SoftSelect
  //           className="all-products-filter-soft-select-box"
  //           placeholder="Select Category"
  //           name="category"
  //           {...(selectedMainCategory.label
  //             ? {
  //                 value: {
  //                   value: selectedMainCategory.value,
  //                   label: selectedMainCategory.label,
  //                 },
  //               }
  //             : {
  //                 value: {
  //                   value: '',
  //                   label: 'Select Category',
  //                 },
  //               })}
  //           options={mainCategoryList}
  //           onChange={(option, e) => {
  //             setSelectedMainCategory(option);

  //             if (filterState['mainCategory'] === 0) {
  //               setFiltersApplied((prev) => prev + 1);
  //               setFilterState({ ...filterState, mainCategory: 1 });
  //             }
  //           }}
  //         />
  //       )}
  //       {/* display category level 1 list - when main category is selected and category level 1 is not selected */}
  //       {selectedMainCategory.value !== undefined && selectedCategoryLevel1.value === undefined && (
  //         <SoftSelect
  //           className="all-products-filter-soft-select-box"
  //           placeholder="Select Category Level 1"
  //           name="category"
  //           {...(selectedCategoryLevel1.label
  //             ? {
  //                 value: {
  //                   value: selectedCategoryLevel1.value,
  //                   label: selectedCategoryLevel1.label,
  //                 },
  //               }
  //             : {
  //                 value: {
  //                   value: '',
  //                   label: 'Select Category Level 1',
  //                 },
  //               })}
  //           options={categoryLevel1List}
  //           onChange={(option, e) => {
  //             setSelectedCategoryLevel1(option);
  //           }}
  //         />
  //       )}
  //       {/* display category level 2 list - when main category is selected and category level 1 is selected */}
  //       {selectedMainCategory.value !== undefined && selectedCategoryLevel1.value !== undefined && (
  //         <SoftSelect
  //           className="all-products-filter-soft-select-box"
  //           placeholder="Select Category Level 2"
  //           name="category"
  //           {...(selectedCategoryLevel2.label
  //             ? {
  //                 value: {
  //                   value: selectedCategoryLevel2.value,
  //                   label: selectedCategoryLevel2.label,
  //                 },
  //               }
  //             : {
  //                 value: {
  //                   value: '',
  //                   label: 'Select Category Level 2',
  //                 },
  //               })}
  //           options={categoryLevel2List}
  //           onChange={(option, e) => {
  //             setSelectedCategoryLevel2(option);
  //           }}
  //         />
  //       )}
  //     </Box>
  //   </>
  // );

  const categorySelect = (
    <Box className="all-products-filter-product" sx={{ position: 'relative' }}>
      {selectedMainCategory.value === undefined && (
        <SoftAsyncPaginate
          className="all-products-filter-soft-select-box"
          placeholder="Select Category"
          name="category"
          loadOptions={(searchQuery, loadedOptions, additional) =>
            loadMainCategoryOptions(searchQuery, loadedOptions, additional)
          }
          additional={{ page: 1 }} // Start with page 1
          value={
            selectedMainCategory.label
              ? { value: selectedMainCategory.value, label: selectedMainCategory.label }
              : { value: '', label: 'Select Category' }
          }
          onChange={(option) => {
            setSelectedMainCategory(option);

            if (filterState['mainCategory'] === 0) {
              setFiltersApplied((prev) => prev + 1);
              setFilterState({ ...filterState, mainCategory: 1 });
            }
          }}
        />
      )}

      {selectedMainCategory.value !== undefined && selectedCategoryLevel1.value === undefined && (
        <SoftAsyncPaginate
          className="all-products-filter-soft-select-box"
          placeholder="Select Category Level 1"
          name="category"
          loadOptions={
            (searchQuery, loadedOptions, additional) =>
              loadLevel1CategoryOptions(searchQuery, loadedOptions, additional) // Assume you have a similar function for level 1
          }
          additional={{ page: 1 }}
          value={
            selectedCategoryLevel1.label
              ? { value: selectedCategoryLevel1.value, label: selectedCategoryLevel1.label }
              : { value: '', label: 'Select Category Level 1' }
          }
          onChange={(option) => setSelectedCategoryLevel1(option)}
        />
      )}

      {selectedMainCategory.value !== undefined && selectedCategoryLevel1.value !== undefined && (
        <SoftAsyncPaginate
          className="all-products-filter-soft-select-box"
          placeholder="Select Category Level 2"
          name="category"
          loadOptions={
            (searchQuery, loadedOptions, additional) =>
              loadLevel2CategoryOptions(searchQuery, loadedOptions, additional) // Assume you have a similar function for level 2
          }
          additional={{ page: 1 }}
          value={
            selectedCategoryLevel2.label
              ? { value: selectedCategoryLevel2.value, label: selectedCategoryLevel2.label }
              : { value: '', label: 'Select Category Level 2' }
          }
          onChange={(option) => setSelectedCategoryLevel2(option)}
        />
      )}
    </Box>
  );

  const sortByPriceSelect = (
    <>
      <Box className="all-products-filter-edited-by">
        <SoftSelect
          className="all-products-filter-soft-select-box"
          placeholder="Sort By Price"
          name="price"
          {...(sortByPrice.label
            ? {
                value: {
                  value: sortByPrice.value,
                  label: sortByPrice.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Sort By Price',
                },
              })}
          options={[
            { value: 'DEFAULT', label: 'Default' },
            { value: 'ASC', label: 'Low to High' },
            { value: 'DESC', label: 'High to Low' },
          ]}
          onChange={(option, e) => {
            handleSortByPrice(option);
          }}
        />
      </Box>
    </>
  );

  const productStatusSelect = (
    <>
      <Box className="all-products-filter-product">
        <SoftSelect
          className="all-products-filter-soft-select-box"
          placeholder="Select Product Status"
          name="product-status"
          {...(productStatus.label
            ? {
                value: {
                  value: productStatus.value,
                  label: productStatus.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Product Status',
                },
              })}
          options={[
            // { value: 'none', label: 'None' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'IN_ACTIVE', label: 'Inactive' },
            { value: 'IN_STOCK', label: 'In stock' },
            { value: 'OUT_OF_STOCK', label: 'Out of stock' },
          ]}
          onChange={(option, e) => {
            handleProductStatus(option);
          }}
        />
      </Box>
    </>
  );

  const scaleSelect = (
    <>
      <Box className="all-products-filter-edited-by">
        <SoftSelect
          className="all-products-filter-soft-select-box"
          placeholder="Select Scale"
          name="scale"
          {...(scale.label
            ? {
                value: {
                  value: scale.value,
                  label: scale.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Scale',
                },
              })}
          // value={commonFilterData.scaleLabel}
          options={[
            { value: '', label: 'Regular' },
            { value: 'weighingScale', label: 'Weighing Scale' },
          ]}
          onChange={(option, e) => {
            handleScale(option);
          }}
        />
      </Box>
    </>
  );

  const vendorSelect = (
    <>
      <Box className="all-products-filter-product">
        <SoftSelect
          className="all-products-filter-soft-select-box"
          placeholder="Vendor"
          name="vendor"
          {...(selectedVendor.label
            ? {
                value: {
                  value: selectedVendor.value,
                  label: selectedVendor.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Vendor',
                },
              })}
          options={vendorList}
          onChange={(option, e) => {
            // handleMainCat(option);
            handleVendor(option);
          }}
        />
      </Box>
    </>
  );

  // const manufacturerSelect = (
  //   <>
  //     <Box className="all-products-filter-product">
  //       <SoftSelect
  //         className="all-products-filter-soft-select-box"
  //         placeholder="Manufacturer"
  //         name="manufacturer"
  //         {...(selectedManufacturer.label
  //           ? {
  //               value: {
  //                 value: selectedManufacturer.value,
  //                 label: selectedManufacturer.label,
  //               },
  //             }
  //           : {
  //               value: {
  //                 value: '',
  //                 label: 'Select Manufacturer',
  //               },
  //             })}
  //         options={manufacturerList}
  //         onChange={(option, e) => {
  //           handleManufacturer(option);
  //         }}
  //       />
  //     </Box>
  //   </>
  // );

  const manufacturerSelect = (
    <Box className="all-products-filter-product">
      <SoftAsyncPaginate
        className="all-products-filter-soft-select-box"
        placeholder="Manufacturer"
        name="manufacturer"
        loadOptions={(searchQuery, loadedOptions, additional) =>
          loadManufacturerOptions(searchQuery, loadedOptions, additional)
        }
        additional={{ page: 1 }} // Start with page 1
        value={
          selectedManufacturer?.label
            ? { value: selectedManufacturer.value, label: selectedManufacturer.label }
            : { value: '', label: 'Select Manufacturer' }
        }
        onChange={(option) => {
          handleManufacturer(option);
        }}
      />
    </Box>
  );

  // brand select
  //   const brandSelect = () => {
  //     <>
  //       <Box className="all-products-filter-product">
  //         <SoftSelect
  //           className="all-products-filter-soft-select-box"
  //           placeholder="Brand"
  //           name="brand"
  //           {...(selectedManufacturer.length
  //             ? {
  //                 value: {
  //                   value: selectedManufacturer[0].manufactureId,
  //                   label: selectedManufacturer[0].manufactureName,
  //                 },
  //               }
  //             : {
  //                 value: {
  //                   value: '',
  //                   label: 'Select Brand',
  //                 },
  //               })}
  //           options={manufacturerList}
  //           onChange={(option, e) => {
  //             handleManufacturer(option);
  //           }}
  //           // options={[{ value: '', label: 'All' }]}
  //           // onChange={(option, e) => {
  //           //   handleProductStatus(option);
  //           // }}
  //         />
  //       </Box>
  //     </>;
  //   };
  //   select boxes --->

  //   <--- functions
  const handleSortByPrice = (option) => {
    setSortByPrice(option);

    if (option !== '') {
      if (filterState['sortByPrice'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, sortByPrice: 1 });
      }
    }
  };

  const handleProductStatus = (option) => {
    setProductStatus(option);

    if (option !== '') {
      if (filterState['productStatus'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, productStatus: 1 });
      }
    }
  };

  const handleScale = (option) => {
    setScale(option);

    if (option !== '') {
      if (filterState['scale'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, scale: 1 });
      }
    }
  };

  const handleVendor = (option) => {
    setSelectedVendor(option);

    if (option !== '') {
      if (filterState['vendor'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, vendor: 1 });
      }
    }
  };

  const handleManufacturer = (option) => {
    setSelectedManufacturer(option);

    if (option !== '') {
      if (filterState['manufacturer'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, manufacturer: 1 });
      }
    }
  };
  // functions --->

  // select boxes array
  const selectBoxArray = [
    categorySelect,
    sortByPriceSelect,
    productStatusSelect,
    scaleSelect,
    vendorSelect,
    manufacturerSelect,
  ];

  // remove selected filter function
  const removeSelectedFilter = (filterType) => {
    switch (filterType) {
      case 'category':
        setSelectedMainCategory({});
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, mainCategory: 0 });

        // also reset its sub categories
        setSelectedCategoryLevel1({});
        setCategoryLevel1List([]);

        setSelectedCategoryLevel2({});
        setCategoryLevel2List([]);

        break;
      case 'categoryLevel1':
        setSelectedCategoryLevel1({});
        // also clear its sub categories
        setSelectedCategoryLevel2({});
        setCategoryLevel2List([]);

        break;
      case 'categoryLevel2':
        setSelectedCategoryLevel2({});

        break;
      case 'sortByPrice':
        setSortByPrice({});
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, sortByPrice: 0 });

        break;
      case 'productStatus':
        setProductStatus({});
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, productStatus: 0 });

        break;
      case 'scale':
        setScale({});
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, scale: 0 });

        break;
      case 'vendor':
        setSelectedVendor({});
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, vendor: 0 });
        break;
      case 'manufacturer':
        setSelectedManufacturer({});
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, manufacturer: 0 });
        break;
      default:
        return;
    }
  };

  // fn to apply all products Filter
  const handleApplyFilter = () => {
    let payload = {
      // mainCategory: selectedMainCategory.label ? [selectedMainCategory.label] : [],
      // categoryLevel1: selectedCategoryLevel1.label ? [selectedCategoryLevel1.label] : [],
      // categoryLevel2: selectedCategoryLevel2.label ? [selectedCategoryLevel2.label] : [],
      appCategories: {
        categoryLevel1: selectedMainCategory.label ? [selectedMainCategory.label] : [],
        categoryLevel2: selectedCategoryLevel1.label ? [selectedCategoryLevel1.label] : [],
        categoryLevel3: selectedCategoryLevel2.label ? [selectedCategoryLevel2.label] : [],
      },
      productStatus: productStatus.value ? [productStatus.value] : [],
      preferredVendors: selectedVendor.value ? [selectedVendor.value] : [],
      manufacturers: selectedManufacturer.label ? [selectedManufacturer.label] : [], //this is manufacturer name
      // sort: {
      //   mrpSortOption: sortByPrice.value ? sortByPrice.value : 'DEFAULT',
      //   creationDateSortOption: 'DESC',
      // },
      ...(productStatus.value === 'IN_ACTIVE' && { showOnlyDeActivated: true }),
      sortByPrice: sortByPrice.value ? sortByPrice.value : 'DEFAULT',
      sortByCreatedAt: 'DESC',
    };
    if (scale.value === 'weighingScale') {
      payload.needsWeighingScaleIntegration = [true];
    }
    if (scale.value === '') {
      payload.needsWeighingScaleIntegration = [false];
    }

    dispatch(
      setAllProductsFilters({
        // ...persistedFilters,
        selectedMainCategory: selectedMainCategory,
        selectedCategoryLevel1: selectedCategoryLevel1,
        selectedCategoryLevel2: selectedCategoryLevel2,
        sortByPrice: sortByPrice,
        productStatus: productStatus,
        scale: scale,
        selectedVendor: selectedVendor,
        selectedManufacturer: selectedManufacturer,
      }),
    );
    dispatch(setAllProductsFiltersAppliedCount(filtersApplied));
    dispatch(setAllProductsFilterStateData(filterState));

    applyFilter(payload);
  };

  // fn to  clear the all products filter
  const handleClearFilter = (searchValue) => {
    setSelectedMainCategory({});
    setSelectedCategoryLevel1({});
    setSelectedCategoryLevel2({});
    setScale({});
    setSortByPrice({});
    setProductStatus({});
    setSelectedVendor({});
    setSelectedManufacturer({});

    setFiltersApplied(0);
    setFilterState({
      mainCategory: 0,
      sortByPrice: 0,
      productStatus: 0,
      scale: 0,
      vendor: 0,
      manufacturer: 0,
    });

    dispatch(setAllProductsFilters(null));
    dispatch(setAllProductsFilterStateData(null));
    dispatch(setAllProductsFiltersAppliedCount(0));
    dispatch(setAllProductsPage(1));

    if (searchValue === true) {
      return;
    }

    clearFilter();
  };
  //   useeffects
  // get vendor list
  useEffect(() => {
    // vendor payload
    fetchAllVendor();
    // get manufactuer list
    // fetchManufacturer();
    //   get main category lists
    // fetchMainCat();
  }, []);

  const fetchAllVendor = () => {
    const payload = {
      page: 1,
      pageSize: 10,
      filterVendor: {},
    };
    // const organizationId = 'RET_14';
    const organizationId = orgId;

    getAllVendors(payload, organizationId).then((res) => {
      const data = res?.data?.data?.vendors;

      const vendorsArr = [];
      data?.map((e) => {
        vendorsArr.push({
          value: e.vendorId,
          label: textFormatter(e.vendorName),
        });
      });
      setVendorList(vendorsArr || []);
    });
  };

  const fetchManufacturer = () => {
    getManufacturerListV2({}).then((res) => {
      const data = res?.data?.data?.results;
      // setManufacturerList(data);

      const manufacturersArr = [];
      data?.map((e) => {
        manufacturersArr.push({ value: e.manufacturerId, label: e.manufacturerName });
      });
      setManufacturerList(manufacturersArr);
    });
  };

  const loadManufacturerOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      manufacturerName: [searchQuery] || [], // Optional search query
      active: [true],
    };

    try {
      const res = await getManufacturerListV2(payload);
      const data = res?.data?.data?.results || [];

      const manufacturersArr = data?.map((e) => ({
        value: e?.manufacturerId,
        label: e?.manufacturerName,
      }));

      return {
        options: manufacturersArr,
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

  const fetchMainCat = () => {
    const payload = {
      page: 1,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      sortByCreatedDate: 'DESCENDING',
      sortByUpdatedDate: 'DESCENDING',
    };
    getAllMainCategory(payload).then((response) => {
      const arr = response?.data?.data?.results;
      const cat = [];
      const mainCategoryIds = {};
      arr?.map((e) => {
        cat.push({ value: e.mainCategoryId, label: e.categoryName });
        mainCategoryIds[e.categoryName] = e.mainCategoryId;
      });
      //   set main category lists
      setMainCategoryList(cat);
    });
  };

  const loadMainCategoryOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      sortByUpdatedDate: 'DESCENDING',
      active: [true],
    };

    try {
      const response = await getAllMainCategory(payload);
      const results = response?.data?.data?.results || [];

      const categories = results?.map((e) => ({
        value: e?.mainCategoryId,
        label: e?.categoryName || 'NA',
      }));

      return {
        options: categories,
        hasMore: results?.length >= 50, // Continue loading more if more than 50 results exist
        additional: { page: page + 1 },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  // //   get catgory level 1 lists
  // useEffect(() => {
  //   if (selectedMainCategory.value !== undefined) {
  //     const payload = {
  //       page: 1,
  //       pageSize: 50,
  //       sourceId: [orgId],
  //       sourceLocationId: [locId],
  //       mainCategoryId: [selectedMainCategory.value],
  //     };
  //     getAllLevel1Category(payload).then((response) => {
  //       // setArr(response.data.data);
  //       // setCategoryLevel1Arr(response.data.data.results);
  //       const arr = response?.data?.data?.results;
  //       const categoryLevel1 = [];
  //       arr?.map((e) => {
  //         categoryLevel1.push({ value: e.mainCategoryId, label: e.categoryName, level1Id: e.level1Id });
  //       });

  //       // set category level 1 lists
  //       setCategoryLevel1List(categoryLevel1);
  //     });
  //   }
  // }, [selectedMainCategory]);

  // //   get category level 2 list
  // useEffect(() => {
  //   if (selectedCategoryLevel1.value !== undefined) {
  //     const payload = {
  //       page: 1,
  //       pageSize: 50,
  //       sourceId: [orgId],
  //       sourceLocationId: [locId],
  //       level1Id: [selectedCategoryLevel1.level1Id],
  //     };
  //     getAllLevel2Category(payload).then((response) => {
  //       // setArr(response.data.data);
  //       // setCategoryLevel2Arr(response.data.data.results);
  //       const arr = response?.data?.data?.results;
  //       const categoryLevel2 = [];
  //       arr?.map((e) => {
  //         categoryLevel2.push({ value: e.level2Id, label: e.categoryName, level1Id: e.level1Id });
  //       });
  //       // set category level 2 lists
  //       setCategoryLevel2List(categoryLevel2);
  //     });
  //   }
  // }, [selectedCategoryLevel1]);

  const loadLevel1CategoryOptions = async (searchQuery, loadedOptions, additional) => {
    const page = additional.page || 1;

    const payload = {
      page,
      pageSize: 50, // Adjust this if needed
      sourceId: [orgId],
      sourceLocationId: [locId],
      mainCategoryId: [selectedMainCategory.value],
      active: [true],
    };

    try {
      const response = await getAllLevel1Category(payload);
      const results = response?.data?.data?.results || [];

      const options = results?.map((e) => ({
        value: e?.mainCategoryId,
        label: e?.categoryName,
        level1Id: e?.level1Id,
      }));

      return {
        options,
        hasMore: results?.length === 50, // Indicate if there are more options to load
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
        additional: {
          page,
        },
      };
    }
  };

  const loadLevel2CategoryOptions = async (searchQuery, loadedOptions, additional) => {
    const page = additional.page || 1;

    const payload = {
      page,
      pageSize: 50, // Adjust this if needed
      sourceId: [orgId],
      sourceLocationId: [locId],
      level1Id: [selectedCategoryLevel1.level1Id],
      active: [true],
    };

    try {
      const response = await getAllLevel2Category(payload);
      const results = response?.data?.data?.results || [];

      const options = results?.map((e) => ({
        value: e?.level2Id,
        label: e?.categoryName,
        level1Id: e?.level1Id,
      }));

      return {
        options,
        hasMore: results?.length === 50, // Indicate if there are more options to load
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
        additional: {
          page,
        },
      };
    }
  };

  useEffect(() => {
    if (isSearchValue) {
      let searchValue = true;
      handleClearFilter(searchValue);
    }
  }, [isSearchValue]);

  return (
    <>
      <Filter
        filtersApplied={filtersApplied}
        filterChipBoxes={filterChipBoxes}
        selectBoxArray={selectBoxArray}
        handleApplyFilter={handleApplyFilter}
        handleClearFilter={handleClearFilter}
      />
    </>
  );
};
