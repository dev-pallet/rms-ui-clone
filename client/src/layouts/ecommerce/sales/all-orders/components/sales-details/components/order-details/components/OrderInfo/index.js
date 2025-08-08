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
import Grid from '@mui/material/Grid';
// Soft UI Dashboard PRO React components
import './Orderinfo.css';
import { Box, Modal, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { buttonStyles } from '../../../../../../../../Common/buttonColor';
import { getAllSalesReturn, getProductDetails, returnSalesOrder } from '../../../../../../../../../../config/Services';
import { isSmallScreen, productIdByBarcode } from '../../../../../../../../Common/CommonFunction';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../../../../../../hooks/SnackbarProvider';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OrderInfoMobCard from './components/orderinfo-mobile-card';
import SoftAvatar from 'components/SoftAvatar';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../../../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../../../../../components/SoftTypography';
import Spinner from '../../../../../../../../../../components/Spinner';

const OrderInfo = (props) => {
  const itemList = props.orderItemList;
  const { orderId } = useParams();
  const navigate = useNavigate();
  const locId = localStorage.getItem('locId');
  const userName = localStorage.getItem('user_name');
  const showSnackbar = useSnackbar();
  const [dataArray, setDataArray] = useState([]);
  const [returOrderItemList, setReturnOrderItemList] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [imageFetchingDone, setImageFetchingDone] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemSelected, setItemSelected] = useState(null);
  const [saveLoader, setSaveLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const columns = [
    // props?.returnItem && {
    //   headerName: '',
    //   field: 'return',
    //   minWidth: 5,
    //   editable: false,
    //   cellClassName: 'datagrid-rows',
    //   headerClassName: 'datagrid-columns',
    //   align: 'center',
    //   headerAlign: 'center',
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <input
    //         type="radio"
    //         checked={selectedItem === params.row.id}
    //         onChange={(e) => handleProductSelected(params.row.id)}
    //       />
    //     );
    //   },
    // },
    {
      headerName: '',
      field: 'image',
      minWidth: 5,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => {
        const image = params?.row?.productImage || 'https://i.imgur.com/dL4ScuP.png';
        return <SoftAvatar ml={5} p={2} variant="rounded" size="xl" src={image} alt="" />;
      },
    },
    {
      headerName: 'item',
      field: 'productName',
      minWidth: 200,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: '',
      field: 'gtin',
      minWidth: 2,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => {
        const data = `${params?.row?.productName} (${params?.id})`;
        return (
          <Tooltip title={data || ''}>
            <InfoOutlinedIcon
              color="info"
              sx={{
                marginRight: '5px',
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      headerName: 'MRP',
      field: 'mrp',
      minWidth: 10,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Selling Price',
      field: 'sellingPrice',
      minWidth: 10,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      minWidth: 10,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Amount',
      field: 'subTotal',
      minWidth: 30,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
  ];

  const handleOpenModal = () => {
    if (itemSelected !== null) {
      setOpenModal(true);
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchImagesAndUpdateArray = async (data) => {
    const updatedArray = [];

    for (const item of data) {
      const { gtin } = item;
      try {
        const productDetails = await getProductDetails(gtin);
        let imageUrl = 'https://i.imgur.com/dL4ScuP.png';
        if (productDetails?.data?.data?.images?.front && productDetails?.data?.data?.images?.front !== 'string') {
          imageUrl = productDetails?.data?.data?.images.front;
        } else if (productDetails?.data?.data?.images?.top && productDetails?.data?.data?.images?.top !== 'string') {
          imageUrl = productDetails?.data?.data?.images.top;
        } else if (
          productDetails?.data?.data?.images?.bottom &&
          productDetails?.data?.data?.images?.bottom !== 'string'
        ) {
          imageUrl = productDetails?.data?.data?.images.bottom;
        } else if (productDetails?.data?.data?.images?.back && productDetails?.data?.data?.images?.back !== 'string') {
          imageUrl = productDetails?.data?.data?.images.back;
        } else if (
          productDetails?.data?.data?.images?.top_left &&
          productDetails?.data?.data?.images?.top_left !== 'string'
        ) {
          imageUrl = productDetails?.data?.data?.images.top_left;
        } else if (
          productDetails?.data?.data?.images?.right &&
          productDetails?.data?.data?.images?.right !== 'string'
        ) {
          imageUrl = productDetails?.data?.data?.images.right;
        } else if (productDetails?.data?.data?.images?.left && productDetails?.data?.data?.images?.left !== 'string') {
          imageUrl = productDetails?.data?.data?.images.left;
        } else if (
          productDetails?.data?.data?.images?.top_right &&
          productDetails?.data?.data?.images?.top_right !== 'string'
        ) {
          imageUrl = productDetails?.data?.data?.images?.top_right;
        }

        const updatedItem = { ...item, productImage: imageUrl };
        updatedArray.push(updatedItem);
      } catch (error) {
        updatedArray.push(item);
      }
    }

    setDataArray(updatedArray);
  };

  useEffect(() => {
    setDataArray(itemList);
    setDataLoaded(true);
  }, [itemList]);

  useEffect(() => {
    if (dataLoaded && dataArray.length > 0 && !imageFetchingDone) {
      fetchImagesAndUpdateArray(dataArray);
      setImageFetchingDone(true);
    }
  }, [dataArray, dataLoaded, imageFetchingDone]);

  const handleCancel = () => {
    props.handleCancelReturn();
  };
  const handleProductSelected = (item) => {
    setSelectedItem(item);
    setItemSelected(item);
  };

  useEffect(() => {
    allReturnList();
  }, []);

  const allReturnList = () => {
    const payload = {
      orderId: orderId,
      status: 'RETURNED',
      locationId: locId,
    };
    getAllSalesReturn(payload)
      .then((res) => {
        if (res?.data?.data?.es) {
          return;
        }
        setReturnOrderItemList(res?.data?.data?.orderItemList);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleSave = () => {
    const payload = {
      orderId: orderId,
      orderItemId: itemSelected.orderItemId,
      quantity: itemSelected.quantity,
      updatedBy: userName,
      status: 'string',
      locationId: locId,
    };
    returnSalesOrder(payload)
      .then((res) => {
        handleCloseModal();
        handleCancel();
        showSnackbar('Success', 'success');
        allReturnList();
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const isMobileDevice = isSmallScreen();

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} xl={12} p={1}>
        <SoftBox mb={1}>
          {props.returnItem ? (
            <SoftTypography variant="h6" fontWeight="bold">
              Select the item to return
            </SoftTypography>
          ) : (
            <SoftTypography variant="h6" fontWeight="bold">
              Item Details
            </SoftTypography>
          )}
        </SoftBox>

        {!isMobileDevice ? (
          <>
            <DataGrid
              columns={columns}
              rows={dataArray || []}
              autoHeight
              rowsPerPageOptions={[]}
              hideFooter
              getRowId={(row) => row.gtin}
              onCellDoubleClick={(rows) => handleProductNavigation(rows?.id)}
            />
            {/* <table>
              <thead>
                <tr className="table-tr">
                  {props.returnItem && <th className="th-text"></th>}
                  <th className="th-text">Item</th>
                  <th className="th-text">MRP</th>
                  <th className="th-text">Selling Price</th>
                  <th className="th-text">Quantity</th>
                  <th className="th-text">Amount</th>
                </tr>
              </thead>

              <tbody>
                {dataArray.map((item) => (
                  <tr key={item?.gtin}>
                    {props.returnItem && (
                      <td>
                        <input
                          type="radio"
                          checked={selectedItem === item}
                          onChange={(e) => handleProductSelected(item)}
                        />
                      </td>
                    )}
                    <td
                      className="td-text"
                      style={{ marginLeft: '10px', cursor:'pointer' }}
                    >
                      {' '}
                      <Tooltip title={item?.gtin}>
                        <InfoOutlinedIcon
                          color="info"
                          sx={{
                            marginRight: '5px',
                          }}
                        />
                      </Tooltip>
                      <SoftAvatar ml={5} p={2} variant="rounded" size="xl" src={item?.productImage} alt="" />
                      <SoftBox className="small-table-text-I"  onClick={() => navigate(`/products/all-products/details/${item?.gtin}`)}>{item?.productName}</SoftBox>
                    </td>
                    <td className="small-table-text">₹ {item?.mrp}</td>
                    <td className="small-table-text">₹ {item?.sellingPrice}</td>
                    <td className="small-table-text">{item?.quantity}</td>
                    <td className="small-table-text">₹{item?.subTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}
            <br />
            {props.returnItem && (
              <>
                <SoftBox display="flex" gap="20px">
                  <SoftButton
                    variant={buttonStyles.outlinedColor}
                    className="outlined-softbutton"
                    onClick={handleCancel}
                  >
                    Cancel
                  </SoftButton>
                  <SoftButton variant="solidBlueBackground" onClick={handleOpenModal}>
                    Return
                  </SoftButton>
                </SoftBox>
                <br />
              </>
            )}
          </>
        ) : (
          dataArray.map((item, index) => (
            <>
              <OrderInfoMobCard data={item} index={index} dataLength={dataArray.length} />
            </>
          ))
        )}
        {returOrderItemList.length > 0 ? (
          <>
            <SoftBox mb={1}>
              <SoftTypography variant="h6" fontWeight="bold">
                Return Item Details
              </SoftTypography>
            </SoftBox>
            <>
              <table>
                <thead>
                  <tr className="table-tr">
                    <th className="th-text">S.No.</th>
                    <th className="th-text">Item</th>
                    <th className="th-text">MRP</th>
                    <th className="th-text">Selling Price</th>
                    <th className="th-text">Quantity</th>
                    <th className="th-text">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {returOrderItemList.map((item, index) => (
                    <tr key={item?.gtin}>
                      <td className="small-table-text">{index + 1}</td>
                      <td className="td-text">
                        <SoftBox className="small-table-text-I">{item?.productName}</SoftBox>
                      </td>
                      <td className="small-table-text">₹ {item?.mrp}</td>
                      <td className="small-table-text">₹ {item?.sellingPrice}</td>
                      <td className="small-table-text">{item?.quantity}</td>
                      <td className="small-table-text">₹ {item?.subTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
            </>
          </>
        ) : null}

        {openModal && (
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu-1">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to return <b>{itemSelected.productName} </b> ?
              </SoftTypography>
              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton className="vendor-second-btn" onClick={handleCloseModal}>
                  Cancel
                </SoftButton>
                <SoftButton className="vendor-add-btn" onClick={handleSave} disabled={saveLoader ? true : false}>
                  {saveLoader ? <Spinner size={20} /> : <>Save</>}
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>
        )}
      </Grid>
    </Grid>
  );
};

export default OrderInfo;
