import './mob-additional-card.css';

const MobAdditionalCard = ({ data }) => {
  return (
    <div className="mob-additional-card-main-div" key={data?.title}>
      <span className="mob-additional-card-title">{data?.title}</span>
      <span className="mob-additional-card-value">{data?.value}</span>
      {/* {data?.description && <span className={`mob-additional-card-descirption-active`}>{data?.description}</span>} */}
    </div>
  );
};

export default MobAdditionalCard;
