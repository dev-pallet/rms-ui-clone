import { Autocomplete, Box, Button, Container, Divider, Menu, MenuItem, Modal, TextField } from '@mui/material';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { DataGrid } from '@mui/x-data-grid';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { buttonStyles } from '../../Common/buttonColor';
import {
  createMarkDownPriceEdit,
  createMarkUpPriceEdit,
  deleteMarginpriceEditLabel,
  getCategoriesBulkPriceEdit,
  getMasterPriceDetails,
  markUDownListAffectingCount,
  markUpListAffectingCount,
  markdownApplyLater,
  markupApplyLater,
} from '../../../../config/Services';
import { makeStyles } from '@material-ui/core';
import { textFormatter } from '../../Common/CommonFunction';
import FormField from '../../purchase-bills/components/FormField';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';
import UpgradePlan from '../../../../UpgardePlan';

const useStyles = makeStyles({
  dataGridContainer: {
    borderRadius: '8px', // Add a border radius
    fontFamily: 'Arial, sans-serif', // Set a font family
  },
  dataGrid: {
    '& .MuiDataGrid-root': {
      border: '1px solid #ddd',
      borderRadius: '8px', // Add a border radius
    },
    '& .MuiDataGrid-columnsContainer': {
      backgroundColor: '#ebf0ec',
      color: 'white',
      borderRadius: '8px', // Add a border radius
    },
    '& .MuiDataGrid-cell': {
      padding: '8px',
    },
    '& .MuiDataGrid-row': {
      backgroundColor: '#fafafa',
      '&:hover': {
        backgroundColor: 'rgba(173, 216, 230, 0.5)', // Change background on hover
      },
    },
    '& .MuiDataGrid-footerContainer': {
      display: 'none', // Hide the footer for this specific DataGrid
    },
  },
});

