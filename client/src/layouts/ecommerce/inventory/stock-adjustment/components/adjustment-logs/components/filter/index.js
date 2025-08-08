import { Box } from '@mui/material';
import {
  EndDateSelect,
  FilterChipDisplayBox,
  StartDateSelect,
  filterStateAndFiltersAppliedHandleFn,
} from '../../../../../../Common/Filter Components/filterComponents';
import { getAllVendors, getMainCategory, getProductGroupData } from '../../../../../../../../config/Services';
import {
  getFiltersStateData,
  setFilterStateData,
  setFilters,
  setPage,
} from '../../../../../../../../datamanagement/Filters/commonFilterSlice';
import { textFormatter } from '../../../../../../Common/CommonFunction';
import { useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Filter from '../../../../../../Common/Filter';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftSelect from '../../../../../../../../components/SoftSelect';
import dayjs from 'dayjs';
import MobileFilterComponent from '../../../../../../Common/mobile-new-ui-components/mobile-filter';
import AdjustmentLogsMobileFilter from './mobile';

export default function StockAdjustmentLogsFilter({ filterObjectMain, showSnackbar, isMobileDevice, pageState }) {
  const dispatch = useDispatch();
  const persistedFilterStateData = useSelector(getFiltersStateData);

  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [brandList, setBrandList] = useState([]);

  const [category, setCategory] = useState(filterObjectMain?.category || '');
  const [brand, setBrand] = useState(filterObjectMain?.brand || '');
  const [vendor, setVendor] = useState(filterObjectMain?.vendor || '');
  const [startDate, setStartDate] = useState(filterObjectMain?.startDate || '');
  const [endDate, setEndDate] = useState(filterObjectMain?.endDate || '');

  // filters
  // to manage filters applied state for adjustment logs filters
  const [filterState, setFilterState] = useState({
    category: persistedFilterStateData?.category || 0,
    brand: persistedFilterStateData?.brand || 0,
    vendor: persistedFilterStateData?.vendor || 0,
    startDate: persistedFilterStateData?.startDate || 0,
    endDate: persistedFilterStateData?.endDate || 0,
  });

  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [applyMobileFilter, setApplyMobileFilter] = useState(false);

  //   selectboxes
  // select category
  const CategorySelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Category"
          {...(category.label
            ? {
              value: {
                value: category.value,
                label: category.label,
              },
            }
            : {
              value: {
                value: '',
                label: 'Select Category',
              },
            })}
          options={mainCategoryList}
          onChange={(option, e) => handleCategory(option)}
        />
      </SoftBox>
    </>
  );

  //   select vendor
  const vendorSelect = (
    <>
      <Box className="all-products-filter-product">
        <SoftSelect
          className="all-products-filter-soft-select-box"
          placeholder="Vendor"
          name="vendor"
          {...(vendor.label
            ? {
              value: {
                value: vendor.value,
                label: vendor.label,
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

  // select brand
  const brandSelect = (
    <>
      <Box className="all-products-filter-product">
        <SoftSelect
          className="all-products-filter-soft-select-box"
          placeholder="Brand"
          name="brand"
          {...(brand.label
            ? {
              value: {
                value: brand.value,
                label: brand.label,
              },
            }
            : {
              value: {
                value: '',
                label: 'Select Brand',
              },
            })}
          options={brandList}
          onChange={(option, e) => {
            // handleMainCat(option);
            handleBrand(option);
          }}
        />
      </Box>
    </>
  );

  //   functions
  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  // handle category fn
  const handleCategory = (option) => {
    setCategory(option);

    if (option !== '') {
      handleFilterStateAndFiltersApplied('category');
    }
  };

  const handleVendor = (option) => {
    setVendor(option);

    if (option !== '') {
      handleFilterStateAndFiltersApplied('vendor');
    }
  };

  const handleBrand = (option) => {
    setBrand(option);

    if (option !== '') {
      handleFilterStateAndFiltersApplied('brand');
    }
  };

  // handle start date fn
  const handleStartDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setStartDate(formattedDate);

      handleFilterStateAndFiltersApplied('startDate');
    }
  };

  // handle end date fn
  const handleEndDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setEndDate(formattedDate);

      handleFilterStateAndFiltersApplied('endDate');
    }
  };

  // remove selected filter fn
  const removeSelectedFilter = (filterType) => {
    const filterMap = {
      category: setCategory,
      vendor: setVendor,
      brand: setBrand,
      startDate: setStartDate,
      endDate: setEndDate,
    };

    if (filterMap[filterType]) {
      filterMap[filterType]('');
      setFilterState((prevState) => ({ ...prevState, [filterType]: 0 }));
    }
  };

  // chipBoxes for filter
  const filterChipData = useMemo(
    () => [
      { heading: 'Category', label: category.label, key: 'category', condition: filterState.category === 1 },
      { heading: 'Brand', label: brand.label, key: 'brand', condition: filterState.brand === 1 },
      { heading: 'Vendor', label: vendor.label, key: 'vendor', condition: filterState.vendor === 1 },
      { heading: 'Start Date', label: startDate, key: 'startDate', condition: filterState.startDate === 1 },
      { heading: 'End Date', label: endDate, key: 'endDate', condition: filterState.endDate === 1 },
    ],
    [category, brand, vendor, startDate, endDate],
  );

  const filterChipBoxes = (
    <>
      {filterChipData.map(
        ({ heading, label, key, condition }) =>
          condition && (
            <FilterChipDisplayBox
              key={key}
              heading={heading}
              label={label}
              objKey={key}
              removeSelectedFilter={removeSelectedFilter}
            />
          ),
      )}
    </>
  );

  //   apply filter function
  const applyFilter = async () => {
    dispatch(
      setFilters({
        category,
        vendor,
        brand,
        startDate,
        endDate,
      }),
    );
    dispatch(setFilterStateData(filterState));
    dispatch(setPage(0));
  };

  const handleClearFilter = async () => {
    setCategory('');
    setVendor('');
    setBrand('');
    setStartDate('');
    setEndDate('');

    // reset filterState
    setFilterState({
      category: 0,
      brand: 0,
      vendor: 0,
      startDate: 0,
      endDate: 0,
    });
    
    // reset filtersApplied
    dispatch(setFilters(null));
    dispatch(setFilterStateData(null));
    // dispatch(setStockCountSearchValue(''));
    dispatch(setPage(0));
  };

  //   useeffect
  //   get main category lists
  useEffect(() => {
    getMainCategory().then((response) => {
      const arr = response?.data?.data;
      const cat = [];
      const mainCategoryIds = {};
      arr?.map((e) => {
        cat.push({ value: e.mainCategoryId, label: e.categoryName });
        mainCategoryIds[e.categoryName] = e.mainCategoryId;
      });
      //   set main category lists
      setMainCategoryList(cat);
    });
  }, []);

  // get vendor list
  useEffect(() => {
    // vendor payload
    const payload = {
      page: 1,
      pageSize: 10,
      filterVendor: {},
    };
    const organizationId = localStorage.getItem('orgId');

    getAllVendors(payload, organizationId)
      .then((res) => {
        const data = res?.data?.data?.vendors;

        const vendorsArr = [];
        data?.map((e) => {
          vendorsArr.push({
            value: e.vendorId,
            label: textFormatter(e.vendorName),
          });
        });
        setVendorList(vendorsArr || []);
      })
      .catch((e) => console.log(e));
  }, []);

  // get brand list
  useEffect(() => {
    // brand payload
    const locId = localStorage.getItem('locId');
    const productGroupType = 'BRAND';

    getProductGroupData(locId, productGroupType)
      .then((res) => {
        if (res?.data?.data?.es > 0 || res?.data?.code === 'ECONNRESET') {
          setBrandList([]);
          showSnackbar(res?.data?.data?.message || res?.data?.message || 'Some Error Occured', 'error');
          return;
        }
        const list = res?.data?.data?.datas
          ?.filter((item) => {
            if (item !== null || item !== '') {
              return item;
            }
          })
          .map((item) => {
            const sentenceCaseItem = item?.charAt(0).toUpperCase() + item?.slice(1).toLowerCase();
            return {
              value: item,
              label: sentenceCaseItem,
            };
          });

        setBrandList(list);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occurred while fetching brand list', 'error');
        setBrandList([]);
      });
  }, []);

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [
    CategorySelect,
    vendorSelect,
    brandSelect,
    <StartDateSelect
      startDate={startDate}
      handleStartDate={handleStartDate}
      label="Select Start Date"
      dateFormat="DD/MM/YYYY"
    />,
    <EndDateSelect endDate={endDate} handleEndDate={handleEndDate} label="Select End Date" dateFormat="DD/MM/YYYY" />,
  ];

  // applied filters count
  const filterLength = Object.values(filterState).filter(value => value === 1).length;

  useEffect(() => {
    if (pageState?.loading === false && isMobileDevice) {
      setApplyMobileFilter(false);
      setIsFilterOpened(false);
    }
  }, [pageState?.loading]);

  return (
    <>
      {isMobileDevice ? (
        <AdjustmentLogsMobileFilter
          {...{
            isFilterOpened,
            setIsFilterOpened,
            mainCategoryList,
            vendorList,
            brandList,
            applyFilter,
            handleClearFilter,
            applyMobileFilter,
            setApplyMobileFilter,
            setCategory,
            setVendor,
            setBrand,
            setStartDate,
            setEndDate,
          }}
        />
      ) : (
        <Filter
          filtersApplied={filterLength}
          filterChipBoxes={filterChipBoxes}
          selectBoxArray={selectBoxArray}
          handleApplyFilter={applyFilter}
          handleClearFilter={handleClearFilter}
        />
      )}
    </>
  );
}
