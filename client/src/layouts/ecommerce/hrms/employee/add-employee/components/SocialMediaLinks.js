import { Card, Grid, InputLabel, IconButton, TextField, InputAdornment } from '@mui/material';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';

function SocialMediaLinks({    whatsappNumber,setWhatsappNumber,linkedinUsername, setLinkedinUsername,skypeUsername, setSkypeUsername

}) {

  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };


  const handleInputChange=(e)=>{
    const {name,value} = e.target

    switch(name){
        case "linkedinUserName":
            setLinkedinUsername(value)
            break;
        case "whatsappNumber":
            setWhatsappNumber(value)
            break;
        case "skypeUserName":
            setSkypeUsername(value)
            break;
        default:
            return
    }

  }


  const formFields = [
    { id: 'linkedinUserName', label: 'Linkedin User Name', onChange: handleInputChange, value: linkedinUsername },
    { id: 'whatsappNumber', label: 'Whatsapp Number', onChange: handleInputChange, value: whatsappNumber },
    { id: 'skypeUserName', label: 'Skype User Name', onChange: handleInputChange, value: skypeUsername },

  ];

  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <InputLabel style={{ fontWeight: 'bold' }}>Social Media Details</InputLabel>

        <Grid container mt={1} spacing={2} direction="row" justifyContent="space-between" alignItems="center">
          {formFields?.map((field, index) => (
            <Grid item xs={12} md={12} lg={12} key={index}>
              <SoftBox>
                <InputLabel sx={inputLabelStyle} >
                  {field?.label}
                </InputLabel>
                <SoftInput
                  name={field?.id}
                  value={field?.value}
                  onChange={field?.onChange}
                  className="select-box-category"
                  size="small"
                />
              </SoftBox>
            </Grid>
          ))}
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default SocialMediaLinks;
