import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { Box, Button, CircularProgress, Menu, MenuItem, Stack, Typography } from '@mui/material';
import SoftBox from '../../../../components/SoftBox';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import SoftButton from '../../../../components/SoftButton';
import Spinner from '../../../../components/Spinner';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  copyPalletOnlineCategories,
  editHOCategory,
  editLevel1Category,
  editLevel2Category,
  getAllLevel1Category,
  getAllLevel1CategoryAndMain,
  getAllLevel2Category,
  getAllLevel2CategoryAndMain,
  getAllMainCategory,
} from '../../../../config/Services';
import SoftSelect from '../../../../components/SoftSelect';
import Status from '../../Common/Status';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import SoftAsyncPaginate from '../../../../components/SoftSelect/SoftAsyncPaginate';

const OnlineCategoryListing = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [selectedTab, setSelectedTab] = useState('Level1');
  const [loader, setLoader] = useState(false);
  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);

  const markUpOpen = Boolean(anchorMarkupEl);

  //   level 1
  const [level1Page, setLevel1Page] = useState(0);
  const [level1Count, setLevel1Count] = useState();
  const [selectedLevel1Row, setSelectedLevel1Row] = useState();
  const [allLevel1Rows, setAllLevel1Rows] = useState([]);
  const [mainLevel1Options, setMainLevel1Options] = useState([]);
  const [selectedLevel1, setSelectedLevel1] = useState('');

  //   level 2
  const [level2Page, setLevel2Page] = useState(0);
  const [level2Count, setLevel2Count] = useState();
  const [selectedLevel2Row, setSelectedLevel2Row] = useState();
  const [allLevel2Rows, setAllLevel2Rows] = useState([]);
  const [mainLevel2Options, setMainLevel2Options] = useState([]);
  const [selectedLevel2, setSelectedLevel2] = useState('');

  //   level 3
  const [level3Page, setLevel3Page] = useState(0);
  const [level3Count, setLevel3Count] = useState();
  const [selectedLevel3Row, setSelectedLevel3Row] = useState();
  const [allLevel3Rows, setAllLevel3Rows] = useState([]);

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const isRestaurant = localStorage.getItem('retailType') === 'RESTAURANT';

  const handleLevel1PageChange = (newPage) => {
    setLevel1Page(newPage);
  };

  const handleLevel2PageChange = (newPage) => {
    setLevel2Page(newPage);
  };

  const handleLevel3PageChange = (newPage) => {
    setLevel3Page(newPage);
  };

  const Level1Columns = [
    {
      field: 'id',
      headerName: 'Level1 Id',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'image',
      headerName: 'Level 1 Image',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        return <img src={params.value} className="all-product-image" width="40px" height="40px" />;
      },
    },
    {
      field: 'name',
      headerName: 'Level 1 Name',
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
              getMainCategories(level1Page + 1);
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
                  <div
                    onClick={() => navigate(`/products/online-category/level1/create?level1Id=${selectedLevel1Row.id}`)}
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

  const Level2Columns = [
    {
      field: 'id',
      headerName: 'Level 2 Id',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'image',
      headerName: 'Level 2 Image',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        return <img src={params.value} className="all-product-image" width="40px" height="40px" />;
      },
    },
    {
      field: 'name',
      headerName: 'Level 2 Name',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'level1name',
      headerName: 'Level 1 Name',
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
          setSelectedLevel2Row(params.row);
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
              getLevel2Categories(level2Page + 1, selectedLevel1);
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
                  <div
                    onClick={() => navigate(`/products/online-category/level2/create?classId=${selectedLevel2Row.id}`)}
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

  const Level3Columns = [
    {
      field: 'id',
      headerName: 'Level 3 Id',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'image',
      headerName: 'Level 3 Image',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        return <img src={params.value} className="all-product-image" width="40px" height="40px" />;
      },
    },
    {
      field: 'name',
      headerName: 'Level 3 Name',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'level1name',
      headerName: 'Level 1 Name',
      minWidth: 120,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'level2name',
      headerName: 'Level 2 Name',
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
          setSelectedLevel3Row(params.row);
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
              getLevel3Categories(level3Page + 1, selectedLevel2);
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
                  <div
                    onClick={() =>
                      navigate(`/products/online-category/level3/create?subClassId=${selectedLevel3Row.id}`)
                    }
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
                  <div onClick={() => handleActivation(selectedLevel3Row.id, 'ACTIVE')}>
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
                  <div onClick={() => handleActivation(selectedLevel3Row.id, 'DEACTIVE')}>
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

  const getMainCategories = (page) => {
    const payload = {
      page: page,
      pageSize: 10,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
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
          setLevel1Count(res?.data?.data?.totalResults);
          const updated = data?.map((item) => {
            const createdOn = new Date(item?.created);
            const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;

            const updatedOn = new Date(item?.updated);
            const updatedFormat = `${updatedOn.getDate()} ${months[updatedOn.getMonth()]} ${updatedOn.getFullYear()}`;

            return {
              id: item?.mainCategoryId,
              name: item?.categoryName,
              image: item?.categoryImage,
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
          setAllLevel1Rows(updated);
          setMainLevel1Options(options);
        }
      })
      .catch(() => {
        setLoader(false);
        showSnackbar('Error while fetching data', 'error');
      });
  };

  // const getAllMainCategoriesOptions = () => {
  //   const payload = {
  //     page: 1,
  //     pageSize: 50,
  //     sourceId: [orgId],
  //     sourceLocationId: [locId],
  //     type: ['APP'],
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
  //         setMainLevel1Options(options);
  //       }
  //     })
  //     .catch(() => {
  //       setLoader(false);
  //     });
  // };

  const loadMainCategoriesOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
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
    if (selectedTab === 'Level1') {
      getMainCategories(level1Page + 1);
    }
    // if (selectedTab === 'Level2' || selectedTab === 'Level3') {
    //   getAllMainCategoriesOptions();
    // }
  }, [level1Page, selectedTab]);

  const getLevel2Categories = (page, id) => {
    const payload = {
      page: page,
      pageSize: 10,
      // mainCategoryId: [id],
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
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
          setLevel2Count(res?.data?.data?.total_results);
          const updated = data?.map((item) => {
            const createdOn = new Date(item?.created);
            const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;

            const updatedOn = new Date(item?.updated);
            const updatedFormat = `${updatedOn.getDate()} ${months[updatedOn.getMonth()]} ${updatedOn.getFullYear()}`;

            return {
              id: item?.level1Id,
              name: item?.categoryName,
              image: item?.categoryImage,
              createdDate: formattedDate,
              updatedDate: updatedFormat,
              level1name: item?.mainCategoryName,
              status: item?.active ? 'ACTIVE' : 'INACTIVE',
            };
          });
          const options = data?.map((item) => {
            return {
              label: item?.categoryName,
              value: item?.level1Id,
            };
          });
          setAllLevel2Rows(updated);
          setMainLevel2Options(options);
        }
      })
      .catch(() => {
        setLoader(false);
        showSnackbar('Error while fetching data', 'error');
      });
  };

  // const getAllLevel2CategoriesOptions = (id) => {
  //   const payload = {
  //     page: 1,
  //     pageSize: 50,
  //     mainCategoryId: [id],
  //     sourceId: [orgId],
  //     sourceLocationId: [locId],
  //     type: ['APP'],
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
  //         setMainLevel2Options(options);
  //       }
  //     })
  //     .catch(() => {
  //       setLoader(false);
  //       showSnackbar('Error while fetching data', 'error');
  //     });
  // };

  const loadLevel2CategoriesOptions = async (searchQuery, loadedOptions, { page }, selectedLevel1) => {
    if (!selectedLevel1) {
      return { options: [], hasMore: false }; // If no Level 1 is selected, don't load options
    }

    const payload = {
      page: page,
      pageSize: 50,
      mainCategoryId: [selectedLevel1], // Fetch options for the selected Level 1
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
      sortByUpdatedDate: 'DESCENDING',
    };

    try {
      const res = await getAllLevel1Category(payload); // Fetch Level 2 categories
      const data = res?.data?.data?.results || [];

      const options = data?.map((item) => ({
        label: item?.categoryName,
        value: item?.level1Id, // Make sure to map the correct fields
      }));

      return {
        options,
        hasMore: data?.length >= 50, // Enable pagination if more results exist
        additional: { page: page + 1 },
      };
    } catch (error) {
      showSnackbar('Error fetching Level 2 categories', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  useEffect(() => {
    if (selectedTab === 'Level2') {
      getLevel2Categories(level2Page + 1, selectedLevel1);
    }
    // if (selectedTab === 'Level3') {
    //   getAllLevel2CategoriesOptions(selectedLevel1);
    // }
  }, [level2Page, selectedLevel1, selectedTab]);

  const getLevel3Categories = (page, id) => {
    const payload = {
      page: page,
      pageSize: 10,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
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
          setLevel3Count(res?.data?.data?.total_results);
          const updated = data?.map((item) => {
            const createdOn = new Date(item?.created);
            const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;

            const updatedOn = new Date(item?.updated);
            const updatedFormat = `${updatedOn.getDate()} ${months[updatedOn.getMonth()]} ${updatedOn.getFullYear()}`;

            return {
              id: item?.level2Id,
              name: item?.level2CategoryName,
              image: item?.categoryImage,
              createdDate: formattedDate,
              updatedDate: updatedFormat,
              level1name: item?.mainCategoryName,
              level2name: item?.level1CategoryName,
              status: item?.active ? 'ACTIVE' : 'INACTIVE',
            };
          });

          setAllLevel3Rows(updated);
        }
      })
      .catch(() => {
        setLoader(false);
        showSnackbar('Error while fetching data', 'error');
      });
  };

  useEffect(() => {
    if (selectedTab === 'Level3') {
      getLevel3Categories(level3Page + 1, selectedLevel2);
    }
  }, [level3Page, selectedLevel2, selectedTab]);

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
    copyPalletOnlineCategories(payload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          setCopyLoader(false);
          showSnackbar('Error while copying categories data', 'error');
        }
        // setCopyLoader(false);
        // showSnackbar('Categories copied successfully. Please refresh the page.', 'success');
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      })
      .catch((err) => {
        setCopyLoader(false);
        showSnackbar('Error while copying categories data', 'error');
      });
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <Typography className="products-new-online-category-heading">Online Product Category</Typography>
        {/* top navbar to select category, level 1, level 2 */}
        <SoftBox className="products-new-department-box">
          <div className="products-new-department-main-navbar">
            <div className="products-new-deparment-left-bar">
              <div
                onClick={() => setSelectedTab('Level1')}
                className={
                  selectedTab === 'Level1'
                    ? 'products-new-deparment-single-nav-selected'
                    : 'products-new-deparment-single-nav'
                }
              >
                <Typography className="products-new-deparment-single-nav-typo">Level 1</Typography>
              </div>
              <div
                onClick={() => setSelectedTab('Level2')}
                className={
                  selectedTab === 'Level2'
                    ? 'products-new-deparment-single-nav-selected'
                    : 'products-new-deparment-single-nav'
                }
              >
                <Typography className="products-new-deparment-single-nav-typo">Level 2</Typography>
              </div>

              {!isRestaurant && (
                <div
                  onClick={() => setSelectedTab('Level3')}
                  className={
                    selectedTab === 'Level3'
                      ? 'products-new-deparment-single-nav-selected'
                      : 'products-new-deparment-single-nav'
                  }
                >
                  <Typography className="products-new-deparment-single-nav-typo">Level 3</Typography>
                </div>
              )}
            </div>
            {/* <div className="products-new-department-right-bar">
      <button>Bulk Upload</button>
    </div> */}
          </div>
        </SoftBox>

        {selectedTab === 'Level1' && (
          <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
            <SoftBox className="search-bar-filter-container">
              <SoftBox>
                <Box className="all-products-filter-product" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SoftButton
                    variant="solidWhiteBackground"
                    onClick={() => navigate('/products/online-category/level1/create')}
                  >
                    + New
                  </SoftButton>
                </Box>
              </SoftBox>
            </SoftBox>
            <SoftBox>
              <Box sx={{ height: 525, width: '100%' }}>
                {loader && <Spinner />}
                {!loader &&
                  (allLevel1Rows?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                      <Typography variant="h6">It seems like there are no categories present.</Typography>
                      <Typography variant="body1" style={{ margin: '10px 0' }}>
                        Would you like to copy pallet categories?
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
                          It will take some time to copy the category data. Please refresh after some time.
                        </Typography>
                      )}
                    </div>
                  ) : (
                    <DataGrid
                      rows={allLevel1Rows}
                      columns={Level1Columns}
                      pagination
                      pageSize={10}
                      paginationMode="server"
                      rowCount={level1Count}
                      page={level1Page}
                      onPageChange={handleLevel1PageChange}
                      getRowId={(row) => row.id}
                    />
                  ))}
              </Box>
            </SoftBox>
          </SoftBox>
        )}

        {selectedTab === 'Level2' && (
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
                    placeholder="Select Level 1..."
                    options={mainLevel1Options}
                    size="small"
                    onChange={(options) => {
                      setSelectedLevel1(options?.value);
                    }}
                  ></SoftSelect> */}
                  <SoftAsyncPaginate
                    className="all-products-filter-soft-input-box"
                    placeholder="Select Level 1..."
                    insideHeader={true}
                    loadOptions={loadMainCategoriesOptions}
                    additional={{ page: 1 }}
                    value={mainLevel1Options?.find((option) => option.value === selectedLevel1)}
                    onChange={(option) => {
                      setSelectedLevel1(option?.value);
                    }}
                    isClearable
                    size="small"
                    menuPortalTarget={document.body}
                  />

                  <SoftButton
                    variant="solidWhiteBackground"
                    onClick={() => navigate(`/products/online-category/level2/create`)}
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
                    rows={allLevel2Rows}
                    columns={Level2Columns}
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

        {selectedTab === 'Level3' && (
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
                      placeholder="Select Level 1..."
                      options={mainLevel1Options}
                      size="small"
                      onChange={(options) => {
                        setSelectedLevel1(options?.value);
                      }}
                    ></SoftSelect> */}
                    <SoftAsyncPaginate
                      className="all-products-filter-soft-input-box"
                      placeholder="Select Level 1..."
                      insideHeader={true}
                      loadOptions={loadMainCategoriesOptions}
                      additional={{ page: 1 }}
                      value={mainLevel1Options?.find((option) => option.value === selectedLevel1)}
                      onChange={(option) => {
                        setSelectedLevel2(null);
                        setSelectedLevel1(option?.value);
                        setMainLevel2Options([]);
                      }}
                      isClearable
                      size="small"
                      menuPortalTarget={document.body}
                    />

                    {/* <SoftSelect
                      className="all-products-filter-soft-input-box"
                      insideHeader={true}
                      placeholder="Select Level 2..."
                      options={mainLevel2Options}
                      size="small"
                      onChange={(options) => {
                        setSelectedLevel2(options?.value);
                      }}
                    ></SoftSelect> */}
                    <SoftAsyncPaginate
                      className="all-products-filter-soft-input-box"
                      placeholder="Select Level 2..."
                      insideHeader={true}
                      loadOptions={
                        (searchQuery, loadedOptions, additional) =>
                          loadLevel2CategoriesOptions(searchQuery, loadedOptions, additional, selectedLevel1) // Pass selectedLevel1 ID
                      }
                      additional={{ page: 1 }}
                      value={mainLevel2Options?.find((option) => option.value === selectedLevel2)}
                      onChange={(option) => {
                        setSelectedLevel2(option?.value);
                      }}
                      key={selectedLevel1}
                      isClearable
                      size="small"
                      menuPortalTarget={document.body}
                    />
                  </div>
                  <SoftButton
                    variant="solidWhiteBackground"
                    onClick={() => navigate(`/products/online-category/level3/create`)}
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
                    rows={allLevel3Rows}
                    columns={Level3Columns}
                    pagination
                    pageSize={10}
                    paginationMode="server"
                    rowCount={level3Count}
                    page={level3Page}
                    onPageChange={handleLevel3PageChange}
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

export default OnlineCategoryListing;
