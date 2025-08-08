import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import {
  addSupplementaryProducts,
  removeSupplementaryProducts,
  updateSupplementaryProducts,
} from '../../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../../components/SoftTypography';

const filter = createFilterOptions();

const SalesAdditionalCharges = ({
  additionalList,
  setAdditionalList,
  cartId,
  billingItems,
  setBillingItems,
  setBillingData,
  updateBillingData,
}) => {
  const showSnackbar = useSnackbar();
  const locId = localStorage.getItem('locId');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const [createChargeLoader, setCreateChargeLoader] = useState(false);
  const [suppProduct, setSuppProduct] = useState({
    value: '',
    item: {},
    index: '',
  });
  const debounceProduct = useDebounce(suppProduct, 700);

  const desciptionOption = [
    { value: 'Delivery Charges', label: 'Delivery Charges' },
    { value: 'Labour charges', label: 'Labour charges' },
    { value: 'Transport charges', label: 'Transport charges' },
  ];

  const filteredOptions = desciptionOption?.filter((option) => {
    return !additionalList?.some((item) => item?.description === option?.value);
  });

  useEffect(() => {
    if (debounceProduct.value !== '') {
      if (debounceProduct?.item?.chargeId) {
        updateSupplementProd(debounceProduct?.item);
      } else {
        createSupplementProd(debounceProduct?.item, debounceProduct?.index);
      }
      setSuppProduct({
        value: '',
        item: {},
        index: '',
      });
    }
  }, [debounceProduct]);

  const createSupplementProd = (item, index) => {
    const product = additionalList?.find((ele) => ele?.description?.toLowerCase() === item?.description?.toLowerCase());
    if (product && product?.chargeId) {
      setCreateChargeLoader(false);
      return;
    }
    const payload = {
      cartId: cartId,
      productName: item?.description,
      locationId: locId,
      tax: Number(item?.tax) || 0,
      taxType: '%',
      price: Number(item?.unitPrice) || 0,
      quantity: Number(item?.quantity) || 1,
      createdBy: uidx,
      modifiedBy: uidx,
      comments: '',
    };
    addSupplementaryProducts(payload)
      .then((res) => {
        if (res?.data?.status === 'SUCCESS' && res?.data?.data?.es === 0) {
          const response = res?.data?.data?.data;
          setBillingData(response?.billing);
          const updatedData = additionalList?.map((row, index) => {
            if (index < response?.supplementaryProducts?.length) {
              if (row.chargeId === null) {
                return {
                  ...row,
                  chargeId: response?.supplementaryProducts[index]?.supplementaryProductId,
                  amount: response?.supplementaryProducts[index]?.subTotal,
                };
              } else {
                return {
                  ...row,
                  amount: response?.supplementaryProducts[index]?.subTotal,
                };
              }
            }
            return row;
          });
          setAdditionalList(updatedData);

          updateBillingData(updatedData);
        }
        setCreateChargeLoader(false);
      })
      .catch((err) => {
        setCreateChargeLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });

    focusPriceInput(index);
  };

  const updateSupplementProd = (item) => {
    const payload = {
      cartId: cartId,
      supplementaryProductId: item?.chargeId,
      productName: item?.description,
      locationId: locId,
      tax: Number(item?.tax) || 0,
      taxType: '%',
      price: Number(item?.unitPrice) || 0,
      quantity: Number(item?.quantity) || 1,
      createdBy: uidx,
      modifiedBy: uidx,
      comments: '',
    };
    updateSupplementaryProducts(payload)
      .then((res) => {
        if (res?.data?.status === 'SUCCESS' && res?.data?.data?.es === 0) {
          const response = res?.data?.data?.data;
          setBillingData(response?.billing);
          const updatedData = additionalList?.map((row, index) => {
            if (index < response?.supplementaryProducts?.length) {
              if (row.chargeId === null) {
                return {
                  ...row,
                  chargeId: response?.supplementaryProducts[index]?.supplementaryProductId,
                  amount: response?.supplementaryProducts[index]?.subTotal,
                };
              } else {
                return {
                  ...row,
                  amount: response?.supplementaryProducts[index]?.subTotal,
                };
              }
            }
            return row;
          });
          setAdditionalList(updatedData);
          updateBillingData(updatedData);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const removeSupplementProd = (id) => {
    removeSupplementaryProducts(cartId, id)
      .then((res) => {
        if (res?.data?.status === 'SUCCESS' && res?.data?.data?.es === 0) {
          const response = res?.data?.data?.data;
          setBillingData(response?.billing);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleAdditionalChargeList = () => {
    const newRowData = [
      ...additionalList,
      {
        chargeId: null,
        cartId: cartId,
        description: '',
        unitPrice: 0,
        quantity: 1,
        tax: 0,
        taxType: '%',
        amount: 0,
      },
    ];
    setAdditionalList(newRowData);
  };

  const handleAddtionalDlt = (index, id) => {
    const itemToDelete = additionalList[index];

    const updateDetails = [...additionalList];
    updateDetails.splice(index, 1);
    setAdditionalList(updateDetails);

    const updatedBillingItems = billingItems.filter((item) => item?.label !== itemToDelete?.description);

    setBillingItems(updatedBillingItems);
    if (id) {
      removeSupplementProd(id);
      updateBillingData(updateDetails);
    }
  };

  const handleAdditonalInput = (index, fieldName, value) => {
    if (value === null && value === '') {
      return;
    }
    if (additionalList?.find((ele) => ele?.description?.toLowerCase() === value?.toLowerCase())) {
      showSnackbar('Description already added', 'error');
      return;
    }
    const updateDetails = [...additionalList];
    updateDetails[index][fieldName] = value;
    setAdditionalList(updateDetails);
    setCreateChargeLoader(true);
    setSuppProduct({ value: value, item: updateDetails[index], index: index });
  };

  const handleInputFiled = (item, index, fieldName, value) => {
    const updateDetails = [...additionalList];
    const listIndex = additionalList?.findIndex((ele) => ele?.description === item?.description);

    if (listIndex !== -1) {
      updateDetails[listIndex][fieldName] = value;
    } else {
      updateDetails[index][fieldName] = value;
    }

    setAdditionalList(updateDetails);

    const billingItemsMap = new Map(billingItems?.map((item) => [item?.label, item]));

    updateDetails.forEach((item) => {
      if (item?.description) {
        billingItemsMap.set(item.description, {
          label: item?.description,
          value: item?.amount,
        });
      }
    });
    setSuppProduct({ value: value, item: updateDetails[index], index: index });
  };

  const focusPriceInput = (index) => {
    const unitPrice = document.getElementById(`unitPrice-${index}`);
    if (unitPrice) {
      unitPrice.focus();
    }
  };

  return (
    <SoftBox mt={1}>
      <SoftBox display="flex" gap="30px" justifyContent="space-between">
        <SoftTypography variant="h6">Select additonal details</SoftTypography>
      </SoftBox>
      <table>
        <thead>
          <tr>
            <th className="additional-details-header">S.No</th>
            <th className="additional-details-header">Description</th>
            <th className="additional-details-header">Unit Price</th>
            <th className="additional-details-header">Quantity</th>
            <th className="additional-details-header">Tax (in ₹)</th>
            <th className="additional-details-header">Amount</th>
            <th className="additional-details-header">Action</th>
          </tr>
        </thead>
        <tbody>
          {additionalList?.map((item, index) => {
            return (
              <tr>
                <td className="express-grn-rows">
                  <SoftBox>
                    <SoftInput value={index + 1} type="number" className="product-aligning" />
                  </SoftBox>
                </td>
                <td className="express-grn-rows">
                  <SoftBox>
                    <Autocomplete
                      value={item?.description}
                      onChange={(event, newValue) => {
                        if (newValue && newValue.inputValue) {
                          handleAdditonalInput(index, 'description', newValue.inputValue);
                        } else {
                          handleAdditonalInput(index, 'description', newValue);
                        }
                      }}
                      options={filteredOptions.map((option) => option.value)}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        const isExisting = options?.some((option) => inputValue === option.label);
                        if (inputValue !== '' && !isExisting) {
                          filtered.unshift({
                            inputValue,
                            label: `Add "${inputValue}"`,
                          });
                        }

                        return filtered;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Enter product description"
                          style={{ width: '100%' }}
                          fullWidth
                        />
                      )}
                      freeSolo
                    />
                  </SoftBox>
                </td>
                <td className="express-grn-rows">
                  <SoftBox>
                    <SoftInput
                      value={item?.unitPrice}
                      id={`unitPrice-${index}`}
                      type="number"
                      className="product-aligning"
                      disabled={createChargeLoader ? true : false}
                      onChange={(e) => handleInputFiled(item, index, 'unitPrice', e.target.value)}
                    />
                  </SoftBox>
                </td>
                <td className="express-grn-rows">
                  <SoftBox>
                    <SoftInput
                      value={item?.quantity}
                      type="number"
                      className="product-aligning"
                      disabled={createChargeLoader ? true : false}
                      onChange={(e) => handleInputFiled(item, index, 'quantity', e.target.value)}
                    />
                  </SoftBox>
                </td>
                <td className="express-grn-rows">
                  <SoftBox>
                    <SoftInput
                      value={item?.tax}
                      type="number"
                      className="product-aligning"
                      disabled={createChargeLoader ? true : false}
                      onChange={(e) => handleInputFiled(item, index, 'tax', e.target.value)}
                    />
                  </SoftBox>
                </td>
                <td className="express-grn-rows">
                  <SoftBox>
                    <SoftInput
                      value={item?.amount}
                      type="number"
                      className="product-aligning"
                      disabled
                      // onChange={(e) => handleInputFiled(item, index, 'amount', e.target.value)}
                    />
                  </SoftBox>
                </td>
                <td className="express-grn-rows">
                  <SoftBox>
                    <DeleteIcon
                      // color="error"
                      disabled={createChargeLoader ? true : false}
                      style={{ cursor: 'pointer', fontSize: '20px' }}
                      onClick={() => handleAddtionalDlt(index, item?.chargeId)}
                    />
                  </SoftBox>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* {filteredOptions?.length > 0 && ( */}
      <SoftTypography
        className="add-more-text"
        onClick={handleAdditionalChargeList}
        component="label"
        variant="caption"
        fontWeight="bold"
      >
        + Add More Details
      </SoftTypography>
      {/* )} */}
    </SoftBox>
  );
};

export default SalesAdditionalCharges;
