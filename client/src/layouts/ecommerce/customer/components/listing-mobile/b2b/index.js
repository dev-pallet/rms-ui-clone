const B2BCustomerListingMobile = ({ data, navigateToDetailsPage }) => {
  return (
    <div
      className="listing-card-bg-secondary"
      onClick={() =>
        navigateToDetailsPage({
          row: { ...data },
        })
      }
    >
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Customer Name</span>
          <span className="bill-card-value">{data?.name}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Company Name</span>
          <span className="bill-card-value text-align-right">{data?.companyName}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Mobile Number</span>
          <span className="bill-card-value">{data?.contact}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Email</span>
          <span className="bill-card-value">{data?.email}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">GSTIN</span>
          <span className="bill-card-value">{data?.gstin}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Last Modified</span>
          <span className="bill-card-value">{data?.updated}</span>
        </div>
      </div>
    </div>
  );
};

export default B2BCustomerListingMobile;
