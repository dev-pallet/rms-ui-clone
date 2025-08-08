import { Box, Modal } from '@mui/material';
import { checkGtinType, sortItems } from '../../../../../Common/cartUtils';
import { isSmallScreen } from '../../../../../Common/CommonFunction';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import { useState } from 'react';
import { validateCartProduct, validateCartProductWithBatch } from '../../../../../../../config/Services';
import BarcodeReader from 'react-barcode-reader';
import BatchModal from './BatchModal';

const BarcodeScannerComponent = ({ cartId, cartItems, setCartItems }) => {
  const showSnackbar = useSnackbar();
  const isMobile = isSmallScreen();
  const [batchModal, setBatchModal] = useState(false);
  const [batchList, setBatchList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [spModal, setSpModal] = useState(false);
  const [barcodeErr, setBarcodeErr] = useState(false);
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  const openModal = () => setBatchModal(true);
  const closeModal = () => setBatchModal(false);

  const errorModalStyle = {
    backgroundColor: 'white',
    color: 'white',
    position: isMobile ? 'static' : 'fixed',
    top: '40%',
    left: '35%',
    width: isMobile ? '100%' : '40%',
    borderRadius: '10px',
    border: 'no',
    textAlign: 'center',
    ...(isMobile && {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }),
    fontSize: '28px',
  };

  const batchModalStyle = {
    position: isMobile ? 'static' : 'absolute',
    top: '50%',
    left: '50%',
    width: isMobile ? '100%' : '50%',
    // maxWidth: 700,
    transform: isMobile ? 'none' : 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '10px',
    border: '1px solid #999999',
    boxShadow: 24,
    p: 4,
    maxHeight: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '1rem',

    ...(isMobile && {
      height: '100%',
    }),
  };

  const validateItemMutation = useMutation({
    mutationFn: (payload) => validateCartProduct(payload),
    onSuccess: (res) => {
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message, 'error');
        return;
      }
      if (res?.data?.data?.statusCode === 269) {
        if (res?.data?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const batchList = res?.data?.data?.data?.data.flatMap((arr) => arr.map((item) => item));
        setBatchList(batchList);
        openModal();
        return;
      }
      const newCartItems = sortItems(res?.data?.data?.data?.cartProducts);
      setCartItems(newCartItems);
      showSnackbar('Item validated', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

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
  const play = () => {
    const audio = new Audio(
      'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3'
    );
    audio.play();
  };

  const handleBarcodeErr = (e) => {
    if (barcodeErr) {
      setSpModal(false);
    } else {
      window.location.reload();
    }
  };

  const handleOnScan = (scanned) => {
    // const foundIndex = cartItems.findIndex((item) => item?.gtin === scanned);
    // if (foundIndex !== -1) {
    //   setCartItems((prev) => {
    //     const updatedItems = [...prev];
    //     updatedItems[foundIndex] = { ...updatedItems[foundIndex], isValidated: true };
    //     return updatedItems;
    //   });
    //   showSnackbar("Item found", "success");
    // } else {
    //   showSnackbar("Item not found", "error");
    // }

    const { newGtin } = checkGtinType(scanned);
    const foundItem = cartItems.find((item) => item?.gtin === newGtin);
    if (foundItem) {
      const payload = {
        cartId: cartId,
        cartProductId: foundItem?.cartProductId,
        locationId: locId,
        orgId: orgId,
        gtin: scanned,
        batchNo: foundItem?.batchNo,
        inventoryChecks: 'NO',
        mrp: foundItem?.mrp,
        sellingPrice: foundItem?.sellingPrice,
        purchasePrice: foundItem?.purchasePrice || 0,
      };
      setSelectedItem(foundItem);
      if (scanned.toLowerCase().startsWith('w')) {
        validateBatchItemMutation.mutate(payload);
        return;
      }
      validateItemMutation.mutate(payload);
    } else {
      showSnackbar('Item not found', 'error');
    }
  };

  return (
    <>
      <BarcodeReader
        onScan={handleOnScan}
        onError={(err, msg) => {
          if (err.length > 1) {
            if (msg === 'Average key character time should be less or equal 90ms') {
              setBarcodeErr(false);
            }
            if (msg === 'String length should be greater or equal 6') {
              setBarcodeErr(true);
            }
            play();
            setSpModal(true);
          }
        }}
        avgTimeByChar={120}
      />

      {spModal && (
        <Modal open={spModal} onClose={(e) => setSpModal(e)}>
          <Box sx={errorModalStyle}>
            <Box className="error-img-box">
              <img src={error} className="error-img-barcode" alt="" />
            </Box>
            <Box className="text-in-modal-box">
              <p className="text-in-modal">
                {barcodeErr
                  ? 'Invalid Barcode. Click or press enter scan again.'
                  : 'Barcode scanning failed. Click or press enter to continue'}
              </p>
              <div id="click-me" className="click-me-text" onClick={handleBarcodeErr} tabIndex={0}>
                click me
              </div>
            </Box>
          </Box>
        </Modal>
      )}

      <Modal
        open={batchModal}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        tabIndex="-1"
      >
        <Box sx={batchModalStyle}>
          <BatchModal
            setCartItems={setCartItems}
            cartId={cartId}
            batchList={batchList}
            selectedItem={selectedItem}
            closeModal={closeModal}
          />
        </Box>
      </Modal>
    </>
  );
};

export default BarcodeScannerComponent;
