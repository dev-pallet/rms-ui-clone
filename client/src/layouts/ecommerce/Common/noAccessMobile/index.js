import NoAccessImg from '../../../../assets/svg/noacess-mobile.svg';
import Playstore from '../../../../assets/svg/playstore-img.svg';
import AppStore from '../../../../assets/svg/app-store-img.svg';
import './no-access.css';

const NoAccess = () => {
  return (
    <div className="no-access-main-container">
      <img src={NoAccessImg} alt="" />
      <div className="no-access-info-div">
        <span className="main-heading-noacess">
          In a <span className="hurry">Hurry</span> for action?
        </span>
        <span className="main-heading-subtitle">We know a more comfortable place for that!</span>
        <span className="download-ros-app">
          <span className="download">Download</span> our app.
        </span>
      </div>
      <div className="store-images">
        <a href="https://play.google.com/store/search?q=pallet%20rms&c=apps&hl=en" target="_blank">
          <img src={Playstore} alt="" />
        </a>
        <a href="https://apps.apple.com/in/app/pallet-retail-os/id6477288436" target="_blank">
          <img src={AppStore} alt="" />
        </a>
      </div>
    </div>
  );
};

export default NoAccess;
