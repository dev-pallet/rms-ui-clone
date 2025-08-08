import ShyFeature from '../../../../../assets/svg/shy-feature.svg';
import './upcoming-features.css';

const UpcomingFeatures = () => {
  return (
    <div className="shy-data-found-main-container">
      <img src={ShyFeature} alt="no-data-found" className="shy-data-found-image" />
      <span className="shy-data-text">
        The features are <span className="shy-data-found-text">shy</span>. They need more room. Please use{' '}
        <span className="shy-data-found-text">desktop mode</span>.{/* <br /> Please start managing your stores. */}
      </span>
    </div>
  );
};

export default UpcomingFeatures;
