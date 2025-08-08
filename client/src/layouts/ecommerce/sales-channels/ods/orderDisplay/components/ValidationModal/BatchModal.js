import './BatchModal.css';
import { IconButton, Typography } from '@mui/material';
import { sortItems } from '../../../../../Common/cartUtils';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import { useState } from 'react';
import { validateCartProductWithBatch } from '../../../../../../../config/Services';
import CloseIcon from '@mui/icons-material/Close';
import LayersIcon from '@mui/icons-material/Layers';
import StyledButton from '../../../../../../../components/StyledButton';

const BatchModal = ({ setCartItems, cartId, batchList, selectedItem, closeModal }) => {
  const showSnackbar = useSnackbar();
  const [selectedValue, setSelectedValue] = useState(0);
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  const validateBatchItemMutation = useMutation({
    mutationFn: (payload) => validateCartProductWithBatch(payload),
    onSuccess: (res) => {
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message, 'error');
        return;
      }
      const newCartItems = sortItems(res?.data?.data?.data?.cartProducts);
      setCartItems(newCartItems);
      showSnackbar('Item validated', 'success');
      closeModal();
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedBatch = batchList[selectedValue] || batchList[0];
    const payload = {
      cartId: cartId,
      cartProductId: selectedItem?.cartProductId,
      locationId: locId,
      orgId: orgId,
      gtin: selectedBatch?.gtin,
      batchNo: selectedBatch?.batchNo,
      mrp: selectedBatch?.mrp,
      sellingPrice: selectedBatch?.sellingPrice,
      purchasePrice: selectedBatch?.purchasePrice || 0,
    };
    validateBatchItemMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit} name="batch-form">
      <div className="batch-modal-wrapper-box">
        <div className="batch-header-box">
          <div className="batch-header-title-box">
            <div className="batch-header-icon">
              <LayersIcon fontSize="small" />
            </div>
            <div className="batch-header-title-text-box">
              <Typography variant="h5" className="batch-header-title">
                Select Batch
              </Typography>
              <div className="batch-header-subtitle">
                <Typography variant="body1">{`${selectedItem?.productName} (${selectedItem?.gtin})`}</Typography>
              </div>
            </div>
          </div>
          <IconButton aria-label="close" size="small">
            <CloseIcon fontSize="medium" onClick={closeModal} />
          </IconButton>
        </div>
        <div className="batch-option-wrapper-box">
          {batchList?.map((batch, i) => (
            <div key={i} className="select-batch-wrapper-box">
              <input
                name="batch"
                id={`batch-${i}`}
                type="radio"
                value={i}
                defaultChecked={!i}
                onChange={(e) => setSelectedValue(parseInt(e.target.value))}
              />
              <div className="select-items-container">
                <label style={{ cursor: 'pointer' }} htmlFor={`batch-${i}`}>
                  <p className="batch-select-batchno">{batch?.batchNo}</p>
                  <p className="batch-select-text">Available Units: {batch?.availableUnits}</p>
                  <p className="batch-select-text">MRP: {batch?.mrp}</p>
                  <p className="batch-select-text">Selling Price : {batch?.sellingPrice}</p>
                </label>
              </div>
            </div>
          ))}
        </div>
        <div className="select-button-box">
          <StyledButton type="submit" loading={validateBatchItemMutation?.isLoading}>
            SELECT
          </StyledButton>
        </div>
      </div>
    </form>
  );
};

export default BatchModal;