const MasterPriceEditDetails = ({ onMasterChange  , markUplogs , markDownlogs , markDownpg , reloadTable , setReloadTable , masterLogPagination , setMasterLogPagination}) => {
  const featureSettings = JSON.parse(localStorage.getItem('featureSettings'));

  const locId = localStorage.getItem('locId');
  const classes = useStyles();
  const orgId = localStorage.getItem('orgId');
  const user = localStorage.getItem('user_name');
  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const [categoriesList, setCategoriesList] = useState([]);
  const [customCategory, setCustomCategory] = useState([]);
  const [currMarginValue, setCurrMarginValue] = useState('');
  const [updatedMargin, setUpdatedMargin] = useState('');
  const [open, setOpen] = React.useState(false);
  const [markdownopen, setMarkDownOpen] = useState(false);
  const [saveEditRow, setSaveEditRow] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);
  const markUpOpen = Boolean(anchorMarkupEl);
  const optionsOpen = Boolean(anchorEl);
  const [selectedOptions, setSelectedOptions] = useState('applyNow');
  const [markupAffectedCountData, setMarkupAffectedCountData] = useState([]);
  const [markdownAffectedCountData, setMarkdownAffectedCountData] = useState([]);
  const [confirmSaveBtn, setConfirmSaveBtn] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setConfirmSaveBtn(false);
    setMarkupAffectedCountData([]);
    setOpen(false);
    setShowSpinner(false);
  };
  const handleCloseOp = () => {
    setAnchorEl(null);
  };

  const handleClickOpenMD = () => {
    setMarkDownOpen(true);
  };

  const handleCloseMD = () => {
    setConfirmSaveBtn(false);
    setMarkDownOpen(false);
    setMarkdownAffectedCountData([]);
  };

  const handleOptionChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const getAllCategories = () => {
    getCategoriesBulkPriceEdit(locId)
      .then((res) => {
        const category = res.data.data.data;
        const categoryList = category.map((item) => {
          return {
            value: item,
            label: item,
          };
        });
        setCategoriesList(categoryList);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const saveMarkDownPriceEdit = (data) => {
    const payload = [
      {
        mplId: data?.MPLID,
        locationId: locId,
        orgId: orgId,
        margin: data?.Margin && data.Margin.includes(' ') ? data.Margin.split(' ')[0] : data?.Margin,
        createdBy: createdById,
        minMargin: data?.minMargin,
        maxMargin: data?.maxMargin,
        marginType: '%',
        marginBasedOn: 'mrp',
        createdBy: createdById,
        createdByName: user,
        labelInUse: true,
      },
    ];
    createMarkDownPriceEdit(payload)
      .then((res) => {
        setConfirmSaveBtn(false);
        setReloadTable(!reloadTable);
      })
      .catch((err) => {});
  };

  const saveMarkDownAffectingCount = (data) => {
    setConfirmSaveBtn(true);
    const payload = [
      {
        mplId: data?.MPLID,
        locationId: locId,
        orgId: orgId,
        margin: data?.Margin && data.Margin.includes(' ') ? data.Margin.split(' ')[0] : data?.Margin,
        createdBy: createdById,
        minMargin: data?.minMargin,
        maxMargin: data?.maxMargin,
        marginType: '%',
        marginBasedOn: 'mrp',
        createdBy: createdById,
        createdByName: user,
        labelInUse: true,
      },
    ];
    markUDownListAffectingCount(payload)
      .then((res) => {
        const transformedData = res.data.data.data.map((item) => ({
          totalProducts: item.totalProducts,
          totalBatches: item.totalBatches,
          margin: item.margin,
          minMargin: item.minMargin,
          maxMargin: item.maxMargin,
        }));
        setMarkdownAffectedCountData(transformedData);
      })
      .catch((err) => {});
  };
  const editMarkDownPrice = (data) => {
    setShowSpinner(true);
    const payload = [
      {
        mplId: data?.MPLID,
        locationId: locId,
        orgId: orgId,
        margin: data?.Margin && data.Margin.includes(' ') ? data.Margin.split(' ')[0] : data?.Margin,
        createdBy: createdById,
        minMargin: data?.minMargin,
        maxMargin: data?.maxMargin,
        marginType: '%',
        marginBasedOn: 'mrp',
        createdBy: createdById,
        modifiedBy: createdById,
        createdByName: user,
        labelInUse: true,
      },
    ];
    createMarkDownPriceEdit(payload)
      .then((res) => {
        handleCloseMD();
        setReloadTable(!reloadTable);
        setConfirmSaveBtn(false);
        setMarkdownAffectedCountData([]);
        setShowSpinner(false);
      })
      .catch((err) => {});
  };
  const editMarkUpPrice = (data) => {
    setShowSpinner(true);
    const payloaddata = [
      {
        mplId: data?.MPLID,
        locationId: locId,
        orgId: orgId,
        marginType: '%',
        marginBasedOn: 'pp',
        margin: updatedMargin ? updatedMargin : currMarginValue,
        createdBy: createdById,
        modifiedBy: createdById,
        createdByName: user,
        labelInUse: true,
        categories: customCategory?.map((item) => item.value),
      },
    ];
    createMarkUpPriceEdit(payloaddata)
      .then((res) => {
        handleClose();
        setReloadTable(!reloadTable);
        // setConfirmSaveBtn(false);
        setMarkupAffectedCountData([]);
        setShowSpinner(false);
      })
      .catch((err) => {});
  };
  const saveMarkUpPriceEdit = (data) => {
    setShowSpinner(true);

    const payloaddata = [
      {
        mplId: data?.MPLID,
        locationId: locId,
        orgId: orgId,
        marginType: '%',
        marginBasedOn: 'pp',
        margin: data?.Margin && data.Margin.includes(' ') ? data.Margin.split(' ')[0] : data?.Margin,
        createdBy: createdById,
        createdByName: user,
        labelInUse: true,
        categories: data?.Categories?.split(' , '),
      },
    ];
    createMarkUpPriceEdit(payloaddata)
      .then((res) => {
        setReloadTable(!reloadTable);
        setConfirmSaveBtn(false);
        setShowSpinner(false);
      })
      .catch((err) => {});
  };

  const saveMarkUpAffectingCount = (data) => {
    setConfirmSaveBtn(true);

    const payloaddata = [
      {
        mplId: data?.MPLID,
        locationId: locId,
        orgId: orgId,
        marginType: '%',
        marginBasedOn: 'pp',
        margin: data?.Margin && data.Margin.includes(' ') ? data.Margin.split(' ')[0] : data?.Margin,
        createdBy: createdById,
        createdByName: user,
        labelInUse: true,
        categories: customCategory?.map((item) => item.value),
      },
    ];
    markUpListAffectingCount(payloaddata)
      .then((res) => {
        const categoryData = res.data.data.data.map((item) => ({
          category: item.categories.join(' '),
          totalProducts: item.totalProducts,
          totalBatches: item.totalBatches,
        }));
        setMarkupAffectedCountData(categoryData);
      })
      .catch((err) => {});
  };

  const saveMarkdownApply = (data) => {
    setShowSpinner(true);

    const payload = [
      {
        mplId: data?.MPLID,
        locationId: locId,
        orgId: orgId,
        margin: data.Margin,
        minMargin: data.minMargin,
        maxMargin: data.maxMargin,
        marginType: '%',
        marginBasedOn: 'mrp',
        createdBy: createdById,
        modifiedBy: createdById,
        createdByName: user,
        labelInUse: false,
      },
    ];
    markdownApplyLater(payload)
      .then((res) => {
        handleCloseMD();
        setReloadTable(!reloadTable);
        setMarkdownAffectedCountData([]);
        setShowSpinner(false);
      })
      .catch((err) => {});
  };

  const saveMarkUpApply = (data) => {
    setShowSpinner(true);

    const payload = [
      {
        mplId: data?.MPLID,
        locationId: locId,
        orgId: orgId,
        marginType: '%',
        marginBasedOn: 'pp',
        margin: updatedMargin ? updatedMargin : currMarginValue,
        createdBy: createdById,
        modifiedBy: createdById,
        createdByName: user,
        categories: customCategory?.map((item) => item.value),
        labelInUse: false,
      },
    ];

    markupApplyLater(payload)
      .then((res) => {
        handleClose();
        setReloadTable(!reloadTable);
        setShowSpinner(false);
      })
      .catch((err) => {});
  };
  const deletePriceEdit = (id) => {
    deleteMarginpriceEditLabel(id)
      .then((res) => {
        setReloadTable(!reloadTable);
        setMarkupAffectedCountData([]);
      })
      .catch((err) => {});
  };

  const handleSetCategories = (data) => {
    const catData = data?.split(' , ');
    const resultArray = catData.map((item) => ({
      value: item,
      label: item,
    }));
    setCustomCategory(resultArray);
  };

  const handleClick = (event, item) => {
    setAnchorEl(event.currentTarget);
  };

  const markUpColumns = [
    {
      field: 'MPLID',
      headerName: 'Pricing ID',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'Categories',
      headerName: 'Categories',
      flex: 1,
      minWidth: 120,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'Margin',
      headerName: 'Mark Up Margin',
      flex: 1,
      minWidth: 40,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'AffectedCount',
      headerName: 'Total Products',
      flex: 1,
      minWidth: 40,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'ModifiedOn',
      headerName: 'Last Modified',
      // flex: 1,
      minWidth: 180,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'edit',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 90,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.edit ? (
          <Button></Button>
        ) : (
          <SoftButton
            // style={{
            //   backgroundColor: '#4caf50',
            //   color: 'white',
            //   border: 'none',
            //   borderRadius: '5px',
            //   cursor: 'pointer',
            // }}
            variant={buttonStyles.primaryVariant}
            className="contained-softbutton btnInsideTable"
            onClick={() => saveMarkUpPriceEdit(params?.row)}
          >
            Apply
          </SoftButton>
        );
      },
    },
    // {
    //   field: 'editbtn',
    //   headerName: '',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   width: 90,
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   renderCell: (params) => {
    //     return (
    //       <Button
    //         onClick={() => {
    //           handleClickOpen();
    //           setCurrMarginValue(params?.row?.Margin);
    //           setSaveEditRow(params?.row);
    //           handleSetCategories(params?.row?.Categories);
    //         }}
    //       >
    //         {' '}
    //         Edit
    //       </Button>
    //     );
    //   },
    // },
    // {
    //   field: 'delete',
    //   headerName: '',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   width: 90,
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   renderCell: (params) => {
    //     return <Button onClick={() => deletePriceEdit(params?.row?.MPLID)}>Delete</Button>;
    //   },
    // },
    {
      field: 'delete',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 90,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const handleClick = (event) => {
          setAnchorMarkupEl(event.currentTarget);
          setCurrMarginValue(params?.row?.Margin);
          setSaveEditRow(params?.row);
          handleSetCategories(params?.row?.Categories);
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
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
              <MoreVertRoundedIcon sx={{ fontSize: '14px' }} />
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
                <SoftButton
                  // style={{
                  //   backgroundColor: '#7c86de',
                  //   color: 'white',
                  //   border: 'none',
                  //   borderRadius: '5px',
                  //   cursor: 'pointer',
                  //   width: '100%',
                  // }}
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton editDeleteButton"
                  onClick={() => {
                    handleClickOpen();
                    handleCloseOp();
                  }}
                >
                  Edit
                </SoftButton>
              </MenuItem>
              <MenuItem>
                <SoftButton
                  // style={{
                  //   backgroundColor: '#ff0000',
                  //   color: 'white',
                  //   border: 'none',
                  //   borderRadius: '5px',
                  //   cursor: 'pointer',
                  //   width: '100%',
                  // }}
                  variant={buttonStyles.outlinedColor}
                  className="outlined-softbutton editDeleteButton"
                  onClick={() => {
                    deletePriceEdit(saveEditRow?.MPLID);
                    handleCloseOp();
                  }}
                >
                  Delete
                </SoftButton>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  const markDownColumns = [
    {
      field: 'MPLID',
      headerName: 'Pricing ID',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    // {
    //   field: 'purchaseMargin',
    //   headerName: 'Purchase Margin',
    //   flex: 1,
    //   minWidth: 50,
    //   cellClassName: 'datagrid-rows',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   align: 'left',
    // },
    // {
    //   field: 'markDownMargin ',
    //   headerName: 'Mark Down Margin',
    //   flex: 1,
    //   minWidth: 50,
    //   cellClassName: 'datagrid-rows',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   align: 'left',
    // },
    {
      field: 'minMargin',
      headerName: 'Min Margin',
      flex: 1,
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'maxMargin',
      headerName: 'Max Margin',
      flex: 1,
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'Margin',
      headerName: 'Mark Down Margin',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'AffectedCount',
      headerName: 'Total Products',
      flex: 1,
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },

    {
      field: 'ModifiedOn',
      headerName: 'Last Modified',
      // flex: 1,
      minWidth: 180,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    // {
    //   field: 'UnderLabelRange',
    //   headerName: 'Under Label Range',
    //   flex: 1,
    //   minWidth: 130,
    //   cellClassName: 'datagrid-rows',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   align: 'left',
    // },
    {
      field: 'edit',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 90,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return params?.row?.edit ? (
          <Button></Button>
        ) : (
          <SoftButton
            // style={{
            //   backgroundColor: '#4caf50',
            //   color: 'white',
            //   border: 'none',
            //   borderRadius: '5px',
            //   cursor: 'pointer',
            // }}
            variant={buttonStyles.primaryVariant}
            className="contained-softbutton btnInsideTable"
            onClick={() => saveMarkDownPriceEdit(params?.row)}
          >
            Apply
          </SoftButton>
        );
      },
    },
    {
      field: 'delete',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 90,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const handleClick = (event) => {
          // handleClickOpenMD();
          setCurrMarginValue(params.row.Margin);
          setSaveEditRow(params.row);
          setAnchorEl(event.currentTarget);
        };

        const handleCloseOp = () => {
          setAnchorEl(null);
        };

        return (
          <div>
            <Button
              id="basic-button"
              aria-controls={optionsOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={optionsOpen ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertRoundedIcon sx={{ fontSize: '14px' }} />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={optionsOpen}
              onClose={handleCloseOp}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem>
                <SoftButton
                  // style={{
                  //   backgroundColor: '#7c86de',
                  //   color: 'white',
                  //   border: 'none',
                  //   borderRadius: '5px',
                  //   cursor: 'pointer',
                  //   width: '100%',
                  // }}
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton editDeleteButton"
                  onClick={() => {
                    handleClickOpenMD();
                    // setCurrMarginValue(params.row.Margin);
                    // setSaveEditRow(params.row);
                    handleCloseOp();
                  }}
                >
                  Edit
                </SoftButton>
              </MenuItem>
              <MenuItem>
                <SoftButton
                  // style={{
                  //   backgroundColor: '#ff0000',
                  //   color: 'white',
                  //   border: 'none',
                  //   borderRadius: '5px',
                  //   cursor: 'pointer',
                  //   width: '100%',
                  // }}
                  variant={buttonStyles.outlinedColor}
                  className="outlined-softbutton editDeleteButton"
                  onClick={() => {
                    deletePriceEdit(saveEditRow?.MPLID);
                    handleCloseOp();
                  }}
                >
                  Delete
                </SoftButton>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  const handleMinMarginChange = (e) => {
    const newValue = e.target.value;
    setSaveEditRow((prevState) => ({
      ...prevState,
      minMargin: newValue,
    }));
  };
  const handleMaxMarginChange = (e) => {
    const newValue = e.target.value;
    setSaveEditRow((prevState) => ({
      ...prevState,
      maxMargin: newValue,
    }));
  };

  const handleMarginChange = (e) => {
    const newValue = e.target.value;
    setSaveEditRow((prevState) => ({
      ...prevState,
      Margin: newValue,
    }));
  };

  useEffect(() => {
    const marginType1 = 'MARK UP';

    getMasterPriceDetails(locId, marginType1)
      .then((res) => {
        const formattedRows = res?.data?.data?.data?.data?.map((item) => ({
          MPLID: item.mplId,
          ModifiedOn: item.modifiedOn
            ? new Date(item.modifiedOn).toLocaleString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'NA',
          Categories: textFormatter(item.categories.join(' , ')),
          Margin: `${item.margin}`,
          AffectedCount: item.affectedCount,
          edit: item.labelInUse,
          delete: '',
          editbtn: '',
        }));
        setMarkuplogs(formattedRows || []);
      })
      .catch((err) => {});
    const marginType2 = 'MARK DOWN';
    getMasterPriceDetails(locId, marginType2)
      .then((res) => {
        setMarkDownpg(res?.data?.data?.data?.totalResult);
        const formattedRows = res?.data?.data?.data?.data?.map((item) => ({
          MPLID: item.mplId,
          ModifiedOn: item.modifiedOn
            ? new Date(item.modifiedOn).toLocaleString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'NA',
          minMargin: item.minMargin,
          maxMargin: item.maxMargin,
          Margin: `${item.margin}`,
          AffectedCount: item.affectedCount,
          purchaseMargin: item.purchaseMargin ? item.purchaseMargin : 'NA',
          markDownMargin: item.markDownMargin ? item.markDownMargin : 'NA',
          affectedProducts: '',
          UnderLabelRange: '',
          edit: item.labelInUse,
          delete: '',
          editbtn: '',
        }));

        // const affectingCountPayload = {
        //   locationId: locId,
        //   orgId: orgId,
        //   labelId: res?.data?.data?.data?.data?.map((item) => item.mplId)?.flat() || 'NA',
        // };

        // getMarkDownAffectingCount(affectingCountPayload)
        //   .then((res) => {
        //     const labelIdToAffectingCountMap = {};
        //     res?.data?.data?.data?.forEach((item) => {
        //       labelIdToAffectingCountMap[item.labelId] = {
        //         affectedProducts: item.affectedProducts ,
        //         UnderLabelRange: item.productsUnderLabelRange,
        //       };
        //     });

        //     formattedRows.forEach((row) => {
        //       const affectingCount = labelIdToAffectingCountMap[row.MPLID];
        //       if (affectingCount) {
        //         row.affectedProducts = affectingCount.affectedProducts;
        //         row.UnderLabelRange = affectingCount.UnderLabelRange;
        //       }
        //     });
        //   })
        //   .catch((err) => {});
        setMarkDownLogs(formattedRows || []);
      })
      .catch((err) => {});
  }, [reloadTable]);

  const markDownSaveCreate = () => {
    if (selectedOptions === 'applyNow') {
      editMarkDownPrice(saveEditRow);
    } else if (selectedOptions === 'applyLater') {
      saveMarkdownApply(saveEditRow);
    }
    setConfirmSaveBtn(false);
  };
  const markUpSaveCreate = () => {
    if (selectedOptions === 'applyNow') {
      editMarkUpPrice(saveEditRow);
    } else if (selectedOptions === 'applyLater') {
      saveMarkUpApply(saveEditRow);
    }
    setConfirmSaveBtn(false);
  };

  
  const handlePageChange = (logType, page) => {
    setMasterLogPagination((prev) => ({
      ...prev,
      [logType]: { ...prev[logType], page: page + 1 }
    }));
  };

  return (
    <Container>
      <div>
        <Modal
          open={open}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <Box
            sx={{
              backgroundColor: '#FFF',
              maxWidth: '550px',
              top: '35%',
              top: '20%',
              position: 'relative',
              padding: '15px',
              borderRadius: '8px',
              maxHeight: '500px',
              overflow: 'scroll',
            }}
            margin={'auto'}
          >
            {/* <DialogTitle></DialogTitle> */}
            <Box>
              <SoftBox style={{ display: 'flex', gap: '15px', zIndex: '10 !important' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '50%', marginLeft: '15px' }}>
                  <SoftTypography htmlFor="status" style={{ fontSize: '0.9rem', marginBottom: '3px' }}>
                    Category
                  </SoftTypography>

                  {/* <SoftSelect
                    // menuPortalTarget={document.body}
                    placeholder="Select Categories"
                    options={categoriesList}
                    isMulti={true}
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e)}
                    style={{ width: '300px !important', marginRight: '10px' }}
                  /> */}
                  <Autocomplete
                    multiple
                    options={categoriesList}
                    // onChange={(selectedOptions, newvalue) => handleSelectCategory(newvalue, index)}
                    onChange={(e, v) => setCustomCategory(v)}
                    // value={selectedCategoryOptionsList[index]}
                    value={customCategory}
                    getOptionLabel={(option) => option.label}
                    // customCategory
                    renderInput={(params) => <TextField {...params} placeholder="Select Categories" />}
                  />
                </div>
                <SoftBox style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem' }}>
                  <FormField
                    margin="dense"
                    label={'MarkUp value'}
                    // type="number"
                    icon={{
                      component: '%',
                      direction: 'right',
                    }}
                    value={updatedMargin ? updatedMargin : currMarginValue}
                    // value={rowValues[index]}
                    onChange={(e) => {
                      setUpdatedMargin(e.target.value);
                      setCurrMarginValue(e.target.value);
                    }}
                    maxWidth="sm"
                    fullWidth
                    style={{ maxWidth: '200px' }}
                    required
                  />
                </SoftBox>
              </SoftBox>
            </Box>
            {markupAffectedCountData && markupAffectedCountData.length > 0 && (
              <SoftBox
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  padding: '5px',
                  margin: '15px',
                  borderRadius: '8px',
                }}
              >
                <SoftTypography style={{ fontSize: '0.9rem' }}>
                  There will be {markupAffectedCountData[0]?.totalProducts} products of{' '}
                  {markupAffectedCountData[0]?.totalBatches} Batches Affected,
                  <br />
                  Confirm to Proceed for category:{' '}
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: '#242625',
                      padding: '5px 10px',
                      borderRadius: '5px',
                    }}
                  >
                    {markupAffectedCountData[0]?.category}
                  </span>
                </SoftTypography>
              </SoftBox>
            )}

            <SoftBox style={{ backgroundColor: '#f5f5f5', margin: '15px', borderRadius: '8px', padding: '10px' }}>
              <RadioGroup
                // value={selectedOptions[index] || 'applyNow'}
                onChange={(event) => handleOptionChange(event)}
                row
                style={{ display: 'flex', justifyContent: 'space-around' }}
              >
                <FormControlLabel value="applyNow" control={<Radio color="primary" />} label="Apply now" />
                <FormControlLabel value="applyLater" control={<Radio color="primary" />} label="Apply later" />
              </RadioGroup>
            </SoftBox>

            {/* <DialogActions> */}
            <SoftBox style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px', gap: '1rem' }}>
              <SoftButton variant={buttonStyles.outlinedColor} className="outlined-softbutton" onClick={handleClose}>
                Cancel
              </SoftButton>
              {confirmSaveBtn ? (
                showSpinner ? (
                  <Spinner size={'1.3rem'} />
                ) : (
                  <SoftButton
                    variant={buttonStyles.primaryVariant}
                    className="contained-softbutton"
                    onClick={markUpSaveCreate}
                    disabled={showSpinner}
                  >
                    Apply
                  </SoftButton>
                )
              ) : (
                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton"
                  onClick={() => saveMarkUpAffectingCount(saveEditRow)}
                  disabled={showSpinner}
                >
                  Save
                </SoftButton>
              )}
            </SoftBox>

            {/* </DialogActions> */}
          </Box>
        </Modal>
      </div>

      <div>
        <Modal
          open={markdownopen}
          // TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseMD}
          aria-describedby="alert-dialog-slide-description"
        >
          <Box
            sx={{
              backgroundColor: '#FFF',
              maxWidth: '550px',
              top: '35%',
              position: 'relative',
              padding: '15px',
              borderRadius: '8px',
            }}
            margin={'auto'}
          >
            {/* <DialogTitle></DialogTitle> */}
            <Box>
              <SoftBox style={{ display: 'flex', gap: '15px', zIndex: '10 !important' }}>
                <SoftBox style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem' }}>
                  <FormField
                    margin="dense"
                    label={'min margin'}
                    // type="number"
                    icon={{
                      component: '%',
                      direction: 'right',
                    }}
                    value={saveEditRow?.minMargin}
                    // value={rowValues[index]}
                    onChange={(e) => {
                      handleMinMarginChange(e);
                    }}
                    maxWidth="sm"
                    fullWidth
                    style={{ maxWidth: '200px' }}
                    required
                  />
                </SoftBox>
                <SoftBox style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem' }}>
                  <FormField
                    margin="dense"
                    label={'max margin'}
                    // type="number"
                    icon={{
                      component: '%',
                      direction: 'right',
                    }}
                    value={saveEditRow?.maxMargin}
                    onChange={(e) => {
                      handleMaxMarginChange(e);
                    }}
                    maxWidth="sm"
                    fullWidth
                    style={{ maxWidth: '200px' }}
                    required
                  />
                </SoftBox>
                <SoftBox style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem' }}>
                  <FormField
                    margin="dense"
                    label={'Margin'}
                    // type="number"
                    icon={{
                      component: '%',
                      direction: 'right',
                    }}
                    value={saveEditRow?.Margin}
                    // value={rowValues[index]}
                    onChange={(e) => {
                      handleMarginChange(e);
                    }}
                    maxWidth="sm"
                    fullWidth
                    style={{ maxWidth: '200px' }}
                    required
                  />
                </SoftBox>
              </SoftBox>
            </Box>
            <br />
            {markdownAffectedCountData && markdownAffectedCountData.length > 0 && (
              <SoftBox
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  padding: '5px',
                  margin: '15px',
                  borderRadius: '8px',
                }}
              >
                {' '}
                <SoftTypography style={{ fontSize: '0.9rem' }}>
                  There will be {markdownAffectedCountData[0]?.totalProducts} Products and{' '}
                  {markdownAffectedCountData[0]?.totalBatches} Batches for Margin:{' '}
                  {markdownAffectedCountData[0]?.minMargin}-{markdownAffectedCountData[0]?.maxMargin},
                  <br />
                  with Updated Margin: {markdownAffectedCountData[0]?.margin}
                </SoftTypography>
              </SoftBox>
            )}

            <SoftBox style={{ backgroundColor: '#f5f5f5', margin: '15px', borderRadius: '8px', padding: '10px' }}>
              <RadioGroup
                // value={selectedOptions[index] || 'applyNow'}
                onChange={(event) => handleOptionChange(event)}
                row
                style={{ display: 'flex', justifyContent: 'space-around' }}
              >
                <FormControlLabel value="applyNow" control={<Radio color="primary" />} label="Apply now" />
                <FormControlLabel value="applyLater" control={<Radio color="primary" />} label="Apply later" />
              </RadioGroup>
            </SoftBox>
            {/* <DialogActions> */}
            <SoftBox style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px', gap: '1rem' }}>
              <SoftButton variant={buttonStyles.outlinedColor} className="outlined-softbutton" onClick={handleCloseMD}>
                Cancel
              </SoftButton>

              {confirmSaveBtn ? (
                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton"
                  onClick={markDownSaveCreate}
                  disabled={showSpinner}
                >
                  Apply
                </SoftButton>
              ) : (
                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton"
                  onClick={() => saveMarkDownAffectingCount(saveEditRow)}
                  disabled={showSpinner}
                >
                  Save
                </SoftButton>
              )}
            </SoftBox>

            {/* </DialogActions> */}
          </Box>
        </Modal>
      </div>

      <SoftTypography style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Pricing Slabs</SoftTypography>
      <Divider sx={{ margin: 0, marginBottom: '10px' }} />
      <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
        <SoftTypography style={{ fontSize: '0.95rem', margin: '10px' }}>
          Mark Up (Based on Purchase Prices)
        </SoftTypography>
        {/* <SoftButton onClick={() => onMasterChange('MASTER')}>
          <EditIcon style={{ marginRight: '8px' }} /> Edit
        </SoftButton> */}
      </SoftBox>

      <div
        style={{
          height: featureSettings !== null && featureSettings['BULK_PRICE_EDIT'] == 'FALSE' ? 625 : null,
          width: '100%',
          position: 'relative',
        }}
      >
        {featureSettings !== null && featureSettings['BULK_PRICE_EDIT'] == 'FALSE' ? <UpgradePlan /> : null}
        <DataGrid
          rows={markUplogs}
          columns={markUpColumns}
          getRowId={(row) => row.MPLID}
          pageSize={10}
          paginationMode="server"
          rowCount={parseInt(masterLogPagination?.markUp?.totalResult || 0)}
          pagination
          autoHeight
          disableSelectionOnClick
          onPageChange={(params) => handlePageChange('markUp', params)}
        />
      </div>
      <br />
      <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px', marginTop: '2rem' }}>
        <SoftTypography style={{ fontSize: '0.95rem', margin: '10px' }}>Mark Down (Based on MRP)</SoftTypography>

        {/* <SoftButton onClick={() => onMasterChange('MASTER')}>
          <EditIcon style={{ marginRight: '8px' }} /> Edit
        </SoftButton> */}
      </SoftBox>

      <div
        style={{
          height: featureSettings !== null && featureSettings['BULK_PRICE_EDIT'] == 'FALSE' ? 625 : null,
          width: '100%',
          position: 'relative',
        }}
      >
        {featureSettings !== null && featureSettings['BULK_PRICE_EDIT'] == 'FALSE' ? <UpgradePlan /> : null}
        <DataGrid
          rows={markDownlogs}
          columns={markDownColumns}
          getRowId={(row) => row.MPLID}
          pageSize={10} // Increase page size by 1
          paginationMode="server"
          pagination
          rowCount={parseInt(masterLogPagination?.markDown?.totalResult || 0)}
          autoHeight
          disableSelectionOnClick
          onPageChange={(params) => handlePageChange('markDown', params)}
        />
      </div>
    </Container>
  );
};

export default MasterPriceEditDetails;
