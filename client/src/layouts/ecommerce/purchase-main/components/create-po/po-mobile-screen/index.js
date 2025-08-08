import { Divider, Typography } from '@mui/material';
import './po-mobile-screen.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { format } from 'date-fns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useEffect, useMemo, useRef, useState } from 'react';
import MobileSearchBar from '../../../../Common/mobile-new-ui-components/mobile-searchbar';
import BillingListMobile from '../../../../Common/mobile-new-ui-components/MobileBilling';
import POMobileAddressSection from './components/addressSection';
import MobPOAddressDrawer from './components/addressSelectionDrawer';
import MobPoProductCard from './components/product.mobile.card/po.mob.card';
import Spinner from '../../../../../../components/Spinner';
import NofityVendorPurchaseOrder from '../notify-vendor';
import CustomMobileButton from '../../../../Common/mobile-new-ui-components/button';
import { RequiredAsterisk } from '../../../../Common/CommonFunction';

const PurchaseOrderMobileCreation = ({
  piNumber,
  poNumber,
  toggle,
  handleorgAdd,
  expectedDeliveryDate,
  setExpectedDeliveryDate,
  vendorName,
  vendoraddress,
  billaddress,
  deliveryAddress,
  rowData,
  setRowData,
  isSelectAllChecked,
  isSelectAllDisabled,
  handleSelectAll,
  setValuechange,
  allData,
  handleProductNavigation,
  handleInputValueChange,
  handleDelete,
  handleCancel,
  hadleCreatNewPO,
  handleSaveExistPO,
  saveLoader,
  taxableValue,
  overAllCgstValue,
  overAllSgstValue,
  overAllCessValue,
  setDeliveryCharge,
  setLabourCharge,
  handleVendorCredit,
  isCreditApplied,
  vendorCreditNoteUsed,
  vendorCreditNote,
  totalValue,
  deliveryCharge,
  labourCharge,
  setIsCredit,
  searchedListVendor,
  searchVendorName,
  setSearchVendorName,
  handleVendor,
  openVendorModal,
  setOpenVendorModal,
  vendorListaddress,
  handleChangeVendorAdd,
  openBillModal,
  setOpenBillModal,
  allListAddress,
  handleChageBillAddress,
  openShipModal,
  setOpenShipModal,
  handleChageShipAddress,
  handleCustomerSearch,
  searchedListCust,
  searchCustName,
  handlecustomerDetails,
  vendorId,
  vendorid,
  loader,
  handleAskVendorNotifyMobile,
  showVendorNotify,
  setShowVendorNotify,
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1); // Track focused vendor in the list
  const searchInputRef = useRef(null);

  function joinObjectIncludeValues(obj, includeKeys) {
    return includeKeys
      .map((key) => obj[key]) // Map over `includeKeys` and extract values from `obj`
      .filter((value) => value !== undefined) // Filter out any undefined values
      .join(', '); // Join them with a comma and space
  }

  const billingList = useMemo(
    () => [
      {
        label: 'Taxable value',
        value: `₹ ${taxableValue || 0}`,
        isInput: false,
      },
      {
        label: 'Available credit',
        isCheckbox: true,
        checked: isCreditApplied,
        value: isCreditApplied ? vendorCreditNoteUsed : vendorCreditNote || 0,
        isDisabled: Number(vendorCreditNote <= 0) ? true : false,
        onChange: (e) => handleVendorCredit(e.target.value),
      },
      {
        label: 'CGST',
        value: `₹ ${overAllCgstValue || 0}`,
      },
      {
        label: 'SGST',
        value: `₹ ${overAllSgstValue || 0}`,
      },
      {
        label: 'Cess',
        value: `₹ ${overAllCessValue || 0}`,
      },
      {
        label: 'Delivery charges ',
        value: deliveryCharge,
        isInput: true,
        onChange: (e) => {
          setDeliveryCharge(e.target.value);
          setValuechange(e.target.value === '' ? 0 : e.target.value);
        },
      },
      {
        label: 'Labour charges',
        value: labourCharge,
        isInput: true,
        onChange: (e) => {
          setLabourCharge(e.target.value);
          setValuechange(e.target.value === '' ? 0 : e.target.value);
        },
      },
      {
        label: 'Total',
        value: `₹ ${totalValue || 0}`,
      },
    ],
    [
      taxableValue,
      isCreditApplied,
      vendorCreditNoteUsed,
      vendorCreditNote,
      overAllCgstValue,
      overAllSgstValue,
      overAllCessValue,
      deliveryCharge,
      labourCharge,
      totalValue,
    ],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Handle ArrowDown key
      if (event.key === 'ArrowDown' && searchedListVendor?.length > 0) {
        event.preventDefault();
        setFocusedIndex((prevIndex) => (prevIndex < searchedListVendor.length - 1 ? prevIndex + 1 : prevIndex));
      }

      // Handle ArrowUp key
      if (event.key === 'ArrowUp' && searchedListVendor?.length > 0) {
        event.preventDefault();
        setFocusedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
      }

      // Handle Enter key
      if (event.key === 'Enter' && focusedIndex >= 0) {
        event.preventDefault();
        handleVendor(searchedListVendor[focusedIndex]);
      }
    };

    // Attach the event listener to the search input
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedIndex, searchedListVendor]);

  // Scroll the focused element into view when focusedIndex changes
  useEffect(() => {
    if (focusedIndex >= 0) {
      document.getElementById(`vendor-${focusedIndex}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [focusedIndex]);

  return (
    <>
      {showVendorNotify ? (
        <NofityVendorPurchaseOrder handleAskVendorNotifyMobile={handleAskVendorNotifyMobile} saveLoader={saveLoader} />
      ) : (
        <div className="po-mobile-main-screen">
          <div className="po-id-text-main">
            <span className="po-id-text">{piNumber ?? poNumber}</span>
          </div>
          {loader && <Spinner size={20} />}
          {!vendorid && (
            <div style={{ color: 'red', marginLeft: '5px', fontSize: '12px' }}>Enter all the required fields</div>
          )}

          {!vendorId && piNumber && (
            <div className="mob-vendor-address">
              <p className="mob-address-heading">
                Search for vendors
                <RequiredAsterisk />
              </p>
              <div>
                {/* SEARCHING FOR VENDORS */}
                <MobileSearchBar
                  ref={searchInputRef}
                  placeholder={`Search vendor`}
                  variant={'bg-white'}
                  onChangeFunction={(e) => {
                    setSearchVendorName(e.target.value);
                    setFocusedIndex(-1); // Reset focus when the search input changes
                  }}
                  value={searchVendorName}
                />
              </div>
              {/* SEARCHED VENDOR LIST */}
              {searchedListVendor?.length > 0 && searchVendorName && (
                <div className="mob-address-box mob-searching-box-list">
                  {searchedListVendor?.map((vendor, index) => {
                    return (
                      <div
                        key={vendor?.value || index}
                        id={`vendor-${index}`}
                        className={`mob-po-vendor-name ${focusedIndex === index ? 'focused' : ''}`} // Add 'focused' class if this is the focused vendor
                        tabIndex="0" // Make the div focusable
                        onClick={() => handleVendor(vendor)}
                      >
                        {vendor?.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {vendorid && (
            <>
              <div className="mob-vendor-address">
                <p className="mob-address-heading">Vendor details</p>
                {/* VENDOR ADDRESS SECTION */}
                <POMobileAddressSection
                  heading="Vendor Details"
                  addressName={vendorName}
                  address={vendoraddress}
                  handleEdit={() => setOpenVendorModal(true)}
                  includeFields={['addressLine1', 'addressLine2', 'city', 'state', 'country', 'pincode']}
                  joinObjectFunction={joinObjectIncludeValues}
                />
              </div>

              {/* SELECTION ORGANISATION / CUSTOMER */}
              <div style={{ padding: '10px' }}>
                <p className="po-mob-text">Fulfilling the product for?</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="po-org-selecting-mob">
                    <span className="po-org-selecting-name">Organization</span>
                    <input
                      type="radio"
                      className="po-org-input-radio"
                      name="billing-address"
                      value="org"
                      onChange={() => handleorgAdd('org')}
                      checked={toggle === 'org'}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div className="po-org-selecting-mob">
                    <span className="po-org-selecting-name">Other</span>
                    <input
                      type="radio"
                      className="po-org-input-radio"
                      value="cus"
                      onChange={() => handleorgAdd('cus')}
                      checked={toggle === 'cus'}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              {/* SEARCHING FOR CUSTOMERS */}
              {toggle === 'cus' && (
                <div className="mob-vendor-address">
                  <p className="mob-address-heading">Search for customers</p>
                  <div>
                    <MobileSearchBar
                      placeholder={`Search customers`}
                      variant={'bg-white'}
                      onChangeFunction={(e) => handleCustomerSearch(e.target.value)}
                      value={searchCustName}
                    />
                  </div>
                  {searchedListCust?.length > 0 && searchCustName && (
                    <div className="mob-address-box mob-searching-box-list">
                      {searchedListCust?.map((cust) => {
                        return (
                          <div className="mob-po-vendor-name" onClick={() => handlecustomerDetails(cust.value)}>
                            {cust?.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* BILLING ADDRESS SECTION */}
              <div className="mob-vendor-address">
                <p className="mob-address-heading">Delivery details</p>
                <POMobileAddressSection
                  heading="Billing Address"
                  address={billaddress}
                  handleEdit={() => setOpenBillModal(true)}
                  includeFields={['name', 'addressLine1', 'addressLine2', 'city', 'state', 'country', 'pincode']}
                  joinObjectFunction={joinObjectIncludeValues}
                />

                {/* DELIVERY ADDRESS SECTION */}
                <POMobileAddressSection
                  heading="Delivery Address"
                  address={deliveryAddress}
                  handleEdit={() => setOpenShipModal(true)}
                  includeFields={['name', 'addressLine1', 'addressLine2', 'city', 'state', 'country', 'pincode']}
                  joinObjectFunction={joinObjectIncludeValues}
                />
              </div>
            </>
          )}
          <div className="mob-vendor-address">
            <p className="mob-address-heading">Expected delivery date</p>
            <div className="mob-address-box">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  {...(expectedDeliveryDate && {
                    value: expectedDeliveryDate ? dayjs(expectedDeliveryDate) : '',
                  })}
                  disablePast
                  views={['year', 'month', 'day']}
                  format="DD-MM-YYYY"
                  onChange={(date) => setExpectedDeliveryDate(format(date.$d, 'yyyy-MM-dd'))}
                  sx={{
                    width: '100% !important',
                  }}
                  className="po-mob-datepicker"
                  disabled={vendorid ? false : true}
                />
              </LocalizationProvider>
            </div>
          </div>

          {/* HEADING AND SELECT ALL BTN */}
          <div className="mob-vendor-address">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p className="mob-address-heading">Products selected</p>
              {piNumber &&
                (isSelectAllChecked ? (
                  <button
                    className="mob-product-all-select"
                    disabled={isSelectAllDisabled || !vendorid}
                    onClick={() => handleSelectAll(false)}
                  >
                    Remove All
                  </button>
                ) : (
                  <button
                    className="mob-product-all-select"
                    disabled={isSelectAllDisabled || !vendorid}
                    onClick={() => handleSelectAll(true)}
                  >
                    Select All
                  </button>
                ))}
            </div>
            {/* PRODUCTS LIST  */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              {rowData?.map((row, index) => (
                <MobPoProductCard
                  key={index}
                  rowData={rowData}
                  index={index}
                  onInputValueChange={handleInputValueChange}
                  onDelete={handleDelete}
                  handleProductNavigation={handleProductNavigation}
                  setRowData={setRowData}
                  piNumber={piNumber}
                  vendorid={vendorid}
                  allData={allData}
                  setValuechange={setValuechange}
                />
              ))}

              {rowData?.length === 0 && (
                <div className="no-data-purchase" style={{ width: '100%' }}>
                  <span>No Data found</span>
                </div>
              )}
            </div>
          </div>

          {/* BILLING SECTION */}
          <div className="mob-vendor-address">
            <BillingListMobile billingList={billingList} setIsCredit={setIsCredit} />
          </div>

          {/* BUTTON SECTION */}
          <div className="action-button-mobile" style={{ marginTop: '10px' }}>
            <CustomMobileButton
              padding="0.75rem"
              variant={'black-D'}
              title={piNumber ? 'Create PO' : 'Save PO'}
              justifyContent={'center'}
              onClickFunction={piNumber ? hadleCreatNewPO : handleSaveExistPO}
              loading={saveLoader}
              disable={saveLoader}
            />
            <CustomMobileButton
              padding="0.75rem"
              variant={'black-S'}
              title={'Cancel'}
              justifyContent={'center'}
              onClickFunction={handleCancel}
              disable={saveLoader}
            />
          </div>

          {/* <div className="mob-vendor-address" style={{ backgroundColor: '#fff' }}>
                <button
                  className="mob-po-create-btn"
                  onClick={piNumber ? hadleCreatNewPO : handleSaveExistPO}
                  disabled={saveLoader ? true : false}
                >
                  {piNumber ? <> Create PO </> : <> Save PO</>}
                </button>
                <button className="mob-po-cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div> */}

          {/* ADDRESS DRAWER SECTION */}

          {/* Vendor address */}
          <MobPOAddressDrawer
            drawerOpen={openVendorModal}
            drawerClose={() => setOpenVendorModal(false)}
            title="Select Vendor Address"
            addressList={vendorListaddress}
            selectedAddress={vendoraddress}
            handleChangeAddress={handleChangeVendorAdd}
            addressKey="addressId"
          />

          {/* Billing address */}
          <MobPOAddressDrawer
            drawerOpen={openBillModal}
            drawerClose={() => setOpenBillModal(false)}
            title="Select Billing Address"
            addressList={allListAddress}
            selectedAddress={billaddress}
            handleChangeAddress={handleChageBillAddress}
            addressKey="id"
          />
          {/* Delivery address */}
          <MobPOAddressDrawer
            drawerOpen={openShipModal}
            drawerClose={() => setOpenShipModal(false)}
            title="Select Billing Address"
            addressList={allListAddress}
            selectedAddress={deliveryAddress}
            handleChangeAddress={handleChageShipAddress}
            addressKey="id"
          />
        </div>
      )}
    </>
  );
};

export default PurchaseOrderMobileCreation;
