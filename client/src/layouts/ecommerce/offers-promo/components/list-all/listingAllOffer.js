import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Chip, Grid, useMediaQuery } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';
import SoftBox from '../../../../../components/SoftBox';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import { getAllBrands, getAllMainCategory, listAllOfferAndPromo } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { ClearSoftInput, dateFormatter } from '../../../Common/CommonFunction';
import Filter from '../../../Common/Filter';
import { ChipBoxHeading } from '../../../Common/Filter Components/filterComponents';
import Status from '../../../Common/Status';
import { CategoryLevel1Select } from '../../../product/all-products/components/filters/CategoryLevel1Select';

const ListingAllOffer = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const isMobile = useMediaQuery('(max-width: 567px)');
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const [searchValInventory, setSearchValInventory] = useState('');
  const debouncedSearchInventory = useDebounce(searchValInventory, 700);
  const [tabs, setTabs] = useState({
    tab1: true,
    tab2: false,
  });

  const [pageStateInventory, setPageStateInventory] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [pageSearchState, setPageSearchState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [pageFilterState, setPageFilterState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleTabClick = (tab) => {
    setTabs((prev) => ({ ...prev, [tab]: true }));
    Object.keys(tabs)
      .filter((key) => key !== tab)
      .forEach((key) => {
        setTabs((prev) => ({ ...prev, [key]: false }));
      });
    setShowDatePicker(false);
  };

  const columns = [
    {
      field: 'offerId',
      headerName: 'Offer Id',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'offerName',
      headerName: 'Offer Name',
      minWidth: 130,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'createdOn',
      headerName: 'Created On',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'offerType',
      headerName: 'Offer Type',
      minWidth: 180,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'discount',
      headerName: 'Discount',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'discountType',
      headerName: 'Discount Type',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 50,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return (
          <>
            {params?.row?.status === 'ACTIVE' ? (
              <div>{params?.row?.status && <Status label={params?.row?.status} />}</div>
            ) : (
              <div>{params?.row?.status && <Status label={params?.row?.status} />}</div>
            )}
          </>
        );
      },
    },
    {
      field: 'channel',
      headerName: 'Channel',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    // {
    //   field: 'conversionRates',
    //   headerName: 'Conversion Rates',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   minWidth: 100,
    //   flex: 1,
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    // },
  ];

  useEffect(() => {
    if (tabs.tab1 === true) {
      allActiveOfferAndPromo();
    }
  }, [
    // status,
    tabs.tab1,
    tabs.tab2,
    pageStateInventory.page,
    pageStateInventory.pageSize,
  ]);
  useEffect(() => {
    if (tabs.tab2 === true) {
      allInactiveeOfferAndPromo();
    }
  }, [
    // status,
    tabs.tab1,
    tabs.tab2,
    pageState.page,
    pageState.pageSize,
  ]);

  const payload = {
    pageNumber: pageStateInventory.page,
    pageSize: 10,
    // "hoId": "string",
    orgId: orgId,
    locationId: locId,
    // "brands": [
    //   "string"
    // ],
    // "channels": [
    //   "string"
    // ],
  };

  useEffect(() => {
    if (debouncedSearchInventory !== '') {
      listAllOffer();
    }
  }, [debouncedSearchInventory, pageSearchState.page, pageSearchState.pageSize]);

  function formatString(inputString) {
    const words = inputString.toLowerCase().split('_');
    const formattedString = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return formattedString;
  }

  const listAllOffer = () => {
    payload.searchBox = debouncedSearchInventory;
    let dataArrOnSearch,
      dataRowOnSearch = [];
    setPageSearchState((old) => ({ ...old, loader: true }));
    listAllOfferAndPromo(payload)
      .then((res) => {
        const response = res?.data?.data;
        setPageSearchState((old) => ({ ...old, loader: false }));
        if (response?.es === 1) {
          showSnackbar(response?.message, 'error');
        } else if (response?.es === 0) {
          let tot = '';
          tot = response?.data?.resultQuantity;
          dataArrOnSearch = response?.data?.object;
          dataRowOnSearch.push(
            dataArrOnSearch?.map((row, index) => ({
              offerId: row?.offerId ? row?.offerId : 'NA',
              offerName: row.offerName ? row.offerName : 'NA',
              createdOn: row?.createdOn ? dateFormatter(row?.createdOn) : 'NA',
              offerType: row?.offerType ? formatString(row?.offerType) : 'NA',
              discount:
                row?.offerDetailsEntityList?.[0]?.discountType === 'Flat Price'
                  ? row?.offerDetailsEntityList?.[0]?.flatPrice
                  : row?.offerDetailsEntityList?.[0]?.offerDiscount
                  ? row?.offerDetailsEntityList?.[0]?.offerDiscount
                  : 'NA',
              discountType: row?.offerDetailsEntityList?.[0]?.discountType
                ? row?.offerDetailsEntityList?.[0]?.discountType
                : 'NA',
              status: row?.offerStatus ? row?.offerStatus : 'NA',
              channel: row?.channels ? row?.channels?.join(', ') : 'NA',
            })),
          );
          setPageSearchState((old) => ({
            ...old,
            loader: false,
            datRows: dataRowOnSearch[0] || [],
            total: tot || 0,
          }));
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };
  const allActiveOfferAndPromo = () => {
    payload.offerStatus = 'ACTIVE';
    let dataArrOnSearch,
      dataRowOnSearch = [];
    setPageStateInventory((old) => ({ ...old, loader: true }));
    listAllOfferAndPromo(payload)
      .then((res) => {
        const response = res?.data?.data;
        setPageStateInventory((old) => ({ ...old, loader: false }));
        if (response?.es === 1) {
          showSnackbar(response?.message, 'error');
        } else if (response?.es === 0) {
          let tot = '';
          tot = response?.data?.resultQuantity;
          dataArrOnSearch = response?.data?.object;
          dataRowOnSearch.push(
            dataArrOnSearch?.map((row, index) => ({
              offerId: row?.offerId ? row?.offerId : 'NA',
              offerName: row.offerName ? row.offerName : 'NA',
              createdOn: row?.createdOn ? dateFormatter(row?.createdOn) : 'NA',
              offerType: row?.offerType ? formatString(row?.offerType) : 'NA',
              discount:
                row?.offerDetailsEntityList?.[0]?.discountType === 'Flat Price'
                  ? row?.offerDetailsEntityList?.[0]?.flatPrice
                  : row?.offerDetailsEntityList?.[0]?.offerDiscount
                  ? row?.offerDetailsEntityList?.[0]?.offerDiscount
                  : 'NA',
              discountType: row?.offerDetailsEntityList?.[0]?.discountType
                ? row?.offerDetailsEntityList?.[0]?.discountType
                : 'NA',
              status: row?.offerStatus ? row?.offerStatus : 'NA',
              channel: row?.channels ? row?.channels?.join(', ') : 'NA',
            })),
          );
          setPageStateInventory((old) => ({
            ...old,
            loader: false,
            datRows: dataRowOnSearch[0] || [],
            total: tot || 0,
          }));
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const allInactiveeOfferAndPromo = () => {
    payload.offerStatus = 'INACTIVE';
    setPageState((old) => ({ ...old, loader: true }));
    let dataArrOnSearch,
      dataRowOnSearch = [];
    listAllOfferAndPromo(payload)
      .then((res) => {
        const response = res?.data?.data;
        setPageState((old) => ({ ...old, loader: false }));
        if (response?.es === 1) {
          showSnackbar(response?.message, 'error');
        } else if (response?.es === 0) {
          let tot = '';
          tot = response?.data?.resultQuantity;
          dataArrOnSearch = response?.data?.object;
          dataRowOnSearch.push(
            dataArrOnSearch?.map((row, index) => ({
              offerId: row?.offerId ? row?.offerId : 'NA',
              offerName: row.offerName ? row.offerName : 'NA',
              createdOn: row?.createdOn ? dateFormatter(row?.createdOn) : 'NA',
              offerType: row?.offerType ? formatString(row?.offerType) : 'NA',
              discount:
                row?.offerDetailsEntityList?.[0]?.discountType === 'Flat Price'
                  ? row?.offerDetailsEntityList?.[0]?.flatPrice
                  : row?.offerDetailsEntityList?.[0]?.offerDiscount
                  ? row?.offerDetailsEntityList?.[0]?.offerDiscount
                  : 'NA',
              discountType: row?.offerDetailsEntityList?.[0]?.discountType
                ? row?.offerDetailsEntityList?.[0]?.discountType
                : 'NA',
              status: row?.offerStatus ? row?.offerStatus : 'NA',
              channel: row?.channels ? row?.channels?.join(', ') : 'NA',
            })),
          );
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: dataRowOnSearch[0] || [],
            total: tot || 0,
          }));
        }
      })
      .catch((err) => {});
  };
  const handleCellClickInventory = (rows) => {
    const offerId = rows.row.offerId;
    navigate(`/marketting/offers-promotions/${offerId}`);
  };

  const handleSearchInventory = (e) => {
    const val = e.target.value;
    if (val.length === 0) {
      setSearchValInventory('');
    } else {
      setSearchValInventory(e.target.value);
    }
  };

  // clear inventory search input fn
  const handleClearInventorySearch = () => {
    setSearchValInventory('');
  };

  // <--- code for filters
  const [onClickApplied, setOnClickApplied] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(0);
  const [filterState, setFilterState] = useState({
    mainCatSelected: 0,
    brandSelected: 0,
    channelSelected: 0,
  });
  // main category array
  const [mainCatArr, setMainCatArr] = useState([]);
  // to store main category id with name
  const [mainCategoryIdObj, setMainCategoryIdObj] = useState({});
  // to store selected category
  const [mainCatSelected, setMainCat] = useState([]);
  const [catlevel1Selected, setCatLevel1Selected] = useState([]);
  const [catlevel2Selected, setCatLevel2Selected] = useState([]);
  // store id and label name of category
  const [mainCategorySelected, setMainCategorySelected] = useState({});
  const [categoryLevel1Selected, setCategoryLevel1Selected] = useState({});
  const [categoryLevel2Selected, setCategoryLevel2Selected] = useState({});

  const [brandList, setBrandList] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState({});
  const [selectedChannels, setSelectedChannels] = useState({});
  const channelList = [
    { value: 'RMS', label: 'RMS' },
    { value: 'POS', label: 'POS' },
    { value: 'APP', label: 'APP' },
  ];
  // category select box

  const categorySelect = (
    <>
      <Box className="all-products-filter-product" sx={{ position: 'relative' }}>
        {(!mainCategorySelected.id || mainCategorySelected.label === 'All Category') && (
          <SoftSelect
            className="all-products-filter-soft-select-box"
            placeholder="Select Category"
            name="category"
            {...(mainCatSelected.length
              ? {
                  value: {
                    value: mainCatSelected[0],
                    label: mainCatSelected[0],
                  },
                }
              : {
                  value: {
                    value: '',
                    label: 'Select Category',
                  },
                })}
            options={mainCatArr}
            onChange={(option, e) => {
              handleMainCat(option);
              setMainCategorySelected({ label: option.label, id: mainCategoryIdObj[option.label] });
            }}
          />
        )}
        {mainCategorySelected.label !== 'All Category' && mainCategorySelected.id && (
          <>
            <CategoryLevel1Select
              // name of categories selected
              mainCategorySelected={mainCategorySelected}
              catlevel1Selected={catlevel1Selected}
              catlevel2Selected={catlevel2Selected}
              setCatLevel1Selected={setCatLevel1Selected}
              setCatLevel2Selected={setCatLevel2Selected}
              // object containing id, name of selected category
              categoryLevel1Selected={categoryLevel1Selected}
              categoryLevel2Selected={categoryLevel2Selected}
              setCategoryLevel1Selected={setCategoryLevel1Selected}
              setCategoryLevel2Selected={setCategoryLevel2Selected}
            />
          </>
        )}
      </Box>
    </>
  );

  const brandsSelect = (
    <>
      <Box className="all-products-filter-product">
        <SoftSelect
          className="all-products-filter-soft-select-box"
          placeholder="Brands"
          name="brandSelected"
          {...(selectedBrands.label
            ? {
                value: {
                  value: selectedBrands.value,
                  label: selectedBrands.label,
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
            handleBrands(option);
          }}
        />
      </Box>
    </>
  );

  const channelSelect = (
    <>
      <Box className="all-products-filter-product">
        <SoftSelect
          className="all-products-filter-soft-select-box"
          placeholder="Brands"
          name="channelSelected"
          {...(selectedChannels.label
            ? {
                value: {
                  value: selectedChannels.value,
                  label: selectedChannels.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Channel',
                },
              })}
          options={channelList}
          onChange={(option, e) => {
            handleChannel(option);
          }}
        />
      </Box>
    </>
  );
  // fetch main categories list
  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
    };

    getAllMainCategory(payload).then((response) => {
      const arr = response.data.data.results;

      const cat = [];
      const mainCategoryIds = {};
      arr?.map((e) => {
        cat.push({ value: e.mainCategoryId, label: e.categoryName });
        mainCategoryIds[e.categoryName] = e.mainCategoryId;
      });
      setMainCatArr(cat);
      setMainCategoryIdObj(mainCategoryIds);
    });
  }, []);

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 20,
      sourceId: [orgId],
      sourceLocationId: [locId],
    };

    getAllBrands(payload)
      .then((res) => {
        const data = res?.data?.data?.results;
        // setBrandList(data);
        if (data.length > 0) {
          const brandArr = [];
          data.map((e) => {
            brandArr.push({ value: e.brandId, label: e.brandName });
          });
          setBrandList(brandArr);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  }, []);

  // functions - handleMainCat, ApplyFilter, handleClearFilter
  const handleMainCat = (option) => {
    const input = option.label;
    if (input !== '') {
      setMainCat([input]);
      if (filterState['mainCatSelected'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, mainCatSelected: 1 });
      }
    } else {
      setMainCat([]);
      setFiltersApplied((prev) => prev - 1);
      setFilterState({ ...filterState, mainCatSelected: 0 });
    }
  };

  const truncateWord = (word) => {
    if (word.length > 23) {
      return word.slice(0, 23) + '...';
    }
    return word;
  };

  const handleBrands = (option) => {
    let label = option.label;
    label = truncateWord(label);
    const value = option.value;
    if (label !== '' && value !== '') {
      setSelectedBrands({ label, value });
      if (filterState['brandSelected'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, brandSelected: 1 });
      }
    } else {
      setSelectedBrands({});
      setFiltersApplied((prev) => prev - 1);
      setFilterState({ ...filterState, brandSelected: 0 });
    }
  };
  const handleChannel = (option) => {
    const label = option.label;
    const value = option.value;
    if (label !== '' && value !== '') {
      setSelectedChannels({ label, value });
      if (filterState['channelSelected'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, channelSelected: 1 });
      }
    } else {
      setSelectedChannels({});
      setFiltersApplied((prev) => prev - 1);
      setFilterState({ ...filterState, channelSelected: 0 });
    }
  };

  // remove selected filter function
  const removeSelectedFilter = (filterType) => {
    switch (filterType) {
      case 'category':
        setFiltersApplied((prev) => prev - 1);
        setMainCat([]);
        setFilterState({ ...filterState, mainCatSelected: 0 });
        setMainCategorySelected({});
        // also reset its sub categories
        setCatLevel1Selected([]);
        setCatLevel2Selected([]);
        break;
      case 'categoryLevel1':
        setCatLevel1Selected([]);
        // also clear its sub categories
        setCatLevel2Selected([]);
        break;
      case 'categoryLevel2':
        setCatLevel2Selected([]);
        break;
      case 'selectedBrands':
        setFiltersApplied((prev) => prev - 1);
        setSelectedBrands({});
        setFilterState({ ...filterState, selectedBrands: 0 });
        break;
      case 'selectedChannels':
        setFiltersApplied((prev) => prev - 1);
        setSelectedChannels({});
        setFilterState({ ...filterState, selectedChannels: 0 });
        break;
      default:
        return;
    }
  };

  const offerPayload = {
    pageNumber: pageStateInventory.page,
    pageSize: 10,
    // "hoId": "string",
    orgId: orgId,
    locationId: locId,
    mainCategory: mainCatSelected[0] || '',
    level1Category: catlevel1Selected[0] || '',
    level2Category: catlevel2Selected[0] || '',
    brands: [selectedBrands.label] || '',
    channels: [selectedChannels.label] || '',
  };
  // apply filter fn
  const applyFilter = () => {
    setSearchValInventory('');
    setOnClickApplied(true);
    let dataArrOnSearch,
      dataRowOnSearch = [];
    setPageFilterState((old) => ({ ...old, loader: true }));
    listAllOfferAndPromo(offerPayload)
      .then((res) => {
        const response = res?.data?.data;
        setPageFilterState((old) => ({ ...old, loader: false }));
        if (response?.es === 1) {
          showSnackbar(response?.message, 'error');
        } else if (response?.es === 0) {
          let tot = '';
          tot = response?.data?.resultQuantity;
          dataArrOnSearch = response?.data?.object;
          dataRowOnSearch.push(
            dataArrOnSearch?.map((row, index) => ({
              offerId: row?.offerId ? row?.offerId : 'NA',
              offerName: row.offerName ? row.offerName : 'NA',
              createdOn: row?.createdOn ? dateFormatter(row?.createdOn) : 'NA',
              offerType: row?.offerType ? formatString(row?.offerType) : 'NA',
              discount:
                row?.offerDetailsEntityList?.[0]?.discountType === 'Flat Price'
                  ? row?.offerDetailsEntityList?.[0]?.flatPrice
                  : row?.offerDetailsEntityList?.[0]?.offerDiscount
                  ? row?.offerDetailsEntityList?.[0]?.offerDiscount
                  : 'NA',
              discountType: row?.offerDetailsEntityList?.[0]?.discountType
                ? row?.offerDetailsEntityList?.[0]?.discountType
                : 'NA',
              status: row?.offerStatus ? row?.offerStatus : 'NA',
              channel: row?.channels ? row?.channels?.join(', ') : 'NA',
            })),
          );
          setPageFilterState((old) => ({
            ...old,
            loader: false,
            datRows: dataRowOnSearch[0] || [],
            total: tot || 0,
          }));
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  // clear filter fn
  const handleClearFilter = () => {
    setOnClickApplied(false);

    // also reset mainCatSelected & catlevel1Selected & catlevel2Selected
    setMainCat([]);
    setCatLevel1Selected([]);
    setCatLevel2Selected([]);
    setSelectedBrands({});
    setSelectedChannels({});
    // also reset mainCategorySelected, this will close subcategory select boxes if its open
    setMainCategorySelected({});

    // set filters applied to 0
    setFiltersApplied(0);
    setFilterState({
      mainCatSelected: 0,
      brandSelected: 0,
      channelSelected: 0,
    });

    // reset payload
    offerPayload['mainCategory'] = '';
    offerPayload['level1Category'] = '';
    offerPayload['level2Category'] = '';
    offerPayload['brands'] = '';
    offerPayload['channels'] = '';

    listAllOffer();
    if (tabs.tab1 === true) {
      allActiveOfferAndPromo();
    }
    if (tabs.tab2 === true) {
      allInactiveeOfferAndPromo();
    }
  };

  // select box array
  const selectBoxArray = [categorySelect, brandsSelect, channelSelect];

  // chipBoxes
  const filterChipBoxes = (
    <>
      {/* categories  */}
      {!!mainCatSelected.length && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Categories" />
          <Box
            sx={{
              marginTop: '5px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              rowGap: '10px',
            }}
          >
            {!!mainCatSelected.length && ( //show main category selected
              <Chip //main category
                label={mainCatSelected}
                onDelete={() => removeSelectedFilter('category')}
                deleteIcon={<CancelOutlinedIcon />}
                color="primary"
                variant="outlined"
              />
            )}
            {!!catlevel1Selected.length && (
              <>
                <Box sx={{ display: 'inline' }}>
                  <KeyboardArrowRightIcon sx={{ fontSize: '20px' }} />
                </Box>
              </>
            )}
            {!!catlevel1Selected.length && (
              <Chip //category level 1
                label={catlevel1Selected}
                onDelete={() => removeSelectedFilter('categoryLevel1')}
                deleteIcon={<CancelOutlinedIcon />}
                color="primary"
                variant="outlined"
              />
            )}
            {!!catlevel2Selected.length && (
              <>
                <Box sx={{ display: 'inline' }}>
                  <KeyboardArrowRightIcon sx={{ fontSize: '20px' }} />
                </Box>
              </>
            )}
            {!!catlevel2Selected.length && (
              <Chip //category level 2
                label={catlevel2Selected}
                onDelete={() => removeSelectedFilter('categoryLevel2')}
                deleteIcon={<CancelOutlinedIcon />}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}

      {/* add rest of filter chip boxes ... */}
      {selectedBrands.label && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Brands" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={selectedBrands.label}
              onDelete={() => removeSelectedFilter('selectedBrands')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
      {selectedChannels.label && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Channels" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={selectedChannels.label}
              onDelete={() => removeSelectedFilter('selectedChannels')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  // code for filters --->

  return (
    <>
      <SoftBox className={`${!isMobile ? 'search-bar-filter-and-table-container' : 'new-header-inventory'}`}>
        <Box
          className={!isMobile && 'search-bar-filter-container'}
          sx={{
            padding: !isMobile && '15px 15px 0 15px !important',
            // bgcolor: !isMobile && 'var(--search-bar-filter-container-bg)',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        >
          <Box
            className="tab-contents-export-adjust"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Box className="tabs new-tabs">
              <SoftTypography
                className={tabs.tab1 ? 'filter-div-tag' : 'filter-div-paid'}
                varient="h6"
                // onClick={() => changesTab(true, false)}
                onClick={() => handleTabClick('tab1')}
                sx={{ borderBottomColor: 'rgb(0,100,254)', cursor: 'pointer', color: '#ffffff' }}
              >
                Active Offers
              </SoftTypography>
              <SoftTypography
                className={tabs.tab2 ? 'filter-div-tag mange' : 'filter-div-paid'}
                varient="h6"
                // onClick={() => changesTab(false, true)}
                onClick={() => handleTabClick('tab2')}
                sx={{ borderBottomColor: '#ffffff', marginLeft: '2rem', cursor: 'pointer', color: '#ffffff' }}
              >
                Inactive Offers
              </SoftTypography>
            </Box>
          </Box>
          <Box sx={{ padding: '15px' }}>
            <Grid container spacing={2}>
              <Grid item lg={5.5} md={5.5} sm={6} xs={12} paddingLeft={'0 !important'}>
                <SoftBox
                  // sx={{ marginLeft: '10px', marginRight: '10px' }}
                  sx={{ position: 'relative' }}
                >
                  <SoftInput
                    placeholder="Search by offer name"
                    className="stoc"
                    value={searchValInventory}
                    onChange={handleSearchInventory}
                    // value={tabs.tab1 ? searchValInventory : searchValAdjustInventory}
                    // onChange={tabs.tab1 ? handleSearchInventory : handleSearchAdjustInventory}
                    icon={{ component: 'search', direction: 'left' }}
                  />
                  {searchValInventory !== '' && <ClearSoftInput clearInput={handleClearInventorySearch} />}
                </SoftBox>
              </Grid>
              <Grid
                item
                lg={6.5}
                md={6.5}
                sm={6}
                xs={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'right',
                  columnGap: '10px',
                  alignItems: 'center',
                  paddingTop: '0 !important',
                }}
              >
                {/* <Box>
                  <Tooltip title="Filters">
                    <IconButton
                      size="small"
                      aria-haspopup="true"
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '18px',
                          cursor: 'pointer',
                        }}
                      >
                        <Badge badgeContent={filtersApplied} color="secondary" showZero>
                          <MdFilterAlt color="white" size={'25px'} />
                        </Badge>
                      </Box>
                    </IconButton>
                  </Tooltip>
                </Box> */}
                <Filter
                  filtersApplied={filtersApplied}
                  filterChipBoxes={filterChipBoxes}
                  selectBoxArray={selectBoxArray}
                  handleApplyFilter={applyFilter}
                  handleClearFilter={handleClearFilter}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        {tabs.tab1 ? (
          <SoftBox
          //  py= {1}
          >
            {/* <Grid> */}
            {(pageStateInventory?.loader || pageSearchState?.loader) && (
              <Box
                sx={{
                  height: '37rem',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner />
              </Box>
            )}
            {debouncedSearchInventory !== ''
              ? !pageSearchState?.loader && (
                  <SoftBox>
                    <div
                      style={{
                        height: 635,
                      }}
                    >
                      <DataGrid
                        rows={pageSearchState?.datRows}
                        columns={columns}
                        rowCount={parseInt(pageSearchState.total)}
                        loading={pageSearchState?.loader}
                        pagination
                        page={pageSearchState?.page - 1}
                        pageSize={pageSearchState?.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          setPageSearchState((old) => ({ ...old, page: newPage + 1 }));
                        }}
                        onPageSizeChange={(newPageSize) =>
                          setPageSearchState((old) => ({ ...old, pageSize: newPageSize }))
                        }
                        getRowId={(row) => row?.offerId}
                        onCellClick={(rows) => handleCellClickInventory(rows)}
                        // disableSelectionOnClick
                        disableColumnMenu
                        sx={{
                          '.MuiDataGrid-iconButtonContainer': {
                            display: 'none',
                          },
                          borderBottomLeftRadius: '10px',
                          borderBottomRightRadius: '10px',
                        }}
                      />
                    </div>
                  </SoftBox>
                )
              : onClickApplied
              ? !pageFilterState?.loader && (
                  <SoftBox>
                    <div
                      style={{
                        height: 635,
                      }}
                    >
                      <DataGrid
                        rows={pageFilterState?.datRows}
                        columns={columns}
                        rowCount={parseInt(pageFilterState.total)}
                        loading={pageFilterState?.loader}
                        pagination
                        page={pageFilterState?.page - 1}
                        pageSize={pageFilterState?.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          setPageFilterState((old) => ({ ...old, page: newPage + 1 }));
                        }}
                        onPageSizeChange={(newPageSize) =>
                          setPageFilterState((old) => ({ ...old, pageSize: newPageSize }))
                        }
                        getRowId={(row) => row?.offerId}
                        onCellClick={(rows) => handleCellClickInventory(rows)}
                        // disableSelectionOnClick
                        disableColumnMenu
                        sx={{
                          '.MuiDataGrid-iconButtonContainer': {
                            display: 'none',
                          },
                          borderBottomLeftRadius: '10px',
                          borderBottomRightRadius: '10px',
                        }}
                      />
                    </div>
                  </SoftBox>
                )
              : !pageStateInventory?.loader && (
                  <SoftBox>
                    <div
                      style={{
                        height: 635,
                      }}
                    >
                      <DataGrid
                        rows={pageStateInventory?.datRows}
                        columns={columns}
                        rowCount={parseInt(pageStateInventory.total)}
                        loading={pageStateInventory?.loader}
                        pagination
                        page={pageStateInventory?.page - 1}
                        pageSize={pageStateInventory?.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          setPageStateInventory((old) => ({ ...old, page: newPage + 1 }));
                        }}
                        onPageSizeChange={(newPageSize) =>
                          setPageStateInventory((old) => ({ ...old, pageSize: newPageSize }))
                        }
                        getRowId={(row) => row?.offerId}
                        onCellClick={(rows) => handleCellClickInventory(rows)}
                        // disableSelectionOnClick
                        disableColumnMenu
                        sx={{
                          '.MuiDataGrid-iconButtonContainer': {
                            display: 'none',
                          },
                          borderBottomLeftRadius: '10px',
                          borderBottomRightRadius: '10px',
                        }}
                      />
                    </div>
                  </SoftBox>
                )}
          </SoftBox>
        ) : null}
        {tabs.tab2 ? (
          <SoftBox>
            {(pageState?.loader || pageSearchState?.loader) && (
              <Box
                sx={{
                  height: '37rem',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner />
              </Box>
            )}
            {debouncedSearchInventory !== ''
              ? !pageSearchState?.loader && (
                  <SoftBox>
                    <div
                      style={{
                        height: 635,
                      }}
                    >
                      <DataGrid
                        rows={pageSearchState?.datRows}
                        columns={columns}
                        rowCount={parseInt(pageSearchState.total)}
                        loading={pageSearchState?.loader}
                        pagination
                        page={pageSearchState?.page - 1}
                        pageSize={pageSearchState?.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          setPageSearchState((old) => ({ ...old, page: newPage + 1 }));
                        }}
                        onPageSizeChange={(newPageSize) =>
                          setPageSearchState((old) => ({ ...old, pageSize: newPageSize }))
                        }
                        getRowId={(row) => row?.offerId}
                        onCellClick={(rows) => handleCellClickInventory(rows)}
                        // disableSelectionOnClick
                        disableColumnMenu
                        sx={{
                          '.MuiDataGrid-iconButtonContainer': {
                            display: 'none',
                          },
                          borderBottomLeftRadius: '10px',
                          borderBottomRightRadius: '10px',
                        }}
                      />
                    </div>
                  </SoftBox>
                )
              : onClickApplied
              ? !pageFilterState?.loader && (
                  <SoftBox>
                    <div
                      style={{
                        height: 635,
                      }}
                    >
                      <DataGrid
                        rows={pageFilterState?.datRows}
                        columns={columns}
                        rowCount={parseInt(pageFilterState.total)}
                        loading={pageFilterState?.loader}
                        pagination
                        page={pageFilterState?.page - 1}
                        pageSize={pageFilterState?.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          setPageFilterState((old) => ({ ...old, page: newPage + 1 }));
                        }}
                        onPageSizeChange={(newPageSize) =>
                          setPageFilterState((old) => ({ ...old, pageSize: newPageSize }))
                        }
                        getRowId={(row) => row?.offerId}
                        onCellClick={(rows) => handleCellClickInventory(rows)}
                        // disableSelectionOnClick
                        disableColumnMenu
                        sx={{
                          '.MuiDataGrid-iconButtonContainer': {
                            display: 'none',
                          },
                          borderBottomLeftRadius: '10px',
                          borderBottomRightRadius: '10px',
                        }}
                      />
                    </div>
                  </SoftBox>
                )
              : !pageState?.loader && (
                  <div
                    style={{
                      height: 635,
                    }}
                  >
                    <DataGrid
                      rows={pageState?.datRows}
                      columns={columns}
                      rowCount={parseInt(pageState.total)}
                      loading={pageState?.loader}
                      pagination
                      page={pageState?.page - 1}
                      pageSize={pageState?.pageSize}
                      paginationMode="server"
                      onPageChange={(newPage) => {
                        setPageState((old) => ({ ...old, page: newPage + 1 }));
                      }}
                      onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                      getRowId={(row) => row?.offerId}
                      onCellClick={(rows) => handleCellClickInventory(rows)}
                      // disableSelectionOnClick
                      disableColumnMenu
                      sx={{
                        '.MuiDataGrid-iconButtonContainer': {
                          display: 'none',
                        },
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px',
                      }}
                    />
                  </div>
                )}
          </SoftBox>
        ) : null}
      </SoftBox>
    </>
  );
};

export default ListingAllOffer;
