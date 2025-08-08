import React from 'react'
import DashboardLayout from '../LayoutContainers/DashboardLayout'
import { Box } from '@mui/material'
import DashboardNavbar from '../Navbars/DashboardNavbar'

const ProtectedIllustration = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
        <Box width="70%" margin="auto" boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px">
          <img src='https://cdn.dribbble.com/users/1812146/screenshots/6968881/media/6f0414445451d903e9d4ab56f85bc573.png?compress=1&resize=768x576&vertical=top'/>
        </Box>
    </DashboardLayout>
  )
}

export default ProtectedIllustration
