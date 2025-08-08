import './ValidationModal.css';
import { Checkbox, FormControlLabel, IconButton, Typography } from '@mui/material';
import { createValidatedOrder, getCartDetails } from '../../../../../../../config/Services';
import { sortItems } from '../../../../../Common/cartUtils';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import BarcodeScannerComponent from './BarcodeScannerComponent';
import CartItem from './CartItem';
import CloseIcon from '@mui/icons-material/Close';
import SkeletonLoader from '../SkeletonLoader';
import StyledButton from '../../../../../../../components/StyledButton';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const ValidationModal = ({ orderId, cartId, closeModal }) => {
  const showSnackbar = useSnackbar();
  const [cartItems, setCartItems] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const cartQuery = useQuery(['cart'], () => getCartDetails(cartId), {
    retry: 2,
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      const newCartItems = sortItems(res?.data?.data?.cartProducts);
      setCartItems(newCartItems);
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
      closeModal();
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: (payload) => createValidatedOrder(payload),
    onSuccess: (res) => {
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message, 'error');
        return;
      }
      showSnackbar('Order validated', 'success');
      closeModal();
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const invalidItems = useMemo(() => cartItems?.filter((item) => !item.isValidated), [cartItems]);
  const invalidItemExist = !!invalidItems?.length;
  const validatedItemCount = cartItems.length - invalidItems.length;

  const handleProceed = () => {
    // if (invalidItemExist) {
    //   showSnackbar("Please validate all items", "error");
    //   return;
    // }
    const sessionId = localStorage.getItem('sessionId') || 'string';
    const licenseId = localStorage.getItem('licenseId') || 'string';
    const payload = {
      sessionId: sessionId,
      licenseId: licenseId,
      orderId: orderId,
      cartId: cartId,
      inventoryCheck: 'NO',
      paymentMethod: 'CREDIT_CARD',
    };
    createOrderMutation.mutate(payload);
  };

  return (
    <>
      <BarcodeScannerComponent cartId={cartId} cartItems={cartItems} setCartItems={setCartItems} />
      <div className="validate-header-box">
        <div className="validate-header-title-box">
          <div className="validate-header-icon">
            <TaskAltIcon fontSize="small" />
          </div>
          <div>
            <Typography variant="h5" className="validate-header-title">
              {`Validate Items (${validatedItemCount}/${cartItems?.length})`}
            </Typography>
            <div className="validate-header-subtitle">Scan the barcode to validate items</div>
          </div>
        </div>
        <IconButton aria-label="close" size="small" onClick={closeModal}>
          <CloseIcon fontSize="medium" />
        </IconButton>
      </div>
      {cartQuery?.isLoading || cartQuery?.isFetching ? (
        <SkeletonLoader type="order-details" />
      ) : (
        <>
          <div className="validate-content-box">
            {cartItems?.map((item) => (
              <CartItem item={item} cartId={cartId} key={item?.cartProductId} setCartItems={setCartItems} />
            ))}
          </div>
          <FormControlLabel
            control={<Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />}
            label="Proceed without validation"
          />
          <div className="validate-proceed-btn">
            <StyledButton
              disabled={!isChecked && invalidItemExist}
              onClick={handleProceed}
              loading={createOrderMutation?.isLoading}
            >
              proceed
            </StyledButton>
          </div>
        </>
      )}
    </>
  );
};

export default ValidationModal;
