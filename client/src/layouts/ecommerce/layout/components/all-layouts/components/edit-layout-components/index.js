import './edit.css';
import { DataGrid } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import { fetchSubEntitiesForLayout, layoutSubEntitiesBulkUpdate } from '../../../../../../../config/Services';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import sideNavUpdate from '../../../../../../../components/Utility/sidenavupdate';
// import 'react-toastify/dist/ReactToastify.css';
import { injectStyle } from 'react-toastify/dist/inject-style';

import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { noDatagif } from '../../../../../Common/CommonFunction';

const EditLayoutComponents = () => {
  sideNavUpdate();
  injectStyle();
  //snackbar
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [dataRows, setDataRows] = useState([]);
  const [dataRows1, setDataRows1] = useState([]);
  const [loader, setLoader] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [edit, setEdit] = useState(false);
  const [targetElement, setTargetElement] = useState(null);

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [errorComing, setErrorComing] = useState(false);

  const layoutId = localStorage.getItem('layout_id');
  const defId = localStorage.getItem('definitionId');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;

  if (localStorage.getItem('mapId') !== null) {
    const mapId = localStorage.getItem('mapId');
  }
  if (localStorage.getItem('mapId') == null) {
    const mapId = localStorage.getItem('mapId');
  }

  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  //   console.log('def', defId, layoutId);

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const handleEntityName = (e, id) => {
    // e.preventDefault();
    const value = e.target.value;
    const newRows = [...pageState.datRows];
    const index = newRows.findIndex((item) => item.barcodeId === id);
    const obj = newRows.find((item) => item.barcodeId === id);
    newRows[index] = {
      ...obj,
      entityName: value,
    };
    // setDataRows(newRows);
    setPageState((prev) => {
      return {
        ...prev,
        datRows: newRows,
      };
    });
  };

  const handleTotalSpace = (e, id) => {
    const value = e.target.value;
    // const newRows = [...dataRows];
    const newRows = [...pageState.datRows];
    const index = newRows.findIndex((item) => item.barcodeId === id);
    const obj = newRows.find((item) => item.barcodeId === id);
    newRows[index] = {
      ...obj,
      totalSpace: value,
    };
    // setDataRows(newRows);
    setPageState((prev) => {
      return {
        ...prev,
        datRows: newRows,
      };
    });
  };

  const handleCheckBoxForStorageCap = (e, id) => {
    const value = e.target.checked;
    // const newRows = [...dataRows];
    const newRows = [...pageState.datRows];
    const index = newRows.findIndex((item) => item.barcodeId === id);
    const obj = newRows.find((item) => item.barcodeId === id);
    newRows[index] = {
      ...obj,
      storageCap: value,
    };
    // setDataRows(newRows);
    setPageState((prev) => {
      return {
        ...prev,
        datRows: newRows,
      };
    });
  };

  const handleCheckBoxForInUse = (e, id) => {
    e.preventDefault();
    const value = e.target.checked;
    // const newRows = [...dataRows];
    const newRows = [...pageState.datRows];
    const index = newRows.findIndex((item) => item.barcodeId === id);
    const obj = newRows.find((item) => item.barcodeId === id);
    newRows[index] = {
      ...obj,
      inUse: value,
    };
    // setDataRows(newRows);
    setPageState((prev) => {
      return {
        ...prev,
        datRows: newRows,
      };
    });
  };

  const handleCancel = () => {
    setEdit(false);
    // setDataRows(dataRows1);
    setPageState((prev) => {
      return {
        ...prev,
        datRows: dataRows1,
      };
    });
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const columns = [
    {
      field: 'entityName',
      headerName: 'Entity Name',
      minWidth: 150,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        if (targetElement !== null && targetElement.barcodeId == params.row.barcodeId) {
          return (
            <Box>
              {edit ? (
                <SoftInput
                  type="text"
                  value={params.row.entityName}
                  onChange={(e) => handleEntityName(e, params.row.barcodeId)}
                  onKeyDown={(event) => {
                    event.stopPropagation();
                  }}
                  onKeyUp={(event) => {
                    event.stopPropagation();
                  }}
                  onKeyPress={(event) => {
                    event.stopPropagation();
                  }}
                />
              ) : (
                <SoftTypography
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#0064fe',
                  }}
                >
                  {params.row.entityName}
                </SoftTypography>
              )}
            </Box>
          );
        }
        return (
          <Box>
            {edit ? (
              <SoftInput
                type="text"
                value={params.row.entityName}
                onChange={(e) => handleEntityName(e, params.row.barcodeId)}
                onKeyDown={(event) => {
                  event.stopPropagation();
                }}
                onKeyUp={(event) => {
                  event.stopPropagation();
                }}
                onKeyPress={(event) => {
                  event.stopPropagation();
                }}
              />
            ) : (
              <SoftTypography
                sx={{
                  fontSize: '0.75rem',
                }}
              >
                {params.row.entityName}
              </SoftTypography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'totalSpace',
      headerName: 'Total Space',
      minWidth: 150,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        if (targetElement !== null && targetElement.barcodeId == params.row.barcodeId) {
          return (
            <Box>
              {edit ? (
                <SoftInput
                  type="number"
                  value={params.row.totalSpace}
                  onChange={(e) => handleTotalSpace(e, params.row.barcodeId)}
                />
              ) : (
                <SoftTypography
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#0064fe',
                  }}
                >
                  {params.row.totalSpace}
                </SoftTypography>
              )}
            </Box>
          );
        }

        return (
          <Box>
            {edit ? (
              <SoftInput
                type="number"
                value={params.row.totalSpace}
                onChange={(e) => handleTotalSpace(e, params.row.barcodeId)}
              />
            ) : (
              <SoftTypography
                sx={{
                  fontSize: '0.75rem',
                }}
              >
                {params.row.totalSpace}
              </SoftTypography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'inUse',
      headerName: 'In Use',
      minWidth: 150,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        // console.log('inUse', params.row);
        if (targetElement !== null && targetElement.barcodeId == params.row.barcodeId) {
          return (
            <Box>
              {edit ? (
                <Checkbox
                  size="small"
                  checked={params.row.inUse}
                  onChange={(e) => handleCheckBoxForInUse(e, params.row.barcodeId)}
                />
              ) : (
                <SoftTypography
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#0064fe',
                  }}
                >
                  {params?.row?.inUse == true ? 'Yes' : 'No'}
                </SoftTypography>
              )}
            </Box>
          );
        }
        return (
          <Box>
            {edit ? (
              <Checkbox
                size="small"
                checked={params.row.inUse}
                onChange={(e) => handleCheckBoxForInUse(e, params.row.barcodeId)}
              />
            ) : (
              <SoftTypography
                sx={{
                  fontSize: '0.75rem',
                  color: 'black',
                }}
              >
                {params?.row?.inUse == true ? 'Yes' : 'No'}
              </SoftTypography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'storageCap',
      headerName: 'Storage Cap',
      minWidth: 150,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        // console.log('storrageCAp', params.row);
        if (targetElement !== null && targetElement.barcodeId == params.row.barcodeId) {
          return (
            <Box>
              {edit ? (
                <Checkbox
                  size="small"
                  checked={params.row.storageCap}
                  onChange={(e) => handleCheckBoxForStorageCap(e, params.row.barcodeId)}
                />
              ) : (
                <SoftTypography
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: '#0064fe',
                  }}
                >
                  {params.row.storageCap == true ? 'Yes' : 'No'}
                </SoftTypography>
              )}
            </Box>
          );
        }
        return (
          <Box>
            {edit ? (
              <Checkbox
                size="small"
                checked={params.row.storageCap}
                onChange={(e) => handleCheckBoxForStorageCap(e, params.row.barcodeId)}
              />
            ) : (
              <SoftTypography
                sx={{
                  fontSize: '0.75rem',
                }}
              >
                {params.row.storageCap == true ? 'Yes' : 'No'}
              </SoftTypography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'storageType',
      headerName: 'Storage Type',
      minWidth: 200,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        // console.log(params.row);
        if (targetElement !== null && targetElement.barcodeId == params.row.barcodeId) {
          return (
            <Box>
              <SoftTypography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#0064fe',
                }}
              >
                {params?.row?.storageType == null ? '---' : params?.row?.storageType}
              </SoftTypography>
            </Box>
          );
        }
        return (
          <Box>
            <SoftTypography
              sx={{
                fontSize: '0.75rem',
                color: 'black',
              }}
            >
              {params?.row?.storageType == null ? '---' : params?.row?.storageType}
            </SoftTypography>
          </Box>
        );
      },
    },
    {
      field: 'createdByPerson',
      headerName: 'Created By',
      minWidth: 200,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        if (targetElement !== null && targetElement.barcodeId == params.row.barcodeId) {
          return (
            <Box>
              <SoftTypography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#0064fe',
                }}
              >
                {params?.row?.createdByPerson == null ? '---' : params?.row?.createdByPerson}
              </SoftTypography>
            </Box>
          );
        }
        return (
          <Box>
            <SoftTypography
              sx={{
                fontSize: '0.75rem',
                color: 'black',
              }}
            >
              {params?.row?.createdByPerson == null ? '---' : params?.row?.createdByPerson}
            </SoftTypography>
          </Box>
        );
      },
    },
    {
      field: 'createdOn',
      headerName: 'Created On',
      minWidth: 200,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        // console.log(params.row);
        if (targetElement !== null && targetElement.barcodeId == params.row.barcodeId) {
          return (
            <Box>
              <SoftTypography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#0064fe',
                }}
              >
                {params?.row?.createdOn == null ? '---' : params?.row?.createdOn}
              </SoftTypography>
            </Box>
          );
        }
        return (
          <Box>
            <SoftTypography
              sx={{
                fontSize: '0.75rem',
                color: 'black',
              }}
            >
              {params?.row?.createdOn == null ? '---' : params?.row?.createdOn}
            </SoftTypography>
          </Box>
        );
      },
    },
    {
      field: 'availableSpace',
      headerName: 'Available Space',
      minWidth: 150,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        // console.log(params.row);
        if (targetElement !== null && targetElement.barcodeId == params.row.barcodeId) {
          return (
            <Box>
              <SoftTypography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#0064fe',
                }}
              >
                {params?.row?.availableSpace == null ? '---' : params?.row?.availableSpace}
              </SoftTypography>
            </Box>
          );
        }
        return (
          <Box>
            <SoftTypography
              sx={{
                fontSize: '0.75rem',
                color: 'black',
              }}
            >
              {params?.row?.availableSpace == null ? '---' : params?.row?.availableSpace}
            </SoftTypography>
          </Box>
        );
      },
    },
  ];

  const fetchSubEntities = async () => {
    const payload = {
      pageNo: pageState.page - 1,
      pageSize: pageState.pageSize,
    };

    if (localStorage.getItem('mapId') == null) {
      const mapId = localStorage.getItem('mapId');
      try {
        setLoader(true);
        const response = await fetchSubEntitiesForLayout(layoutId, defId, mapId, payload);

        if (response.data.data.object !== null) {
          const result = response.data.data.object.data;
          result.map((row) => ({
            entityName: row.entityName !== null ? row.entityName : '---',
            totalSpace: row.totalSpace !== null ? row.totalSpace : '---',
            storageCap: row?.storageCap !== null ? row?.storageCap : '---',
            inUse: row?.inUse !== null ? row?.inUse : '---',
            storageType: row.storageType !== null ? row.storageType : '---',
            createdByPerson: row.createdByPerson !== null ? row.createdByPerson : '---',
            createdOn: row.createdOn !== null ? row.createdOn : '---',
            availableSpace: row.availableSpace !== null ? row.availableSpace : '---',
            barcodeId: row.barcodeId,
            mapId: row.mapId,
          }));
          // setDataRows(result);
          // console.log('resData', result);
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: result || [],
            total: response.data.data.object.totalElements || 0,
          }));
          setDataRows1(result);

          toast.success(response.data.data.message, {
            position: 'bottom-left',
            autoClose: 2000,
            theme: 'light',
          });
        } else {
          setDataRows([]);
        }

        setLoader(false);
      } catch (err) {
        setLoader(false);
      }
    }

    if (payload.pageNo == 0 && localStorage.getItem('mapId') !== null) {
      const mapId = localStorage.getItem('mapId');
      try {
        setLoader(true);
        const response = await fetchSubEntitiesForLayout(layoutId, defId, mapId, payload);

        if (response.data.data.object !== null && response.data.data.object.targetElement !== null) {
          setTargetElement(response.data.data.object.targetElement);
          const result = [response.data.data.object.targetElement, ...response.data.data.object.data];
          result.map((row, index) => {
            if (index == 0) {
              return {
                entityName: row.entityName !== null ? row.entityName : '---',
                totalSpace: row.totalSpace !== null ? row.totalSpace : '---',
                storageCap: row?.storageCap !== null ? row?.storageCap : '---',
                inUse: row?.inUse !== null ? row?.inUse : '---',
                storageType: row.storageType !== null ? row.storageType : '---',
                createdByPerson: row.createdByPerson !== null ? row.createdByPerson : '---',
                createdOn: row.createdOn !== null ? row.createdOn : '---',
                availableSpace: row.availableSpace !== null ? row.availableSpace : '---',
                barcodeId: row.barcodeId,
                mapId: row.mapId,
                indexFirst: index,
              };
            } else {
              return {
                entityName: row.entityName !== null ? row.entityName : '---',
                totalSpace: row.totalSpace !== null ? row.totalSpace : '---',
                storageCap: row?.storageCap !== null ? row?.storageCap : '---',
                inUse: row?.inUse !== null ? row?.inUse : '---',
                storageType: row.storageType !== null ? row.storageType : '---',
                createdByPerson: row.createdByPerson !== null ? row.createdByPerson : '---',
                createdOn: row.createdOn !== null ? row.createdOn : '---',
                availableSpace: row.availableSpace !== null ? row.availableSpace : '---',
                barcodeId: row.barcodeId,
                mapId: row.mapId,
              };
            }
          });
          // setDataRows(result);
          // console.log('resData', result);
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: result || [],
            total: response.data.data.object.totalElements || 0,
          }));
          setDataRows1(result);

          toast.success(response.data.data.message, {
            position: 'bottom-left',
            autoClose: 2000,
            theme: 'light',
          });
        } else if (response.data.data.object !== null && response.data.data.object.targetElement == null) {
          const result = response.data.data.object.data;
          result.map((row) => ({
            entityName: row.entityName !== null ? row.entityName : '---',
            totalSpace: row.totalSpace !== null ? row.totalSpace : '---',
            storageCap: row?.storageCap !== null ? row?.storageCap : '---',
            inUse: row?.inUse !== null ? row?.inUse : '---',
            storageType: row.storageType !== null ? row.storageType : '---',
            createdByPerson: row.createdByPerson !== null ? row.createdByPerson : '---',
            createdOn: row.createdOn !== null ? row.createdOn : '---',
            availableSpace: row.availableSpace !== null ? row.availableSpace : '---',
            barcodeId: row.barcodeId,
            mapId: row.mapId,
          }));
          // setDataRows(result);
          // console.log('resData', result);
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: result || [],
            total: response.data.data.object.totalElements || 0,
          }));
          setDataRows1(result);

          toast.success(response.data.data.message, {
            position: 'bottom-left',
            autoClose: 2000,
            theme: 'light',
          });
        } else {
          setDataRows([]);
        }

        setLoader(false);
      } catch (err) {
        setLoader(false);
      }
    }

    if (payload.pageNo !== 0) {
      const mapId = null;
      try {
        setLoader(true);
        const response = await fetchSubEntitiesForLayout(layoutId, defId, mapId, payload);

        if (response.data.data.object !== null) {
          const result = response.data.data.object.data;
          result.map((row) => ({
            entityName: row.entityName !== null ? row.entityName : '---',
            totalSpace: row.totalSpace !== null ? row.totalSpace : '---',
            storageCap: row?.storageCap !== null ? row?.storageCap : '---',
            inUse: row?.inUse !== null ? row?.inUse : '---',
            storageType: row.storageType !== null ? row.storageType : '---',
            createdByPerson: row.createdByPerson !== null ? row.createdByPerson : '---',
            createdOn: row.createdOn !== null ? row.createdOn : '---',
            availableSpace: row.availableSpace !== null ? row.availableSpace : '---',
            barcodeId: row.barcodeId,
            mapId: row.mapId,
          }));
          // setDataRows(result);
          // console.log('resData', result);
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: result || [],
            total: response.data.data.object.totalElements || 0,
          }));
          setDataRows1(result);

          toast.success(response.data.data.message, {
            position: 'bottom-left',
            autoClose: 2000,
            theme: 'light',
          });
        } else {
          setDataRows([]);
        }

        setLoader(false);
      } catch (err) {
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    fetchSubEntities();
  }, [pageState.page, pageState.pageSize]);

  const handleUpdate = () => {
    // const newData = [...dataRows];
    const newData = [...pageState.datRows];
    for (let i = 0; i < newData.length; i++) {
      const row = newData[i];
      if (row.entityName === '') {
        //
        toast.warning(`Please fill entityName for row ${i + 1}`, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        return;
      }
      if (row.totalSpace === '') {
        //
        toast.warning(`Please fill totalSpace for row ${i + 1}`, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        return;
      }
      if (row.storageType === '') {
        //
        toast.warning(`Please fill storageType for row ${i + 1}`, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        return;
      }
      if (row.inUse == false && row.storageCap == true) {
        toast.warning(`Please select In Use for row ${i + 1}`, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        return;
      }
    }

    const updatedDataList = [...pageState.datRows].map((item) => ({
      mapId: item.mapId,
      entityName: item.entityName,
      totalSpace: item.totalSpace,
      storageCap: item.storageCap,
      inUse: item.inUse,
    }));

    const finalPayload = {
      userId: uidx,
      updateModelList: updatedDataList,
    };

    setUpdateLoader(true);
    layoutSubEntitiesBulkUpdate(finalPayload)
      .then((res) => {
        setUpdateLoader(false);
        const dataSet = [...pageState.datRows].filter((item) => item.inUse == true);
        // console.log(('updatedDataSet', dataSet));
        setPageState((prev) => {
          return {
            ...prev,
            datRows: dataSet,
          };
        });
        setDataRows1(dataSet);
        setEdit(false);
        toast.success(res.data.data.message, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        // setTimelineerror('success');
        // setAlertmessage(res.data.data.message);
        // setOpensnack(true);
        // console.log('bulkUpdate', res);
      })
      .catch((err) => {
        setUpdateLoader(false);
      });
  };

  // useEffect(() => {
  //   window.addEventListener('keydown', function (e) {
  //     if (e.key === 'Space') {
  //       e.preventDefault();
  //     }
  //   });

  //   return () => {
  //     window.addEventListener('keydown', function (e) {
  //       if (e.key === 'Space') {
  //         e.preventDefault();
  //       }
  //     });
  //   };
  // }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>

      <Box className="edit-layout-box">
        <Box className="edit-cancel-update">
          <SoftButton
            sx={{
              marginRight: '2rem',
              cursor: 'pointer',
            }}
            color="info"
            onClick={handleEdit}
          >
            Edit
          </SoftButton>
          <SoftButton
            sx={{
              marginRight: '2rem',
              cursor: 'pointer',
            }}
            onClick={handleCancel}
          >
            Cancel
          </SoftButton>
          {updateLoader ? (
            <Spinner />
          ) : (
            <SoftButton
              sx={{
                marginRight: '2rem',
                cursor: 'pointer',
              }}
              color="info"
              onClick={handleUpdate}
              disabled={edit == false ? true : false}
            >
              Update
            </SoftButton>
          )}
        </Box>
        {loader && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Spinner />
          </Box>
        )}
        <SoftBox
          py={1}
          sx={{
            marginTop: '2rem',
          }}
        >
          <div style={{ height: 525, width: '100%' }}>
            {!loader && pageState.datRows?.length == 0 ? (
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>
                <h3 className="no-data-text-I">NO DATA FOUND</h3>
              </SoftBox>
            ) : (
              pageState.datRows.length > 0 &&
              !loader && (
                <SoftBox
                  py={0}
                  px={0}
                  style={{ height: 525, minWidth: '900px' }}
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
                    rows={pageState.datRows}
                    columns={columns}
                    className="data-grid-table-boxo"
                    pagination
                    page={pageState.page - 1}
                    pageSize={pageState.pageSize}
                    rowCount={parseInt(pageState.total)}
                    paginationMode="server"
                    onPageChange={(newPage) => {
                      setPageState((old) => ({ ...old, page: newPage + 1 }));
                    }}
                    onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                    getRowId={(row) => row.barcodeId}
                    disableSelectionOnClick
                  />
                </SoftBox>
              )
            )}
          </div>
        </SoftBox>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </DashboardLayout>
  );
};

export default EditLayoutComponents;
