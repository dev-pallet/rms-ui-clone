import { Box, CircularProgress, Grid, IconButton, Modal, Typography } from '@mui/material';
import React, { useState, useEffect, useMemo, memo, useRef } from 'react';
import SoftTypography from '../../../../../../components/SoftTypography';
import { buttonStyles } from '../../../../Common/buttonColor';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { v4 as uuidv4 } from 'uuid';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import Spinner from '../../../../../../components/Spinner';
import Swal from 'sweetalert2';
import getCustomerList, {
  getAllPurchaseOrders,
  getAllVendors,
  getBranchAllAdresses,
  getCustomerDetails,
  getProductDetails,
  getPurchaseIndentDetails,
  getVendorDetails,
  getVendorVendorCredit,
  getvendorName,
  removeGRNInvoiceBill,
  spBasedONProductConfig,
  spMultipleProductConfig,
  vieworderspdf,
} from '../../../../../../config/Services';
import SoftAsyncPaginate from '../../../../../../components/SoftSelect/SoftAsyncPaginate';

const OtherGRNDetails = memo(
  ({
    setVendorDisplayName,
    setVendorId,
    setVendorGST,
    setVendorPAN,
    setVendorType,
    setVendorCredit,
    vendorCredit,
    vendorDisplayName,
    vendorId,
    vendorPAN,
    vendorGST,
    view,
    setView,
    purchaseNumber,
    setPurchaseNumber,
    invoiceRefNo,
    setInvoiceRefNo,
    invoiceDate,
    setInvoiceDate,
    invoiceValue,
    setInvoiceValue,
    paymentDue,
    setPaymentDue,
    paymentMode,
    setPaymenMode,
    inclusiveTax,
    handleGSTChange,
    assignedToLabel,
    isModalLoading,
    setIsModalLoading,
    uploadStatus,
    openDocumentAIModal,
    setUploadStatus,
    isUploading,
    setIsUploading,
    handleAssignTo,
    assignUserrow,
    allOrgUserList,
    vendoraddress,
    setVendoraddress,
    billaddress,
    setBilladdress,
    deliveryAddress,
    setDeliveryAddress,
    allListAddress,
    setAllListAddress,
    setItemLoader,
    setRowData,
    rowData,
    tableRef,
    setAssignedToLabel,
    assignedTo,
    setAssignedTo,
    productSelected,
    setProductSelected,
    titleSelected,
    setTitleSelected,
    purchaseSelected,
    setPurchaseSelected,
    customerId,
    setCustomerId,
    toggle,
    setToggle,
    vendorAddID,
    setVendorAddId,
    billAddID,
    setBillAddId,
    deliveryAddID,
    setDeliveryAddId,
    noAddressFound,
    setNoAddressFound,
    isFileSelected,
    setIsFileSelected,
    fileDocId,
    handleFileChange,
    handleDocumentAIChange,
    documentAIInputRef,
    uploadedFile,
    setUploadedFile,
    handleAddProduct,
    handleAddEXPOProduct,
    setAdditionalList,
    setDeliveryCharge,
    setLabourCharge,
    setIsExtraField,
  }) => {
    const showSnackbar = useSnackbar();
    const selectMainItemRef = useRef();
    const vendorSelectRef = useRef(null);
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const epoNumber = localStorage.getItem('epoNumber');
    const contextType = localStorage.getItem('contextType');
    const [dataRows, setTablevendorRows] = useState([]);
    const [gstRows, setGSTRows] = useState([]);
    const [mainItem, setMainItem] = useState('');
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [approverMenuOpen, setApproverMenu] = useState(false);
    const [secondMenuIsOpen, setSecondMenuIsOpen] = useState(false);
    const [subMainItem, setSubMainItem] = useState({ value: 'Select', label: 'Select' });
    const [purchaseDataAdded, setPurchaseDataAdded] = useState(false);
    const debouncePurchase = useDebounce(purchaseDataAdded, 700);
    const [validGST, setValidGSt] = useState('');
    const debounceValidGST = useDebounce(validGST, 700);
    const [fileLoader, setFileLoader] = useState(false);
    const [custGST, setCustGST] = useState('');
    const [custPAN, setCustPAN] = useState('');
    const [vendorListaddress, setVendorListaddress] = useState([]);
    const [verifyLoader, setVerifyLoader] = useState(false);
    const [openVendorModal, setOpenVendorModal] = useState(false);
    const [newVendorId, setNewVendorId] = useState('');
    const [newVendorName, setNewVendorDisplayName] = useState('');
    const [itemsFromPurchase, setItemsFromPurchase] = useState([]);
    const [isEditVendor, setIsEditVendor] = useState(false);
    const mainSelectOption = [
      { value: 'Name', label: 'Name' },
      { value: 'GST', label: 'GST' },
    ];
    const handleCloseVendorModal = () => {
      setOpenVendorModal(false);
      if (itemsFromPurchase?.length > 0) {
        handlePurchaseItems(itemsFromPurchase);
        setItemsFromPurchase([]);
      }
    };

    const handleFocusApprover = () => {
      allOrgUserList();
      setApproverMenu(true);
    };

    useEffect(() => {
      if (!epoNumber && !localStorage.getItem('poNumber')) {
        setMenuIsOpen(true);
        if (selectMainItemRef.current) {
          selectMainItemRef.current.focus();
        }
      }
      const handleKeyDown = (event) => {
        if (event.shiftKey && event.key === 'W') {
          event.preventDefault();
          setMenuIsOpen(true);
          if (selectMainItemRef.current) {
            selectMainItemRef.current.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [epoNumber]);

    const [openBillModal, setOpenBillModal] = useState(false);
    const [openShipModal, setOpenShipModal] = useState(false);

    useEffect(() => {
      if (mainItem && vendorSelectRef.current) {
        vendorSelectRef.current.focus();
        setTimeout(() => {
          setSecondMenuIsOpen(true);
        }, 100);
      }
    }, [mainItem]);

    const handlMainItem = (e) => {
      setMainItem(e.value);
      setSubMainItem(null);
      // allVendorList();
      setTablevendorRows([]); // Clear existing rows when switching
      setGSTRows([]); // Reset GST rows

      if (e.value === 'Name' && gstRows?.length > 0) {
        loadVendorNameOption('', [], { page: 1 }); // Force reload for Name
      } else if (e.value === 'GST' && dataRows?.length > 0) {
        loadVendorGSTOption('', [], { page: 1 }); // Force reload for GST
      }
    };

    useEffect(() => {
      if (vendorAddID) {
        vendorSelected(vendorId, vendorAddID);
      }
    }, [vendorAddID]);

    useEffect(() => {
      if (debouncePurchase) {
        if (epoNumber) {
          handleAddEXPOProduct();
        } else {
          handleAddProduct(rowData[0]?.sellingPrice);
        }
        setPurchaseDataAdded(false);
      }
    }, [debouncePurchase]);

    useEffect(() => {
      if (noAddressFound) {
        if (vendorId) {
          vendorSelected(vendorId);
        }
        orgAddressData();
        setNoAddressFound(false);
      }
    }, [noAddressFound]);

    useEffect(() => {
      if (deliveryAddID && billAddID && customerId && toggle === 'cus') {
        if (dataRowscustomer?.length === 0) {
          allCustomerList();
        }
        handlecustomerDetails(customerId, false, deliveryAddID, billAddID);
      } else if (deliveryAddID && billAddID) {
        orgAddressData(false, deliveryAddID, billAddID);
      }
    }, [deliveryAddID, billAddID]);

    useEffect(() => {
      if (debounceValidGST !== '') {
        const newSwal = Swal.mixin({
          customClass: {
            cancelButton: 'logout-cancel-btn',
            confirmButton: 'logout-success-btn',
            denyButton: 'logout-deny-btn',
          },
          buttonsStyling: false,
        });
        newSwal.fire({
          text: `No such GSTIN found for ${debounceValidGST}, kindly add this GSTIN to a vendor`,
          icon: 'error',
          showCancelButton: false,
          reverseButtons: true,
          confirmButtonText: 'OK',
          showDenyButton: false,

          allowOutsideClick: false,
        });
      }
      setValidGSt('');
    }, [debounceValidGST]);

    const handleorgAdd = (value) => {
      if (value === 'org') {
        orgAddressData();
        setCustomerId(null);
      } else {
        allCustomerList();
      }
      setToggle(value);
    };

    useEffect(() => {
      if (!epoNumber && localStorage.getItem('poNumber')) {
        handleVerify();
        setIsFileSelected(false);
      }
    }, []);

    let dataArrvendor,
      dataRow = [];
    let retryCount = 0;
    const allVendorList = () => {
      const filterObject = {
        page: 0,
        pageSize: 0,
        filterVendor: {
          searchText: '',
          startDate: '',
          endDate: '',
          locations: [],
          type: [],
          productName: [],
          productGTIN: [],
        },
      };
      getAllVendors(filterObject, orgId)
        .then(function (result) {
          if (result.data.data.code === 'ECONNRESET') {
            if (retryCount < 3) {
              allVendorList();
              retryCount++;
            } else {
              showSnackbar('Some Error Occured, Try after some time', 'error');
            }
          } else {
            dataArrvendor = result?.data?.data;
            dataRow.push(
              dataArrvendor?.vendors?.map((row) => ({
                value: row?.vendorId,
                label: row?.vendorName,
                gst: row?.gstNumber,
                selectBy: 'Name',
              })),
            );
            setTablevendorRows(dataRow[0]);
            const gstRow = dataArrvendor?.vendors
              ?.filter((row) => row?.gstNumber !== null && row?.gstNumber !== '')
              .map((row) => ({
                value: row?.vendorId,
                label: row?.gstNumber,
                name: row?.vendorName,
                selectBy: 'GST',
              }));

            setGSTRows(gstRow || []);
          }
        })
        .catch((err) => {
          if (err?.response?.status === '429') {
            allVendorList();
          } else {
            showSnackbar(err?.response?.data?.message, 'error');
          }
        });
    };

    const loadVendorNameOption = async (searchQuery, loadedOptions, { page }) => {
      const paylaod = {
        page: page,
        pageSize: 50,
        filterVendor: {
          searchText: searchQuery || '',
          startDate: '',
          endDate: '',
          locations: [],
          type: [],
          productName: [],
          productGTIN: [],
        },
      };

      try {
        const res = await getAllVendors(paylaod, orgId);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return {
            options: [],
            hasMore: false,
          };
        } else {
          dataArrvendor = res?.data?.data;
          const data = res?.data?.data?.vendors || [];
          dataRow.push(
            dataArrvendor?.vendors?.map((row) => ({
              value: row?.vendorId,
              label: row?.vendorName,
              gst: row?.gstNumber,
              selectBy: 'Name',
            })),
          );
          setTablevendorRows(dataRow[0] || []);
          return {
            options: dataRow[0],
            hasMore: data?.length >= 50, // If there are 50 items, assume more data is available
            additional: {
              page: page + 1, // Increment page number
            },
          };
        }
      } catch (error) {
        showSnackbar('Error while fetching data', 'error');
        return {
          options: [],
          hasMore: false,
        };
      }
    };

    const loadVendorGSTOption = async (searchQuery, loadedOptions, { page }) => {
      const paylaod = {
        page: page,
        pageSize: 50,
        filterVendor: {
          searchText: searchQuery || '',
          startDate: '',
          endDate: '',
          locations: [],
          type: [],
          productName: [],
          productGTIN: [],
        },
      };

      try {
        const res = await getAllVendors(paylaod, orgId);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return {
            options: [],
            hasMore: false,
          };
        } else {
          dataArrvendor = res?.data?.data;
          const data = res?.data?.data?.vendors || [];
          dataRow.push(
            dataArrvendor?.vendors?.map((row) => ({
              value: row?.vendorId,
              label: row?.vendorName,
              gst: row?.gstNumber,
              selectBy: 'Name',
            })),
          );
          const gstRow = data
            ?.filter((row) => row?.gstNumber !== null && row?.gstNumber !== '')
            .map((row) => ({
              value: row?.vendorId,
              label: row?.gstNumber,
              name: row?.vendorName,
              selectBy: 'GST',
            }));
          if (searchQuery && gstRow?.length === 0) {
            const newSwal = Swal.mixin({
              customClass: {
                cancelButton: 'logout-cancel-btn',
                confirmButton: 'logout-success-btn',
                denyButton: 'logout-deny-btn',
              },
              buttonsStyling: false,
            });
            newSwal.fire({
              text: `No such GSTIN found for ${searchQuery}, kindly add this GSTIN to a vendor`,
              icon: 'error',
              showCancelButton: false,
              reverseButtons: true,
              confirmButtonText: 'OK',
              showDenyButton: false,

              allowOutsideClick: false,
            });
          }

          setGSTRows(gstRow || []);
          return {
            options: gstRow || [],
            hasMore: data?.length >= 50, // If there are 50 items, assume more data is available
            additional: {
              page: page + 1, // Increment page number
            },
          };
        }
      } catch (error) {
        showSnackbar('Error while fetching data', 'error');
        return {
          options: [],
          hasMore: false,
        };
      }
    };

    const handleIconClick = () => {
      document.getElementById('file-input').click();
    };

    const handleFileRemove = () => {
      if (!epoNumber) {
        setIsFileSelected(false);
        return;
      }
      removeGRNInvoiceBill(epoNumber)
        .then((res) => {
          if (res?.data?.status === 'ERROR') {
            showSnackbar(res?.data?.message, 'success');
            return;
          }
          if (res?.data?.data?.es === 0) {
            setIsFileSelected(false);
            showSnackbar('File removed', 'success');
            return;
          }
          showSnackbar(res?.data?.data?.message, 'error');
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message, 'error');
        });
    };

    const handleViewFile = async () => {
      if (fileDocId) {
        setFileLoader(true);
        try {
          const res = await vieworderspdf(fileDocId);
          if (res?.status !== 200) {
            showSnackbar('Some error occured', 'error');
            return;
          }
          let blob;
          if (res?.headers?.['content-type'] === 'application/pdf') {
            blob = new Blob([res?.data], { type: 'application/pdf' });
          } else {
            blob = new Blob([res?.data], { type: 'image/png' });
          }
          const url = URL.createObjectURL(blob);
          setFileLoader(false);
          window.open(url, '_blank');
        } catch (err) {
          setFileLoader(false);
        }
      }
    };

    const handleVendorSelect = (e) => {
      if (epoNumber && vendorId && e.value !== vendorId) {
        setOpenVendorModal(true);
        setNewVendorId(e.value);
        setNewVendorDisplayName(e.label);
        return;
      }
      if (e.value == 'nil') {
        setView(false);
      } else {
        setView(true);
      }
      const vendorid = e.value;
      let vendorname = '';
      if (e.selectBy === 'Name') {
        vendorname = e.label;
      } else if (e.selectBy === 'GST') {
        vendorname = e.name;
      }
      setSubMainItem({ value: e.label, label: e.label });
      vendorSelected(vendorid);
      setVendorDisplayName(vendorname);
    };

    const handleInputGST = (value) => {
      const isValidOption = gstRows?.some((option) => option.label?.includes(value));
      if (!isValidOption) {
        setValidGSt(value);
      } else {
        setValidGSt('');
      }
    };

    const vendorSelected = (vendorid, addressId) => {
      if (!vendorid) {
        return;
      }
      setIsEditVendor(true);
      if (itemsFromPurchase?.length > 0) {
        handlePurchaseItems(itemsFromPurchase);
        setItemsFromPurchase([]);
      }
      getVendorDetails(orgId, vendorid)
        .then((res) => {
          const response = res?.data?.data;
          const address = addressId
            ? response?.addressList?.find((item) => item?.addressId == addressId)
            : response?.addressList?.find((item) => item?.addressType === 'default');

          setVendoraddress(address ? address : response?.addressList[0]);
          setSubMainItem({ value: response?.displayName, label: response?.displayName });
          setVendorListaddress(response?.addressList);
          setVendorId(response?.vendorId);
          setVendorGST(response?.kycDetails?.gst);
          setVendorPAN(response?.kycDetails?.pan);
          setVendorDisplayName(response?.displayName);
          setVendorType(response?.vendorType);
          vendorCreditAmount(response?.vendorId);
        })
        .catch((err) => {
          if (err?.response?.data?.message) {
            showSnackbar(err?.response?.data?.message, 'error');
          } else {
            showSnackbar('Some error occured', 'error');
          }
        });
      setVendorAddId('');
    };

    const vendorCreditAmount = (id) => {
      getVendorVendorCredit(id)
        .then((res) => {
          if (vendorCredit === '') {
            setVendorCredit(res?.data?.data?.availableCredits);
          }
        })
        .catch((err) => {});
    };

    const handleVerify = () => {
      if (purchaseNumber?.includes('PO')) {
        poValidatation();
      } else if (purchaseNumber?.includes('PI')) {
        piValidation();
      }
      setVerifyLoader(true);
    };

    const piValidation = async () => {
      try {
        const res = await getPurchaseIndentDetails(purchaseNumber);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message || 'Some error occurred', 'error');
          setVerifyLoader(false);
          return;
        }

        const response = res?.data?.data;
        if (response?.status !== 'APPROVED') {
          setVerifyLoader(false);
          showSnackbar('No approved PO found', 'error');
          return;
        }
        setPurchaseSelected(true);
        const purchaseItems = response?.purchaseIndentItems || [];
        const newPurchaseItems = purchaseItems?.map((newItem) => ({
          epoNumber: epoNumber || null,
          itemId: uuidv4(),
          id: '',
          itemNo: newItem?.itemCode || '',
          itemName: newItem?.itemName || '',
          quantityOrdered: newItem?.quantityOrdered || 0,
          totalPP: (Number(newItem?.quantityOrdered) || 0) * (Number(newItem?.previousPurchasePrice) || 0),
          purchasePrice: newItem?.previousPurchasePrice,
          mrp: newItem?.finalPrice !== undefined ? newItem?.finalPrice : 0,
          sellingPrice: 0,
          gst: newItem?.igst || 0,
          purchaseMargin: 0,
          specification: newItem?.spec || '',
          masterSellingPrice: 'automatic',
          offerPresent: 'false',
          offers: null,
          offerId: '',
          batchNumber: '',
          expiryDate: '',
          cess: '',
          discount: '',
          discountType: '',
        }));
        setProductSelected((prev) => [...prev, ...new Array(newPurchaseItems?.length).fill(false)]);
        setTitleSelected((prev) => [...prev, ...new Array(newPurchaseItems?.length).fill(true)]);

        if (response?.piType === 'VENDOR_SPECIFIC' && newPurchaseItems?.length > 0) {
          if (response?.vendorId !== vendorId) {
            setNewVendorId(response?.vendorId);
            setNewVendorDisplayName(response?.preferredVendor);
            setOpenVendorModal(true);
            setItemsFromPurchase(newPurchaseItems);
          } else {
            handlePurchaseItems(newPurchaseItems);
          }
          return;
        }

        const filteredItems = newPurchaseItems?.filter((item) => item?.vendorId === vendorId);

        setProductSelected((prev) => [...prev, ...new Array(filteredItems?.length).fill(false)]);
        setTitleSelected((prev) => [...prev, ...new Array(filteredItems?.length).fill(true)]);

        if (filteredItems?.length > 0) {
          handlePurchaseItems(filteredItems);
        } else {
          showSnackbar('No product is associated with the current vendor', 'error');
          setVerifyLoader(false);
        }
      } catch (err) {
        setVerifyLoader(false);
        showSnackbar(err?.response?.data?.message || 'Something went wrong', 'error');
      }
    };

    const poValidatation = () => {
      const filterObject = {
        orgId: [orgId],
        poSearchInput: purchaseNumber,
        sourceLocation: [locId],
      };
      getAllPurchaseOrders(filterObject)
        .then((res) => {
          const response = res?.data?.data?.purchaseOrderList;
          if (response?.length > 0) {
            getvendorName(response[0]?.poNumber)
              .then((dataRes) => {
                setPurchaseSelected(true);
                const itemRes = dataRes?.data?.data;
                if (itemRes?.additionalChargeList?.length > 0) {
                  const modifiedAdditionalChargeList = itemRes?.additionalChargeList?.map((charge) => ({
                    ...charge,
                    chargeId: null,
                    poNumber: undefined,
                  }));
                  setAdditionalList(modifiedAdditionalChargeList);
                  // setIsExtraField(true);
                }
                if (itemRes?.additionalChargeList) {
                  const delCharge = itemRes?.additionalChargeList?.find(
                    (ele) => ele?.description === 'Delivery Charge',
                  );
                  const labCharge = itemRes?.additionalChargeList?.find((ele) => ele?.description === 'Labour Charge');
                  setDeliveryCharge(delCharge?.amount);
                  setLabourCharge(labCharge?.amount);
                }
                setNewVendorId(itemRes?.vendorId);
                setNewVendorDisplayName(itemRes?.vendorName);
                if (vendorId) {
                  if (itemRes?.vendorId !== vendorId) {
                    setOpenVendorModal(true);
                  }
                } else {
                  if (itemRes?.vendorId !== '') {
                    vendorSelected(itemRes?.vendorId);
                  } else {
                    showSnackbar('Please select a vendor', 'warning');
                  }
                }
                const purchaseItems = [];
                itemRes?.purchaseOrderItems?.forEach((newItem) => {
                  const newItemData = {
                    epoNumber: epoNumber || null,
                    itemId: uuidv4(),
                    id: '',
                    itemNo: newItem?.itemNo || '',
                    itemName: newItem?.itemName || '',
                    quantityOrdered: Number(newItem?.quantityOrdered) || 0,
                    totalPP: (Number(newItem?.quantityOrdered) || 0) * (Number(newItem?.purchasePrice) || 0),
                    purchasePrice: newItem?.purchasePrice,
                    mrp: newItem?.unitPrice !== undefined && newItem?.unitPrice !== null ? newItem?.unitPrice : 0,
                    sellingPrice: newItem?.sellingPrice || 0,
                    gst: newItem?.gst || 0,
                    purchaseMargin: 0,
                    specification: newItem?.spec || '',
                    masterSellingPrice: 'automatic',
                    offerPresent: 'false',
                    offers: null,
                    offerId: '',
                    batchNumber: '',
                    expiryDate: '',
                    cess: '',
                    discount: '',
                    discountType: '',
                  };
                  setProductSelected((prev) => [...prev, false]);
                  setTitleSelected((prev) => [...prev, true]);
                  purchaseItems.push(newItemData);
                });
                if (purchaseItems?.length > 0) {
                  handlePurchaseItems(purchaseItems);
                }
                if (itemRes?.typeOfAddress) {
                  setCustomerId(itemRes?.customerId);
                  setToggle(itemRes?.typeOfAddress);
                  setVendorAddId(itemRes?.vendorAddressId);
                  setBillAddId(itemRes?.sourceAddressId);
                  setDeliveryAddId(itemRes?.destinationAddressId);
                  setNoAddressFound(false);
                } else {
                  setToggle('org');
                  setNoAddressFound(true);
                }
                setView(true);
              })
              .catch((err) => {});
          } else {
            showSnackbar('No such PO found', 'error');
          }

          setVerifyLoader(false);
        })
        .catch((err) => {
          setVerifyLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    };

    const handlePurchaseItems = async (purchaseItem) => {
      setItemLoader(true);
      const updatedRowData = [];
      const gtinArray = purchaseItem?.map((item) => item?.itemNo);
      const mrpArray = purchaseItem?.map((item) => item?.mrp || 0);
      const purchasePriceArray = purchaseItem?.map((item) => item?.purchasePrice || 0);

      const spPayload = {
        locationId: locId,
        gtin: gtinArray,
        purchasePrice: purchasePriceArray,
        mrp: mrpArray,
      };

      const handleSellingPrices = async (items) => {
        try {
          const sellingPriceResponse = await spMultipleProductConfig(spPayload);
          const bulkSellingPrices = sellingPriceResponse?.data?.data?.bulkSellingPrices || {};

          for (const newItem of items) {
            try {
              const productDetails = await getProductDetails(newItem.itemNo);
              newItem.gst = Number(productDetails?.data?.data?.igst) || 0;
            } catch {
              newItem.gst = 0;
            }

            newItem.sellingPrice = bulkSellingPrices[newItem.itemNo] || 0;
            newItem.masterSellingPrice = bulkSellingPrices[newItem.itemNo] === null ? 'manual' : 'automatic';

            updatedRowData.push(newItem);
          }
        } catch (error) {
          showSnackbar('Error fetching selling prices', error);
        }
      };

      const handleScrollAnimation = () => {
        const targetScrollPosition = 10050;
        if (tableRef.current) {
          const scrollStep = (targetScrollPosition - tableRef.current.scrollTop) / 20;
          let currentScrollPosition = tableRef.current.scrollTop;

          const animateScroll = () => {
            if (Math.abs(currentScrollPosition - targetScrollPosition) <= Math.abs(scrollStep)) {
              tableRef.current.scrollTop = targetScrollPosition;
            } else {
              tableRef.current.scrollTop += scrollStep;
              currentScrollPosition += scrollStep;
              requestAnimationFrame(animateScroll);
            }
          };

          animateScroll();
        }
      };

      const handleExistingProducts = async () => {
        const newSwal = Swal.mixin({
          customClass: {
            cancelButton: 'logout-cancel-btn',
            confirmButton: 'logout-success-btn',
            denyButton: 'logout-deny-btn',
          },
          buttonsStyling: false,
        });

        const result = await newSwal.fire({
          text: 'This GRN already has products, do you want to remove the existing products?',
          icon: 'info',
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: 'Keep',
          denyButtonText: 'Remove',
          cancelButtonText: 'Cancel',
          showDenyButton: true,
          allowOutsideClick: false,
        });

        if (result.isConfirmed) {
          updatedRowData.push(...rowData); // KEEP existing products
          Swal.fire('Importing products', '', 'success');
        } else if (result.isDenied) {
          Swal.fire('Importing products', '', 'success');
          setProductSelected((prev) => prev.filter((_, index) => !rowData.includes(rowData[index])));
          setTitleSelected((prev) => prev.filter((_, index) => !rowData.includes(rowData[index])));
        } else {
          // CANCEL
          setPurchaseSelected(false);
          setPurchaseNumber('');
          setProductSelected((prev) => prev.filter((_, index) => !purchaseItem?.includes(purchaseItem[index])));
          setTitleSelected((prev) => prev.filter((_, index) => !purchaseItem?.includes(purchaseItem[index])));
          handleScrollAnimation();
          setVerifyLoader(false);
          setItemLoader(false);
          return;
        }
      };

      if (rowData[0]?.itemNo !== '' && rowData?.length > 1) {
        await handleExistingProducts();
      }

      await handleSellingPrices(purchaseItem);
      setRowData(updatedRowData);
      setPurchaseDataAdded(true);
      setVerifyLoader(false);
      setItemLoader(false);
      handleScrollAnimation();
    };

    const [openVendAddModal, setOpenVendAddModal] = useState(false);

    const handleChageBillAddress = (item) => {
      setBilladdress(item);
      setOpenBillModal(false);
    };

    const handleChageShipAddress = (item) => {
      setDeliveryAddress(item);
      setOpenShipModal(false);
    };

    const orgAddressData = (isPresent, delievryId, billID) => {
      getBranchAllAdresses(locId)
        .then((res) => {
          if (res?.data?.data?.message === 'ADDRESS_NOT_FOUND') {
            showSnackbar(res?.data?.data?.message, 'error');
            return;
          }
          const response = res?.data?.data;
          const addresses = response?.addresses || [];
          const defaultAddress = addresses?.find((item) => item.defaultAddress === true);
          const defaultBilling = billID
            ? addresses?.find((item) => item?.id == billID)
            : addresses?.find((item) => item.defaultBilling === true);
          const defaultShipping = delievryId
            ? addresses?.find((item) => item?.id == delievryId)
            : addresses?.find((item) => item.defaultShipping === true);

          setAllListAddress(addresses);
          if (!isPresent) {
            if (billID && delievryId) {
              setBilladdress(defaultBilling);
              setDeliveryAddress(defaultShipping);

              return;
            }
            if (defaultAddress) {
              setBilladdress(defaultAddress);
              setDeliveryAddress(defaultAddress);
            } else {
              if (defaultBilling && !defaultShipping) {
                setBilladdress(defaultBilling);
                setDeliveryAddress(defaultBilling);
              } else if (defaultShipping && !defaultBilling) {
                setBilladdress(defaultShipping);
                setDeliveryAddress(defaultShipping);
              } else if (!defaultShipping && !defaultBilling) {
                setBilladdress(addresses[0]);
                setDeliveryAddress(addresses[0]);
              } else {
                setBilladdress(defaultBilling);
                setDeliveryAddress(defaultShipping);
              }
            }
          }
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message, 'error');
        });
      setDeliveryAddId('');
      setBillAddId('');
      allCustomerList();
    };

    const handleVendorAddress = () => {
      setOpenVendAddModal(true);
      if (vendorListaddress?.length === 0) {
        allVendorList();
      }
    };

    const handleChangeVendorAdd = (payload) => {
      setVendoraddress(payload);
      setOpenVendAddModal(false);
    };

    const [dataRowscustomer, setTableRowscustomer] = useState([]);
    let dataArrcustomer,
      dataRowcustomer = [];

    let retryCountCust = 0;
    const allCustomerList = () => {
      let partnerType = '';
      if (contextType === 'RETAIL') {
        partnerType = 'RETAIL';
      } else if (contextType === 'WMS') {
        partnerType = 'WAREHOUSE';
      }
      const payload = {
        pageNumber: 0,
        pageSize: 50,
        partnerId: orgId,
        partnerType: partnerType,
      };
      getCustomerList(payload)
        .then(function (responseTxt) {
          if (responseTxt.data.data.code === 'ECONNRESET') {
            if (retryCountCust < 3) {
              allCustomerList();
              retryCountCust++;
            } else {
              showSnackbar('Some error occured, try after aome time', 'error');
            }
          }
          if (responseTxt.data.data.es === 0) {
            dataArrcustomer = responseTxt.data.data.retails;
            dataRowcustomer.push(
              dataArrcustomer?.reverse().map((row) => ({
                value: row.retailId,
                label: row.displayName,
              })),
            );
            setTableRowscustomer(dataRowcustomer[0]);
          }
        })
        .catch((err) => {
          if (err?.response?.status === '429') {
            allCustomerList();
          }
        });
    };

    const handlecustomerDetails = (value, isPresent, delievryId, billID) => {
      setCustomerId(value);
      getCustomerDetails(value)
        .then((res) => {
          if (res?.data?.data?.es) {
            showSnackbar('No address found', 'error');
            return;
          }
          const response = res?.data?.data?.retail;
          setCustGST(response?.gstNumber);
          setCustPAN(response?.panNumber);
          const addresses = response?.addresses || [];
          const defaultAddress = addresses?.find((item) => item?.defaultAddress === true);
          const defaultBilling = billID
            ? addresses?.find((item) => item?.id == billID)
            : addresses?.find((item) => item?.defaultBilling === true);
          const defaultShipping = delievryId
            ? addresses?.find((item) => item?.id == delievryId)
            : addresses?.find((item) => item?.defaultShipping === true);
          setAllListAddress(addresses);
          if (!isPresent) {
            if (billID && defaultBilling) {
              setBilladdress(defaultBilling);
            }
            if (delievryId && defaultShipping) {
              setDeliveryAddress(defaultShipping);
            } else if (defaultAddress) {
              setBilladdress(defaultAddress);
              setDeliveryAddress(defaultAddress);
            } else {
              if (defaultBilling && !defaultShipping) {
                setBilladdress(defaultBilling);
                setDeliveryAddress(defaultBilling);
              } else if (defaultShipping && !defaultBilling) {
                setBilladdress(defaultShipping);
                setDeliveryAddress(defaultShipping);
              } else if (!defaultShipping && !defaultBilling) {
                setBilladdress(addresses[0]);
                setDeliveryAddress(addresses[0]);
              } else {
                setBilladdress(defaultBilling);
                setDeliveryAddress(defaultShipping);
              }
            }
          }
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        });

      setDeliveryAddId('');
      setBillAddId('');
    };

    const handleDocumentAIUploadClick = () => {
      documentAIInputRef.current?.click();
    };

    const onRemoveUploadedFile = () => {
      setUploadedFile(null);
      setUploadStatus('');
      if (documentAIInputRef.current) {
        documentAIInputRef.current.value = '';
      }
    };

    return (
      <Grid container spacing={3} mt={-2} sx={{ padding: '10px' }}>
        {vendorDisplayName && (
          <Grid item xs={12} md={12} xl={12} mr={3} mt={-2}>
            <SoftTypography fontWeight="bold" fontSize="18px">
              {vendorDisplayName} {'  '}
              {isEditVendor && (
                <EditIcon
                  color="info"
                  onClick={() => setIsEditVendor(false)}
                  style={{ cursor: 'pointer', fontSize: '14px' }}
                />
              )}
            </SoftTypography>
          </Grid>
        )}
        {!isEditVendor && (
          <>
            <Grid item xs={6} md={3} xl={3} mr={3} mt={-2}>
              <SoftTypography
                component="label"
                variant="caption"
                // fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
              >
                Select Vendor By
                <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
              </SoftTypography>
              <SoftSelect
                ref={selectMainItemRef}
                value={mainSelectOption.find((ele) => ele.value === mainItem) || null}
                options={mainSelectOption}
                onChange={(e) => handlMainItem(e)}
                menuIsOpen={menuIsOpen}
                onMenuOpen={() => setMenuIsOpen(true)}
                onMenuClose={() => setMenuIsOpen(false)}
              />
            </Grid>
            {mainItem && (
              <Grid item xs={6} md={6} xl={6} mt={-2}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  // fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Search by {mainItem}
                  <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                </SoftTypography>
                {mainItem === 'Name' ? (
                  <SoftAsyncPaginate
                    key="name-select"
                    className="select-box-category"
                    placeholder="Select vendor..."
                    value={subMainItem}
                    loadOptions={loadVendorNameOption}
                    additional={{
                      page: 1,
                    }}
                    isClearable
                    size="medium"
                    onChange={handleVendorSelect}
                    menuPortalTarget={document.body}
                    onMenuOpen={() => setSecondMenuIsOpen(true)}
                    onMenuClose={() => setSecondMenuIsOpen(false)}
                  />
                ) : mainItem === 'GST' ? (
                  <SoftAsyncPaginate
                    key="gst-select"
                    className="select-box-category"
                    placeholder="Select vendor..."
                    value={subMainItem}
                    loadOptions={loadVendorGSTOption}
                    additional={{
                      page: 1,
                    }}
                    isClearable
                    size="medium"
                    onChange={handleVendorSelect}
                    menuPortalTarget={document.body}
                    onMenuOpen={() => setSecondMenuIsOpen(true)}
                    onMenuClose={() => setSecondMenuIsOpen(false)}
                  />
                ) : null}
                {/* {mainItem === 'Name' ? (
              <SoftSelect
                ref={vendorSelectRef}
                value={subMainItem}
                options={dataRows}
                onChange={handleVendorSelect}
                menuIsOpen={secondMenuIsOpen}
                onMenuOpen={() => setSecondMenuIsOpen(true)}
                onMenuClose={() => setSecondMenuIsOpen(false)}
              />
            ) : mainItem === 'GST' ? (
              <SoftSelect
                ref={vendorSelectRef}
                value={subMainItem}
                options={gstRows}
                onChange={handleVendorSelect}
                onInputChange={handleInputGST}
                menuIsOpen={secondMenuIsOpen}
                onMenuOpen={() => setSecondMenuIsOpen(true)}
                onMenuClose={() => setSecondMenuIsOpen(false)}
              />
            ) : null} */}
              </Grid>
            )}
          </>
        )}
        {view && (
          <>
            <Grid item xs={12} md={12} xl={12}>
              <Grid container spacing={3}>
                <Grid item xs={8} md={4} xl={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      Purchase number
                    </SoftTypography>
                    <SoftBox display="flex">
                      <SoftInput
                        disabled={purchaseSelected ? true : false}
                        value={purchaseNumber}
                        onChange={(e) => setPurchaseNumber(e.target.value)}
                      />
                      <SoftButton
                        variant={buttonStyles.secondaryVariant}
                        className="outlined-softbutton"
                        onClick={handleVerify}
                        disabled={purchaseNumber === '' || verifyLoader || purchaseSelected ? true : false}
                        style={{ marginLeft: '10px' }}
                      >
                        {verifyLoader ? <CircularProgress size={20} color="info" /> : <>Validate</>}
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <Grid container spacing={3} justifyContent="space-between">
                {view ? (
                  <>
                    <Grid container spacing={3} ml={1} mt={2}>
                      <Grid item xs={12} md={3.5} xl={3.5}>
                        <div>
                          <span className="po-address-title" style={{ marginLeft: '10px' }}>
                            Vendor details
                          </span>
                        </div>
                        <div
                          className="component-bg-br-sh-p"
                          style={{
                            marginTop: `${toggle === 'cus' ? '15px' : '0px'}`,
                            maxHeight: '245px',
                            overflowY: 'scroll',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <span className="po-address-title">Vendor details</span> */}
                            <EditIcon
                              color="info"
                              onClick={handleVendorAddress}
                              style={{ cursor: 'pointer', fontSize: '14px' }}
                            />
                          </div>
                          <div className="address-main-container" style={{ width: '90%', marginTop: '-10px' }}>
                            <div className="address-line-container">
                              <span className="po-address-font">
                                {' '}
                                <b> Vendor Name: </b>
                                {vendorDisplayName}
                              </span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{vendoraddress?.addressLine1}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{vendoraddress?.addressLine2}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{vendoraddress?.city}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{vendoraddress?.state}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font"> {vendoraddress?.pinCode}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{vendoraddress?.country}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">
                                {' '}
                                <b>GST:</b> {vendorGST}
                              </span>
                              {/* <span>{vendorGST}</span> */}
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">
                                {' '}
                                <b>PAN:</b> {vendorPAN}
                              </span>
                              {/* <span>{vendorPAN}</span> */}
                            </div>
                          </div>
                        </div>
                        <Modal
                          aria-labelledby="unstyled-modal-title"
                          aria-describedby="unstyled-modal-description"
                          open={openVendAddModal}
                          onClose={() => {
                            setOpenVendAddModal(false);
                          }}
                        >
                          <Box
                            className="pi-box-inventory"
                            sx={{
                              position: 'absolute',
                              top: '40%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              bgcolor: 'background.paper',
                              boxShadow: 24,
                              // p: 4,
                              overflow: 'auto',
                              maxHeight: '80vh',
                            }}
                          >
                            <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                              Select Vendor Address
                            </Typography>
                            <hr />
                            <SoftBox>
                              {vendorListaddress?.map((e) => {
                                return (
                                  <SoftBox key={e?.addressId} onClick={() => handleChangeVendorAdd(e)}>
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        gap: '5px',
                                      }}
                                    >
                                      <input
                                        type="radio"
                                        checked={vendoraddress?.addressId === e?.addressId}
                                        onChange={() => handleChangeVendorAdd(e)}
                                        value={e?.addressId}
                                      />
                                      <div>
                                        <SoftTypography className="add-pi-font-size">{e?.addressLine1}</SoftTypography>
                                        <SoftTypography className="add-pi-font-size">{e?.addressLine2}</SoftTypography>
                                        <SoftTypography className="add-pi-font-size">{e.state}</SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {e.city} {e.pinCode}
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">{e.country}</SoftTypography>
                                      </div>
                                    </div>

                                    <hr />
                                  </SoftBox>
                                );
                              })}
                            </SoftBox>
                          </Box>
                        </Modal>
                      </Grid>
                      <Grid item xs={12} md={8.5} xl={8.5}>
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              padding: '10px',
                              gap: '20px',
                              marginTop: '-10px',
                              alignItems: 'center',
                            }}
                          >
                            <span className="po-address-title">Select billing and shipping details</span>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                gap: '5px',
                              }}
                            >
                              <input
                                type="radio"
                                name="billing-address"
                                value="org"
                                onChange={() => handleorgAdd('org')}
                                checked={toggle === 'org'}
                                style={{ cursor: 'pointer' }}
                              />
                              <SoftTypography mr={1} fontSize="13px" fontWeight="medium">
                                Organisation
                              </SoftTypography>

                              <input
                                type="radio"
                                name="billing-address"
                                value="cus"
                                onChange={() => handleorgAdd('cus')}
                                checked={toggle === 'cus'}
                                style={{ cursor: 'pointer' }}
                              />
                              <SoftTypography mr={1} fontSize="13px" fontWeight="medium">
                                Customer
                              </SoftTypography>
                              {toggle === 'cus' && (
                                <SoftSelect
                                  options={dataRowscustomer}
                                  value={dataRowscustomer?.find((ele) => ele?.value == customerId || '')}
                                  onChange={(e) => {
                                    handlecustomerDetails(e.value);
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6} xl={6}>
                              <div className="component-bg-br-sh-p" style={{ maxHeight: '248px', overflowY: 'scroll' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span className="po-address-title">Billing address</span>
                                  <EditIcon
                                    color="info"
                                    onClick={() => setOpenBillModal(true)}
                                    style={{ cursor: 'pointer', fontSize: '14px' }}
                                  />
                                </div>
                                <div className="address-main-container" style={{ width: '90%' }}>
                                  <div className="address-line-container">
                                    <span className="po-address-font">Store Name: {billaddress?.name}</span>
                                  </div>
                                  <div className="address-line-container">
                                    <span className="po-address-font">{billaddress?.addressLine1}</span>
                                  </div>
                                  <div className="address-line-container">
                                    <span className="po-address-font">{billaddress?.addressLine2}</span>
                                  </div>
                                  <div className="address-line-container">
                                    <span className="po-address-font">{billaddress?.city}</span>
                                  </div>
                                  <div className="address-line-container">
                                    <span className="po-address-font">{billaddress?.state}</span>
                                  </div>
                                  <div className="address-line-container">
                                    <span className="po-address-font"> {billaddress?.pincode}</span>
                                  </div>
                                  <div className="address-line-container">
                                    <span className="po-address-font">{billaddress?.country}</span>
                                  </div>
                                  {toggle === 'cus' && (
                                    <>
                                      <div className="address-line-container">
                                        <span className="po-address-font">
                                          <b>GST:</b> {custGST}
                                        </span>
                                      </div>
                                      <div className="address-line-container">
                                        <span className="po-address-font">
                                          <b>PAN:</b>: {custPAN}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              <Modal
                                aria-labelledby="unstyled-modal-title"
                                aria-describedby="unstyled-modal-description"
                                open={openBillModal}
                                onClose={() => {
                                  setOpenBillModal(false);
                                }}
                              >
                                <Box
                                  className="pi-box-inventory"
                                  sx={{
                                    position: 'absolute',
                                    top: '40%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    // p: 4,
                                    overflow: 'auto',
                                    maxHeight: '80vh',
                                  }}
                                >
                                  <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                                    Select billing address
                                  </Typography>
                                  <hr />
                                  <SoftBox>
                                    {allListAddress?.map((e) => {
                                      return (
                                        <SoftBox key={e?.id} onClick={() => handleChageBillAddress(e)}>
                                          <div
                                            style={{
                                              display: 'flex',
                                              justifyContent: 'flex-start',
                                              alignItems: 'flex-start',
                                              gap: '5px',
                                            }}
                                          >
                                            <input
                                              type="radio"
                                              checked={billaddress?.id == e?.id}
                                              onChange={() => handleChageBillAddress(e)}
                                              value={e?.id}
                                            />
                                            <div>
                                              <SoftTypography className="add-pi-font-size">{e?.name}</SoftTypography>
                                              <SoftTypography className="add-pi-font-size">
                                                {e?.addressLine1}
                                              </SoftTypography>
                                              <SoftTypography className="add-pi-font-size">
                                                {e?.addressLine2}
                                              </SoftTypography>
                                              <SoftTypography className="add-pi-font-size">{e.state}</SoftTypography>
                                              <SoftTypography className="add-pi-font-size">
                                                {e.city} {e.pinCode}
                                              </SoftTypography>
                                              <SoftTypography className="add-pi-font-size">{e.country}</SoftTypography>
                                            </div>
                                          </div>

                                          <hr />
                                        </SoftBox>
                                      );
                                    })}
                                  </SoftBox>
                                </Box>
                              </Modal>
                            </Grid>
                            <Grid item xs={12} md={6} xl={6}>
                              <div>{/* <span className="po-address-title">Purchase delivery address</span> */}</div>
                              <div className="component-bg-br-sh-p" style={{ maxHeight: '248px', overflowY: 'scroll' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span className="po-address-title">Shipping address</span>
                                  <EditIcon
                                    color="info"
                                    onClick={() => setOpenShipModal(true)}
                                    style={{ cursor: 'pointer', fontSize: '14px' }}
                                  />
                                </div>
                                <div className="address-main-container" style={{ width: '90%' }}>
                                  <div className="address-line-container">
                                    <span className="po-address-font">Store Name: {deliveryAddress?.name}</span>
                                  </div>
                                  <div className="address-line-container">
                                    <span className="po-address-font">{deliveryAddress?.addressLine1}</span>
                                  </div>
                                  <div className="address-line-container">
                                    <span className="po-address-font">{deliveryAddress?.addressLine2}</span>
                                  </div>
                                  <div className="address-line-container">
                                    <span className="po-address-font">{deliveryAddress?.city}</span>
                                  </div>
                                  <div className="address-line-container">
                                    <span className="po-address-font">{deliveryAddress?.state}</span>
                                  </div>
                                  <div className="address-line-container">
                                    <span className="po-address-font"> {deliveryAddress?.pincode}</span>
                                  </div>
                                  <div className="address-line-container">
                                    <span className="po-address-font">{deliveryAddress?.country}</span>
                                  </div>
                                  {toggle === 'cus' && (
                                    <>
                                      <div className="address-line-container">
                                        <span className="po-address-font">
                                          <b>GST:</b> {custGST}
                                        </span>
                                      </div>
                                      <div className="address-line-container">
                                        <span className="po-address-font">
                                          <b>PAN:</b> {custPAN}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              <Modal
                                aria-labelledby="unstyled-modal-title"
                                aria-describedby="unstyled-modal-description"
                                open={openShipModal}
                                onClose={() => {
                                  setOpenShipModal(false);
                                }}
                              >
                                <Box
                                  className="pi-box-inventory"
                                  sx={{
                                    position: 'absolute',
                                    top: '40%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    bgcolor: 'background.paper',
                                    boxShadow: 24,
                                    // p: 4,
                                    overflow: 'auto',
                                    maxHeight: '80vh',
                                  }}
                                >
                                  <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                                    Select delivery address
                                  </Typography>
                                  <hr />
                                  <SoftBox>
                                    {allListAddress?.map((e) => {
                                      return (
                                        <SoftBox key={e?.id} onClick={() => handleChageShipAddress(e)}>
                                          <div
                                            style={{
                                              display: 'flex',
                                              justifyContent: 'flex-start',
                                              alignItems: 'flex-start',
                                              gap: '5px',
                                            }}
                                          >
                                            <input
                                              type="radio"
                                              checked={deliveryAddress?.id == e?.id}
                                              onChange={() => handleChageShipAddress(e)}
                                              value={e?.id}
                                            />
                                            <div>
                                              <SoftTypography className="add-pi-font-size">{e?.name}</SoftTypography>
                                              <SoftTypography className="add-pi-font-size">
                                                {e?.addressLine1}
                                              </SoftTypography>
                                              <SoftTypography className="add-pi-font-size">
                                                {e?.addressLine2}
                                              </SoftTypography>
                                              <SoftTypography className="add-pi-font-size">{e.state}</SoftTypography>
                                              <SoftTypography className="add-pi-font-size">
                                                {e.city} {e.pinCode}
                                              </SoftTypography>
                                              <SoftTypography className="add-pi-font-size">{e.country}</SoftTypography>
                                            </div>
                                          </div>

                                          <hr />
                                        </SoftBox>
                                      );
                                    })}
                                  </SoftBox>
                                </Box>
                              </Modal>
                            </Grid>
                          </Grid>
                        </div>
                      </Grid>
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </Grid>

            <Grid item xs={12} md={12} xl={12}>
              <Grid container spacing={3} justifyContent="space-between">
                <Grid item xs={8} md={4} xl={4}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="13px">
                      Invoice (bill) number
                      <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox style={{ display: 'flex', gap: '5px', justifyContent: 'flex start', alignItems: 'center' }}>
                    <SoftBox style={{ width: '50%' }}>
                      <SoftInput value={invoiceRefNo} onChange={(e) => setInvoiceRefNo(e.target.value)} />
                    </SoftBox>
                    {isFileSelected ? (
                      <SoftBox style={{ display: 'flex', gap: '5px', alignItems: 'center', cursor: 'pointer' }}>
                        <InsertDriveFileIcon color="info" onClick={handleIconClick} />
                        <span style={{ fontSize: '12px', color: '#ff9500' }} onClick={handleIconClick}>
                          {' '}
                          Replace file{' '}
                        </span>
                        <input
                          id="file-input"
                          type="file"
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.xls,.xlsx,.doc,.docx"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                        <IconButton size="small" onClick={handleFileRemove}>
                          <CloseIcon />
                        </IconButton>
                        {fileLoader ? (
                          <Spinner size={20} />
                        ) : (
                          <IconButton size="small" onClick={handleViewFile}>
                            <RemoveRedEyeIcon color="info" />
                          </IconButton>
                        )}
                      </SoftBox>
                    ) : (
                      <SoftBox
                        style={{ display: 'flex', gap: '5px', alignItems: 'center', cursor: 'pointer' }}
                        onClick={handleIconClick}
                      >
                        <AttachFileIcon color="info" />
                        <span style={{ fontSize: '12px' }}> Choose a file </span>
                        <input
                          id="file-input"
                          type="file"
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.xls,.xlsx,.doc,.docx"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                      </SoftBox>
                    )}
                  </SoftBox>
                  {/* {isFileSelected && (
                    <SoftBox className="grn-file-box">
                      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>File attached</span>
                      <IconButton size="small" onClick={handleFileRemove}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </SoftBox>
                  )} */}
                </Grid>
                <Grid item xs={8} md={2.5} xl={2.5}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="13px">
                      Invoice (bill) date
                      <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                    </SoftTypography>
                  </SoftBox>
                  <SoftInput type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                </Grid>
                <Grid item xs={8} md={2.5} xl={2.5}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold" fontSize="13px">
                      Invoice (bill) value
                      <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                    </SoftTypography>
                  </SoftBox>
                  <SoftInput type="number" value={invoiceValue} onChange={(e) => setInvoiceValue(e.target.value)} />
                </Grid>

                <Grid item xs={8} md={2.5} xl={2.5}>
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                  >
                    Payment due date
                  </SoftTypography>
                  <SoftInput type="date" value={paymentDue} onChange={(e) => setPaymentDue(e.target.value)} />
                </Grid>
                {/* <Grid item xs={8} md={3} xl={2}>
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                  >
                    Payment Mode
                  </SoftTypography>
                  <SoftSelect
                    value={paymentMode}
                    defaultValue={{ value: 'Cash', label: 'Cash' }}
                    onChange={(option) => setPaymenMode(option)}
                    options={[
                      { value: 'Cash', label: 'Cash' },
                      { value: 'Bank transfers', label: 'Bank transfers' },
                      { value: 'Card/ UPI/ Netbanking', label: 'Card/ UPI/ Netbanking' },
                      { value: 'Cheque', label: 'Cheque' },
                    ]}
                  />
                </Grid> */}
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} xl={12}>
              <Grid container spacing={3} justifyContent="space-between">
                <Grid item xs={8} md={4} xl={4}>
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                  >
                    Tax details
                  </SoftTypography>
                  {/* <SoftSelect
                    value={inclusiveTax}
                    defaultValue={{ value: 'false', label: 'GST Exclusive' }}
                    onChange={(option) => handleGSTChange(option)}
                    options={[
                      { value: 'false', label: 'GST Exclusive' },
                      { value: 'true', label: 'GST Inclusive' },
                    ]}
                  /> */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      padding: '10px',
                      gap: '10px',
                      marginTop: '-10px',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <input
                        type="radio"
                        name="gstOption"
                        value="false"
                        checked={inclusiveTax === 'false'}
                        onChange={(e) => handleGSTChange(e.target.value)}
                        style={{ cursor: 'pointer' }}
                      />
                      <SoftTypography mr={1} fontSize="13px" fontWeight="medium">
                        GST Exclusive
                      </SoftTypography>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <input
                        type="radio"
                        name="gstOption"
                        value="true"
                        checked={inclusiveTax === 'true'}
                        onChange={(e) => handleGSTChange(e.target.value)}
                        style={{ cursor: 'pointer' }}
                      />
                      <SoftTypography mr={1} fontSize="13px" fontWeight="medium">
                        GST Inclusive
                      </SoftTypography>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={8} md={6} xl={7}>
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                  >
                    Add approver
                    <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                  </SoftTypography>
                  <SoftSelect
                    value={assignedToLabel}
                    required
                    onChange={(e) => handleAssignTo(e)}
                    options={assignUserrow}
                    isMulti
                    onFocus={handleFocusApprover}
                    menuIsOpen={approverMenuOpen}
                    onMenuOpen={() => setApproverMenu(true)}
                    onMenuClose={() => setApproverMenu(false)}
                  />
                </Grid>
                <Grid item xs={8} md={4} xl={4}>
                  <SoftBox
                    style={{
                      display: 'flex',
                      gap: '5px',
                      alignItems: 'center',
                      cursor:
                        isUploading || uploadStatus === 'Document processed successfully!' ? 'default' : 'pointer',
                    }}
                    onClick={() => {
                      if (!isUploading && uploadStatus !== 'Document processed successfully!') {
                        handleDocumentAIUploadClick();
                      }
                    }}
                  >
                    {isUploading ? (
                      <CircularProgress size={20} color="info" />
                    ) : uploadStatus === 'Document processed successfully!' && uploadedFile ? (
                      <>
                        {isModalLoading ? (
                          <CircularProgress size={20} color="info" />
                        ) : (
                          <>
                            <span
                              style={{ fontSize: '12px', cursor: 'pointer', marginRight: '8px' }}
                              onClick={openDocumentAIModal}
                            >
                              View Uploaded Document
                            </span>

                            <IconButton
                              component="a"
                              href={URL.createObjectURL(uploadedFile)}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                            >
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                              onClick={onRemoveUploadedFile}
                              size="small"
                              color="error"
                              aria-label="Remove uploaded file"
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <AttachFileIcon color="info" />
                        <span style={{ fontSize: '12px' }}>Upload Document to Document AI</span>
                      </>
                    )}

                    <input
                      id="file-input"
                      ref={documentAIInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      style={{ display: 'none' }}
                      onChange={handleDocumentAIChange}
                    />
                  </SoftBox>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        <Modal
          open={openVendorModal}
          onClose={handleCloseVendorModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="pi-approve-menu">
            <SoftTypography id="modal-modal-title" variant="h6" component="h2">
              This purchase is already associated with a vendor <b>{vendorDisplayName} </b>. Do you want to import from
              vendor <b>{newVendorName}</b>?
            </SoftTypography>
            <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
              <SoftButton
                variant={buttonStyles.secondaryVariant}
                className="outlined-softbutton"
                onClick={handleCloseVendorModal}
              >
                Cancel
              </SoftButton>
              <SoftButton
                className="vendor-add-btn"
                onClick={() => {
                  vendorSelected(newVendorId);
                  setOpenVendorModal(false);
                }}
              >
                Confirm
              </SoftButton>
            </SoftBox>
          </Box>
        </Modal>
      </Grid>
    );
  },
);

export default OtherGRNDetails;
