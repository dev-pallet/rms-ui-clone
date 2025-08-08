import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SouthIcon from '@mui/icons-material/South';
import { Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';

const AutomatedCampaignSingle = () => {
  const { journeyId } = useParams();
  const navigate = useNavigate();

  const journeyDetails = [
    {
      id: 1,
      type: 'popular',
      name: 'Welcome message',
      image: 'https://static.brevo.com/automation/v1.0.0/images/welcome.png',
      desc: 'Send a welcome message after a customer joins your app.',
      tag: 'welcome_message',
      detailedDesc:
        'Deliver a warm welcome to your new app users by sending an automated welcome message, ensuring a positive and personalized onboarding experience from the very start',
      journeyPoints: ['Send an introductory welcome message welcoming the user'],
      requirements: 'Pallet subscription',
      objective: 'Nurture relationships',
      entryPoint: 'Customer sign up in App/POS.',
      action: 'Send Welcome message',
      delay: '',
      exitPoint: 'Customer recieved all messages',
    },
    {
      id: 2,
      type: 'popular',
      name: 'Abandoned cart',
      image: 'https://static.brevo.com/automation/v1.0.0/images/abandoned.webp',
      desc: 'Send a message after a contact abandons a cart to re-engage customer.',
      tag: 'abandoned_cart',
      detailedDesc:
        'Recover abandoned carts and re-engage customers with a targeted message, encouraging them to complete their purchase seamlessly and enjoy what they almost had in their cart!',
      journeyPoints: [
        'Send a push message when a customer abandons cart after 10 mins',
        'If no response send again after 2 hours',
        'Exits when a customer deleted cart or makes purchase',
      ],
      requirements: 'Pallet subscription',
      objective: 'Nurture relationships',
      entryPoint: 'Customer added product to his cart.',
      action: 'Send Abandoned Cart message 1',
      delay: 'Wait for 10 mins',
      delay2: 'Wait for 2 hours',
      action2: 'Send Abandoned Cart message 2',
      exitPoint: 'Customer recieved all messages, Customer makes payment, Customer deletes cart',
    },

    {
      id: 3,
      type: 'popular',
      name: 'Customer birthday',
      image: 'https://static.brevo.com/automation/v1.0.0/images/anniversary.webp',
      desc: 'Send a series of messages based on a special event or birthday.',
      tag: 'customer_birthday',
      detailedDesc:
        'Engage and celebrate with your users by automating a personalized series of messages based on special events, such as birthdays. Delight your customers with a warm birthday greeting and a thoughtfully crafted sequence of messages, creating a memorable and personalized experience that enhances their connection with your brand.',
      journeyPoints: [
        "Send a message for the customer's birthday along with coupon code",
        'Exits when customer makes purchase',
      ],
      requirements: 'Pallet subscription, Meta business account',
      objective: 'Nurture relationships',
      entryPoint: "Customer's Birthday is today.",
      action: 'Send Happy Birthday message with special offers',
      delay: '',
      exitPoint: 'Customer makes purchase',
    },
    {
      id: 4,
      type: 'popular',
      name: 'New offers or promotions',
      image: 'https://static.brevo.com/automation/v1.0.0/images/marketing.png',
      desc: 'Send a message if a new offer has launched or promoting new brands.',
      tag: 'new_offers_promotions',
      detailedDesc:
        'Stay connected with your audience by automatically notifying them when exciting new offers are launched or when you introduce promotions for new brands. Keep your customers in the loop with timely messages, ensuring they never miss out on the latest deals and brand additions, ultimately enhancing their shopping experience and loyalty to your platform.',
      journeyPoints: ["Send a message for store's new offers and promotions", 'Exits when a customer makes purchase'],
      requirements: 'Pallet subscription, Meta business account',
      objective: 'Nurture relationships',
      entryPoint: 'New Offers or festival offers available',
      action: 'Send offers template',
      delay: '',
      exitPoint: 'Customer makes purchase, All messages sent',
    },
    {
      id: 5,
      type: 'popular',
      name: 'Last purchase or visit',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message according to the last product purchased by a customer.',
      tag: 'last_purchase_visit',
      detailedDesc:
        "Enhance customer engagement by tailoring your messaging strategy to each individual's preferences. Send targeted messages based on the last product purchased, providing personalized recommendations, exclusive offers, or relevant updates related to their recent acquisition. This approach not only maximizes customer satisfaction but also encourages repeat purchases, fostering a lasting connection with your brand.",
      journeyPoints: [
        'Send a push message giving offers on the products last purchased by customer',
        'Reminder message to use the coupon again.',
      ],
      requirements: 'Pallet subscription, Meta business account',
      objective: 'Nurture relationships',
      entryPoint: 'Customer purchases specific products',
      action: 'Send message giving offers on similar products',
      delay: 'Wait for 3 dys',
      exitPoint: 'Customer makes purchase, All messages sent',
    },
    {
      id: 6,
      type: 'popular',
      name: 'Visits on the brand page in app',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message if a customer visits a particular page on the app.',
      tag: 'visits_on_brand_page',
      detailedDesc:
        "Create a personalized experience for your customers by sending targeted messages when they visit specific pages on your app. Whether it's a product page, a brand section, or any other key area, these messages can offer relevant information, exclusive promotions, or product highlights tailored to their interests, enhancing their engagement and overall satisfaction with your app.",
      journeyPoints: [
        'Send a message when a customer visits any brand page',
        "If a customer doesn't make any purchase send a message again",
      ],
      requirements: 'Pallet subscription, Meta business account',
      objective: 'Nurture relationships',
      entryPoint: 'Customer Visits any brand page',
      action: 'Send brand specific messages',
      delay: 'Wait for 30 mins',
      exitPoint: 'Customer makes purchase, All messages sent',
    },
    {
      id: 7,
      type: 'popular',
      name: 'Visits on a particular product page in app',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message if a customer visits a particular product on the app.',
      tag: 'visit_on_product_page',
      detailedDesc:
        'Elevate the customer experience by delivering timely and personalized messages when a customer visits a specific product on your app. Provide additional product details, exclusive offers, or related recommendations, ensuring that their interaction with the product is enriched and encouraging further exploration and potential purchases.',
      journeyPoints: [
        "Send message if the customer doesn't buy that product giving offers",
        'Send message again after particular time if no action taken',
      ],
      requirements: 'Pallet subscription, Meta business account',
      objective: 'Nurture relationships',
      entryPoint: 'Customer visits specific product page',
      action: 'Send product specific offers',
      delay: 'Wait for 2 hours',
      exitPoint: 'Customer makes purchase, All messages sent',
    },
    {
      id: 8,
      type: 'popular',
      name: 'Re-engage dormant customers with restocking alerts',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message if a customer visits a particular product on the app which is restocked again.',
      tag: 'restocking_alerts',
      detailedDesc:
        'Reignite customer interest and satisfaction by sending targeted messages when a previously visited product, now restocked, becomes available again on your app. Notify customers promptly about the restock, offering them the chance to revisit and make a purchase, creating a seamless and personalized shopping experience.',
      journeyPoints: [
        'Send a message when the product is back in stock.',
        'If no action taken send coupon code after particular time',
      ],
      requirements: 'Pallet subscription, Meta business account',
      objective: 'Nurture relationships',
      entryPoint: 'Customer looks for a product which was out of stock, comes back in stock',
      action: 'Send message for re-stock of that product',
      delay: '',
      exitPoint: 'Customer makes purchase, All messages sent',
    },
    {
      id: 9,
      type: 'popular',
      name: 'Product feedback/ ratings',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message asking customer about the feedback of any product.',
      tag: 'product_feedback',
      detailedDesc:
        'Empower customer feedback and enhance engagement by sending messages that invite customers to share their thoughts on any product. Encouraging reviews not only demonstrates your commitment to customer satisfaction but also provides valuable insights for continuous improvement. Strengthen your brand-customer relationship through open communication and acknowledgment of their opinions.',
      journeyPoints: [
        'Send a message asking for feedback on the product brought',
        'Remind again after some time if no action taken',
      ],
      requirements: 'Pallet subscription, Meta business account',
      objective: 'Nurture relationships',
      entryPoint: 'Customer gets delivery of the product bought',
      action: 'Send messages asking for feedback',
      delay: 'Wait for 30 mins',
      exitPoint: 'Customer submits feedback, All messages sent',
    },
    {
      id: 10,
      type: 'popular',
      name: 'Delivery feedback/ ratings',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message asking customer about the feedback of any delivery.',
      tag: 'deliver_feedbacks',
      detailedDesc:
        'Value our commitment to excellence! Share your delivery experience with us. We want to hear from you – your feedback helps us ensure top-notch service and enhances our commitment to your satisfaction.',
      journeyPoints: [
        'Send a message asking for feedback on the delivery brought',
        'Remind again after some time if no action taken',
      ],
      requirements: 'Pallet subscription, Meta business account',
      objective: 'Nurture relationships',
      entryPoint: 'Customer gets delivery of the product bought',
      action: 'Send messages asking for feedback',
      delay: 'Wait for 30 mins',
      exitPoint: 'Customer submits feedback, All messages sent',
    },
    {
      id: 11,
      type: 'popular',
      name: 'New product launch',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message for a new product launch for better sales.',
      tag: 'new_product_launch',
      detailedDesc:
        'Exciting news! Be the first to discover our latest innovation. Check out our new product launch and elevate your experience with cutting-edge features and unparalleled quality. Explore now and stay ahead with the latest from [Your Brand]!',
      journeyPoints: ['Send a message when a new product is launched', 'Remind again after some time'],
      requirements: 'Pallet subscription, Meta business account',
      objective: 'Nurture relationships',
      entryPoint: 'New product is launched',
      action: 'Send product launch template',
      delay: '',
      exitPoint: 'Customer purchases that product, All messages sent',
    },
    {
      id: 12,
      type: 'popular',
      name: 'Encourage online reviews',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message to customers to give reviews for the products purchased',
      tag: 'encourage_online_reviews',
      requirements: 'Pallet subscription, Meta business account',
      objective: 'Nurture relationships',
      detailedDesc:
        "We value your opinion! Share your experience and help us improve. Leave a review for the products you've purchased. Your feedback matters, and we appreciate your contribution to making our products even better!",
      journeyPoints: [
        'Send a message asking for feedback on the app.',
        'Remind again after some time if no action taken',
      ],
      entryPoint: 'Customer installs app.',
      action: 'Send review template',
      delay: 'Wait for 2 days',
      exitPoint: 'Customer submits review, All messages sent',
    },
    {
      id: 13,
      type: 'popular',
      name: 'Product price drops',
      image: 'https://static.brevo.com/automation/v1.0.0/images/page-visit.png',
      desc: 'Send a message to customers if the price of a particular product drops',
      tag: 'product_price_drops',
      detailedDesc:
        "Great news! The price has dropped on a product you've been eyeing. Don't miss out – seize the opportunity to grab it at a lower cost. Act fast and enjoy the savings on [Product Name]. Happy shopping",
      journeyPoints: ['Send a message when price of the product drops', 'If no action taken remind again'],
      requirements: 'Pallet subscription, Meta business account',
      objective: 'Nurture relationships',
      entryPoint: 'Customer checks a product and its price drops',
      action: 'Send messages telling drop in the price',
      delay: '',
      exitPoint: 'Customer purchases the product, All messages sent',
    },
  ];

  const findJourneyById = (tag) => {
    return journeyDetails.find((journey) => journey.tag === tag);
  };

  const foundJourney = findJourneyById(journeyId);

  useEffect(() => {
    localStorage.setItem('automated_campaign', foundJourney.name);
  }, [foundJourney]);

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox mb={2}>
          <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }} mb={2}>
            <Typography>Pre-built Journey</Typography>
            <SoftButton className="vendor-add-btn" onClick={() => navigate('/marketing/campaigns/automated/create')}>
              Use this journey
            </SoftButton>
          </SoftBox>
          <hr />
          <SoftBox style={{ marginTop: '20px' }}>
            <Grid container spacing={3}>
              <Grid item lg={6}>
                <Typography className="single-journey-title">{foundJourney.name}</Typography>
                <Typography className="single-journey-desc">{foundJourney.detailedDesc}</Typography>
                <Typography className="single-journey-points-start">This Journey will:</Typography>
                <ul>
                  {foundJourney.journeyPoints.map((item) => {
                    return <li className="single-journey-points">{item}</li>;
                  })}
                </ul>
              </Grid>
              <Grid item lg={6}>
                <SoftBox className="single-journey-part2-box">
                  <Typography className="single-journey-part2-header">You'll need</Typography>
                  <Typography className="single-journey-part2-point">{foundJourney.requirements}</Typography>
                  <Typography className="single-journey-part2-header">Journey Objective</Typography>
                  <Typography className="single-journey-part2-point">{foundJourney.objective}</Typography>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
          <SoftBox
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {foundJourney.entryPoint && (
              <>
                <SoftBox className="automated-entry-box">
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '12px',
                      backgroundColor: '#eff2f7',
                      borderRadius: '10px 10px 0px 0px',
                    }}
                  >
                    <div className="automated-entry-icon-box">
                      <ExitToAppIcon sx={{ color: '#fff' }} />
                    </div>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      ENTRY POINT
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      {foundJourney.entryPoint}
                    </Typography>
                  </div>
                </SoftBox>
                <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <SouthIcon sx={{ fontSize: '20px' }} />
                </SoftBox>
              </>
            )}
            {foundJourney.delay && (
              <>
                <SoftBox className="automated-entry-box">
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '12px',
                      backgroundColor: '#eff2f7',
                      borderRadius: '10px 10px 0px 0px',
                    }}
                  >
                    <div className="automated-entry-icon-box" style={{ backgroundColor: 'rgb(139, 131, 231)' }}>
                      <AccessTimeIcon sx={{ color: '#fff' }} />
                    </div>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      DELAY
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      {foundJourney.delay}
                    </Typography>
                  </div>
                </SoftBox>
                <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <SouthIcon sx={{ fontSize: '20px' }} />
                </SoftBox>
              </>
            )}
            {foundJourney.action && (
              <>
                <SoftBox className="automated-entry-box">
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '12px',
                      backgroundColor: '#eff2f7',
                      borderRadius: '10px 10px 0px 0px',
                    }}
                  >
                    <div className="automated-entry-icon-box" style={{ backgroundColor: 'rgb(30, 184, 184)' }}>
                      <SendOutlinedIcon sx={{ color: '#fff' }} />
                    </div>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      ACTION
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      {foundJourney.action}
                    </Typography>
                  </div>
                </SoftBox>
                <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <SouthIcon sx={{ fontSize: '20px' }} />
                </SoftBox>
              </>
            )}
            {foundJourney.delay2 && (
              <>
                <SoftBox className="automated-entry-box">
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '12px',
                      backgroundColor: '#eff2f7',
                      borderRadius: '10px 10px 0px 0px',
                    }}
                  >
                    <div className="automated-entry-icon-box" style={{ backgroundColor: 'rgb(139, 131, 231)' }}>
                      <AccessTimeIcon sx={{ color: '#fff' }} />
                    </div>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      DELAY
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      {foundJourney.delay2}
                    </Typography>
                  </div>
                </SoftBox>
                <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <SouthIcon sx={{ fontSize: '20px' }} />
                </SoftBox>
              </>
            )}
            {foundJourney.action2 && (
              <>
                <SoftBox className="automated-entry-box">
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '12px',
                      backgroundColor: '#eff2f7',
                      borderRadius: '10px 10px 0px 0px',
                    }}
                  >
                    <div className="automated-entry-icon-box" style={{ backgroundColor: 'rgb(30, 184, 184)' }}>
                      <SendOutlinedIcon sx={{ color: '#fff' }} />
                    </div>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      ACTION
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      {foundJourney.action2}
                    </Typography>
                  </div>
                </SoftBox>
                <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <SouthIcon sx={{ fontSize: '20px' }} />
                </SoftBox>
              </>
            )}
            {foundJourney.exitPoint && (
              <>
                <SoftBox className="automated-entry-box" style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '12px',
                      backgroundColor: '#eff2f7',
                      borderRadius: '10px 10px 0px 0px',
                    }}
                  >
                    <div className="automated-entry-icon-box" style={{ backgroundColor: 'rgb(209, 196, 160)' }}>
                      <ExitToAppOutlinedIcon sx={{ color: '#fff' }} />
                    </div>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      EXIT CONDITION
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      {foundJourney.exitPoint}
                    </Typography>
                  </div>
                </SoftBox>
              </>
            )}
          </SoftBox>
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default AutomatedCampaignSingle;
