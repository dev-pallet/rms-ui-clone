import CommonIcon from '../common-icon-comp';
import './mobile-searchbar.css';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ScannerIcon from '../../../../../assets/svg/scanner-icon.svg';
import ScannerIconSecondary from '../../../../../assets/svg/scanner-icon-secondary.svg';

const MobileSearchBar = ({
  onChangeFunction,
  value,
  placeholder,
  isScannerSearchbar,
  variant,
  onFocusFunction,
  onBlurFunction,
  scannerButtonFunction,
}) => {
  return (
    <div
      className={`mobile-searchbar-main-div ${
        variant === 'bg-white' ? 'mobile-searchbar-bg-white-div' : 'mobile-searchbar-bg-gray-div'
      } `}
    >
      <div className="search-icon">
        <MagnifyingGlassIcon className="search-icon-svg" />
      </div>
      <input
        value={value}
        type="text"
        className={`mobile-searchbar`}
        placeholder={placeholder}
        onChange={onChangeFunction}
        onFocus={onFocusFunction}
        onBlur={onBlurFunction}
      />
      {isScannerSearchbar && (
        <div onClick={scannerButtonFunction}>
          <CommonIcon icon={<img src={variant === 'bg-secondary' ? ScannerIconSecondary : ScannerIcon} alt="Scanner icon" />} />
        </div>
      )}
    </div>
  );
};

export default MobileSearchBar;
