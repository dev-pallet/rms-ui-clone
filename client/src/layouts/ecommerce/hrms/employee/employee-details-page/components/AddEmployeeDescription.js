import { Box, Card, IconButton } from '@mui/material';
import SoftTypography from '../../../../../../components/SoftTypography';
import SoftAvatar from '../../../../../../components/SoftAvatar';
import SoftButton from '../../../../../../components/SoftButton';
import CelebrationIcon from '@mui/icons-material/Celebration';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function AddEmployeeDescription({
  photoUrl,
  name,
  employmentStatus,
  nickName,
  skypeLink,
  whatsappLink,
  linkedinLink,
  dobMonth,
  designationName,
  employeeId,
  departmentName,
}) {
  return (
    <Card
      sx={{
        overflow: 'visible',
        width: '100%',
        marginTop: '20px',
        boxShadow: 'rgba(0, 0, 0, 0.18) 0px 2px 4px;',
        borderRadius: '1.5rem',
        padding: '20px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '25px' }}>
        <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Box
            style={{ backgroundColor: '#f0f3f3', borderRadius: '24px' }}
            width={'1.5in'}
            height={'1.5in'}
            flexShrink={0}
          >
            <SoftAvatar
              src={photoUrl}
              alt="Passport Photo"
              variant="square"
              size="sm"
              shadow="sm"
              className="custom-soft-avatar"
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <SoftTypography fontSize="24px" fontWeight="bold">
                {name.split(' ')[0]}
              </SoftTypography>
              {employmentStatus && (
                <SoftButton
                  sx={{
                    width: '30px',
                    padding: '0px 1px',
                    border: '1px solid #4fb061',
                    boxSizing: 'border-box',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0,0,0,0)',
                    color: '#4fb061',
                    fontSize: '14px',
                    fontFamily: 'Roboto',
                    lineHeight: '24px',
                    outline: 'none',
                    minWidth: '90px',
                  }}
                >
                  {' '}
                  {employmentStatus}
                </SoftButton>
              )}
            </Box>
            <Box>
              <SoftTypography sx={{ color: '#505050', fontSize: '16px' }}>Preferred calling as </SoftTypography>
            </Box>

            <Box sx={{ marginTop: '-10px' }}>
              <SoftTypography fontSize="24px" fontWeight="bold">
                {nickName}
              </SoftTypography>
            </Box>

            <Box sx={{ display: 'flex', gap: '10px' }}>
              <IconButton
                component="a"
                href={linkedinLink}
                disabled={!linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#0A66C2', padding: '2px' }}
              >
                <LinkedInIcon/>
              </IconButton>
              <IconButton
                component="a"
                href={skypeLink}
                disabled={!skypeLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#00AFF0', padding: '2px' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                  <path fill="#174ba8" d="M16 4A12 12 0 1 0 16 28A12 12 0 1 0 16 4Z"></path>
                  <path fill="#146ce8" d="M32 20A12 12 0 1 0 32 44A12 12 0 1 0 32 20Z"></path>
                  <path fill="#30a6ff" d="M24 6A18 18 0 1 0 24 42A18 18 0 1 0 24 6Z"></path>
                  <path
                    fill="#fff"
                    d="M16.97,31.316c0-1.037,1.089-1.624,1.832-1.624c0.743,0,2.816,1.451,4.803,1.451 c1.054,0,3.421-0.103,3.421-2.29c0-3.585-10.115-3.308-10.115-9.274c0-1.038,0.285-5.795,7.784-5.795 c2.016,0,5.71,0.577,5.71,2.493c0,1.406-0.958,1.769-1.6,1.769c-1.244,0-1.745-1.123-4.285-1.123c-3.508,0-3.421,2.102-3.421,2.408 c0,3.017,10.073,3.017,10.073,9.255c0,6.141-7.491,5.814-8.58,5.814C21.474,34.4,16.97,33.856,16.97,31.316z"
                  ></path>
                </svg>
              </IconButton>

              {/* WhatsApp Icon */}
              <IconButton
                component="a"
                href={whatsappLink}
                disabled={!whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#25D366', padding: '2px' }}
              >
                <WhatsAppIcon/>
                
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Box sx={{ display: 'flex', gap: '5px' }}>
            <CelebrationIcon fontSize="small" />
            <SoftTypography sx={{ color: '#505050', fontSize: '16px' }}>
              Celebrating birthday on {dobMonth}{' '}
            </SoftTypography>
          </Box>

          <Box sx={{ display: 'flex', gap: '25px' }}>
            <Box sx={{}}>
              <SoftTypography sx={{ color: '#505050', fontSize: '16px' }}>Job Title</SoftTypography>
              <SoftTypography sx={{ color: '#505050', fontSize: '16px' }}>Employee ID</SoftTypography>
              <SoftTypography sx={{ color: '#505050', fontSize: '16px' }}>Department</SoftTypography>
            </Box>

            <Box>
              <SoftTypography sx={{ color: '#030303', fontSize: '16px', fontWeight: 600 }}>
                {designationName}
              </SoftTypography>
              <SoftTypography sx={{ color: '#030303', fontSize: '16px', fontWeight: 600 }}>{employeeId}</SoftTypography>
              <SoftTypography sx={{ color: '#030303', fontSize: '16px', fontWeight: 600 }}>
                {departmentName}
              </SoftTypography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default AddEmployeeDescription;
