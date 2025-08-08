import { Card, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftInput from '../../../components/SoftInput';
import SoftTypography from '../../../components/SoftTypography';
import { apps_integerationData } from '../../../config/Services';
import { getInstalledApps, setRecommendedApps } from '../../../datamanagement/recommendedAppSlice';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import './Appsintegration.css';

const appnames = [
  {
    name: 'Pallet push',
    urlName: 'Pallet_push',
    category: ['Pallet', 'Marketing'],
    shortdescription: 'Streamline and optimize marketing campaigns',
    description:
      'A mobile app that helps you efficiently manage and track inventory in your warehouse. It allows you to easily push pallets to their designated locations and keep a record of stock movements.',
    img: 'https://safetytoolbox.in/wp-content/uploads/2022/12/hand-pallet-truck-safety1.jpg',
  },
  {
    name: 'Coupons',
    urlName: 'Coupons',
    category: ['Marketing'],
    shortdescription: 'Generate and distribute digital coupons for promotions',
    description:
      'A digital coupon management system that enables you to create, distribute, and redeem coupons for your products or services. It helps attract new customers and increase sales through targeted promotions.',
    img: 'https://cdn-icons-png.flaticon.com/512/1041/1041885.png',
  },
  {
    name: 'Loyalty program',
    urlName: 'Loyalty_program',
    category: ['Marketing'],
    shortdescription: 'Create and manage customer loyalty programs',
    description:
      'A customer loyalty program platform that rewards your loyal customers and encourages repeat purchases. It offers features like point accumulation, reward redemption, and personalized offers.',
    img: 'https://us.123rf.com/450wm/nsit0108/nsit01082201/nsit0108220101408/180392023-star-loyalty-program-icon-cartoon-vector-online-discount-card-gift.jpg?ver=6',
  },
  {
    name: 'Gift cards',
    urlName: 'Gift_cards',
    category: ['Marketing'],
    shortdescription: 'Offer digital gift cards for easy gifting and customer rewards',
    description:
      'An electronic gift card solution that allows you to sell and manage gift cards for your business. Customers can purchase gift cards for themselves or send them to others, boosting your sales and brand awareness.',
    img: 'https://www.kindpng.com/picc/m/133-1333532_gift-card-gift-card-icon-png-transparent-png.png',
  },
  // {
  //   name: 'Order fulfillment',
  //   urlName: 'Order_fulfillment',
  //   shortdescription: 'Streamline and optimize marketing campaigns',
  //   description:
  //     'A comprehensive order fulfillment system that streamlines the process from receiving an order to delivering it to the customer. It includes features such as order management, inventory tracking, and shipping integration.',
  //   img: 'https://lightningpick.com/wp-content/uploads/2015/09/icon-OrderFinishing.png',
  // },

  {
    name: 'Zoho Books',
    urlName: 'Zoho_Books',
    category: ['Accounting and Finance'],
    shortdescription: 'Manage accounting and financial processes with Zohobooks',
    description:
      'An accounting and finance software that simplifies financial management tasks such as bookkeeping, invoicing, expense tracking, and financial reporting. It provides insights into your business\'s financial health and helps ensure compliance.',
    img: 'https://www.thesmbguide.com/images/zoho-books-420x320-20201008.png',
  },
  {
    name: 'Tally',
    urlName: 'Tally',
    category: ['Accounting and Finance'],
    shortdescription: 'Utilize Tally for efficient and accurate accounting tasks.',
    description:
      'An accounting and finance software that simplifies financial management tasks such as bookkeeping, invoicing, expense tracking, and financial reporting. It provides insights into your business\'s financial health and helps ensure compliance.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Tally_-_Logo.png',
  },
  // {
  //   name: 'Quickbooks',
  //   urlName: 'Quickbooks',
  //   category: ['Accounting and Finance'],
  //   shortdescription: 'Simplify accounting and financial management with Quickbooks.',
  //   description:
  //     "An accounting and finance software that simplifies financial management tasks such as bookkeeping, invoicing, expense tracking, and financial reporting. It provides insights into your business's financial health and helps ensure compliance.",
  //   img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-uRJM0St4wJaIPAcY4hrdkFwTr6MYAXzzWw&usqp=CAU',
  // },

  {
    name: 'PayTM',
    urlName: 'PayTM',
    category: ['Payments'],
    shortdescription: 'Offer Paytm as a payment option for seamless transactions.',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://static.vecteezy.com/system/resources/previews/019/040/328/original/paytm-logo-icon-free-vector.jpg',
  },
  {
    name: 'Pinelabs',
    urlName: 'Pinelabs',
    category: ['Payments'],
    shortdescription: 'Utilize Pinelabs for secure and reliable payment processing',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://images.moneycontrol.com/static-mcnews/2019/03/pine-labs-770x433.jpg?impolicy=website&width=770&height=431',
  },
  {
    name: 'ICICI Easypay',
    urlName: 'ICICI_Easypay',
    category: ['Payments'],
    shortdescription: 'Enable ICICI Easy Pay for hassle-free payments',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxKG8uWIadVYVoYqEbpUDXOBJ1TrCYRS9Fvs6O1GDk-b1ayVByUDk01OGiMOxyW3wYCSY&usqp=CAU',
  },
  {
    name: 'Pallet POS',
    urlName: 'Pallet_POS',
    category: ['Billing', 'Pallet'],
    shortdescription: 'Efficiently manage billing and transactions with Pallet POS',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://cdn3d.iconscout.com/3d/premium/thumb/pos-terminal-8329184-6634696.png?f=webp',
  },
  {
    name: 'Pallet Self Ordering Kiosk',
    urlName: 'Pallet_Self_Ordering_Kiosk',
    category: ['Billing'],
    shortdescription: 'Enable self-service ordering and payment kiosks.',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://media.istockphoto.com/id/1316118804/vector/character-use-self-ordering-food-service-in-restaurant-or-fastfood-cafe-woman-choose-meals.jpg?s=612x612&w=0&k=20&c=xPff2jeZjVAdsgJlNH8JYeV8irEsCUJjkYjcBluUo-E=',
  },
  {
    name: 'Pallet Handheld POS',
    urlName: 'Pallet_Handheld_POS',
    category: ['Billing'],
    shortdescription: 'Streamline mobile billing with Pallet Handheld POS',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://cdn-icons-png.flaticon.com/512/4990/4990622.png',
  },

  {
    name: 'Porter',
    urlName: 'Porter',
    category: ['Pallet Hyperlocal', 'Logistics'],
    shortdescription: 'Optimize last-mile delivery with Porter\'s logistics services',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://play-lh.googleusercontent.com/SzVgq9ni1W5YM7ZFk171Sq3c03RMA9nX3lrUV8Z6VRWfxSqxAGTU89O11-jmB559hgDL',
  },
  {
    name: 'Delhivery',
    urlName: 'Delhivery',
    category: ['Pallet Hyperlocal', 'Logistics'],
    shortdescription: 'Streamline logistics and delivery processes with Delhivery.',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://mir-s3-cdn-cf.behance.net/projects/404/ad33ab147897221.Y3JvcCwzMzY3LDI2MzMsMCww.png',
  },
  {
    name: 'Pallet Delivery',
    urlName: 'Pallet',
    category: ['Pallet Hyperlocal', 'Logistics', 'Google Merchant Center'],
    shortdescription: 'Simplify logistics operations with Pallet\'s solutions.',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://cdn-icons-png.flaticon.com/512/2472/2472038.png',
  },
  {
    name: 'Amazon',
    urlName: 'Amazon',
    category: ['Sales Channel'],
    shortdescription: 'Enhance sales by listing products on Amazon Pantry.',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://cdn.iconscout.com/icon/free/png-256/free-amazon-1869030-1583154.png',
  },
  {
    name: 'Flipkart',
    urlName: 'Flipkart',
    category: ['Sales Channel'],
    shortdescription: 'Boost sales by selling products on the Flipkart platform',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://www.hfndigital.com/wp-content/uploads/sites/14/2018/04/219541-flipkart-logo-full.png',
  },

];

const Essentialapp = [
  {
    name: 'Pallet push',
    urlName: 'Pallet_push',
    category: ['Pallet', 'Marketing'],
    shortdescription: 'Streamline and optimize marketing campaigns',
    description:
      'A mobile app that helps you efficiently manage and track inventory in your warehouse. It allows you to easily push pallets to their designated locations and keep a record of stock movements.',
    img: 'https://i.ibb.co/6XcGJ9P/Palletpush.png',
  },
  {
    name: 'Pallet POS',
    urlName: 'Pallet_POS',
    category: ['Billing', 'Pallet'],
    shortdescription: 'Efficiently manage billing and transactions with Pallet POS',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://i.ibb.co/RCZ5Y21/Point-of-Sale.png',
  },
  {
    name: 'Coupons',
    urlName: 'Coupons',
    category: ['Marketing'],
    shortdescription: 'Generate and distribute digital coupons for promotions',
    description:
      'A digital coupon management system that enables you to create, distribute, and redeem coupons for your products or services. It helps attract new customers and increase sales through targeted promotions.',
    img: 'https://i.ibb.co/DV0cJWy/Coupons.png',
  },
  {
    name: 'ICICI Easypay',
    urlName: 'ICICI_Easypay',
    category: ['Payments'],
    shortdescription: 'Enable ICICI Easy Pay for hassle-free payments',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxKG8uWIadVYVoYqEbpUDXOBJ1TrCYRS9Fvs6O1GDk-b1ayVByUDk01OGiMOxyW3wYCSY&usqp=CAU',
  },
  {
    name: 'PayTM',
    urlName: 'PayTM',
    category: ['Payments'],
    shortdescription: 'Offer Paytm as a payment option for seamless transactions.',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://static.vecteezy.com/system/resources/previews/019/040/328/original/paytm-logo-icon-free-vector.jpg',
  },
  {
    name: 'Pinelabs',
    urlName: 'Pinelabs',
    category: ['Payments'],
    shortdescription: 'Utilize Pinelabs for secure and reliable payment processing',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://images.moneycontrol.com/static-mcnews/2019/03/pine-labs-770x433.jpg?impolicy=website&width=770&height=431',
  },
  {
    name: 'Pallet Delhivery',
    urlName: 'Pallet_Delhivery',
    category: ['Pallet Hyperlocal', 'Logistics', 'Google Merchant Center'],
    shortdescription: 'Simplify logistics operations with Pallet\'s solutions.',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://i.ibb.co/znGh5Rv/Pallet-delivery.png',
  },
];

const PopularApps = [
  {
    name: 'Loyalty program',
    urlName: 'Loyalty_program',
    category: ['Marketing'],
    shortdescription: 'Create and manage customer loyalty programs',
    description:
      'A customer loyalty program platform that rewards your loyal customers and encourages repeat purchases. It offers features like point accumulation, reward redemption, and personalized offers.',
    img: 'https://i.ibb.co/rbvFgvM/Loyalty-program.png',
  },
  {
    name: 'Gift cards',
    urlName: 'Gift_cards',
    category: ['Marketing'],
    shortdescription: 'Offer digital gift cards for easy gifting and customer rewards',
    description:
      'An electronic gift card solution that allows you to sell and manage gift cards for your business. Customers can purchase gift cards for themselves or send them to others, boosting your sales and brand awareness.',
    img: 'https://i.ibb.co/SVjvdK5/Giftcards.png',
  },
  {
    name: 'Tally',
    urlName: 'Tally',
    category: ['Accounting and Finance'],
    shortdescription: 'Utilize Tally for efficient and accurate accounting tasks.',
    description:
      'An accounting and finance software that simplifies financial management tasks such as bookkeeping, invoicing, expense tracking, and financial reporting. It provides insights into your business\'s financial health and helps ensure compliance.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Tally_-_Logo.png',
  },
  {
    name: 'Zoho Books',
    urlName: 'Zoho_Books',
    category: ['Accounting and Finance'],
    shortdescription: 'Manage accounting and financial processes with Zohobooks',
    description:
      'An accounting and finance software that simplifies financial management tasks such as bookkeeping, invoicing, expense tracking, and financial reporting. It provides insights into your business\'s financial health and helps ensure compliance.',
    img: 'https://www.thesmbguide.com/images/zoho-books-420x320-20201008.png',
  },
  {
    name: 'Amazon',
    urlName: 'Amazon',
    category: ['Sales Channel'],
    shortdescription: 'Enhance sales by listing products on Amazon Pantry.',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://cdn.iconscout.com/icon/free/png-256/free-amazon-1869030-1583154.png',
  },
  {
    name: 'Flipkart',
    urlName: 'Flipkart',
    category: ['Sales Channel'],
    shortdescription: 'Boost sales by selling products on the Flipkart platform',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://www.hfndigital.com/wp-content/uploads/sites/14/2018/04/219541-flipkart-logo-full.png',
  },
  {
    name: 'Zomato',
    urlName: 'Zomato',
    category: ['Sales Channel'],
    shortdescription: 'Tap into Zomato\'s customer base for increased sales',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png',
  },
  {
    name: 'Dunzo',
    urlName: 'Dunzo',
    category: ['Sales Channel'],
    shortdescription: 'Tap into the delivery services of Dunzo for seamless sales.',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://seeklogo.com/images/D/dunzo-logo-FF49681C98-seeklogo.com.png',
  },
  {
    name: 'BlinkIt',
    urlName: 'BlinkIt',
    category: ['Sales Channel'],
    shortdescription: 'Utilize BlinkIt to boost sales and reach new customers.',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Blinkit-yellow-app-icon.svg/3500px-Blinkit-yellow-app-icon.svg.png',
  },
  {
    name: 'Swiggy',
    urlName: 'Swiggy',
    category: ['Sales Channel'],
    shortdescription: 'Increase sales by partnering with Swiggy for food delivery.',
    description:
      'A payment processing solution that allows you to securely accept payments from customers through various methods, including credit cards, mobile wallets, and online transfers. It ensures smooth and secure transactions for your business.',
    img: 'https://cdn.iconscout.com/icon/free/png-256/free-swiggy-1613371-1369418.png',
  },
];


const installedTagStyle = {
  backgroundColor: '#4fab35',
  borderRadius: '4px',
  padding: '2px 4px',
  color: '#fff',
  fontWeight: 'bold',
  fontFamily: 'Arial, sans-serif',
  fontSize: '12px',
  float: 'right',
};

const Appslist = () => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedAppDescription, setSelectedAppDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [appAccountId, SetAppAccountID] = useState('');
  const dispatch = useDispatch();
  const handleCardClick = (appName, appDescription) => {
    setSelectedApp(appName);
    setSelectedAppDescription(appDescription);
    setOpen(true);
    dispatch(setRecommendedApps(appnames));
    navigate(`/app/${appName}`);
  };

  const [AppData, SetAppData] = useState();

  // console.log(AppData);

  const installedApps = useSelector(getInstalledApps);

  useEffect(() => {
    apps_integerationData()
      .then((res) => {
        SetAppData(res?.data?.data?.data);
      })
      .catch((err) => {});
  }, []);

  const appDataArray = Array.isArray(AppData) ? AppData : [];
  const result = appDataArray
    .filter((e) => e.addonId !== null)
    .map((e) => {
      return {
        name: e.packageName ?? '',
        urlName: e.packageName ? e.packageName.replace(/\s+/g, '_') : '',
        category: e.category ? e.category.split(',').map((category) => category.trim()) : [],
        shortdescription: e.shortDescription ?? '',
        chargeable: e?.chargeable,
        description:
          'A mobile app that helps you efficiently manage and track inventory in your warehouse. It allows you to easily push pallets to their designated locations and keep a record of stock movements.',
        img: e.logoUrl ?? '',
      };
    });



  const navigate = useNavigate();
  const handleInstallClick = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const onCategoryChange = (event) => {
    setSelectedCategory(event.value);
    setFilteredapps(filteredAppnames.length > 0 ? filteredAppnames : Appslist);
  };
  const onshowinstalledapps = (event) => {
    navigate('/Showinstalledapp');
  };

  const filteredAppnames = appnames.filter((app) => {
    const appNameMatches = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatches =
      selectedCategory === 'All' ||
      (app.category && app.category.some((category) => selectedCategory.includes(category)));
    return appNameMatches && categoryMatches;
  });

  const [isHovered, setIsHovered] = useState(false);

  const handleHoverStart = () => {
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
  };
  const onSeeAll = () => {
    navigate('/Allapps');
  };

  const optiondata = [
    { value: 'All', label: 'All' },
    { value: 'Sales Channel', label: 'Sales Channel' },
    { value: 'Pallet', label: 'Pallet' },
    { value: 'Accounting and Finance', label: 'Accounting and Finance' },
    { value: 'Payments', label: 'Payments' },
    { value: 'Pallet Hyperlocal', label: 'Pallet Hyperlocal' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Billing', label: 'Billing' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'Google Merchant Center', label: 'Google Merchant Center' },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar
        Appsearch={
          <div style={{ marginRight: '20px' }}>
            <SoftInput
              placeholder="Search Apps"
              icon={{ component: 'search', direction: 'left' }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        }
      />

      <SoftBox>
 
        <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SoftBox

          >
            <SoftBox className="heading">App Market</SoftBox>
            <p style={{ color: 'rgb(110, 118, 128)', fontSize: '1rem' }}>
              Explore {appnames.length} apps in App Marketplace.
            </p>
          </SoftBox>
      
        </SoftBox>

     
        <hr style={{ borderColor: '#ede7e6', opacity: '0.5' }} />
      </SoftBox>

      {result?.length !== 0 ? (
        <>
          <div>
            <SoftBox
              style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between', marginInline: '15px' }}
            >
              <SoftBox
          
        
              >
                <SoftBox className="heading" style={{ fontSize: '1.3rem' }}>
                  Essential Apps
                </SoftBox>
                <p style={{ color: 'rgb(110, 118, 128)', fontSize: '0.9rem', marginTop: '-15px' }}>
                  Access premium features with ...
                </p>
              </SoftBox>
        
              <SoftButton variant="text" color="info" onClick={onSeeAll}>
                See All
              </SoftButton>
            </SoftBox>

            <Grid container spacing={2} style={{ padding: '30px' }}>
              {Essentialapp.map((e, i) => (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={i}>
                  <div
                  >
                    <Card
                      key={e.name}
                      elevation={6}
                      className="app-card"
                      onClick={() => handleCardClick(e.urlName, e.description)}
                    >
                      <div>
                        <img src={e.img} height={40} style={{ marginRight: '15px' }} />
                        {installedApps?.includes(e.name) ? <span style={installedTagStyle}>Installed</span> : null}
                        <SoftBox style={{ fontSize: '1.1rem', fontWeight: '500', color: '#2b2928', marginTop: '2px' }}>
                          {e.name}
                          <div style={{ display: 'flex', marginLeft: '4rem', marginTop: '-5px' }}>
                            {e?.cardinfo?.map((item) => (
                              <SoftTypography
                                style={{
                                  backgroundColor: '#edf0f2',
                                  borderRadius: '7px',
                                  width: 'fit-content',
                                  height: 'fit-content',
                                  marginRight: '1rem',
                                  paddingRight: '0.3rem',
                                  paddingLeft: '0.4rem',
                                  fontSize: '1.1rem',
                                }}
                              >
                                {item}
                              </SoftTypography>
                            ))}
                          </div>
                        </SoftBox>
                      </div>
                      <p style={{ paddingTop: '15px', paddingBottom: '25px' }}>{e.shortdescription}</p>

                      <SoftBox style={{ display: 'flex' }}>
                        <SoftTypography style={{ fontWeight: 'bold' }}> Paid / Free </SoftTypography>
                 
                      </SoftBox>
                    </Card>
                  </div>
                </Grid>
              ))}

              <Grid item xs={12}>
                <SoftBox style={{ display: 'flex', marginTop: '5px', justifyContent: 'space-between' }}>
                  <SoftBox
      
                  >
                    <SoftBox className="heading" style={{ fontSize: '1.3rem' }}>
                      Popular Apps
                    </SoftBox>
                    <p style={{ color: 'rgb(110, 118, 128)', fontSize: '0.9rem', marginTop: '-15px' }}>
                      Access Popular Apps with ...
                    </p>
                  </SoftBox>
                  <SoftButton variant="text" color="info" onClick={onSeeAll}>
                    See All
                  </SoftButton>
                </SoftBox>
              </Grid>
              {PopularApps.map((e, i) => (
                <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={i}>
                  <div
                  >
                    <Card
                      key={e.name}
                      elevation={6}
                      className="app-card"
                      onClick={() => handleCardClick(e.urlName, e.description)}
                    >
                      <div>
                        <img src={e.img} height={40} style={{ marginRight: '15px' }} />
                        {installedApps?.includes(e.name) ? <span style={installedTagStyle}>Installed</span> : null}
                        <SoftBox style={{ fontSize: '1.1rem', fontWeight: '500', color: '#2b2928', marginTop: '2px' }}>
                          {e.name}
                          <div style={{ display: 'flex', marginLeft: '4rem', marginTop: '-5px' }}>
                            {e?.cardinfo?.map((item) => (
                              <SoftTypography
                                style={{
                                  backgroundColor: '#edf0f2',
                                  borderRadius: '7px',
                                  width: 'fit-content',
                                  height: 'fit-content',
                                  marginRight: '1rem',
                                  paddingRight: '0.3rem',
                                  paddingLeft: '0.4rem',
                                }}
                              >
                                {item}
                              </SoftTypography>
                            ))}
                          </div>
                        </SoftBox>
                      </div>
                      <p style={{ paddingTop: '15px', paddingBottom: '25px' }}>{e.shortdescription}</p>

                      <SoftBox style={{ display: 'flex' }}>
                        <SoftTypography style={{ fontWeight: 'bold' }}> Paid / Free </SoftTypography>
             
                      </SoftBox>
                    </Card>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </>
      ) : (
        <SoftTypography style={{ fontSize: '16px', paddingLeft: '33vw', paddingTop: '10vh' }}>
          No Apps Available
        </SoftTypography>
      )}
    </DashboardLayout>
  );
};

export default Appslist;
