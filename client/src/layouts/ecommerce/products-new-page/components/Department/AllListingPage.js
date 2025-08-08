import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { Box, Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import Spinner from '../../../../../components/Spinner';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DataGrid } from '@mui/x-data-grid';
import {
  editDepartment,
  editHOCategory,
  editLevel1Category,
  editLevel2Category,
  editLineOfBusiness,
  editSubDepartment,
  filterLineOfBusiness,
  getAllLevel1Category,
  getAllLevel1CategoryAndMain,
  getAllLevel2Category,
  getAllLevel2CategoryAndMain,
  getAllMainCategory,
  getHoDepartment,
  getHOSubDepartment,
  getHOSubDepartmentByDep,
} from '../../../../../config/Services';
import SoftButton from '../../../../../components/SoftButton';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import SoftSelect from '../../../../../components/SoftSelect';
import { useNavigate } from 'react-router-dom';
import Status from '../../../Common/Status';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import SoftAsyncPaginate from '../../../../../components/SoftSelect/SoftAsyncPaginate';
import SoftInput from '../../../../../components/SoftInput';

const AllListingPage = () => {
  const [selectedTab, setSelectedTab] = useState('Department');
  const [selectedPart, setSelectedPart] = useState('Department');
  const [selectedPart1, setSelectedPart1] = useState('Category');

  const [loader, setLoader] = useState(false);
  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);

  const markUpOpen = Boolean(anchorMarkupEl);

  // department
  const [departmentPage, setDepartmentPage] = useState(0);
  const [departmentCount, setDepartmentCount] = useState();
  const [selectedDepartmentRow, setSelectedDepartmentRow] = useState();
  const [allDepartmentRows, setAllDepartmentRows] = useState([]);
  const [mainDepartmentOptions, setMainDepartmentOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departmentSearch, setDepartmentSearch] = useState('');

  // sub-department
  const [subDepartmentPage, setSubDepartmentPage] = useState(0);
  const [subDepartmentCount, setSubDepartmentCount] = useState();
  const [selectedSubDepartmentRow, setSelectedSubDepartmentRow] = useState();
  const [allSubDepartmentRows, setAllSubDepartmentRows] = useState([]);

  // Line of business
  const [lineOfBusinessPage, setLineOfBusinessPage] = useState(0);
  const [lineOfBusinessCount, setLineOfBusinessCount] = useState();
  const [selectedLineOfBusinessRow, setSelectedLineOfBusinessRow] = useState();
  const [allLineOfBusinessRows, setAllLineOfBusinessRows] = useState([]);

  // main category
  const [categoryPage, setCategoryPage] = useState(0);
  const [categoryCount, setCategoryCount] = useState();
  const [selectedCategoryRow, setSelectedCategoryRow] = useState();
  const [allCategoryRows, setAllCategoryRows] = useState([]);
  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // level 1 category
  const [level1Page, setLevel1Page] = useState(0);
  const [level1Count, setLevel1Count] = useState();
  const [selectedLevel1Row, setSelectedLevel1Row] = useState();
  const [allLevel1Rows, setAllLevel1Rows] = useState([]);
  const [level1Options, setLevel1Options] = useState([]);
  const [selectedLevel1Category, setSelectedLevel1Category] = useState('');

  // Line of business
  const [level2Page, setLevel2Page] = useState(0);
  const [level2Count, setLevel2Count] = useState();
  const [selectedLevel2Row, setSelectedLevel2Row] = useState();
  const [allLevel2Rows, setAllLevel2Rows] = useState([]);

  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleCatChange = (event) => {
    setSelectedPart(event.target.value);
  };

  const handleCatChange1 = (event) => {
    setSelectedPart1(event.target.value);
  };

  const handleDepartmentPageChange = (newPage) => {
    setDepartmentPage(newPage);
  };

  const handleSubDepartmentPageChange = (newPage) => {
    setSubDepartmentPage(newPage);
  };

  const handleLineOfBusinessPageChange = (newPage) => {
    setLineOfBusinessPage(newPage);
  };

  const handleCategoryPageChange = (newPage) => {
    setCategoryPage(newPage);
  };

  const handleLevel1PageChange = (newPage) => {
    setLevel1Page(newPage);
  };

  const handleLevel2PageChange = (newPage) => {
    setLevel2Page(newPage);
  };

  const departmentColumns = [
    {
      field: 'id',
      headerName: 'Department Id',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'name',
      headerName: 'Department Name',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'code',
      headerName: 'Department Code',
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
      field: 'updatedDate',
      headerName: 'Updated Date',
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
          setSelectedDepartmentRow(params.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleActivation = (id, status) => {
          const payload = {
            departmentId: id,
            sourceId: orgId,
            sourceLocationId: locId,
            active: status === 'ACTIVE' ? true : false,
          };
          editDepartment(payload)
            .then((res) => {
              if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
                showSnackbar('Department Updated', 'success');
              } else {
                showSnackbar('some Error occured', 'error');
              }
              getAllDepartment(departmentPage + 1);
              handleCloseOp();
            })
            .catch(() => {
              showSnackbar('Error while updating department', 'error');
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
                  <div onClick={() => navigate(`/products/department/create?depId=${selectedDepartmentRow.id}`)}>
                    <EditIcon style={{ marginRight: '10px' }} />
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
                  <div onClick={() => handleActivation(selectedDepartmentRow.id, 'ACTIVE')}>
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
                  <div onClick={() => handleActivation(selectedDepartmentRow.id, 'DEACTIVE')}>
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

  const subDepartmentColumns = [
    {
      field: 'id',
      headerName: 'Sub-Department Id',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'name',
      headerName: 'Sub-Department Name',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'code',
      headerName: 'Sub-Department Code',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'depName',
      headerName: 'Department Name',
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
      field: 'updatedDate',
      headerName: 'Updated Date',
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
          setSelectedSubDepartmentRow(params.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleActivation = (id, status) => {
          const payload = {
            subDepartmentId: id,
            sourceId: orgId,
            sourceLocationId: locId,
            active: status === 'ACTIVE' ? true : false,
          };
          editSubDepartment(payload)
            .then((res) => {
              if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
                showSnackbar('Sub department Updated', 'success');
              } else {
                showSnackbar('some Error occured', 'error');
              }
              getAllSubDepartments(selectedDepartment, subDepartmentPage + 1);
              handleCloseOp();
            })
            .catch(() => {
              showSnackbar('Error while updating sub department', 'error');
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
                    onClick={() => navigate(`/products/sub-department/create?subDepId=${selectedSubDepartmentRow.id}`)}
                  >
                    <EditIcon style={{ marginRight: '10px' }} />
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
                  <div onClick={() => handleActivation(selectedSubDepartmentRow.id, 'ACTIVE')}>
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
                  <div onClick={() => handleActivation(selectedSubDepartmentRow.id, 'DEACTIVE')}>
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

  const lineOfBusinessColumns = [
    {
      field: 'id',
      headerName: 'Line of business Id',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'name',
      headerName: 'Line of business Name',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'code',
      headerName: 'Line of Business Code',
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
      field: 'updatedDate',
      headerName: 'Updated Date',
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
          setSelectedLineOfBusinessRow(params.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleActivation = (id, status) => {
          const payload = {
            lineOfBusinessId: id,
            sourceId: orgId,
            sourceLocationId: locId,
            active: status === 'ACTIVE' ? true : false,
          };
          editLineOfBusiness(payload)
            .then((res) => {
              if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
                showSnackbar('LOB Updated', 'success');
              } else {
                showSnackbar('some Error occured', 'error');
              }
              getAllLineofBusiness(lineOfBusinessPage + 1);
              handleCloseOp();
            })
            .catch(() => {
              showSnackbar('Error while updating LOB', 'error');
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
                    onClick={() => navigate(`/products/line-of-business/create?lobId=${selectedLineOfBusinessRow.id}`)}
                  >
                    <EditIcon style={{ marginRight: '10px' }} />
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
                  <div onClick={() => handleActivation(selectedLineOfBusinessRow.id, 'ACTIVE')}>
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
                  <div onClick={() => handleActivation(selectedLineOfBusinessRow.id, 'DEACTIVE')}>
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

  const categoryColumns = [
    {
      field: 'id',
      headerName: 'Main Category Id',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'name',
      headerName: 'Main Category Name',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'code',
      headerName: 'Main Category Code',
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
      field: 'updatedDate',
      headerName: 'Updated Date',
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
          setSelectedCategoryRow(params.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleActivation = (id, status) => {
          const payload = {
            mainCategoryId: id,
            sourceId: orgId,
            sourceLocationId: locId,
            active: status === 'ACTIVE' ? true : false,
          };
          editHOCategory(payload)
            .then((res) => {
              if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
                showSnackbar('Main Category Updated', 'success');
              } else {
                showSnackbar('some Error occured', 'error');
              }
              getAllCategories(categoryPage + 1);
              handleCloseOp();
            })
            .catch(() => {
              showSnackbar('Error while updating main category', 'error');
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
                  <div onClick={() => navigate(`/products/category/create?catId=${selectedCategoryRow.id}`)}>
                    <EditIcon style={{ marginRight: '10px' }} />
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
                  <div onClick={() => handleActivation(selectedCategoryRow.id, 'ACTIVE')}>
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
                  <div onClick={() => handleActivation(selectedCategoryRow.id, 'DEACTIVE')}>
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

  const level1Columns = [
    {
      field: 'id',
      headerName: 'Class Id',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'name',
      headerName: 'Class Name',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'code',
      headerName: 'Class Code',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'catName',
      headerName: 'Main Category Name',
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
      field: 'updatedDate',
      headerName: 'Updated Date',
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
          setSelectedLevel1Row(params.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleActivation = (id, status) => {
          const payload = {
            level1Id: id,
            sourceId: orgId,
            sourceLocationId: locId,
            active: status === 'ACTIVE' ? true : false,
          };
          editLevel1Category(payload)
            .then((res) => {
              if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
                showSnackbar('Level 2 Category Updated', 'success');
              } else {
                showSnackbar('some Error occured', 'error');
              }
              getAllLevel1Data(selectedCategory, level1Page + 1);
              handleCloseOp();
            })
            .catch(() => {
              showSnackbar('Error while updating level 2 category', 'error');
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
                  <div onClick={() => navigate(`/products/class/create?classId=${selectedLevel1Row.id}`)}>
                    <EditIcon style={{ marginRight: '10px' }} />
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
                  <div onClick={() => handleActivation(selectedLevel1Row.id, 'ACTIVE')}>
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
                  <div onClick={() => handleActivation(selectedLevel1Row.id, 'DEACTIVE')}>
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

  const level2Columns = [
    {
      field: 'id',
      headerName: 'Sub-class Id',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'name',
      headerName: 'Sub-class Name',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'code',
      headerName: 'Sub-class Code',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'catName',
      headerName: 'Main Category Name',
      minWidth: 120,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'level1Name',
      headerName: 'Class Name',
      minWidth: 120,
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
      field: 'updatedDate',
      headerName: 'Updated Date',
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
          setSelectedLevel2Row(params.row);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleActivation = (id, status) => {
          const payload = {
            level2Id: id,
            sourceId: orgId,
            sourceLocationId: locId,
            active: status === 'ACTIVE' ? true : false,
          };
          editLevel2Category(payload)
            .then((res) => {
              if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
                showSnackbar('Level 3 Category Updated', 'success');
              } else {
                showSnackbar('some Error occured', 'error');
              }
              getAllLevel2Data(selectedLevel1Category, level2Page + 1);
              handleCloseOp();
            })
            .catch(() => {
              showSnackbar('Error while updating level 3 category', 'error');
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
                  <div onClick={() => navigate(`/products/sub-class/create?subClassId=${selectedLevel2Row.id}`)}>
                    <EditIcon style={{ marginRight: '10px' }} />
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
                  <div onClick={() => handleActivation(selectedLevel2Row.id, 'ACTIVE')}>
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
                  <div onClick={() => handleActivation(selectedLevel2Row.id, 'DEACTIVE')}>
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

  const getAllDepartment = (departmentPage) => {
    setLoader(true);
    const payload = {
      page: departmentPage,
      pageSize: 10,
      sourceId: [orgId],
      sourceLocationId: [locId],
      sortByUpdatedDate: 'DESCENDING',
      ...(departmentSearch && { departmentName: [departmentSearch] }),
    };
    getHoDepartment(payload)
      .then((res) => {
        setLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          setLoader(false);
        } else {
          const data = res?.data?.data?.results;
          setDepartmentCount(res?.data?.data?.totalResults);
          const updated = data?.map((item) => {
            const createdOn = new Date(item?.created);
            const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;

            const updatedOn = new Date(item?.updated);
            const updatedFormat = `${updatedOn.getDate()} ${months[updatedOn.getMonth()]} ${updatedOn.getFullYear()}`;

            return {
              id: item?.departmentId,
              name: item?.departmentName,
              code: item?.departmentCode,
              createdDate: formattedDate,
              updatedDate: updatedFormat,
              status: item?.active ? 'ACTIVE' : 'INACTIVE',
            };
          });
          const options = data?.map((item) => {
            return {
              label: item?.departmentName,
              value: item?.departmentId,
            };
          });
          setAllDepartmentRows(updated);
          setMainDepartmentOptions(options);
        }
      })
      .catch(() => {
        setLoader(false);
        showSnackbar('Error while fetching data', 'error');
      });
  };

  const handleInputChange = (event) => {
    setDepartmentSearch(event.target.value);
    getAllDepartment(departmentPage + 1); // Trigger search with the current page number
  };

  // const getAllDepartmentOptions = () => {
  //   setLoader(true);
  //   const payload = {
  //     page: 1,
  //     pageSize: 50,
  //     sourceId: [orgId],
  //     sourceLocationId: [locId],
  //     sortByUpdatedDate: 'DESCENDING',
  //   };
  //   getHoDepartment(payload)
  //     .then((res) => {
  //       setLoader(false);
  //       if (res?.data?.status === 'ERROR') {
  //         showSnackbar(res?.data?.message, 'error');
  //         setLoader(false);
  //       } else {
  //         const data = res?.data?.data?.results;

  //         const options = data?.map((item) => {
  //           return {
  //             label: item?.departmentName,
  //             value: item?.departmentId,
  //           };
  //         });
  //         setMainDepartmentOptions(options);
  //       }
  //     })
  //     .catch(() => {
  //       setLoader(false);
  //       showSnackbar('Error while fetching data', 'error');
  //     });
  // };

  const loadDepartmentOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      sortByUpdatedDate: 'DESCENDING',
      departmentName: searchQuery ? [searchQuery] : [],
    };

    try {
      const res = await getHoDepartment(payload);
      const data = res?.data?.data?.results || [];

      const options = data?.map((item) => ({
        label: item?.departmentName,
        value: item?.departmentId,
      }));

      return {
        options,
        hasMore: data?.length >= 50, // Check if there are more options to load
        additional: { page: page + 1 }, // Increment page for next load
      };
    } catch (error) {
      showSnackbar('Error fetching department options', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  useEffect(() => {
    if (selectedTab === 'Department' && selectedPart === 'Department') {
      getAllDepartment(departmentPage + 1);
    }
    // if (selectedTab === 'Department' && selectedPart === 'Sub-department') {
    //   getAllDepartmentOptions();
    // }
  }, [departmentPage, selectedTab, selectedPart]);

  const getAllSubDepartments = (departmentId, page) => {
    setLoader(true);
    const payload = {
      page: page,
      pageSize: 10,
      sourceId: [orgId],
      sourceLocationId: [locId],
      sortByUpdatedDate: 'DESCENDING',
    };

    if (departmentId) {
      payload.departmentId = [departmentId];
    }

    getHOSubDepartmentByDep(payload)
      .then((res) => {
        setLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
        } else {
          const data = res?.data?.data?.subDepartmentFilterResponses || [];
          if (res?.data?.data?.total_results) {
            setSubDepartmentCount(res?.data?.data?.totalResults);
          }

          const updated = data.map((item) => {
            const createdOn = new Date(item?.created);
            const updatedOn = new Date(item?.updated);
            // Format dates
            const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;
            const updatedFormat = `${updatedOn.getDate()} ${months[updatedOn.getMonth()]} ${updatedOn.getFullYear()}`;

            return {
              id: item?.subDepartmentId,
              name: item?.subDepartmentName,
              code: item?.subDepartmentCode,
              depName: item?.departmentName,
              createdDate: formattedDate,
              updatedDate: updatedFormat,
              status: item?.active ? 'ACTIVE' : 'INACTIVE',
            };
          });

          setAllSubDepartmentRows(updated);
        }
      })
      .catch(() => {
        setLoader(false); // Handle error
      });
  };

  useEffect(() => {
    if (selectedPart === 'Sub-department') {
      getAllSubDepartments(selectedDepartment, subDepartmentPage + 1);
    }
  }, [subDepartmentPage, selectedDepartment, selectedPart]);

  const getAllLineofBusiness = (page) => {
    setLoader(true);
    const payload = {
      page: page,
      pageSize: 10,
      sourceId: [orgId],
      sourceLocationId: [locId],
      sortByUpdatedDate: 'DESCENDING',
    };
    filterLineOfBusiness(payload)
      .then((res) => {
        setLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          setLoader(false);
        } else {
          const data = res?.data?.data?.results;
          setLineOfBusinessCount(res?.data?.data?.totalResults);
          const updated = data?.map((item) => {
            const createdOn = new Date(item?.created);
            const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;

            const updatedOn = new Date(item?.updated);
            const updatedFormat = `${updatedOn.getDate()} ${months[updatedOn.getMonth()]} ${updatedOn.getFullYear()}`;

            return {
              id: item?.lineOfBusinessId,
              name: item?.lobName,
              code: item?.lobCode,
              createdDate: formattedDate,
              updatedDate: updatedFormat,
              status: item?.active ? 'ACTIVE' : 'INACTIVE',
            };
          });

          setAllLineOfBusinessRows(updated);
        }
      })
      .catch(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (selectedTab === 'LineBusiness') {
      getAllLineofBusiness(lineOfBusinessPage + 1);
    }
  }, [lineOfBusinessPage, selectedTab]);

  const getAllCategories = (page) => {
    setLoader(true);
    const payload = {
      page: page,
      pageSize: 10,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['POS'],
      sortByUpdatedDate: 'DESCENDING',
    };
    getAllMainCategory(payload)
      .then((res) => {
        setLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          setLoader(false);
        } else {
          const data = res?.data?.data?.results;
          setCategoryCount(res?.data?.data?.totalResults);
          const updated = data?.map((item) => {
            const createdOn = new Date(item?.created);
            const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;

            const updatedOn = new Date(item?.updated);
            const updatedFormat = `${updatedOn.getDate()} ${months[updatedOn.getMonth()]} ${updatedOn.getFullYear()}`;

            return {
              id: item?.mainCategoryId,
              name: item?.categoryName,
              code: item?.categoryCode,
              createdDate: formattedDate,
              updatedDate: updatedFormat,
              status: item?.active ? 'ACTIVE' : 'INACTIVE',
            };
          });
          const options = data?.map((item) => {
            return {
              label: item?.categoryName,
              value: item?.mainCategoryId,
            };
          });
          setAllCategoryRows(updated);
          setMainCategoryOptions(options);
        }
      })
      .catch(() => {
        setLoader(false);
        showSnackbar('Error while fetching data', 'error');
      });
  };

  // const getAllCategoriesOptions = () => {
  //   setLoader(true);
  //   const payload = {
  //     page: 1,
  //     pageSize: 50,
  //     sourceId: [orgId],
  //     sourceLocationId: [locId],
  //     type: ['POS'],
  //     sortByUpdatedDate: 'DESCENDING',
  //   };
  //   getAllMainCategory(payload)
  //     .then((res) => {
  //       setLoader(false);
  //       if (res?.data?.status === 'ERROR') {
  //         showSnackbar(res?.data?.message, 'error');
  //         setLoader(false);
  //       } else {
  //         const data = res?.data?.data?.results;
  //         const options = data?.map((item) => {
  //           return {
  //             label: item?.categoryName,
  //             value: item?.mainCategoryId,
  //           };
  //         });
  //         setMainCategoryOptions(options);
  //       }
  //     })
  //     .catch(() => {
  //       setLoader(false);
  //       showSnackbar('Error while fetching data', 'error');
  //     });
  // };

  const loadMainCategoriesOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['POS'],
      sortByUpdatedDate: 'DESCENDING',
    };

    try {
      const res = await getAllMainCategory(payload);
      const data = res?.data?.data?.results || [];

      const options = data?.map((item) => ({
        label: item?.categoryName,
        value: item?.mainCategoryId,
      }));

      return {
        options,
        hasMore: data?.length >= 50,
        additional: { page: page + 1 }, // Increment the page number for infinite scroll
      };
    } catch (error) {
      showSnackbar('Error fetching Level 1 categories', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  useEffect(() => {
    if (selectedTab === 'Category' && selectedPart1 === 'Category') {
      getAllCategories(categoryPage + 1);
    }
    // if (selectedPart1 === 'Class' || selectedPart1 === 'Sub-class') {
    //   getAllCategoriesOptions();
    // }
  }, [categoryPage, selectedTab, selectedPart1]);

  const getAllLevel1Data = (id, page) => {
    setLoader(true);
    const payload = {
      page: page,
      pageSize: 10,
      sourceId: [orgId],
      sourceLocationId: [locId],
      // mainCategoryId: [id],
      type: ['POS'],
      sortByUpdatedDate: 'DESCENDING',
    };
    if (id) {
      payload.mainCategoryId = [id];
    }
    getAllLevel1CategoryAndMain(payload)
      .then((res) => {
        setLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          setLoader(false);
        } else {
          const data = res?.data?.data?.categoryLevel1Responses;
          setLevel1Count(res?.data?.data?.total_results);
          const updated = data?.map((item) => {
            const createdOn = new Date(item?.created);
            const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;

            const updatedOn = new Date(item?.updated);
            const updatedFormat = `${updatedOn.getDate()} ${months[updatedOn.getMonth()]} ${updatedOn.getFullYear()}`;

            return {
              id: item?.level1Id,
              name: item?.categoryName,
              code: item?.categoryCode,
              createdDate: formattedDate,
              updatedDate: updatedFormat,
              catName: item?.mainCategoryName,
              status: item?.active ? 'ACTIVE' : 'INACTIVE',
            };
          });
          const options = data?.map((item) => {
            return {
              label: item?.categoryName,
              value: item?.level1Id,
            };
          });
          setAllLevel1Rows(updated);
          setLevel1Options(options);
        }
      })
      .catch(() => {
        setLoader(false);
      });
  };

  // const getAllLevel1DataOptions = (id) => {
  //   setLoader(true);
  //   const payload = {
  //     page: 1,
  //     pageSize: 50,
  //     sourceId: [orgId],
  //     sourceLocationId: [locId],
  //     mainCategoryId: [id],
  //     type: ['POS'],
  //     sortByUpdatedDate: 'DESCENDING',
  //   };
  //   getAllLevel1Category(payload)
  //     .then((res) => {
  //       setLoader(false);
  //       if (res?.data?.status === 'ERROR') {
  //         showSnackbar(res?.data?.message, 'error');
  //         setLoader(false);
  //       } else {
  //         const data = res?.data?.data?.results;

  //         const options = data?.map((item) => {
  //           return {
  //             label: item?.categoryName,
  //             value: item?.level1Id,
  //           };
  //         });
  //         setLevel1Options(options);
  //       }
  //     })
  //     .catch(() => {
  //       setLoader(false);
  //     });
  // };

  const loadLevel1CategoriesOptions = async (searchQuery, loadedOptions, { page }, selectedCategory) => {
    if (!selectedCategory) {
      return { options: [], hasMore: false }; // If no Level 1 is selected, don't load options
    }

    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      mainCategoryId: [selectedCategory], // Pass mainCategoryId if needed
      type: ['POS'],
      sortByUpdatedDate: 'DESCENDING',
    };

    try {
      const res = await getAllLevel1Category(payload);
      const data = res?.data?.data?.results || [];

      const options = data?.map((item) => ({
        label: item?.categoryName,
        value: item?.level1Id, // Ensure proper mapping
      }));

      return {
        options,
        hasMore: data?.length >= 50,
        additional: { page: page + 1 }, // Increment page for next load
      };
    } catch (error) {
      showSnackbar('Error fetching Level 1 categories', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  useEffect(() => {
    if (selectedPart1 === 'Class') {
      getAllLevel1Data(selectedCategory, level1Page + 1);
    }
    // if (selectedPart1 === 'Sub-class' && selectedCategory) {
    //   getAllLevel1DataOptions(selectedCategory);
    // }
  }, [level1Page, selectedCategory, selectedPart1]);

  const getAllLevel2Data = (id, page) => {
    setLoader(true);
    const payload = {
      page: page,
      pageSize: 10,
      sourceId: [orgId],
      sourceLocationId: [locId],
      // level1Id: [id],
      type: ['POS'],
      sortByUpdatedDate: 'DESCENDING',
    };
    if (id) {
      payload.level1Id = [id];
    }
    getAllLevel2CategoryAndMain(payload)
      .then((res) => {
        setLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          setLoader(false);
        } else {
          const data = res?.data?.data?.categoryLevel2Responses;
          setLevel2Count(res?.data?.data?.total_results);
          const updated = data?.map((item) => {
            const createdOn = new Date(item?.created);
            const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;

            const updatedOn = new Date(item?.updated);
            const updatedFormat = `${updatedOn.getDate()} ${months[updatedOn.getMonth()]} ${updatedOn.getFullYear()}`;

            return {
              id: item?.level2Id,
              name: item?.level2CategoryName,
              code: item?.categoryCode,
              createdDate: formattedDate,
              updatedDate: updatedFormat,
              catName: item?.mainCategoryName,
              level1Name: item?.level1CategoryName,
              status: item?.active ? 'ACTIVE' : 'INACTIVE',
            };
          });

          setAllLevel2Rows(updated);
        }
      })
      .catch(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (selectedPart1 === 'Sub-class') {
      getAllLevel2Data(selectedLevel1Category, level2Page + 1);
    }
  }, [level2Page, selectedLevel1Category, selectedPart1]);

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox className="products-new-department-box">
          <div className="products-new-department-main-navbar">
            <div className="products-new-deparment-left-bar">
              <div
                onClick={() => setSelectedTab('Department')}
                className={
                  selectedTab === 'Department'
                    ? 'products-new-deparment-single-nav-selected'
                    : 'products-new-deparment-single-nav'
                }
              >
                <Typography className="products-new-deparment-single-nav-typo">Department</Typography>
              </div>
              <div
                onClick={() => setSelectedTab('Category')}
                className={
                  selectedTab === 'Category'
                    ? 'products-new-deparment-single-nav-selected'
                    : 'products-new-deparment-single-nav'
                }
              >
                <Typography className="products-new-deparment-single-nav-typo">Category</Typography>
              </div>
              <div
                onClick={() => setSelectedTab('LineBusiness')}
                className={
                  selectedTab === 'LineBusiness'
                    ? 'products-new-deparment-single-nav-selected'
                    : 'products-new-deparment-single-nav'
                }
              >
                <Typography className="products-new-deparment-single-nav-typo">Line of Business</Typography>
              </div>
            </div>
            {/* <div className="products-new-department-right-bar">
              <button>Bulk Upload</button>
            </div> */}
          </div>
        </SoftBox>

        {selectedTab === 'Department' ? (
          <>
            {/* navbar to select department or sub department */}
            <SoftBox className="products-new-department-selected-bar">
              <div>
                <input
                  type="radio"
                  id="scheduleYes"
                  name="scheduleGroup"
                  value="Department"
                  className="dynamic-coupon-marginright-10"
                  checked={selectedPart === 'Department'}
                  onChange={handleCatChange}
                />
                <label htmlFor="scheduleYes" className="products-new-department-label-typo">
                  Department
                </label>
              </div>

              <div>
                <input
                  type="radio"
                  id="scheduleYes"
                  name="scheduleGroup"
                  value="Sub-department"
                  className="dynamic-coupon-marginright-10"
                  checked={selectedPart === 'Sub-department'}
                  onChange={handleCatChange}
                />
                <label htmlFor="scheduleYes" className="products-new-department-label-typo">
                  Sub-department
                </label>
              </div>
            </SoftBox>{' '}
          </>
        ) : selectedTab === 'Category' ? (
          <SoftBox className="products-new-department-selected-bar">
            <div>
              <input
                type="radio"
                id="scheduleYes"
                name="scheduleGroup"
                value="Category"
                className="dynamic-coupon-marginright-10"
                checked={selectedPart1 === 'Category'}
                onChange={handleCatChange1}
              />
              <label for="scheduleYes" className="products-new-department-label-typo">
                Category
              </label>
            </div>

            <div>
              <input
                type="radio"
                id="scheduleYes"
                name="scheduleGroup"
                value="Class"
                className="dynamic-coupon-marginright-10"
                checked={selectedPart1 === 'Class'}
                onChange={handleCatChange1}
              />
              <label for="scheduleYes" className="products-new-department-label-typo">
                Class
              </label>
            </div>

            <div>
              <input
                type="radio"
                id="scheduleYes"
                name="scheduleGroup"
                value="Sub-class"
                className="dynamic-coupon-marginright-10"
                checked={selectedPart1 === 'Sub-class'}
                onChange={handleCatChange1}
              />
              <label for="scheduleYes" className="products-new-department-label-typo">
                Sub-class
              </label>
            </div>
          </SoftBox>
        ) : null}

        {selectedTab === 'Department' && selectedPart === 'Department' && (
          <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
            <SoftBox className="search-bar-filter-container">
              <SoftBox>
                <Box className="all-products-filter-product" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {/* <div style={{ maxWidth: '550px', margin: '5px' }}>
                    <SoftInput
                      className="all-products-filter-soft-input-box"
                      insideHeader={true}
                      placeholder="Search department name..."
                      size="small"
                      value={departmentSearch} // Bind the input value to state
                      onChange={handleInputChange}
                      icon={{ component: 'search', direction: 'left' }}
                    ></SoftInput>
                  </div> */}
                  <SoftButton variant="solidWhiteBackground" onClick={() => navigate('/products/department/create')}>
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
                    rows={allDepartmentRows}
                    columns={departmentColumns}
                    pagination
                    pageSize={10}
                    paginationMode="server"
                    rowCount={departmentCount}
                    page={departmentPage}
                    onPageChange={handleDepartmentPageChange}
                    getRowId={(row) => row.id}
                  />
                )}
              </Box>
            </SoftBox>
          </SoftBox>
        )}

        {selectedTab === 'Department' && selectedPart === 'Sub-department' && (
          <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
            <SoftBox className="search-bar-filter-container">
              <SoftBox>
                <Box
                  className="all-products-filter-product"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  {/* <SoftSelect
                    className="all-products-filter-soft-input-box"
                    insideHeader={true}
                    placeholder="Select Department..."
                    options={mainDepartmentOptions}
                    size="small"
                    onChange={(options) => {
                      setSelectedDepartment(options?.value);
                    }}
                  ></SoftSelect> */}
                  <SoftAsyncPaginate
                    className="all-products-filter-soft-input-box"
                    placeholder="Select Department..."
                    insideHeader={true}
                    loadOptions={(searchQuery, loadedOptions, additional) =>
                      loadDepartmentOptions(searchQuery, loadedOptions, additional)
                    }
                    additional={{ page: 1 }} // Start with the first page
                    value={mainDepartmentOptions?.find((option) => option.value === selectedDepartment)}
                    onChange={(option) => {
                      setSelectedDepartment(option?.value);
                    }}
                    isClearable
                    size="small"
                    menuPortalTarget={document.body}
                  />

                  <SoftButton
                    variant="solidWhiteBackground"
                    onClick={() => navigate(`/products/sub-department/create`)}
                  >
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
                    rows={allSubDepartmentRows}
                    columns={subDepartmentColumns}
                    pagination
                    pageSize={10}
                    paginationMode="server"
                    rowCount={subDepartmentCount}
                    page={subDepartmentPage}
                    onPageChange={handleSubDepartmentPageChange}
                    getRowId={(row) => row.id}
                  />
                )}
              </Box>
            </SoftBox>
          </SoftBox>
        )}

        {selectedTab === 'LineBusiness' && (
          <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
            <SoftBox className="search-bar-filter-container">
              <SoftBox>
                <Box className="all-products-filter-product" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SoftButton
                    variant="solidWhiteBackground"
                    onClick={() => navigate('/products/line-of-business/create')}
                  >
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
                    rows={allLineOfBusinessRows}
                    columns={lineOfBusinessColumns}
                    pagination
                    pageSize={10}
                    paginationMode="server"
                    rowCount={lineOfBusinessCount}
                    page={lineOfBusinessPage}
                    onPageChange={handleLineOfBusinessPageChange}
                    getRowId={(row) => row.id}
                  />
                )}
              </Box>
            </SoftBox>
          </SoftBox>
        )}

        {selectedTab === 'Category' && selectedPart1 === 'Category' && (
          <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
            <SoftBox className="search-bar-filter-container">
              <SoftBox>
                <Box className="all-products-filter-product" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SoftButton variant="solidWhiteBackground" onClick={() => navigate('/products/category/create')}>
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
                    rows={allCategoryRows}
                    columns={categoryColumns}
                    pagination
                    pageSize={10}
                    paginationMode="server"
                    rowCount={categoryCount}
                    page={categoryPage}
                    onPageChange={handleCategoryPageChange}
                    getRowId={(row) => row.id}
                  />
                )}
              </Box>
            </SoftBox>
          </SoftBox>
        )}

        {selectedTab === 'Category' && selectedPart1 === 'Class' && (
          <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
            <SoftBox className="search-bar-filter-container">
              <SoftBox>
                <Box
                  className="all-products-filter-product"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  {/* <SoftSelect
                    className="all-products-filter-soft-input-box"
                    insideHeader={true}
                    placeholder="Select Category..."
                    options={mainCategoryOptions}
                    size="small"
                    onChange={(options) => {
                      setSelectedCategory(options?.value);
                    }}
                  ></SoftSelect> */}
                  <SoftAsyncPaginate
                    className="all-products-filter-soft-input-box"
                    placeholder="Select Class..."
                    insideHeader={true}
                    loadOptions={loadMainCategoriesOptions}
                    additional={{ page: 1 }}
                    value={mainCategoryOptions?.find((option) => option.value === selectedCategory)}
                    onChange={(option) => {
                      setSelectedCategory(option?.value);
                    }}
                    isClearable
                    size="small"
                    menuPortalTarget={document.body}
                  />

                  <SoftButton variant="solidWhiteBackground" onClick={() => navigate(`/products/class/create`)}>
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
                    rows={allLevel1Rows}
                    columns={level1Columns}
                    pagination
                    pageSize={10}
                    paginationMode="server"
                    rowCount={level1Count}
                    page={level1Page}
                    onPageChange={handleLevel1PageChange}
                    getRowId={(row) => row.id}
                  />
                )}
              </Box>
            </SoftBox>
          </SoftBox>
        )}

        {selectedTab === 'Category' && selectedPart1 === 'Sub-class' && (
          <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
            <SoftBox className="search-bar-filter-container">
              <SoftBox>
                <Box
                  className="all-products-filter-product"
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {/* <SoftSelect
                      className="all-products-filter-soft-input-box"
                      insideHeader={true}
                      placeholder="Select main category..."
                      options={mainCategoryOptions}
                      size="small"
                      onChange={(options) => {
                        setSelectedCategory(options?.value);
                      }}
                    ></SoftSelect> */}
                    <SoftAsyncPaginate
                      className="all-products-filter-soft-input-box"
                      placeholder="Select Class..."
                      insideHeader={true}
                      loadOptions={loadMainCategoriesOptions}
                      additional={{ page: 1 }}
                      value={mainCategoryOptions?.find((option) => option.value === selectedCategory)}
                      onChange={(option) => {
                        setSelectedCategory(option?.value);
                      }}
                      isClearable
                      size="small"
                      menuPortalTarget={document.body}
                    />
                    {/* <SoftSelect
                      className="all-products-filter-soft-input-box"
                      insideHeader={true}
                      placeholder="Select level 1 category..."
                      options={level1Options}
                      size="small"
                      onChange={(options) => {
                        setSelectedLevel1Category(options?.value);
                      }}
                    ></SoftSelect> */}
                    <SoftAsyncPaginate
                      className="all-products-filter-soft-input-box"
                      placeholder="Select Sub-class..."
                      insideHeader={true}
                      loadOptions={(searchQuery, loadedOptions, additional) =>
                        loadLevel1CategoriesOptions(searchQuery, loadedOptions, additional, selectedCategory)
                      }
                      additional={{ page: 1 }}
                      value={level1Options?.find((option) => option.value === selectedLevel1Category)}
                      onChange={(option) => {
                        setSelectedLevel1Category(option?.value);
                      }}
                      key={selectedCategory}
                      isClearable
                      size="small"
                      menuPortalTarget={document.body}
                    />
                  </div>
                  <SoftButton variant="solidWhiteBackground" onClick={() => navigate(`/products/sub-class/create`)}>
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
                    rows={allLevel2Rows}
                    columns={level2Columns}
                    pagination
                    pageSize={10}
                    paginationMode="server"
                    rowCount={level2Count}
                    page={level2Page}
                    onPageChange={handleLevel2PageChange}
                    getRowId={(row) => row.id}
                  />
                )}
              </Box>
            </SoftBox>
          </SoftBox>
        )}
      </DashboardLayout>
    </div>
  );
};

export default AllListingPage;
