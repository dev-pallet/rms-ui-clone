import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import CustomCard from '../CustomComponents/CustomCard';
import './AutomatedCampaigns.css';

const AutomatedPage = () => {
  const [allTemplates, setAllTemplates] = useState(false);

  const navigate = useNavigate();
  const journeys = [
    {
      id: 1,
      type: 'popular',
      name: 'Welcome message',
      image: 'https://static.brevo.com/automation/v1.0.0/images/welcome.png',
      desc: 'Send a welcome message after a subscriber joins your list.',
      tag: 'welcome_message',
    },
    {
      id: 2,
      type: 'popular',
      name: 'Abandoned cart',
      image: 'https://static.brevo.com/automation/v1.0.0/images/abandoned.webp',
      desc: 'Send a message after a contact abandons a cart to re-engage customer.',
      tag: 'abandoned_cart',
    },

    {
      id: 3,
      type: 'popular',
      name: 'Customer birthday',
      image: 'https://static.brevo.com/automation/v1.0.0/images/anniversary.webp',
      desc: 'Send a series of messages based on a special event or birthday.',
      tag: 'customer_birthday',
    },
    {
      id: 4,
      type: 'popular',
      name: 'New offers or promotions',
      image: 'https://static.brevo.com/automation/v1.0.0/images/marketing.png',
      desc: 'Send a message if a new offer has launched or promoting new brands.',
      tag: 'new_offers_promotions',
    },
    {
      id: 5,
      type: 'popular',
      name: 'Last purchase or visit',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message according to the last product purchased by a customer.',
      tag: 'last_purchase_visit',
    },
  ];

  const allJourneys = [
    {
      id: 6,
      type: 'popular',
      name: 'Visits on the brand page in app',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message if a customer visits a particular page on the app.',
      tag: 'visits_on_brand_page',
    },
    {
      id: 7,
      type: 'popular',
      name: 'Visits on a particular product page in app',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message if a customer visits a particular product on the app.',
      tag: 'visit_on_product_page',
    },
    {
      id: 8,
      type: 'popular',
      name: 'Re-engage dormant customers with restocking alerts',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message if a customer visits a particular product on the app which is restocked again.',
      tag: 'restocking_alerts',
    },
    {
      id: 9,
      type: 'popular',
      name: 'Product feedback/ ratings',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message if a customer about the feedback of any product.',
      tag: 'product_feedback',
    },
    {
      id: 10,
      type: 'popular',
      name: 'Delivery feedback/ ratings',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message if a customer about the feedback of any delivery.',
      tag: 'deliver_feedbacks',
    },
    {
      id: 11,
      type: 'popular',
      name: 'New product launch',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message for a new product launch for better sales.',
      tag: 'new_product_launch',
    },
    {
      id: 12,
      type: 'popular',
      name: 'Encourage online reviews',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message to customers to give reviews for the products purchased',
      tag: 'encourage_online_reviews',
    },
    {
      id: 13,
      type: 'popular',
      name: 'Product price drops',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message to customers if the price of a particular product drops',
      tag: 'product_price_drops',
    },
  ];

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <Typography>{allTemplates === true ? 'All pre-built Journeys' : 'Popular pre-built Journeys'}</Typography>
          {/* <SoftButton className="vendor-add-btn">Build from Scratch</SoftButton> */}
        </SoftBox>
        <SoftBox className="automated-campaigns-page-container">
          {journeys.map((item) => {
            return (
              <div onClick={() => navigate(`/marketing/campaigns/automated/${item.tag}`)}>
                <CustomCard className="automated-campaigns-page-single" key={item.id}>
                  {/* <div className="automated-box-img">
                  <img src={item.image} />
                </div> */}
                  <div className="automated-box-typo">
                    <Typography className="automated-box-title">{item.name}</Typography>
                    <Typography className="automated-box-desc">{item.desc}</Typography>
                  </div>
                </CustomCard>
              </div>
            );
          })}
          {allTemplates === false ? (
            <SoftBox className="automated-campaigns-page-single" onClick={() => setAllTemplates(true)}>
              <div className="automated-box-last">
                <EastOutlinedIcon />
                <Typography style={{ textAlign: 'center', fontSize: '16px', lineHeight: 2 }}>
                  See all pre-built journeys
                </Typography>
              </div>
            </SoftBox>
          ) : (
            allJourneys.map((item) => {
              return (
                <div onClick={() => navigate(`/marketing/campaigns/automated/${item.tag}`)}>
                  <CustomCard className="automated-campaigns-page-single" key={item.id}>
                    {/* <div className="automated-box-img">
                    <img src={item.image} />
                  </div> */}
                    <div className="automated-box-typo">
                      <Typography className="automated-box-title">{item.name}</Typography>
                      <Typography className="automated-box-desc">{item.desc}</Typography>
                    </div>
                  </CustomCard>
                </div>
              );
            })
          )}
          {allTemplates === true && (
            <SoftBox className="automated-campaigns-page-single" onClick={() => setAllTemplates(false)}>
              <div className="automated-box-last">
                <KeyboardBackspaceOutlinedIcon />
                <Typography style={{ textAlign: 'center', fontSize: '16px', lineHeight: 2 }}>See less</Typography>
              </div>
            </SoftBox>
          )}
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default AutomatedPage;
