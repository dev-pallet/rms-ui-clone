import { Box, Container, Typography } from "@mui/material";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import SoftTypography from "../../../components/SoftTypography";

const ComingSoon = () => {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Container
          maxWidth="xl"
          sx={{
            height: '85vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
          }}
        >
          <Box
            component="img"
            src="https://storage.googleapis.com/twinleaves_dev_public/pallet/cms/product/upload/images/ae2f3b32-71f7-4739-af61-a539e0c24362/image1"
            alt="Coming Soon"
            sx={{
              maxWidth: '400px',
              width: '100%',
              marginBottom: '20px',
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              marginBottom: '20px',
              background: 'linear-gradient(90deg, #FF6B6B, #FFD93D)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              animation: 'pulse 2s infinite',
            }}
          >
            Coming Soon
          </Typography>
          <SoftTypography
            sx={{
              marginBottom: '30px',
              color: '#555',
              fontSize: '1.2rem',
              letterSpacing: '0.05em',
              lineHeight: '1.5',
              fontStyle: 'italic',
              animation: 'fadeIn 2s ease-in-out',
            }}
          >
            We are working on this feature so it's ready for you. Wait for us.
          </SoftTypography>
        </Container>
      </DashboardLayout>
    );
  };
  
  export default ComingSoon;
  