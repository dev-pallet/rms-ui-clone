import './customizeb2c.css';
import React from 'react';
const MobilePreview = () => {
  return (
  // <div>
  //   <SoftBox sx={{ height: '80vh', width: 400, position: 'relative' }}>
  //     <img
  //       src="https://d2ogrdw2mh0rsl.cloudfront.net/production/images/layout/devices/iphone-x-port.png"
  //       alt="mobile preview"
  //       style={{ height: '80vh', zIndex: 20 }}
  //     />
  //     <iframe
  //       style={{ height: '66vh',width:205, position: 'absolute', top: 47, right: '1', left:'21px' ,zIndex: 1, bottom: 0 , borderRadius:10}}
  //       src="http://localhost:3002/dashboards/RETAIL"
  //     ></iframe>

  //     <img
  //       src="https://i.ibb.co/Y08LT8D/Screenshot-2023-10-13-17-34-42-86-4f42fc66d2adb3b87815c6a6bb327161.jpg"
  //       alt=""
  //       className="phone-image"
  //       style={{ position: 'absolute' ,zIndex: 1}}
  //     />
  //   </SoftBox>
  // </div>

    <div className="phone-container">
      <div className="phone">
        <div className="notch-container">
          <div className="notch"></div>
        </div>
        <img
          src="https://i.ibb.co/Y08LT8D/Screenshot-2023-10-13-17-34-42-86-4f42fc66d2adb3b87815c6a6bb327161.jpg"
          alt=""
          className="phone-image"
        />
      </div>
    </div>
  );
};

export default MobilePreview;
