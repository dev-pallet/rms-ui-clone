import { Autocomplete, Box, IconButton, Modal, TextField, Tooltip } from '@mui/material';
import SoftBox from '../../../../../../components/SoftBox';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftInput from '../../../../../../components/SoftInput';
import AddIcon from '@mui/icons-material/Add';
import FilterGRNComponent from '../Filter-GRN/filterComponent';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import CloseRoundedIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import SoftButton from '../../../../../../components/SoftButton';
import { buttonStyles } from '../../../../Common/buttonColor';
import GRNSearchAndFilterComponent from './searchAndFilter';
import { useDebounce } from 'usehooks-ts';
import { verifyBatch } from '../../../../../../config/Services';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { preventArrowKeyChange } from '../../../../Common/CommonFunction';

const GRNFullScreenProduct = ({
  rowData,
  setRowData,
  setItemChanged,
  openFullScreen,
  tableRef,
  vendorId,
  invoiceRefNo,
  invoiceValue,
  invoiceDate,
  assignedTo,
  productSelected,
  titleSelected,
  setFocusedRowIndex,
  counter,
  handleNavigate,
  autocompleteBarcodeOptions,
  autocompleteTitleOptions,
  selectProduct,
  handleChangeIO,
  handleInputChange,
  handleAdditional,
  handleDltItem,
  toggleFullScreen,
  gstArray,
  filters,
  filterValues,
  handleFilterChange,
  applyFilters,
  handleRemoveFilter,
  debounceItemsearch,
  filteredData,
  totalRowsGRN,
  itemLoader,
  searchItemLoader,
  setSearchItemLoader,
  removeSearchItemLoader,
  searchItem,
  setSearchItem,
  setRemoveSearchItemLoader,
  handleleRemoveSearch,
  handleAddRow,
  total,
  totalStyle,
  isItemChanged,
  handleAddEXPOProduct,
  firstRowRef,
  epoNumber,
  focusedBarcodeIndex,
  focusedTitleIndex,
  debounceProductName,
  productNotFound,
  handleProductNotFound,
}) => {
  const showSnackbar = useSnackbar();
  const locId = localStorage.getItem('locId');
  const [batchCheck, setBatchCheck] = useState('');
  const debouncedValue = useDebounce(batchCheck, 700);
  const [batchBarcodePairs, setBatchBarcodePairs] = useState([]);
  const handleCloseProdModal = () => {
    toggleFullScreen(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && openFullScreen) {
        handleCloseProdModal();
      }
    });
  }, []);

  useEffect(() => {
    if (debouncedValue !== '') {
      const verifyBatches = async () => {
        const lastBatchPair = batchBarcodePairs[batchBarcodePairs.length - 1];
        if (lastBatchPair) {
          const { batchNumber, barcode, indexValue } = lastBatchPair;
          try {
            const res = await verifyBatch(locId, barcode, batchNumber);
            if (res?.data?.data?.object?.available === true) {
              showSnackbar('Batch already present, add different batch', 'error');
              const updatedBatchNos = [...rowData];
              updatedBatchNos[index]['batchNumber'] = '';
              setRowData(updatedBatchNos);
            }
          } catch (err) {}
        }
      };

      verifyBatches();
    }
  }, [debouncedValue]);

  const handleBatchChange = (e, index) => {
    const currentBarcode = rowData[index]?.itemNo;
    if (currentBarcode !== undefined && currentBarcode !== '') {
      setBatchCheck(e.target.value);

      const updatedBatchBarcodePairs = [];
      updatedBatchBarcodePairs[index] = {
        batchNumber: e.target.value,
        barcode: currentBarcode.toString(),
        indexValue: index,
      };
      setBatchBarcodePairs(updatedBatchBarcodePairs);

      const updatedBatchNos = [...rowData];
      updatedBatchNos[index]['batchNumber'] = e.target.value;
      setRowData(updatedBatchNos);
      setItemChanged(true);
    } else {
      showSnackbar('Enter product details', 'error');
    }
  };

  const handleSave = () => {
    if (isItemChanged) {
      handleAddEXPOProduct();
    }
    handleCloseProdModal();
  };

  return (
    <Modal
      open={true}
      onClose={handleCloseProdModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-pi-border"
      sx={{ padding: '20px !important' }}
    >
      <Box
        className="pi-vendor-box"
        sx={{
          position: 'absolute',
          top: '-67px',
          left: '-67px',
          bottom: '-67px',
          right: '-67px',
          // transform: !isMobileDevice && 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          width: '98vw',
          overflow: 'hidden',
          height: '98vh',
          border: 'none',
        }}
      >
        <SoftBox className="vendor-prod-modal">
          <SoftBox className="vendor-prod-modal-fix-heading">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '30px' }}>
              <SoftTypography variant="h6">
                {debounceItemsearch !== '' && filteredData?.length > 0 ? (
                  <>
                    Found results for: "<span style={{ fontWeight: 'bold' }}>{debounceItemsearch}</span>"
                  </>
                ) : (
                  `Enter items you wish to purchase `
                )}
                <b>{rowData?.length > 1 && ` (Total items added: ${totalRowsGRN})`} </b>
              </SoftTypography>
              {itemLoader && <Spinner size={20} />}
              {searchItemLoader && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <SoftTypography fontSize="13px">...Searching </SoftTypography>

                  <Spinner size={20} />
                </div>
              )}
              {removeSearchItemLoader && filteredData?.length > 0 && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <SoftTypography fontSize="13px">...Removing </SoftTypography>

                  <Spinner size={20} />
                </div>
              )}
              <div
                style={{
                  width: '40%',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  justifyContent: 'flex-end',
                }}
              >
                {rowData?.length > 1 && (
                  <>
                    <SoftInput
                      id="searchInput"
                      className="filter-add-list-cont-bill-search"
                      placeholder="Search by barcode or title"
                      value={searchItem}
                      onChange={(e) => {
                        setSearchItem(e.target.value);
                        if (e.target.value === '' && filteredData?.length > 0) {
                          setRemoveSearchItemLoader(true);
                        } else {
                          setSearchItemLoader(true);
                        }
                      }}
                      icon={{
                        component: 'search',
                        direction: 'right',
                      }}
                      // style={{ marginRight: '10px', padding: '3px' }}
                    />
                    {searchItem?.length !== 0 && (
                      <SoftBox
                        sx={{
                          position: 'absolute',
                          top: '3px',
                          right: '120px',
                          color: 'gray',
                          cursor: 'pointer',
                          zIndex: 10,
                        }}
                      >
                        <CloseRoundedIcon onClick={handleleRemoveSearch} />
                      </SoftBox>
                    )}
                    <div>
                      <FilterGRNComponent
                        filter={filters}
                        values={filterValues}
                        onChange={handleFilterChange}
                        applyFilters={applyFilters}
                        handleRemoveFilter={handleRemoveFilter}
                      />
                    </div>
                  </>
                )}
                <IconButton edge="end" color="inherit" onClick={handleCloseProdModal} aria-label="close">
                  {/* <CancelIcon color="error" /> */}
                  <CloseFullscreenIcon color="info" />
                </IconButton>
              </div>
            </div>
          </SoftBox>
          {filteredData?.length > 0 ? (
            <GRNSearchAndFilterComponent
              tableRef={tableRef}
              rowData={rowData}
              counter={counter}
              handleInputChange={handleInputChange}
              handleAdditional={handleAdditional}
              handleDltItem={handleDltItem}
              filteredData={filteredData}
              gstArray={gstArray}
              openFullScreen={openFullScreen}
              vendorId={vendorId}
              invoiceRefNo={invoiceRefNo}
              invoiceValue={invoiceValue}
              invoiceDate={invoiceDate}
              assignedTo={assignedTo}
              setFocusedRowIndex={setFocusedRowIndex}
              handleNavigate={handleNavigate}
            />
          ) : (
            !itemLoader &&
            rowData?.length > 0 && (
              <SoftBox style={{ overflowX: 'scroll', overflowY: 'scroll' }}>
                <div
                  ref={tableRef}
                  style={{
                    overflowX: 'scroll',
                    overflowY: 'scroll',
                    minWidth: '1225px',
                    maxHeight: rowData.length > 10 ? '446px' : 'auto',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th className="express-grn-columns">S.No</th>
                        <th className="express-grn-barcode-column">Barcode</th>
                        <th className="express-grn-barcode-column">Title</th>
                        <th className="express-grn-columns">Qty</th>
                        <th className="express-grn-columns">Total PP</th>
                        <th className="express-grn-columns">Price/ unit</th>
                        <th className="express-grn-columns">MRP</th>
                        <th className="express-grn-columns">S Price</th>
                        <th className="express-grn-columns">P Margin</th>
                        <th className="express-grn-columns">GST</th>
                        <th className="express-grn-columns">Batch No</th>
                        <th className="express-grn-columns" style={{ width: '160px !important' }}>
                          Expiry Date
                        </th>
                        {epoNumber ? (
                          <th className="express-grn-columns">Action</th>
                        ) : (
                          !vendorId ||
                          !invoiceRefNo ||
                          !invoiceValue ||
                          !invoiceDate ||
                          (!(assignedTo?.length > 0) ? null : <th className="express-grn-columns">Action</th>)
                        )}
                      </tr>
                    </thead>
                    <tbody id="table-body">
                      {rowData?.map((row, index) => {
                        const isBarcodeSelected = productSelected[index];
                        const isTitleSelect = titleSelected[index];
                        const purchaseMargin =
                          row?.mrp !== undefined &&
                          row?.mrp !== '' &&
                          row?.mrp !== 0 &&
                          row?.purchasePrice !== 0 &&
                          row?.purchasePrice !== undefined &&
                          row?.purchasePrice !== '' &&
                          !isNaN(row?.mrp) &&
                          !isNaN(row?.purchasePrice) &&
                          isFinite(row?.mrp) &&
                          isFinite(row?.purchasePrice)
                            ? Math.abs((((row?.mrp - row?.purchasePrice) / row?.mrp) * 100).toFixed(1))
                            : 0;

                        const isProductSaved = row.id === '';
                        const newPurchseprice =
                          row?.purchasePrice >= 0 && row?.purchasePrice !== ''
                            ? Math.round(row?.purchasePrice * 1000) / 1000
                            : '';
                        const isGreater = newPurchseprice > row?.mrp;
                        if (
                          row?.purchasePrice !== 0 ||
                          row?.purchasePrice === '0.000' ||
                          row?.purchasePrice === '' ||
                          row?.purchasePrice === 'NaN'
                        ) {
                          counter++;
                        }
                        const newSellingPrice =
                          row?.sellingPrice !== 'NaN' && row?.sellingPrice !== undefined && row?.sellingPrice !== ''
                            ? row?.sellingPrice
                            : '';
                        const additionalRows = [];
                        if (row?.offers && row?.offers?.offerType !== 'OFFER ON MRP' && row?.offers?.offerDetailsList) {
                          row?.offers?.offerDetailsList?.forEach((offer, idx) => {
                            if (offer?.inwardedQuantity !== null && offer?.inwardedQuantity !== undefined) {
                              additionalRows.push(
                                <tr key={`${row?.itemId}-additional-${idx}`}>
                                  <td className="express-grn-rows">
                                    <Tooltip title={row?.offers?.offerType || 'FREE PRODUCTS'}>
                                      <SoftBox className="express-grn-offer-icon">
                                        <LocalOfferIcon color="success" />
                                      </SoftBox>
                                    </Tooltip>
                                  </td>
                                  <td className="express-grn-rows">
                                    <SoftBox className="express-grn-product-box">
                                      <TextField value={offer?.gtin} readOnly={true} style={{ width: '100%' }} />
                                    </SoftBox>
                                  </td>
                                  <td className="express-grn-rows">
                                    <SoftBox className="express-grn-product-box">
                                      <TextField value={offer?.itemName} readOnly={true} style={{ width: '100%' }} />
                                    </SoftBox>
                                  </td>
                                  <td className="express-grn-rows">
                                    <SoftInput
                                      value={offer?.inwardedQuantity}
                                      disabled
                                      className="product-aligning"
                                      type="number"
                                    />
                                  </td>
                                  <td className="express-grn-rows">
                                    <SoftInput value={0} disabled className="product-aligning" type="number" />
                                  </td>
                                  <td className="express-grn-rows">
                                    <SoftInput value={0} disabled className="product-aligning" type="number" />
                                  </td>
                                  <td className="express-grn-rows">
                                    <SoftInput value={0} disabled className="product-aligning" type="number" />
                                  </td>
                                  <td className="express-grn-rows">
                                    <SoftInput value={0} disabled className="product-aligning" type="number" />
                                  </td>
                                  <td className="express-grn-rows">
                                    <SoftInput value={0} disabled className="product-aligning" type="number" />
                                  </td>
                                  <td className="express-grn-rows">
                                    <SoftInput value={0} disabled />
                                  </td>
                                  <td className="express-grn-rows">
                                    <SoftInput value={0} disabled className="product-aligning" type="number" />
                                  </td>
                                  <td className="express-grn-rows" style={{ width: '160px !important' }}>
                                    <SoftBox className="express-grn-product-box">
                                      <TextField value={offer?.gtin} readOnly={true} style={{ width: '100%' }} />
                                    </SoftBox>
                                  </td>
                                  <td className="express-grn-rows"> </td>
                                  {/* Add other columns if needed */}
                                </tr>,
                              );
                            }
                          });
                        }

                        let completedRow = ['itemNo', 'batchNumber', 'expiryDate', 'id', 'itemName'].every(
                          (key) => row[key] !== '',
                        );
                        let notEditable =
                          vendorId === '' ||
                          invoiceRefNo === '' ||
                          invoiceValue === '' ||
                          invoiceDate === '' ||
                          assignedTo?.length < 1
                            ? true
                            : false;
                        return (
                          <>
                            <tr
                              key={row?.itemId}
                              // ref={(el) => (rowSelectRef.current[index] = el)} // Store the ref for each row
                              // tabIndex="-1"
                            >
                              <td className="express-grn-rows">
                                <span
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  <span
                                    style={{
                                      whiteSpace: 'nowrap',
                                      maxWidth: '200px',
                                      overflow: 'hidden',
                                      cursor: 'pointer',
                                      marginTop: '0.75rem',
                                    }}
                                  ></span>
                                  {row?.itemNo !== '' &&
                                  (row?.offerType ||
                                    row?.purchasePrice === 0 ||
                                    row?.purchasePrice === '0.000' ||
                                    row?.purchasePrice === '' ||
                                    row?.purchasePrice === 'NaN') ? (
                                    <Tooltip title={row?.offerType || 'FREE PRODUCTS'}>
                                      <SoftBox className="express-grn-offer-icon">
                                        <LocalOfferIcon color="success" />
                                      </SoftBox>
                                    </Tooltip>
                                  ) : isProductSaved ? (
                                    <Tooltip title="Product is not saved, please enter a valid product or enter all the required values">
                                      <SoftBox className="grn-body-row-boxes">
                                        <SoftInput
                                          id={`selectedRow-${index}`}
                                          value={counter}
                                          readOnly={true}
                                          type="number"
                                          className="product-not-added product-aligning"
                                          onFocus={() => setFocusedRowIndex(index)}
                                        />
                                      </SoftBox>
                                    </Tooltip>
                                  ) : completedRow ? (
                                    <Tooltip title={'Product data completed'}>
                                      <SoftBox className="grn-body-row-boxes">
                                        <SoftInput
                                          id={`selectedRow-${index}`}
                                          value={counter}
                                          readOnly={true}
                                          type="number"
                                          className="product-aligning"
                                          sx={{
                                            '&.MuiInputBase-root': {
                                              backgroundColor: 'green !important',
                                              color: '#fff !important',
                                            },
                                          }}
                                          onFocus={() => setFocusedRowIndex(index)}
                                        />
                                      </SoftBox>
                                    </Tooltip>
                                  ) : (
                                    <SoftBox className="grn-body-row-boxes">
                                      <SoftInput
                                        id={`selectedRow-${index}`}
                                        value={counter}
                                        readOnly={true}
                                        type="number"
                                        className="product-aligning"
                                        onFocus={() => setFocusedRowIndex(index)}
                                      />
                                    </SoftBox>
                                  )}
                                </span>
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="express-grn-product-box">
                                  {isBarcodeSelected === false && row?.itemNo !== '' ? (
                                    <TextField
                                      value={row?.itemNo}
                                      readOnly={true}
                                      style={{ width: '100%' }}
                                      onClick={() => {
                                        row.itemNo ? handleNavigate(row?.itemNo) : null;
                                      }}
                                    />
                                  ) : row?.id !== '' && row?.itemNo !== '' ? (
                                    <TextField
                                      value={row.itemNo}
                                      readOnly={true}
                                      style={{ width: '100%' }}
                                      onClick={() => {
                                        row.itemNo ? handleNavigate(row.itemNo) : null;
                                      }}
                                    />
                                  ) : (
                                    <Autocomplete
                                      disabled={notEditable}
                                      freeSolo
                                      options={autocompleteBarcodeOptions}
                                      getOptionLabel={(option) => option.gtin}
                                      onChange={(e, newValue) => {
                                        selectProduct(newValue, index);
                                      }}
                                      onInputChange={(e, newInputValue) => {
                                        handleChangeIO({ target: { value: newInputValue } }, index);
                                      }}
                                      style={{ width: '100%' }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          inputRef={firstRowRef}
                                          inputProps={{
                                            ...params.inputProps,
                                            onKeyDown: (e) => {
                                              if (e.key === 'Enter') {
                                                e.stopPropagation();
                                              }
                                            },
                                          }}
                                          type="number"
                                          style={{ width: '100%' }}
                                        />
                                      )}
                                    />
                                  )}
                                </SoftBox>
                              </td>

                              <td className="express-grn-rows">
                                <SoftBox className="express-grn-product-box">
                                  {isTitleSelect === true && row?.itemName !== '' ? (
                                    <TextField
                                      value={row?.itemName}
                                      readOnly={true}
                                      style={{ width: '100%' }}
                                      onFocus={() => setFocusedRowIndex(index)}
                                    />
                                  ) : row.id !== '' ? (
                                    <TextField
                                      value={row.itemName}
                                      readOnly={true}
                                      style={{ width: '100%' }}
                                      onFocus={() => setFocusedRowIndex(index)}
                                    />
                                  ) : isBarcodeSelected === true && row.itemName !== '' ? (
                                    <TextField value={row.itemName} readOnly={true} style={{ width: '100%' }} />
                                  ) : (
                                    <Autocomplete
                                      disabled={notEditable}
                                      freeSolo
                                      options={autocompleteTitleOptions}
                                      getOptionLabel={(option) => option.name}
                                      onChange={(e, newValue) => {
                                        selectProduct(newValue, index);
                                      }}
                                      onInputChange={(e, newInputValue) => {
                                        handleChangeIO({ target: { value: newInputValue } }, index);
                                      }}
                                      style={{ width: '100%' }}
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
                                          style={{ width: '100%' }}
                                        />
                                      )}
                                    />
                                  )}
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="grn-body-row-boxes-1">
                                  <SoftInput
                                    id={`quantityInput-${index}`}
                                    value={row.quantityOrdered}
                                    type="number"
                                    onChange={(e) => handleInputChange(index, 'quantityOrdered', e.target.value)}
                                    className="product-aligning"
                                    disabled={notEditable}
                                    onFocus={() => setFocusedRowIndex(index)}
                                    onKeyDown={preventArrowKeyChange}
                                  />
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="grn-body-row-boxes-1">
                                  <SoftInput
                                    value={row.totalPP}
                                    type="number"
                                    onChange={(e) => handleInputChange(index, 'totalPP', e.target.value)}
                                    className="product-aligning"
                                    disabled={notEditable}
                                    onFocus={() => setFocusedRowIndex(index)}
                                    onKeyDown={preventArrowKeyChange}
                                  />
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                {isGreater ? (
                                  <Tooltip title="Price/unit is greater than MRP">
                                    <SoftBox className="grn-body-row-boxes-1">
                                      <SoftInput
                                        type="number"
                                        value={newPurchseprice || 0}
                                        disabled
                                        className="product-not-added product-aligning"
                                        onFocus={() => setFocusedRowIndex(index)}
                                        onKeyDown={preventArrowKeyChange}
                                      />
                                    </SoftBox>
                                  </Tooltip>
                                ) : (
                                  <SoftBox className="grn-body-row-boxes-1">
                                    <SoftInput
                                      type="number"
                                      className="product-aligning"
                                      value={newPurchseprice || 0}
                                      disabled
                                      onFocus={() => setFocusedRowIndex(index)}
                                      onKeyDown={preventArrowKeyChange}
                                    />
                                  </SoftBox>
                                )}
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="grn-body-row-boxes-1">
                                  <SoftInput
                                    value={row.mrp}
                                    type="number"
                                    onChange={(e) => handleInputChange(index, 'mrp', e.target.value)}
                                    className="product-aligning"
                                    disabled={notEditable}
                                    onFocus={() => setFocusedRowIndex(index)}
                                    onKeyDown={preventArrowKeyChange}
                                  />
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="grn-body-row-boxes-1">
                                  {newSellingPrice < newPurchseprice && row?.masterSellingPrice === 'manual' ? (
                                    <Tooltip title="S Price is less than the Purchase Price">
                                      <SoftInput
                                        type="number"
                                        className="product-aligning product-not-added"
                                        disabled={row?.masterSellingPrice === 'manual' && !notEditable ? false : true}
                                        value={newSellingPrice}
                                        onKeyDown={(e) => {
                                          if (e.key === '-') {
                                            showSnackbar('Enter a valid  selling price', 'error');
                                            e.preventDefault();
                                          }
                                          preventArrowKeyChange(e);
                                        }}
                                        onChange={(e) => handleInputChange(index, 'sellingPrice', e.target.value)}
                                        onFocus={() => setFocusedRowIndex(index)}
                                      />
                                    </Tooltip>
                                  ) : (
                                    <SoftInput
                                      type="number"
                                      className="product-aligning"
                                      disabled={row?.masterSellingPrice === 'manual' && !notEditable ? false : true}
                                      value={newSellingPrice}
                                      onKeyDown={(e) => {
                                        if (e.key === '-') {
                                          showSnackbar('Enter a valid  selling price', 'error');
                                          e.preventDefault();
                                        }
                                        preventArrowKeyChange(e);
                                      }}
                                      onChange={(e) => handleInputChange(index, 'sellingPrice', e.target.value)}
                                      onFocus={() => setFocusedRowIndex(index)}
                                    />
                                  )}
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="grn-body-row-boxes-1">
                                  <SoftInput
                                    value={purchaseMargin}
                                    className="product-aligning"
                                    type="number"
                                    disabled
                                    onFocus={() => setFocusedRowIndex(index)}
                                    onKeyDown={preventArrowKeyChange}
                                  />
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="grn-body-row-boxes-1">
                                  <SoftSelect
                                    menuPortalTarget={document.body}
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                    value={gstArray.find((option) => option.value == row?.gst) || 0}
                                    onChange={(e) => handleInputChange(index, 'gst', e.value)}
                                    options={gstArray}
                                    isDisabled={notEditable}
                                    onFocus={() => setFocusedRowIndex(index)}
                                  />
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="grn-body-row-boxes-1">
                                  <SoftInput
                                    value={row?.batchNumber}
                                    type="text"
                                    onChange={(e) => handleBatchChange(e, index)}
                                    className="product-aligning"
                                    disabled={notEditable}
                                    onFocus={() => setFocusedRowIndex(index)}
                                  />
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows" style={{ width: '160px !important' }}>
                                <SoftBox className="express-grn-product-box">
                                  <SoftInput
                                    value={row?.expiryDate}
                                    type="date"
                                    onChange={(e) => handleInputChange(index, 'expiryDate', e.target.value)}
                                    className="product-aligning"
                                    disabled={notEditable}
                                    onFocus={() => setFocusedRowIndex(index)}
                                  />
                                </SoftBox>
                              </td>

                              {epoNumber ? (
                                <td className="express-grn-rows">
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <div key={index}>
                                      <AddIcon
                                        color="info"
                                        style={{ cursor: 'pointer', fontSize: '20px' }}
                                        onClick={() => handleAdditional(index)}
                                      />
                                    </div>

                                    <CancelIcon
                                      color="error"
                                      style={{ cursor: 'pointer', fontSize: '20px' }}
                                      onClick={() => handleDltItem(row, index)}
                                    />
                                  </div>
                                </td>
                              ) : (
                                !vendorId ||
                                !invoiceRefNo ||
                                !invoiceValue ||
                                !invoiceDate ||
                                (!(assignedTo?.length > 0) ? null : (
                                  <td className="express-grn-rows">
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <div key={index}>
                                        <AddIcon
                                          color="info"
                                          style={{ cursor: 'pointer', fontSize: '20px' }}
                                          onClick={() => handleAdditional(index)}
                                        />
                                      </div>

                                      <CancelIcon
                                        color="error"
                                        style={{ cursor: 'pointer', fontSize: '20px' }}
                                        onClick={() => handleDltItem(row, index)}
                                      />
                                    </div>
                                  </td>
                                ))
                              )}
                            </tr>
                            {(focusedBarcodeIndex === index || focusedTitleIndex === index) &&
                              (debounceProductName ? (
                                <tr className="loading-row">
                                  <td colSpan={11}>
                                    <div className="debounceProduct_loader_box">
                                      <div>
                                        Searching <span style={{ fontWeight: 'bold' }}> {debounceProductName}</span>
                                      </div>
                                      <Spinner size="20px" />
                                    </div>
                                  </td>
                                </tr>
                              ) : productNotFound?.index === index && productNotFound?.value ? (
                                <tr className="loading-row">
                                  <td colSpan={11}>
                                    <div className="debounceProduct_loader_box">
                                      <div>Product not found</div>
                                      <AddCircleOutlineOutlinedIcon
                                        fontSize="20px"
                                        color="info"
                                        onClick={() => handleProductNotFound(focusedBarcodeIndex || focusedTitleIndex)}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ) : null)}
                            {additionalRows}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </SoftBox>
            )
          )}
          <div style={{ position: 'fixed', bottom: '2%', width: '96%', height: '12%', backgroundColor: '#fff' }}>
            {!vendorId || !invoiceRefNo || !invoiceValue || !invoiceDate || !(assignedTo?.length > 0) ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <SoftTypography fontSize="small" style={{ color: 'red' }}>
                  {' '}
                  Enter all the mandatory fields{' '}
                </SoftTypography>
                <SoftBox
                  className="sales-billing-data"
                  sx={{ borderTop: '1px solid #dedede', borderBottom: '1px solid #dedede' }}
                >
                  <SoftTypography fontSize={'1rem'} textAlign="end" fontWeight="bold">
                    Total
                  </SoftTypography>
                  <SoftBox
                    style={{
                      padding: '5px',
                    }}
                  >
                    <SoftTypography fontSize={'1rem'} fontWeight="bold" style={totalStyle}>
                      {total !== null ? total : '0'}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <SoftTypography
                  className="add-more-text"
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  onClick={handleAddRow}
                  style={{ cursor: 'pointer' }}
                >
                  + Add More Items
                </SoftTypography>
                <SoftBox
                  className="sales-billing-data"
                  sx={{ borderTop: '1px solid #dedede', borderBottom: '1px solid #dedede' }}
                >
                  <SoftTypography fontSize={'1rem'} textAlign="end" fontWeight="bold">
                    Total
                  </SoftTypography>
                  <SoftBox
                    style={{
                      padding: '5px',
                    }}
                  >
                    <SoftTypography fontSize={'1rem'} fontWeight="bold" style={totalStyle}>
                      {total !== null ? total : '0'}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </div>
            )}
            <SoftBox display="flex" justifyContent="flex-end" alignItems="center" gap="20px" marginTop="5px">
              <SoftButton
                variant={buttonStyles.secondaryVariant}
                className="outlined-softbutton"
                onClick={handleCloseProdModal}
              >
                Cancel
              </SoftButton>
              <SoftButton
                variant={buttonStyles.primaryVariant}
                className="contained-softbutton vendor-add-btn"
                onClick={handleSave}
              >
                Save
              </SoftButton>
            </SoftBox>
          </div>
        </SoftBox>
      </Box>
    </Modal>
  );
};

export default GRNFullScreenProduct;
