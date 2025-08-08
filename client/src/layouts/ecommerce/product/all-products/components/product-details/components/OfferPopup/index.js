import './offerPopup.css';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../../../components/SoftBox';

const OfferPopup = ({ mrp, sellingPrice, name, offerResponse, type, freebie }) => {
  const [buyGet, setBuyGet] = useState({
    display: false,
    buyMrp: '',
    sp: '',
    buyValue: '',
    getValue: '',
    buyName: '',
    getName: '',
  });
  const [offerOnMrp, setOfferOnMrp] = useState({
    display: false,
    mainMrp: '',
    sp: '',
    offerPrice: '',
  });
  const locId = localStorage.getItem('locId');

  useEffect(() => {
    if (type === 'BUY_X_GET_Y' || type === 'BUY X GET Y') {
      setBuyGet(() => ({
        display: true,
        buyMrp: mrp,
        sp: sellingPrice,
        buyValue: offerResponse?.buyQuantity,
        getValue: offerResponse?.offerDetailsEntityList?.[0].getQuantity || 'NA',
        buyName: name,
        getName:
          offerResponse?.offerSubType === 'SAME ITEM'
            ? name
            : offerResponse?.offerDetailsEntityList?.[0].itemName || 'NA',
        freebie: freebie,
      }));
    } else if (type === 'OFFER_ON_MRP' || type === 'OFFER ON MRP') {
      setOfferOnMrp(() => ({
        display: true,
        mainMrp: mrp,
        sp: sellingPrice,
        offerPrice: Number(mrp) - Number(sellingPrice),
      }));
    }
  }, [offerResponse, mrp, sellingPrice, type]);

  return (
    <>
      {(type === 'BUY_X_GET_Y' || type === 'BUY X GET Y') && !buyGet?.freebie && (
        <SoftBox className="orientation">
          <Typography className="main-offer">{`BUY ${buyGet?.buyValue} GET ${buyGet?.getValue} FREE`}</Typography>
          <Typography className="details">{`BUY ${buyGet?.buyName} (MRP - ₹${buyGet?.buyMrp}, SP - ₹${buyGet?.sp})`}</Typography>
          <Typography className="details">{`GET ${buyGet?.getName} FREE`}</Typography>
        </SoftBox>
      )}
      {(type === 'BUY_X_GET_Y' || type === 'BUY X GET Y') && buyGet?.freebie && (
        <SoftBox className="orientation">
          <Typography className="main-offer">{'FREEBIE'}</Typography>
          <Typography className="details">{`BUY ${buyGet?.buyName} - Qty ${buyGet?.buyValue}`}</Typography>
          {/* <Typography className="details">{`MRP ${freeParentBuyMRP} - SP ${freeParentBuySP}`}</Typography> */}
          {/* <Typography className="details">{`GET ${buyGet.getName} FREE`}</Typography> */}
        </SoftBox>
      )}
      {(type === 'OFFER_ON_MRP' || type === 'OFFER ON MRP') && (
        <SoftBox className="orientation">
          <Typography className="main-offer">OFFER ON MRP</Typography>
          <Typography className="details">{`Mrp: ₹${offerOnMrp?.mainMrp}`}</Typography>
          <Typography className="details">{`Offer Price: ₹${offerOnMrp?.offerPrice}`}</Typography>
          <Typography className="details">{`Selling Price: ₹${offerOnMrp?.sp}`}</Typography>
        </SoftBox>
      )}
      {(type === 'FREE_PRODUCTS' || type === 'FREE PRODUCTS') && (
        <SoftBox className="orientation">
          <Typography>FREE PRODUCT</Typography>
        </SoftBox>
      )}
    </>
  );
};

export default OfferPopup;
