import Divider from '@mui/material/Divider';

const CommonMobileAddressDetail = ({ heading, address, includeFields }) => {
  function joinObjectIncludeValues(obj, includeKeys) {
    return Object.entries(obj)
      .filter(([key]) => includeKeys.includes(key))
      .map(([, value]) => value)
      .join(', ');
  }

  return (
    <div className="mob-address-box">
      <div className="mob-address-data">
        <p>{heading}</p>
      </div>
      {/* <Divider flexItem sx={{ margin: '5px !important' }} /> */}
      <div className="mob-po-address-detail">
        {address ? (includeFields?.length > 0 ? joinObjectIncludeValues(address, includeFields) : address) : 'NA'}
      </div>
    </div>
  );
};

export default CommonMobileAddressDetail;
