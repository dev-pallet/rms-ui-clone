import {
  Box,
  CircularProgress,
  Grid,
  Menu,
  MenuItem,
  Modal,
  TextField,
  TextareaAutosize,
  Tooltip,
} from '@mui/material';
import {
  additionalInfoPiDetails,
  createInventoryReturn,
  getAllInventoryReturns,
  getAllInventoryReturnsJob,
  getAllVendorDetails,
  getAllVendors,
  getInventoryDetails,
  getVendorDetails,
  inventoryReturnStateChange,
  inventoryReturnStateChangeJob,
  submitInventoryReturn,
  updateInventoryReturn,
  updateInventoryReturnJob,
} from '../../../../../config/Services';
import { buttonStyles } from '../../../Common/buttonColor';
import {
  decimalPointFormatter,
  getNextDateWithFlagTrue,
  roundToTwoDecimalPlaces,
} from '../../../Common/CommonFunction';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import CancelIcon from '@mui/icons-material/Cancel';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import PurchaseReturnProductList from './components/productList';
import React, { useEffect, useRef, useState } from 'react';
import SalesBillingDetailRow from '../../../sales-order/new-sales/components/create-sales/components/billingDetail';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import SoftAsyncPaginate from '../../../../../components/SoftSelect/SoftAsyncPaginate';

