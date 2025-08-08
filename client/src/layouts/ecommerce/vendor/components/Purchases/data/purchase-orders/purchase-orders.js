import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { Card, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import SoftBox from 'components/SoftBox';
import Spinner from 'components/Spinner/index';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftButton from '../../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../../components/SoftTypography';
import { getVendorPurchaseOrders } from '../../../../../../../config/Services';
import { dataGridStyles } from '../../../../../Common/NewDataGridStyle';

export const PurchaseOrders = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const locId = localStorage.getItem('locId');

  const [loader, setLoader] = useState(false);
  const [errorTableData, setErrorTableData] = useState(false);
  const [anchorElAction, setAnchorElAction] = useState(null);
  const openAction = Boolean(anchorElAction);

  const actionButtonClick = (event) => {
    setAnchorElAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  const columns = [
    {
      field: 'orderedOn',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 110,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    {
      field: 'poNumber',
      headerName: 'PO ID',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    {
      field: 'grossAmount',
      headerName: 'Purchase value',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    // {
    //   field: 'orderedBy',
    //   headerName: 'Vendor',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   width: 200,
    //   cellClassName: 'datagrid-rows',
    //   align: "left",
    // },
    {
      field: 'status',
      headerName: 'Delivery',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 120,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    {
      field: 'bills',
      headerName: 'Bills',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 80,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
      renderCell: (params) => {
        const color = params?.row?.billStatus !== 'CREATED' && params?.row?.billStatus !== 'REJECTED' ? 'green' : null;
        return (
          <Tooltip title={params?.row?.billStatus || ''} placement="top">
            <TaskAltOutlinedIcon sx={{ color: color }} fontSize="small" />
          </Tooltip>
        );
      },
    },
    {
      field: 'payments',
      headerName: 'Payments',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 80,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
      renderCell: (params) => {
        const color =
          params?.row?.paymentStatus === 'PARTIALY_PAID' || params?.row?.paymentStatus === 'PAID' ? 'green' : null;
        return (
          <Tooltip title={params?.row?.paymentStatus || ''} placement="top">
            <TaskAltOutlinedIcon sx={{ color: color }} fontSize="small" />
          </Tooltip>
        );
      },
    },
    {
      field: 'location',
      headerName: 'Location',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 80,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },

    // {
    //   field: 'edit',
    //   headerName: '',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   width: 100,
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   flex: 1,

    //   renderCell: (params) => {
    //     return (
    //       <SoftBox>
    //         <SoftBox
    //           className="moreicons-dot-box"
    //           id="basic-button"
    //           aria-controls={open ? 'basic-menu' : undefined}
    //           aria-haspopup="true"
    //           aria-expanded={open ? 'true' : undefined}
    //           onClick={actionButtonClick}
    //         >
    //           <MoreHorizIcon className="moreicons-dot" />
    //         </SoftBox>
    //         <Menu
    //           id="basic-menu"
    //           anchorEl={anchorElAction}
    //           open={openAction}
    //           onClose={handleCloseAction}
    //           PaperProps={{
    //             elevation: 0,
    //             sx: {
    //               overflow: 'visible',
    //               filter: 'drop-shadow(-10px -10px -10px red)',
    //               mt: 1.5,
    //               '& .MuiAvatar-root': {
    //                 width: 20,
    //                 height: 32,
    //                 ml: -0.5,
    //                 mr: 1,
    //               },
    //               '&:before': {
    //                 content: '""',
    //                 display: 'block',
    //                 position: 'absolute',
    //                 top: 0,
    //                 right: 14,
    //                 width: 10,

    //                 height: 10,
    //                 bgcolor: 'background.paper',
    //                 transform: 'translateY(-50%) rotate(45deg)',
    //                 zIndex: 0,
    //               },
    //             },
    //           }}
    //           transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    //           anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    //         >
    //           <MenuItem onClick={handleCloseAction}>Active</MenuItem>
    //           <MenuItem onClick={handleCloseAction}>In Active</MenuItem>
    //           <MenuItem onClick={handleCloseAction}>Bookmarked</MenuItem>
    //           <MenuItem onClick={handleCloseAction}>Delete</MenuItem>
    //         </Menu>
    //       </SoftBox>
    //     );
    //   },
    // },
  ];

  const [datRows, setTableRows] = useState([]);
  let dataArr,
    dataRow = [];

  useEffect(() => {
    const payload = {
      page: 0,
      size: 10,
      poSearchInput: null,
      sourceLocation: [locId],
      vendorId: vendorId,
    };
    setLoader(true);
    getVendorPurchaseOrders(payload)
      .then(function (responseTxt) {
        dataArr = responseTxt.data.data;
        dataRow.push(
          dataArr?.vendorPurchaseDataList?.map((row) => ({
            poNumber: row.poNumber ? row.poNumber : '-----',
            // orderedBy: row.orderedBy ? row.vendorName : "-----",
            status: row.poStatus ? row.poStatus : '-----',
            orderedOn: row.orderedOn ? row.orderedOn : '-----',
            grossAmount: row.grossAmount ? row.grossAmount : '-----',
            billStatus: row.billStatus ? row.billStatus : '-----',
            paymentStatus: row.billStatus ? row.billStatus : '-----',
          })),
        );

        setTableRows(dataRow[0] || []);

        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        setErrorTableData(true);
      });
  }, []);

  const handleNavigation = (rows) => {
    const poNum = rows.row.poNumber;
    navigate(`/purchase/purchase-orders/details/${poNum}`);
  };

  return (
    <SoftBox py={1}>
      {loader && <Spinner size={'1.3rem'} />}
      {!loader && (
        <>
          {datRows?.length > 0 ? (
            <Card className="vendorTablestyle">
              <Box style={{ height: 490, width: '100%' }}>
                <DataGrid
                  sx={{ ...dataGridStyles.header, borderRadius: '20px' }}
                  rows={datRows || []}
                  columns={columns}
                  pageSize={10}
                  getRowId={(row) => row.poNumber}
                  // checkboxSelection
                  disableSelectionOnClick
                  onCellClick={(rows) => handleNavigation(rows)}
                />
              </Box>
            </Card>
          ) : (
            <Card className="vendorCardShadow" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                <div>
                  <ShoppingBagIcon sx={{ color: '#0562fb', fontSize: '30px' }} />
                </div>
                <SoftTypography fontSize="14px" fontWeight="bold" variant="caption">
                  Sorry , no purchase orders or indents found for this vendor
                </SoftTypography>
                <SoftButton color="info" onClick={() => navigate('/purchase/express-grn')}>
                  + Add
                </SoftButton>
              </div>
            </Card>
          )}
        </>
      )}
    </SoftBox>
  );
};
