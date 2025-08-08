import React, { useEffect } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import { TextField, Tooltip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SoftSelect from '../../../../../../components/SoftSelect';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import SoftTypography from '../../../../../../components/SoftTypography';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { preventArrowKeyChange } from '../../../../Common/CommonFunction';

const GRNSearchAndFilterComponent = ({
  tableRef,
  rowData,
  filteredData,
  counter,
  handleInputChange,
  handleAdditional,
  handleDltItem,
  gstArray,
  debounceItemsearch,
  openFullScreen,
  vendorId,
  invoiceRefNo,
  invoiceValue,
  invoiceDate,
  assignedTo,
  setFocusedRowIndex,
  handleNavigate,
}) => {
  const showSnackbar = useSnackbar();
  const handleIOChange = (itemId, fieldName, value) => {
    let matchedIndex = rowData?.findIndex((ele) => ele?.id === itemId);
    // If no match is found, use the last index of rowData
    if (matchedIndex === -1 && rowData?.length > 0) {
      if (itemId === '') {
        matchedIndex = rowData?.length - 1;
      } else {
        matchedIndex = rowData?.length - 1;
      }
    }

    // function to handle the action based on fieldName
    const handleAction = {
      addItem: () => handleAdditional(matchedIndex),
      dltItem: () => handleDltItem(matchedIndex),
      default: () => handleInputChange(matchedIndex, fieldName, value),
    };

    (handleAction[fieldName] || handleAction.default)();
  };

  const focusDefaultRow = (index) => {
    const selectedRow = document.getElementById(`selectedSearchRow-${index}`);
    if (selectedRow) {
      selectedRow.focus();
    }
  };

  useEffect(() => {
    let numberCombination = '';
    let debounceTimer;

    const handleKeyDown = (event) => {
      if (event.altKey) {
        if (event.key === 'Alt') {
          numberCombination = '';
          return;
        }
        if (event.key >= '0' && event.key <= '9') {
          numberCombination += event.key;
        }
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (numberCombination) {
            const index = parseInt(numberCombination);
            if (index >= 0 && filteredData.some((ele) => ele.itemIndex === index)) {
              focusDefaultRow(index);
            } else {
              showSnackbar(`No filtered product found for S.No:- ${numberCombination}`, 'error');
            }
            numberCombination = '';
          }
        }, 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [rowData]);

  return (
    <SoftBox style={{ height: filteredData?.length > 10 ? '500px' : 'auto', overflowX: 'scroll', overflowY: 'hidden' }}>
      <div
        ref={tableRef}
        style={{
          overflowX: 'scroll',
          overflowY: 'scroll',
          minWidth: '1047px',
          maxHeight: filteredData?.length > 10 ? '500px' : 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          {openFullScreen ? (
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
                <th className="express-grn-columns">Expiry Date</th>
                {!vendorId ||
                  !invoiceRefNo ||
                  !invoiceValue ||
                  !invoiceDate ||
                  (!(assignedTo?.length > 0) ? null : <th className="express-grn-columns">Action</th>)}
              </tr>
            </thead>
          ) : (
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
                <th className="express-grn-columns grn-background-color"></th>
                <th className="express-grn-columns grn-background-color"></th>
                <th className="express-grn-columns grn-background-color"></th>
              </tr>
            </thead>
          )}
          <tbody id="table-body">
            {filteredData?.map((row, index) => {
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
              let additionalRows = [];
              if (row?.offers && row?.offers?.offerType !== 'OFFER ON MRP' && row?.offers?.offerDetailsList) {
                row?.offers?.offerDetailsList?.forEach((offer, idx) => {
                  if (offer?.inwardedQuantity !== null && offer?.inwardedQuantity !== undefined) {
                    additionalRows.push(
                      <tr key={`${row.itemId}-additional-${idx}`}>
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
                        {openFullScreen && (
                          <>
                            <td className="express-grn-rows">
                              <SoftInput value={0} disabled className="product-aligning" type="number" />
                            </td>
                            <td className="express-grn-rows">
                              <SoftInput value={0} disabled className="product-aligning" type="number" />
                            </td>
                          </>
                        )}
                        <td className="express-grn-rows"> </td>
                        {/* Add other columns if needed */}
                      </tr>,
                    );
                  }
                });
              }
              {
                /* const isNumber = !isNaN(+debounceItemsearch);
                  const isHighlighted = isNumber
                    ? row.itemNo.startsWith(debounceItemsearch)
                    : row.itemName.toLowerCase().includes(debounceItemsearch.toLowerCase()); */
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
                  <tr key={row?.itemId}>
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
                          <Tooltip title={row.offerType || 'FREE PRODUCTS'}>
                            <SoftBox className="express-grn-offer-icon">
                              <LocalOfferIcon color="success" />
                            </SoftBox>
                          </Tooltip>
                        ) : isProductSaved ? (
                          <Tooltip title="Product is not saved, please enter a valid product or enter all the required values">
                            <SoftBox className="grn-body-row-boxes">
                              <SoftInput
                                id={`selectedRow-${index}`}
                                value={row?.itemIndex}
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
                                value={row?.itemIndex}
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
                              id={`selectedSearchRow-${row?.itemIndex}`}
                              value={row?.itemIndex}
                              readOnly={true}
                              type="number"
                              className="product-aligning"
                            />
                          </SoftBox>
                        )}
                      </span>
                    </td>
                    <td className="express-grn-rows">
                      <SoftBox className="express-grn-product-box">
                        <TextField
                          value={row.itemNo}
                          readOnly={true}
                          style={{ width: '100%' }}
                          onClick={() => {
                            row.itemNo ? handleNavigate(row.itemNo) : null;
                          }}
                        />
                      </SoftBox>
                    </td>
                    <td className="express-grn-rows">
                      <SoftBox className="express-grn-product-box">
                        <TextField
                          value={row.itemName}
                          readOnly={true}
                          style={{ width: '100%' }}
                          onFocus={() => setFocusedRowIndex(index)}
                        />
                      </SoftBox>
                    </td>
                    <td className="express-grn-rows">
                      <SoftBox className="grn-body-row-boxes-1">
                        <SoftInput
                          value={row.quantityOrdered}
                          type="number"
                          onChange={(e) => handleIOChange(row?.id, 'quantityOrdered', e.target.value)}
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
                          onChange={(e) => handleIOChange(row?.id, 'totalPP', e.target.value)}
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
                          onChange={(e) => handleIOChange(row?.id, 'mrp', e.target.value)}
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
                              onChange={(e) => handleIOChange(row?.id, 'sellingPrice', e.target.value)}
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
                            onChange={(e) => handleIOChange(row?.id, 'sellingPrice', e.target.value)}
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
                          onChange={(e) => handleIOChange(row?.id, 'gst', e.value)}
                          options={gstArray}
                          isDisabled={notEditable}
                          onFocus={() => setFocusedRowIndex(index)}
                        />
                      </SoftBox>
                    </td>
                    {openFullScreen && (
                      <>
                        <td className="express-grn-rows">
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput
                              value={row?.batchNumber}
                              type="text"
                              onChange={(e) => handleInputChange(index, 'batchNumber', e.target.value)}
                              disabled={notEditable}
                              onFocus={() => setFocusedRowIndex(index)}
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput
                              value={row?.expiryDate}
                              type="date"
                              onChange={(e) => handleInputChange(index, 'expiryDate', e.target.value)}
                              disabled={notEditable}
                              onFocus={() => setFocusedRowIndex(index)}
                            />
                          </SoftBox>
                        </td>
                      </>
                    )}
                    {!vendorId ||
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
                            <div
                              key={index}
                              onKeyDown={(e) => {
                                if (e.key === 'q') {
                                  handleIOChange(row?.id, 'addItem');
                                }
                              }}
                            >
                              <AddIcon
                                color="info"
                                style={{ cursor: 'pointer', fontSize: '20px' }}
                                onClick={() => handleIOChange(row?.id, 'addItem')}
                              />
                            </div>
                            <CancelIcon
                              color="error"
                              style={{ cursor: 'pointer', fontSize: '20px' }}
                              onClick={() => handleIOChange(row?.id, 'dltItem')}
                            />
                          </div>
                        </td>
                      ))}
                  </tr>
                  {additionalRows}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </SoftBox>
  );
};

export default GRNSearchAndFilterComponent;
