import './add-hierarchy.css';
import { Grid } from '@mui/material';
import {
  createSubEntitiesHierarchyForLayout,
  fetchCreatedSubEntitiesForLayout,
  getCategoryForLayout,
  getSubEntitiesForLayout,
} from '../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import sideNavUpdate from '../../../../../components/Utility/sidenavupdate';

import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { injectStyle } from 'react-toastify/dist/inject-style';

const AddHierarchy = () => {
  sideNavUpdate();
  injectStyle();

  const navigate = useNavigate();
  if (localStorage.getItem('arrDefinitions') == undefined) {
    navigate('/setting/all-layouts');
  }
  const url = window.location.href;
  // const urlArr = url.split('/');
  // const defId = urlArr[urlArr.length - 1];
  // const component = urlArr[urlArr.length - 2];
  // const layoutId = urlArr[urlArr.length - 3];
  const defId = localStorage.getItem('definitionId');
  const component = localStorage.getItem('definitionName');
  const layoutId = localStorage.getItem('layout_id');

  const arrDefinitions = JSON.parse(localStorage.getItem('arrDefinitions'));
  let entityArrDef;
  if (arrDefinitions && arrDefinitions.length > 0) {
    entityArrDef = arrDefinitions.map((item) => ({
      value: '',
      label: item.definitionName,
    }));
  }

  //

  //

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [errorComing, setErrorComing] = useState(false);

  //snackbar
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const [loader, setLoader] = useState(false);
  const [valueEntity, setValueEntity] = useState(entityArrDef);
  const [mapSubEntity, setMapSubEntity] = useState(null);
  const [subEntities, setSubEntities] = useState([]);
  const [subEntityIndex, setSubEntityIndex] = useState('');
  const [savedComponents, setSavedComponents] = useState([]);
  const [totalSavedComponents, setTotalSavedComponents] = useState([]);
  const [mapId, setMapId] = useState(null);
  const [categories, setCategories] = useState('');
  const [newRow, setNewRow] = useState([
    {
      id: 1,
      entityName: '',
      totalSpace: '',
      storageType: '',
      inUse: false,
      storageCap: false,
    },
  ]);

  const handleAddRow = (a) => {
    setNewRow([
      ...newRow,
      {
        id: newRow[newRow.length - 1].id + a,
        entityName: '',
        totalSpace: '',
        storageType: '',
        inUse: false,
        storageCap: false,
      },
    ]);
  };
  const handleRemove = (payload) => {
    if (newRow.length > 1) {
      setNewRow([...newRow.filter((e) => e.id !== payload)]);
    }
  };

  const handleComponents = (item, index, option) => {
    //

    setSubEntityIndex(index);

    if (subEntities.length > 1 && subEntities.length - 1 == index) {
      setMapId(option);
      setMapSubEntity(null);
      return;
    } else if (subEntities.length == 1) {
      setMapSubEntity(option.value);
      const vaueSubEntitySelectOption = [...valueEntity];
      vaueSubEntitySelectOption[index] = option;
      setValueEntity(vaueSubEntitySelectOption);
      setMapId(option);
      setMapSubEntity(null);
      return;
    } else {
      setMapSubEntity(option.value);
      const vaueSubEntitySelectOption = [...valueEntity];
      vaueSubEntitySelectOption[index] = option;
      setValueEntity(vaueSubEntitySelectOption);
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const newRw = [...newRow];
    newRw[index][name] = value;
    newRw[index]['layoutId'] = layoutId;
    setNewRow(newRw);
  };

  const handleCheckBox = (e, index) => {
    const newRw = [...newRow];
    newRw[index]['inUse'] = e.target.checked;
    setNewRow(newRw);
  };

  const handleCheckBoxStorage = (e, index) => {
    const newRw = [...newRow];
    newRw[index]['storageCap'] = e.target.checked;
    setNewRow(newRw);
  };

  const handleSelectForCategory = (option, index) => {
    const newRw = [...newRow];
    newRw[index]['storageType'] = option.value;
    setNewRow(newRw);
  };

  const handleSave = () => {
    const newRw = [...newRow];
    for (let i = 0; i < newRw.length; i++) {
      const row = newRw[i];
      // if (row.entityName.trim() === '' || row.totalSpace.trim() === '' || row.storageType === '') {
      //
      //
      //   return;
      // }
      if (row.entityName === '') {
        toast.warning(`Please fill entityName for row ${i + 1}`, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        return;
      }
      if (row.totalSpace === '') {
        toast.warning(`Please fill totalSpace for row ${i + 1}`, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        return;
      }
      if (row.storageType === '') {
        toast.warning(`Please fill storageType for row ${i + 1}`, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        return;
      }
      if (row.inUse == false) {
        toast.warning(`Please select In Use for row ${i + 1}`, {
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

    // console.log('newRow', newRow);

    const finalEntityModelRelationModel = newRow.map((item) => ({
      ...item,
    }));

    finalEntityModelRelationModel.forEach((item) => {
      delete item.id;
    });

    // console.log('finalEntityModelRelationModel', finalEntityModelRelationModel);

    const payload = {
      userId: uidx,
      ownerId: locId,
      definitionId: defId,
      mapId: mapId == null ? null : mapId.value,
      entityModelRelationModel: finalEntityModelRelationModel,
    };
    //
    setLoader(true);
    createSubEntitiesHierarchyForLayout(payload)
      .then((res) => {
        setNewRow([
          {
            id: 1,
            entityName: '',
            totalSpace: '',
            storageType: '',
            inUse: false,
            storageCap: false,
          },
        ]);
        setLoader(false);
        // setTimelineerror('success');
        // setAlertmessage(res.data.data.message);
        // setOpensnack(true);
        toast.success(res.data.data.message, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        setTimeout(() => {
          navigate('/setting/layout/hierarchy');
        }, 1000);

        // /setting/layout/hierarchy
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const handleCancel = () => {
    navigate('/setting/layout/hierarchy');
  };

  const getSavedLayoutComponents = async () => {
    arrDefinitions.map(async (item, index) => {
      const defId = item.definitionId;
      try {
        const res = await getSubEntitiesForLayout(defId, layoutId);

        const subEntitiesdata = res.data.data.object.entityList.map((item) => ({
          value: item.mapId,
          label: item.entityName,
        }));
        const definitionId = res.data.data.object.definitionId;
        const typeName = res.data.data.object.typeName;
        const subEntitiesMessage = res.data.data.message;

        // if (typeName === 'BUILDING')
        if (index == 0) {
          setSubEntities((prev) => [
            ...prev,
            {
              list: [
                // {
                //   value: null,
                //   label: 'None',
                // },
                ...subEntitiesdata,
              ],
              definitionId: definitionId,
              typeName: typeName,
              message: subEntitiesMessage,
            },
          ]);
        } else {
          setSubEntities((prev) => [
            ...prev,
            {
              list: [],
              definitionId: definitionId,
              typeName: typeName,
              message: subEntitiesMessage,
            },
          ]);
        }
      } catch (err) {}
    });
  };

  // useEffect(() => {
  //   console.log('subEntities', subEntities);
  // }, [subEntities]);

  const fetchCategoryForLayout = () => {
    getCategoryForLayout()
      .then((res) => {
        //
        const response = res.data.data;
        const responseFilter = response
          .filter((item) => item.categoryName !== 'All Category')
          .map((item) => ({
            label: item.categoryName,
            value: item.categoryName,
          }));

        responseFilter.unshift({
          value: 'NOT DEFINED',
          label: 'NOT DEFINED',
        });
        setCategories(responseFilter);
      })
      .catch((err) => {});
  };

  const fetchSubEntities = async () => {
    const resp = await fetchCreatedSubEntitiesForLayout(layoutId, mapSubEntity);
    const result = resp.data.data.object;
    if (result.length) {
      const newSubEntities = [...subEntities];
      const index = subEntityIndex + 1;
      newSubEntities[index]['list'] = result.map((item) => ({
        value: item.mapId,
        label: item.entityName,
      }));
      //
      const valEntity = [...valueEntity];
      for (let i = subEntityIndex + 1; i < entityArrDef.length; i++) {
        valEntity[i] = entityArrDef[i];
      }
      for (let i = subEntityIndex + 2; i < newSubEntities.length; i++) {
        newSubEntities[i]['list'] = [];
        //
      }
      //
      setValueEntity(valEntity);
      setSubEntities(newSubEntities);
      const name2 = newSubEntities[index]['typeName'];
      // setTimelineerror('success');
      // setAlertmessage(resp.data.data.message + ` e.g. ` + ' ' + result.length + ` ${name2} found`);
      // setOpensnack(true);
      toast.success(resp.data.data.message + ' e.g. ' + ' ' + result.length + ` ${name2} found`, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
    } else {
      //
      const newSubEntities = [...subEntities];
      //
      const index = subEntityIndex + 1;
      newSubEntities[index]['list'] = result;
      for (let i = subEntityIndex + 2; i < newSubEntities.length; i++) {
        newSubEntities[i]['list'] = [];
        //
      }
      const name1 = newSubEntities[subEntityIndex]['typeName'];
      const name2 = newSubEntities[index]['typeName'];

      setMapId(null);
      setSubEntities(newSubEntities);
      // setTimelineerror('success');
      // setAlertmessage(resp.data.data.message + ` or add ${name2} to this ${name1}`);
      // setOpensnack(true);
      toast.success(resp.data.data.message + ` or add ${name2} to this ${name1}`, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      return;
    }
  };

  useEffect(() => {}, [mapId]);

  useEffect(() => {
    if (mapSubEntity !== null) {
      fetchSubEntities();
    }
  }, [mapSubEntity]);

  useEffect(() => {
    if (localStorage.getItem('arrDefinitions') == undefined) {
      navigate('/setting/all-layouts');
    }
  }, []);

  useEffect(() => {
    // console.log('subEntities', subEntities);
    // console.log('arrDefintions', arrDefinitions);
  }, [subEntities]);

  // useEffect(() => {
  //
  // }, [categories]);

  // useEffect(() => {
  //
  // }, [newRow]);

  useEffect(() => {
    fetchCategoryForLayout();
  }, []);
  useEffect(() => {
    if (localStorage.getItem('arrDefinitions') !== undefined) {
      getSavedLayoutComponents();
    }
  }, []);

  const handleUpdate = () => {
    navigate('/setting/layout-edit-component/');
  };

  useEffect(() => {}, [valueEntity]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
      <SoftBox
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          // alignItems: 'flex-end',
        }}
      >
        <SoftButton color="info" onClick={handleUpdate}>
          Edit your {component}
        </SoftButton>
      </SoftBox>

      <SoftBox
        className="top-box"
        sx={arrDefinitions && arrDefinitions.length ? { display: 'block' } : { display: 'none' }}
      >
        <Grid container spacing={3}>
          {subEntities
            .sort((a, b) => a.definitionId.localeCompare(b.definitionId))
            .map((item, index) => (
              <Grid item xs={12} md={3} lg={3} xl={4}>
                <SoftTypography
                  className="components-text"
                  // fontWeight="bold"
                >
                  {item.typeName}
                </SoftTypography>
                <SoftSelect
                  className="softselect-box"
                  value={item.list.length === 0 ? entityArrDef[index] : valueEntity[index]}
                  // value={valueEntity[index]}
                  placeholder={item.typeName}
                  options={item.list}
                  onChange={(option) => handleComponents(item, index, option)}
                />
              </Grid>
            ))}
        </Grid>
      </SoftBox>

      <SoftBox className="bottom-box">
        <SoftBox
          sx={{
            display: 'flex',
            justifyContent: 'center',
            margin: '1rem',
          }}
        >
          Create your {component}
        </SoftBox>

        <SoftBox
          sx={{
            overflow: 'auto',
            paddingBottom: '1rem',
          }}
        >
          {newRow.map((e, index) => (
            <Grid
              key={e.id}
              container
              spacing={4}
              sx={{
                marginTop: '1rem',
              }}
            >
              <Grid item xs={3} md={3} lg={3} xl={3}>
                <SoftBox className="flex-row-item">
                  <SoftTypography variant="caption" fontWeight="bold">
                    Entiy Name
                  </SoftTypography>
                  <SoftInput
                    placeholder={`e.g.: ${component}${index + 1}`}
                    name="entityName"
                    onChange={(e) => handleChange(e, index)}
                  />
                </SoftBox>
              </Grid>
              <Grid item xs={3} md={3} lg={3} xl={3}>
                <SoftBox className="flex-row-item">
                  <SoftTypography variant="caption" fontWeight="bold">
                    Total Space
                  </SoftTypography>
                  <SoftInput
                    placeholder="e.g: 9000"
                    name="totalSpace"
                    type="number"
                    onChange={(e) => handleChange(e, index)}
                  />
                </SoftBox>
              </Grid>
              <Grid item xs={3} md={3} lg={3} xl={3}>
                <SoftBox className="flex-row-item">
                  <SoftTypography variant="caption" fontWeight="bold">
                    Storage Type
                  </SoftTypography>
                  <SoftSelect
                    options={categories}
                    onChange={(option) => handleSelectForCategory(option, index)}
                    menuPortalTarget={document.body}
                  />
                </SoftBox>
              </Grid>
              <Grid item xs={0.9} md={0.9} lg={0.9} xl={0.9}>
                <SoftBox className="flex-row-item" id="in-use">
                  <SoftTypography variant="caption" fontWeight="bold">
                    In Use
                  </SoftTypography>
                  <Checkbox
                    size="large"
                    checked={e.inUse}
                    onChange={(e) => handleCheckBox(e, index)}
                    sx={{
                      height: '2.5rem',
                      width: '2.5rem',
                    }}
                  />
                </SoftBox>
              </Grid>
              <Grid item xs={0.9} md={0.9} lg={0.9} xl={0.9}>
                <SoftBox
                  className="flex-row-item"
                  sx={{
                    position: 'relative',
                    bottom: '1rem',
                  }}
                >
                  <SoftTypography variant="caption" fontWeight="bold">
                    For Storage
                  </SoftTypography>
                  <Checkbox
                    size="large"
                    checked={e.storageCap}
                    onChange={(e) => handleCheckBoxStorage(e, index)}
                    sx={{
                      height: '2.5rem',
                      width: '2.5rem',
                    }}
                  />
                </SoftBox>
              </Grid>
              <Grid item xs={0.9} md={0.9} lg={0.9} xl={0.9}>
                <SoftBox>
                  <CloseIcon
                    onClick={() => handleRemove(e.id)}
                    sx={{
                      marginTop: '1.5rem',
                    }}
                  />
                </SoftBox>
              </Grid>
            </Grid>
          ))}
        </SoftBox>

        <SoftBox className="add-more">
          <Button onClick={() => handleAddRow(1)}>Add more +</Button>
        </SoftBox>

        <SoftBox className="cancel-save">
          <SoftButton
            sx={{
              marginRight: '1rem',
            }}
            onClick={handleCancel}
          >
            cancel
          </SoftButton>
          {mapId == null && arrDefinitions && arrDefinitions.length > 0 ? (
            <SoftButton variant="gradient" disabled style={{ backgroundColor: '#f0f0f0', color: 'black' }}>
              save
            </SoftButton>
          ) : (
            <SoftButton variant="gradient" color="info" onClick={loader ? null : handleSave}>
              {loader ? <Spinner /> : 'Save'}
            </SoftButton>
          )}
        </SoftBox>
      </SoftBox>
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

export default AddHierarchy;
