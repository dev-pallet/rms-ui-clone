import NoDataFound from '../../../../../assets/svg/no-data-found.svg';
import './no-data-found.css';

const NoDataFoundMob = () => {
  return (
    <div className="no-data-found-main-container">
      <img src={NoDataFound} alt="no-data-found" className="no-data-found-image" />
      <span className="no-data-found-text">
        No information found.
        {/* <br /> Please start managing your stores. */}
      </span>
    </div>
  );
};

export default NoDataFoundMob;
