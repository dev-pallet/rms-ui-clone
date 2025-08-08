import React, { useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { CircularProgress, Grid, Typography } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftInput from '../../../../../components/SoftInput';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import SoftButton from '../../../../../components/SoftButton';

const RecipeCreation = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [selectedVariant, setSelectedVariant] = useState('');
  const [loader, setLoader] = useState(false);
  const [selectedServingAddons, setSelectedServingAddons] = useState([]);
  const [rawMaterialsData, setRawMaterialsData] = useState([
    {
      id: 1,
      srNo: '',
      item: '',
      qty: '',
      specification: '',
    },
  ]);

  const [recipeAddons, setRecipeAddons] = useState([
    {
      id: 1,
      srNo: '',
      item: '',
      qty: '',
      specification: '',
    },
  ]);

  const handleVariantChange = (event) => {
    setSelectedVariant(event.target.value);
  };

  const addMoreRawMaterials = () => {
    setRawMaterialsData([
      ...rawMaterialsData,
      { id: rawMaterialsData.length + 1, srNo: '', item: '', qty: '', specification: '' },
    ]);
  };

  const removeRawMaterials = (id) => {
    setRawMaterialsData(rawMaterialsData.filter((form) => form.id !== id));
  };

  const addMoreRecipeAddons = () => {
    setRecipeAddons([...recipeAddons, { id: recipeAddons.length + 1, srNo: '', item: '', qty: '', specification: '' }]);
  };

  const removeRecipeAddons = (id) => {
    setRecipeAddons(recipeAddons.filter((form) => form.id !== id));
  };

  const servingAddOns = ['Dine in', 'Takeaway', 'Delivery'];

  const [addonsData, setAddonsData] = useState({});

  const handleServingAddonsChange = (item) => {
    const updatedSelectedAddons = selectedServingAddons.includes(item)
      ? selectedServingAddons.filter((addon) => addon !== item)
      : [...selectedServingAddons, item];

    setSelectedServingAddons(updatedSelectedAddons);

    if (!addonsData[item] && updatedSelectedAddons.includes(item)) {
      setAddonsData({
        ...addonsData,
        [item]: [{ srNo: '', item: '', qty: '', specification: '' }]
      });
    } else if (!updatedSelectedAddons.includes(item)) {
      const newAddonsData = { ...addonsData };
      delete newAddonsData[item];
      setAddonsData(newAddonsData);
    }
  };

  const handleAddonInputChange = (addonItem, addonIndex, field, value) => {
    setAddonsData({
      ...addonsData,
      [addonItem]: addonsData[addonItem].map((addon, index) =>
        index === addonIndex ? { ...addon, [field]: value } : addon,
      ),
    });
  };

  const addMoreServingAddons = (addonItem) => {
    setAddonsData({
      ...addonsData,
      [addonItem]: [...addonsData[addonItem], { srNo: '', item: '', qty: '', specification: '' }],
    });
  };

  const removeServingAddons = (addonItem, addonIndex) => {
    setAddonsData({
      ...addonsData,
      [addonItem]: addonsData[addonItem].filter((_, index) => index !== addonIndex),
    });
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox className="products-new-main-box">
          <Typography className="products-new-online-category-heading">New Recipe</Typography>
          <SoftBox className="products-new-department-form-box">
            <Grid container spacing={3}>
              <Grid item lg={4}>
                <label className="products-department-new-form-label">Category</label>
                <SoftSelect placeholder="Select..." size="small" />
              </Grid>
              <Grid item lg={4}>
                <label className="products-department-new-form-label">Sub-category</label>
                <SoftSelect placeholder="Select..." size="small" />
              </Grid>
            </Grid>

            <Grid container spacing={3} mt={1}>
              <Grid item lg={4}>
                <label className="products-department-new-form-label">Item</label>
                <SoftSelect placeholder="Select..." size="small" />
              </Grid>
              <Grid item lg={4}>
                <label className="products-department-new-form-label">Variant</label>
                <SoftBox className="dynamic-coupon-gap">
                  <div>
                    <input
                      type="radio"
                      id="small"
                      name="small"
                      value="small"
                      className="dynamic-coupon-marginright-10"
                      checked={selectedVariant === 'small'}
                      onChange={handleVariantChange}
                    />
                    <label for="small" className="dynamic-coupon-label-typo">
                      Small
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="large"
                      name="large"
                      value="large"
                      className="dynamic-coupon-marginright-10"
                      checked={selectedVariant === 'large'}
                      onChange={handleVariantChange}
                    />
                    <label for="large" className="dynamic-coupon-label-typo">
                      Large
                    </label>
                  </div>
                </SoftBox>
              </Grid>
            </Grid>

            <SoftBox style={{ marginTop: '20px' }}>
              <label className="products-department-new-form-label">Add raw materials</label>
              {rawMaterialsData.map((item) => (
                <Grid container spacing={3}>
                  <Grid item lg={1}>
                    <label className="products-department-new-form-label">S no.</label>
                    <SoftInput placeholder="Enter..." size="small" value={item?.srNo} />
                  </Grid>
                  <Grid item lg={3}>
                    <label className="products-department-new-form-label">Title</label>
                    <SoftInput placeholder="Enter..." size="small" value={item?.item} />
                  </Grid>
                  <Grid item lg={2}>
                    <label className="products-department-new-form-label">Quantity</label>
                    <SoftInput placeholder="Enter..." size="small" value={item?.qty} />
                  </Grid>
                  <Grid item lg={2}>
                    <label className="products-department-new-form-label">Specification</label>
                    <SoftInput placeholder="Enter..." size="small" value={item?.specification} />
                  </Grid>
                  <Grid item lg={1}>
                    {rawMaterialsData.length > 1 && (
                      <CloseIcon
                        onClick={() => removeRawMaterials(item.id)}
                        style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                      />
                    )}
                  </Grid>
                </Grid>
              ))}
              <Typography type="button" onClick={addMoreRawMaterials} className="products-new-department-addmore-btn">
                + Add more
              </Typography>
            </SoftBox>

            <SoftBox style={{ marginTop: '20px' }}>
              <label className="products-department-new-form-label">Recipe Add ons</label>
              {recipeAddons.map((item) => (
                <Grid container spacing={3}>
                  <Grid item lg={1}>
                    <label className="products-department-new-form-label">S no.</label>
                    <SoftInput placeholder="Enter..." size="small" value={item?.srNo} />
                  </Grid>
                  <Grid item lg={3}>
                    <label className="products-department-new-form-label">Title</label>
                    <SoftInput placeholder="Enter..." size="small" value={item?.item} />
                  </Grid>
                  <Grid item lg={2}>
                    <label className="products-department-new-form-label">Quantity</label>
                    <SoftInput placeholder="Enter..." size="small" value={item?.qty} />
                  </Grid>
                  <Grid item lg={2}>
                    <label className="products-department-new-form-label">Specification</label>
                    <SoftInput placeholder="Enter..." size="small" value={item?.specification} />
                  </Grid>
                  <Grid item lg={1}>
                    {recipeAddons.length > 1 && (
                      <CloseIcon
                        onClick={() => removeRecipeAddons(item?.id)}
                        style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                      />
                    )}
                  </Grid>
                </Grid>
              ))}
              <Typography type="button" onClick={addMoreRecipeAddons} className="products-new-department-addmore-btn">
                + Add more
              </Typography>
            </SoftBox>
          </SoftBox>

          <SoftBox className="products-new-department-form-box">
            <label className="products-department-new-form-label">Serving Add ons</label>
            {servingAddOns.map((item) => (
              <div key={item} style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'start', marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id={`platform-${item}`}
                    name={`platform-${item}`}
                    checked={selectedServingAddons.includes(item)}
                    onChange={() => handleServingAddonsChange(item)}
                  />
                  <label htmlFor={`platform-${item}`} className="products-department-new-form-label">
                    {item}
                  </label>
                </div>
                {selectedServingAddons.includes(item) && (
                  <div key={`grid-${item}`}>
                    {addonsData[item]?.map((addon, index) => (
                      <Grid container spacing={3} key={index}>
                        <Grid item lg={1}>
                          <label className="products-department-new-form-label">S no.</label>
                          <SoftInput
                            placeholder="Enter..."
                            size="small"
                            value={addon?.srNo}
                            onChange={(e) => handleAddonInputChange(item, index, 'srNo', e.target.value)}
                          />
                        </Grid>
                        <Grid item lg={3}>
                          <label className="products-department-new-form-label">Title</label>
                          <SoftInput
                            placeholder="Enter..."
                            size="small"
                            value={addon?.item}
                            onChange={(e) => handleAddonInputChange(item, index, 'item', e.target.value)}
                          />
                        </Grid>
                        <Grid item lg={2}>
                          <label className="products-department-new-form-label">Quantity</label>
                          <SoftInput
                            placeholder="Enter..."
                            size="small"
                            value={addon?.qty}
                            onChange={(e) => handleAddonInputChange(item, index, 'qty', e.target.value)}
                          />
                        </Grid>
                        <Grid item lg={2}>
                          <label className="products-department-new-form-label">Specification</label>
                          <SoftInput
                            placeholder="Enter..."
                            size="small"
                            value={addon?.specification}
                            onChange={(e) => handleAddonInputChange(item, index, 'specification', e.target.value)}
                          />
                        </Grid>
                        <Grid item lg={1}>
                          {addonsData[item]?.length > 1 && (
                            <CloseIcon
                              onClick={() => removeServingAddons(item, index)}
                              style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                            />
                          )}
                        </Grid>
                      </Grid>
                    ))}
                    <Typography
                      type="button"
                      onClick={() => addMoreServingAddons(item)}
                      className="products-new-department-addmore-btn"
                    >
                      + Add more
                    </Typography>
                  </div>
                )}
              </div>
            ))}
          </SoftBox>

          <SoftBox display="flex" justifyContent="flex-end" mt={4}>
            <SoftBox display="flex">
              <SoftButton className="vendor-second-btn" onClick={() => navigate(-1)}>
                Cancel
              </SoftButton>
              <SoftBox ml={2}>
                <SoftButton color="info" className="vendor-add-btn">
                  {loader ? (
                    <CircularProgress
                      size={18}
                      sx={{
                        color: '#fff',
                      }}
                    />
                  ) : (
                    <>Save</>
                  )}
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default RecipeCreation;
