import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  InputLabel,
  Modal,
  Radio,
  RadioGroup,
} from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import {
  autoSaveVendorDetails,
  fetchVendorTot,
  getAllBrands,
  getAllManufacturerV2,
  getAllSubBrands,
  getGlobalProducts,
  getVendorDraftDetails,
} from '../../../../../config/Services';
import {
  getVendorDraftCode,
  getVendorIsBrandDraft,
  getVendorIsDraft,
  getVendorOverviewPayload,
  setIsBrandsDraft,
  setVendorAutoSaveTime,
  setVendorBrandPayload,
} from '../../../../../datamanagement/vendorPayloadSlice';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import './addBrand.css';
import SoftTypography from '../../../../../components/SoftTypography';
import SoftAsyncPaginate from '../../../../../components/SoftSelect/SoftAsyncPaginate';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  //   width: 400,
  maxHeight: '450px',
  bgcolor: 'background.paper',
  border: '1px solid gray',
  borderRadius: '10px',
  boxShadow: 14,
  p: 4,
  overflow: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};
const AddBrandsforVendor = ({ handleTab }) => {
  const navigate = useNavigate();
  const isBrandDraft = useSelector(getVendorIsBrandDraft);
  const isDraft = useSelector(getVendorIsDraft);

  const dispatch = useDispatch();
  const vendorDraftCode = useSelector(getVendorDraftCode) || localStorage.getItem('vendorDraftCode');
  const vendorOverviewPayload = useSelector(getVendorOverviewPayload);

  const showSnackbar = useSnackbar();
  const accountId = localStorage.getItem('AppAccountId');
  const { editVendorId } = useParams();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const appAccountId = localStorage.getItem('AppAccountId');
  const [brandList, setBrandList] = useState([]);
  const [subBrandList, setSubBrandList] = useState([]);
  const [manufacturerOptions, setManufactureOptions] = useState([]);
  const [rowCount, setRowCount] = useState(1);
  const vendorId = localStorage.getItem('vendorId');
  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const user_name = localStorage.getItem('user_name');
  const [open, setOpen] = React.useState(Array.from({ length: rowCount }).map(() => false));
  const [totIds, setTotIds] = useState([]);
  const [configData, setConfigData] = useState({});
  const handleOpen = (index) => {
    const newOpen = [...open];
    newOpen[index] = true;
    setOpen(newOpen);
  };

  const handleClose = (index) => {
    const newOpen = [...open];
    newOpen[index] = false;
    setOpen(newOpen);
  };

  const [brandRowTotData, setBrandRowTotData] = useState({
    brand: [],
    subBrand: [],
    manufacturer: [],
    purchaseMargin: [],
    salesTarget: [],
    marginsOnTarget: [],
    targetFrequency: [],
    targetOption: [],
    premiumOption: [],
    targetOnAllProducts: [],
    premiumOnAllProducts: [],
    premiumRackMargin: [],
  });

  const handleDeleteRow = (index) => {
    setBrandRowTotData((prevState) => {
      // Use the map function to create a new object with updated arrays
      const newState = Object.fromEntries(
        Object.entries(prevState).map(([key, value]) => [key, value.filter((_, i) => i !== index)]),
      );
      return newState;
    });
    setRowCount(rowCount - 1);
  };
  // fetching draft vendor details
  useEffect(() => {
    let fetchDraft = false;
    if (location.pathname === '/purchase/add-vendor') {
      fetchDraft = vendorDraftCode;
    } else {
      fetchDraft = vendorDraftCode && isBrandDraft;
    }
    getVendorDraftDetails(vendorDraftCode)
      .then((res) => {
        const totData = res?.data?.data?.object?.config?.vendorBrandPayload;
        setConfigData(res?.data?.data?.object?.config || {});
        if (totData && fetchDraft) {
          setRowCount(totData?.length || 1);
          // const totIdData = totData?.map((item) => item?.totId);
          // setTotIds(totIdData);
          const fetchBrandData = totData?.map((item) => ({
            value: item?.entityId,
            label: item?.entityName,
          }));

          const subBrandData = totData?.flatMap((item) => item?.dependents?.subBrand || []);
          const manufactureData = totData?.flatMap((item) => item?.dependents?.manufacturer || []);
          const purchaseMarginData = totData?.map((item) => item?.margin || '');
          const marginOnTargetData = totData?.map((item) => item?.marginOnTarget || '');
          const salesTarget = totData?.map((item) => item?.target || '');
          const targetFrequencyData = totData?.map((item) => ({
            value: item?.targetFrequency,
            label: `${item?.targetFrequency} months`,
          }));
          setBrandRowTotData((prevState) => ({
            ...prevState,
            brand: [...prevState?.brand, ...(fetchBrandData || [])],
            subBrand: [...prevState?.subBrand, ...(subBrandData || [])],
            manufacturer: [...prevState?.manufacturer, ...(manufactureData || [])],
            purchaseMargin: [...prevState?.purchaseMargin, ...(purchaseMarginData || [])],
            targetFrequency: [...prevState?.targetFrequency, ...(targetFrequencyData || [])],
            marginsOnTarget: [...prevState?.marginsOnTarget, ...(marginOnTargetData || [])],
            salesTarget: [...prevState?.salesTarget, ...(salesTarget || [])],
          }));
          const timeStamp = res?.data?.data?.object?.updated || res?.data?.data?.object?.created;
          const givenMoment = moment.utc(timeStamp);
          dispatch(setVendorAutoSaveTime(givenMoment.toISOString()));
        }
      })
      .catch(() => {});
  }, []);

  // fetching vendor and edit
  useEffect(() => {
    const fetchEdit = editVendorId && !isBrandDraft;
    if (fetchEdit) {
      fetchVendorTot(accountId, editVendorId)
        .then((res) => {
          const totData = res?.data?.data?.data;
          setRowCount(totData?.length || 1);
          const totIdData = totData?.map((item) => item?.totId);
          setTotIds(totIdData);
          const fetchBrandData = totData?.map((item) => ({
            value: item?.entityId,
            label: item?.entityName,
          }));

          const subBrandData = totData?.flatMap((item) => item?.dependents?.subBrand || []);
          const manufactureData = totData?.flatMap((item) => item?.dependents?.manufacturer || []);
          const purchaseMarginData = totData?.map((item) => item?.margin || '');
          const marginOnTargetData = totData?.map((item) => item?.marginOnTarget || '');
          const salesTarget = totData?.map((item) => item?.salesTarget || '');
          const targetFrequencyData = totData?.map((item) => ({
            value: item?.targetFrequency,
            label: `${item?.targetFrequency} months`,
          }));
          setBrandRowTotData((prevState) => ({
            ...prevState,
            brand: [...prevState?.brand, ...(fetchBrandData || [])],
            subBrand: [...prevState?.subBrand, ...(subBrandData || [])],
            manufacturer: [...prevState?.manufacturer, ...(manufactureData || [])],
            purchaseMargin: [...prevState?.purchaseMargin, ...(purchaseMarginData || [])],
            targetFrequency: [...prevState?.targetFrequency, ...(targetFrequencyData || [])],
            marginsOnTarget: [...prevState?.marginsOnTarget, ...(marginOnTargetData || [])],
            salesTarget: [...prevState?.salesTarget, ...(salesTarget || [])],
          }));
        })
        .catch(() => {});
    }
  }, [editVendorId]);

  const handleEditTot = (entity) => {
    if (editVendorId) {
      const data = brandRowTotData?.brand?.map((item, index) => ({
        totId: totIds[index] || null,
        orgId: orgId,
        locId: locId,
        accountId: appAccountId,
        vendorId: editVendorId || 'NA',
        entityId: item?.value,
        entityName: item?.label,
        entityType: 'BRAND',
        margin: brandRowTotData?.purchaseMargin[index] ? brandRowTotData?.purchaseMargin[index] : [],
        marginType: 'FLAT_OFF',
        dependents: {
          subBrand: brandRowTotData?.subBrand[index]
            ? [
                {
                  label: brandRowTotData?.subBrand[index]?.label || null,
                  value: brandRowTotData?.subBrand[index]?.value || null,
                },
              ]
            : [],
          manufacturer: brandRowTotData?.manufacturer[index]
            ? [
                {
                  label: brandRowTotData?.manufacturer[index]?.label || null,
                  value: brandRowTotData?.manufacturer[index]?.value || null,
                },
              ]
            : [],
        },
        target: brandRowTotData?.salesTarget[index] ? brandRowTotData?.salesTarget[index] : null,
        targetFrequency: brandRowTotData?.targetFrequency[index]
          ? brandRowTotData?.targetFrequency[index]?.value
          : null,
        marginOnTarget: brandRowTotData?.marginsOnTarget[index] ? brandRowTotData?.marginsOnTarget[index] : null,
        targetOption: brandRowTotData?.targetOption[index] ? brandRowTotData?.targetOption[index] : null,
        premiumOption: brandRowTotData?.premiumOption[index] ? brandRowTotData?.premiumOption[index] : null,
        targetOnAllProducts: brandRowTotData?.targetOnAllProducts[index]
          ? brandRowTotData?.targetOnAllProducts[index]
          : false,
        premiumOnAllProducts: brandRowTotData?.premiumOnAllProducts[index]
          ? brandRowTotData?.premiumOnAllProducts[index]
          : false,
        premiumRackMargin: brandRowTotData?.premiumRackMargin[index] ? brandRowTotData?.premiumRackMargin[index] : null,
        notes: 'string',
        isOrganisationEnabled: true,
        totStatus: 'ACTIVE',
        updatedBy: createdById,
      }));

      dispatch(setVendorBrandPayload(data));
      const autoSavePayload = {
        // id: 0,
        // code: 'string',
        config: { ...(configData || {}), vendorBrandPayload: data },

        createdBy: createdById,
        createdByName: user_name,
      };
      if (vendorDraftCode) {
        autoSavePayload.code = vendorDraftCode;
      }
      autoSaveVendorDetails(autoSavePayload)
        .then((res) => {
          handleTab(2);
          dispatch(setIsBrandsDraft(true));
        })

        .catch(() => {});
      // updateVendorTot(data)
      //   .then((res) => {
      //     handleTab(2);
      //   })
      //   .catch(() => {});
    }
  };

  const handleCreateTot = (entity) => {
    // if (!vendorId) {
    //   showSnackbar('Vendor Id not found', 'error');
    //   return;
    // }
    const payload = brandRowTotData?.brand?.map((item, index) => ({
      orgId: orgId,
      locId: locId,
      accountId: appAccountId,
      vendorId: vendorId || 'NA',
      entityId: item?.value,
      entityName: item?.label,
      entityType: 'BRAND',
      margin: brandRowTotData?.purchaseMargin[index] ? brandRowTotData?.purchaseMargin[index] : [],
      marginType: 'FLAT_OFF',
      dependents: {
        subBrand: brandRowTotData?.subBrand[index]
          ? [
              {
                label: brandRowTotData?.subBrand[index]?.label || null,
                value: brandRowTotData?.subBrand[index]?.value || null,
              },
            ]
          : [],
        manufacturer: brandRowTotData?.manufacturer[index]
          ? [
              {
                label: brandRowTotData?.manufacturer[index]?.label || '',
                value: brandRowTotData?.manufacturer[index]?.value || '',
              },
            ]
          : [],
        // "additionalProp2": [
        //   "string"
        // ],
        // "additionalProp3": [
        //   "string"
        // ]
      },
      target: brandRowTotData?.salesTarget[index] ? brandRowTotData?.salesTarget[index] : null,
      targetFrequency: brandRowTotData?.targetFrequency[index] ? brandRowTotData?.targetFrequency[index]?.value : null,
      marginOnTarget: brandRowTotData?.marginsOnTarget[index] ? brandRowTotData?.marginsOnTarget[index] : null,
      targetOption: 'INCLUDE_AS_PART_OF_PURCHASE',
      premiumOption: 'INCLUDE_AS_PART_OF_PURCHASE',
      targetOnAllProducts: true,
      premiumOnAllProducts: true,
      premiumRackMargin: 'string',
      notes: 'string',
      isOrganisationEnabled: true,
      totStatus: 'ACTIVE',
      createdBy: createdById,
    }));
    dispatch(setVendorBrandPayload(payload));
    const autoSavePayload = {
      // id: 0,
      // code: 'string',
      config: { ...(configData || {}), vendorBrandPayload: payload },

      createdBy: createdById,
      createdByName: user_name,
    };
    if (vendorDraftCode) {
      autoSavePayload.code = vendorDraftCode;
    }
    autoSaveVendorDetails(autoSavePayload)
      .then((res) => {
        handleTab(2);
      })

      .catch(() => {});

    // createTotHo(payload)
    //   .then((res) => {
    //     handleTab(2);
    //   })
    //   .catch(() => {});
  };

  const handleNext = () => {
    if (editVendorId) {
      handleEditTot();
    } else {
      handleCreateTot();
    }
  };

  const handleFetchBrandProducts = () => {
    const payload = {};

    getGlobalProducts(payload)
      .then((res) => {
        console.log(res?.data?.data);
      })
      .catch((err) => {});
  };

  const loadBrandOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 10, // Adjust as necessary
      sourceId: [orgId],
      sourceLocationId: [locId],
      brandName: [searchQuery] || [], // If searchQuery exists, use it
      active: [true],
    };

    try {
      const res = await getAllBrands(payload);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message, 'error');
        return {
          options: [],
          hasMore: false,
        };
      } else {
        const data = res?.data?.data?.results || [];
        const options = data?.map((item) => ({
          label: item?.brandName,
          value: item?.brandId,
        }));
        return {
          options,
          hasMore: data?.length >= 10, // Check if there's more data to load
          additional: {
            page: page + 1, // Increment the page for the next fetch
          },
        };
      }
    } catch (error) {
      showSnackbar('Error while fetching brands', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };
  const loadSubBrandOptions = async (searchQuery, loadedOptions, { page }, index) => {
    if (!brandRowTotData?.brand[index]?.value) {
      return { options: [], hasMore: false };
    }
    const subBrandPayload = {
      sourceLocationId: [locId],
      brandId: [brandRowTotData?.brand[index]?.value],
      page: page,
      pageSize: 50,
      subBrandName: [searchQuery] || [],
      active: [true],
      index, // Include index in the payload if needed
    };

    try {
      const res = await getAllSubBrands(subBrandPayload);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message, 'error');
        return {
          options: [],
          hasMore: false,
        };
      } else {
        const data = res?.data?.data?.results || [];
        const options = data?.map((item) => ({
          label: item?.subBrandName,
          value: item?.subBrandId,
        }));
        return {
          options,
          hasMore: data?.length >= 50, // Check if more data is available
          additional: {
            page: page + 1, // Increment page for next load
          },
        };
      }
    } catch (error) {
      showSnackbar('Error while fetching sub-brands', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const loadManufactureOptions = async (searchQuery, loadedOptions, { page }) => {
    const paylaod = {
      sourceId: [orgId],
      sourceLocationId: [locId],
      page: page,
      pageSize: 50,
      manufacturerName: [searchQuery] || [],
      active: [true],
    };

    try {
      const res = await getAllManufacturerV2(paylaod);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message, 'error');
        return {
          options: [],
          hasMore: false,
        };
      } else {
        const data = res?.data?.data?.results || [];
        const options = data?.map((item) => ({
          label: item?.manufacturerName,
          value: item?.manufacturerId,
        }));
        return {
          options,
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

  return (
    <>
      {' '}
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          {/* <SoftTypography variant="label" className="label-heading-brands">
            Terms of Trade
          </SoftTypography> */}
          <Card className="addbrand-Box" style={{ zIndex: '0 !important' }}>
            {Array.from({ length: rowCount }).map((_, index) => (
              <>
                <div>
                  <Modal
                    keepMounted
                    open={open[index]}
                    onClose={() => handleClose(index)}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                    sx={{
                      '& > .MuiBackdrop-root': {
                        backdropFilter: 'blur(5px)',
                      },
                    }}
                  >
                    <Box sx={style}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <div>
                          <label htmlFor="scheduleYes" className="brandslabelStyle">
                            Sales Target
                          </label>
                          <SoftInput
                            size="small"
                            value={brandRowTotData?.salesTarget[index]}
                            placeholder="enter sales target"
                            onChange={(e) => {
                              const value = e.target.value;
                              setBrandRowTotData((prevState) => ({
                                ...prevState,
                                salesTarget: [
                                  ...prevState.salesTarget.slice(0, index),
                                  value,
                                  ...prevState.salesTarget.slice(index + 1),
                                ],
                              }));
                            }}
                          />
                        </div>
                        <div>
                          <label htmlFor="scheduleYes" className="brandslabelStyle">
                            Margins on target
                          </label>
                          <SoftInput
                            size="small"
                            value={brandRowTotData?.marginsOnTarget[index]}
                            placeholder="enter margin"
                            onChange={(e) => {
                              const value = e.target.value;
                              setBrandRowTotData((prevState) => ({
                                ...prevState,
                                marginsOnTarget: [
                                  ...prevState.marginsOnTarget.slice(0, index),
                                  value,
                                  ...prevState.marginsOnTarget.slice(index + 1),
                                ],
                              }));
                            }}
                            icon={{
                              component: 'percentage',
                              direction: 'right',
                            }}
                          />
                        </div>
                        <div>
                          <label htmlFor="scheduleYes" className="brandslabelStyle">
                            Target frequency
                          </label>
                          <SoftSelect
                            size="small"
                            value={brandRowTotData?.targetFrequency[index]}
                            onChange={(e) => {
                              const value = e;
                              setBrandRowTotData((prevState) => ({
                                ...prevState,
                                targetFrequency: [
                                  ...prevState.targetFrequency.slice(0, index),
                                  value,
                                  ...prevState.targetFrequency.slice(index + 1),
                                ],
                              }));
                            }}
                            // menuPortalTarget={document.body}
                            id="status"
                            placeholder="select Target Frequency"
                            options={[
                              { value: '1', label: '1 Month' },
                              { value: '2', label: '2 Months' },
                              { value: '3', label: '3 Months' },
                              { value: '4', label: '4 Months' },
                              { value: '5', label: '5 Months' },
                              { value: '6', label: '6 Months' },
                              { value: '7', label: '7 Months' },
                              { value: '8', label: '8 Months' },
                              { value: '9', label: '9 Months' },
                              { value: '10', label: '10 Months' },
                              { value: '11', label: '11 Months' },
                              { value: '12', label: '1 Year' },
                              { value: '13', label: '1 Year, 1 Month' },
                              { value: '14', label: '1 Year, 2 Months' },
                              { value: '15', label: '1 Year, 3 Months' },
                              { value: '16', label: '1 Year, 4 Months' },
                              { value: '17', label: '1 Year, 5 Months' },
                              { value: '18', label: '1 Year, 6 Months' },
                              { value: '19', label: '1 Year, 7 Months' },
                              { value: '20', label: '1 Year, 8 Months' },
                              { value: '21', label: '1 Year, 9 Months' },
                              { value: '22', label: '1 Year, 10 Months' },
                              { value: '23', label: '1 Year, 11 Months' },
                              { value: '24', label: '2 Years' },
                            ]}
                          ></SoftSelect>
                        </div>
                      </div>
                      <div style={{ marginTop: '15px' }}>
                        <div>
                          <RadioGroup
                            name="deliveryMethods"
                            defaultValue="CENTRALIZED"
                            // value={deliveryMethod}
                            // onChange={handleDeliveryMethodChange}
                            // row
                            value={brandRowTotData?.targetOption[index]}
                            placeholder=""
                            onChange={(e) => {
                              const value = e.target.value;
                              setBrandRowTotData((prevState) => ({
                                ...prevState,
                                targetOption: [
                                  ...prevState.targetOption.slice(0, index),
                                  value,
                                  ...prevState.targetOption.slice(index + 1),
                                ],
                              }));
                            }}
                          >
                            <FormControlLabel
                              value="INCLUDE_AS_PART_OF_PURCHASE"
                              label="Include as part of purchase"
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontWeight: 'normal',
                                },
                              }}
                              control={<Radio />}
                            />
                            <FormControlLabel
                              value="PAYABLE_AS_CREDIT_NOTE"
                              label="Payable as credit note"
                              control={<Radio />}
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontWeight: 'normal',
                                },
                                marginTop: '-12px',
                              }}
                            />
                          </RadioGroup>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <Checkbox
                            checked={brandRowTotData?.targetOnAllProducts[index]}
                            placeholder=""
                            onChange={(e) => {
                              const value = e.target.checked;
                              setBrandRowTotData((prevState) => ({
                                ...prevState,
                                targetOnAllProducts: [
                                  ...prevState.targetOnAllProducts.slice(0, index),
                                  value,
                                  ...prevState.targetOnAllProducts.slice(index + 1),
                                ],
                              }));
                            }}
                          />
                          <SoftTypography fontSize="0.8rem" variant="caption">
                            Applicable on all products{' '}
                          </SoftTypography>
                          {brandRowTotData?.targetOnAllProducts[index] && (
                            <div>
                              <SoftSelect size="small"></SoftSelect>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ marginTop: '15px' }}>
                        <InputLabel
                          sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginBottom: '5px' }}
                        >
                          Margins on premium rack
                        </InputLabel>
                        <div style={{ maxWidth: '65%' }}>
                          <SoftInput
                            size="small"
                            icon={{
                              component: 'percentage',
                              direction: 'right',
                            }}
                            value={brandRowTotData?.premiumRackMargin[index]}
                            placeholder="enter margin"
                            onChange={(e) => {
                              const value = e.target.value;
                              setBrandRowTotData((prevState) => ({
                                ...prevState,
                                premiumRackMargin: [
                                  ...prevState.premiumRackMargin.slice(0, index),
                                  value,
                                  ...prevState.premiumRackMargin.slice(index + 1),
                                ],
                              }));
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div>
                          <RadioGroup
                            name="deliveryMethods"
                            defaultValue="CENTRALIZED"
                            // value={deliveryMethod}
                            // onChange={handleDeliveryMethodChange}
                            // row
                            value={brandRowTotData?.premiumOption[index]}
                            placeholder=""
                            onChange={(e) => {
                              const value = e.target.value;
                              setBrandRowTotData((prevState) => ({
                                ...prevState,
                                premiumOption: [
                                  ...prevState.premiumOption.slice(0, index),
                                  value,
                                  ...prevState.premiumOption.slice(index + 1),
                                ],
                              }));
                            }}
                          >
                            <FormControlLabel
                              value="INCLUDE_AS_PART_OF_PURCHASE"
                              label="Include as part of purchase"
                              sx={{
                                '& .MuiFormControlLabel-lacbel': {
                                  fontWeight: 'normal',
                                },
                              }}
                              control={<Radio />}
                            />
                            <FormControlLabel
                              value="PAYABLE_AS_CREDIT_NOTE"
                              label="Payable as credit note"
                              control={<Radio />}
                              sx={{
                                '& .MuiFormControlLabel-label': {
                                  fontWeight: 'normal',
                                },
                                marginTop: '-12px',
                              }}
                            />
                          </RadioGroup>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <Checkbox
                            checked={brandRowTotData?.premiumOnAllProducts[index]}
                            placeholder=""
                            onChange={(e) => {
                              const value = e.target.checked;
                              setBrandRowTotData((prevState) => ({
                                ...prevState,
                                premiumOnAllProducts: [
                                  ...prevState.premiumOnAllProducts.slice(0, index),
                                  value,
                                  ...prevState.premiumOnAllProducts.slice(index + 1),
                                ],
                              }));
                            }}
                          />
                          <SoftTypography fontSize="0.8rem" variant="caption">
                            Applicable on all products{' '}
                          </SoftTypography>
                          {brandRowTotData?.premiumOnAllProducts[index] && <SoftSelect size="small"></SoftSelect>}
                        </div>
                      </div>
                      <SoftBox className="form-button-customer-vendor" mt={2}>
                        <SoftButton size="small" className="vendor-second-btn" onClick={() => handleClose(index)}>
                          Cancel
                        </SoftButton>
                        <SoftButton size="small" className="vendor-add-btn" onClick={() => handleClose(index)}>
                          Save
                        </SoftButton>
                      </SoftBox>
                    </Box>
                  </Modal>
                </div>
                <Grid container spacing={2} style={{ marginTop: '0px' }} key={index}>
                  <Grid item xs={12} md={3}>
                    {index === 0 && (
                      <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                        Brand{' '}
                      </SoftTypography>
                    )}
                    <SoftAsyncPaginate
                      className="select-box-category"
                      placeholder="Select brand..."
                      value={brandRowTotData?.brand[index]}
                      loadOptions={loadBrandOptions}
                      additional={{
                        page: 1,
                      }}
                      isClearable
                      size="small"
                      onChange={(e) => {
                        const value = e;
                        setBrandRowTotData((prevState) => ({
                          ...prevState,
                          brand: [...prevState.brand.slice(0, index), value, ...prevState.brand.slice(index + 1)],
                        }));
                      }}
                      menuPortalTarget={document.body}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    {index === 0 && (
                      <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                        Sub-Brand
                      </SoftTypography>
                    )}
                    <SoftAsyncPaginate
                      size="small"
                      className="select-box-category"
                      placeholder="Select sub-brand..."
                      value={brandRowTotData?.subBrand[index]}
                      loadOptions={(searchQuery, loadedOptions, { page }) =>
                        loadSubBrandOptions(searchQuery, loadedOptions, { page }, index)
                      }
                      additional={{
                        page: 1,
                      }}
                      isClearable
                      onChange={(e) => {
                        const value = e;
                        setBrandRowTotData((prevState) => ({
                          ...prevState,
                          subBrand: [
                            ...prevState.subBrand.slice(0, index),
                            value,
                            ...prevState.subBrand.slice(index + 1),
                          ],
                        }));
                      }}
                      menuPortalTarget={document.body}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    {index === 0 && (
                      <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                        Manufacturer
                      </SoftTypography>
                    )}
                    <SoftAsyncPaginate
                      className="select-box-category"
                      placeholder="Select manufacture..."
                      value={brandRowTotData?.manufacturer[index]}
                      loadOptions={loadManufactureOptions}
                      additional={{
                        page: 1,
                      }}
                      isClearable
                      size="small"
                      onChange={(e) => {
                        const value = e;
                        setBrandRowTotData((prevState) => ({
                          ...prevState,
                          manufacturer: [
                            ...prevState.manufacturer.slice(0, index),
                            value,
                            ...prevState.manufacturer.slice(index + 1),
                          ],
                        }));
                      }}
                      menuPortalTarget={document.body}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    {index === 0 && (
                      <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                        Purchase Margin
                      </SoftTypography>
                    )}
                    <SoftInput
                      size="small"
                      value={brandRowTotData?.purchaseMargin[index]}
                      onChange={(e) => {
                        const value = e.target.value;
                        setBrandRowTotData((prevState) => ({
                          ...prevState,
                          purchaseMargin: [
                            ...prevState.purchaseMargin.slice(0, index),
                            value,
                            ...prevState.purchaseMargin.slice(index + 1),
                          ],
                        }));
                      }}
                      icon={{
                        component: 'percentage',
                        direction: 'right',
                      }}
                    ></SoftInput>
                  </Grid>
                  <Grid item md={1} display="flex" gap="10px">
                    <SoftBox style={{ marginTop: index === 0 && '40px', cursor: 'pointer' }}>
                      <AddIcon sx={{ color: 'blue' }} onClick={() => handleOpen(index)} />
                    </SoftBox>
                    <SoftBox style={{ marginTop: index === 0 && '40px', cursor: 'pointer' }}>
                      <CloseIcon sx={{ color: 'red' }} onClick={() => handleDeleteRow(index)} />
                    </SoftBox>
                  </Grid>
                </Grid>
              </>
            ))}

            <Grid item xs={12}>
              <div>
                <Button onClick={() => setRowCount(rowCount + 1)}>+add more</Button>
              </div>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <SoftBox className="form-button-customer-vendor">
            <SoftButton className="vendor-second-btn" onClick={() => navigate('/purchase/vendors')}>
              Cancel
            </SoftButton>
            <SoftButton className="vendor-add-btn" onClick={handleNext}>
              Next
            </SoftButton>
          </SoftBox>
        </Grid>
      </Grid>
    </>
  );
};

export default AddBrandsforVendor;
