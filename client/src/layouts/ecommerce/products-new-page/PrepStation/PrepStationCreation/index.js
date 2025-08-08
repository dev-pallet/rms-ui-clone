import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../../components/SoftBox';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import SoftButton from '../../../../../components/SoftButton';
import { CircularProgress, IconButton, Typography } from '@mui/material';
import SoftInput from '../../../../../components/SoftInput';
import { Grid } from '../../../product/all-products/components/edit-product/Grid';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { createPrepStation, getPrepStationById, updatePrepStation } from '../../../../../config/Services';

const PrepStationCreation = () => {
  const [prepStationData, setPrepStationData] = useState({
    name: '',
    description: '',
    image: '',
    prepStationCapacity: '',
    prepStationThreshold: '',
    shortCode: '',
  });
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const fileInputRefLevel1 = useRef(null);
  const params = useParams();
  const { id } = params;

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const userDetails = localStorage.getItem('user_details')
    ? JSON.parse(localStorage.getItem('user_details'))
    : null;
  const userName = userDetails?.firstName + ' ' + userDetails?.secondName;
  const userUidx = userDetails?.uidx;

  // This function is used to handle changes in the input fields of the prep station form

  const handleLevel1Change = (fieldName, e) => {
    const { name, value } = e.target;
    setPrepStationData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  // This function is used to add a new prep station form
  const addLevel1Form = () => {
    setPrepStationData([
      ...prepStationData,
      {
        id: prepStationData?.length + 1,
        name: '',
        description: '',
        image: '',
        isNew: true,
        prepStationCapacity: '',
        prepStationThreshold: '',
        shortCode: '',
      },
    ]);
  };

  // This function is used to remove a prep station form by its id
  const removeLevel1Form = (id) => {
    setPrepStationData(prepStationData?.filter((form) => form?.id !== id));
  };

  // This function is used to handle image changes for the prep station
  const handleImageChange = (level, id, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let imageBase64 = reader.result;

      setPrepStationData(prepStationData?.map((form) => (form?.id === id ? { ...form, image: imageBase64 } : form)));
    };
    reader.readAsDataURL(file);
  };

  // This function is used to handle image click events for the prep station
  const handleImageClick = (level, id) => {
    let fileInputRef;

    fileInputRef = fileInputRefLevel1;

    fileInputRef.current.click();
    fileInputRef.current.onchange = (e) => {
      if (e.target.files.length > 0) {
        handleImageChange(level, id, e.target.files[0]);
      }
    };
  };

  // This function is used to remove the data URL prefix from the encoded image string
  const removeDataURLPrefix = (encoded) => {
    if (encoded.startsWith('data:image/png;base64,')) {
      return encoded.replace('data:image/png;base64,', '');
    } else if (encoded.startsWith('data:image/jpeg;base64,')) {
      return encoded.replace('data:image/jpeg;base64,', '');
    } else {
      return encoded;
    }
  };

  const handlePrepStationCreation = () => {
    setLoader(true);
    const payload = {
      displayName: prepStationData?.name || '',
      description: prepStationData?.description || '',
      shortCode: prepStationData?.shortCode || '',

      maxOrderCapacity: Number(prepStationData?.prepStationCapacity) || 0,
      autoCloseThreshold: Number(prepStationData?.prepStationThreshold) || 0,
      notes: '',
      storeId: orgId,
      storeLocationId: locId,
      createdBy: userName,
      createdByName: userUidx,
      isActive: true,
      isDeleted: false,
    };

    createPrepStation(payload)
      .then((res) => {
        setLoader(false);
        if (res?.data?.status === 'ERROR' || res?.data?.data?.es > 0) {
          showSnackBar(
            res?.data?.message || res?.data?.data?.message || 'There was an error creating prep station',
            'error',
          );
          return;
        } else {
          showSnackBar('Prep station creaton successfull', 'success');
          navigate(-1);
        }
      })
      .catch((err) => {
        setLoader(false);
        showSnackBar('There was an error creating prep station', 'error');
      });
  };

  const getAllData = () => {
    getPrepStationById(id)
      .then((res) => {
        if (res?.data?.status === 'ERROR' || res?.data?.data?.es > 0) {
          showSnackBar(res?.data?.message || res?.data?.data?.message || 'There was an error fetching data', 'error');
          return;
        } else {
          const results = res?.data?.data?.data;
          setPrepStationData({
            name: results?.displayName,
            description: results?.description,
            prepStationCapacity: results?.maxOrderCapacity,
            prepStationThreshold: results?.autoCloseThreshold,
            shortCode: results?.shortCode,
          });
        }
      })
      .catch((err) => {
        showSnackBar('There was an error fetching data', 'error');
      });
  };

  useEffect(() => {
    if (id) {
      getAllData();
    }
  }, [id]);

  const handlePrepStationUpdate = () => {
    setLoader(true);
    const payload = {
      id: id,
      displayName: prepStationData?.name || '',
      description: prepStationData?.description || '',
      shortCode: prepStationData?.shortCode || '',
      maxOrderCapacity: Number(prepStationData?.prepStationCapacity) || 0,
      autoCloseThreshold: Number(prepStationData?.prepStationThreshold) || 0,
      notes: '',
      storeId: orgId,
      storeLocationId: locId,
      updatedBy: userName,
      updatedByName: userUidx,
      isActive: true,
      isDeleted: false,
    };

    updatePrepStation(payload)
      .then((res) => {
        setLoader(false);
        if (res?.data?.status === 'ERROR' || res?.data?.data?.es > 0) {
          showSnackBar(
            res?.data?.message || res?.data?.data?.message || 'There was an error updating prep station',
            'error',
          );
          return;
        } else {
          showSnackBar('Prep station updation successfull', 'success');
          navigate(-1);
        }
      })
      .catch((err) => {
        setLoader(false);
        showSnackBar('There was an error updating prep station', 'error');
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <SoftBox className="products-new-department-form-box">
        <form>
          <div style={{ marginBottom: '15px' }}>
            {/* Grid Block 1: Name, Description, Image */}
            <div spacing={2} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '100%' }} className="products-new-department-each-field">
                <label className="products-department-new-form-label">Name</label>
                <SoftInput
                  placeholder="Enter name..."
                  type="text"
                  name="name"
                  size="small"
                  value={prepStationData?.name}
                  onChange={(e) => handleLevel1Change('name', e)}
                />
              </div>

              <div style={{ width: '100%' }} className="products-new-department-each-field">
                <label className="products-department-new-form-label">Description</label>
                <SoftInput
                  placeholder="Enter Department desc..."
                  type="text"
                  size="small"
                  name="description"
                  value={prepStationData?.description}
                  onChange={(e) => handleLevel1Change('description', e)}
                />
              </div>

              {/* <div style={{ width: '100%' }} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Image</label>
                  {form?.image ? (
                    <div style={{ position: 'relative', marginTop: '5px' }}>
                      <img
                        src={form?.image}
                        alt="Preview"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                      <IconButton
                        onClick={() =>
                          setPrepStationData((prevData) =>
                            prevData?.map((item) => (item?.id === form?.id ? { ...item, image: null } : item)),
                          )
                        }
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ) : (
                    <div className="products-new-department-right-bar" id="products-image-show">
                      <button type="button" onClick={() => handleImageClick('Level1', form?.id)}>
                        Upload Image <CloudUploadIcon sx={{ marginLeft: '8px' }} fontSize="small" />
                      </button>
                    </div>
                  )}
                </div> */}
            </div>

            {/* Grid Block 2: Short Code, Capacity, Threshold */}
            <div spacing={2} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '100%' }} className="products-new-department-each-field">
                <label className="products-department-new-form-label">Short Code</label>
                <SoftInput
                  placeholder="Enter short code..."
                  type="text"
                  name="shortCode"
                  size="small"
                  value={prepStationData?.shortCode}
                  onChange={(e) => handleLevel1Change('shortCode', e)}
                />
              </div>

              <div style={{ width: '100%' }} className="products-new-department-each-field">
                <label className="products-department-new-form-label">Total Order Capacity</label>
                <SoftInput
                  placeholder="Enter order capacity..."
                  type="text"
                  name="prepStationCapacity"
                  size="small"
                  value={prepStationData?.prepStationCapacity}
                  onChange={(e) => handleLevel1Change('prepStationCapacity', e)}
                />
              </div>

              <div style={{ width: '100%' }} className="products-new-department-each-field">
                <label className="products-department-new-form-label">
                  Close Station when order percentage exceeds
                </label>
                <SoftInput
                  placeholder="Enter threshold..."
                  type="text"
                  name="prepStationThreshold"
                  size="small"
                  value={prepStationData?.prepStationThreshold}
                  onChange={(e) => handleLevel1Change('prepStationThreshold', e)}
                />
              </div>
            </div>
          </div>
        </form>
      </SoftBox>

      <SoftBox display="flex" justifyContent="flex-end" mt={4}>
        <SoftBox display="flex">
          <SoftButton className="vendor-second-btn" onClick={() => navigate(-1)}>
            Cancel
          </SoftButton>
          <SoftBox ml={2}>
            <SoftButton
              color="info"
              className="vendor-add-btn"
              onClick={id ? handlePrepStationUpdate : handlePrepStationCreation}
            >
              {loader ? (
                <CircularProgress
                  size={18}
                  sx={{
                    color: '#fff',
                  }}
                />
              ) : id ? (
                <>Edit</>
              ) : (
                <>Save</>
              )}
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <input
        type="file"
        ref={fileInputRefLevel1}
        style={{ display: 'none' }}
        accept=".jpg, .jpeg, .png"
        onChange={(e) => handleImageChange('Level1', e.target.files[0])}
      />
    </DashboardLayout>
  );
};

export default PrepStationCreation;
