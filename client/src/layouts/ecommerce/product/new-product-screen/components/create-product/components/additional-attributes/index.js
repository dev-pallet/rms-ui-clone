import React, { useEffect, useState } from 'react';
import { Box, Card, Checkbox, FormControlLabel, Grid, Radio, RadioGroup, Tooltip } from '@mui/material';
import './index.css';
import SoftBox from '../../../../../../../../components/SoftBox';
import { isSmallScreen, textFormatter } from '../../../../../../Common/CommonFunction';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SoftSelect from '../../../../../../../../components/SoftSelect';
import SoftInput from '../../../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../../../components/SoftTypography';
import SoftButton from '../../../../../../../../components/SoftButton';
import { getClearedDetails, getProductDetails } from '../../../../../../../../datamanagement/productDetailsSlice';
import { useSelector } from 'react-redux';
import ComingSoonAlert from '../../../../../../products-new-page/ComingSoonAlert';
import { state } from '../../../../../../softselect-Data/state';

const ProductAddtionalAttributes = ({ onDataChange, isEditable }) => {
  const productData = useSelector(isEditable ? getProductDetails : getClearedDetails);

  const isMobileDevice = isSmallScreen();

  // State to hold all form values
  const [formData, setFormData] = useState({
    isReturnable: 'Yes',
    returnWith: '',
    isOrganic: false,
    certificationBody: '',
    foodCategory: 'No',
    foodType: '',
    gender: 'NA',
    localProductTitle: '',
    localLanguage: {},
    seoTags: '',
  });
  useEffect(() => {
    const newValues = {};
    newValues.isReturnable = productData?.returnable ? 'Yes' : 'No';
    newValues.localProductTitle = productData?.nativeLanguages?.[0]?.name;
    newValues.localLanguage = {
      label: productData?.nativeLanguages?.[0]?.language,
      value: productData?.nativeLanguages?.[0]?.language,
    };
    newValues.gender = productData?.attributes?.gender || 'NA';
    newValues.seoTags = productData?.tags?.[0] || '';
    newValues.foodType = productData?.attributes?.foodType || '';
    newValues.isOrganic = productData?.attributes?.regulatoryData?.organic || '';
    newValues.certificationBody = productData?.attributes?.regulatoryData?.organicCertificate || '';
    newValues.returnWith = productData?.minutesToReturnBack;

    setFormData((prevFormData) => ({
      ...prevFormData,
      ...newValues,
    }));
  }, [productData]);

  // onChange function for radio buttons
  const handleRadioChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // onChange function for checkboxes
  const handleCheckboxChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.checked });
  };

  // onChange function for text inputs
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // onChange function for select inputs
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    onDataChange(formData);
  }, [formData]);

  const [openComingSoon, setOpenComingSoon] = useState(false);

  const handleOpenComingSoon = () => {
    setOpenComingSoon(true);
  };

  const handleCloseComingSoon = () => {
    setOpenComingSoon(false);
  };

  return (
    <Card style={{ padding: '15px' }}>
      <label className="common-display-flex-1" style={{ gap: '5px' }}>
        <Checkbox name="additionalAttributes" onChange={handleCheckboxChange} />
        <div className="duplicate-warning-msg">Additional Product Attributes</div>
      </label>
      {formData?.additionalAttributes && (
        <>
          {/* Returnable */}
          <SoftBox style={{ marginTop: '10px' }}>
            <div className="title-heading-products">
              Returnable Item{' '}
              <span className="main-header-icon">
                <Tooltip title="Specify if the product can be returned after purchase" placement="right">
                  <InfoOutlinedIcon />
                </Tooltip>
              </span>
            </div>
            <Grid container mt={1} alignItems="center">
              <Grid xs={12} md={2} lg={2}>
                <RadioGroup
                  name="isReturnable"
                  defaultValue="Yes"
                  value={formData?.isReturnable}
                  onChange={handleRadioChange}
                  row
                  style={{ gap: '15px', display: 'flex', flexDirection: 'row' }}
                >
                  <FormControlLabel value="Yes" label="Yes" control={<Radio />} />
                  <FormControlLabel value="No" label="No" control={<Radio />} />
                </RadioGroup>
              </Grid>
              {formData?.isReturnable === 'Yes' && (
                <Grid xs={12} md={4} lg={4}>
                  <SoftBox className="common-display-flex">
                    <div className="duplicate-warning-msg" style={{ width: '30%' }}>
                      Return within{' '}
                    </div>
                    <SoftSelect
                      size="small"
                      className="select-box-category"
                      options={[
                        { value: '1', label: '1 day' },
                        { value: '2', label: '2 days' },
                        { value: '3', label: '3 days' },
                        { value: '4', label: '4 days' },
                        { value: '5', label: '5 days' },
                        { value: '6', label: '6 days' },
                        { value: '7', label: '7 days' },
                      ]}
                      value={{ value: formData?.returnWith, label: formData?.returnWith }}
                      onChange={(e) => handleSelectChange('returnWith', e.value)}
                    />
                  </SoftBox>
                </Grid>
              )}
            </Grid>
          </SoftBox>
          {/* Organic Product */}
          <SoftBox style={{ marginTop: '10px' }}>
            <div className="title-heading-products">
              Is this an organic product{' '}
              <span className="main-header-icon">
                <Tooltip title="Indicate if the product is certified organic" placement="right">
                  <InfoOutlinedIcon />
                </Tooltip>
              </span>
            </div>
            <Grid container mt={1} alignItems="center">
              <Grid xs={12} md={2} lg={2}>
                <SoftBox>
                  <div className="common-display-flex-1">
                    <label className="common-display-flex-1" style={{ gap: '5px' }}>
                      <Checkbox name="isOrganic" checked={formData.isOrganic} onChange={handleCheckboxChange} />
                      <span className="input-label-text">Yes</span>
                    </label>
                  </div>
                </SoftBox>
              </Grid>
              {formData?.isOrganic && (
                <Grid xs={12} md={4} lg={5}>
                  <SoftBox className="common-display-flex">
                    <div className="duplicate-warning-msg" style={{ width: '160px' }}>
                      Certification body
                    </div>
                    <SoftInput
                      size="small"
                      className="select-box-category"
                      name="certificationBody"
                      value={formData.certificationBody}
                      onChange={handleInputChange}
                    />
                  </SoftBox>
                </Grid>
              )}
            </Grid>
          </SoftBox>
          {/* Food Category */}
          <SoftBox style={{ marginTop: '10px' }}>
            <div className="title-heading-products">
              Food Category{' '}
              <span className="main-header-icon">
                <Tooltip title="Select the relevant food category to properly classify the product" placement="right">
                  <InfoOutlinedIcon />
                </Tooltip>
              </span>
            </div>
            <Grid container mt={1} alignItems="center">
              <Grid xs={12} md={2} lg={2}>
                <RadioGroup
                  name="foodCategory"
                  defaultValue="No"
                  value={formData.foodCategory}
                  onChange={handleRadioChange}
                  row
                  style={{ gap: '15px', display: 'flex', flexDirection: 'row' }}
                >
                  <FormControlLabel value="Yes" label="Yes" control={<Radio />} />
                  <FormControlLabel value="No" label="No" control={<Radio />} />
                </RadioGroup>
              </Grid>
              {formData?.foodCategory === 'Yes' && (
                <Grid xs={12} md={4} lg={5}>
                  <SoftBox className="common-display-flex">
                    <div className="duplicate-warning-msg" style={{ width: '160px' }}>
                      Food Type
                    </div>
                    <SoftSelect
                      size="small"
                      className="select-box-category"
                      value={{ value: formData?.foodType, label: textFormatter(formData?.foodType || '') }}
                      options={[
                        { value: 'VEG', label: 'Veg' },
                        { value: 'VEGAN', label: 'Vegan' },
                        { value: 'NON_VEG', label: 'Non - veg' },
                        { value: 'NA', label: 'Not applicable' },
                      ]}
                      onChange={(e) => handleSelectChange('foodType', e.value)}
                    />
                  </SoftBox>
                </Grid>
              )}
            </Grid>
          </SoftBox>
          {/* GENDER */}
          <SoftBox style={{ marginTop: '10px' }}>
            <div className="title-heading-products">
              Gender{' '}
              <span className="main-header-icon">
                <Tooltip title="Specify if the product is gender-specific or unisex" placement="right">
                  <InfoOutlinedIcon />
                </Tooltip>
              </span>
            </div>
            <Grid container mt={1} alignItems="center">
              <Grid xs={12} md={6} lg={6}>
                <RadioGroup
                  name="gender"
                  defaultValue={formData.gender}
                  value={formData.gender}
                  onChange={handleRadioChange}
                  row
                  style={{ gap: '15px', display: 'flex', flexDirection: 'row' }}
                >
                  <FormControlLabel value="MEN" label="Men" control={<Radio />} />
                  <FormControlLabel value="WOMEN" label="Women" control={<Radio />} />
                  <FormControlLabel value="UNISEX" label="Unisex" control={<Radio />} />
                  <FormControlLabel value="NA" label="Not Applicable" control={<Radio />} />
                </RadioGroup>
              </Grid>
            </Grid>
          </SoftBox>
          {/* Language */}
          <SoftBox style={{ marginTop: '10px' }}>
            <Grid container mt={1} alignItems="center">
              <Grid xs={12} md={3} lg={3}>
                <div className="title-heading-products">Add product title in local language</div>
              </Grid>
              <Grid xs={12} md={3} lg={3}>
                <div className="common-display-flex-1">
                  <SoftButton
                    className="smallBtnStyle"
                    size="small"
                    variant="outlined"
                    color="info"
                    onClick={handleOpenComingSoon}
                  >
                    Try pallet IQ
                  </SoftButton>{' '}
                  <ComingSoonAlert open={openComingSoon} handleClose={handleCloseComingSoon} />
                  <span className="main-header-icon">
                    <Tooltip title="Create product names in local languages using AI" placement="right">
                      <InfoOutlinedIcon />
                    </Tooltip>
                  </span>
                </div>
              </Grid>
            </Grid>
            <Grid container mt={1} direction="row" alignItems="center" gap="10px">
              <Grid xs={6} md={6} lg={6}>
                <div className="title-heading-products">Product Title</div>
                <SoftInput
                  size="small"
                  name="localProductTitle"
                  value={formData.localProductTitle}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid xs={4} md={2} lg={2}>
                <div className="title-heading-products">Location</div>
                <SoftSelect
                  size="small"
                  value={formData.localLanguage}
                  options={state || []}
                  onChange={(value) => handleSelectChange('localLanguage', value)}
                  menuPortalTarget={document.body}
                />
              </Grid>
            </Grid>
          </SoftBox>
          {/* SEO TAGS */}

          <SoftBox style={{ marginTop: '10px' }}>
            <div className="title-heading-products">
              SEO Tags{' '}
              <span className="main-header-icon">
                <Tooltip title="Add keywords to improve the product's searchability" placement="right">
                  <InfoOutlinedIcon />
                </Tooltip>
              </span>
            </div>
            <Grid container alignItems="center" gap="10px">
              <Grid xs={12} md={6} lg={8}>
                <SoftInput
                  size="small"
                  name="seoTags"
                  value={formData.seoTags}
                  onChange={handleInputChange}
                  placeholder="Add upto 5 words separated by comma"
                />{' '}
              </Grid>
              <Grid xs={12} md={3} lg={3}>
                <div className="common-display-flex-1">
                  <SoftButton
                    className="smallBtnStyle"
                    size="small"
                    variant="outlined"
                    color="info"
                    onClick={handleOpenComingSoon}
                  >
                    Try pallet IQ
                  </SoftButton>{' '}
                  <span className="main-header-icon">
                    <Tooltip title="Detect relevant keywords using AI" placement="right">
                      <InfoOutlinedIcon />
                    </Tooltip>
                  </span>
                </div>
              </Grid>
            </Grid>
          </SoftBox>
        </>
      )}
    </Card>
  );
};

export default ProductAddtionalAttributes;
