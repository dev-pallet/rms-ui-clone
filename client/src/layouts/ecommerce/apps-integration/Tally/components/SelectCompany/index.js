import Grid from '@mui/material/Grid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';

const SelectCompany = ({ companyList, handleAddCompany, handleRemoveCompany, handleCompanyChange }) => {
  return (
    <SoftBox className="company">
      <SoftBox className="company-details">
        <SoftTypography className="company-top-heading">Add the company for configuration in tally</SoftTypography>
        <SoftTypography className="company-sub-heading">
          Select the company for which you want to synchronize data with tally. This configuration will determine the
          settings for the chosen company.
        </SoftTypography>
      </SoftBox>
      <SoftBox className="company-select-add-data">
        <SoftBox className="add-company">
          {companyList.map((item, index) => {
            return (
              <Grid container spacing={3} style={{ marginBottom: '1rem' }}>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox className="company-name">
                    <SoftInput
                      type="text"
                      value={item.companyName}
                      placeholder="Enter company name"
                      name="companyName"
                      onChange={(e) => handleCompanyChange(e, index)}
                    />
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox className="company-number">
                    <SoftInput
                      type="number"
                      value={item.companyNumber}
                      name="number"
                      onChange={(e) => handleCompanyChange(e, index)}
                      placeholder="Enter company number"
                    />
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4} sx={{ cursor: 'pointer' }}>
                  <HighlightOffIcon className="add-customer-add-more" onClick={() => handleRemoveCompany(index)} />
                </Grid>
              </Grid>
            );
          })}
        </SoftBox>
        <SoftBox className="add-more-box-div">
          <SoftTypography
            // className="adds add-more-text"
            className="add-more-text"
            component="label"
            variant="caption"
            fontWeight="bold"
            onClick={() => handleAddCompany()}
          >
            + Add More
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
};

export default SelectCompany;
