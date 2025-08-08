import MobAdditionalCard from '../../../../Common/new-ui-common-components/additional-details/components/mobile-additional-details-card';
import './purchase-additional-details.css';

const PurchaseAdditionalDetails = ({ additionalDetailsArray }) => {
  return (
    <div className="additional-details-main-div">
      {additionalDetailsArray?.map((item) => (
        <MobAdditionalCard data={item} />
      ))}
    </div>
  );
};

export default PurchaseAdditionalDetails;
