import {
  addVendor,
  createTotHo,
  createVendorDelivery,
  createVendorPaymentTerms,
  createVendorReturns,
  getVendorDraftDetails,
  updateVendorBasicDetails,
  updateVendorPaymentTerms,
  updateVendorReturns,
  updateVendorTot,
  vendorDeliveryFullFillmentEdit,
} from '../../../../../config/Services';
import { getVendorDraftCode, resetVendorPayload } from '../../../../../datamanagement/vendorPayloadSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';

const AddvendorApiCall = ({ handleApiCall }) => {
  const isHandleApiCallPresent = Boolean(handleApiCall);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vendorDraftCode = useSelector(getVendorDraftCode) || localStorage.getItem('vendorDraftCode');
  const [configData, setConfigData] = useState({});
  const showSnackbar = useSnackbar();
  const [vendorIddata, setVendorIddata] = useState(null);
  const editPageCheck = location.pathname === '/purchase/add-vendor';
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    fetchAllDraftPayload();
  }, []);

  const fetchAllDraftPayload = () => {
    getVendorDraftDetails(vendorDraftCode)
      .then((res) => {
        setConfigData(res?.data?.data?.object?.config || {});
      })
      .catch(() => {});
  };

  const handleCreateVendorDetails = () => {
    const payload = configData?.vendorOverview;
    addVendor(payload)
      .then((response) => {
        const vendId = '';
        // if (vendorLogo !== null) {
        //   vendId = response?.data?.data?.vendorId;
        //   const formData = new FormData();
        //   formData.append('file', 'vendorLogo');
        //   uploadVendorLogo(vendId, formData)
        //     .then((result) => {})
        //     .catch((err) => {});
        // }
        const vendorId = response?.data?.data?.vendorId;
        setVendorIddata(vendorId);
        // localStorage.setItem('vendorId', response.data.data.vendorId);
        localStorage.removeItem('vendorDraftCode');
        return response?.data?.data?.vendorId;
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  useEffect(() => {
    if (vendorIddata && configData) {
      handleCreateVendorBrand(vendorIddata);
      handleCreateVendorDelivery(vendorIddata);
      handleCreateVendorTerms(vendorIddata);
      handleCreateVendorReturns(vendorIddata);
      localStorage.removeItem('vendorDraftCode');
      navigate('/purchase/vendors');
    }
  }, [vendorIddata, configData]);

  const handleCreateVendorBrand = (vendorIddata) => {
    const payload = configData?.vendorBrandPayload?.map((item) => ({
      ...item,
      vendorId: vendorIddata,
    }));
    if (configData?.vendorBrandPayload) {
      createTotHo(payload)
        .then((res) => {})
        .catch(() => {});
    }
  };

  const handleCreateVendorDelivery = (vendorIddata) => {
    const payload = configData?.vendorDeliveryPayload || {};
    if (vendorIddata) {
      payload.vendorId = vendorIddata || '';
    }
    if (configData?.vendorDeliveryPayload) {
      createVendorDelivery(payload)
        .then((res) => {
          if (res?.data?.data?.es === 1) {
            showSnackbar(res?.data?.data?.message, 'error');
          }
        })
        .catch(() => {});
    }
  };

  const handleCreateVendorTerms = (vendorIddata) => {
    const payload = configData?.vendorTermsPayload || {};
    if (vendorIddata) {
      payload.vendorId = vendorIddata;
    }
    if (configData?.vendorTermsPayload) {
      createVendorPaymentTerms(payload)
        .then((res) => {
          if (res?.data?.data?.es === 1) {
            showSnackbar(res?.data?.data?.message, 'error');
          }
        })
        .catch(() => {});
    }
  };

  const handleCreateVendorReturns = (vendorIddata) => {
    const payload = configData?.vendorReturnsPayload || {};
    if (vendorIddata) {
      payload.vendorId = vendorIddata;
    }
    if (configData?.vendorReturnsPayload) {
      createVendorReturns(payload)
        .then((res) => {
          if (res?.data?.data?.es === 1) {
            showSnackbar(res?.data?.data?.message, 'error');
          }
        })
        .catch(() => {});
    }
  };
  const handleVendorCreate = async () => {
    try {
      await handleApiCall();
      fetchAllDraftPayload();
      await delay(1500);
      await handleCreateVendorDetails();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  //
  //   edit vendor api calls
  const handleEditVendorDetails = () => {
    const payload = configData?.vendorOverview;
    updateVendorBasicDetails(payload)
      .then((res) => {
        // console.log(res?.data?.data);
      })
      .catch(() => {});
  };

  const handleEditvendorBrand = () => {
    const payload = configData?.vendorBrandPayload;
    updateVendorTot(payload)
      .then((res) => {})
      .catch(() => {});
  };
  const handleEditVendorDelivery = () => {
    const payload = configData?.vendorDeliveryPayload;
    vendorDeliveryFullFillmentEdit(payload)
      .then((res) => {
        // console.log(res?.data?.data);
      })
      .catch(() => {});
  };
  const handleEditVendorTerms = () => {
    const payload = configData?.vendorTermsPayload;
    updateVendorPaymentTerms(payload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        }
      })
      .catch(() => {});
  };
  const handleEditVendorReturns = () => {
    const payload = configData?.vendorReturnsPayload;
    updateVendorReturns(payload)
      .then(() => {})
      .catch(() => {});
  };

  const handleVendorEdit = () => {
    if (handleApiCall) {
      handleApiCall();
      return;
    }

    const handlers = [
      { key: 'vendorOverview', method: handleEditVendorDetails },
      { key: 'vendorBrandPayload', method: handleEditvendorBrand },
      { key: 'vendorDeliveryPayload', method: handleEditVendorDelivery },
      { key: 'vendorTermsPayload', method: handleEditVendorTerms },
      { key: 'vendorReturnsPayload', method: handleEditVendorReturns },
    ];

    handlers?.forEach(({ key, method }) => {
      if (configData?.[key]) {
        method();
      }
    });
    localStorage.removeItem('vendorDraftCode');
    navigate('/purchase/vendors');
    dispatch(resetVendorPayload());
  };

  const handleNextBtn = () => {
    if (location.pathname === '/purchase/add-vendor') {
      handleVendorCreate();
      fetchAllDraftPayload();
    } else {
      handleVendorEdit();
      fetchAllDraftPayload();
    }
  };
  return (
    <SoftBox className="form-button-customer-vendor">
      <SoftButton className="vendor-second-btn" onClick={() => navigate('/purchase/vendors')}>
        Cancel
      </SoftButton>
      <SoftButton className="vendor-add-btn" onClick={handleNextBtn}>
        {editPageCheck ? 'Save' : isHandleApiCallPresent ? 'Next' : 'Save'}
      </SoftButton>
    </SoftBox>
  );
};

export default AddvendorApiCall;
