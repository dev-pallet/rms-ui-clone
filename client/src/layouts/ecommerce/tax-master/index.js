import './tax-master.css';
import { Grid } from '@mui/material';
import {Link} from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from 'components/SoftTypography';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';

const Taxmaster = ()=>{
  sideNavUpdate();
  return (
    <DashboardLayout>
      <DashboardNavbar/>
      <SoftBox className="tax-box">
        <SoftTypography className="tax-text">Taxes and duties</SoftTypography>
      </SoftBox>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12} xl={12}>
          <SoftBox className="sales-tax-collection-box">
            <SoftBox className="sales-tax-inner-box">
              <SoftTypography className="manage-text">Manage sales tax collection</SoftTypography>
              <SoftTypography className="shipping-text">If you haven’t already, create a <b className="zone-text"> shipping zone </b>  in the region(s) you’re liable in. Then, find the region in this list and select it to manage its tax settings. 
                                If you’re unsure about where you’re liable, check with a tax professional.
              </SoftTypography>
            </SoftBox>

            <SoftBox className="tax-first-flex-box">
              <SoftTypography className="collected-text">Country/region</SoftTypography>
              <SoftTypography className="collected-text">Collecting</SoftTypography>
            </SoftBox>

            <SoftBox className="tax-second-flex-box">
              <SoftBox className="flag-box">
                <img className="flag-image" src="https://cdn.britannica.com/97/1597-004-05816F4E/Flag-India.jpg" alt=""/>
                <Link to="/setting/taxes/IN">
                  <SoftTypography className="collected-text-underline">India</SoftTypography></Link>
              </SoftBox>
                            
              <SoftTypography className="collected-text">Taxes</SoftTypography>
            </SoftBox>

            <SoftBox className="tax-third-flex-box">
              <SoftBox className="flag-box">
                <img className="flag-image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Globe_icon.svg/2048px-Globe_icon.svg.png" alt=""/>
                <SoftTypography className="collected-text-underline">Rest of World</SoftTypography>
              </SoftBox>
                            
              <SoftTypography className="collected-text">----</SoftTypography>
            </SoftBox>
          </SoftBox>
        </Grid>
        <Grid item xs={12} md={12} xl={12}>
          <SoftBox className="duties-import-box">
            <SoftBox className="duties-inner-box">
              <SoftTypography className="manage-text">Duties and import taxes</SoftTypography>
            </SoftBox>
                        
            <SoftBox className="compare-plans-box">
              <SoftBox className="compare-I-box">
                <SoftTypography className="manage-text">Help international customers avoid unexpected fees</SoftTypography>
                <SoftTypography className="shipping-text">Upgrade to Advanced Shopify to collect duties and import taxes at checkout for countries/regions you ship to.</SoftTypography>
                <SoftButton className="compare-soft-button">Compare plans</SoftButton>
                <SoftTypography className="shipping-text">The transaction fee is 1.5%, or 0.85% for Shopify Payments. <b className="zone-text">About transaction fees.</b> </SoftTypography>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </Grid>

        <Grid item xs={12} md={12} xl={12}>
          <SoftBox className="charged-box">
            <SoftBox className="charged-inner-box">
              <SoftTypography className="manage-text">Decide how tax is charged</SoftTypography>
              <SoftTypography className="shipping-text">Manage how taxes are charged and shown in your store. For a summary of the taxes you’ve collected, <b className="zone-text">view your report.</b> </SoftTypography>
            </SoftBox>
                       
            <SoftBox className="include-tax-box">
              <SoftBox className="include-tax-inner-box">
                <input className="check-box-box" type="checkbox"/>
                <SoftTypography className="include-text">Include tax in prices</SoftTypography>
              </SoftBox>      
              <SoftTypography className="product-text">Product prices will include tax. Taxes on shipping rates will be included in the shipping price.
                <b className="zone-text"> Learn more about when to use this setting.</b></SoftTypography>
            </SoftBox>

            <SoftBox className="include-tax-box">
              <SoftBox className="include-tax-inner-box">
                <input className="check-box-box" type="checkbox"/>
                <SoftTypography className="include-text">Include or exclude tax based on your customer’s country</SoftTypography>
              </SoftBox>      
              <SoftTypography className="product-text"><b className="zone-text">Go to Markets preferences</b>  to turn this setting on.</SoftTypography>
            </SoftBox>

            <SoftBox className="include-tax-box">
              <SoftBox className="include-tax-inner-box">
                <input className="check-box-box" type="checkbox"/>
                <SoftTypography className="include-text">Charge tax on shipping rates</SoftTypography>
              </SoftBox>      
              <SoftTypography className="product-text">Include shipping rates in the tax calculation. This is automatically calculated for Canada, European Union, and United States.</SoftTypography>
            </SoftBox>

            <SoftBox className="include-tax-box-I">
              <SoftBox className="include-tax-inner-box">
                <input className="check-box-box" type="checkbox"/>
                <SoftTypography className="include-text">Charge VAT on digital goods </SoftTypography>
              </SoftBox>      
              <SoftTypography className="product-text">This will create a collection that you can add digital products to.
                             VAT will be applied to products in the collection at checkout (for European customers).
              <b className="zone-text">Learn more</b> </SoftTypography>
            </SoftBox>
          </SoftBox> 
        </Grid>
      </Grid>
      <SoftTypography className="learn-more-text">Learn more about <b className="zone-text">taxes</b> </SoftTypography>

    </DashboardLayout>
  );
};

export default Taxmaster;