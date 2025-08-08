import { Divider, Grid, Stack, Tooltip } from '@mui/material';
import { isSmallScreen } from '../../../../../Common/CommonFunction';
import BillingDataRow from './billingData';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import React from 'react';

const SalesDetailsTransaction = ({ paymentData, allData }) => {
  const isMobileDevice = isSmallScreen();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobileDevice ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '10px',
        marginTop: '20px',
        width: isMobileDevice ? '100%' : '850px',
        marginLeft: 'auto',
        marginRight: '0',
      }}
    >
      {paymentData?.length > 0 &&
        (isMobileDevice ? (
          <>
            <div className="purch-det-heading-title">Transaction history</div>

            <div
              className="indent-details-mob-card-main-container"
              style={{
                height: paymentData?.length <= 1 ? 'auto' : '200px',
                width: '100%',
                margin: 'auto',
              }}
            >
              {paymentData?.length > 0
                ? paymentData?.map((data, index) => {
                  return (
                    <div className="card-main-component pi-item-card-main-component" key={index}>
                      <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
                        <Stack>
                          <div>
                            {data?.status === 'OFFLINE' ? (
                              <CurrencyRupeeRoundedIcon
                                className="transaction-visa-icon-order"
                                style={{ marginLeft: '-5px' }}
                              />
                            ) : (
                              <CreditCardOutlinedIcon
                                className="transaction-visa-icon-order"
                                style={{ marginLeft: '-5px' }}
                              />
                            )}{' '}
                            <span className="card-desc">
                              <b> Transaction ID: </b>
                              {data?.transactionCode || 'NA'}
                            </span>
                          </div>
                          <span className="card-desc">{data?.paymentDate}</span>
                        </Stack>
                      </Stack>
                      <Divider className="common-divider-mob-cards" />
                      <Grid container>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                          <Stack>
                            <span className="card-small-title">Amount</span>
                            <div className="transaction-amount-order">
                              <div>₹ {data?.amountPaid || 0}</div>
                            </div>
                          </Stack>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                          <Stack alignItems={'flex-end'}>
                            <span className="card-small-title">Status</span>
                            <span
                              className={
                                data?.paymentStatus === 'COMPLETED'
                                  ? 'transaction-success-order'
                                  : 'transaction-failed-order'
                              }
                            >
                              {data?.paymentStatus === 'COMPLETED' ? 'Success' : data?.paymentStatus}
                            </span>
                          </Stack>
                        </Grid>
                      </Grid>
                    </div>
                  );
                })
                : null}
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              height: '220px',
              overflow: 'auto',
            }}
          >
            {paymentData?.length > 0
              ? paymentData?.map((data, index) => {
                return (
                  <div
                    className="transaction-history-data"
                    style={{
                      width: isMobileDevice ? '100%' : '500px',
                      marginTop: isMobileDevice ? '30px' : '20px',
                    }}
                  >
                    {data?.status === 'OFFLINE' ? (
                      <CurrencyRupeeRoundedIcon className="transaction-visa-icon-order" />
                    ) : (
                      <CreditCardOutlinedIcon className="transaction-visa-icon-order" />
                    )}
                    <div className="transaction-text-order" style={{ width: '80%' }}>
                      <div>
                        <b>Transaction ID: </b>
                        {data?.transactionCode?.length > 28 ? (
                          <Tooltip title={data?.transactionCode}>
                            {data?.transactionCode?.slice(0, 28) + '...'}
                          </Tooltip>
                        ) : (
                          data?.transactionCode || 'NA'
                        )}
                      </div>
                      <div>{data?.paymentDate || 'Date: NA'}</div>
                    </div>
                    <div className="transaction-text-order">
                      <b>
                          ₹
                        {data?.amountPaid?.length > 7 ? (
                          <Tooltip title={data?.amountPaid}>{data?.amountPaid?.slice(0, 7) + '...'}</Tooltip>
                        ) : (
                          data?.amountPaid || 0
                        )}
                      </b>
                    </div>
                    <div
                      className={
                        data?.paymentStatus === 'COMPLETED' ? 'transaction-success-order' : 'transaction-failed-order'
                      }
                      style={{ marginRight: '10px' }}
                    >
                      {data?.paymentStatus === 'COMPLETED' ? 'Success' : data?.paymentStatus}
                    </div>
                    {/* <MoreHorizIcon color="info" sx={{ marginRight: '10px' }} /> */}
                  </div>
                );
              })
              : null}
          </div>
        ))}
      <div
        className="sales-order-item-bill-data"
        style={{
          width: isMobileDevice ? '100%' : '262px',
          marginTop: '20px',
          marginLeft: paymentData?.length === 0 && 'auto',
          marginRight: paymentData?.length === 0 && '0',
        }}
      >
        <BillingDataRow label="Discounts" value={allData?.discountDetails?.totalDiscount || 0} />
        <BillingDataRow label="Delivery charge" value={allData?.orderBillingDetails?.deliveryCharges || 0} />
        <BillingDataRow label="Total taxable value" value={allData?.orderBillingDetails?.subTotal || 0} />
        <BillingDataRow label="IGST" value={allData?.orderBillingDetails?.igst || 0} />
        <BillingDataRow label="SGST" value={allData?.orderBillingDetails?.sgst || 0} />
        <BillingDataRow label="CGST" value={allData?.orderBillingDetails?.cgst || 0} hasDivider />
        <BillingDataRow
          label={<b>Total</b>}
          value={<b>{allData?.orderBillingDetails?.grandTotal || 0}</b>}
          hasDivider
        />
      </div>
    </div>
  );
};

export default SalesDetailsTransaction;