const NewPurchaseReturn = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);
  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const userName = localStorage.getItem('user_name');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;

  const [listDisplay, setListDisplay] = useState(localStorage.getItem('returnJobId') ? true : false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [dataRows, setTablevendorRows] = useState([]);
  const [gstRows, setGSTRows] = useState([]);
  const [mainItem, setMainItem] = useState('');
  const [subMainItem, setSubMainItem] = useState({ value: 'Select', label: 'Select' });
  const [view, setView] = useState(false);
  const [vendorId, setVendorId] = useState('');
  const [vendorGST, setVendorGST] = useState('');
  const [vendorPAN, setVendorPAN] = useState('');
  const [vendorDisplayName, setVendorDisplayName] = useState('');
  const [vendoraddress, setVendoraddress] = useState({});
  const [isVendorSelected, setIsVendorSelected] = useState(false);
  const [purchaseMethod, setPurchaseMethod] = useState('');
  const [purchaseTerms, setPurchaseTerms] = useState('');
  const [returnAndReplacement, setReturnReplacemnt] = useState('');
  const [vendorData, setVendorData] = useState({});
  const [itemarray, setItemArray] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [isItemChanged, setIsItemChanged] = useState(false);
  const [allData, setAllData] = useState({});
  const [returnJobId, setReturnJobId] = useState(localStorage.getItem('returnJobId') || null);
  const [expectedDate, setExpectedDate] = useState('');
  const [refundMode, setRefundMode] = useState('');
  const [returnMode, setReturnMode] = useState('vendorPickup');
  const [transport, setTransport] = useState('');
  const [comment, setComment] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [saveLoader, setSaveLoader] = useState(false);
  const [submitLoader, setSumbitLoader] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const refundOptions = [
    { value: 'Credit Note', label: 'Credit Note' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
  ];
  const transportOptions = [
    { value: 'Vendor transport', label: 'Vendor transport' },
    { value: 'Own transport', label: 'Own transport' },
    { value: 'Third party', label: 'Third party' },
  ];

  const billingItems = [
    { label: 'Estimated value', value: roundToTwoDecimalPlaces(allData ? allData?.taxableValue : 0) || 0 },
    { label: 'IGST', value: roundToTwoDecimalPlaces(allData ? allData?.igstAmount : 0) || 0 },
    { label: 'CGST', value: roundToTwoDecimalPlaces(allData ? allData?.cgstAmount : 0) || 0 },
    { label: 'SGST', value: roundToTwoDecimalPlaces(allData ? allData?.sgstAmount : 0) || 0 },
    { label: 'Cess', value: roundToTwoDecimalPlaces(allData ? allData?.cessAmount : 0) || 0 },
    {
      label: 'Expected Total',
      value: roundToTwoDecimalPlaces(allData ? allData?.grossAmount || allData?.returnAmount : 0) || 0,
      isBold: true,
    },
  ].filter(Boolean);

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
  let dataArrvendor,
    dataRow = [];

  useEffect(() => {
    allVendorList();
  }, []);

  let retryCount = 0;
  const allVendorList = () => {
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
            dataArrvendor?.vendors
              ?.map((row) => ({
                value: row?.vendorId,
                label: row?.vendorName,
                gst: row?.gstNumber,
                selectBy: 'Name',
              }))
              .sort((a, b) => a.label.localeCompare(b.label)),
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

  useEffect(() => {
    if (returnJobId && listDisplay) {
      if (returnJobId?.includes('RJ')) {
        fetchAllReturnJobItems(returnJobId);
      } else if (returnJobId?.includes('RN')) {
        fetchReturnItems(returnJobId);
      }
    }
  }, [listDisplay]);

  const extractItemListProperty = (response, property) =>
    response?.map((item) => (item?.[property] !== null && item?.[property] !== undefined ? item?.[property] : ''));

  const getVendorData = (vendorid) => {
    getVendorDetails(orgId, vendorid).then((res) => {
      setVendorName((prev) => [...prev, res?.data?.data?.displayName || '']);
    });
  };

  const getBatchAvailableunits = async (gtin, batchNo) => {
    try {
      const res = await getInventoryDetails(locId, gtin);
      if (res?.data?.data?.es) {
        return '';
      }
      const response = res?.data?.data?.data?.multipleBatchCreations;
      if (response?.length > 0) {
        const unitAvailable = response?.find((ele) => ele?.batchId === batchNo);
        return unitAvailable?.availableUnits || '';
      }
      return '';
    } catch (err) {
      return '';
    }
  };

  const fetchAllReturnJobItems = async (returnJobId) => {
    try {
      const res = await getAllInventoryReturnsJob(returnJobId);
      const dataResponse = res?.data?.data;
      if (dataResponse?.es) {
        setListDisplay(false);
        showSnackbar(response?.message || 'Some error occurred', 'error');
        return;
      }

      const response = dataResponse?.returnJob;
      setRefundMode(response?.refundMethod);
      setComment(response?.comments);
      setAllData(response);
      setTransport(response?.transport);
      setReturnMode(response?.returnMode);
      if (listDisplay) {
        setIsVendorSelected(response?.returnJobType === 'VENDOR_SPECIFIC' ? true : false);
        if (response?.vendorId !== '' && response?.vendorId) {
          vendorSelected(response?.vendorId);
        }
        if (response?.returnJobItemList?.length > 0) {
          setItemArray(response?.returnJobItemList.map((item) => ({ ...item, availableUnits: '' })));
          setListDisplay(false);
          // response?.returnJobItemList.forEach((item) => {
          //   getBatchAvailableunits(item?.itemCode, item?.batchNo)
          //     .then((availableUnits) => {
          //       setItemArray((prevItemArray) =>
          //         prevItemArray.map((prevItem) => {
          //           if (prevItem?.rjItemId === item?.rjItemId) {
          //             return { ...prevItem, availableUnits };
          //           }
          //           return prevItem;
          //         }),
          //       );
          //     })
          //     .catch((error) => {});
          // });
        }
      }
    } catch (err) {
      setListDisplay(false);
      showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
    }
  };

  const fetchReturnItems = async (returnJobId) => {
    try {
      const res = await getAllInventoryReturns(returnJobId);
      const dataResponse = res?.data?.data;
      if (dataResponse?.es) {
        setListDisplay(false);
        showSnackbar(response?.message || 'Some error occurred', 'error');
        return;
      }
      const response = dataResponse?.returnDetails;
      setRefundMode(response?.refundMethod);
      setComment(response?.comments);
      setAllData(response);
      setTransport(response?.transport);
      setReturnMode(response?.returnMode);
      if (listDisplay) {
        setIsVendorSelected(response?.returnJobType === 'VENDOR_SPECIFIC' ? true : false);
        if (response?.vendorId !== '' && response?.vendorId) {
          vendorSelected(response?.vendorId);
        }
        if (response?.returnJobItemList?.length > 0) {
          setItemArray(response?.returnJobItemList.map((item) => ({ ...item, availableUnits: '' })));
          setListDisplay(false);
          // response?.returnJobItemList.forEach((item) => {
          //   getBatchAvailableunits(item?.itemCode, item?.batchNo)
          //     .then((availableUnits) => {
          //       setItemArray((prevItemArray) =>
          //         prevItemArray.map((prevItem) => {
          //           if (prevItem?.itemId === item?.itemId) {
          //             return { ...prevItem, availableUnits };
          //           }
          //           return prevItem;
          //         }),
          //       );
          //     })
          //     .catch((error) => {});
          // });
        }
      }
      setListDisplay(false);
    } catch (err) {
      setListDisplay(false);
      showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
    }
  };

  const itemListarray1 = rowData
    ?.map((e, index) => ({
      rjItemId: e?.rjItemId || null,
      returnJobId: returnJobId?.includes('RN') ? allData?.returnJobId : returnJobId || null,
      poNumber: e?.poNumber,
      vendorId: e?.vendorId,
      vendorName: e?.vendorName,
      itemCode: e?.itemCode,
      itemName: e?.itemName,
      batchNo: e?.batchNo,
      quantity: e?.quantity,
      purchasePrice: e?.purchasePrice,
      reason: e?.reason,
      returnId: returnJobId?.includes('RN') ? returnJobId : null,
      currentStock: e?.availableUnits,
      expiryDate: e?.expiryDate || null,
    }))
    .filter(
      (item) =>
        item.itemCode !== null && item.itemName !== null && item.itemCode !== undefined && item.itemName !== undefined,
    );

  const itemListarray2 = rowData
    ?.map((e, index) => ({
      poNumber: e?.poNumber,
      vendorId: e?.vendorId,
      vendorName: e?.vendorName,
      itemCode: e?.itemCode,
      itemName: e?.itemName,
      batchNo: e?.batchNo,
      quantity: e?.quantity,
      purchasePrice: e?.purchasePrice,
      reason: e?.reason,
      currentStock: e?.availableUnits,
      expiryDate: e?.expiryDate || null,
    }))
    .filter(
      (item) =>
        item.itemCode !== null && item.itemName !== null && item.itemCode !== undefined && item.itemName !== undefined,
    );

  const filterPayload = {
    sourceOrgId: orgId,
    sourceLocId: locId,
    createdBy: uidx,
    userCreated: userName,
    refundMethod: refundMode,
    comments: comment,
    // status: returnJobId?.includes('RN') ? 'PENDING_APPROVAL' : 'DRAFT',
    vendorId: isVendorSelected ? vendorId : null,
    vendorName: isVendorSelected ? vendorDisplayName : null,
    returnJobType: isVendorSelected ? 'VENDOR_SPECIFIC' : 'OPEN_TO_VENDOR',
    transport: transport,
    returnMode: returnMode,

    // "modifiedOn": "2024-02-26T05:18:19.792Z",
    // "modifiedBy": "string",
    // "userModified": "string",
    // "voided": "string",
    // "voidedOn": "2024-02-26T05:18:19.792Z",
    // "voidedBy": "string",
    // "userVoided": "string",
    // "grossAmount": 0,
    // "eventStatus": "string",
    // "noOfReturns": 0,
    // "createdReturns": 0,
  };

  const update = (newRowData) => {
    return new Promise((resolve, reject) => {
      if (returnJobId) {
        const filteredData = itemListarray1.filter(
          (item) =>
            item.batchNo !== undefined &&
            item.batchNo !== null &&
            item.batchNo !== '' &&
            item.quantity !== undefined &&
            item.quantity !== null &&
            item.quantity !== '' &&
            item.reason !== undefined &&
            item.reason !== null &&
            item.reason !== '',
        );
        filterPayload.returnJobId = returnJobId?.includes('RN') ? allData?.returnJobId : returnJobId || null;
        filterPayload.returnJobItemList = filteredData;
        if (returnJobId?.includes('RN')) {
          filterPayload.returnId = returnJobId;
          updateInventoryReturn(filterPayload)
            .then((res) => {
              const response = res?.data?.data;
              if (response?.es) {
                showSnackbar(response?.message || 'Some error occurred', 'error');
                reject(response?.message || 'Some error occurred');
                return;
              }
              if (saveLoader) {
                setSaveLoader(false);
                resolve();
                return;
              } else {
                // fetchReturnItems(returnJobId);
                setIsItemChanged(false);
                getAllInventoryReturns(returnJobId)
                  .then((itemRes) => {
                    const dataResponse = itemRes?.data?.data;
                    if (dataResponse?.es) {
                      return;
                    }
                    setAllData(dataResponse?.returnDetails);
                    const itemList = dataResponse?.returnDetails?.returnJobItemList;
                    const updatedRowData = newRowData
                      ? newRowData?.map((row, index) => {
                          if (index < itemList?.length) {
                            if (row?.rjItemId === '' || row?.rjItemId === null) {
                              return {
                                ...row,
                                rjItemId: itemList[index]?.rjItemId,
                              };
                            }
                          }
                          return row;
                        })
                      : rowData?.map((row, index) => {
                          if (index < itemList?.length) {
                            if (row?.rjItemId === '' || row?.rjItemId === null) {
                              return {
                                ...row,
                                rjItemId: itemList[index]?.rjItemId,
                              };
                            }
                          }
                          return row;
                        });
                    setRowData(updatedRowData);
                  })
                  .catch((err) => {});
                resolve();
              }
            })
            .catch((err) => {
              setSaveLoader(false);
              showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
              reject(err);
            });
        } else {
          updateInventoryReturnJob(filterPayload)
            .then((res) => {
              const response = res?.data?.data;
              if (response?.es) {
                showSnackbar(response?.message || 'Some error occurred', 'error');
                reject(response?.message || 'Some error occurred');
                return;
              }
              if (saveLoader) {
                setSaveLoader(false);
                resolve();
                return;
              } else {
                // fetchAllReturnJobItems(returnJobId);
                setIsItemChanged(false);
                getAllInventoryReturnsJob(returnJobId)
                  .then((itemRes) => {
                    const dataResponse = itemRes?.data?.data;
                    if (dataResponse?.es) {
                      return;
                    }
                    setAllData(dataResponse?.returnJob);
                    const itemList = dataResponse?.returnJob?.returnJobItemList;
                    const updatedRowData = newRowData
                      ? newRowData?.map((row, index) => {
                          if (index < itemList?.length) {
                            if (row?.rjItemId === '' || row?.rjItemId === null) {
                              return {
                                ...row,
                                rjItemId: itemList[index]?.rjItemId,
                              };
                            }
                          }
                          return row;
                        })
                      : rowData?.map((row, index) => {
                          if (index < itemList?.length) {
                            if (row?.rjItemId === '' || row?.rjItemId === null) {
                              return {
                                ...row,
                                rjItemId: itemList[index]?.rjItemId,
                              };
                            }
                          }
                          return row;
                        });
                    setRowData(updatedRowData);
                  })
                  .catch((err) => {});
                resolve();
              }
            })
            .catch((err) => {
              setSaveLoader(false);
              showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
              reject(err);
            });
        }
      }
    });
  };

  const createNew = () => {
    const filteredData = itemListarray2.filter(
      (item) =>
        item.batchNo !== undefined &&
        item.batchNo !== null &&
        item.batchNo !== '' &&
        item.quantity !== undefined &&
        item.quantity !== null &&
        item.quantity !== '' &&
        item.reason !== undefined &&
        item.reason !== null &&
        item.reason !== '',
    );
    filterPayload.returnJobItemList = filteredData;
    createInventoryReturn(filterPayload)
      .then((res) => {
        const response = res?.data?.data;
        setSaveLoader(false);
        if (response?.es) {
          showSnackbar(response?.message || 'Some error occured', 'error');
          return;
        }
        if (returnJobId === '' || returnJobId === null) {
          setReturnJobId(response?.returnJobId);
          localStorage.setItem('returnJobId', response?.returnJobId);
        }
        fetchAllReturnJobItems(response?.returnJobId);
      })
      .catch((err) => {
        setSaveLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleDelete = () => {
    if (returnJobId?.includes('RN')) {
      showSnackbar('Cannot delete return', 'error');
      return;
    }
    setDeleteModal(true);
  };
  const updateDeleteStatus = () => {
    const statusPayload = {
      updatedByUser: uidx,
      userName: userName,
      comments: 'string',
      status: 'VOID',
    };
    setDeleteLoader(true);
    if (returnJobId?.includes('RN')) {
      statusPayload.returnId = returnJobId;
      inventoryReturnStateChange(statusPayload)
        .then((res) => {
          setDeleteLoader(false);
          if (res?.data?.data?.es) {
            showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
            return;
          }
          setDeleteModal(false);
          handleCancel();
        })
        .catch((err) => {
          setDeleteLoader(false);
          showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        });
    } else {
      statusPayload.returnJobId = returnJobId;
      inventoryReturnStateChangeJob(statusPayload)
        .then((res) => {
          setDeleteLoader(false);
          if (res?.data?.data?.es) {
            showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
            return;
          }
          setDeleteModal(false);
          handleCancel();
        })
        .catch((err) => {
          setDeleteLoader(false);
          showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        });
    }
  };
  const handleSave = () => {
    update();
    setSaveLoader(true);
    handleCancel();
  };

  const handleSubmit = async () => {
    try {
      setSumbitLoader(true);
      await update();

      if (returnJobId?.includes('RN')) {
        handleCancel();
      } else {
        const payload = {
          returnJobId: returnJobId,
          uidx: uidx,
          userName: userName,
        };
        const res = await submitInventoryReturn(payload);

        const response = res?.data?.data;
        if (response?.es) {
          showSnackbar(response?.message || 'Some error occured while submit', 'error');
        } else {
          handleCancel();
        }
      }
      setSumbitLoader(false);
    } catch (err) {
      setSumbitLoader(false);
      showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('returnJobId');
    navigate('/purchase/purchase-returns');
  };

  const handlMainItem = (e) => {
    setMainItem(e.value);
    setTablevendorRows([]); // Clear existing rows when switching
    setGSTRows([]); // Reset GST rows

    if (e.value === 'Name' && gstRows?.length > 0) {
      loadVendorNameOption('', [], { page: 1 }); // Force reload for Name
    } else if (e.value === 'GST' && dataRows?.length > 0) {
      loadVendorGSTOption('', [], { page: 1 }); // Force reload for GST
    }
  };

  const handleBillingAddress = (e) => {
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

  function formatString(str) {
    return str
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const vendorSelected = (id) => {
    const payload = { vendorId: [id] };

    getAllVendorDetails(payload)
      .then((res) => {
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }

        const response = res?.data?.data?.object[0];
        setVendorId(response?.vendorId);
        setVendorGST(response?.gst);
        setVendorPAN(response?.pan);
        setVendorDisplayName(response?.displayName);
        setIsVendorSelected(true);

        const address =
          response?.addressList?.find((item) => item?.addressType === 'default') || response?.addressList?.[0];
        setVendoraddress(address);

        const hasReturns = response?.vendorReturn?.some((ele) => ele?.flag === true);
        setReturnReplacemnt(hasReturns);

        if (response?.purchaseTerms) {
          const purchaseTerms = response?.purchaseTerms
            ?.filter((ele) => ele?.flag)
            ?.map((ele) => formatString(ele?.paymentOption))
            ?.join(', ');
          setPurchaseTerms(purchaseTerms);
        }

        if (response?.purchaseMethods) {
          const purchaseMethods =
            response.purchaseMethods
              ?.filter((ele) => ele?.flag)
              ?.map((ele) => formatString(ele?.day))
              ?.join(', ') || 'NA';
          setPurchaseMethod(purchaseMethods);
        }

        if (response?.deliveryOptions?.length > 0) {
          const schedule = response.deliveryOptions[0]?.deliveryDays?.filter((ele) => ele?.day !== 'NONE');

          if (schedule?.length > 0) {
            const newDate = getNextDateWithFlagTrue(schedule);
            if (newDate) {
              const [year, month, day] = newDate.split('-');
              const formattedDate = `${parseInt(day)} ${month[parseInt(month) - 1]}, ${year}`;
              setExpectedDate(formattedDate);
            }
          }
        }

        additionalInfoPiDetails(id)
          .then((res) => {
            if (res?.data?.data?.es) {
              showSnackbar(res?.data?.data?.message, 'error');
              return;
            }
            setVendorData({
              debitNote: decimalPointFormatter(res?.data?.data?.debitNote),
              returnAmount: decimalPointFormatter(res?.data?.data?.returnAmount),
            });
          })
          .catch((err) => {
            showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
          });
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
      });
  };

  const [isFixed, setIsFixed] = useState(false);
  const softBoxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const softBoxTop = softBoxRef.current.getBoundingClientRect().top;
      setIsFixed(softBoxTop <= 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box className="main-box-pi-pre">
        <SoftBox mb={1} ml={0.5} p={3} display="flex" justifyContent="space-between" alignItems="center">
          <SoftTypography fontWeight="bold" fontSize="24px">
            New purchase return
          </SoftTypography>
          {rowData?.length > 0 && (
            <div>
              <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenu} />
            </div>
          )}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {[
              saveLoader ? (
                <Spinner size={20} key="preview-spinner" />
              ) : (
                <MenuItem onClick={handleSave} key="preview-menu-item">
                  Save as draft
                </MenuItem>
              ),
              returnJobId &&
                (deleteLoader ? (
                  <Spinner size={20} key="delete-spinner" />
                ) : (
                  <MenuItem onClick={handleDelete} key="delete-menu-item">
                    Delete
                  </MenuItem>
                )),
            ]}
          </Menu>
        </SoftBox>
        <SoftBox p={3} className="create-pi-card">
          {/* <Accordion expanded={isAccordionExpanded}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
            > */}
          {/* <AccordionDetails></AccordionDetails>
            </AccordionSummary> */}
          <Grid container spacing={3} mt={-2} direction="row" justifyContent="flex-start" sx={{ padding: '10px' }}>
            <Grid item xs={6} md={3.5} xl={3.5} mr={3}>
              <SoftTypography
                component="label"
                variant="caption"
                // fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
              >
                Search Vendor By
              </SoftTypography>
              {returnJobId ? (
                <Tooltip title="Return is in-progress, cannot select a new vendor (create new return to select vendor)">
                  <Box>
                    <SoftSelect
                      isDisabled
                      options={[
                        { value: 'Name', label: 'Name' },
                        { value: 'GST', label: 'GST' },
                      ]}
                    />
                  </Box>
                </Tooltip>
              ) : (
                <SoftSelect
                  options={[
                    { value: 'Name', label: 'Name' },
                    { value: 'GST', label: 'GST' },
                  ]}
                  onChange={(e) => handlMainItem(e)}
                />
              )}
            </Grid>
            {mainItem && (
              <Grid item xs={6} md={5} xl={5}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  // fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Select by {mainItem}
                </SoftTypography>
                {returnJobId ? (
                  <Tooltip title="Return is in-progress, cannot select a new vendor (create new return to select vendor)">
                    <Box>
                      {mainItem === 'Name' ? (
                        <SoftSelect value={subMainItem} options={dataRows} isDisabled />
                      ) : mainItem === 'GST' ? (
                        <SoftSelect value={subMainItem} options={gstRows} isDisabled />
                      ) : null}
                    </Box>
                  </Tooltip>
                ) : mainItem === 'Name' ? (
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
                    onChange={handleBillingAddress}
                    menuPortalTarget={document.body}
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
                    onChange={handleBillingAddress}
                    menuPortalTarget={document.body}
                  />
                ) : null}
                {/* {returnJobId ? (
                  <Tooltip title="Return is in-progress, cannot select a new vendor (create new return to select vendor)">
                    <Box>
                      {mainItem === 'Name' ? (
                        <SoftSelect value={subMainItem} options={dataRows} isDisabled />
                      ) : mainItem === 'GST' ? (
                        <SoftSelect value={subMainItem} options={gstRows} isDisabled />
                      ) : null}
                    </Box>
                  </Tooltip>
                ) : mainItem === 'Name' ? (
                  <SoftSelect value={subMainItem} options={dataRows} onChange={handleBillingAddress} />
                ) : mainItem === 'GST' ? (
                  <SoftSelect value={subMainItem} options={gstRows} onChange={handleBillingAddress} />
                ) : null} */}
              </Grid>
            )}
            {vendorId ? (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Grid container spacing={3} mt={-2} direction="row" justifyContent="flex-start">
                  <Grid item xs={12} sm={3.5} md={3.5} lg={3.5} mr={3}>
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      Transport
                    </SoftTypography>
                    <SoftSelect
                      options={transportOptions}
                      value={transportOptions?.find((ele) => ele?.value === transport) || ''}
                      onChange={(option) => setTransport(option.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5} md={5} lg={5}>
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      Return Mode
                    </SoftTypography>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: '10px',
                        gap: '10px',
                        // marginTop: '-10px',
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
                          name="returnMode"
                          value="vendorPickup"
                          checked={returnMode === 'vendorPickup'}
                          onChange={(e) => setReturnMode(e.target.value)}
                          style={{ cursor: 'pointer' }}
                        />
                        <SoftTypography mr={1} fontSize="13px" fontWeight="medium">
                          Vendor pick-up
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
                          name="returnMode"
                          value="dropOff"
                          checked={returnMode === 'dropOff'}
                          onChange={(e) => setReturnMode(e.target.value)}
                          style={{ cursor: 'pointer' }}
                        />
                        <SoftTypography mr={1} fontSize="13px" fontWeight="medium">
                          Drop-off at vendor location
                        </SoftTypography>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
            {/* <Grid item xs={12} md={12} xl={12}>
                {returnJobId && (
                  <SoftTypography fontSize="small" style={{ color: 'red' }}>
                    * Return is in-progress, cannot select a new vendor (create new return to select vendor)
                  </SoftTypography>
                )}
              </Grid> */}
            {vendorId && (
              <Grid item xs={12} md={12} xl={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={3.5} xl={3.5} mr={3}>
                    {returnMode === 'dropOff' ? (
                      <>
                        <div>
                          <span className="po-address-title" style={{ marginLeft: '10px' }}>
                            Vendor address
                          </span>
                        </div>
                        <div className="component-bg-br-sh-p" style={{ maxHeight: '230px', overflowY: 'scroll' }}>
                          <div className="address-main-container" style={{ width: '90%', marginTop: '-10px' }}>
                            <div className="address-line-container">
                              <span className="po-address-font">
                                <b>Vendor Name:</b> {vendorDisplayName}
                              </span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">
                                <b>GST:</b> {vendorGST}
                              </span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">
                                <b>PAN:</b> {vendorPAN}
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
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="po-address-title" style={{ marginLeft: '10px' }}>
                            Vendor Details
                          </span>
                        </div>
                        <div className="component-bg-br-sh-p" style={{ maxHeight: '230px', overflowY: 'scroll' }}>
                          <div className="address-main-container" style={{ width: '90%', marginTop: '-10px' }}>
                            <div className="address-line-container">
                              <span className="po-address-font">
                                <b>Vendor Name: </b> {vendorDisplayName}
                              </span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">
                                <b>GST:</b> {vendorGST}
                              </span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">
                                <b>PAN:</b> {vendorPAN}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </Grid>
                  <Grid item xs={12} md={8} xl={8}>
                    <Grid container spacing={2} direction="row" justifyContent="flex-start">
                      <Grid item xs={12} md={12} lg={12}>
                        <div>
                          <span className="po-address-title">Terms of trade</span>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={4} lg={4}>
                        <div className="po-address-title">Expected pick-up date</div>
                        <div className="vendor-data-names">{expectedDate || 'NA'}</div>
                      </Grid>
                      <Grid item xs={12} md={4} lg={4}>
                        <Tooltip title={purchaseTerms || 'NA'}>
                          <div className="po-address-title">Purchase terms</div>
                          <div className="vendor-data-names">{purchaseTerms || 'NA'}</div>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} md={4} lg={4}>
                        <div className="po-address-title">Purchase method</div>
                        <div className="vendor-data-names">{purchaseMethod || 'NA'}</div>
                      </Grid>
                      <Grid item xs={12} md={4} lg={4}>
                        <div className="po-address-title">Returns & replacement</div>
                        <div className="vendor-data-names">{returnAndReplacement ? 'Yes' : 'No'}</div>
                      </Grid>
                      <Grid item xs={12} md={4} lg={4}>
                        <div className="po-address-title">Open debit note</div>
                        <div className="vendor-data-names">{`₹ ${vendorData?.debitNote || 0}`}</div>
                      </Grid>
                      <Grid item xs={12} md={4} lg={4}>
                        <div className="po-address-title">Open returns</div>
                        <div className="vendor-data-names">{`₹ ${vendorData?.returnAmount || 0}`}</div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
          {/* </Accordion> */}
        </SoftBox>

        <SoftBox
          p={3}
          className="create-pi-card"
          ref={softBoxRef}
          style={{
            // height: '105px',
            padding: '20px 20px 10px 20px',
            position: isFixed ? 'sticky' : 'static',
            top: isFixed ? 0 : 'auto',
            // width: isFixed ? '100%' : '100%',
            zIndex: isFixed ? 1100 : 'auto',
          }}
        >
          <SoftBox display="flex" gap="30px" justifyContent="flex-start">
            <SoftTypography variant="h6" mb={1}>
              Add products to your return
              {rowData?.length > 1 && ` (Total Item: ${rowData?.length})`}
            </SoftTypography>
            {listDisplay && returnJobId && (
              <SoftBox>
                <Spinner size={20} />
              </SoftBox>
            )}
          </SoftBox>
          {rowData?.length > 0 && (
            <SoftBox style={{ overflowX: 'scroll', overflowY: 'hidden', maxHeight: '65px' }}>
              <div
                style={{
                  overflowX: 'scroll',
                  minWidth: '1047px',
                }}
              >
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th className="express-grn-columns">S.No</th>
                        <th className="express-grn-barcode-column">Barcode</th>
                        <th className="express-grn-barcode-column">Title</th>
                        <th className="express-grn-columns">Batch No</th>
                        <th className="express-grn-columns">Current Stk</th>
                        <th className="express-grn-columns">P.P.</th>
                        <th className="express-grn-columns">Quantity</th>
                        <th className="express-grn-columns">Total</th>
                        <th className="express-grn-vendor-column">Reason</th>
                        {/* <th className="express-grn-columns">Prev PP</th>
                            <th className="express-grn-columns">Aval Stock</th> */}
                        <th className="express-grn-columns">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="express-grn-rows">
                          <SoftBox className="grn-body-row-boxes">
                            <SoftInput value="S.No" readOnly={true} />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox className="express-grn-product-box">
                            <TextField value="Barcode" readOnly={true} style={{ width: '100%' }} />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox className="express-grn-product-box">
                            <TextField value="Title" readOnly={true} style={{ width: '100%' }} />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput value="Batch No" readOnly={true} />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput value="Aval Qty" readOnly={true} />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput value="P.P." readOnly={true} />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput value="Qty" readOnly={true} />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox className="grn-body-row-boxes-1">
                            <SoftInput value="Total" readOnly={true} />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox className="express-grn-product-box">
                            <SoftSelect />
                          </SoftBox>
                        </td>
                        {/* <td className="express-grn-rows">
                              <SoftBox className="grn-body-row-boxes-1">
                                <SoftInput value="Aval Stock" readOnly={true} />
                              </SoftBox>
                            </td>
                            <td className="express-grn-rows">
                              <SoftBox className="grn-body-row-boxes-1">
                                <SoftInput value="P.P." readOnly={true} />
                              </SoftBox>
                            </td> */}
                        <td className="express-grn-rows">
                          <SoftBox className="grn-body-row-boxes-1">
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <CancelIcon color="error" style={{ cursor: 'pointer', fontSize: '20px' }} />
                            </div>
                          </SoftBox>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </SoftBox>
          )}
        </SoftBox>

        <SoftBox p={3} className="create-pi-card">
          <PurchaseReturnProductList
            itemarray={itemarray}
            rowData={rowData}
            setRowData={setRowData}
            isItemChanged={isItemChanged}
            setIsItemChanged={setIsItemChanged}
            returnJobId={returnJobId}
            createNew={createNew}
            update={update}
            setListDisplay={setListDisplay}
            vendorId={vendorId}
            vendorDisplayName={vendorDisplayName}
            isVendorSelected={isVendorSelected}
          />
        </SoftBox>
        <SoftBox p={3} className="create-pi-card">
          <Grid container spacing={3} justifyContent="space-between">
            <Grid item xs={12} md={6} xl={6} sx={{ marginTop: '-30px' }}>
              <SoftBox className="textarea-box">
                <SoftTypography fontSize="15px" fontWeight="bold">
                  {' '}
                  Return Notes
                </SoftTypography>
              </SoftBox>
              <SoftBox style={{ marginTop: '10px' }}>
                <TextareaAutosize
                  defaultValue={comment}
                  onChange={(e) => setComment(e.target.value)}
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Will be displayed on return"
                  className="add-pi-textarea"
                />
              </SoftBox>
            </Grid>
            <SalesBillingDetailRow billingItems={billingItems} />
            <Grid item xs={12} md={6} xl={6}></Grid>
            <Grid item xs={12} md={6} xl={6}>
              <SoftBox className="add-po-btns" style={{ gap: '10px' }}>
                {/* <SoftButton
                  variant={buttonStyles.secondaryVariant}
                  className="outlined-softbutton"
                  onClick={handleCancel}
                >
                  Cancel{' '}
                </SoftButton> */}
                <SoftButton
                  variant={buttonStyles.secondaryVariant}
                  className="outlined-softbutton"
                  onClick={() => navigate('/purchase/purchase-returns')}
                >
                  Cancel{' '}
                </SoftButton>

                {/* <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton vendor-add-btn"
                  onClick={handleSave}
                  disabled={saveLoader ? true : false}
                >
                  {saveLoader ? <CircularProgress size={20} /> : <>Save</>}
                </SoftButton> */}
                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton vendor-add-btn"
                  onClick={handleSubmit}
                  disabled={submitLoader && !returnJobId ? true : false}
                >
                  {submitLoader ? <CircularProgress size={20} /> : <>Save</>}
                </SoftButton>
              </SoftBox>
              <Modal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="pi-approve-menu">
                  <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                    Are you sure you want to delete this.
                  </SoftTypography>
                  <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                    <SoftButton className="vendor-second-btn" onClick={() => setDeleteModal(false)}>
                      Cancel
                    </SoftButton>
                    <SoftButton
                      variant={buttonStyles.primaryVariant}
                      className="contained-softbutton vendor-add-btn"
                      onClick={updateDeleteStatus}
                      disabled={deleteLoader ? true : false}
                    >
                      {deleteLoader ? <CircularProgress size={20} /> : <>Delete</>}
                    </SoftButton>
                  </SoftBox>
                </Box>
              </Modal>
            </Grid>
          </Grid>
        </SoftBox>
      </Box>
    </DashboardLayout>
  );
};

export default NewPurchaseReturn;
