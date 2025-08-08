import { Card, Grid, InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import SoftTypography from '../../../../../../components/SoftTypography';
import './vendorTerms.css';

import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftSelect from '../../../../../../components/SoftSelect';
import Spinner from '../../../../../../components/Spinner';
import {
  updateDeliveryFullfillment,
  updateVendorReturns,
  vendorDeliveryFullFillmentById,
  vendorPaymentTermstById,
  vendorReturnAndReplacementById,
} from '../../../../../../config/Services';
import { textFormatter } from '../../../../Common/CommonFunction';
const VednorDetailsTerms = () => {
  const frequencyDays = ['NONE', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const userName = localStorage.getItem('user_name');
  const [fullFilmentLoader, setFullFillMentLoader] = useState(true);
  const [disableFullFilment, setDisableFullFillMent] = useState(false);
  const [PaymentTermsLoader, setPaymentTermsLoader] = useState(true);
  const [cardLoader, setCardLoader] = useState(true);
  const [disablepaymentTerms, setDisablePaymentTerms] = useState(false);
  const [vendorDeliveryId, setVendorDeliveryId] = useState('');
  const [returnsLoader, setReturnsLoader] = useState(true);
  const [disableReturns, setDisableReturns] = useState(false);

  const [deliveryFrequency, setdeliveryFrequency] = useState('');
  // const [deliveryDays, setdeliveryDays] = useState([]);
  const [orderRequestDays, setOrderRequestDays] = useState([]);
  const [payment, setPayment] = useState([]);
  const [purchaseTerms, setPurchaseTerms] = useState([]);
  const [servicableAreas, setServicableAreas] = useState([]);
  const [purchaseMethods, setPurchaseMethods] = useState([]);
  const [deliveryFullFillment, setDeliveryFullFillment] = useState([]);
  const [centralizedFullFillment, setCentralizedFullFillment] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [returnCheckBoxValue, setReturnCheckBoxValue] = useState({
    RETURN_ON_EXPIRY: false,
    RETURN_ON_DAMAGE: false,
    RETURN_ON_DEAD_STOCK: false,
  });
  const [subCategoryCheckBoxValue, setSubCategoryCheckBoxValue] = useState({
    RETURN_ON_EXPIRY: {
      PRODUCT_REPLACEMENT: false,
      REPLACEMENT_ON_OTHER_PRODUCT: false,
      MONEY_REFUNDS: false,
      CREDIT_NOTE: false,
    },
    RETURN_ON_DAMAGE: {
      PRODUCT_REPLACEMENT: false,
      REPLACEMENT_ON_OTHER_PRODUCT: false,
      MONEY_REFUNDS: false,
      CREDIT_NOTE: false,
    },
    RETURN_ON_DEAD_STOCK: {
      PRODUCT_REPLACEMENT: false,
      REPLACEMENT_ON_OTHER_PRODUCT: false,
      MONEY_REFUNDS: false,
      CREDIT_NOTE: false,
    },
  });
  const [selectedPaymentOptions, setSelectedPaymentOptions] = useState([]);
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState([]);
  const paymentOptions = [
    { label: 'Bank transfers', value: 'Bank transfers' },
    { label: 'Credit/Debit card', value: 'Credit/Debit card' },
    { label: 'Cash deposits', value: 'Cash deposits' },
    { label: 'Cheque', value: 'Cheque' },
  ];
  const purchaseOptions = [
    { label: 'Block purchase when credit limit exceeds', value: 'Block purchase when credit limit exceeds' },
    {
      label: 'Block purchase when outstanding exceeds credit days',
      value: 'Block purchase when outstanding exceeds credit days',
    },
  ];

  const { vendorId } = useParams();
  const navigate = useNavigate();
  const handleFetchDeliveryFullFilment = () => {
    if (vendorId) {
      setFullFillMentLoader(true);
      vendorDeliveryFullFillmentById(vendorId)
        .then((res) => {
          const data = res?.data?.data?.object;
          // console.log(data);
          const servicebaleArea = data?.serviceableAreas?.split('|');
          setServicableAreas(servicebaleArea || []);
          const purchaseMethodsData = data?.purchaseMethods
            .filter((dayObj) => dayObj.flag)
            .map((item) => item?.day || '');
          setPurchaseMethods(purchaseMethodsData || []);
          setVendorDeliveryId(data?.vendorDeliveryId);
          const deliveryOptions = data?.deliveryOptions;
          const centralizedOptions = data?.centralizedOptions;
          const deliveryDays = [];
          const centralizedDeliveryDays = [];
          const orderRequestData = [];
          const centralizedOrderRequestData = [];
          const deliveryFrequencyData = [];
          const centralizedDeliveryFrequency = [];
          const deliveryStoresData = [];
          const centralizedDeliveryStores = [];
          const deliveryLocationData = [];
          const deliveryDateData = [];
          const centralizedDeliveryDateData = [];
          const orderRequestDate = [];
          const centralizedOrderRequestDate = [];
          deliveryOptions?.map((item, index) => {
            const filteredData = item?.deliveryDays.filter((item) => item.flag).map((item) => item.day);
            deliveryDays[index] = filteredData;
            const filteredOrderData = item?.orderRequest.filter((item) => item.flag).map((item) => item.day);
            orderRequestData[index] = filteredOrderData;
            deliveryFrequencyData[index] = item?.deliveryFrequency;
            deliveryStoresData[index] = item?.deliveryStores;
            deliveryLocationData[index] = item?.deliveryAddress;
            deliveryDateData[index] = item?.deliveryDays?.map((item) => item?.date).join(', ') || '';
            orderRequestDate[index] = item?.orderRequest?.map((item) => item?.date).join(', ') || '';
          });
          deliveryDays?.map((item, index) => {
            setDeliveryFullFillment((prevState) => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], deliveryDays: item };
              newState[index] = { ...newState[index], deliveryDate: deliveryDateData[index] };
              newState[index] = { ...newState[index], orderRequestDate: orderRequestDate[index] };
              newState[index] = { ...newState[index], deliveryFrequency: deliveryFrequencyData[index] || '' };
              newState[index] = { ...newState[index], deliveryStores: deliveryStoresData[index] || '' };
              newState[index] = { ...newState[index], deliveryAddress: deliveryLocationData[index] || '' };
              return newState;
            });
          });
          orderRequestData?.map((item, index) => {
            setDeliveryFullFillment((prevState) => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], orderRequest: item };
              return newState;
            });
          });
          // setting centralized options
          centralizedOptions?.map((item, index) => {
            const filteredData = item?.centralizedDeliveryDays.filter((item) => item.flag).map((item) => item.day);
            centralizedDeliveryDays[index] = filteredData;
            const filteredOrderData = item?.centralizedOrderRequest.filter((item) => item.flag).map((item) => item.day);
            centralizedOrderRequestData[index] = filteredOrderData;
            centralizedDeliveryFrequency[index] = item?.centralizedDeliveryFrequency;
            centralizedDeliveryStores[index] = item?.centralizedStores;
            centralizedDeliveryDateData[index] = item?.centralizedDeliveryDays?.map((item) => item?.date).join(', ');
            centralizedOrderRequestDate[index] = item?.centralizedOrderRequest?.map((item) => item?.date).join(', ');
          });
          centralizedDeliveryDays?.map((item, index) => {
            setCentralizedFullFillment((prevState) => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], centralizedDeliveryDays: item };
              newState[index] = {
                ...newState[index],
                centralizedDeliveryFrequency: centralizedDeliveryFrequency[index] || '',
              };
              newState[index] = {
                ...newState[index],
                centralizedDeliveryStores: centralizedDeliveryStores[index] || '',
              };
              newState[index] = {
                ...newState[index],
                centralizedDeliveryDate: centralizedDeliveryDateData[index] || '',
              };
              newState[index] = {
                ...newState[index],
                centralizedOrderRequestDate: centralizedOrderRequestDate[index] || '',
              };
              return newState;
            });
          });
          centralizedOrderRequestData?.map((item, index) => {
            setCentralizedFullFillment((prevState) => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], centralizedOrderRequest: item };
              return newState;
            });
          });
          // setdeliveryDays(trueDays || []);
          // setOrderRequestDays(orderRequestDays || []);
          // setdeliveryFrequency(data?.deliveryFrequency);
          setFullFillMentLoader(false);
        })
        .catch(() => {
          setFullFillMentLoader(false);
        });
    }
  };

  const handleUpdateDeliveryFullFillment = () => {
    if (vendorId) {
      const deliveryDaysData = deliveryFullFillment?.deliveryDays?.map((item) => item?.value);
      const orderRequestDayData = deliveryFullFillment?.orderRequestDays?.map((item) => item?.value);
      const payload = {
        vendorDeliveryId: vendorDeliveryId,
        vendorId: vendorId,
        deliveryFrequency: deliveryFullFillment?.deliveryFrequency,
        deliveryDays: frequencyDays?.map((item) => ({ day: item, flag: deliveryDaysData?.includes(item) })),
        orderRequest: frequencyDays?.map((item) => ({ day: item, flag: orderRequestDayData?.includes(item) })),
        updatedBy: createdById,
        updatedByName: userName,
      };

      updateDeliveryFullfillment(payload)
        .then((res) => {
          setDisableFullFillMent(!disableFullFilment);
          handleFetchDeliveryFullFilment();
        })
        .catch(() => {});
    } else {
    }
  };

  const handleUpdateVendorReturns = () => {
    const vendorReturnType = ['RETURN_ON_EXPIRY', 'RETURN_ON_DAMAGE', 'RETURN_ON_DEAD_STOCK'];
    const subCategoryType = ['PRODUCT_REPLACEMENT', 'REPLACEMENT_ON_OTHER_PRODUCT', 'MONEY_REFUNDS', 'CREDIT_NOTE'];

    const vendorReturnData = vendorReturnType?.map((returnitem) => ({
      vendorReturn: returnitem,
      subCategory: subCategoryType?.map((item) => ({
        vendorReturn: item,
        flag: subCategoryCheckBoxValue?.[returnitem][item],
      })),
      flag: returnCheckBoxValue?.[returnitem],
    }));
    // -----------------------------------------------------------------
    if (vendorId) {
      const payload = {
        // vendorReturnId: 'string',
        vendorId: vendorId,
        vendorReturn: vendorReturnData,
        createdBy: createdById,
        createdByName: userName,
      };
      updateVendorReturns(payload)
        .then((res) => {
          // console.log(res?.data?.data);
          handleReturnsAndReplacements();
        })
        .catch(() => {});
    } else {
    }
  };
  const handleFetchPaymentTerms = () => {
    if (vendorId) {
      setPaymentTermsLoader(true);
      vendorPaymentTermstById(vendorId)
        .then((res) => {
          const paymentData = res?.data?.data?.object;
          // console.log(paymentData);
          setPaymentTerms(paymentData || []);
          const paymentOptionData = paymentData?.paymentOptions
            .filter((item) => item.flag)
            .map((item) => item.paymentOption);
          const purchaseTermsData = paymentData?.purchaseTerms
            .filter((item) => item.flag)
            .map((item) => item.paymentOption);
          setSelectedPaymentOptions(paymentOptionData || []);
          setSelectedPaymentTerms(purchaseTermsData || []);
          setPaymentTermsLoader(false);
        })
        .catch(() => {
          setPaymentTermsLoader(false);
        });
    }
  };

  const handleReturnsAndReplacements = () => {
    if (vendorId) {
      setReturnsLoader(true);
      vendorReturnAndReplacementById(vendorId)
        .then((res) => {
          const data = res?.data?.data?.object?.vendorReturn;
          if (data && Array.isArray(data)) {
            const returnCheckBoxValue = {};
            const subCategoryCheckBoxValue = {};

            data?.forEach((item) => {
              if (item.flag) {
                returnCheckBoxValue[item?.vendorReturn] = item.flag;
                subCategoryCheckBoxValue[item?.vendorReturn] = {};

                item?.subCategory?.forEach((subItem) => {
                  subCategoryCheckBoxValue[item?.vendorReturn][subItem?.vendorReturn] = subItem.flag;
                });
              }
            });

            setReturnCheckBoxValue(returnCheckBoxValue);
            setSubCategoryCheckBoxValue(subCategoryCheckBoxValue);
          }

          setReturnsLoader(false);
        })
        .catch(() => {
          setReturnsLoader(false);
        });
    }
  };

  useEffect(() => {
    setCardLoader(true);
    handleFetchDeliveryFullFilment();
    handleFetchPaymentTerms();
    handleReturnsAndReplacements();
  }, []);

  useEffect(() => {
    if (!PaymentTermsLoader || !fullFilmentLoader || !returnsLoader) {
      setCardLoader(false);
    }
  }, [PaymentTermsLoader, fullFilmentLoader, returnsLoader]);

  const handlePayments = (event, isChecked, value) => {
    const chklabel = event.target.value;
    if (isChecked) {
      setPayment([...payment, chklabel]);
    }
  };

  const handlePurchase = (event, isChecked, value) => {
    const chklabel = event.target.value;
    if (isChecked) {
      setPurchaseTerms([...purchaseTerms, chklabel]);
    }
  };

  return (
    <>
      {cardLoader ? (
        <Spinner size={'1.3rem'} />
      ) : (
        <div style={{ padding: '15px' }}>
          {fullFilmentLoader ? (
            <Spinner size={'1.3rem'} />
          ) : (
            <Card className="vendorCardShadow" style={{ padding: '15px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}
              >
                <SoftTypography variant="label" className="label-heading">
                  Product Fullfillment
                </SoftTypography>
                <>
                  {/* <ModeEditIcon className="cursorPointer" onClick={() => setDisableFullFillMent(!disableFullFilment)} />{' '} */}
                </>
              </div>
              {disableFullFilment ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <InputLabel
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                      >
                        Delivery Frequency
                      </InputLabel>
                      <SoftSelect
                        value={{ label: deliveryFullFillment?.deliveryFrequency || '' }}
                        menuPortalTarget={document.body}
                        id="status"
                        placeholder="select delivery Frequency"
                        options={[
                          { value: 'DAILY', label: 'Daily' },
                          { value: 'WEEKLY', label: 'Weekly' },
                          { value: 'FORTNIGHT', label: 'Fortnight' },
                          { value: 'MONTHLY', label: 'Monthly' },
                          { value: 'ON_DEMAND', label: 'On Demand' },
                        ]}
                        onChange={(e) =>
                          setDeliveryFullFillment((prevState) => ({ ...prevState, deliveryFrequency: e.value }))
                        }
                      ></SoftSelect>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InputLabel
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                      >
                        Delivery days
                      </InputLabel>

                      {/* <MultiSelect
                  key="example_id"
                  options={[
                    { value: 'mon', label: 'Monday' },
                    { value: 'tue', label: 'Tuesday' },
                    { value: 'wed', label: 'Wednesday' },
                    { value: 'thur', label: 'Thursday' },
                    { value: 'fri', label: 'Friday' },
                    { value: 'sat', label: 'Saturday' },
                    { value: 'sun', label: 'Sunday' },
                  ]}
                  onChange={handleOptionChange}
                  value={optionSelected}
                  isSelectAll={true}
                  menuPlacement={'bottom'}
                  menuPortalTarget={document.body}
                  placeholder="select days"
                /> */}
                      <SoftSelect
                        isMulti
                        menuPortalTarget={document.body}
                        id="status"
                        value={deliveryFullFillment?.deliveryDays || ''}
                        options={[
                          { value: 'NONE', label: 'none' },
                          { value: 'SUNDAY', label: 'Sunday' },
                          { value: 'MONDAY', label: 'Monday' },
                          { value: 'TUESDAY', label: 'Tuesday' },
                          { value: 'WEDNESDAY', label: 'Wednesday' },
                          { value: 'THURSDAY', label: 'Thursday' },
                          { value: 'FRIDAY', label: 'Friday' },
                          { value: 'SATURDAY', label: 'Saturday' },
                        ]}
                        onChange={(e) => setDeliveryFullFillment((prevState) => ({ ...prevState, deliveryDays: e }))}
                      ></SoftSelect>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InputLabel
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                      >
                        Order Request Day
                      </InputLabel>
                      <SoftSelect
                        isMulti
                        menuPortalTarget={document.body}
                        id="status"
                        value={deliveryFullFillment?.orderRequestDays || ''}
                        options={[
                          { value: 'NONE', label: 'none' },
                          { value: 'SUNDAY', label: 'Sunday' },
                          { value: 'MONDAY', label: 'Monday' },
                          { value: 'TUESDAY', label: 'Tuesday' },
                          { value: 'WEDNESDAY', label: 'Wednesday' },
                          { value: 'THURSDAY', label: 'Thursday' },
                          { value: 'FRIDAY', label: 'Friday' },
                          { value: 'SATURDAY', label: 'Saturday' },
                        ]}
                        onChange={(e) =>
                          setDeliveryFullFillment((prevState) => ({ ...prevState, orderRequestDays: e }))
                        }
                      ></SoftSelect>{' '}
                    </Grid>
                  </Grid>
                  <div style={{ margin: '15px 0px 0px 0px' }}>
                    <SoftBox className="form-button-customer-vendor">
                      <SoftButton className="vendor-second-btn">Cancel</SoftButton>
                      <SoftButton className="vendor-add-btn" onClick={handleUpdateDeliveryFullFillment}>
                        Save
                      </SoftButton>
                    </SoftBox>
                  </div>
                </>
              ) : (
                <>
                  <Grid container spacing={1}>
                    <>
                      <Grid item xs={12} mb={0.5}>
                        <InputLabel
                          sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                        >
                          Servicable areas
                        </InputLabel>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                          {servicableAreas?.map((item, index) => (
                            <button key={index} className="vendorLocationbtn">
                              {item || 'NA'}
                            </button>
                          ))}
                        </div>
                      </Grid>
                      <Grid item xs={12} mb={0.5}>
                        <InputLabel
                          sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#344767', margin: '5px 5px 0px 3px' }}
                        >
                          Purchase method
                        </InputLabel>
                        {purchaseMethods?.map((item) => (
                          <SoftTypography
                            style={{ fontSize: '14px', fontWeight: '700 !important', marginLeft: '10px' }}
                          >
                            {textFormatter(item || '')}
                          </SoftTypography>
                        ))}
                      </Grid>
                      {deliveryFullFillment?.map((item, index) => {
                        return (
                          <>
                            <Grid item xs={12} md={2.5}>
                              <InputLabel
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: '0.8rem',
                                  color: '#344767',
                                  margin: '5px 5px 5px 3px',
                                }}
                              >
                                Delivery Frequency
                              </InputLabel>
                              <SoftTypography
                                style={{ fontSize: '14px', fontWeight: '700 !important', marginLeft: '10px' }}
                              >
                                {textFormatter(item?.deliveryFrequency || '') || 'NA'}
                              </SoftTypography>
                            </Grid>
                            {item?.deliveryFrequency === 'MONTHLY' ? (
                              <Grid item xs={12} md={3.5}>
                                <InputLabel
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    color: '#344767',
                                    margin: '5px 5px 5px 3px',
                                  }}
                                >
                                  Delivery Days
                                </InputLabel>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                  <button className="vendorLocationbtn">{item?.deliveryDate || 'NA'}</button>
                                </div>
                              </Grid>
                            ) : (
                              <Grid item xs={12} md={3.5}>
                                <InputLabel
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    color: '#344767',
                                    margin: '5px 5px 5px 3px',
                                  }}
                                >
                                  Delivery Days
                                </InputLabel>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                  {item?.deliveryDays?.map((item) => {
                                    return (
                                      <button className="vendorLocationbtn">{textFormatter(item || '') || 'NA'}</button>
                                    );
                                  })}
                                </div>
                              </Grid>
                            )}
                            {item?.deliveryFrequency === 'MONTHLY' ? (
                              <Grid item xs={12} md={3.5}>
                                <InputLabel
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    color: '#344767',
                                    margin: '5px 5px 5px 3px',
                                  }}
                                >
                                  Order Request Days
                                </InputLabel>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                  <button className="vendorLocationbtn">{item?.orderRequestDate || 'NA'}</button>
                                </div>
                              </Grid>
                            ) : (
                              <Grid item xs={12} md={3.5}>
                                <InputLabel
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    color: '#344767',
                                    margin: '5px 5px 5px 3px',
                                  }}
                                >
                                  Order request Day
                                </InputLabel>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                  {item?.orderRequest?.map((item) => (
                                    <button className="vendorLocationbtn">{textFormatter(item || '') || 'NA'}</button>
                                  ))}
                                </div>
                              </Grid>
                            )}
                            {item?.deliveryStores ? (
                              <Grid item xs={12} md={2.5}>
                                <InputLabel
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    color: '#344767',
                                    margin: '5px 5px 5px 3px',
                                  }}
                                >
                                  Delivery Location
                                </InputLabel>
                                <button className="vendorLocationbtn">
                                  {textFormatter(item?.deliveryStores || '') || 'NA'}
                                </button>
                              </Grid>
                            ) : (
                              <Grid item xs={12} md={2.5}>
                                <InputLabel
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    color: '#344767',
                                    margin: '5px 5px -5px 3px',
                                  }}
                                >
                                  Delivery Location
                                </InputLabel>
                                <button className="vendorLocationbtn" style={{ maxHeight: '50px', overflow: 'auto' }}>
                                  {textFormatter(item?.deliveryAddress || '') || 'NA'}
                                </button>
                              </Grid>
                            )}
                          </>
                        );
                      })}
                    </>
                    <Grid item xs={12} mt={1}>
                      <p style={{ fontSize: '12px', color: '#367df3' }}>
                        Delivery schedule from centralized location to stores
                      </p>
                    </Grid>
                    {centralizedFullFillment?.map((item, index) => {
                      return (
                        <>
                          <Grid item xs={12} md={2.5}>
                            <InputLabel
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                color: '#344767',
                                margin: '5px 5px 5px 3px',
                              }}
                            >
                              Delivery Frequency
                            </InputLabel>
                            <SoftTypography
                              style={{ fontSize: '14px', fontWeight: '700 !important', marginLeft: '10px' }}
                            >
                              {textFormatter(item?.centralizedDeliveryFrequency || '') || 'NA'}
                            </SoftTypography>
                          </Grid>

                          <Grid item xs={12} md={3.5}>
                            <InputLabel
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                color: '#344767',
                                margin: '5px 5px 5px 3px',
                              }}
                            >
                              Delivery Days
                            </InputLabel>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                              {item?.centralizedDeliveryDays?.map((item) => {
                                return (
                                  <button className="vendorLocationbtn">{textFormatter(item || '') || 'NA'}</button>
                                );
                              })}
                            </div>
                          </Grid>

                          <Grid item xs={12} md={3.5}>
                            <InputLabel
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                color: '#344767',
                                margin: '5px 5px 5px 3px',
                              }}
                            >
                              Order request Day
                            </InputLabel>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                              {item?.centralizedOrderRequest?.map((item) => (
                                <button className="vendorLocationbtn">{textFormatter(item || '') || 'NA'}</button>
                              ))}
                            </div>
                          </Grid>
                          <Grid item xs={12} md={2.5}>
                            <InputLabel
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                color: '#344767',
                                margin: '5px 5px 5px 3px',
                              }}
                            >
                              Delivery Location
                            </InputLabel>
                            <button className="vendorLocationbtn">
                              {textFormatter(item?.centralizedDeliveryStores || '') || 'NA'}
                            </button>
                          </Grid>
                        </>
                      );
                    })}
                  </Grid>{' '}
                </>
              )}
            </Card>
          )}
          {PaymentTermsLoader ? (
            <Spinner size={'1.3rem'} />
          ) : (
            <Card className="vendorCardShadow" style={{ padding: '15px', marginTop: '15px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}
              >
                <SoftTypography variant="label" className="label-heading">
                  Payment Terms
                </SoftTypography>
                <>
                  {/* <ModeEditIcon className="cursorPointer" onClick={() => setDisablePaymentTerms(!disablepaymentTerms)} />{' '} */}
                </>
              </div>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <InputLabel
                    sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                  >
                    Payment Type
                  </InputLabel>
                  <SoftTypography style={{ fontSize: '14px', fontWeight: '700 !important', marginLeft: '10px' }}>
                    {textFormatter(paymentTerms?.paymentTerms || '')}
                  </SoftTypography>
                </Grid>

                <Grid item xs={12} md={4}>
                  {paymentTerms?.paymentTerms === 'CREDIT_DAYS' && (
                    <>
                      {' '}
                      <InputLabel
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                      >
                        Credit Limit
                      </InputLabel>
                      <SoftTypography style={{ fontSize: '14px', fontWeight: '700 !important', marginLeft: '10px' }}>
                        {textFormatter(paymentTerms?.creditLimit || '') || 'NA'}
                      </SoftTypography>
                    </>
                  )}{' '}
                </Grid>
                <Grid item xs={12} md={4}>
                  {paymentTerms?.paymentTerms === 'CREDIT_DAYS' && (
                    <>
                      {' '}
                      <InputLabel
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                      >
                        Credit Period
                      </InputLabel>
                      <SoftTypography style={{ fontSize: '14px', fontWeight: '700 !important', marginLeft: '10px' }}>
                        {paymentTerms?.creditDays || 'NA'}
                      </SoftTypography>
                    </>
                  )}{' '}
                </Grid>
                {paymentTerms?.vendorPurchase?.[0]?.payoutFrequency && paymentTerms?.paymentTerms === 'ON_SALE' && (
                  <>
                    {' '}
                    <Grid item xs={12} md={3}>
                      <InputLabel
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                      >
                        Payout Frequency
                      </InputLabel>
                      <SoftTypography style={{ fontSize: '14px', fontWeight: '700 !important', marginLeft: '10px' }}>
                        {textFormatter(paymentTerms?.vendorPurchase?.[0]?.payoutFrequency) || ''}
                      </SoftTypography>{' '}
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <InputLabel
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                      >
                        Selected Day
                      </InputLabel>
                      {paymentTerms?.vendorPurchase?.[0]?.payoutFrequency === 'MONTHLY' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                          <button className="vendorLocationbtn">
                            {paymentTerms?.vendorPurchase?.[0]?.date || 'NA'}
                          </button>
                        </div>
                      )}
                      {paymentTerms?.vendorPurchase?.[0]?.payoutFrequency === 'WEEKLY' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                          {paymentTerms?.vendorPurchase?.[0]?.deliveryDays?.map((item) => (
                            <button className="vendorLocationbtn">{textFormatter(item) || 'NA'}</button>
                          ))}
                        </div>
                      )}
                    </Grid>
                  </>
                )}

                {selectedPaymentOptions?.length > 0 && (
                  <Grid item xs={12} md={6} p={3}>
                    <InputLabel
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                    >
                      Payment options
                    </InputLabel>
                    {selectedPaymentOptions?.map((element, i) => (
                      <SoftBox display="flex" gap="10px" key={i} style={{ margin: '5px 0px 0px 8px' }}>
                        <SoftTypography className="add-customer-portal-access">
                          {textFormatter(element || '')}
                        </SoftTypography>
                      </SoftBox>
                    ))}
                  </Grid>
                )}

                {selectedPaymentTerms?.length > 0 && (
                  <Grid item xs={12} md={6} p={3}>
                    <InputLabel
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                    >
                      Purchase terms
                    </InputLabel>
                    {selectedPaymentTerms?.map((element, i) => (
                      <SoftBox display="flex" gap="10px" key={i} style={{ margin: '5px 0px 0px 8px' }}>
                        <SoftTypography className="add-customer-portal-access">
                          {textFormatter(element || '')}
                        </SoftTypography>
                      </SoftBox>
                    ))}
                  </Grid>
                )}
              </Grid>
              {disablepaymentTerms && (
                <div style={{ margin: '15px 0px 0px 0px' }}>
                  <SoftBox className="form-button-customer-vendor">
                    <SoftButton className="vendor-second-btn">Cancel</SoftButton>
                    <SoftButton className="vendor-add-btn">Save</SoftButton>
                  </SoftBox>
                </div>
              )}
            </Card>
          )}
          {returnsLoader ? (
            <Spinner size={'1.3rem'} />
          ) : (
            <Card className="vendorCardShadow" style={{ padding: '15px', marginTop: '15px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.8rem',
                }}
              >
                <SoftTypography variant="label" className="label-heading">
                  Returns and Replacement
                </SoftTypography>
                <>
                  {/* <ModeEditIcon className="cursorPointer" onClick={() => setDisableReturns(!disableReturns)} />{' '} */}
                </>
              </div>
              <Grid container spacing={2}>
                {Object.keys(subCategoryCheckBoxValue).length > 0 ? (
                  <>
                    {' '}
                    {Object.keys(subCategoryCheckBoxValue).map((mainKey) => (
                      <Grid item xs={12} md={4} key={mainKey}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                          <InputLabel
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              color: '#344767',
                              margin: '5px 5px 5px 3px',
                            }}
                          >
                            {textFormatter(mainKey || '')}
                          </InputLabel>
                        </div>

                        <SoftBox gap="10px" style={{ margin: '5px 0px 0px 8px' }}>
                          {Object.keys(subCategoryCheckBoxValue[mainKey]).map(
                            (subKey) =>
                              subCategoryCheckBoxValue[mainKey][subKey] && (
                                <SoftTypography className="add-customer-portal-access" key={subKey}>
                                  {textFormatter(subKey || '')}
                                </SoftTypography>
                              ),
                          )}
                        </SoftBox>
                      </Grid>
                    ))}
                  </>
                ) : (
                  <SoftTypography style={{ fontSize: '14px', fontWeight: '700 !important', marginLeft: '15px' }}>
                    NA
                  </SoftTypography>
                )}
              </Grid>
              {/* <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <InputLabel
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                    >
                      Returns on expiry
                    </InputLabel>
                  </div>

                  <SoftBox gap="10px" style={{ margin: '5px 0px 0px 8px' }}>
                    <SoftTypography className="add-customer-portal-access">Product replacement</SoftTypography>
                    <SoftTypography className="add-customer-portal-access">Replacement on other product</SoftTypography>
                    <SoftTypography className="add-customer-portal-access">Money refunds</SoftTypography>
                    <SoftTypography className="add-customer-portal-access">Credit note</SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <InputLabel
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                    >
                      Returns on damage
                    </InputLabel>
                  </div>

                  <SoftBox gap="10px" style={{ margin: '5px 0px 0px 8px' }}>
                    <SoftTypography className="add-customer-portal-access">Product replacement</SoftTypography>
                    <SoftTypography className="add-customer-portal-access">Replacement on other product</SoftTypography>
                    <SoftTypography className="add-customer-portal-access">Money refunds</SoftTypography>
                    <SoftTypography className="add-customer-portal-access">Credit note</SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <InputLabel
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                    >
                      Returns on dead stock
                    </InputLabel>
                  </div>

                  <SoftBox gap="10px" style={{ margin: '5px 0px 0px 8px' }}>
                    <SoftTypography className="add-customer-portal-access">Product replacement</SoftTypography>
                    <SoftTypography className="add-customer-portal-access">Replacement on other product</SoftTypography>
                    <SoftTypography className="add-customer-portal-access">Money refunds</SoftTypography>
                    <SoftTypography className="add-customer-portal-access">Credit note</SoftTypography>
                  </SoftBox>
                </Grid>
              </Grid> */}
              {disableReturns && (
                <div style={{ margin: '15px 0px 0px 0px' }}>
                  <SoftBox className="form-button-customer-vendor">
                    <SoftButton className="vendor-second-btn">Cancel</SoftButton>
                    <SoftButton className="vendor-add-btn" onClick={handleUpdateVendorReturns}>
                      Save
                    </SoftButton>
                  </SoftBox>
                </div>
              )}
            </Card>
          )}
        </div>
      )}

      <br />
      <div style={{ padding: '15px' }}>
        <Card className="vendorCardShadow" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            <div>
              <ReceiptLongIcon sx={{ color: '#0562fb', fontSize: '30px' }} />
            </div>
            <SoftTypography fontSize="14px" fontWeight="bold" variant="caption">
              Sorry , no terms of trade found for this vendor
            </SoftTypography>
            <SoftButton color="info" onClick={() => navigate(`/purchase/edit-vendor/${vendorId}`)}>
              + Add
            </SoftButton>
          </div>
        </Card>
      </div>
    </>
  );
};

export default VednorDetailsTerms;
