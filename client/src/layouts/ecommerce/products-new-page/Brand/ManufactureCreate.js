import React, { useEffect, useRef, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import SoftBox from '../../../../components/SoftBox';
import SoftSelect from '../../../../components/SoftSelect';
import SoftInput from '../../../../components/SoftInput';
import ComingSoonAlert from '../ComingSoonAlert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { RequiredAsterisk } from '../../Common/CommonFunction';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import {
  createImageUrl,
  createManufactureNew,
  editManufacture,
  getAllManufacturerV2,
} from '../../../../config/Services';
import { country } from '../../../ecommerce/softselect-Data/country';
import { state as states } from '../../../ecommerce/softselect-Data/state';
import { city as citys } from '../../../ecommerce/softselect-Data/city';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import SoftButton from '../../../../components/SoftButton';

const ManufactureCreate = () => {
  // const {
  //   manufacturerName,
  //   manufactureId,
  //   manufacturerDesc = '',
  //   fssai = '',
  //   gst = '',
  //   cin = '',
  //   email = '',
  //   website = '',
  //   phoneNumber = '',
  //   logo = '',
  // } = allBrandData;
  const location1 = useLocation();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const userDetails = localStorage.getItem('user_details');
  const userInfo = userDetails ? JSON.parse(userDetails) : {};
  const userName = localStorage.getItem('user_name');

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const brandId = params.get('brandId');
    const manufactureId = params.get('manufactureId'); // Fetch manufactureId if present
    return { brandId, manufactureId };
  };

  const { brandId, manufactureId } = getQueryParams();

  const [allBrandData, setAllBrandData] = useState({
    manufacturerName: '',
    manufactureId: '',
    manufacturerDesc: '',
    fssai: '',
    gst: '',
    cin: '',
    email: '',
    website: '',
    phoneNumber: '',
    logo: '',
  });
  const fileInputRefManufacture = useRef();
  const [allBrandLoader, setAllBrandLoader] = useState(false);
  const [manufactureImage, setManufactureImage] = useState(null);
  const [addressDetailsData, setAddressDetailsData] = useState({
    businessLocation: '',
    country: '',
    state: '',
    city: '',
    addressLine1: '',
    addressLine2: '',
    pinCode: '',
  });
  const [citiesOption, setCitiesOption] = useState([]);

  const handleRemoveImage = () => {
    setManufactureImage(null);
  };

  useEffect(() => {
    if (addressDetailsData.state) {
      const initialCities = citys?.filter((cit) => cit.value === addressDetailsData.state) || [];
      setCitiesOption(initialCities);
    }
  }, [addressDetailsData.state]);

  const handleManufactureName = (inputValue, valueName) => {
    // Update manufacturer name directly from input change
    setAllBrandData((prevData) => ({
      ...prevData,
      [valueName]: inputValue,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'fssai') {
      if (value.length > 14) {
        showSnackbar('FSSAI number cannot exceed 14 digits.');
        return;
      }
    }

    if (name === 'gst') {
      if (value.length > 15) {
        showSnackbar('GSTIN number cannot exceed 15 digits.');
        return;
      }
    }

    if (name === 'cin') {
      if (value.length > 21) {
        showSnackbar('CIN number cannot exceed 21 digits.');
        return;
      }
    }

    setAllBrandData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleManufactureChange = async (e) => {
    setAllBrandLoader(true);
    const containsAdd = e.label.split(' ').includes('ADD');
    const name = e.label.split(' ').slice(1).join(' ').trim().replace(/^"|"$/g, ''); //removing ADD and quotes from the manufacturer name

    setAllBrandData((prevData) => ({
      ...prevData,
      manufactureId: e.value,
      manufacturerName: name,
      fssai: e?.data?.fssai ?? 'NA',
      gst: e?.data?.gst ?? 'NA',
      cin: e?.data?.cin ?? 'NA',
      email: e?.data?.email ?? 'NA',
      website: e?.data?.website ?? 'NA',
      phoneNumber: e?.data?.phoneNumber ?? 'NA',
      manufacturerDesc: e?.data?.manufacturerDescription ?? 'NA',
    }));
  };

  const handleAddressChange = (field, value) => {
    setAddressDetailsData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    if (field === 'state') {
      const citiesInState = citys?.filter((cit) => cit.value == value);
      setCitiesOption(citiesInState || []);
    }
  };

  const handleAllManufactures = () => {
    const payload = {
      page: '1',
      pageSize: '50',
      sourceId: [orgId],
      sourceLocationId: [locId],
      sortByCreatedDate: 'DESCENDING',
      active: [true],
    };

    if (manufactureId) {
      payload.manufacturerId = [manufactureId];
    }

    getAllManufacturerV2(payload)
      .then((res) => {
        // Accessing the results array from the API response
        const response = res?.data?.data?.results;
        if (response?.length > 0) {
          const firstManufacturer = response[0];
          if (manufactureId) {
            setAllBrandData({
              manufacturerName: firstManufacturer.manufacturerName || '',
              manufacturerDesc: firstManufacturer.manufacturerDescription || '',
              fssai: firstManufacturer.fssai || '',
              gst: firstManufacturer.gst || '',
              cin: firstManufacturer.cin || '',
              email: firstManufacturer.brandEmail || '',
              website: firstManufacturer.brandWebsite || '',
              phoneNumber: firstManufacturer.phoneNumber || '',
            });
            setAddressDetailsData({
              country: firstManufacturer.address?.country || '',
              state: firstManufacturer.address?.state || '',
              city: firstManufacturer.address?.city || '',
              pinCode: firstManufacturer.address?.pinCode || '',
              addressLine1: firstManufacturer.address?.addressLine1 || '',
              addressLine2: firstManufacturer.address?.addressLine2 || '',
            });
            setManufactureImage(firstManufacturer.logo || '');
          }
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    handleAllManufactures();
  }, [manufactureId]);

  const removeDataURLPrefix = (encoded) => {
    if (encoded.startsWith('data:image/png;base64,')) {
      return encoded.replace('data:image/png;base64,', '');
    } else if (encoded.startsWith('data:image/jpeg;base64,')) {
      return encoded.replace('data:image/jpeg;base64,', '');
    } else if (encoded.startsWith('https://storage.googleapis.com')) {
      return null;
    } else {
      return encoded;
    }
  };

  const handleCreateManufacture = () => {
    // Prepare the common payload for createManufactureNew API
    const prepareManufacturePayload = (imageUrls = '') => {
      return {
        manufacturerCode: '',
        brandName: allBrandData?.manufacturerName || '',
        manufacturerName: allBrandData?.manufacturerName || '',
        marketingName: allBrandData?.manufacturerName || '',
        manufacturerDescription: allBrandData?.manufacturerDesc || '',
        logo: imageUrls,
        type: '',
        subType: '',
        accountId: AppAccountId,
        sourceId: orgId,
        fssai: allBrandData?.fssai || '',
        gst: allBrandData?.gst || '',
        cin: allBrandData?.cin || '',
        brandEmail: allBrandData?.email || '',
        brandWebsite: allBrandData?.website || '',
        phoneNumber: allBrandData?.phoneNumber || '',
        sourceLocationId: locId,
        sourceType: 'RETAIL',
        address: {
          country: addressDetailsData?.country,
          state: addressDetailsData?.state,
          city: addressDetailsData?.city,
          pinCode: addressDetailsData.pinCode || '',
          addressLine1: addressDetailsData.addressLine1 || '',
          addressLine2: addressDetailsData.addressLine2 || '',
          createdBy: userInfo?.uidx,
          createdByName: userName,
        },
        createdBy: userInfo?.uidx,
        createdByName: userName,
      };
    };

    if (
      !allBrandData?.manufacturerName
      // !addressDetailsData?.country ||
      // !addressDetailsData?.state ||
      // !addressDetailsData?.city ||
      // !addressDetailsData?.pinCode ||
      // !allBrandData?.gst ||
      // !allBrandData?.cin ||
      // !allBrandData?.fssai
    ) {
      showSnackbar('Please fill all required details', 'error');
      return;
    }

    if (manufactureImage) {
      const uniqueImageName = `image_${Date.now()}`;
      const imagePayload = {
        uploadType: 'Manufacture',
        images: {
          [uniqueImageName]: removeDataURLPrefix(manufactureImage),
        },
      };

      createImageUrl(imagePayload)
        .then((res) => {
          const imageObject = res?.data?.data?.data || {};
          const imageUrls = Object.values(imageObject)[0] || '';
          // Call createManufactureNew with the payload including the image URLs
          const payload = prepareManufacturePayload(imageUrls);
          createManufactureNew(payload)
            .then((res) => {
              if (res?.data?.data?.es === 0) {
                navigate(-1);
                showSnackbar('Manufacturer created successfully', 'success');
              } else {
                showSnackbar('Error while creating manufacturer', 'error');
              }
            })
            .catch((err) => {
              showSnackbar('Error while creating manufacturer', 'error');
            });
        })
        .catch((error) => {
          showSnackbar('Error while uploading image', 'error');
        });
    } else {
      // If manufactureImage is null, directly call createManufactureNew
      const payload = prepareManufacturePayload();
      createManufactureNew(payload)
        .then((res) => {
          if (res?.data?.data?.es === 0) {
            navigate(-1);
            showSnackbar('Manufacturer created successfully', 'success');
          } else {
            showSnackbar('Error while creating manufacturer', 'error');
          }
        })
        .catch((err) => {
          showSnackbar('Error while creating manufacturer', 'error');
        });
    }
  };

  const handleEditManufacture = () => {
    // Function to prepare the payload for editing a manufacturer
    const prepareManufacturePayload = (imageUrls = '') => {
      return {
        manufacturerId: manufactureId,
        manufacturerCode: '',
        brandName: allBrandData?.manufacturerName || '',
        manufacturerName: allBrandData?.manufacturerName || '',
        marketingName: allBrandData?.manufacturerName || '',
        manufacturerDescription: allBrandData?.manufacturerDesc || '',
        logo: imageUrls,
        type: '',
        subType: '',
        accountId: AppAccountId,
        sourceId: orgId,
        fssai: allBrandData?.fssai || '',
        gst: allBrandData?.gst || '',
        cin: allBrandData?.cin || '',
        brandEmail: allBrandData?.email || '',
        brandWebsite: allBrandData?.website || '',
        phoneNumber: allBrandData?.phoneNumber || '',
        sourceLocationId: locId,
        address: {
          country: addressDetailsData?.country,
          state: addressDetailsData?.state,
          city: addressDetailsData?.city,
          pinCode: addressDetailsData?.pinCode || '',
          addressLine1: addressDetailsData?.addressLine1 || '',
          addressLine2: addressDetailsData?.addressLine2 || '',
          updatedBy: userInfo?.uidx,
          updatedByName: userName,
          createdBy: userInfo?.uidx,
          createdByName: userName,
        },
        updatedBy: userInfo?.uidx,
        updatedByName: userName,
      };
    };

    // Check if all required details are filled
    if (!allBrandData?.manufacturerName) {
      showSnackbar('Please fill all required details', 'error');
      return;
    }

    // Handle image
    const imageData = removeDataURLPrefix(manufactureImage);

    if (imageData) {
      const uniqueImageName = `image_${Date.now()}`;
      const imagePayload = {
        uploadType: 'Manufacture',
        images: {
          [uniqueImageName]: imageData,
        },
      };

      createImageUrl(imagePayload)
        .then((res) => {
          const imageObject = res?.data?.data?.data || {};
          const imageUrls = Object.values(imageObject)[0] || '';

          // Call editManufacture with the payload including the image URLs
          const payload = prepareManufacturePayload(imageUrls);
          editManufacture(payload)
            .then((res) => {
              if (res?.data?.data?.es === 0) {
                navigate(-1);
                showSnackbar(`Manufacturer with ${manufactureId} edited successfully`, 'success');
              } else {
                showSnackbar('Error while editing manufacturer', 'error');
              }
            })
            .catch((err) => {
              showSnackbar('Error while editing manufacturer', 'error');
            });
        })
        .catch((error) => {
          showSnackbar('Error while uploading image', 'error');
        });
    } else {
      // If imageData is null, directly call editManufacture
      const payload = prepareManufacturePayload(manufactureImage);
      editManufacture(payload)
        .then((res) => {
          if (res?.data?.data?.es === 0) {
            navigate(-1);
            showSnackbar(`Manufacturer with ${manufactureId} edited successfully`, 'success');
          } else {
            showSnackbar('Error while editing manufacturer', 'error');
          }
        })
        .catch((err) => {
          showSnackbar('Error while editing manufacturer', 'error');
        });
    }
  };

  const handleImageClick = (level) => {
    let fileInputRef;

    fileInputRef = fileInputRefManufacture;

    fileInputRef.current.click();
    fileInputRef.current.onchange = (e) => {
      if (e.target.files.length > 0) {
        handleImageChange(level, e.target.files[0]);
      }
    };
  };

  const handleImageChange = (level, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let imageBase64 = reader.result; // Base64 string of the image

      setManufactureImage(imageBase64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <SoftBox className="products-new-department-form-box">
        <div>
          <Grid container spacing={2} style={{ marginBottom: '15px' }}>
            <Grid item xs={12} md={9} lg={9} className="products-new-department-each-field">
              <label className="products-department-new-form-label">Brand Owning Company(Manufacturer)</label>
              <RequiredAsterisk />
              <SoftInput
                placeholder="Enter the manufacturer name exactly as printed in the label for better results"
                size="small"
                isLoading={allBrandLoader}
                onChange={(e) => handleManufactureName(e.target.value, 'manufacturerName')}
                name="manufacturerName"
                value={allBrandData?.manufacturerName || ''}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <div className="products-new-department-right-bar" style={{ marginTop: '30px' }}>
                {manufactureImage ? (
                  <div style={{ position: 'relative', display: 'inline-block', marginLeft: '10px' }}>
                    <img
                      src={manufactureImage}
                      alt="Manufacture"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
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
                  <button type="button" onClick={() => handleImageClick('Manufacture')}>
                    Upload Image <CloudUploadIcon sx={{ marginLeft: '8px' }} fontSize="small" />
                  </button>
                )}
              </div>
            </Grid>
          </Grid>

          <Typography className="products-department-new-form-label-2">Address</Typography>
          <Grid container spacing={2} style={{ marginBottom: '15px' }}>
            <Grid item xs={12} md={4} lg={4} className="products-new-department-each-field">
              <label className="products-department-new-form-label">Country of origin</label>

              <SoftSelect
                placeholder="Select country..."
                options={country}
                size="small"
                onChange={(option) => handleAddressChange('country', option.label)}
                value={country.find((option) => option.label === addressDetailsData?.country) || null}
                menuPortalTarget={document.body}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} className="products-new-department-each-field">
              <label className="products-department-new-form-label">State</label>

              <SoftSelect
                placeholder="Select state..."
                options={states}
                size="small"
                onChange={(option) => handleAddressChange('state', option.value)}
                value={states.find((option) => option.label === addressDetailsData?.state) || null}
                menuPortalTarget={document.body}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} className="products-new-department-each-field">
              <label className="products-department-new-form-label">City</label>

              <SoftSelect
                placeholder="Select city..."
                options={citiesOption}
                size="small"
                value={citiesOption.find((option) => option.label === addressDetailsData?.city) || null}
                onChange={(option) => handleAddressChange('city', option.label)}
                menuPortalTarget={document.body}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} className="products-new-department-each-field">
              <label className="products-department-new-form-label">Address Line 1</label>
              <SoftInput
                placeholder="Address Line 1..."
                size="small"
                value={addressDetailsData?.addressLine1}
                onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} className="products-new-department-each-field">
              <label className="products-department-new-form-label">Address Line 2</label>
              <SoftInput
                placeholder="Address Line 2..."
                size="small"
                value={addressDetailsData?.addressLine2}
                onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} className="products-new-department-each-field">
              <label className="products-department-new-form-label">Pincode</label>

              <SoftInput
                placeholder="Pincode"
                size="small"
                value={addressDetailsData?.pinCode}
                onChange={(e) => handleAddressChange('pinCode', e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginBottom: '15px' }}>
            <Grid item xs={12} className="products-new-department-each-field">
              <label className="products-department-new-form-label">Manufacturer Description</label>
              <SoftInput
                placeholder="Enter the manufacturer details"
                size="small"
                name="manufacturerDesc"
                onChange={handleInputChange}
                value={allBrandData?.manufacturerDesc || ''}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginBottom: '15px' }}>
            <Grid item xs={12} md={4} lg={4} className="products-new-department-each-field">
              <label className="products-department-new-form-label">FSSAI</label>

              <SoftInput
                placeholder="Enter FSSAI..."
                size="small"
                name="fssai"
                type="number"
                onChange={handleInputChange}
                value={allBrandData?.fssai}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} className="products-new-department-each-field">
              <label className="products-department-new-form-label">GST</label>

              <SoftInput
                placeholder="Enter GST..."
                size="small"
                name="gst"
                // type="number"
                onChange={handleInputChange}
                value={allBrandData?.gst}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} className="products-new-department-each-field">
              <label className="products-department-new-form-label">CIN</label>

              <SoftInput
                placeholder="Enter CIN..."
                size="small"
                name="cin"
                onChange={handleInputChange}
                value={allBrandData?.cin}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginBottom: '15px' }}>
            <Grid item xs={12} md={4} lg={4} className="products-new-department-each-field">
              <label className="products-department-new-form-label">Email</label>
              <SoftInput
                placeholder="Enter email..."
                name="email"
                size="small"
                type="email"
                onChange={handleInputChange}
                value={allBrandData?.email}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} className="products-new-department-each-field">
              <label className="products-department-new-form-label">Website</label>
              <SoftInput
                placeholder="Enter website..."
                name="website"
                size="small"
                onChange={handleInputChange}
                value={allBrandData?.website}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4} className="products-new-department-each-field">
              <label className="products-department-new-form-label">Phone number</label>

              <SoftInput
                placeholder="Enter phone number..."
                name="phoneNumber"
                size="small"
                type="number"
                onChange={handleInputChange}
                value={allBrandData?.phoneNumber}
              />
            </Grid>
          </Grid>
        </div>

        <SoftBox display="flex" justifyContent="flex-end" mt={4}>
          <SoftBox display="flex">
            <SoftButton className="vendor-second-btn" onClick={() => navigate(-1)}>
              Cancel
            </SoftButton>
            <SoftBox ml={2}>
              {manufactureId ? (
                <SoftButton color="info" className="vendor-add-btn" onClick={handleEditManufacture}>
                  Edit
                </SoftButton>
              ) : (
                <SoftButton color="info" className="vendor-add-btn" onClick={handleCreateManufacture}>
                  Save
                </SoftButton>
              )}
            </SoftBox>
          </SoftBox>
        </SoftBox>

        <input
          type="file"
          ref={fileInputRefManufacture}
          style={{ display: 'none' }}
          accept=".jpg, .jpeg, .png"
          onChange={(e) => handleImageChange('Manufacture', e.target.files[0])}
        />
      </SoftBox>
    </DashboardLayout>
  );
};

export default ManufactureCreate;
