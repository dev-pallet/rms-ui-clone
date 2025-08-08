import EditIcon from '@mui/icons-material/Edit'; // Assuming EditIcon from MUI
import Divider from '@mui/material/Divider';

const POMobileAddressSection = ({
  heading,
  addressName,
  address,
  includeFields,
  excludeFields,
  joinObjectFunction,
  handleEdit,
}) => {
  return (
    <div className="mob-address-box">
      <div className="mob-address-data width-100">
        <p>{heading}</p>
        {'  '}
        <p>
          <EditIcon onClick={handleEdit} />
        </p>
      </div>
      <hr className="horizontal-line-app-ros" />
      {addressName && (
        <div className="mob-po-address-detail">
          <b>Name: </b> {addressName}
        </div>
      )}
      <div className="mob-po-address-detail">
        {address
          ? excludeFields
            ? joinObjectFunction(address, excludeFields)
            : joinObjectFunction(address, includeFields)
          : 'NA'}
      </div>
    </div>
  );
};

export default POMobileAddressSection;
