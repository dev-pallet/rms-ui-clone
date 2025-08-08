import React, { useState } from 'react';
import { Dialog, DialogTitle, Checkbox, FormControlLabel, InputLabel, TextField, Button, Radio } from '@mui/material';
import SoftTypography from '../../../../components/SoftTypography';
import InfoIcon from '@mui/icons-material/Info';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import { unMergeProductsapi } from '../../../../config/Services';
import { noImage } from '../../Common/CommonFunction';
import Spinner from '../../../../components/Spinner';

const UnmergeProductDialog = ({ open, handleClose, productName, variantDetails, productId }) => {
  const locId = localStorage.getItem('locId');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [newProductName, setNewProductName] = useState('');
  const [loader, setLoader] = useState(false);

  const handleVariantRadioChange = (index, variant) => {
    setSelectedVariant(variant);
  };

  const handleUnmerge = () => {
    if (selectedVariant.length === 0 || !newProductName) {
      alert('Please select at least one variant and provide a new product name.');
      return;
    }
    setLoader(true);

    const payload = {
      name: newProductName,
      variantId: selectedVariant?.variantId || '',
      locationId: locId.toLocaleLowerCase(),
      productId: productId || '',
    };

    unMergeProductsapi(payload)
      .then((res) => {
        setLoader(false);
        handleClose();
      })
      .catch((err) => {
        setLoader(false);
        handleClose();
      });
  };

  return (
    <Dialog
      open={open}
      keepMounted
      maxWidth={false}
      PaperProps={{
        style: {
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          width: '85vw',
          height: '90vh',
        },
      }}
      BackdropProps={{
        style: {
          backdropFilter: 'blur(3px)',
        },
      }}
      onClose={handleClose}
    >
      <DialogTitle style={{ borderBottom: '1px solid #e0e0e0', padding: '0px', marginBottom: '0px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <SoftTypography style={{ fontSize: '1.2rem', fontWeight: '600' }}>Unmerge Product</SoftTypography>
        </div>
      </DialogTitle>
      <SoftTypography
        style={{
          fontSize: '0.75rem',
          fontWeight: '500',
          marginBottom: '20px',
          backgroundColor: '#f0f4f8',
          padding: '10px',
          borderRadius: '5px',
          margin: '5px 5px',
          alignContent: 'center',
        }}
      >
        <InfoIcon style={{ fontSize: 'large', marginRight: '10px' }} />
        Select the variants to unmerge from the product <strong>{productName}</strong> and provide a new product name.
      </SoftTypography>

      <div style={{ width: '100%', marginBottom: '20px' }}>
        <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#344767' }}>
          New Product Name
        </InputLabel>
        <TextField
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Enter new product name"
          fullWidth
          size="small"
        />
      </div>

      <div
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          padding: '10px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          height: '300px',
          overflow: 'scroll',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {variantDetails?.map((variant, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
              }}
            >
              <div style={{ paddingInline: '10px', flex: '0 0 50px' }}>
                <FormControlLabel
                  control={
                    <Radio
                      name="variant"
                      checked={selectedVariant?.barcodes?.[0] === variant.barcodes?.[0]}
                      onChange={() => handleVariantRadioChange(index, variant)}
                    />
                  }
                  label=""
                />
              </div>
              <div style={{ paddingInline: '10px', flex: '0 0 50px' }}>
                <img
                  src={variant?.images?.front || noImage}
                  alt="img"
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                />
              </div>
              <div style={{ paddingInline: '10px', flex: '1 1 auto' }}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Barcode</InputLabel>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{variant?.barcodes?.[0] || ''}</span>
              </div>
              <div style={{ paddingInline: '10px', flex: '1 1 auto' }}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Mrp</InputLabel>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {variant?.mrpData?.[0]?.currencySymbol}
                  {variant?.mrpData?.[0]?.mrp}
                </span>
              </div>
              <div style={{ paddingInline: '10px', flex: '1 1 auto' }}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Weight</InputLabel>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {variant?.weight} {variant?.weightUnit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SoftBox display="flex" justifyContent="flex-end" style={{ paddingTop: '10px' }}>
        <SoftButton className="vendor-second-btn" onClick={handleClose} style={{ marginRight: '10px' }}>
          Cancel
        </SoftButton>
        {loader ? (
          <div style={{ margin: '0px 15px', display: 'flex' }}>
            <Spinner size={'1.2rem'} />
          </div>
        ) : (
          <SoftButton color="primary" className="vendor-add-btn" onClick={handleUnmerge}>
            Unmerge
          </SoftButton>
        )}
      </SoftBox>
    </Dialog>
  );
};

export default UnmergeProductDialog;
