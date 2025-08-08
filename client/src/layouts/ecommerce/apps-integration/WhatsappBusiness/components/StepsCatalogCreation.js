import { useNavigate } from 'react-router-dom';
import PageLayout from '../../../../../examples/LayoutContainers/PageLayout';
import React from 'react';

const StepsCatalogCreation = () => {
  const navigate = useNavigate();
  const handleBusinessCreation = () => {
    window.open('/notification/register', '_blank');
  };

  return (
    <div>
      <PageLayout>
        <div className="header-box">
          <h1>How to create a Catalog in your Meta Business Account</h1>
          <h4>
            This instruction will help you find all the data that you need to use when creating a catalog for your
            whatsapp Business:
          </h4>
          <ul style={{ color: '#2bac06' }}>
            <li>Catalog ID</li>
          </ul>
          <div className="steps-to-guide">
            <h4>Step 1</h4>
            <p>
              Make sure you already have a Facebook account. if you don't, then the registration process is quite
              simple:{' '}
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                Click here to create an Account{' '}
              </a>
              else just enter your login and password, and then confirm the mail.
            </p>
            <p>
              Next you should have a Meta Business account. To create that please{' '}
              <span style={{ color: '#0562FB', cursor: 'pointer' }} onClick={handleBusinessCreation}>
                follow the steps given in this guide.
              </span>
            </p>
            <h4>Step 2</h4>
            <p>Go to your Meta Business Account. From the navbar click on All tools and select Commerce Manager</p>
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/Screenshot%20(78).png"
              alt=""
            />
            <h4>Step 3</h4>
            <p>You will be redirected to a screen where there will be an option to create Catalog. Click on the button Create Catalog.</p>
            <img src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/Screenshot%20(79).png" alt="" />
            <h4>Step 4</h4>
            <p>Select your Catalogue Type. For products select E-commerce and Online.</p>
            <img src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/Screenshot%20(81).png" alt="" />
            <h4> Step 5</h4>
            <p>Next it will ask you to add products. Select Upload Product Info to upload products from Pallet. Give name for your catalog and click create.</p>
            <img src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/Screenshot%20(82).png" alt="" />
            <h4>Step 6</h4>
            <p>It will take some time to create a catalog. When its done click on View Catalogue to get catalog ID.</p>
            <img src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/Screenshot%20(83).png" alt="" />
            <p>From here copy the catalog ID. And you are all set to start your whatsapp Business.</p>
            <img src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/Screenshot%20(84).png" alt="" />
          </div>
        </div>
      </PageLayout>
    </div>
  );
};

export default StepsCatalogCreation;
