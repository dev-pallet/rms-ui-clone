import { DataGrid } from '@mui/x-data-grid';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import { useNavigate } from 'react-router-dom';
import './order.css';
// import { getVendorSKUData } from 'config/Services';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import { Card } from '@mui/material';
import SoftButton from 'components/SoftButton';
import Spinner from 'components/Spinner/index';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { vendorSkuDetails } from '../../../../../config/Services';
import { ClearSoftInput, CopyToClipBoard, productIdByBarcode } from '../../../Common/CommonFunction';
import { dataGridStyles } from '../../../Common/NewDataGridStyle';

export const Order = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [searchPurchases, setSearchPurchases] = useState('');
  const [dataRows, setTableRows] = useState(null);
  const [loader, setLoader] = useState(false);
  const [errorComing, setErrorComing] = useState(false);
  let dataArr,
    dataRow = [];

  const handleFilterPurchases = (e) => {
    const search = e.target.value;
    if (search.length === 0) {
      setSearchPurchases('');
    } else {
      setSearchPurchases(e.target.value);
    }
  };

  // clear purchase search input fn
  const handleClearPurchaseSearch = () => {
    setSearchPurchases('');
  };

  const filterDataForSKU = {
    names: [],
    supportedVendor: [vendorId],
    sort: {
      mrpSortOption: 'DEFAULT',
      creationDateSortOption: 'DEFAULT',
    },
  };

  // const filteredSKUData = (searchVal) => {
  //   const filterDataForSKUPayload = {
  //     names: [searchVal],
  //     supportedVendor: [vendorId],
  //     sort: {
  //       mrpSortOption: 'DEFAULT',
  //       creationDateSortOption: 'DEFAULT',
  //     },
  //   };

  //   filterVendorSKUData(filterDataForSKUPayload)
  //     .then((result) => {
  //       dataArr = result.data.data;
  //       if (dataArr.products.length) {
  //         dataRow.push(
  //           dataArr?.products?.map((row) => ({
  //             prodId: row.id,
  //             prodName: row ? row.name : '-',
  //             //prodStatus: row.productSource.productStatus ? row.productSource.productStatus : '-',
  //             mrp: row.mrp.mrp ? row.mrp.mrp : '--',
  //             category: row.main_category ? row.main_category : '--',
  //             net_content: row.weights_and_measures ? row.weights_and_measures?.net_content : '-',
  //             unit: row.weights_and_measures ? row.weights_and_measures?.measurement_unit : '-',
  //             cgst: row.cgst ? row.cgst : '--',
  //             igst: row.igst ? row.igst : '--',
  //             gtin: row.gtin ? row.gtin : '-',
  //           })),
  //         );
  //         setTableRows(dataRow[0]);
  //         setLoader(false);
  //         setErrorComing(false);
  //       } else {
  //         setLoader(false);
  //         setErrorComing(true);
  //       }
  //     })
  //     .catch((error) => {
  //       setLoader(false);
  //       setErrorComing(true);
  //     });
  // };

  const filteredSKUData = async (searchVal) => {
    const payload = {
      vendorId: [vendorId],
      // vendorName: [searchVal],
      gtin: [searchVal],
      // pan: [searchVal],
      // gstNo: [searchVal],
    };

    try {
      setLoader(true);
      const res = await vendorSkuDetails(payload);
      const result = res?.data?.data;

      if (result?.object.length) {
        dataRow.push(
          result?.object?.map((row) => ({
            gtin: row?.gtin ? row?.gtin : '--',
            productName: row?.productName ? row?.productName : '--',
            productPrice: row?.productPrice ? '₹' + row?.productPrice : '---',
            purchaseMargin: row?.purchaseMargin ? row?.purchaseMargin + ' %' : '---',
            status: row?.status ? '₹' + row?.status : '---',
            stockValue: row?.stockValue ? '₹' + row?.stockValue : '---',
            availableStocks: row?.availableStocks ? '₹' + row?.availableStocks : '---',

            vendorProductPrice: row?.vendorProductPrice ? '₹' + row?.vendorProductPrice : '--',
            availableStocks: row?.availableStocks ? row?.availableStocks : '--',
            totalStocks: row?.totalStocks ? row?.totalStocks : '--',
          })),
        );
        setTableRows(dataRow[0]);
        setLoader(false);
        setErrorComing(false);
      } else {
        setLoader(false);
        setErrorComing(true);
      }
    } catch (err) {
      setLoader(false);
      setErrorComing(true);
    }
  };

  const allVendorSKUData = async () => {
    const payload = {
      vendorId: [vendorId],
    };

    try {
      setLoader(true);
      const res = await vendorSkuDetails(payload);

      // console.log({ skuData: res });
      const result = res?.data?.data;

      if (result?.object.length) {
        dataRow.push(
          result?.object?.map((row) => ({
            gtin: row?.gtin ? row?.gtin : '--',
            productName: row?.productName ? row?.productName : '--',
            productPrice: row?.productPrice ? '₹' + row?.productPrice : '---',
            purchaseMargin: row?.purchaseMargin ? row?.purchaseMargin + ' %' : '---',
            status: row?.status ? '₹' + row?.status : '---',
            stockValue: row?.stockValue ? '₹' + row?.stockValue : '---',
            availableStocks: row?.availableStocks ? '₹' + row?.availableStocks : '---',

            vendorProductPrice: row?.vendorProductPrice ? '₹' + row?.vendorProductPrice : '--',
            availableStocks: row?.availableStocks ? row?.availableStocks : '--',
            totalStocks: row?.totalStocks ? row?.totalStocks : '--',
          })),
        );
        setTableRows(dataRow[0]);
        setLoader(false);
        setErrorComing(false);
      } else {
        setLoader(false);
        setErrorComing(true);
      }
    } catch (err) {
      setLoader(false);
      setErrorComing(true);
    }
  };

  // const allVendorSKUData = (filterDataForSKU) => {
  //   setLoader(true);
  //   getAllProducts(filterDataForSKU)
  //     .then(function (result) {
  //       dataArr = result.data.data;
  //       dataRow.push(
  //         dataArr?.products?.map((row) => ({
  //           prodId: row.id,
  //           prodName: row ? row.name : '-',
  //           mrp: row.mrp.mrp ? row.mrp.mrp : '--',
  //           category: row.main_category ? row.main_category : '--',
  //           net_content: row.weights_and_measures ? row.weights_and_measures?.net_content : '-',
  //           unit: row.weights_and_measures ? row.weights_and_measures?.measurement_unit : '-',
  //           cgst: row.cgst ? row.cgst : '--',
  //           igst: row.igst ? row.igst : '--',
  //           gtin: row.gtin ? row.gtin : '-',
  //         })),
  //       );
  //       setTableRows(dataRow[0]);
  //       setLoader(false);
  //       setErrorComing(false);
  //     })
  //     .catch((error) => {
  //       setLoader(false);
  //       setErrorComing(true);
  //     });
  // };

  // const columns = [
  //   {
  //     field: 'prodName',
  //     headerName: 'Product Name',
  //     headerClassName: 'datagrid-columns',
  //     headerAlign: 'left',
  //     minWidth: 250,
  //     cellClassName: 'datagrid-rows',
  //     flex: 1,
  //     align: 'left',
  //   },
  //   {
  //     field: 'mrp',
  //     headerName: 'MRP',
  //     headerClassName: 'datagrid-columns',
  //     headerAlign: 'left',
  //     minWidth: 100,
  //     cellClassName: 'datagrid-rows',
  //     flex: 1,
  //     align: 'left',
  //   },
  //   // {
  //   //   field: 'category',
  //   //   headerName: 'Category',
  //   //   headerClassName: 'datagrid-columns',
  //   //   headerAlign: 'left',
  //   //   minWidth: 150,
  //   //   cellClassName: 'datagrid-rows',
  //   //   flex: 1,
  //   //   align: 'left',
  //   // },
  //   {
  //     field: 'net_content',
  //     headerName: 'Specification',
  //     headerClassName: 'datagrid-columns',
  //     headerAlign: 'left',
  //     minWidth: 150,
  //     cellClassName: 'datagrid-rows',
  //     flex: 1,
  //     align: 'left',
  //   },
  //   {
  //     field: 'unit',
  //     headerName: 'Unit',
  //     headerClassName: 'datagrid-columns',
  //     headerAlign: 'left',
  //     minWidth: 150,
  //     cellClassName: 'datagrid-rows',
  //     flex: 1,
  //     align: 'left',
  //   },
  //   {
  //     field: 'cgst',
  //     headerName: 'CGST',
  //     headerClassName: 'datagrid-columns',
  //     headerAlign: 'left',
  //     minWidth: 150,
  //     cellClassName: 'datagrid-rows',
  //     flex: 1,
  //     align: 'left',
  //   },
  //   {
  //     field: 'igst',
  //     headerName: 'IGST',
  //     headerClassName: 'datagrid-columns',
  //     headerAlign: 'left',
  //     minWidth: 150,
  //     cellClassName: 'datagrid-rows',
  //     flex: 1,
  //     align: 'left',
  //   },
  //   {
  //     field: 'gtin',
  //     headerName: 'GTIN',
  //     headerClassName: 'datagrid-columns',
  //     headerAlign: 'left',
  //     minWidth: 150,
  //     cellClassName: 'datagrid-rows',
  //     flex: 1,
  //     align: 'left',
  //     renderCell: (params) => {
  //       return <CopyToClipBoard params={params} />;
  //     },
  //   },
  // ];

  const columns = [
    {
      field: 'productName',
      headerName: 'Title',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      flex: 1,
      align: 'left',
    },
    {
      field: 'gtin',
      headerName: 'Barcode',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      flex: 1,
      align: 'left',
      renderCell: (params) => {
        return <CopyToClipBoard params={params} />;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 120,
      cellClassName: 'datagrid-rows',
      flex: 1,
      align: 'left',
    },

    {
      field: 'productPrice',
      headerName: 'Mrp',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 80,
      cellClassName: 'datagrid-rows',
      flex: 1,
      align: 'left',
    },
    {
      field: 'purchaseMargin',
      headerName: 'Purchase margin',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      flex: 1,
      align: 'left',
    },
    {
      field: 'stockValue',
      headerName: 'Stock value',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      flex: 1,
      align: 'left',
    },
    {
      field: 'availableStocks',
      headerName: 'Available units',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      flex: 1,
      align: 'left',
    },
  ];

  useEffect(() => {
    let timer = '';
    if (searchPurchases.length) {
      timer = setTimeout(() => {
        filteredSKUData(searchPurchases);
      }, 1000);
    } else {
      allVendorSKUData(filterDataForSKU);
    }
    return () => clearTimeout(timer);
  }, [searchPurchases]);

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  const navigateToDetailsPage = (gtin) => {
    handleProductNavigation(gtin);
  };

  const handleNew = () => {
    localStorage.setItem('vendorIdForProductPortfolioFromSku', vendorId);
    navigate('/products/all-products/add-products');
  };

  return (
    <>
      {dataRows ? (
        <SoftBox className="order-box">
          <SoftBox
            className="filter-product-list"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <SoftBox className="filter-add-list" sx={{ position: 'relative' }}>
              <SoftInput
                className="filter-soft-input-box"
                placeholder="Filter Purchases"
                value={searchPurchases}
                icon={{ component: 'search', direction: 'left' }}
                onChange={(e) => handleFilterPurchases(e)}
                size="small"
              />
              {searchPurchases !== '' && <ClearSoftInput clearInput={handleClearPurchaseSearch} marginTop={'8px'} />}
            </SoftBox>

            <SoftBox>
              <SoftButton className="small-inner-bills-box vendor-add-btn" size="small" onClick={() => handleNew()}>
                <AddIcon /> New
              </SoftButton>
            </SoftBox>
          </SoftBox>

          <SoftBox py={1}>
            <div style={{ height: 400, width: '100%' }}>
              {loader && <Spinner />}
              {dataRows !== null && !loader && (
                <DataGrid
                  sx={{ ...dataGridStyles.header, borderRadius: '20px' }}
                  rows={dataRows || []}
                  rowsPerPageOptions={[10]}
                  getRowId={(row) => row.gtin}
                  // checkboxSelection disableSelectionOnClick
                  onCellClick={(rows) => {
                    if (rows.field !== 'gtin') {
                      navigateToDetailsPage(rows.row['gtin']);
                    }
                  }}
                  columns={columns}
                />
              )}
            </div>
          </SoftBox>
        </SoftBox>
      ) : (
        <Card className="vendorCardShadow" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            <div>
              <CategoryIcon sx={{ color: '#0562fb', fontSize: '30px' }} />
            </div>
            <SoftTypography fontSize="14px" fontWeight="bold" variant="caption">
              Sorry , no products found for this vendor
            </SoftTypography>
            <SoftButton color="info" onClick={() => handleNew()}>
              + Add
            </SoftButton>
          </div>
        </Card>
      )}
    </>
  );
};
