import { Card, Grid, InputLabel, Tooltip, Typography } from '@mui/material';
import React from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SoftButton from '../../../../../../components/SoftButton';
import SoftSelect from '../../../../../../components/SoftSelect';
import { state } from '../../../../softselect-Data/state';
import CloseIcon from '@mui/icons-material/Close';
import spiceImage from '../../../../../../assets/images/spice.png';

const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

const AdditionalRestaurantDetails = ({ additionalAttributes, setAdditionalAttributes }) => {
  const handleAdditionalAttributesChange = (value, fieldName) => {
    setAdditionalAttributes((prev) => {
      let updatedValue;

      if (fieldName === 'returnableItem' || fieldName === 'organicProduct' || fieldName === 'ageRestrictions') {
        updatedValue = value === 'true';
      } else if (fieldName === 'allergen') {
        const currentAllergens = prev?.allergen || [];
        updatedValue = currentAllergens?.includes(value)
          ? currentAllergens?.filter((item) => item !== value)
          : [...currentAllergens, value];
      } else {
        updatedValue = value;
      }

      return {
        ...prev,
        [fieldName]: updatedValue,
      };
    });
  };

  const yesNoOptions = [
    {
      label: 'Yes',
      value: true,
    },
    {
      label: 'No',
      value: false,
    },
  ];

  const foodTypeOptions = [
    {
      label: 'Vegetarian',
      value: 'VEG',
    },
    {
      label: 'Non-vegetarian',
      value: 'NON_VEG',
    },
    {
      label: 'Vegan',
      value: 'VEGAN',
    },
  ];

  const allergenOptions = [
    {
      label: 'Peanuts',
      value: 'PEANUTS',
    },
    {
      label: 'Tree-nuts',
      value: 'TREE_NUTS',
    },
    {
      label: 'Dairy',
      value: 'DAIRY',
    },
    {
      label: 'Soy',
      value: 'SOY',
    },
    {
      label: 'Eggs',
      value: 'EGG',
    },
    {
      label: 'Wheat',
      value: 'WHEAT',
    },
    {
      label: 'Gluten free',
      value: 'GLUTEN_FREE',
    },
    {
      label: 'Seafood',
      value: 'SEAFOOD',
    },
  ];

  const spiceLevelOptions = [
    {
      label: 'No Spice',
      value: 'NO_SPICE',
      image: spiceImage,
    },
    {
      label: 'Medium',
      value: 'MEDIUM',
      image: spiceImage,
    },
    {
      label: 'Extra Spice',
      value: 'EXTRA_SPICE',
      image: spiceImage,
    },
  ];

  const handleAddMoreLang = () => {
    setAdditionalAttributes((prevState) => ({
      ...prevState,
      productTitleInlocalLang: [
        ...prevState?.productTitleInlocalLang,
        {
          id: prevState?.productTitleInlocalLang?.length + 1,
          title: '',
          language: '',
        },
      ],
    }));
  };

  const handleCancelLang = (id) => {
    setAdditionalAttributes((prev) => ({
      ...prev,
      productTitleInlocalLang: prev?.productTitleInlocalLang?.filter((item) => item?.id !== id),
    }));
  };

  return (
    <Card sx={{ padding: '15px' }}>
      <SoftBox style={{ width: '95%' }}>
        <input
          type="checkbox"
          id="additional"
          name="scheduleGroup"
          checked={additionalAttributes?.additional}
          onChange={(e) => handleAdditionalAttributesChange(e.target.checked, 'additional')}
        />
        <label className="title-heading-products" style={{ marginLeft: '10px' }}>
          Additional Product attributes
        </label>
      </SoftBox>
      {additionalAttributes?.additional && (
        <>
          <SoftBox style={{ marginTop: '10px' }}>
            <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="baseline">
              <Grid item xs={12} md={4} lg={4}>
                <SoftBox style={{ width: '95%' }}>
                  <InputLabel sx={inputLabelStyle}>Returnable Item</InputLabel>
                  <SoftBox className="stack-row-center-between width-100">
                    {yesNoOptions?.map((item) => (
                      <div key={item?.value} className="stack-row-center-start width-100">
                        <input
                          type="radio"
                          id={item?.value}
                          name="returnableItem"
                          value={item?.value}
                          checked={additionalAttributes?.returnableItem === item?.value}
                          onChange={(e) => handleAdditionalAttributesChange(e.target.value, 'returnableItem')}
                        />
                        <label htmlFor={item?.value} className="dynamic-coupon-label-typo">
                          {item?.label}
                        </label>
                      </div>
                    ))}
                  </SoftBox>
                </SoftBox>
              </Grid>
              {additionalAttributes?.returnableItem && (
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox style={{ width: '95%' }}>
                    <InputLabel sx={inputLabelStyle}>Return Within</InputLabel>
                    <SoftInput
                      size="small"
                      placeholder="Enter number of days"
                      value={additionalAttributes?.returnWithin}
                      onChange={(e) => handleAdditionalAttributesChange(e.target.value, 'returnWithin')}
                    />
                  </SoftBox>
                </Grid>
              )}
              <Grid item xs={12} md={2} lg={2}></Grid>
            </Grid>
          </SoftBox>

          <SoftBox>
            <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="baseline">
              <Grid item xs={12} md={4} lg={4}>
                <SoftBox style={{ width: '95%' }}>
                  <InputLabel sx={inputLabelStyle}>Is this an organic product</InputLabel>
                  <SoftBox className="stack-row-center-between width-100">
                    {yesNoOptions?.map((item) => (
                      <div key={item?.value} className="stack-row-center-start width-100">
                        <input
                          type="radio"
                          id={item?.value}
                          name="organicProduct"
                          value={item?.value}
                          checked={additionalAttributes?.organicProduct === item?.value}
                          onChange={(e) => handleAdditionalAttributesChange(e.target.value, 'organicProduct')}
                        />
                        <label htmlFor={item?.value} className="dynamic-coupon-label-typo">
                          {item?.label}
                        </label>
                      </div>
                    ))}
                  </SoftBox>
                </SoftBox>
              </Grid>

              <Grid item xs={12} md={2} lg={2}></Grid>
            </Grid>
          </SoftBox>

          <SoftBox>
            <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="baseline">
              <Grid item xs={12} md={6} lg={6}>
                <SoftBox style={{ width: '95%' }}>
                  <InputLabel sx={inputLabelStyle} required>Food Type</InputLabel>
                  <SoftBox className="stack-row-center-between width-100">
                    {foodTypeOptions?.map((item) => (
                      <div key={item?.value} className="stack-row-center-start width-100">
                        <input
                          type="radio"
                          id={item?.value}
                          name="foodType"
                          value={item?.value}
                          checked={additionalAttributes?.foodType === item?.value}
                          onChange={(e) => handleAdditionalAttributesChange(e.target.value, 'foodType')}
                        />
                        <label htmlFor={item?.value} className="dynamic-coupon-label-typo">
                          {item?.label}
                        </label>
                      </div>
                    ))}
                  </SoftBox>
                </SoftBox>
              </Grid>

              <Grid item xs={12} md={2} lg={2}></Grid>
            </Grid>
          </SoftBox>

          <SoftBox>
            <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="baseline">
              <Grid item xs={12} md={12} lg={12}>
                <SoftBox style={{ width: '95%' }}>
                  <InputLabel sx={inputLabelStyle}>Allergen Statements</InputLabel>
                  <SoftBox className="stack-row-center-between width-100">
                    {allergenOptions?.map((item) => (
                      <div key={item?.value} className="stack-row-center-start width-100">
                        <input
                          type="checkbox"
                          id={item?.value}
                          name="allergen"
                          value={item?.value}
                          checked={additionalAttributes?.allergen?.includes(item?.value)}
                          onChange={(e) => handleAdditionalAttributesChange(e.target.value, 'allergen')}
                        />
                        <label htmlFor={item?.value} className="dynamic-coupon-label-typo">
                          {item?.label}
                        </label>
                      </div>
                    ))}
                  </SoftBox>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>

          <SoftBox>
            <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="baseline">
              <Grid item xs={12} md={8} lg={8}>
                <SoftBox style={{ width: '95%' }}>
                  <InputLabel sx={inputLabelStyle}>Spice Level</InputLabel>
                  <SoftBox className="stack-row-center-between width-100">
                    {spiceLevelOptions?.map((item) => {
                      const isExtraSpice = item.value === 'EXTRA_SPICE';
                      const iconCount = isExtraSpice ? 2 : 1;

                      return (
                        <div key={item.value} className="stack-row-center-start width-100">
                          <input
                            type="radio"
                            id={item.value}
                            name="spiceLevel"
                            value={item.value}
                            checked={additionalAttributes?.spiceLevel === item.value}
                            onChange={(e) => handleAdditionalAttributesChange(e.target.value, 'spiceLevel')}
                          />
                          <label htmlFor={item.value} className="dynamic-coupon-label-typo">
                            {Array.from({ length: iconCount })?.map((_, index) => (
                              <img
                                key={index}
                                src={item.image}
                                alt={item?.label || ''}
                                style={{
                                  width: '15px',
                                  height: '15px',
                                  marginRight: index === iconCount - 1 ? '8px' : '4px',
                                  filter: item?.value === 'NO_SPICE' ? 'grayscale(100%)' : 'none',
                                }}
                              />
                            ))}
                            {item.label}
                          </label>
                        </div>
                      );
                    })}
                  </SoftBox>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>

          <SoftBox>
            <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="baseline">
              <Grid item xs={12} md={4} lg={4}>
                <SoftBox style={{ width: '95%' }}>
                  <InputLabel sx={inputLabelStyle}>Age Restrictions</InputLabel>
                  <SoftBox className="stack-row-center-between width-100">
                    {yesNoOptions?.map((item) => (
                      <div key={item?.value} className="stack-row-center-start width-100">
                        <input
                          type="radio"
                          id={item?.value}
                          name="ageRestrictions"
                          value={item?.value}
                          checked={additionalAttributes?.ageRestrictions === item?.value}
                          onChange={(e) => handleAdditionalAttributesChange(e.target.value, 'ageRestrictions')}
                        />
                        <label htmlFor={item?.value} className="dynamic-coupon-label-typo">
                          {item?.label}
                        </label>
                      </div>
                    ))}
                  </SoftBox>
                </SoftBox>
              </Grid>
              {additionalAttributes?.ageRestrictions && (
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox style={{ width: '95%' }}>
                    <InputLabel sx={inputLabelStyle}>Enter age</InputLabel>
                    <SoftInput
                      size="small"
                      placeholder="Enter age"
                      value={additionalAttributes?.age}
                      onChange={(e) => handleAdditionalAttributesChange(e.target.value, 'age')}
                    />
                  </SoftBox>
                </Grid>
              )}
              <Grid item xs={12} md={2} lg={2}></Grid>
            </Grid>
          </SoftBox>

          <SoftBox style={{ marginTop: '10px' }}>
            <Grid container mt={1} alignItems="center">
              <Grid xs={12} md={3} lg={3}>
                <div className="title-heading-products">Add product title in local language</div>
              </Grid>
              <Grid xs={12} md={3} lg={3}>
                <div className="common-display-flex-1">
                  <SoftButton className="smallBtnStyle" size="small" variant="outlined" color="info">
                    Try pallet IQ
                  </SoftButton>{' '}
                  {/* <ComingSoonAlert open={openComingSoon} handleClose={handleCloseComingSoon} /> */}
                  <span className="main-header-icon">
                    <Tooltip title="Create product names in local languages using AI" placement="right">
                      <InfoOutlinedIcon />
                    </Tooltip>
                  </span>
                </div>
              </Grid>
            </Grid>
            {additionalAttributes?.productTitleInlocalLang?.map((item, index) => (
              <Grid container mt={1} direction="row" alignItems="center" gap="10px">
                <Grid xs={6} md={6} lg={6}>
                  <div className="title-heading-products">Product Title</div>
                  <SoftInput
                    size="small"
                    name="localProductTitle"
                    value={item?.title}
                    onChange={(e) => {
                      const updatedLang = [...additionalAttributes?.productTitleInlocalLang];
                      updatedLang[index].title = e?.target?.value;
                      setAdditionalAttributes((prevState) => ({
                        ...prevState,
                        productTitleInlocalLang: updatedLang,
                      }));
                    }}
                  />
                </Grid>
                <Grid xs={4} md={2} lg={2}>
                  <div className="title-heading-products">Location</div>
                  <SoftSelect
                    size="small"
                    value={item?.language}
                    options={state || []}
                    onChange={(e) => {
                      const updatedLang = [...additionalAttributes?.productTitleInlocalLang];
                      updatedLang[index].language = e;
                      setAdditionalAttributes((prevState) => ({
                        ...prevState,
                        productTitleInlocalLang: updatedLang,
                      }));
                    }}
                    menuPortalTarget={document.body}
                  />
                </Grid>
                {additionalAttributes?.productTitleInlocalLang?.length > 1 && (
                  <Grid item lg={1}>
                    <CloseIcon
                      onClick={() => handleCancelLang(item?.id)}
                      style={{ color: 'red', fontSize: '18px', marginTop: '20px', cursor: 'pointer' }}
                    />
                  </Grid>
                )}
              </Grid>
            ))}
            <Typography type="button" onClick={handleAddMoreLang} className="add-lang-new-btn">
              + Add more
            </Typography>
          </SoftBox>

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
                  value={additionalAttributes.seoTags}
                  onChange={(e) => handleAdditionalAttributesChange(e.target.value, 'seoTags')}
                  placeholder="Add upto 5 words separated by comma"
                />{' '}
              </Grid>
              <Grid xs={12} md={3} lg={3}>
                <div className="common-display-flex-1">
                  <SoftButton className="smallBtnStyle" size="small" variant="outlined" color="info">
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

export default AdditionalRestaurantDetails;
