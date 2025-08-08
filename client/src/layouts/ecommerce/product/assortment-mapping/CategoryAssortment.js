import { Grid, InputLabel, Tooltip } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import SoftSelect from '../../../../components/SoftSelect';
import {
  fetchAssortmentMappingProducts,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
  getAllProductsV2New,
  saveAssortmentMapping,
} from '../../../../config/Services';
import SoftTypography from '../../../../components/SoftTypography';
import { dataGridStyles } from '../../Common/NewDataGridStyle';
import SelectProductModal from './SelectProductModal';
import SoftButton from '../../../../components/SoftButton';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: '95vw',
  maxHeight: '100vh',
  minHeight: '30vh',
  bgcolor: 'background.paper',
  border: '1px solid gray',
  borderRadius: '10px',
  boxShadow: 14,
  p: 3,
};
const CategoryAssortment = ({ selectedFromLoc = {}, selectedToLoc = {} }) => {
  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [mainCatArr, setMainCatArr] = useState([]);
  const [level1CatArr, setLevel1CatArr] = useState([]);
  const [level2CatArr, setLevel2CatArr] = useState([]);
  const [formData, setFormData] = useState({});
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [brandRows, setBrandRows] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [brandProductLoader, setBrandProductLoader] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [productPage, setProductPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState();
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const userName = localStorage.getItem('user_name');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const columns = [
    {
      field: 'label',
      headerName: 'Category',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'totalVariantCount',
      headerName: 'Total Variants',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Tooltip title="View products" placement="right">
            <SoftTypography
              sx={{
                // backgroundColor: '#0562FB',
                cursor: 'pointer',
                fontSize: '0.75rem',
              }}
              onClick={handleOpen}
            >
              {params?.row?.totalVariantCount}
            </SoftTypography>
          </Tooltip>
        );
      },
    },
    {
      field: 'totalVendorCount',
      headerName: 'Total Vendors',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'docCount',
      headerName: 'Document Count',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
  ];

  const updateFormData = useCallback((key, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }, []);

  useEffect(() => {
    if (!selectedFromLoc?.value) {
      showSnackbar('Select Source location', 'warning');
      return;
    }
    const payload = {
      page: page,
      pageSize: 10,
      type: ['APP'],
      sourceId: [orgId],
      sourceLocationId: [selectedFromLoc?.value],
      active: [true],
    };

    getAllMainCategory(payload).then((response) => {
      const results = response?.data?.data?.results || [];
      const totalResults = response?.data?.data?.totalResults || 0;
      setTotalResults(totalResults);
      const cat = results?.map((e) => ({
        value: e?.mainCategoryId,
        label: e?.categoryName,
      }));
      setMainCatArr(cat);
    });
  }, [page]);

  useEffect(() => {
    if (mainCatArr?.length > 0) {
      const categoryName = mainCatArr?.map((e) => e.label);
      handleFetchCategoryData(categoryName);
    }
  }, [mainCatArr, page]);

  const handleMainCatChange = useCallback(
    (option) => {
      updateFormData('catLevel1', option);
      const payload = {
        page: 1,
        pageSize: 100,
        mainCategoryId: [option?.value],
      };

      if (option) {
        getAllLevel1Category(payload).then((response) => {
          const cat =
            response?.data?.data?.results?.map((e) => ({
              value: e?.level1Id,
              label: e?.categoryName,
            })) || [];
          setLevel1CatArr(cat);
          updateFormData('catLeve2Arr', cat);
        });
      }
    },
    [updateFormData],
  );

  const handleLevel2CatChange = useCallback(
    (option) => {
      updateFormData('catLevel2', option);
      const payload = {
        page: 1,
        pageSize: 100,
        level1Id: [option?.value],
      };

      if (option) {
        getAllLevel2Category(payload).then((response) => {
          const cat =
            response?.data?.data?.results?.map((e) => ({
              value: e?.level2Id,
              label: e?.categoryName,
              hsn: e?.hsnCode,
              igst: e?.igst,
              sgst: e?.sgst,
              cgst: e?.cgst,
            })) || [];
          setLevel2CatArr(cat);
          updateFormData('catLeve3Arr', cat);
        });
      }
    },
    [updateFormData],
  );

  const handleLevel3CatChange = useCallback(
    (option) => {
      updateFormData('catLevel3', option);
      updateFormData('hsn', option?.hsn);
      updateFormData('igst', option?.igst);
      updateFormData('cgst', option?.cgst);
      updateFormData('sgst', option?.sgst);
    },
    [updateFormData],
  );
  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
    // Fetch new data based on the new page
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    // Fetch new data based on the new page size
  };

  const handleFetchCategoryData = (categoryNames) => {
    const payload = {
      type: 'CATEGORY_LEVEL_1',
      value: categoryNames,
      storeId: locId,
    };
    fetchAssortmentMappingProducts(payload)
      .then((res) => {
        const rawData = res?.data?.data?.data || {};
        let parsedData;

        if (typeof rawData === 'string') {
          try {
            // Remove the prefix "Aggregate: " if it exists
            const jsonString = rawData.startsWith('Aggregate: ') ? rawData.slice(11) : rawData;
            parsedData = JSON.parse(jsonString);
          } catch (e) {
            console.error('Invalid JSON string:', rawData);
            return;
          }
        } else {
          parsedData = rawData;
        }

        const buckets = parsedData?.buckets;

        const usableData = buckets?.map((bucket) => ({
          category: bucket.key,
          totalVariantCount: bucket['sum#totalVariantCount']?.value,
          totalVendorCount: bucket['sum#totalVendorCount']?.value,
          docCount: bucket?.doc_count,
        }));
        const labelToValueMap = mainCatArr.reduce((acc, { label, value }) => {
          acc[label] = value;
          return acc;
        }, {});

        const updatedUsableData = usableData?.map((data) => ({
          ...data,
          category: labelToValueMap[data?.category] || data?.category,
        }));

        const updatedMainCatArr = mainCatArr?.map((cat) => {
          const match = updatedUsableData?.find((data) => data?.category === cat?.value);
          return match ? { ...cat, ...match } : { ...cat, totalVariantCount: 0, totalVendorCount: 0, docCount: 0 };
        });

        setRows(updatedMainCatArr || []);
        setRowCount(updatedMainCatArr.length);
      })
      .catch((error) => {
        console.error('Error fetching category data:', error);
      });
  };

  const fetchCategoryProductData = (category) => {
    setSelectedCategory(selectedCategory ? selectedCategory : category);
    setBrandProductLoader(true);
    // fetching products for respective brand
    const payload = {
      page: productPage,
      pageSize: 10,
      names: [],
      brands: [],
      barcode: [],
      manufacturers: [],
      appCategories: {
        categoryLevel1: [category ? category?.row?.label || '' : selectedCategory?.row?.label || ''],
        categoryLevel2: [],
        categoryLevel3: [],
      },
      productStatus: [],
      preferredVendors: [],
      sortByPrice: 'DEFAULT',
      sortByCreatedAt: 'DESC',
      storeLocations: selectedFromLoc?.value ? [selectedFromLoc?.value] : [locId],
    };
    getAllProductsV2New(payload)
      .then((res) => {
        const data = res?.data?.data?.data?.data;
        const count = res?.data?.data?.data?.totalRecords || 0;
        const formatedRows = data?.map((item) => ({
          productId: item?.id,
          uom: item?.unitOfMeasure,
          name: item?.name,
          brand: item?.companyDetail?.brand,
          mrp: item?.variants?.[0]?.mrpData?.[0]?.mrp || 'NA',
          barcode: item?.variants?.[0]?.barcodes?.[0] || 'NA',
        }));
        setBrandRows(formatedRows || []);
        setTotalCount(count);
        setBrandProductLoader(false);
      })
      .catch(() => {
        setBrandProductLoader(false);
      });
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryProductData();
    }
  }, [productPage]);

  const handleRowClick = (row) => {
    const selectedIndex = selectedRows?.indexOf(row);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, row];
    } else if (selectedIndex === 0) {
      newSelected = [...selectedRows.slice(1)];
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = [...selectedRows.slice(0, -1)];
    } else if (selectedIndex > 0) {
      newSelected = [...selectedRows.slice(0, selectedIndex), ...selectedRows.slice(selectedIndex + 1)];
    }

    setSelectedRows(newSelected);
  };

  const isSelected = (row) => {
    return selectedRows?.some((selectedRow) => selectedRow.productId === row.productId);
  };

  const handleCategoryAssortmentMapping = () => {
    const payload = {
      storeModels: [
        {
          sourceId: orgId,
          sourceName: orgId,
          sourceLocationId: selectedToLoc?.value,
          sourceLocationName: selectedToLoc?.value,
          sourceType: 'RETAIL',
        },
      ],
      copyFromStoreLocationId: selectedFromLoc?.value,
      productFilterModelV2: {
        storeLocationId: locId,
        ids: selectedRows?.map((item) => item?.productId),
        barcode: selectedRows?.map((item) => item?.barcode),
        // brands: selectedRowIds?.map((item) => item?.brand),
      },
      createdBy: uidx,
      createdByName: userName,
    };
    saveAssortmentMapping(payload)
      .then((res) => {})
      .catch(() => {});
  };

  return (
    <div style={{ padding: '15px' }}>
      <SelectProductModal
        open={open}
        handleClose={handleClose}
        brandRows={brandRows}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        brandProductLoader={brandProductLoader}
        handleRowClick={handleRowClick}
        isSelected={isSelected}
        style={style}
        totalCount={totalCount}
        setPage={setProductPage}
        page={productPage}
      />
      <div style={{ height: 540, width: '100%' }}>
        <DataGrid
          sx={{ ...dataGridStyles.header, borderRadius: '20px' }}
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          checkboxSelection
          pagination
          paginationMode="server"
          rowCount={totalResults || 0}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          getRowId={(row) => row.value}
          onSelectionModelChange={handleSelectionChange}
          selectionModal={selectedRows}
          onRowClick={(row) => fetchCategoryProductData(row)}
        />
      </div>
      <br />
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <SoftButton variant="outlined" color="info" onClick={() => navigate(-1)}>
          Cancel
        </SoftButton>
        <SoftButton color="info" onClick={handleCategoryAssortmentMapping}>
          Next
        </SoftButton>
      </div>
    </div>
  );
};

export default CategoryAssortment;
