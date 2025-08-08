export default function CreditNoteTransferMobileCard({ data }) {
  return (
    <>
      <div className="listing-card-bg-secondary">
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-label">TransferId</span>
            <span className="bill-card-value">{data?.transferLogId || 'N/A'}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="bill-card-label">Transfer Date</span>
            <span className="bill-card-value">{data?.transferDate || 'N/A'}</span>
          </div>
        </div>
        <hr className="horizontal-line-app-ros" />
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-label">Source Vendor Id</span>
            <span className="bill-card-value">{data?.sourceVendorId || 'N/A'}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="bill-card-label">Source Vendor Name</span>
            <span className="bill-card-value">{data?.sourceVendorName || 'N/A'}</span>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-label">Destination Vendor Id</span>
            <span className="bill-card-value">{data?.destinationVendorId || 'N/A'}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="bill-card-label">Destination Vendor Name</span>
            <span className="bill-card-value">{data?.destinationVendorName || 'N/A'}</span>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-label">Transferred Credits</span>
            <span className="bill-card-value">{data?.transferredCredits || 'N/A'}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="bill-card-label">Transferrred By</span>
            <span className="bill-card-value two-line-ellipsis">{data?.transferredByName || 'N/A'}</span>
          </div>
        </div>
      </div>
    </>
  );
}
