import './watermark.css';
import jobImage from '../../../../../../assets/images/ecommerce/jobs1.png';
const Watermark = () => {
  return (
    <div className="watermark-container">
      <img src={jobImage} alt="" className="watermark-image" />
    </div>
  );
};

export default Watermark;