import CustomMobileInput from '../common-input';

const BillingListMobile = ({ billingList, setIsCredit }) => {
  return (
    <>
      {billingList?.map((ele, index) => {
        return (
          <div key={index}>
            <div className="mob-po-billing-box">
              {ele?.label?.includes('Total') ? (
                <div className="mob-po-bill-total" style={{ padding: '0px' }}>
                  <div>{ele?.label}</div>
                  <div>{ele?.value}</div>
                </div>
              ) : (
                <>
                  <div className="mob-po-bill-label">{ele?.label}</div>
                  {ele?.isInput ? (
                    <CustomMobileInput
                      type="number"
                      value={ele?.value}
                      onChange={ele?.onChange}
                      style={{ width: '40px' }}
                    />
                  ) : ele?.checked ? (
                    <div className="mob-po-bill-value">
                      <input
                        type="checkbox"
                        checked={ele?.checked}
                        disabled={ele?.isDisabled}
                        onChange={(e) => setIsCredit(e.target.checked)}
                      />
                      <CustomMobileInput
                        type="number"
                        style={{ width: '40px' }}
                        value={ele?.value}
                        onChange={ele?.onChange}
                        disabled={ele?.isDisabled}
                      />
                    </div>
                  ) : (
                    <div className="mob-po-bill-value">
                      {ele?.isCheckbox && (
                        <input
                          type="checkbox"
                          checked={ele?.checked}
                          disabled={ele?.isDisabled}
                          onChange={(e) => setIsCredit(e.target.checked)}
                        />
                      )}
                      {ele?.value}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default BillingListMobile;
