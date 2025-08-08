import { Divider, Grid, Stack, Tooltip } from '@mui/material';
import { isSmallScreen } from '../../../../../Common/CommonFunction';
import BillingDataRow from './billingData';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import React from 'react';

const SalesDetailsReturn = ({ refundData, returnInitiatedby, refundInitiatedby, allData }) => {
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
      <div>
        {refundData?.length > 0 && (
          <div>
            {isMobileDevice ? (
              <>
                <div className="purch-det-heading-title">Transaction history</div>

                <div
                  className="indent-details-mob-card-main-container"
                  style={{
                    height: refundData?.length <= 1 ? 'auto' : '200px',
                    width: '100%',
                    margin: 'auto',
                  }}
                >
                  {refundData?.length > 0
                    ? refundData?.map((data, index) => {
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
                                )}
                                <span className="card-desc">
                                  <b> Transaction ID: </b>
                                  {data?.transactionCode || 'NA'}
                                </span>
                              </div>
                              <span className="card-desc">{data?.createdDate || 'NA'}</span>
                            </Stack>
                          </Stack>
                          <Divider className="common-divider-mob-cards" />
                          <Grid container>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <Stack>
                                <span className="card-small-title">Amount</span>
                                <div className="transaction-amount-order">
                                  <div>₹ {data?.refundAmount || 0}</div>
                                </div>
                              </Stack>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6}>
                              <Stack alignItems={'flex-end'}>
                                <span className="card-small-title">Status</span>
                                <span
                                  className={
                                    data?.status === 'COMPLETED'
                                      ? 'transaction-success-order'
                                      : 'transaction-failed-order'
                                  }
                                >
                                  {data?.status === 'COMPLETED' ? 'Success' : data?.status}
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
                  gap: '1px',
                  height: '90px',
                  overflow: 'auto',
                }}
              >
                {refundData?.length > 0
                  ? refundData?.map((data, index) => {
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
                          <div>{data?.createdDate || 'Date: NA'}</div>
                        </div>
                        <div className="transaction-text-order">
                          <b>
                              ₹
                            {data?.refundAmount?.length > 7 ? (
                              <Tooltip title={data?.refundAmount}>{data?.refundAmount?.slice(0, 7) + '...'}</Tooltip>
                            ) : (
                              data?.refundAmount || 0
                            )}
                          </b>
                        </div>
                        <div
                          className={
                            data?.status === 'COMPLETED' ? 'transaction-success-order' : 'transaction-failed-order'
                          }
                          style={{ marginRight: '10px' }}
                        >
                          {data?.status === 'COMPLETED' ? 'Success' : data?.status}
                        </div>
                      </div>
                    );
                  })
                  : null}
              </div>
            )}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobileDevice ? 'column' : 'row',
            justifyContent: 'space-between',
            margin: 'auto',
            marginTop: '10px',
            gap: '10px',
            width: '100%',
          }}
        >
          <div
            className="sales-order-quick-link-box"
            style={{ height: '150px', width: isMobileDevice ? '100%' : '227px' }}
          >
            <span className="sales-order-quick-link-text">Return initiated by</span>
            <div style={{ padding: '10px' }}>
              {returnInitiatedby.map((metric) => {
                return (
                  <Grid container p={0.2} key={metric.label}>
                    <Grid item lg={4} md={4} sm={4} xs={4}>
                      <Stack alignItems={'flex-start'}>
                        <span className="card-small-title">{metric.label}</span>
                      </Stack>
                    </Grid>
                    <Grid item lg={8} md={8} sm={8} xs={8}>
                      <Stack alignItems={'flex-start'}>
                        <span className="card-small-title">{metric.value}</span>
                      </Stack>
                    </Grid>
                  </Grid>
                );
              })}
            </div>
          </div>
          <div
            className="sales-order-quick-link-box"
            style={{ height: '150px', width: isMobileDevice ? '100%' : '227px' }}
          >
            <span className="sales-order-quick-link-text">Refund initiated by</span>
            <div style={{ padding: '10px' }}>
              {refundInitiatedby.map((metric) => {
                return (
                  <Grid container p={0.2} key={metric.label}>
                    <Grid item lg={4} md={4} sm={4} xs={4}>
                      <Stack alignItems={'flex-start'}>
                        <span className="card-small-title">{metric.label}</span>
                      </Stack>
                    </Grid>
                    <Grid item lg={8} md={8} sm={8} xs={8}>
                      <Stack alignItems={'flex-start'}>
                        <span className="card-small-title">{metric.value}</span>
                      </Stack>
                    </Grid>
                  </Grid>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        className="sales-order-item-bill-data"
        style={{
          width: isMobileDevice ? '100%' : '300px',
          height: '230px',
          marginTop: '20px',
          alignContent: 'center',
        }}
      >
        <BillingDataRow label="Discount corrections" value={allData?.returnDetails?.discountCorrections || 0} />
        <BillingDataRow label="Pickup charges" value={allData?.returnDetails?.pickUpCharges || 0} />
        <BillingDataRow label="Total taxable value" value={allData?.returnDetails?.totalTaxableValue || 0} />
        <BillingDataRow label="IGST" value={allData?.returnDetails?.igst || 0} />
        <BillingDataRow label="SGST" value={allData?.returnDetails?.sgst || 0} />
        <BillingDataRow label="CGST" value={allData?.returnDetails?.cgst || 0} hasDivider />
        <BillingDataRow label={<b>Total</b>} value={<b>{allData?.returnDetails?.refundAmount || 0}</b>} hasDivider />
      </div>
    </div>
  );
};

export default SalesDetailsReturn;
