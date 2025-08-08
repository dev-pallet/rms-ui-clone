import '../../../purchase-return.css';
import { Autocomplete, TextField, Tooltip } from '@mui/material';
import {
  getItemsInfo,
  removeInventoryReturnItem,
} from '../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { v4 as uuidv4 } from 'uuid';
import CancelIcon from '@mui/icons-material/Cancel';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import PurchaseReturnsBatchList from './batchListing';
import React, { useEffect, useRef, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';

const PurchaseReturnProductList = ({
  itemarray,
  rowData,
  setRowData,
  isItemChanged,
  setIsItemChanged,
  returnJobId,
  createNew,
  update,
  setListDisplay,
  vendorId,
  vendorDisplayName,
  isVendorSelected,
}) => {
  const boxRef = useRef(null);
  const boxRef2 = useRef(null);
  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');

  const [productSelected, setProductSelected] = useState(Array(rowData?.length).fill(false));
  const [reasonSelected, setReasonSelected] = useState(Array(rowData?.length).fill(false));
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [curentProductName, setCurentProductName] = useState('');
  const debounceProductName = useDebounce(curentProductName, 700);
  const [currIndex, setCurreIndex] = useState(1);
  const [productIndex, setProductIndex] = useState(0);
  const [currGtin, setCurrGtin] = useState('');
  const [currName, setCurrName] = useState('');
  const [quantChange, setQuantChange] = useState('');
  const [quantIndex, setQuantIndex] = useState('');
  const debounceQuant = useDebounce(quantChange, 700);

  useEffect(() => {
    const updatedRow = itemarray?.map((e) => {
      return {
        itemId: uuidv4(),
        rjItemId: e?.rjItemId || null,
        itemCode: e?.itemCode,
        itemName: e?.itemName,
        batchNo: e?.batchNo || '',
        vendorName: e?.vendorName || '',
        vendorId: e?.vendorId || '',
        purchasePrice: e?.purchasePrice || '',
        poNumber: e?.poNumber || '',
        quantity: e?.quantity || '',
        igst: e?.igst || '',
        cgst: e?.cgst || '',
        sgst: e?.sgst || '',
        reason: e?.reason || '',
        availableUnits: e?.currentStock || '',
        expiryDate: e?.expiryDate || '',
      };
    });
    setRowData(updatedRow);
    setProductSelected(Array(updatedRow.length).fill(false));
  }, [itemarray]);

  useEffect(() => {
    if (debounceQuant !== '') {
      if (!returnJobId) {
        setListDisplay(false);
        createNew();
      }
      setQuantChange('');
      setQuantIndex('');
    }
  }, [debounceQuant]);

  const [openModal, setOpenModal] = useState(false);
  const handleCloseModal = () => {
    setOpenModal(false);
    setIsSelected(false);
  };
  const handleChangeIO = (e, index) => {
    if (e.target.value === '') {
      return;
    }
    setCurentProductName(e.target.value);
    setProductIndex(index);
  };

  const reasons = [
    { value: 'Expired products', label: 'Expired products' },
    { value: 'Slow moving', label: 'Slow moving' },
    { value: 'Wrong item delivered', label: 'Wrong item delivered' },
    { value: 'Broken', label: 'Broken' },
    { value: 'Others', label: 'Others' },
  ];

  let retryCount = 0;
  useEffect(() => {
    if (debounceProductName !== '' || debounceProductName !== undefined) {
      const searchProduct = async () => {
        const searchText = debounceProductName;
        const isNumber = !isNaN(+searchText);
        const payload = {
          page: 1,
          pageSize: '100',
          names: [searchText],
          productStatuses: ['CREATED'],
        };
        if (contextType === 'RETAIL') {
          payload.supportedStore = [locId];
        } else if (contextType === 'WMS') {
          payload.supportedWarehouse = [locId];
        } else if (contextType === 'VMS') {
          payload.marketPlaceSeller = [locId];
        }
        if (searchText !== '') {
          if (isNumber) {
            payload.gtin = [searchText];
            payload.names = [];
          } else {
            payload.gtin = [];
            payload.names = [searchText];
          }
        } else {
          payload.gtin = [];
          payload.names = [];
        }
        if (searchText.length >= 3) {
          getItemsInfo(payload)
            .then(function (response) {
              if (response?.data?.data?.code === 'ECONNRESET') {
                if (retryCount < 3) {
                  searchProduct();
                  retryCount++;
                } else {
                  showSnackbar('Some Error Occured, Try again', 'error');
                  setLoader(false);
                }
              } else if (response?.data?.status === 'SUCCESS') {
                if (response?.data?.data?.products.length === 0) {
                  setAutocompleteTitleOptions([]);
                  setAutocompleteBarcodeOptions([]);
                } else if (response?.data?.data?.products.length === 1) {
                  selectProduct(response?.data?.data?.products[0], productIndex);
                } else {
                  if (!isNumber) {
                    setAutocompleteTitleOptions(response?.data?.data?.products);
                  } else {
                    setAutocompleteBarcodeOptions(response?.data?.data?.products);
                  }
                }
              }
            })
            .catch((err) => {
              showSnackbar(err?.response?.data?.message, 'error');
            });
        } else if (searchText === '0') {
        }
      };
      searchProduct();
    }
  }, [debounceProductName]);

  const selectProduct = (item, index) => {
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    setCurentProductName('');
    if (item?.gtin !== undefined && item?.gtin !== '') {
      handleBarcodePresent(item?.gtin, item?.name, index);
      setIsSelected(true);
    }
  };

  const handleBarcodePresent = (gtin, name, index) => {
    setCurreIndex(index);
    setCurrGtin(gtin);
    setCurrName(name);
    setTimeout(() => {
      setOpenModal(true);
    }, 700);
  };

  const handleChangeQTYValues = (e, index) => {
    const updateRowData = [...rowData];
    updateRowData[index]['quantity'] = e.target.value;
    setRowData(updateRowData);
    if (
      rowData[index]?.reason !== '' &&
      rowData[index]?.reason !== undefined &&
      rowData[index]?.purchasePrice !== '' &&
      rowData[index]?.purchasePrice !== undefined
    ) {
      setQuantChange(e.target.value);
      setQuantIndex(index);
      setIsItemChanged(true);
    }
  };
  const handleChangePPValues = (e, index) => {
    const updateRowData = [...rowData];
    updateRowData[index]['purchasePrice'] = e.target.value;
    setRowData(updateRowData);
    if (
      rowData[index]?.reason !== '' &&
      rowData[index]?.reason !== undefined &&
      rowData[index]?.quantity !== '' &&
      rowData[index]?.quantity !== undefined
    ) {
      setQuantChange(e.target.value);
      setQuantIndex(index);
      setIsItemChanged(true);
    }
  };
  const handleReason = (e, index) => {
    const updateRowData = [...rowData];
    updateRowData[index]['reason'] = e.label;
    // if (e.label === 'Others') {
    //   updateRowData[index] = '';
    // } else {
    if (rowData[index]?.quantity !== '' && rowData[index]?.quantity !== undefined) {
      setQuantChange(e.label);
      setQuantIndex(index);
      setIsItemChanged(true);
    }
    // }
    setRowData(updateRowData);

    const updatedReasonSelected = [...reasonSelected];
    updatedReasonSelected[index] = true;
    setReasonSelected(updatedReasonSelected);
  };

  const handleMoreDetails = (gtin, index) => {
    setOpenModal(true);
    setCurreIndex(index);
  };

  const handleAddmore = () => {
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);

    const newRowData = [
      ...rowData,
      {
        itemId: uuidv4(),
        rjItemId: null,
        itemCode: '',
        itemName: '',
        batchNo: '',
        vendorName: '',
        vendorId: '',
        purchasePrice: '',
        poNumber: '',
        quantity: '',
        igst: '',
        cgst: '',
        sgst: '',
        reason: '',
        availableUnits: '',
      },
    ];
    setRowData(newRowData);

    const targetScrollPosition = 10050;

    if (boxRef.current) {
      const scrollStep = (targetScrollPosition - boxRef.current.scrollTop) / 20;
      let currentScrollPosition = boxRef.current.scrollTop;

      const animateScroll = () => {
        if (Math.abs(currentScrollPosition - targetScrollPosition) <= Math.abs(scrollStep)) {
          boxRef.current.scrollTop = targetScrollPosition;
        } else {
          boxRef.current.scrollTop += scrollStep;
          currentScrollPosition += scrollStep;
          requestAnimationFrame(animateScroll);
        }
      };

      animateScroll();
    }
    if (isItemChanged) {
      update(newRowData);
    }
  };

  const handleDelete = (index) => {
    const updatedRowData = [...rowData];
    updatedRowData.splice(index, 1);
    setRowData(updatedRowData);
    if (rowData[index]?.rjItemId !== '' && rowData[index]?.rjItemId !== null) {
      const payload = {
        rjItemId: rowData[index]?.rjItemId,
      };
      if (returnJobId?.includes('RN')) {
        payload.returnId = returnJobId;
      } else {
        payload.returnJobId = returnJobId;
      }
      removeInventoryReturnItem(payload)
        .then((res) => {
          const response = res?.data?.data;
          if (response?.es) {
            showSnackbar(response?.message || 'Some error occured', 'error');
            return;
          }
          setListDisplay(true);
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        });
    }
  };

  const syncScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const scrollTop = e.target.scrollTop;

    if (e.target === boxRef.current) {
      boxRef2.current.scrollLeft = scrollLeft;
      // boxRef2.current.scrollTop = scrollTop; // Uncomment this line if vertical scrolling should also be synchronized
    } else if (e.target === boxRef2.current) {
      boxRef.current.scrollLeft = scrollLeft;
      // boxRef.current.scrollTop = scrollTop; // Uncomment this line if vertical scrolling should also be synchronized
    }
  };

  return (
    <div>
      <SoftBox style={{ overflowY: 'hidden', overflowX: 'scroll', height: rowData?.length > 10 ? '550px' : 'auto' }}>
        {rowData?.length > 0 && (
          <div
            ref={boxRef}
            style={{
              // marginTop: '10px',
              overflowY: 'scroll',
              overflowX: 'scroll',
              // marginLeft: '-5px',
              minWidth: '1047px',
              maxHeight: rowData?.length > 10 ? '550px' : 'auto',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="express-grn-columns grn-background-color"></th>
                  <th className="express-grn-barcode-column grn-background-color"></th>
                  <th className="express-grn-barcode-column grn-background-color"></th>
                  <th className="express-grn-columns grn-background-color"></th>
                  <th className="express-grn-columns grn-background-color"></th>
                  <th className="express-grn-columns grn-background-color"></th>
                  <th className="express-grn-columns grn-background-color"></th>
                  <th className="express-grn-columns grn-background-color"></th>
                  <th className="express-grn-vendor-column grn-background-color"></th>
                  {/* <th className="express-grn-columns grn-background-color"></th>
                  <th className="express-grn-columns grn-background-color"></th> */}
                  <th className="express-grn-columns grn-background-color"></th>
                </tr>
              </thead>
              <tbody>
                {rowData?.map((row, index) => {
                  const isBarcodeSelected = productSelected[index];
                  const isReasonSelected = reasonSelected[index];
                  {
                    /* const isOthersReason = reasons.every((option) => option.value !== returnReason[index]); */
                  }
                  const pp = row?.purchasePrice === 0 ? 0 : row?.purchasePrice || 0;
                  const qty = row?.quantity || 0;
                  const total = Number(pp) * Number(qty);
                  return (
                    <tr key={row?.itemId} style={{ minWidth: '960px' }}>
                      <td className="express-grn-rows">
                        <SoftInput readOnly={true} value={index + 1} className="product-aligning" />
                      </td>
                      <td className="express-grn-rows">
                        <SoftBox className="product-input-label" style={{ width: '100%' }}>
                          {row?.poNumber !== '' && row?.poNumber ? (
                            <TextField
                              value={row?.itemCode}
                              readOnly={true}
                              style={{
                                width: '100%',
                              }}
                            />
                          ) : (
                            <Autocomplete
                              freeSolo
                              //   disabled={cartId ? false : true}
                              options={autocompleteBarcodeOptions}
                              getOptionLabel={(option) => option.gtin}
                              onChange={(e, newValue) => {
                                selectProduct(newValue, index);
                              }}
                              onInputChange={(e, newInputValue) => {
                                if (e && e.type === 'change') {
                                  handleChangeIO({ target: { value: newInputValue } }, index);
                                }
                              }}
                              style={{
                                width: '100%',
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                    onKeyDown: (e) => {
                                      if (e.key === 'Enter') {
                                        e.stopPropagation();
                                      }
                                    },
                                  }}
                                  type="number"
                                  style={{
                                    width: '100%',
                                  }}
                                />
                              )}
                            />
                          )}
                        </SoftBox>
                      </td>
                      <td className="express-grn-rows">
                        <SoftBox className="product-input-label" style={{ width: '100%' }}>
                          {row?.poNumber !== '' && row?.poNumber ? (
                            <TextField
                              value={row?.itemName}
                              readOnly={true}
                              style={{
                                width: '100%',
                              }}
                            />
                          ) : (
                            <Autocomplete
                              freeSolo
                              //   disabled={cartId ? false : true}
                              options={autocompleteTitleOptions}
                              getOptionLabel={(option) => option.name}
                              onChange={(e, newValue) => {
                                selectProduct(newValue, index);
                              }}
                              onInputChange={(e, newInputValue) => {
                                handleChangeIO({ target: { value: newInputValue } }, index);
                              }}
                              style={{
                                width: '100%',
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  style={{
                                    width: '100%',
                                  }}
                                  // Other TextField props
                                />
                              )}
                            />
                          )}
                        </SoftBox>
                      </td>
                      <td className="express-grn-rows">
                        <Tooltip title={row?.batchNo || ''}>
                          <div>
                            <SoftInput type="text" className="product-aligning" disabled value={row?.batchNo || ''} />
                          </div>
                        </Tooltip>
                      </td>
                      <td className="express-grn-rows">
                        <SoftInput
                          type="number"
                          className="product-aligning"
                          disabled
                          value={row?.availableUnits || ''}
                        />
                      </td>
                      {/* <Grid item xs={1} sm={1} md={1} 
                        >
                          {index === 0 && (
                            <div className='purchase-return-product-list-container'>
                            <SoftBox mb={1} display="flex">
                            <InputLabel
                            required
                            sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                            PO Num.
                            </InputLabel>
                            </SoftBox>
                            </div>
                          )}

                          <SoftInput type="text" disabled value={row?.poNumber || ''} />
                        </Grid> */}
                      <td className="express-grn-rows">
                        <SoftInput
                          type="number"
                          name="purchasePrice"
                          className="product-aligning"
                          disabled={row?.poNumber !== '' && row?.poNumber ? false : true}
                          value={pp}
                          onChange={(e) => {
                            handleChangePPValues(e, index);
                          }}
                        />
                      </td>
                      <td className="express-grn-rows">
                        <SoftInput
                          type="number"
                          name="quantity"
                          className="product-aligning"
                          disabled={row?.poNumber !== '' && row?.poNumber ? false : true}
                          value={qty}
                          onChange={(e) => {
                            handleChangeQTYValues(e, index);
                          }}
                        />
                      </td>
                      <td className="express-grn-rows">
                        <SoftInput
                          type="number"
                          className="product-aligning"
                          disabled
                          value={total || 0 }
                        />
                      </td>
                      <td className="express-grn-rows">
                        <SoftBox className="express-grn-product-box" style={{ width: '100%' }}>
                          <SoftSelect
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              menu: (provided) => ({ ...provided, width: '100%' }), // Force dropdown menu to take full width
                              control: (provided) => ({ ...provided, textAlign: 'left' }), // Align select box to the left
                              option: (provided) => ({ ...provided, textAlign: 'left' }),
                            }}
                            value={reasons.find((option) => option.value === row?.reason)}
                            isDisabled={row?.poNumber !== '' && row?.poNumber ? false : true}
                            onChange={(e) => handleReason(e, index)}
                            options={reasons}
                          />
                        </SoftBox>
                      </td>
                      <td className="express-grn-rows">
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            {row?.batchNo ? (
                              <CreateOutlinedIcon
                                fontSize="small"
                                color="info"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleBarcodePresent(row?.itemCode, row?.itemName, index)}
                              />
                            ) : (
                              ''
                            )}
                          </div>
                          <CancelIcon
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleDelete(index)}
                            fontSize="small"
                            color="error"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SoftBox>
      <SoftTypography
        className="add-more-text"
        // sx={{ marginLeft: '-10px', color: '#0562FB' }}
        onClick={handleAddmore}
        component="label"
        variant="caption"
        fontWeight="bold"
      >
        + Add More
      </SoftTypography>
      {openModal && (
        <PurchaseReturnsBatchList
          rowData={rowData}
          setRowData={setRowData}
          boxRef={boxRef}
          openModal={openModal}
          handleCloseModal={handleCloseModal}
          currIndex={currIndex}
          currGtin={currGtin}
          currName={currName}
          returnJobId={returnJobId}
          setListDisplay={setListDisplay}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          vendorId={vendorId}
          vendorDisplayName={vendorDisplayName}
          isVendorSelected={isVendorSelected}
        />
      )}
    </div>
  );
};

export default PurchaseReturnProductList;
