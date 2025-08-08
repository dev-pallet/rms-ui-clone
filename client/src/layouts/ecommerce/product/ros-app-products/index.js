import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CommonMobileTabs from '../../Common/mobile-new-ui-components/Common-mobile-tabs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PurchaseAdditionalDetails from '../../purchase/ros-app-purchase/components/purchase-additional-details';
import MobileSearchBar from '../../Common/mobile-new-ui-components/mobile-searchbar';
import MobileFilterComponent from '../../Common/mobile-new-ui-components/mobile-filter';
import {
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
  getAllManufacturerV2,
  getAllVendors,
} from '../../../../config/Services';
import { textFormatter } from '../../Common/CommonFunction';
import { AllProducts } from '../all-products/all-products';
import { useSoftUIController } from '../../../../context';
import {
  setAllProductsFilters,
  setAllProductsFiltersAppliedCount,
  setAllProductsFilterStateData,
} from '../../../../datamanagement/Filters/allProductsSlice';
import { Switch, Typography } from '@mui/material';
import { RestaurantListing } from '../restaurant-listing/RestaurantListing';

const RosAppProducts = () => {
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const retailType = localStorage.getItem('retailType');
  const [controller, dispatch] = useSoftUIController();
  const { allProductsFilter } = controller;
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePurchaseTab, setActivePurchaseTab] = useState(searchParams.get('value'));
  const [searchValue, setSearchValue] = useState(searchParams.get('productId') || '');
  const [vendorOptions, setVendorOptions] = useState([]);
  const [manufactureOptions, setManufactureOptions] = useState([]);
  const [mainSelecetedFilter, setMainSelectedFilter] = useState('');
  const [selectedSubFilters, setSelectedSubFilters] = useState({});
  const [applyFilter, setApplyFilter] = useState(false);
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [searchName, setSearchName] = useState(allProductsFilter?.searchName || null);
  const [mainCatOption, setMainCatOption] = useState([]);
  const [catLevel1Option, setCatLevel1Option] = useState([]);
  const [catLevel2Option, setCatLevel2Option] = useState([]);
  const [totalProduct, setTotalProducts] = useState(0);
  const [toggleItemCode, setToggleItemCode] = useState(false);

  useEffect(() => {
    fetchManufaturer();
    // fetchVendors();
    // listMainCategory();
  }, []);

  const productTabs = useMemo(
    () => [
      {
        tabName: 'All Products',
        tabValue: 'products',
        active: activePurchaseTab === 'products' ? true : false,
      },
      // {
      //   tabName: 'Bulk Upload',
      //   tabValue: 'bulk-products',
      //   active: activePurchaseTab === 'bulk-products' ? true : false,
      // },
      // {
      //   tabName: 'Product Label',
      //   tabValue: 'product-label',
      //   active: activePurchaseTab === 'product-label' ? true : false,
      // },
    ],
    [activePurchaseTab],
  );

  const additionalDetailsArray = useMemo(
    () =>
      activePurchaseTab === 'products'
        ? [
            {
              title: `Total products in store`,
              value: `${totalProduct ?? '0'}`,
            },
            {
              title: `Product at Billing risk`,
              value: `${'0'}`,
            },
          ]
        : [
            {
              title: `Total Outstanding Payables`,
              value: `₹${0 ?? 'NA'}`,
            },
            {
              title: `Due Today`,
              value: `₹${0 ?? 'NA'}`,
            },
            {
              title: `Due Within 7 days`,
              value: `₹${0 ?? 'NA'}`,
            },
            {
              title: `Due Withing 30 days`,
              value: `₹${0 ?? 'NA'}`,
            },
            {
              title: `Overdue`,
              value: `₹${0 ?? 'NA'}`,
            },
          ],
    [activePurchaseTab, totalProduct],
  );

  const tabChangeHandler = (tabValue) => {
    setActivePurchaseTab(tabValue);
    searchParams.set('value', tabValue);
    setSearchParams(searchParams);
    setMainSelectedFilter('');
    setSelectedSubFilters({});
  };

  const onSearchFunction = (e) => {
    setSearchName(e.target.value);
    if (e.target.value === '') {
      searchParams.delete('productId');
      setSearchParams(searchParams);
    } else {
      searchParams.set('productId', e.target.value);
      setSearchParams(searchParams);
    }
  };

  const listMainCategory = () => {
    let payload = {
      sourceId: [orgId],
      sourceLocationId: [locId],
    };
    getAllMainCategory(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response?.length > 0) {
          const arr = [];
          arr.push(
            response?.map((e) => ({
              value: e?.mainCategoryId,
              label: e?.categoryName,
            })),
          );
          setMainCatOption(arr[0]);
          setCatLevel1Option([]);
          setCatLevel2Option([]);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (selectedSubFilters?.category1 && !selectedSubFilters?.category2) {
      listCatLevel1(selectedSubFilters?.category1[0]?.value);
    } else if (selectedSubFilters?.category2) {
      listCatLevel2(selectedSubFilters?.category2[0]?.value);
    }
  }, [selectedSubFilters]);

  const listCatLevel1 = (value) => {
    let payload = {
      sourceId: [orgId],
      sourceLocationId: [locId],
      mainCategoryId: [value],
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
      .catch((err) => {});
  };
  const listCatLevel2 = (value) => {
    let payload = {
      sourceId: [orgId],
      sourceLocationId: [locId],
      level1Id: [value],
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
      .catch((err) => {});
  };

  const fetchVendors = () => {
    let payalod = {
      filterVendor: {},
      page: 1,
      pageSize: 100,
    };
    getAllVendors(payalod, orgId)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setVendorOptions([]);
          return;
        }
        if (res?.data?.data?.vendors?.length > 0) {
          const options = res?.data?.data?.vendors?.map((option) => ({
            value: option?.vendorId,
            label: textFormatter(option?.vendorName || 'NA'),
          }));

          setVendorOptions(options);
        }
      })
      .catch((err) => {});
  };

  const fetchManufaturer = () => {
    getAllManufacturerV2({})
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setManufactureOptions([]);
          return;
        }
        if (res?.data?.data?.results?.length > 0) {
          const options = res?.data?.data?.results?.map((option) => ({
            value: option?.manufacturerId,
            label: textFormatter(option?.manufacturerName || 'NA'),
          }));

          setManufactureOptions(options);
        }
      })
      .catch((err) => {});
  };

  const titleHandler = useCallback(() => {
    let title =
      activePurchaseTab === 'products'
        ? 'Product'
        : activePurchaseTab === 'bulk-products'
        ? 'Bulk Upload'
        : activePurchaseTab === 'product-label'
        ? 'Product Label'
        : 'NA';

    return title;
  }, [activePurchaseTab]);

  const filter_CreateHandler = useCallback(() => {
    let title =
      activePurchaseTab === 'products'
        ? {
            filter: true,
            create: false,
          }
        : activePurchaseTab === 'bulk-products'
        ? {
            filter: false,
            create: false,
          }
        : activePurchaseTab === 'product-label'
        ? {
            filter: false,
            create: false,
          }
        : 'NA';

    return title;
  }, [activePurchaseTab]);

  const filters = useMemo(() => {
    const baseFilters = [
      { filterLabel: 'Price', filterValue: 'price' },
      { filterLabel: 'Status', filterValue: 'status' },
      { filterLabel: 'Scale', filterValue: 'scale' },
      // { filterLabel: 'Vendor', filterValue: 'vendor' },
      { filterLabel: 'Manufacturer', filterValue: 'manufacturer' },
    ];

    // Add conditions for category filters
    // if (activePurchaseTab === 'products') {
    //   if (!selectedSubFilters?.category2) {
    //     baseFilters.push({ filterLabel: 'Category level 1', filterValue: 'category1' });
    //   }

    //   if (!selectedSubFilters?.category3 && selectedSubFilters?.category1) {
    //     baseFilters.push({ filterLabel: 'Category level 2', filterValue: 'category2' });
    //   }

    //   if (selectedSubFilters?.category2) {
    //     baseFilters.push({ filterLabel: 'Category level 3', filterValue: 'category3' });
    //   }
    // }

    return baseFilters;
  }, [activePurchaseTab, selectedSubFilters]);

  const filterOptions = useMemo(
    () =>
      activePurchaseTab === 'products'
        ? {
            price: [
              { value: 'DEFAULT', label: 'Default' },
              { value: 'DESC', label: 'High to Low' },
              { value: 'ASC', label: 'Low to High' },
            ],
            status: [
              { value: 'CREATED', label: 'Created' },
              { value: 'DELETED', label: 'Deleted' },
              { value: 'BLOCKED', label: 'Blocked' },
              { value: 'DRAFT', label: 'Draft' },
            ],
            scale: [
              { value: '', label: 'All' },
              { value: 'weighingScale', label: 'Weighing scale' },
            ],
            // vendor: vendorOptions || [],
            manufacturer: manufactureOptions || [],
            // category1: mainCatOption || [],
            // category2: catLevel1Option || [],
            // category3: catLevel2Option || [],
          }
        : null,
    [activePurchaseTab, vendorOptions, manufactureOptions, mainCatOption, catLevel1Option, catLevel2Option],
  );

  const createButtonFunction = useCallback(() => {
    let navigation = '/upcoming-feature';
    // activePurchaseTab === 'products'
    //   ? '/products/all-products/add-products'
    //   : activePurchaseTab === 'bulk-products'
    //   ? '/products/all-products/add-products/bundle'
    //   : null;

    navigate(navigation);
  }, [activePurchaseTab]);

  return (
    <div className="ros-purchase-app-parent-container">
      <div className="purchase-tabs-main-div">
        <CommonMobileTabs tabs={productTabs} onTabChange={tabChangeHandler} />
      </div>
      <div>
        <PurchaseAdditionalDetails additionalDetailsArray={additionalDetailsArray} />
      </div>
      <div>
        <MobileSearchBar placeholder={`Search product`} onChangeFunction={onSearchFunction} value={searchName} />
        {retailType !== 'RESTAURANT' ? (
          <div className="content-left toggle-search margin-t-12">
            <Switch color="secondary" value={toggleItemCode} onClick={() => setToggleItemCode(!toggleItemCode)} />
            <Typography style={{ fontSize: '12px' }}>Short Code</Typography>
          </div>
        ) : null}
      </div>
      <div>
        <MobileFilterComponent
          filters={filters}
          filterOptions={filterOptions}
          createButtonTitle={titleHandler()}
          createButtonFunction={createButtonFunction}
          mainSelecetedFilter={mainSelecetedFilter}
          setMainSelectedFilter={setMainSelectedFilter}
          selectedSubFilters={selectedSubFilters}
          setSelectedSubFilters={setSelectedSubFilters}
          applyFilter={applyFilter}
          setApplyFilter={setApplyFilter}
          isFilterOpened={isFilterOpened}
          setIsFilterOpened={setIsFilterOpened}
          searchName={searchName}
          filterCreateExist={filter_CreateHandler()}
        />
      </div>
      <div className="ros-app-purchase-component-main-div">
        {activePurchaseTab === 'products' && (
          retailType === 'RESTAURANT' ?
          <RestaurantListing
            filters={selectedSubFilters}
            setIsFilterOpened={setIsFilterOpened}
            isFilterApplied={applyFilter}
            setIsFilterApplied={setApplyFilter}
            mobileSearchedValue={activePurchaseTab === 'products' && searchValue}
            searchName={searchName}
            setSearchName={setSearchName}
            setTotalProducts={setTotalProducts}
            mToggleItemCode={toggleItemCode}
          />
          :
          <AllProducts
            filters={selectedSubFilters}
            setIsFilterOpened={setIsFilterOpened}
            isFilterApplied={applyFilter}
            setIsFilterApplied={setApplyFilter}
            mobileSearchedValue={activePurchaseTab === 'products' && searchValue}
            searchName={searchName}
            setSearchName={setSearchName}
            setTotalProducts={setTotalProducts}
            mToggleItemCode={toggleItemCode}
          />
        )}
      </div>
    </div>
  );
};

export default RosAppProducts;
