import { Card, Checkbox, Grid, InputLabel } from '@mui/material';
import { createVendorPromotions } from '../../../../../config/Services';
import React, { useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftTypography from '../../../../../components/SoftTypography';

const labelStyle = {
  fontWeight: '500 !important',
  fontSize: '0.95rem',
  color: '#344767',
  margin: '5px 5px 5px 3px',
};
const AddpromotionstoVendor = ({ handleTab }) => {
  const [checkBoxValues, setCheckBoxValues] = useState({
    END_CAPS: false,
    RACKS: false,
    PROMOTIONAL_BINS: false,
    SHOPPING_BAGS: false,
  });
  const [subCategoryFieldData, setSubCategoryFieldData] = useState({
    END_CAPS: {
      noOfEndCaps: '',
      ratePerMonth: '',
      term: '',
      total: '',
    },
    RACKS: {
      noOfRacks: '',
      ratePerMonth: '',
      term: '',
      total: '',
    },
    PROMOTIONAL_BINS: {
      noOfBins: '',
      ratePerMonth: '',
      term: '',
      total: '',
    },
    SHOPPING_BAGS: {
      slots: '',
      ratePerUnit: '',
      totalUnits: '',
      total: '',
    },
  });

  //   const [endCapFieldData , setEndCapFieldData] = useState({NO_OF_END_CAPS : "" , })
  const vendorId = localStorage.getItem('vendorId');
  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const userName = localStorage.getItem('user_name');

  function mapStateData(stateData) {
    const mappedData = [];

    for (const key in stateData) {
      const promotionType = key;
      const subCategory = [];

      for (const subKey in stateData[key]) {
        if (stateData[key][subKey]) {
          subCategory.push({
            fieldName: subKey,
            fieldValue: stateData[key][subKey].toString(),
          });
        }
      }

      mappedData.push({
        promotionType,
        flag: subCategory.length > 0,
        subCategory,
      });
    }

    return mappedData;
  }
  const handleSaveVendorPromotion = () => {
    const promotionData = mapStateData(subCategoryFieldData);
    const payload = {
      vendorId: vendorId,
      promotions: promotionData,
      createdBy: createdById,
      createdByName: userName,
    };
    createVendorPromotions(payload)
      .then((res) => {
        console.log(res?.data?.data);
      })
      .catch(() => {});
  };
  const handleSubCategoryValueChange = (subcategory, field, value) => {
    setSubCategoryFieldData((prevState) => ({
      ...prevState,
      [subcategory]: {
        ...prevState[subcategory],
        [field]: value,
      },
    }));
  };

  return (
    <Card className="addbrand-Box">
      <SoftTypography variant="label" className="label-heading">
        Promotions
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox
                  checked={checkBoxValues?.END_CAPS}
                  onChange={(e) => setCheckBoxValues((prevState) => ({ ...prevState, END_CAPS: e.target.checked }))}
                />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>End Caps</InputLabel>
              </Grid>

              {checkBoxValues?.END_CAPS && (
                <>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      No of end caps
                    </InputLabel>
                    <SoftInput
                      value={subCategoryFieldData.END_CAPS.noOfEndCaps}
                      onChange={(e) => handleSubCategoryValueChange('END_CAPS', 'noOfEndCaps', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Rate/ month
                    </InputLabel>
                    <SoftInput
                      value={subCategoryFieldData.END_CAPS.ratePerMonth}
                      onChange={(e) => handleSubCategoryValueChange('END_CAPS', 'ratePerMonth', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Term</InputLabel>
                    <SoftInput
                      value={subCategoryFieldData.END_CAPS.term}
                      onChange={(e) => handleSubCategoryValueChange('END_CAPS', 'term', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Total</InputLabel>
                    <SoftInput
                      value={subCategoryFieldData.END_CAPS.total}
                      onChange={(e) => handleSubCategoryValueChange('END_CAPS', 'total', e.target.value)}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox
                  checked={checkBoxValues?.RACKS}
                  onChange={(e) => setCheckBoxValues((prevState) => ({ ...prevState, RACKS: e.target.checked }))}
                />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>Racks (2 & 3)</InputLabel>
              </Grid>

              {checkBoxValues?.RACKS && (
                <>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      No of RACKS
                    </InputLabel>
                    <SoftInput
                      value={subCategoryFieldData.RACKS.noOfRacks}
                      onChange={(e) => handleSubCategoryValueChange('RACKS', 'noOfRacks', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Rate/ month
                    </InputLabel>
                    <SoftInput
                      value={subCategoryFieldData.RACKS.ratePerMonth}
                      onChange={(e) => handleSubCategoryValueChange('RACKS', 'ratePerMonth', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Term</InputLabel>
                    <SoftInput
                      value={subCategoryFieldData.RACKS.term}
                      onChange={(e) => handleSubCategoryValueChange('RACKS', 'term', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Total</InputLabel>
                    <SoftInput
                      value={subCategoryFieldData.RACKS.total}
                      onChange={(e) => handleSubCategoryValueChange('RACKS', 'total', e.target.value)}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox
                  checked={checkBoxValues?.PROMOTIONAL_BINS}
                  onChange={(e) =>
                    setCheckBoxValues((prevState) => ({ ...prevState, PROMOTIONAL_BINS: e.target.checked }))
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>Promotional Bins</InputLabel>
              </Grid>

              {checkBoxValues?.PROMOTIONAL_BINS && (
                <>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      No of bins
                    </InputLabel>
                    <SoftInput />
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Rate/ month
                    </InputLabel>
                    <SoftInput />
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Term</InputLabel>
                    <SoftInput />
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Total</InputLabel>
                    <SoftInput />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox
                  checked={checkBoxValues?.SHOPPING_BAGS}
                  onChange={(e) => setCheckBoxValues((prevState) => ({ ...prevState, SHOPPING_BAGS: e.target.checked }))}
                />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>Shopping bags</InputLabel>
              </Grid>

              {checkBoxValues?.SHOPPING_BAGS && (
                <>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Slots</InputLabel>
                    <SoftInput
                      value={subCategoryFieldData.SHOPPING_BAGS.slots}
                      onChange={(e) => handleSubCategoryValueChange('SHOPPING_BAGS', 'slots', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Rate/ unit
                    </InputLabel>
                    <SoftInput
                      value={subCategoryFieldData.SHOPPING_BAGS.ratePerUnit}
                      onChange={(e) => handleSubCategoryValueChange('SHOPPING_BAGS', 'ratePerUnit', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Term</InputLabel>
                    <SoftInput
                      value={subCategoryFieldData.SHOPPING_BAGS.term}
                      onChange={(e) => handleSubCategoryValueChange('SHOPPING_BAGS', 'term', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Total</InputLabel>
                    <SoftInput
                      value={subCategoryFieldData.SHOPPING_BAGS.total}
                      onChange={(e) => handleSubCategoryValueChange('SHOPPING_BAGS', 'total', e.target.value)}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>Branding on bill rolls</InputLabel>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>Dynamic coupons</InputLabel>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>Mobile app banners</InputLabel>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>App brand shop</InputLabel>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>Push notifications</InputLabel>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>Co-branded whatsapp communication</InputLabel>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>In-store flanges ,Bay breakers</InputLabel>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>Storefront LED ads</InputLabel>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Checkbox />
              </Grid>
              <Grid item xs={3}>
                <InputLabel sx={labelStyle}>Offers</InputLabel>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </SoftTypography>
      <SoftBox className="form-button-customer-vendor">
        <SoftButton className="vendor-second-btn">Cancel</SoftButton>
        <SoftButton className="vendor-add-btn" onClick={handleSaveVendorPromotion}>
          Save
        </SoftButton>
      </SoftBox>
    </Card>
  );
};

export default AddpromotionstoVendor;
