const AppCustomerListingMobile = ({ data, navigateToDetailsPage }) => {
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
          <span className="bill-card-label">Mobile Number</span>
          <span className="bill-card-value">{data?.contact}</span>
        </div>
      </div>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-label">Email</span>
          <span className="bill-card-value">{data?.email}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">Created At</span>
          <span className="bill-card-value">{data?.created_at}</span>
        </div>
      </div>
    </div>
  );
};

export default AppCustomerListingMobile;
