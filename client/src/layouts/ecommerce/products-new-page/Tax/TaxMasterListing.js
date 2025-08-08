import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Button, CircularProgress, Menu, MenuItem, Typography } from '@mui/material';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import Spinner from '../../../../components/Spinner';
import {
  deleteTaxMapping,
  deleteTaxMaster,
  deleteTaxSlab,
  editTaxMapping,
  editTaxMaster,
  editTaxSlab,
  filterTaxMapping,
  filterTaxMaster,
  filterTaxSlabs,
  getAllLevel2Category,
} from '../../../../config/Services';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { dataGridStyles } from '../../Common/NewDataGridStyle';
import Status from '../../Common/Status';

import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

const TaxMasterListing = ({
  showCreateTaxMaster,
  setShowCreateTaxMaster,
  isTaxMasterEditing,
  setIsTaxMasterEditing,
  setShowCreateTaxSlabs,
}) => {
  const [loader, setLoader] = useState(false);
  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);
  const [allRows, setAllRows] = useState([]);
  const markUpOpen = Boolean(anchorMarkupEl);
  const [selectedTab, setSelectedTab] = useState('Tax-master');
  const navigate = useNavigate();
  const [selectedTaxMasterRow, setSelectedTaxMasterRow] = useState('');
  const [taxSlabRows, setTaxSlabRows] = useState([]);
  const [taxMappingRows, setTaxMappingRows] = useState([]);
  const [selectedTaxSlabRow, setSelectedTaxSlabRow] = useState('');
  const [selectedTaxMappingRow, setSelectedTaxMappingRow] = useState('');
  const showSnackBar = useSnackbar();

  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState();

  const [page1, setPage1] = useState(0);
  const [totalCount1, setTotalCount1] = useState();

  const [page2, setPage2] = useState(0);
  const [totalCount2, setTotalCount2] = useState();

  const columns = [
    {
      field: 'id',
      headerName: 'Tax-Master Id',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'sales',
      headerName: 'Sales Components',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'exportSales',
      headerName: 'Export Sales Components',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'purchase',
      headerName: 'Purchase Components',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'import',
      headerName: 'Import Purchase Components',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 70,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    // {
    //   field: 'createTaxSlab',
    //   headerName: 'Create Tax Slab',
    //   minWidth: 80,
    //   flex: 1,
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'center',
    //   cellClassName: 'datagrid-rows',
    //   align: 'center',
    //   renderCell: (params) => {
    //     setSelectedTaxMasterRow(params.row);
    //     const handleCreateTaxSlab = (id) => {
    //       navigate(`/products/tax-slab/create?taxMasterId=${id}`);
    //     };

    //     return (
    //       <Typography className="button-typo" onClick={() => handleCreateTaxSlab(params?.row?.id)}>
    //         <AddIcon style={{ marginRight: '5px' }} />
    //         Create
    //       </Typography>
    //     );
    //   },
    // },
    {
      field: 'actions',
      headerName: '',
      minWidth: 40,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        // Create a unique anchor for each row
        const [anchorEl, setAnchorEl] = React.useState(null);
        const open = Boolean(anchorEl);

        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
        };

        const handleCloseOp = () => {
          setAnchorEl(null);
        };

        const handleDeleteTaxMaster = (taxId) => {
          deleteTaxMaster(taxId)
            .then((res) => {
              setAnchorEl(null);
              showSnackBar(`Tax master with id ${taxId} deleted successfully`, 'success');
              getAllTaxMaster();
            })
            .catch((err) => {
              setAnchorEl(null);
              showSnackBar('Error while deleting tax master', 'error');
            });
        };

        const handleActivation = (id, status) => {
          const payload = {
            taxMasterId: id,
            active: status === 'ACTIVE' ? true : false,
            updatedBy: user_name,
            updatedByName: uidx,
          };
          editTaxMaster(payload)
            .then((res) => {
              if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
                showSnackBar('Tax Master Updated', 'success');
              } else {
                showSnackBar('some Error occured', 'error');
              }
              getAllTaxMaster(page + 1);
              handleCloseOp();
            })
            .catch(() => {
              showSnackBar('Error while updating tax category master', 'error');
            });
        };

        return (
          <div>
            <Button
              id={`button-${params.row.id}`}
              aria-controls={open ? `menu-${params.row.id}` : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon fontSize="14px" />
            </Button>
            <Menu
              id={`menu-${params.row.id}`}
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseOp}
              MenuListProps={{
                'aria-labelledby': `button-${params.row.id}`,
              }}
            >
              <MenuItem>
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onClick={() => {
                    navigate(`/products/tax-master/edit?taxId=${params.row.id}`);
                  }}
                >
                  <EditIcon style={{ marginRight: '10px' }} />
                  Edit
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  style={{
                    color: 'red',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onClick={() => handleDeleteTaxMaster(params.row.id)} // Pass the correct id directly here
                >
                  <DeleteIcon style={{ marginRight: '10px' }} /> Delete
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div onClick={() => handleActivation(params.row.id, 'ACTIVE')}>
                    <ToggleOnIcon style={{ marginRight: '10px' }} />
                    Activate
                  </div>
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div onClick={() => handleActivation(params.row.id, 'DEACTIVE')}>
                    <ToggleOffIcon style={{ marginRight: '10px' }} />
                    Deactivate
                  </div>
                </div>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  const TaxSlabColumns = [
    {
      field: 'id',
      headerName: 'Slab Id',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'taxCode',
      headerName: 'HSN Code',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 70,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'subType',
      headerName: 'Sub Type',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'createdDate',
      headerName: 'Created Date',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    // {
    //   field: 'createTaxMapping',
    //   headerName: 'Create Tax Mapping',
    //   minWidth: 80,
    //   flex: 1,
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'center',
    //   cellClassName: 'datagrid-rows',
    //   align: 'center',
    //   renderCell: (params) => {
    //     setSelectedTaxMasterRow(params.row);
    //     const handleCreateTaxSlab = (id) => {
    //       navigate(`/products/tax-mapping/create?taxSlabId=${id}`);
    //     };

    //     return (
    //       <Typography className="button-typo" onClick={() => handleCreateTaxSlab(params?.row?.id)}>
    //         <AddIcon style={{ marginRight: '5px' }} />
    //         Create
    //       </Typography>
    //     );
    //   },
    // },
    {
      field: 'actions',
      headerName: '',
      minWidth: 40,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        const handleClick = (event) => {
          setAnchorMarkupEl(event.currentTarget);
          setSelectedTaxSlabRow(params.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleDeleteTaxSlab = (slabId) => {
          deleteTaxSlab(slabId)
            .then((res) => {
              if (res?.data?.status === 'ERROR') {
                showSnackBar(res?.data?.message, 'error');
                setAnchorMarkupEl(null);
              }
              getAllTaxSlabs();
              setAnchorMarkupEl(null);
              showSnackBar(`Tax slab for id ${slabId} deleted successfully`, 'success');
            })
            .catch((err) => {
              setAnchorMarkupEl(null);
              showSnackBar('Error while deleting tax slab', 'error');
            });
        };

        const handleActivation = (row, status) => {
          const payload = [
            {
              slabId: row?.id,
              active: status === 'ACTIVE' ? true : false,
              updatedBy: user_name,
              updatedByName: uidx,
              taxMasterId: row?.taxMasterId,
              taxCode: row?.taxCode,
              metadata: row?.metaData,
            },
          ];

          editTaxSlab(payload)
            .then((res) => {
              if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
                showSnackBar('Tax slab Updated', 'success');
              } else {
                showSnackBar('some Error occured', 'error');
              }
              getAllTaxSlabs(page1 + 1);
              handleCloseOp();
            })
            .catch(() => {
              showSnackBar('Error while updating tax slab mapping', 'error');
            });
        };

        return (
          <div>
            <Button
              id="basic-button"
              aria-controls={markUpOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={markUpOpen ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon fontSize="14px" />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorMarkupEl}
              open={markUpOpen}
              onClose={handleCloseOp}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {/* <MenuItem>
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div
                    onClick={() => {
                      navigate(`/products/tax-mapping/create/${selectedTaxSlabRow.id}`);
                    }}
                  >
                    <AddIcon style={{ marginRight: '10px' }} />
                    Create Category Mapping
                  </div>
                </div>
              </MenuItem> */}
              <MenuItem>
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div
                    onClick={() => {
                      navigate(`/products/tax-slab/edit?slabId=${selectedTaxSlabRow.id}`);
                    }}
                  >
                    <EditIcon style={{ marginRight: '10px' }} />
                    Edit
                  </div>
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  style={{
                    color: 'red',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onClick={() => handleDeleteTaxSlab(selectedTaxSlabRow.id)}
                >
                  <DeleteIcon style={{ marginRight: '10px' }} /> Delete
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div onClick={() => handleActivation(selectedTaxSlabRow, 'ACTIVE')}>
                    <ToggleOnIcon style={{ marginRight: '10px' }} />
                    Activate
                  </div>
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div onClick={() => handleActivation(selectedTaxSlabRow, 'DEACTIVE')}>
                    <ToggleOffIcon style={{ marginRight: '10px' }} />
                    Deactivate
                  </div>
                </div>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  const TaxMappingColumns = [
    {
      field: 'id',
      headerName: 'Tax-Mapping Id',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'level3',
      headerName: 'Level 3',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 70,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },

    {
      field: 'createdDate',
      headerName: 'Created Date',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'actions',
      headerName: '',
      minWidth: 40,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        const handleClick = (event) => {
          setAnchorMarkupEl(event.currentTarget);
          setSelectedTaxMappingRow(params.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleDeleteTaxMapping = (mappingId) => {
          deleteTaxMapping(mappingId)
            .then((res) => {
              if (res?.data?.status === 'ERROR') {
                showSnackBar(res?.data?.message, 'error');
                setAnchorMarkupEl(null);
              }
              getAllTaxMapping();
              setAnchorMarkupEl(null);
              showSnackBar(`Tax Mapping for id ${mappingId} deleted successfully`, 'success');
            })
            .catch((err) => {
              setAnchorMarkupEl(null);
              showSnackBar('Error while deleting tax mapping', 'error');
            });
        };

        const handleActivation = (row, status) => {
          const payload = [
            {
              taxMappingId: row?.id,
              active: status === 'ACTIVE' ? true : false,
              updatedBy: user_name,
              updatedByName: uidx,
              level3Id: row?.level3Id,
            },
          ];
          editTaxMapping(payload)
            .then((res) => {
              if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
                showSnackBar('Tax Mapping Updated', 'success');
              } else {
                showSnackBar('some Error occured', 'error');
              }
              getAllTaxMapping(page2 + 1);
              handleCloseOp();
            })
            .catch(() => {
              showSnackBar('Error while updating tax category mapping', 'error');
            });
        };

        return (
          <div>
            <Button
              id="basic-button"
              aria-controls={markUpOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={markUpOpen ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon fontSize="14px" />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorMarkupEl}
              open={markUpOpen}
              onClose={handleCloseOp}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {/* <MenuItem>
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div
                    onClick={() => {
                      navigate(`/products/tax-mapping/edit?mapId=${selectedTaxMappingRow.id}`);
                    }}
                  >
                    <EditIcon style={{ marginRight: '10px' }} />
                    Edit
                  </div>
                </div>
              </MenuItem> */}
              <MenuItem>
                <div
                  style={{
                    color: 'red',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onClick={() => handleDeleteTaxMapping(selectedTaxMappingRow.id)}
                >
                  <DeleteIcon style={{ marginRight: '10px' }} /> Delete
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div onClick={() => handleActivation(selectedTaxMappingRow, 'ACTIVE')}>
                    <ToggleOnIcon style={{ marginRight: '10px' }} />
                    Activate
                  </div>
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div onClick={() => handleActivation(selectedTaxMappingRow, 'DEACTIVE')}>
                    <ToggleOffIcon style={{ marginRight: '10px' }} />
                    Deactivate
                  </div>
                </div>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getAllTaxMaster = (page) => {
    setLoader(true);
    const payload = {
      page: page,
      pageSize: 10,
      sourceLocationId: [locId],
      sourceId: [orgId],
      sortByCreatedDate: 'DESCENDING',
    };

    filterTaxMaster(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackBar(res?.data?.message, 'error');
          setLoader(false);
        } else {
          const results = res?.data?.data?.results;
          setTotalCount(res?.data?.data?.totalResults);
          setLoader(false);
          const updated = results.map((item) => {
            const createdOn = new Date(item?.created);
            const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;
            return {
              id: item?.taxMasterId,
              sales: item?.domesticSalesTaxComponents,
              exportSales: item?.exportSalesTaxComponents,
              purchase: item?.domesticPurchaseTaxComponents,
              import: item?.exportPurchaseTaxComponents,
              createdDate: formattedDate,
              status: item?.active ? 'ACTIVE' : 'INACTIVE',
            };
          });
          setAllRows(updated);
        }
      })
      .catch((err) => {
        setLoader(false);
        showSnackBar('Error fetching tax master data', 'error');
      });
  };

  const getAllTaxSlabs = (page1) => {
    setLoader(true);
    const payload = {
      page: page1,
      pageSize: 10,
      sourceLocationId: [locId],
      sourceId: [orgId],
      sortByCreatedDate: 'DESCENDING',
    };
    filterTaxSlabs(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setLoader(false);
          showSnackBar(res?.data?.message, 'error');
        } else {
          const results = res?.data?.data?.results;
          setTotalCount1(res?.data?.data?.results?.totalResults);
          setLoader(false);
          const updated = results?.map((item) => {
            const createdOn = new Date(item?.created);
            const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;
            return {
              id: item?.slabId,
              taxCode: item?.taxCode,
              createdDate: formattedDate,
              status: item?.active ? 'ACTIVE' : 'INACTIVE',
              metaData: item?.metadata,
              taxMasterId: item?.taxMasterId,
              type: item?.type,
              subType: item?.subType,
            };
          });
          setTaxSlabRows(updated);
        }
      })
      .catch((err) => {
        setLoader(false);
        showSnackBar('Error fetching tax slab data', 'error');
      });
  };

  const fetchCategory3Name = async (categoryId) => {
    try {
      const payload = {
        level2Id: [categoryId],
      };
      const res = await getAllLevel2Category(payload);
      return res?.data?.data?.results[0]?.categoryName || '';
    } catch (err) {
      return '';
    }
  };

  const getAllTaxMapping = async (page2) => {
    setLoader(true);
    const payload = {
      page: page2,
      pageSize: 10,
      sourceLocationId: [locId],
      sourceId: [orgId],
      sortByCreatedDate: 'DESCENDING',
    };

    try {
      const res = await filterTaxMapping(payload);
      if (res?.data?.status === 'ERROR') {
        setLoader(false);
        showSnackBar(res?.data?.message, 'error');
        return; // Early return to avoid executing further code
      }

      const results = res?.data?.data?.results;
      setTotalCount2(res?.data?.data?.totalResults);
      setLoader(false);

      // Use Promise.all to await all fetchCategory3Name calls
      const updated = await Promise.all(
        results?.map(async (item) => {
          const createdOn = new Date(item?.created);
          const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;
          const categoryName = await fetchCategory3Name(item?.level3Id); // Await the fetchCategory3Name
          return {
            id: item?.taxMappingId,
            level3: categoryName, // Use the resolved category name
            createdDate: formattedDate,
            status: item?.active ? 'ACTIVE' : 'INACTIVE',
            slabId: item?.slabIds,
            level3Id: item?.level3Id,
          };
        }),
      );

      setTaxMappingRows(updated);
    } catch (err) {
      setLoader(false);
      showSnackBar('Error fetching tax mapping data', 'error');
    }
  };

  useEffect(() => {
    if (selectedTab === 'Tax-master') {
      getAllTaxMaster(page + 1);
    } else if (selectedTab === 'Tax-Slabs') {
      getAllTaxSlabs(page1 + 1);
    } else {
      getAllTaxMapping(page2 + 1);
    }
  }, [selectedTab, page, page1, page2]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageChange1 = (newPage) => {
    setPage1(newPage);
  };
  const handlePageChange2 = (newPage) => {
    setPage2(newPage);
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <div className="products-new-department-main-navbar">
          <SoftBox className="products-new-deparment-left-bar">
            <div
              onClick={() => setSelectedTab('Tax-master')}
              className={
                selectedTab === 'Tax-master'
                  ? 'products-new-deparment-single-nav-selected'
                  : 'products-new-deparment-single-nav'
              }
            >
              <Typography className="products-new-deparment-single-nav-typo">Tax Master</Typography>
            </div>

            <div
              onClick={() => setSelectedTab('Tax-Slabs')}
              className={
                selectedTab === 'Tax-Slabs'
                  ? 'products-new-deparment-single-nav-selected'
                  : 'products-new-deparment-single-nav'
              }
            >
              <Typography className="products-new-deparment-single-nav-typo">Tax-Slabs</Typography>
            </div>

            <div
              onClick={() => setSelectedTab('Tax-mapping')}
              className={
                selectedTab === 'Tax-mapping'
                  ? 'products-new-deparment-single-nav-selected'
                  : 'products-new-deparment-single-nav'
              }
            >
              <Typography className="products-new-deparment-single-nav-typo">Category Tax Mapping</Typography>
            </div>
          </SoftBox>
        </div>
        {selectedTab === 'Tax-master' && (
          <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
            <SoftBox className="search-bar-filter-container">
              <SoftBox>
                <Box className="all-products-filter-product" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SoftButton variant="solidWhiteBackground" onClick={() => navigate('/products/tax-master/create')}>
                    + New
                  </SoftButton>
                </Box>
              </SoftBox>
            </SoftBox>
            <SoftBox>
              <Box sx={{ height: 525, width: '100%' }}>
                {loader && <Spinner />}
                {!loader && (
                  <DataGrid
                    rows={allRows}
                    columns={columns}
                    pagination
                    pageSize={10}
                    paginationMode="server"
                    rowCount={totalCount}
                    page={page}
                    onPageChange={handlePageChange}
                    getRowId={(row) => row.id}
                  />
                )}
              </Box>
            </SoftBox>
          </SoftBox>
        )}

        {selectedTab === 'Tax-Slabs' && (
          <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
            <SoftBox className="search-bar-filter-container">
              <SoftBox>
                <Box className="all-products-filter-product" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SoftButton variant="solidWhiteBackground" onClick={() => navigate('/products/tax-slab/create')}>
                    + New
                  </SoftButton>
                </Box>
              </SoftBox>
            </SoftBox>
            <Box sx={{ height: 525, width: '100%' }}>
              {loader && <Spinner />}
              {!loader && (
                <DataGrid
                  // sx={{
                  //   ...dataGridStyles.header,
                  //   borderRadius: '24px',
                  //   cursor: 'pointer',
                  //   '& .MuiDataGrid-root': {
                  //     height: '100%',
                  //   },
                  // }}
                  rows={taxSlabRows}
                  columns={TaxSlabColumns}
                  pagination
                  pageSize={10}
                  rowCount={totalCount1}
                  paginationMode="server"
                  page={page1}
                  onPageChange={handlePageChange1}
                  getRowId={(row) => row.id}
                />
              )}
            </Box>
          </SoftBox>
        )}

        {selectedTab === 'Tax-mapping' && (
          <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
            <SoftBox className="search-bar-filter-container">
              <SoftBox>
                <Box className="all-products-filter-product" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SoftButton variant="solidWhiteBackground" onClick={() => navigate('/products/tax-mapping/create')}>
                    + New
                  </SoftButton>
                </Box>
              </SoftBox>
            </SoftBox>
            <Box sx={{ height: 525, width: '100%' }}>
              {loader && <Spinner />}
              {!loader && (
                <DataGrid
                  // sx={{
                  //   ...dataGridStyles.header,
                  //   borderRadius: '24px',
                  //   cursor: 'pointer',
                  //   '& .MuiDataGrid-root': {
                  //     height: '100%',
                  //   },
                  // }}
                  rows={taxMappingRows}
                  columns={TaxMappingColumns}
                  pagination
                  pageSize={10}
                  rowCount={totalCount2}
                  paginationMode="server"
                  page={page2}
                  onPageChange={handlePageChange2}
                  getRowId={(row) => row.id}
                />
              )}
            </Box>
          </SoftBox>
        )}
      </DashboardLayout>
    </div>
  );
};

export default TaxMasterListing;
