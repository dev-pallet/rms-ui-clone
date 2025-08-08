import './po-lst-card.css';
import { CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import clsx from 'clsx';
import CommonStatus from '../../../Common/mobile-new-ui-components/status';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { dateFormatterTwo, getTimeAgo, textFormatter } from '../../../Common/CommonFunction';
import CommonId from '../../../Common/mobile-new-ui-components/common-id';
import { getPoProducts } from '../../../../../config/Services';

const PoListcard = ({
  poDiscount,
  poDiscountType,
  poGrossAmount,
  poPiNumber,
  poPoNumber,
  poVendorName,
  poStatus,
  poOrderedOn,
  poEXpDate,
  poCreatedDate,
  totalPoProducts,
}) => {
  const navigate = useNavigate();
  const [openProducts, setOpenProducts] = useState(false);
  const [poProducts, setPoProducts] = useState([]);
  const [poProductsLoader, setPoProductsLoader] = useState(false);

  //navigating to po details page
  const onClickHandler = () => {
    navigate(`/purchase/purchase-orders/details/${poPoNumber}`);
  };

  const openProductsHandler = (e) => {
    e.stopPropagation();
    if (!openProducts && poProducts?.length === 0) {
      fetchPoProducts();
    }
    setOpenProducts(!openProducts);
  };

  const fetchPoProducts = async () => {
    try {
      setPoProductsLoader(true);
      const payload = {
        poNumber: [poPoNumber],
        page: 1,
        size: 5,
      };
      const response = await getPoProducts(payload);
      setPoProducts(response?.data?.data?.purchaseOrderItemList);
      setPoProductsLoader(false);
    } catch (error) {
      setPoProductsLoader(false);
    }
  };

  return (
    <div className="listing-card-main-bg">
      <div className="stack-row-center-between pi-number-staus-main-div">
        <div className="stack-row-center-between po-gap-5">
          <CommonId id={poPoNumber} />
          <span className="po-typo">From</span>
          <CommonId id={poPiNumber} />
        </div>
        <div className="pi-toolbar-status-main-div">
          <CommonStatus status={poStatus} />
        </div>
      </div>

      <div className="pi-card-info-app">
        <div className="pi-card-products-main-div">
          {openProducts &&
            (poProductsLoader ? (
              <div className="circular-progress-div">
                <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
              </div>
            ) : (
              <div className="pi-card-products-ul-main-div">
                <ul className="unordered-list-pi-app">
                  {poProducts?.map((item) => (
                    <li>
                      <div className="pi-app-li">
                        <span className="productName-pi-card">{textFormatter(item?.itemName)}</span>
                        <span className="productQty-pi-card">({item?.quantityOrdered} Qty)</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          <div className="pi-card-products-trigger" onClick={openProductsHandler}>
            <span className="pi-card-product-count">
              {/* {totalPoProducts} DO NOT REMOVE THIS CODE   */}
              Products
            </span>
            {openProducts ? (
              <ChevronUpIcon
                style={{
                  width: '0.5rem',
                  height: '0.5rem',
                }}
              />
            ) : (
              <ChevronDownIcon
                style={{
                  width: '0.5rem',
                  height: '0.5rem',
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div style={{ width: '100%', lineHeight: '100%' }} onClick={onClickHandler}>
        <span className="view-details-app">View details</span>
        <div className="stack-row-center-between pi-number-staus-main-div margin-t-12">
          <div className="stack-row-center-between po-gap-5">
            <span className="po-typo po-overflow-hidden">Exp. By</span>
            <span className="po-exp-date-box">{dateFormatterTwo(poEXpDate)}</span>
          </div>
          <div className="stack-row-center-between po-gap-5">
            <span className="po-typo po-overflow-hidden">Est. Value</span>
            <span className="po-exp-date-box">₹{poGrossAmount}</span>
          </div>
        </div>
        <div className="po-created-date margin-t-12">{dateFormatterTwo(poCreatedDate)}</div>
      </div>
    </div>
  );
};

export default PoListcard;
