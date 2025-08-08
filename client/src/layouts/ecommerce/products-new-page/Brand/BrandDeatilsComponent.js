import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftTypography from '../../../../components/SoftTypography';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { dataGridStyles } from '../../Common/NewDataGridStyle';
import {
  activateBrand,
  activateManufacturer,
  activateSubBrand,
  copyPalletManufacturers,
  getAllBrands,
  getAllManufacturerV2,
  getAllSubBrands,
  getAllSubBrandsV2,
} from '../../../../config/Services';
import SoftButton from '../../../../components/SoftButton';
import { useNavigate } from 'react-router-dom';
import { dateFormatter } from '../../Common/CommonFunction';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import Spinner from '../../../../components/Spinner';
import SoftInput from '../../../../components/SoftInput';
import { debounce } from 'lodash';
import SoftBox from '../../../../components/SoftBox';
import Status from '../../Common/Status';
import SoftSelect from '../../../../components/SoftSelect';
import SoftAsyncPaginate from '../../../../components/SoftSelect/SoftAsyncPaginate';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import SoftButtonRoot from '../../../../components/SoftButton/SoftButtonRoot';

const BrandDeatilsComponent = () => {
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [rows, setRows] = useState([]);
  const [manufacturerOptions, setManufactureOptions] = useState([]);
  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);
  const markUpOpen = Boolean(anchorMarkupEl);
  const [clickedBrandRow, setClickedBrandRow] = useState('');
  const [clickedSubBrandRow, setClickedSubBrandRow] = useState('');
  const [clickedManufactureRow, setClickedManufactureRow] = useState('');
  const [loader, setLoader] = useState(false);
  const showSnackBar = useSnackbar();
  const [searchText, setSearchText] = useState('');

  const [selectedTab, setSelectedTab] = useState('Brand');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState();
  const [subBrandtotalCount, setSubBrandTotalCount] = useState(0);

  const [page1, setPage1] = useState(0);
  const [totalCount1, setTotalCount1] = useState();
  const [selectedValue, setSelectedValue] = useState('brand');
  const [selectedBrandId, setSelectedBrandId] = useState();
  const [subBrandRows, setSubBrandRows] = useState([]);
  const [subBrandPage, setSubBrandPage] = useState(0);

  const handleTypeChange = (event) => {
    setSelectedValue(event.target.value);
    if ((event.target.value = 'subBrand')) {
      handleFetchSubBrandData();
    }
  };

  const handleFetchSubBrandData = () => {
    const subBrandPayload = {
      sourceLocationId: [locId],
      brandId: selectedBrandId?.value ? [selectedBrandId?.value] : [],
      page: subBrandPage + 1,
      pageSize: 10,
      // active: [true],
      // subBrandName: [searchQuery] || [], // Search query if present
      sortByCreatedDate: 'DESC',
      sourceId: [orgId],
      sourceLocationId: [locId],
    };
    getAllSubBrandsV2(subBrandPayload)
      .then((res) => {
        setSubBrandTotalCount(res?.data?.data?.total_results || 0);
        const data = res?.data?.data?.subBrandResponse || [];
        const rows = data?.map((row) => {
          const createdOn = new Date(row?.created);
          const updatedOn = new Date(row?.updated);

          const formattedCreatedDate = `${createdOn.getDate()} ${
            months[createdOn.getMonth()]
          } ${createdOn.getFullYear()}`;
          const formattedUpdatedDate = `${updatedOn.getDate()} ${
            months[updatedOn.getMonth()]
          } ${updatedOn.getFullYear()}`;

          return {
            subBrandId: row?.subBrandId,
            subBrandName: row?.subBrandName,
            brandId: row?.brandName,
            createdByName: row?.createdByName,
            created: formattedCreatedDate,
            updated: formattedUpdatedDate,
            status: row?.status,
            active: row?.active,
          };
        });
        setSubBrandRows(rows || []);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    handleFetchSubBrandData();
  }, [selectedBrandId, subBrandPage]);

  const columns = [
    {
      field: 'brandId',
      headerName: 'Brand ID',
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'brandName',
      headerName: 'Brand Name',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'createdByName',
      headerName: 'Created By',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'created',
      headerName: 'Created Date',
      minWidth: 170,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'updated',
      headerName: 'Updated Date',
      minWidth: 170,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
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
          setClickedBrandRow(params.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleActivation = (id) => {
          activateBrand(id)
            .then((res) => {
              if (res?.data?.data?.message === 'Success') {
                showSnackbar('Brand status update successful', 'success');
                fetchBrandData(page + 1);
              }
              handleCloseOp();
            })
            .catch(() => {
              showSnackbar('Error while updating brand status', 'error');
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
                  <div onClick={() => navigate(`/products/brand/edit?brandId=${clickedBrandRow.brandId}`)}>
                    <EditIcon style={{ marginRight: '8px' }} />
                    Edit
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
                  <div onClick={() => handleActivation(clickedBrandRow.brandId, 'ACTIVE')}>
                    <ToggleOnIcon style={{ marginRight: '8px' }} />
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
                  <div onClick={() => handleActivation(clickedBrandRow.brandId, 'INACTIVE')}>
                    <ToggleOffIcon style={{ marginRight: '8px' }} />
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

  const subBrandColumn = [
    {
      field: 'subBrandId',
      headerName: 'Sub Brand ID',
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'subBrandName',
      headerName: 'Sub Brand Name',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'brandId', // For now, we only have the brandId, consider mapping this if you have a brandName field later.
      headerName: 'Brand Name',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'createdByName',
      headerName: 'Created By',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'created',
      headerName: 'Created Date',
      minWidth: 170,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'updated',
      headerName: 'Updated Date',
      minWidth: 170,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
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
        const displayStatus = cellValues.row.status || (cellValues.row.active ? 'ACTIVE' : 'INACTIVE');
        return <div>{displayStatus !== '' && <Status label={displayStatus} />}</div>;
      },
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
          setClickedSubBrandRow(params.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleActivation = (id) => {
          activateSubBrand(id)
            .then((res) => {
              if (res?.data?.data?.message === 'Success') {
                showSnackbar('Sub brand status update successful', 'success');
                handleFetchSubBrandData();
              }
              handleCloseOp();
            })
            .catch(() => {
              showSnackbar('Error while updating sub brand status', 'error');
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
                    onClick={() =>
                      navigate(
                        `/products/sub-brand/edit?brandId=${clickedSubBrandRow?.brandId}&subBrandId=${clickedSubBrandRow?.subBrandId}`,
                      )
                    }
                  >
                    <EditIcon style={{ marginRight: '8px' }} />
                    Edit
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
                  <div onClick={() => handleActivation(clickedSubBrandRow?.subBrandId, 'ACTIVE')}>
                    <ToggleOnIcon style={{ marginRight: '8px' }} />
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
                  <div onClick={() => handleActivation(clickedSubBrandRow?.subBrandId, 'INACTIVE')}>
                    <ToggleOffIcon style={{ marginRight: '8px' }} />
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
  const ManufacturerColumns = [
    {
      field: 'manufacturerId',
      headerName: 'Manufacturer ID',
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'manufacturerName',
      headerName: 'Manufacturer Name',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'createdByName',
      headerName: 'Created By',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'created',
      headerName: 'Created Date',
      minWidth: 170,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
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
          setClickedManufactureRow(params.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleActivation = (id) => {
          activateManufacturer(id)
            .then((res) => {
              if (res?.data?.data?.message === 'Success') {
                showSnackbar('Manufacturer status update successful', 'success');
                fetchManufacturerData(page1 + 1);
              }
              handleCloseOp();
            })
            .catch(() => {
              showSnackbar('Error while updating manufacturer status', 'error');
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
                    onClick={() =>
                      navigate(`/products/manufacture/edit?manufactureId=${clickedManufactureRow.manufacturerId}`)
                    }
                  >
                    <EditIcon style={{ marginRight: '8px' }} />
                    Edit
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
                  <div onClick={() => handleActivation(clickedManufactureRow.manufacturerId, 'ACTIVE')}>
                    <ToggleOnIcon style={{ marginRight: '8px' }} />
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
                  <div onClick={() => handleActivation(clickedManufactureRow.manufacturerId, 'INACTIVE')}>
                    <ToggleOffIcon style={{ marginRight: '8px' }} />
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
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const fetchBrandData = (page, searchText) => {
    setLoader(true);
    const payload = {
      page: page,
      pageSize: 10,
      sourceId: [orgId],
      sortByCreatedDate: 'DESCENDING',
      sourceLocationId: [locId],
    };
    if (searchText) {
      payload.brandName = [searchText];
    }
    getAllBrands(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setLoader(false);
          showSnackBar(res?.data?.message, 'error');
        }
        setLoader(false);
        const results = res?.data?.data?.results || [];
        setTotalCount(res?.data?.data?.totalResults);
        const formattedRows = results.map((result, index) => {
          const createdOn = new Date(result?.created);
          const updatedOn = new Date(result?.updated);

          const formattedCreatedDate = `${createdOn.getDate()} ${
            months[createdOn.getMonth()]
          } ${createdOn.getFullYear()}`;
          const formattedUpdatedDate = `${updatedOn.getDate()} ${
            months[updatedOn.getMonth()]
          } ${updatedOn.getFullYear()}`;

          return {
            id: index + 1,
            brandId: result?.brandId,
            brandName: result?.brandName,
            createdByName: result?.createdByName,
            created: formattedCreatedDate,
            updated: formattedUpdatedDate,
            status: result?.active ? 'ACTIVE' : 'INACTIVE',
          };
        });
        setRows(formattedRows || []);
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const fetchManufacturerData = (page1, searchText) => {
    setLoader(true);
    const payload = {
      page: page1,
      pageSize: 10,
      sourceId: [orgId],
      sortByCreatedDate: 'DESCENDING',
      sourceLocationId: [locId],
    };
    if (searchText) {
      payload.manufacturerName = [searchText];
    }
    getAllManufacturerV2(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setLoader(false);
          showSnackBar(res?.data?.message, 'error');
        }
        setLoader(false);
        const response = res?.data?.data?.results;
        setTotalCount1(res?.data?.data?.totalResults);
        if (response?.length > 0) {
          const data = response?.map((item) => ({
            manufacturerId: item?.manufacturerId,
            manufacturerName: item?.manufacturerName || '---',
            createdByName: item?.createdByName || '',
            created: dateFormatter(item?.created) || '---',
            status: item?.active ? 'ACTIVE' : 'INACTIVE',
          }));
          setManufactureOptions(data || []);
        }
      })
      .catch(() => {
        setLoader(false);
      });
  };

  const fetchDebouncedData = debounce((selectedTab, page, page1, searchText) => {
    if (selectedTab === 'Brand') {
      fetchBrandData(page + 1, searchText);
    } else {
      fetchManufacturerData(page1 + 1, searchText);
    }
  }, 500);

  useEffect(() => {
    fetchDebouncedData(selectedTab, page, page1, searchText);
    return () => {
      fetchDebouncedData.cancel();
    };
  }, [selectedTab, page, page1, searchText]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleSubBrandPageChange = (newPage) => {
    setSubBrandPage(newPage);
  };

  const handlePageChange1 = (newPage) => {
    setPage1(newPage);
  };

  const handleTabChange = (tabText) => {
    setSelectedTab(tabText);
    setSearchText('');
  };

  const handleNewNavigation = () => {
    if (selectedTab === 'Brand') {
      if (selectedValue === 'brand') {
        navigate('/products/brand/create');
      } else {
        navigate('/products/sub-brand/create');
      }
    } else if (selectedTab === 'Manufacturer') {
      navigate('/products/manufacture/create');
    }
  };

  const loadBrandOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 10, // Adjust as necessary
      sourceId: [orgId],
      sourceLocationId: [locId],
      brandName: [searchQuery] || [], // If searchQuery exists, use it
      active: [true],
    };

    try {
      const res = await getAllBrands(payload);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message, 'error');
        return {
          options: [],
          hasMore: false,
        };
      } else {
        const data = res?.data?.data?.results || [];
        const options = data?.map((item) => ({
          label: item?.brandName,
          value: item?.brandId,
        }));
        return {
          options,
          hasMore: data?.length >= 10, // Check if there's more data to load
          additional: {
            page: page + 1, // Increment the page for the next fetch
          },
        };
      }
    } catch (error) {
      showSnackbar('Error while fetching brands', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const [copyLoader, setCopyLoader] = useState(false);

  const handleCopyCategories = () => {
    setCopyLoader(true);
    const payload = [
      {
        sourceId: orgId,
        sourceLocationId: locId,
        sourceType: 'RETAIL',
      },
    ];
    copyPalletManufacturers(payload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          setCopyLoader(false);
          showSnackbar('Error while copying manufacturers data', 'error');
        } else if (res?.data?.data?.es === 0) {
          setCopyLoader(false);
          showSnackbar('Manufacturers copied successfully. Please refresh the page.', 'success');
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000);
        }
      })
      .catch((err) => {
        setCopyLoader(false);
        showSnackbar('Error while copying manufacturers data', 'error');
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="products-new-department-main-navbar">
            <div className="products-new-deparment-left-bar">
              <div
                onClick={() => handleTabChange('Brand')}
                className={
                  selectedTab === 'Brand'
                    ? 'products-new-deparment-single-nav-selected'
                    : 'products-new-deparment-single-nav'
                }
              >
                <Typography className="products-new-deparment-single-nav-typo">Brand</Typography>
              </div>
              <div
                onClick={() => handleTabChange('Manufacturer')}
                className={
                  selectedTab === 'Manufacturer'
                    ? 'products-new-deparment-single-nav-selected'
                    : 'products-new-deparment-single-nav'
                }
              >
                <Typography className="products-new-deparment-single-nav-typo">Manufacturer</Typography>
              </div>
            </div>
          </div>
        </div>
        {selectedTab === 'Brand' ? (
          <div style={{ paddingInline: '10px' }}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="brand"
                name="row-radio-buttons-group"
                value={selectedValue}
                onChange={handleTypeChange}
              >
                <FormControlLabel value="brand" control={<Radio />} label="Brand" />
                <FormControlLabel value="subBrand" control={<Radio />} label="Sub Brand" />
              </RadioGroup>
            </FormControl>
          </div>
        ) : (
          <br />
        )}

        <div className="search-bar-filter-and-table-container">
          <div className="search-bar-filter-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ maxWidth: '350px', margin: '5px' }}>
              {selectedValue === 'brand' ? (
                <SoftInput
                  size="small"
                  icon={{
                    component: 'search',
                    direction: 'left',
                  }}
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              ) : (
                <div style={{ backgroundColor: 'white !important', borderRadius: '8px' }}>
                  {/* <SoftSelect size="small" options={[]} placeholder="Search Brand name..."></SoftSelect> */}
                  <SoftAsyncPaginate
                    className="select-box-category select-box-radius"
                    placeholder="Select brand..."
                    value={selectedBrandId}
                    loadOptions={loadBrandOptions} // Using the new async brand fetcher
                    additional={{
                      page: 1,
                    }}
                    isClearable
                    size="small"
                    onChange={(e) => {
                      setSelectedBrandId(e);
                    }}
                    menuPortalTarget={document.body}
                  />
                </div>
              )}
            </div>
            <SoftButton size="small" onClick={handleNewNavigation}>
              + New
            </SoftButton>
          </div>

          {selectedTab === 'Brand' ? (
            <Box style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
              {loader ? (
                <Spinner size={'1.5rem'} />
              ) : (
                <>
                  {selectedValue === 'brand' ? (
                    <DataGrid
                      rows={rows || []}
                      columns={columns}
                      pageSize={10}
                      pagination
                      paginationMode="server"
                      page={page}
                      rowCount={totalCount}
                      onPageChange={handlePageChange}
                      disableSelectionOnClick
                      getRowId={(row) => row.id}
                      className="data-grid-table-boxo"
                      // onRowClick={(params) => navigate(`/products/brand/edit?brandId=${params.row.brandId}`)}
                    />
                  ) : (
                    <>
                      <DataGrid
                        rows={subBrandRows || []}
                        columns={subBrandColumn || []}
                        pageSize={10}
                        pagination
                        paginationMode="server"
                        page={subBrandPage}
                        rowCount={subBrandtotalCount || 0}
                        onPageChange={handleSubBrandPageChange}
                        disableSelectionOnClick
                        getRowId={(row) => row.subBrandId}
                        className="data-grid-table-boxo"
                        // onRowClick={(params) => navigate(`/products/brand/edit?brandId=${params.row.brandId}`)}
                      />
                    </>
                  )}
                </>
              )}
            </Box>
          ) : (
            <Box style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
              {loader && <Spinner size={'1.5rem'} />}
              {!loader &&
                (manufacturerOptions?.length === 0 ? ( // Corrected condition to check if there are no categories
                  <div style={{ textAlign: 'center', padding: '60px' }}>
                    <Typography variant="h6">It seems like there are no manufacturers present.</Typography>
                    <Typography variant="body1" style={{ margin: '10px 0' }}>
                      Would you like to copy pallet manufacturers?
                    </Typography>
                    <SoftButton
                      color="info"
                      className="vendor-add-btn"
                      onClick={handleCopyCategories}
                      disabled={copyLoader}
                    >
                      {copyLoader ? (
                        <CircularProgress
                          size={18}
                          sx={{
                            color: '#fff',
                          }}
                        />
                      ) : (
                        'Copy'
                      )}
                    </SoftButton>
                    {copyLoader && (
                      <Typography variant="body2" style={{ marginTop: '10px', color: 'green' }}>
                        It will take some time to copy the manufacturers data. Please refresh after some time.
                      </Typography>
                    )}
                  </div>
                ) : (
                  <DataGrid
                    rows={manufacturerOptions || []}
                    columns={ManufacturerColumns}
                    pageSize={10}
                    pagination
                    page={page1}
                    paginationMode="server"
                    rowCount={totalCount1}
                    onPageChange={handlePageChange1}
                    disableSelectionOnClick
                    getRowId={(row) => row.manufacturerId}
                    className="data-grid-table-boxo"
                  />
                ))}
            </Box>
          )}
        </div>
        <br />
      </div>
    </DashboardLayout>
  );
};

export default BrandDeatilsComponent;
