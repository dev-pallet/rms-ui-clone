import './credit.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Box from '@mui/material/Box';
import SoftBox from 'components/SoftBox';
import { noDatagif } from '../../../Common/CommonFunction';
export const Credit = () => {
  const columns = [
    {
      field: 'createdOn',
      headerName: 'Date',
      width: 120,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'id',
      headerName: 'Status',
      width: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'Sales',
      headerName: 'Sales Order',
      width: 180,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'Receive',
      headerName: 'Receive Status',
      width: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'Refund',
      headerName: 'Refund Status',
      width: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'Returned',
      headerName: 'Returned',
      width: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'amount',
      headerName: 'Amount Refund',
      width: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'balance',
      headerName: 'Total Balance',
      width: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  // const rows = [
  //   {
  //   createdOn: "25/02/2023",
  //   id: "Approved",
  //   Sales:"S0-00",
  //   Receive: 'Nill',
  //   Refund: "Nill",
  //   Returned: "Nill",
  //   amount: "70000",
  //   balance: "Nill",
  //   }
  // ]

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorComing, setErrorComing] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);

  return (
    <>
      <SoftBox className="softbox-box-shadow">
        <Box sx={{ height: 400, width: '100%' }}>
          <SoftBox className="No-data-text-box">
            <SoftBox className="src-imgg-data">
              <img className="src-dummy-img" src={noDatagif} />
            </SoftBox>

            <h3 className="no-data-text-I">NO DATA FOUND</h3>
          </SoftBox>
          {/* <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // checkboxSelection
            disableSelectionOnClick
            // onCellDoubleClick={() => { navigate("/sales/all-orders/details") }}
          /> */}
        </Box>
      </SoftBox>
    </>
  );
};
