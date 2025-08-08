import './productionMapping.css';
import './productionMapping.css';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Modal from '@mui/material/Modal';
import React, { useState } from 'react';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';

const ProductionMapping = () => {
  const [dataRows, setTableRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const [openModalProductionMapping, setOpenModalProductionMapping] = useState(false);
  const [inputList, setInputList] = useState([{}]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleRemove = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };
  const handleRow = (a) => {
    setInputList([...inputList, { gtin: '', productName: '', quantity: '', unitWeight: '' }]);
  };

  const columns = [
    {
      field: 'freshGoodName',
      headerName: 'Fresh Good Name',
      minWidth: 150,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'gtin',
      headerName: 'GTIN',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 150,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'sku_id',
      headerName: 'SKU',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 150,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'unit_of_measurement',
      headerName: 'Unit of Measurement',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 150,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'unit_weight',
      headerName: 'Unit Weight',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 150,
      flex: 0.75,
      width: 200,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  const handleCloseModalProductionMapping = () => {
    setOpenModalProductionMapping(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box className="table-css-fix-box-scroll-vend">
        <Box className="new-btn">
          <SoftButton color="info" variant="gradient" onClick={() => setOpenModalProductionMapping(true)}>
            + New
          </SoftButton>
        </Box>
        <Box
          sx={{
            marginTop: '1rem',
          }}
        >
          <div style={{ height: '70vh', width: '100%' }}>
            {/* {!loader && !dataRows?.length ? (
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img
                    className="src-dummy-img"
                    src="https://2.bp.blogspot.com/-SXNnmaKWILg/XoNVoMTrxgI/AAAAAAAAxnM/7TFptA1OMC8uk67JsG5PcwO_8fAuQTzkQCLcBGAsYHQ/s1600/giphy.gif"
                  />
                </SoftBox>
                <h3 className="no-data-text-I">NO DATA FOUND</h3>
              </SoftBox>
            ) : (
              dataRows != null &&
              !loader && ( */}
            <SoftBox
              py={0}
              px={0}
              style={{ height: 525, width: '100%' }}
              className="dat-grid-table-box"
              sx={{
                '& .super-app.Approved': {
                  color: '#69e86d',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Reject': {
                  color: '#df5231',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Create': {
                  color: '#888dec',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Assign': {
                  color: 'purple',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
              }}
            >
              <DataGrid
                rows={dataRows}
                className="data-grid-table-boxo"
                rowsPerPageOptions={[10]}
                // getRowId={(row) => row.vendorId}
                rowHeight={45}
                // onCellClick={(rows) => navigateToDetailsPage(rows.row['vendorId'])}
                columns={columns}
              />
            </SoftBox>
            {/* )
            )} */}
          </div>
        </Box>
        <Modal
          open={openModalProductionMapping}
          onClose={handleCloseModalProductionMapping}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box
            sx={{
              width: '50vw',
              height: '80vh',
              backgroundColor: '#fff',
              margin: 'auto',
              marginTop: '6rem',
              borderRadius: '1rem',
              padding: '2rem',
              boxSizing: 'border-box',
              position: 'relative',
              overflowY: 'auto',
            }}
            className="modal-box-production-mapping"
          >
            <Box className="finished-product-name">
              <SoftTypography
                component="label"
                variant="h6"
                fontWeight="light"
                textTransform="capitalize"
                style={{ marginTop: '0.8rem' }}
              >
                Finished Product Name
              </SoftTypography>
              <SoftInput
                sx={{
                  marginTop: '0.5rem',
                }}
                type="text"
              />
            </Box>

            <Box className="gtin">
              <SoftTypography
                component="label"
                variant="h6"
                fontWeight="light"
                textTransform="capitalize"
                style={{ marginTop: '0.8rem' }}
              >
                GTIN
              </SoftTypography>
              <SoftInput
                sx={{
                  marginTop: '0.5rem',
                }}
                type="text"
              />
            </Box>

            <Box className="unit-measurement">
              <SoftTypography
                component="label"
                variant="h6"
                fontWeight="light"
                textTransform="capitalize"
                style={{ marginTop: '0.8rem' }}
              >
                Unit of measurement
              </SoftTypography>
              <SoftInput
                sx={{
                  marginTop: '0.5rem',
                }}
                type="text"
              />
            </Box>
            <Box className="unit-weight">
              <SoftTypography
                component="label"
                variant="h6"
                fontWeight="light"
                textTransform="capitalize"
                style={{ marginTop: '0.8rem' }}
              >
                Unit weight
              </SoftTypography>
              <SoftInput
                sx={{
                  marginTop: '0.5rem',
                }}
                type="text"
              />
            </Box>

            <Box className="category">
              <SoftTypography
                component="label"
                variant="h6"
                fontWeight="light"
                textTransform="capitalize"
                style={{ marginTop: '0.8rem' }}
              >
                Category
              </SoftTypography>
              <SoftInput
                sx={{
                  marginTop: '0.5rem',
                }}
                type="text"
              />
            </Box>

            <Box className="raw-material">
              <SoftTypography
                component="label"
                variant="h6"
                fontWeight="light"
                textTransform="capitalize"
                style={{ marginTop: '0.8rem' }}
              >
                Assign raw material
              </SoftTypography>
              <Box
                sx={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {inputList.map((item, index) => {
                  return (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <SoftInput
                        placeholder="GTIN"
                        type="text"
                        name="gtin"
                        sx={{
                          marginRight: '0.5rem',
                        }}
                      />
                      <SoftInput
                        placeholder="Product Name"
                        type="text"
                        sx={{
                          width: '70%',
                          marginRight: '0.5rem',
                        }}
                        name="productName"
                      />
                      <SoftInput
                        placeholder="Quantity"
                        type="number"
                        name="quantity"
                        sx={{
                          marginRight: '0.5rem',
                        }}
                      />
                      <SoftInput
                        placeholder="Unit"
                        type="text"
                        name="unitWeight"
                        sx={{
                          marginRight: '0.5rem',
                        }}
                      />
                      <HighlightOffIcon
                        sx={{
                          marginLeft: '0.3rem',
                          cursor: 'pointer',
                        }}
                        className="add-customer-add-more"
                        onClick={() => handleRemove(index)}
                      />
                    </Box>
                  );
                })}
              </Box>

              <Box className="add-more">
                <SoftBox className="add-more-box-div">
                  <SoftTypography className="adds" onClick={() => handleRow()}>
                    Add more
                  </SoftTypography>
                </SoftBox>
              </Box>

              <Box className="cancel-save">
                <SoftButton
                  sx={{
                    marginRight: '0.8rem',
                  }}
                  onClick={handleCloseModalProductionMapping}
                >
                  cancel
                </SoftButton>
                <SoftButton variant="gradient" color="info">
                  save
                </SoftButton>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </DashboardLayout>
  );
};

export default ProductionMapping;
