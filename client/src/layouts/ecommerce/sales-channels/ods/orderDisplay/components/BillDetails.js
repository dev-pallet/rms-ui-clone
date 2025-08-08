import './BillDetails.css';
import { Box } from '@mui/material';
import moment from 'moment';

const convertTime = (time) => moment.utc(time).local().format('DD/MM/YY, LT');

const BillDetails = ({ orderDetails }) => {
  const totalQuantity = orderDetails?.baseOrderResponse?.orderItemList
    ?.map((item) => item.quantity)
    .reduce((a, b) => a + b, 0);

  return (
    <Box className="bill-details-wrapper">
      {/* <Box className="order-details-bill-details">
        <Box className="order-details-bill-no">
          <Typography variant="p" fontSize="11px">
            Bill No: {orderDetails?.baseOrderResponse?.invoiceId}
          </Typography>
        </Box>
        <Box className="order-details-bill-no">
          <Typography variant="p" fontSize="11px">
            Bill Date: {convertTime(orderDetails?.baseOrderResponse?.createdAt)}
          </Typography>
        </Box>
      </Box>
      <Box className="order-details-bill-details">
        <Box className="order-details-bill-no">
          <Typography variant="p" fontSize="11px">
            Cashier: Guest
          </Typography>
        </Box>
        <Box className="order-details-bill-no">
          <Typography variant="p" fontSize="11px">
            Payment Method: {orderDetails?.orderBillingDetails?.paymentMethod}
          </Typography>
        </Box>
      </Box> */}
      {/* <Box my={2} sx={{ textAlign: "center" }}>
        <Typography variant="p" className="order-details-divider">
          TAX INVOICE
        </Typography>
      </Box> */}
      <Box>
        <div className="ods-table-wrapper">
          <div className="ods-table">
            <div className="ods-table-row header">
              <div className="ods-table-cell">Item</div>
              <div className="ods-table-cell">Barcode</div>
              <div className="ods-table-cell">Qty</div>
              <div className="ods-table-cell">Rate</div>
              <div className="ods-table-cell">Value</div>
            </div>

            {orderDetails?.baseOrderResponse?.orderItemList?.map((item, index) => (
              <div className="ods-table-row" key={index}>
                <div className="ods-table-cell" data-title="Item">
                  {item.productName}
                </div>
                <div className="ods-table-cell" data-title="Barcode">
                  {item.gtin}
                </div>
                <div className="ods-table-cell" data-title="Qty">
                  {item.quantity}
                </div>
                <div className="ods-table-cell" data-title="Rate">
                  ₹ {item.sellingPrice}
                </div>
                <div className="ods-table-cell" data-title="Value">
                  ₹ {item.subTotal}
                </div>
              </div>
            ))}

            <td colSpan="2" className="ods-table-footer">
              Total
            </td>
            <td colSpan="1" className="ods-table-footer">
              {totalQuantity}
            </td>
            <td colSpan="2" className="ods-table-footer">
              ₹ {orderDetails?.orderBillingDetails?.grandTotal}
            </td>
          </div>
        </div>
        {/* <table>
          <thead>
            <tr className="order-item-table-header">
              <th>HSN</th>
              <th>Particulars</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object?.entries(orderDetails?.gstWiseOrderItems || []).map(([key, value]) => (
              <Fragment key={key}>
                <tr>
                  <td colSpan="5" className="gst-slab">
                    {key}
                  </td>
                </tr>
                {value.map((item, index) => (
                  <tr key={index} className="order-item-table-row">
                    <td className="order-item-list-box">{item.hsnCode.substring(0, 4)}</td>
                    <td className="order-item-list-box">{item.productName}</td>
                    <td className="order-item-list-box">{item.quantity}</td>
                    <td className="order-item-list-box">₹ {item.sellingPrice}</td>
                    <td className="order-item-list-box">
                      ₹ {Number(item.quantity) * Number(item.sellingPrice)}
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
            <tr className="order-item-table-footer">
              <td colSpan="2">Total</td>
              <td colSpan="1">{totalQuantity}</td>
              <td colSpan="2">₹ {orderDetails?.orderBillingDetails?.grandTotal}</td>
            </tr>
          </tbody>
        </table>
        <Box>
          <Box my={2} sx={{ textAlign: "center" }}>
            <Typography variant="p" className="order-details-divider">
              GST Breakup Details
            </Typography>
          </Box>
          <Box>
            <table>
              <thead>
                <tr className="order-item-table-header">
                  <th>GST IND</th>
                  <th>Taxable Amount</th>
                  <th>CGST</th>
                  <th>SGST</th>
                  <th>Cess</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails?.gstBreakupDetails?.length &&
                  orderDetails?.gstBreakupDetails
                    ?.filter((item) => item.taxableAmt != null)
                    .map((e, i) => (
                      <tr key={i} className="order-item-table-row">
                        <td>{i + 1}</td>
                        <td>{e.taxableAmt.toFixed(2)}</td>
                        <td>{e.cgst.toFixed(2)}</td>
                        <td>{e.sgst.toFixed(2)}</td>
                        <td>{e.cess ? e.cess : "---"}</td>
                        <td>{e.totalAmt}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </Box>

          <Box my={2} sx={{ textAlign: "center" }}>
            <Typography variant="p" className="order-details-divider">
              Payment Breakup Details
            </Typography>
          </Box>
          {!orderDetails?.orderBillingDetails?.payments?.length ? (
            <div className="payment-not-done-wrapper">
              <h5>No payment details found</h5>
            </div>
          ) : (
            <Box>
              <table>
                <tr className="order-item-table-header">
                  <th>Amount Paid</th>
                  <th>Payment Method</th>
                  <th>Payment Mode</th>
                  <th>Payment Status</th>
                </tr>

                {orderDetails?.orderBillingDetails?.payments.map((e, i) => (
                  <tr key={i} className="order-item-table-row">
                    <td>₹ {e?.amountPaid}</td>
                    <td>{e?.paymentMethod}</td>
                    <td>{e?.paymentMode}</td>
                    <td className="paid-text-order">
                      {e?.paymentStatus === "COMPLETED" ? "PAID" : "----"}
                    </td>
                  </tr>
                ))}
              </table>
            </Box>
          )}
        </Box> */}
      </Box>
    </Box>
  );
};

export default BillDetails;
