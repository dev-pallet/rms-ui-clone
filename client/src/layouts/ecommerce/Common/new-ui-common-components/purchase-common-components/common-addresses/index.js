import './common-addresses.css';
import { isSmallScreen } from '../../../CommonFunction';

const CommonAddressCard = ({ addressData, title }) => {
  const isMobileDevice = isSmallScreen();

  return (
    <div
      className="common-address-card component-bg-br-sh-p"
      //   expanded={isMobileDevice ? false : true}
    >
      <span className="address-title">{title}</span>
      <div className="address-main-container">
        {/* <div className="address-line-container">
          <span className="address-line-title">Line 1</span>
          <span>Some Where</span>
        </div>
        <div className="address-line-container">
          <span className="address-line-title">Line 2</span>
          <span>Some Where</span>
        </div>
        <div className="address-line-container">
          <span className="address-line-title">City</span>
          <span>Banglore</span>
        </div>
        <div className="address-line-container">
          <span className="address-line-title">State</span>
          <span>Karnatka</span>
        </div>
        <div className="address-line-container">
          <span className="address-line-title">Country</span>
          <span>India</span>
        </div> */}
        <span className="address-line-title">{addressData}</span>
      </div>
    </div>
  );
};

export default CommonAddressCard;
