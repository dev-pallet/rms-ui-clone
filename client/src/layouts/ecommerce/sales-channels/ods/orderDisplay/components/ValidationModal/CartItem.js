import './CartItem.css';
import { CircularProgress } from '@mui/material';
import {
  addItemThroughScanner,
  decreaseItemThroughScanner,
  deleteItemThroughScanner,
  editCart,
} from '../../../../../../../config/Services';
import { sortItems } from '../../../../../Common/cartUtils';
import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import LeafIcon from 'assets/images/Leaf_icon_15.svg';

const CartItem = ({ item, cartId, setCartItems }) => {
  const showSnackbar = useSnackbar();
  const [cartQuantity, setCartquantity] = useState('');
  const locId = localStorage.getItem('locId');

  const payload = {
    cartId: cartId,
    sellingPrice: item?.sellingPrice,
    gtin: item?.gtin,
    locationId: locId,
    mrp: item?.mrp,
    inventoryChecks: 'NO',
    batchNo: item?.batchNo,
    purchasePrice: item?.purchasePrice || '',
    quantityBySpecs: item?.quantityBySpecs,
    sellingUnit: item?.sellingUnit,
  };

  const editItemMutation = useMutation({
    mutationFn: (payload) => editCart(payload),
    onSuccess: (res) => {
      const newCartItems = sortItems(res?.data?.data?.cartProducts);
      setCartItems(newCartItems);
      showSnackbar('Item edited successfully', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const decreaseItemMutation = useMutation({
    mutationFn: (payload) => decreaseItemThroughScanner(payload),
    onSuccess: (res) => {
      const newCartItems = sortItems(res?.data?.data?.cartProducts);
      setCartItems(newCartItems);
      showSnackbar('Item quantity decreased', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const increaseItemMutation = useMutation({
    mutationFn: (payload) => addItemThroughScanner(payload),
    onSuccess: (res) => {
      const newCartItems = sortItems(res?.data?.data?.cartProducts);
      setCartItems(newCartItems);
      showSnackbar('Item quantity increased', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (payload) => deleteItemThroughScanner(payload),
    onSuccess: (res) => {
      const newCartItems = sortItems(res?.data?.data?.cartProducts);
      setCartItems(newCartItems);
      showSnackbar('Item deleted successfully', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  useMemo(() => {
    if (item?.sellingUnit === 'nos' || item?.sellingUnit === 'no' || item?.sellingUnit === 'each') {setCartquantity(item?.quantity);}
    else {setCartquantity((item?.quantityBySpecs && parseFloat(item?.quantityBySpecs).toFixed(2)) || item?.quantity);}
  }, [item]);

  const isWeighingBarcode = useMemo(() => item?.gtin?.length === 6, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const editPayload = {
      ...payload,
      qty: item?.quantityBySpecs ? '1' : cartQuantity,
      quantityBySpecs: item?.quantityBySpecs ? cartQuantity : null,
    };
    editItemMutation.mutate(editPayload);
  };

  const handleDelete = () => {
    const deletePayload = {
      ...payload,
      quantity: item?.quantity,
    };
    deleteItemMutation.mutate(deletePayload);
  };

  const handleDecrease = () => {
    const decreasePayload = { ...payload };
    decreaseItemMutation.mutate(decreasePayload);
  };

  const handleIncrease = () => {
    const increasePayload = { ...payload };
    increaseItemMutation.mutate(increasePayload);
  };

  const isLoading =
    editItemMutation?.isLoading ||
    decreaseItemMutation?.isLoading ||
    increaseItemMutation?.isLoading ||
    deleteItemMutation?.isLoading;

  const renderForm = () => (
    <form className="validate-form" onSubmit={handleSubmit} name="validate-form">
      <input
        className="cartItemInput"
        step={isWeighingBarcode ? 'any' : '1'}
        type="number"
        value={cartQuantity}
        onChange={(e) => setCartquantity(e.target.value)}
      />
    </form>
  );

  const renderValidationQuantity = () => {
    if (cartQuantity > 1) {
      return (
        <div className="items-remaining-box">
          <div className="items-remaining-count">{cartQuantity - item?.validatedQuantity}</div>
          <div className="items-remaining-label">remaining</div>
        </div>
      );
    }
  };

  return (
    <div className={`validate-cart-item-box ${item?.isValidated && 'validated-cart-item'}`}>
      <div className="validate-cart-item-left-box" onClick={handleDelete}>
        <DeleteIcon />
      </div>
      <div className="validate-cart-item-middle-box">
        <div className="validate-cart-item-name">
          <div>{`${item?.productName} (₹${item?.mrp})`}</div>
          <div>
            {isLoading && <CircularProgress className="validate-cart-item-loader" sx={{ display: 'flex' }} size={23} />}
          </div>
        </div>
        <div className="validate-cart-item-count-container">
          {isWeighingBarcode ? (
            <div className="validate-weighing-item-count-box">
              <img src={LeafIcon} alt="" className="leaf-icon" />
              {renderForm()}
              <p>{item?.sellingUnit}</p>
            </div>
          ) : (
            <div className="validate-cart-item-count-box">
              <div className="validate-cart-item-count-action" onClick={handleDecrease}>
                -
              </div>
              {renderForm()}
              <div className="validate-cart-item-count-action" onClick={handleIncrease}>
                +
              </div>
            </div>
          )}
          {renderValidationQuantity()}
        </div>
      </div>
      <div className="validate-cart-item-right-box">
        {/* {item?.isValidated && (
          <div className="check-icon">
            <CheckCircleIcon />
          </div>
        )} */}
        <div>₹{item?.subTotal.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default CartItem;
