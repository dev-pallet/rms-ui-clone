/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components


// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function About() {
  return (
    <SoftBox>
      <SoftBox width="80%" textAlign="center" mx="auto" mb={4}>
        <SoftBox mb={1}>
          <SoftTypography variant="h5" fontWeight="regular">
            Let&apos;s start with the basic information
          </SoftTypography>
        </SoftBox>
      </SoftBox>

      <SoftTypography variant="body2" fontWeight="regular" color="text" mb={1}>
              Step 1: Choose ideal layout components in your layout.
      </SoftTypography>

      <SoftTypography variant="body2" fontWeight="regular" color="text" mb={1}>
              Step 2: Assign hierarchy. This will enable you to nest components under each parent component. For example, Building, Zone, Bay, Racks, Bins.
      </SoftTypography>

      <SoftTypography variant="body2" fontWeight="regular" color="text" mb={1}>
              Step 3: Name individual components and generate a unique barcode for each combination.
      </SoftTypography>

      <SoftTypography variant="body2" fontWeight="regular" color="text">
              Step 4: The barcode generated will help you inward stocks and identify the location.
      </SoftTypography>

    </SoftBox>
  );
}

export default About;
