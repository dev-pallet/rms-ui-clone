import './index.css';
import {
  CircularProgress,
  Modal,
} from '@mui/material';
import { ProductsListTable } from '../product-list-table/productsListTable';
import { buttonStyles } from '../../../../../../Common/buttonColor';
import { isSmallScreen } from '../../../../../../Common/CommonFunction';
import { useDebounce } from 'usehooks-ts';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftButton from '../../../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../../../components/SoftTypography';

export const ProductsListModal = ({
  modalStatus,
  tableRows,
  totalPages,
  totalResults,
  pageState,
  setPageState,
  selectedProducts,
  setSelectedProducts,
  selectDeselectProducts,
  setModalStatus,
  allSelected,
  setAllSelected,
  selectedProductBeforeSave,
  setSelectedProductBeforeSave,
  setProductSearchValue,
  productSearchValue,
  productGroupItemLoader,
}) => {
  const isMobileDevice = isSmallScreen();
  const [productSearchedValue, setProductSearchedValue] = useState(null);
  const debouncedSearchProductTerm = useDebounce(productSearchedValue, 500);

  useEffect(() => {
    if (debouncedSearchProductTerm !== null) {
      setProductSearchValue(debouncedSearchProductTerm);
    }
  }, [debouncedSearchProductTerm]);

  //   modal
  const [openModal, setOpenModal] = useState(false);
  const [modalSaveLoader, setModalSaveLoader] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalStatus(false);
  };

  useEffect(() => {
    if (modalStatus === true) {
      handleOpenModal();
    }
    if (modalStatus === false) {
      handleCloseModal();
    }
  }, [modalStatus]);

  const handleSearchProductValue = (value) => {
    setProductSearchedValue(value);
  };

  return (
    <Modal
      // sx={{width:'60%'}}
      open={openModal}
      // onClose={handleCloseModal}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        initial={{ y: 100, x: 0 }}
        animate={{ y: 0, x: 0 }}
        transition={{
          type: 'linear',
        }}
        style={{
          padding: '20px 20px 0px',
          overflow: 'hidden',
        }}
        className={isMobileDevice ? 'products-list-modal-div-mobile ' : 'products-list-modal-div'}
      >
        <div className="stock-count-create-product-popup-heading">
          <SoftTypography fontSize="14px" fontWeight="bold" color="primary">
            {totalResults} Products Found
          </SoftTypography>
          {/* <input
            type="text"
            placeholder="Search Products"
            className="search-products-input-create-stock"
            onChange={(e) => handleSearchProductValue(e.target.value)}
          /> */}
        </div>
        <SoftBox
          // className="products-list-modal"
          height={'80%'}
          // height={'100%'}
          mt={2}
          mb={2}
        >
          {productGroupItemLoader ? (
            <div className="circular-progress-loader-div">
              <CircularProgress sx={{ color: '#0562fb !important' }} />
            </div>
          ) : (
            <ProductsListTable
              selectedProductBeforeSave={selectedProductBeforeSave}
              setSelectedProductBeforeSave={setSelectedProductBeforeSave}
              setAllSelected={setAllSelected}
              allSelected={allSelected}
              tableRows={tableRows}
              totalPages={totalPages}
              totalResults={totalResults}
              pageState={pageState}
              setPageState={setPageState}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              selectDeselectProducts={selectDeselectProducts}
            />
          )}
          {/* </SoftBox> */}
        </SoftBox>
        <SoftBox sx={{ marginBottom: '10px !important' }}>
          <SoftBox className="header-submit-box-i">
            {/* <SoftButton
              variant="outlined"
              className="outlined-softbutton"
              onClick={() => setSelectedProducts(selectedProductsBackup)}
            >
              Discard
            </SoftButton> */}
            <SoftButton
              variant="outlined"
              className="outlined-softbutton"
              onClick={() => {
                setSelectedProducts(selectedProductBeforeSave);
                handleCloseModal();
              }}
            >
              Cancel
            </SoftButton>
            <SoftButton
              variant={buttonStyles.primaryVariant}
              onClick={() => {
                setSelectedProductBeforeSave(selectedProducts);
                handleCloseModal();
              }}
              className="vendor-add-btn contained-softbutton"
            >
              Save
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </div>
    </Modal>
  );
};
