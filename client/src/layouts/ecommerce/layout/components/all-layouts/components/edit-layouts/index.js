import './edit-layouts.css';
import { Draggable } from 'react-drag-reorder';
import {
  createLayoutComponents,
  fetchLayoutComponents,
  getAllSavedLayoutGlossaries,
  updateLayout,
} from '../../../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import Card from '@mui/material/Card';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import sideNavUpdate from '../../../../../../../components/Utility/sidenavupdate';

import * as React from 'react';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { ToastContainer, toast } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

const EditLayouts = () => {
  sideNavUpdate();
  injectStyle();
  const navigate = useNavigate();

  // if(localStorage.getItem("layout_name")){
  //   navigate("/setting/all-layouts")
  // }

  const [openAlert, setOpenAlert] = useState(false);
  const [errorhandler, setErrorHandler] = useState('');
  const [esClr, setesClr] = useState('');
  const [vertical, setVertical] = useState('bottom');

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const contextType = localStorage.getItem('contextType');

  const [loader, setLoader] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [layoutId, setLayoutId] = useState('');
  const [edit, setEdit] = useState(false);
  const [entities, setEntities] = useState([]);
  const [building, setBuilding] = useState(false);
  const [productArray, setProductArray] = useState([]);
  const [productArrayIntact, setProductArrayIntact] = useState([]);
  const [totalSavedComponents, setTotalSavedComponents] = useState([]);
  const [savedComponents, setSavedComponents] = useState([]);
  const [componentsList, setComponentsList] = useState([]);
  const [intactOnLoad, setIntactOnLoad] = useState(false);

  const [reverseStep, setReverseStep] = useState({
    0: null,
    1: null,
    2: null,
  });

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  function getSteps() {
    return ['Title', 'Components', 'Hierarchy'];
  }

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const isLastStep = activeStep === steps.length - 1;

  const handleLayoutName = (e) => {
    const name = e.target.value;
    setLayoutName(name);
  };

  const handleCancelLayoutName = () => {
    setLayoutName(localStorage.getItem('layout_name'));
    setEdit(false);
  };

  const handleUpdateLayoutName = async () => {
    if (!layoutName.length) {
      // setErrorHandler('Please enter the layout name');
      // setesClr('warning');
      // setOpenAlert(true);

      toast.warning('Please enter the layout name', {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      setActiveStep(0);
      localStorage.setItem('countsteps', 0);
      return;
    }
    const payload = {
      userId: uidx,
      ownerId: locId,
      layoutId: layoutId,
      layoutName: layoutName,
    };
    try {
      const updateLayoutName = await updateLayout(payload);
      toast.success(updateLayoutName.data.data.message, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      const laytName = updateLayoutName.data.data.object.layoutName;
      localStorage.setItem('layout_name', layoutName);
      setLayoutName(laytName);
      setEdit(false);
    } catch (err) {
      toast.error(err.response.data.message, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      setEdit(false);
    }
  };

  const handleEditLayoutName = () => {
    setEdit(true);
  };

  const handleSkip = () => {
    // navigate(`/setting/layout/hierarchy`);
    navigate('/setting/layout-table');
  };

  const getAllLayoutComponents = () => {
    getAllSavedLayoutGlossaries()
      .then((res) => {
        const entitiesArray = res.data.data.object;
        setEntities(entitiesArray);
      })
      .catch((err) => {});
  };

  const fetchLayoutSavedGlossaries = async () => {
    const layout_id = localStorage.getItem('layout_id');
    const resp = await fetchLayoutComponents(orgId, locId, layout_id);
    const totSavedComponents = resp.data.data.object.map((item) => item.definitionName);

    const savedGLossaries = resp.data.data.object;
    setSavedComponents(savedGLossaries);
    setTotalSavedComponents(totSavedComponents);
  };

  const getSavedLayoutComponents = async () => {
    getAllLayoutComponents();
    fetchLayoutSavedGlossaries();
    // const layout_id = localStorage.getItem('layout_id');
    // const resp = await fetchLayoutComponents(orgId, locId, layout_id);
    // const totSavedComponents = resp.data.data.object.map((item) => item.definitionName);
    // setTotalSavedComponents(totSavedComponents);
    //
  };

  const handleSetBuilding = (id, name) => {
    const newObj = {
      id: id,
      typeName: name,
    };

    if (!productArray.includes(id)) {
      setProductArray([...productArray, id]);
      setProductArrayIntact([...productArrayIntact, id]);
      const isDuplicate = componentsList.some((obj) => obj.id === id);
      if (!isDuplicate) {
        setComponentsList([...componentsList, newObj]);
      }
    } else if (productArray.includes(id)) {
      const filterArr = productArray.filter((glossaryId) => glossaryId !== id);

      const newList = [...componentsList];
      const filtered = newList.filter((obj) => filterArr.includes(obj.id));

      setProductArray(filterArr);
      setProductArrayIntact(filterArr);
      setComponentsList(filtered);
    }
  };

  const handleBack = async () => {
    setActiveStep(activeStep - 1);
    const countsteps = parseInt(activeStep) - 1;

    localStorage.setItem('countsteps', countsteps);
    // setReverseStep((prev) => ({
    //   ...prev,
    //   [countsteps]: false,
    // }));

    // localStorage.setItem('reverseStep', JSON.stringify(reverseStep));

    if (countsteps == 1) {
      // setProductArray([]);
      setProductArrayIntact([]);
      getSavedLayoutComponents();
    }
  };

  const handleNext = async () => {
    const countsteps = parseInt(activeStep) + 1;
    setActiveStep(countsteps);

    localStorage.setItem('countsteps', countsteps);
    localStorage.setItem('reverseStep', JSON.stringify(reverseStep));
    // setReverseStep((prev) => ({

    if (countsteps == 1) {
      //   ...prev,
      //   [countsteps]: true,
      // }));

      if (!layoutName.length || layoutName == null) {
        // setErrorHandler('Please enter the layout name');
        // setesClr('warning');
        // setOpenAlert(true);

        toast.warning('Please enter the layout name', {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        setActiveStep(0);
        localStorage.setItem('countsteps', 0);
        return;
      }
      // setProductArray([]);
      setProductArrayIntact([]);
      getSavedLayoutComponents();
      setEdit(false);
      setLayoutName(localStorage.getItem('layout_name'));
    }

    if (countsteps == 2) {
      fetchLayoutSavedGlossaries();
      //
      // if (productArray.length) {
      //   const payload = {
      //     userId: uidx,
      //     layoutId: layoutId !== '' ? layoutId : localStorage.getItem('layout_id'),
      //     glossaryIdList: productArray,
      //   };
      //   try {
      //     const res = await createLayoutComponents(payload);
      //
      //     setProductArray([]);
      //   } catch (err) {
      //
      //   }
      // }
    }
  };

  // useEffect(() => {
  //   console.log('Product', productArray);
  //   console.log('components', componentsList);
  // }, [productArray, componentsList]);

  useEffect(() => {}, [reverseStep]);

  const customButtonStyles = ({
    functions: { pxToRem, rgba },
    borders: { borderWidth },
    palette: { transparent, dark, secondary },
  }) => ({
    width: pxToRem(150),
    height: pxToRem(120),
    borderWidth: borderWidth[2],
    mb: 1,
    ml: 0.5,

    '&.MuiButton-contained, &.MuiButton-contained:hover': {
      boxShadow: 'none',
      border: `${borderWidth[2]} solid ${transparent.main}`,
    },

    '&:hover': {
      // backgroundColor: `${transparent.main} !important`,
      // border: `${borderWidth[2]} solid ${secondary.main} !important`,

      '& svg g': {
        fill: rgba(dark.main, 0.75),
      },
    },
  });

  // useEffect(() => {
  //
  //
  // }, [productArray, productArrayIntact]);

  useEffect(() => {
    // if (localStorage.getItem('layoutName')) {
    const layoutName = localStorage.getItem('layout_name');
    const layout_id = localStorage.getItem('layout_id');
    setLayoutName(layoutName);
    setLayoutId(layout_id);
    // }
    // else {
    //   navigate('/setting/all-layouts');
    // }
  }, []);

  useEffect(() => {
    setActiveStep(parseInt(localStorage.getItem('countsteps')) || 0);
    // const revStep = localStorage.getItem('reverseStep');
    // const rev = JSON.parse(revStep);
    //
    // setReverseStep(
    //   rev || {
    //     0: null,
    //     1: null,
    //     2: null,
    //   },
    // );

    if (localStorage.getItem('countsteps') == 1) {
      getSavedLayoutComponents();
    }

    // if ((rev !== null && rev[localStorage.getItem('countsteps')] == true) || null) {
    //   getSavedLayoutComponents();
    //   setIntactOnLoad(true);
    // }
  }, []);

  const arrayMove = (arr, fromIndex, toIndex) => {
    const element = arr[fromIndex];
    const newArray = [...arr];
    newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, element);
    return newArray;
  };

  const getChangedPos = (currentPos, newPos) => {
    const reOrderdItems = arrayMove(componentsList, currentPos, newPos);
    setComponentsList(reOrderdItems);
  };

  const handleSave = async () => {
    const glossaryIdList = componentsList.map((item) => item.id);

    const payload = {
      userId: uidx,
      layoutId: layoutId !== '' ? layoutId : localStorage.getItem('layout_id'),
      glossaryIdList: glossaryIdList,
    };

    if (payload.glossaryIdList.length == 0) {
      toast.warning('No glossaries added', {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      setTimeout(() => {
        navigate('/setting/layout-table');
      }, 3000);
      return;
    }
    try {
      setLoader(true);
      const res = await createLayoutComponents(payload);
      toast.success('SUCCESS', {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      setProductArray([]);
      setLoader(false);
      setTimeout(() => {
        navigate('/setting/all-layouts');
      }, 3000);
    } catch (err) {
      toast.error(err.response.data.message, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      setLoader(false);
    }
  };

  useEffect(() => {}, [componentsList]);

  const componentsTypeName = (str) => {
    return str
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical, horizontal: 'left' }}
      >
        <Alert onClose={handleCloseAlert} severity={esClr} sx={{ width: '100%' }}>
          {errorhandler}
        </Alert>
      </Snackbar>

      <SoftBox pt={3} pb={8}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Card>
              <SoftBox p={2}>
                <SoftBox>
                  {activeStep == 0 ? (
                    activeStep == 0 && !edit && layoutName.length ? (
                      <SoftBox sx={{ display: 'flex', position: 'relative', left: '1rem' }}>
                        <SoftTypography variant="h4" fontWeight="medium" fontSize="1.5rem">
                          {layoutName}
                        </SoftTypography>
                        <EditIcon
                          fontSize="small"
                          style={{ marginLeft: '0.5rem', cursor: 'pointer', color: '#0562fb' }}
                          onClick={handleEditLayoutName}
                        />
                      </SoftBox>
                    ) : activeStep == 0 && edit ? (
                      <SoftBox sx={{ display: 'flex', width: '50%' }}>
                        <SoftInput value={layoutName} onChange={handleLayoutName}></SoftInput>
                        <SaveIcon onClick={handleUpdateLayoutName} style={{ cursor: 'pointer', color: '#0562fb' }} />
                        <CancelIcon onClick={handleCancelLayoutName} style={{ cursor: 'pointer', color: '#0562fb' }} />
                      </SoftBox>
                    ) : null
                  ) : null}

                  {activeStep == 1 ? (
                    <SoftBox>
                      <SoftBox width="80%" textAlign="center" mx="auto" mb={4}>
                        <SoftTypography variant="body2" fontWeight="regular" color="text">
                          Select Your Components
                        </SoftTypography>
                      </SoftBox>
                      <SoftBox mt={2}>
                        <Grid container spacing={2} gap={3} justifyContent="center">
                          {entities.map((e) => {
                            return (
                              <Grid item xs={12} sm={3} key={e.glossaryId}>
                                <SoftBox textAlign="center" key={e.glossaryId}>
                                  <SoftButton
                                    color="secondary"
                                    variant={building ? 'contained' : 'outlined'}
                                    onClick={() => {
                                      handleSetBuilding(e.glossaryId, e.typeName);
                                    }}
                                    id={productArray.includes(e.glossaryId) ? 'blockSelectionClr' : null}
                                    className={totalSavedComponents.includes(e.typeName) ? 'intactBlock' : null}
                                    sx={customButtonStyles}
                                  >
                                    <SoftTypography
                                      variant="h6"
                                      className={
                                        totalSavedComponents.includes(e.typeName) || productArray.includes(e.glossaryId)
                                          ? 'componentsTextWhite'
                                          : 'componentsTextBlack'
                                      }
                                    >
                                      {componentsTypeName(e.typeName)}
                                    </SoftTypography>
                                  </SoftButton>
                                </SoftBox>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </SoftBox>
                    </SoftBox>
                  ) : null}

                  {activeStep == 2 ? (
                    <SoftBox>
                      <SoftBox width="80%" textAlign="center" mx="auto" mb={4}>
                        <SoftTypography variant="body2" fontWeight="regular" color="text">
                          Change Hierarchy order by drag & drop
                        </SoftTypography>
                      </SoftBox>

                      {savedComponents.length
                        ? savedComponents.map((item) => (
                          <SoftBox className="saved-components-card">
                            {componentsTypeName(item.definitionName)}
                          </SoftBox>
                        ))
                        : null}

                      <Draggable onPosChange={getChangedPos}>
                        {componentsList.map((item, idx) => {
                          return <SoftBox className="drag-drop-card">{componentsTypeName(item.typeName)}</SoftBox>;
                        })}
                      </Draggable>
                    </SoftBox>
                  ) : null}

                  <SoftBox mt={3} width="100%" display="flex" justifyContent="space-between" gap="3px">
                    {activeStep === 0 ? (
                      <SoftBox />
                    ) : (
                      <SoftButton variant="gradient" color="light" onClick={handleBack}>
                        back
                      </SoftButton>
                    )}
                    <SoftBox>
                      <SoftButton
                        variant="gradient"
                        color="dark"
                        onClick={!isLastStep ? handleNext : undefined}
                        sx={{
                          background: '#0562fb',
                        }}
                      >
                        {isLastStep ? (
                          <SoftBox onClick={loader ? null : handleSave} sx={{ color: '#fff' }}>
                            {loader ? <Spinner /> : 'Save'}
                          </SoftBox>
                        ) : (
                          <SoftBox className="skip-btn-box" sx={{ color: '#fff' }}>
                            Next
                          </SoftBox>
                        )}
                      </SoftButton>
                      {/* {activeStep === 0 || activeStep === 1 ? (
                        <SoftButton onClick={handleSkip} sx={{ marginLeft: '0.8rem' }}>
                          Skip
                        </SoftButton>
                      ) : null} */}
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
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

export default EditLayouts;
