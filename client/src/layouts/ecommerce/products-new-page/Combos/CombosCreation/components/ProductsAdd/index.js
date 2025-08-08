import { Card, Grid, InputLabel, Tooltip } from '@mui/material';
import React from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftAsyncPaginate from '../../../../../../../components/SoftSelect/SoftAsyncPaginate';
import { getGlobalProducts } from '../../../../../../../config/Services';
import SoftInput from '../../../../../../../components/SoftInput';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SoftButton from '../../../../../../../components/SoftButton';
import CloseIcon from '@mui/icons-material/Close';
import SoftTypography from '../../../../../../../components/SoftTypography';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';

const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

const ProductsAdd = ({ allProducts, setAllProducts, totalValue, setTotalValue }) => {
  const locId = localStorage.getItem('locId');
  const showSnackBar = useSnackbar();

  const fetchAllGlobalProductsThroughType = (type) => {
    const loadProductsOptions = async (searchQuery, loadedOptions, additional, mainCategoryId) => {
      const page = additional.page || 1;

      const payload = {
        page: page,
        pageSize: 10,
        // names: [formData?.productTitle],
        productTypes: type,
        query: searchQuery,
        storeLocations: [locId],
        sortByCreatedAt: 'DESC',
      };

      try {
        const response = await getGlobalProducts(payload);
        if (response?.data?.status === 'ERROR' || response?.data?.data?.es > 0) {
          showSnackBar(
            response?.data?.message || response?.data?.data?.message || 'There was an error getting all products',
            'error',
          );
          return;
        } else {
          const results = response?.data?.data?.data?.data || [];

          const flatVariantData = results?.flatMap((product) =>
            product?.variants?.map((variant) => ({
              label: variant?.name,
              value: variant?.variantId,
              productId: product?.productId,
              productData: product,
              other: variant,
            })),
          );

          return {
            options: flatVariantData,
            hasMore: results?.length === 10, // If the number of results is less than pageSize, stop pagination
            additional: {
              page: page + 1, // Increment the page for the next request
            },
          };
        }
      } catch (error) {
        return {
          options: [],
          hasMore: false,
          additional: {
            page,
          },
        };
      }
    };

    return loadProductsOptions;
  };

  const handleProductChange = (id, field, value) => {
    const updatedProducts = allProducts?.map((product) => {
      if (product?.id === id) {
        if (field === 'title') {
          return {
            ...product,
            title: value,
            uom: `${value?.other?.weight} ${value?.other?.weightUnit}` || 'NA',
            salePrice: value?.other?.inventorySync?.mrp || '0',
            offerPrice: value?.other?.inventorySync?.mrp || '0',
            quantity: '1',
          };
        }
        return { ...product, [field]: value };
      }
      return product;
    });

    setAllProducts(updatedProducts);

    // Include 'title' in fields that trigger total recalculation
    if (['salePrice', 'quantity', 'offerPrice', 'title'].includes(field)) {
      const totals = updatedProducts?.reduce(
        (acc, product) => {
          const sale = parseFloat(product?.salePrice || 0);
          const offer = parseFloat(product?.offerPrice || 0);
          const qty = parseFloat(product?.quantity || 0);

          acc.totalSalePrice += sale * qty;
          acc.totalOfferPrice += offer * qty;
          acc.totalQuantity += qty;

          return acc;
        },
        {
          totalSalePrice: 0,
          totalOfferPrice: 0,
          totalQuantity: 0,
        },
      );

      setTotalValue(totals);
    }
  };

  const handleAddMoreVariants = () => {
    const newRow = [
      ...allProducts,
      {
        id: allProducts?.length + 1,
        title: '',
        uom: '',
        salePrice: '',
        quantity: '',
        offerPrice: '',
      },
    ];
    setAllProducts(newRow);
  };

  const handleCancelVariant = (index) => {
    const updatedVariantsArr = [...allProducts?.slice(0, index), ...allProducts?.slice(index + 1)];
    setAllProducts(updatedVariantsArr);
  };

  return (
    <Card sx={{ padding: '15px' }}>
      <SoftBox className="common-display-flex">
        <div className="title-heading-products">
          Add Products
          <span className="main-header-icon">
            <Tooltip title="Add Variant data">
              <InfoOutlinedIcon />
            </Tooltip>
          </span>
        </div>
      </SoftBox>
      {allProducts?.map((item, idx) => (
        <SoftBox style={{ marginTop: '10px' }}>
          <Grid container direction="row" justifyContent="flex-start" alignItems="center" gap="5px">
            <Grid item xs={2} md={3} lg={3}>
              <InputLabel className="inputLabel-style" required>
                Product Title
              </InputLabel>
              <SoftAsyncPaginate
                size="small"
                className="select-box-category"
                placeholder="Select Title..."
                value={item?.title || ''}
                loadOptions={fetchAllGlobalProductsThroughType(['MENU'])}
                additional={{
                  page: 1,
                }}
                isClearable
                onChange={(event) => {
                  handleProductChange(item?.id, 'title', event);
                }}
                menuPortalTarget={document.body}
              />
            </Grid>

            <Grid item xs={2} md={3} lg={2}>
              <InputLabel className="inputLabel-style" required disabled>
                UOM
              </InputLabel>
              <SoftInput value={item?.uom} size="small" disabled />
            </Grid>
            <Grid item xs={2} md={3} lg={2}>
              <InputLabel className="inputLabel-style" required disabled>
                Sale Price
              </InputLabel>
              <SoftInput value={item?.salePrice} size="small" disabled />
            </Grid>
            <Grid item xs={2} md={3} lg={2}>
              <InputLabel className="inputLabel-style" required>
                Quantity
              </InputLabel>
              <SoftInput
                value={item?.quantity}
                size="small"
                onChange={(event) => {
                  handleProductChange(item?.id, 'quantity', event?.target?.value || '');
                }}
              />
            </Grid>
            <Grid item xs={2} md={3} lg={2}>
              <InputLabel className="inputLabel-style" required>
                Offer Price
              </InputLabel>
              <SoftInput
                value={item?.offerPrice}
                size="small"
                onChange={(event) => {
                  handleProductChange(item?.id, 'offerPrice', event?.target?.value || '');
                }}
              />
            </Grid>
            {allProducts?.length > 1 && (
              <CloseIcon
                onClick={() => handleCancelVariant(idx)}
                style={{ color: 'red', fontSize: '18px', cursor: 'pointer' }}
              />
            )}
          </Grid>
        </SoftBox>
      ))}
      <SoftBox style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
        <SoftButton
          className="smallBtnStyle"
          size="small"
          variant="outlined"
          color="info"
          onClick={handleAddMoreVariants}
        >
          + Add More
        </SoftButton>
      </SoftBox>

      <SoftBox style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-start' }}>
        <div className="bundleProduct-box">
          <div>
            <InputLabel className="labeltitle">Total Sale price Value</InputLabel>
            <SoftTypography>{totalValue?.totalSalePrice}</SoftTypography>
          </div>

          <div>
            <InputLabel className="labeltitle">Total Quantity</InputLabel>
            <SoftTypography>{totalValue?.totalQuantity}</SoftTypography>
          </div>
          <div>
            <InputLabel className="labeltitle">Bundle sale price</InputLabel>
            <SoftTypography>{totalValue?.totalOfferPrice}</SoftTypography>
          </div>
        </div>
      </SoftBox>

      <div style={{ marginTop: '15px' }}>
        <SoftTypography fontSize="0.85rem">
          <WarningOutlinedIcon style={{ color: 'orange' }} fontSize="small" /> This offer price is applicable only on
          bundle sales and does not affect sale price when sold individually
        </SoftTypography>
      </div>
    </Card>
  );
};

export default ProductsAdd;
