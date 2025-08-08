import './PalletPay.css';
import { Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import DataTable from '../../../examples/Tables/DataTable';
import React from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';

const RequestedMachine = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Card style={{paddingInline:'40px' , padding:'15px' , marginBottom:'20px'}}>
        <SoftBox style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
          <SoftTypography style={{ fontSize: '1.1rem' }}>Requested Machine</SoftTypography>
          <SoftBox style={{backgroundColor:'#f5f6f7' , width:'60px' , borderRadius :'10px' , textAlign:'center' ,border: '1px solid lightgray'}}>
            <SoftTypography Style={{ fontWeight: 'bold' }}>3</SoftTypography>
          </SoftBox>
        </SoftBox>{' '}

      </Card>

      {/* <Card style={{ marginTop:"20px"}}>
        <SoftBox style={{display:"flex" , justifyContent:"space-between", paddingInline:"30px",padding:"15px" }}>
        <SoftTypography style={{ fontSize: '1.1rem' }}>Machine</SoftTypography>
            <SoftTypography style={{ fontSize: '1.1rem' }}>Type</SoftTypography>
            <SoftTypography style={{ fontSize: '1.1rem' }}>Vendor</SoftTypography>
            <SoftTypography style={{ fontSize: '1.1rem' }}>Rental Type</SoftTypography>
            <SoftTypography style={{ fontSize: '1.1rem' }}>Status</SoftTypography>
        </SoftBox>
        </Card> */}

      <DataTable
        rowClick={(e)=>{
          // console.log(e)
          navigate('/palletpay/request/Details');
        }}
        sx={{padding:'20px !important', 
          '& .css-f2q4o2-MuiTableContainer-root': {
            borderRadius: '20px',
            padding:'20px'
          },}}
        entriesPerPage={false}
        table={{
          columns: [
            { Header: 'Vendor', accessor: 'salary', width: '30%' },
            { Header: 'Count', accessor: 'Status', width: '12%' },

            { Header: 'Type', accessor: 'Type', width: '17%' },
            { Header: 'Rental Type', accessor: 'RentalType' },
            { Header: 'Status', accessor: 'Machine', width: '25%' },

          ],
          rows: [
            {
              Machine: 'Hanny Baniard',
              Type: 'Data Coordiator',
              RentalType: 'Baorixile',
              Status: 42,
              startDate: '4/11/2021',
              salary: '$474,978',
            },
            {
              Machine: 'Lara Puleque',
              Type: 'Payment Adjustment Coordinator',
              RentalType: 'Cijangkar',
              Status: 47,
              startDate: '8/2/2021',
              salary: '$387,287',
            },
            {
              Machine: 'Torie Repper',
              Type: 'Administrative Officer',
              RentalType: 'Montpellier',
              Status: 25,
              startDate: '4/21/2021',
              salary: '$94,780',
            },
            {
              Machine: 'Nat Gair',
              Type: 'Help Desk Technician',
              RentalType: 'Imider',
              Status: 57,
              startDate: '12/6/2020',
              salary: '$179,177',
            },
            {
              Machine: 'Maggi Slowan',
              Type: 'Help Desk Technician',
              RentalType: 'Jaunpils',
              Status: 56,
              startDate: '11/7/2020',
              salary: '$440,874',
            },
            {
              Machine: 'Marleah Snipe',
              Type: 'Account Representative II',
              RentalType: 'Orekhovo-Borisovo Severnoye',
              Status: 31,
              startDate: '7/18/2021',
              salary: '$404,983',
            },
            {
              Machine: 'Georgia Danbury',
              Type: 'Professor',
              RentalType: 'Gniezno',
              Status: 50,
              startDate: '10/1/2020',
              salary: '$346,576',
            },
            {
              Machine: 'Bev Castan',
              Type: 'Design Engineer',
              RentalType: 'Acharnés',
              Status: 19,
              startDate: '1/14/2021',
              salary: '$445,171',
            },
            {
              Machine: 'Reggi Westney',
              Type: 'Financial Advisor',
              RentalType: 'Piuí',
              Status: 56,
              startDate: '3/21/2021',
              salary: '$441,569',
            },
            {
              Machine: 'Bartholomeus Prosh',
              Type: 'Project Manager',
              RentalType: 'Kelīshād va Sūdarjān',
              Status: 28,
              startDate: '5/27/2021',
              salary: '$336,238',
            },
            {
              Machine: 'Sheffy Feehely',
              Type: 'Software Consultant',
              RentalType: 'Ndibène Dahra',
              Status: 27,
              startDate: '3/23/2021',
              salary: '$473,391',
            },
            {
              Machine: 'Euphemia Chastelain',
              Type: 'Engineer IV',
              RentalType: 'Little Baguio',
              Status: 63,
              startDate: '5/1/2021',
              salary: '$339,489',
            },
          ]
        }}
      />
    </DashboardLayout>
  );
};

export default RequestedMachine;
