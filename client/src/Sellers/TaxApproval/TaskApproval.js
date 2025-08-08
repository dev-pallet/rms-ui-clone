import React from 'react';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';
import { Card } from '@mui/material';
import SoftTypography from '../../components/SoftTypography';

const TaskApproval = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <SoftTypography style={{ fontSize: '0.95rem' }}>Task Approval</SoftTypography>
      </Card>
    </DashboardLayout>
  );
};

export default TaskApproval;
