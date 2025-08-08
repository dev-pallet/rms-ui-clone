import { Draggable } from 'react-drag-reorder';
import {
  createLayoutComponents,
  createNewLayout,
  fetchLayoutComponents,
  getAllSavedLayoutGlossaries,
  updateLayout,
} from '../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import sideNavUpdate from '../../../../../components/Utility/sidenavupdate';

import * as React from 'react';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { injectStyle } from 'react-toastify/dist/inject-style';

import './multiple.css';

function getSteps() {
  return ['Layout', 'Title', 'Components', 'Hierarchy'];
}

function Wizard() {
  sideNavUpdate();
  injectStyle();

  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const isLastStep = activeStep === steps.length - 1;
  const [building, setBuilding] = useState(false);
  const [displayBlock, setDisplayBlock] = useState(false);
  const [entities, setEntities] = useState([]);
  const { id } = useParams();
  const [productArray, setProductArray] = useState([]);
  const [productArrayIntact, setProductArrayIntact] = useState([]);
  const [componentsList, setComponentsList] = useState([]);
  const [totalSavedComponents, setTotalSavedComponents] = useState([]);
  const [selectedentities, setSelectedEntities] = useState([]);
  const [boardData, setBoardsdata] = useState({});
  const [loader, setLoader] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [layoutId, setLayoutId] = useState('');
  const [edit, setEdit] = useState(false);
  const [layoutCall, setLayoutCall] = useState(true);
  const [reverseStep, setReverseStep] = useState({
    0: null,
    1: null,
    2: null,
    3: null,
  });
  const [intactOnLoad, setIntactOnLoad] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);
  const [errorhandler, setErrorHandler] = useState('');
  const [esClr, setesClr] = useState('');
  const [vertical, setVertical] = useState('bottom');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const contextType = localStorage.getItem('contextType');

  const handleLayoutName = (e) => {
    const name = e.target.value;
    setLayoutName(name);
  };

  const handleCancelLayoutName = () => {
    setEdit(false);
    if (layoutName !== localStorage.getItem('layoutName')) {
      setLayoutName(localStorage.getItem('layoutName'));
      setLayoutCall(false);
    }
    setLayoutCall(false);
  };

  const handleUpdateLayoutNameOnRefresh = async () => {
    if (!layoutName.length) {
      // setErrorHandler('Please enter the layout name');
      // setesClr('warning');
      // setOpenAlert(true);

      toast.warning('Please enter the layout name', {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      setActiveStep(1);
      localStorage.setItem('countsteps', 1);
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
      localStorage.setItem('layoutName', updateLayoutName.data.data.object.layoutName);
      setLayoutCall(false);
      setEdit(false);
    } catch (err) {
      toast.error(err.response.data.message, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
    }
  };

  const handleUpdateLayoutName = async () => {
    if (!layoutName.length) {
      // setErrorHandler('Please enter the layout name');
      // setesClr('warning');
      // setOpenAlert(true);
      toast.warning('Please enter the layout name', {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'dark',
      });
      setActiveStep(1);
      localStorage.setItem('countsteps', 1);
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
      localStorage.setItem('layoutName', updateLayoutName.data.data.object.layoutName);
      setLayoutCall(false);
      setEdit(false);
    } catch (err) {}
  };

  const handleEditLayoutName = () => {
    setEdit(true);
  };

  const getAllLayoutComponents = () => {
    getAllSavedLayoutGlossaries()
      .then((res) => {
        const entitiesArray = res.data.data.object;
        // console.log('entitiesArray: ', entitiesArray);
        setEntities([...entitiesArray]);
      })
      .catch((err) => {});
  };

  const getSavedLayoutComponents = async () => {
    getAllLayoutComponents();
    const layout_id = localStorage.getItem('layout_id');
    const resp = await fetchLayoutComponents(orgId, locId, layout_id);
    const totSavedComponents = resp.data.data.object.map((item) => item.definitionName);
    setTotalSavedComponents(totSavedComponents);
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
      const filterComponents = newList.filter((obj) => filterArr.includes(obj.id));

      setProductArray(filterArr);
      setProductArrayIntact(filterArr);
      setComponentsList(filterComponents);
    }
  };

  const handleSetBuildingIntact = (id) => {
    if (!productArray.includes(id)) {
      setProductArray([...productArray, id]);
    } else if (productArray.includes(id)) {
      const filterArr = productArray.filter((glossaryId) => glossaryId !== id);
      setProductArray(filterArr);
    }
  };

  const handlelayout = (id) => {
    navigate(`/setting/layout/${id}`);
  };

  const handleSkip = () => {
    // navigate(`/setting/layout/${id}`);
    navigate('/setting/layout/hierarchy');
  };

  const handleBack = async () => {
    setReverseStep((prev) => ({
      ...prev,
      [activeStep - 1]: false,
    }));
    setActiveStep(activeStep - 1);
    const countsteps = parseInt(activeStep) - 1;
    localStorage.setItem('countsteps', countsteps);

    localStorage.setItem('reverseStep', JSON.stringify(reverseStep));

    let layt_id = '';

    if (layoutId !== '') {
      layt_id = layoutId;
    } else {
      layt_id = localStorage.getItem('layout_id');
    }

    if (countsteps == 2 && reverseStep[countsteps] == true) {
      // setProductArray([]);
      // setProductArrayIntact([]);
      getSavedLayoutComponents();
    }
    if (countsteps == 2 && reverseStep[countsteps] == false) {
      // setProductArray([]);
      // setProductArrayIntact([]);
      getSavedLayoutComponents();
    }
  };

  const handleNext = async () => {
    setReverseStep((prev) => ({
      ...prev,
      [activeStep]: true,
    }));

    const countsteps = parseInt(activeStep) + 1;
    setActiveStep(countsteps);

    localStorage.setItem('countsteps', countsteps);
    localStorage.setItem('reverseStep', JSON.stringify(reverseStep));

    if (countsteps == 2) {
      setEdit(false);
      if (!layoutName.length || layoutName == null) {
        // setErrorHandler('Please enter the layout name');
        // setesClr('warning');
        // setOpenAlert(true);
        toast.warning('Please enter the layout name', {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'dark',
        });
        setActiveStep(1);
        localStorage.setItem('countsteps', 1);
        return;
      }

      if (layoutName !== localStorage.getItem('layoutname') && edit == true) {
        // setErrorHandler('Please update or cancel updating the layout name before moving forward');
        // setesClr('warning');
        // setOpenAlert(true);
        toast.warning('Please update or cancel updating the layout name before moving forward', {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'dark',
        });
        setActiveStep(1);
        localStorage.setItem('countsteps', 1);
        setEdit(true);
        return;
      }

      getAllLayoutComponents();

      if (localStorage.getItem('layoutName') == null) {
        const payload = {
          layoutName: layoutName,
          orgId: orgId,
          layoutOwnerId: locId,
          createdBy: uidx,
          layoutOwnerType: contextType,
        };
        try {
          const createResult = await createNewLayout(payload);
          toast.success(createResult.data.data.message, {
            position: 'bottom-left',
            autoClose: 2000,
            theme: 'light',
          });
          const layout_id = createResult.data.data.object.layoutDetailId;
          setLayoutId(layout_id);
          localStorage.setItem('layout_id', layout_id);
          localStorage.setItem('layoutName', layoutName);
          setLayoutCall(false);
        } catch (err) {
          toast.error(err.response.data.message, {
            position: 'bottom-left',
            autoClose: 2000,
            theme: 'light',
          });
        }
      }
    }

    if (countsteps == 3) {
      setIntactOnLoad(false);
    }
  };

  const boards = {
    columns: [
      {
        cards: selectedentities,
      },
    ],
  };

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

  const [newCardForm, setNewCardForm] = useState(false);
  const [formValue, setFormValue] = useState('');
  const openNewCardForm = (event, id) => setNewCardForm(id);
  const closeNewCardForm = () => setNewCardForm(false);
  const handeSetFormValue = ({ currentTarget }) => setFormValue(currentTarget.value);

  useEffect(() => {
    //
    //
  }, [reverseStep]);

  useEffect(() => {
    if (localStorage.getItem('countsteps') == 2) {
      getAllLayoutComponents();
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('layoutName')) {
      setLayoutName(localStorage.getItem('layoutName'));
      setLayoutId(localStorage.getItem('layout_id'));
    }

    setActiveStep(parseInt(localStorage.getItem('countsteps')) || 0);

    const revStep = localStorage.getItem('reverseStep');
    const rev = JSON.parse(revStep);
    setReverseStep(
      rev || {
        0: null,
        1: null,
        2: null,
        3: null,
      },
    );

    if (rev !== null && rev[localStorage.getItem('countsteps')] == true) {
      getSavedLayoutComponents();
      setIntactOnLoad(true);
    }
  }, []);

  useEffect(() => {
    // console.log('productArr', productArray);
    // console.log('productArrIntact', productArrayIntact);
    // console.log('componentList', componentsList);
  }, [productArray, productArrayIntact, componentsList]);

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
    try {
      setLoader(true);
      const res = await createLayoutComponents(payload);
      setLoader(false);
      setProductArray([]);

      // setErrorHandler(res.data.status);
      // setesClr('success');
      // setOpenAlert(true);
      toast.success(res.data.status, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      setTimeout(() => {
        // navigate('/setting/all-layouts');
        navigate('/setting/layout-table');
      }, 1000);
    } catch (err) {
      toast.error(err.response.data.message, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      setLoader(false);
    }
  };

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
            {/* {loader && <Spinner />} */}
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
                    <SoftBox>
                      <SoftBox width="80%" textAlign="center" mx="auto" mb={4}>
                        <SoftBox mb={1}>
                          <SoftTypography variant="h5" fontWeight="regular">
                            Let&apos;s start with the basic information
                          </SoftTypography>
                        </SoftBox>
                      </SoftBox>

                      <SoftTypography variant="body2" fontWeight="regular" color="text" mb={1}>
                        Step 1: Choose ideal layout components in your layout.
                      </SoftTypography>

                      <SoftTypography variant="body2" fontWeight="regular" color="text" mb={1}>
                        Step 2: Assign hierarchy. This will enable you to nest components under each parent component.
                        For example, Building, Zone, Bay, Racks, Bins.
                      </SoftTypography>

                      <SoftTypography variant="body2" fontWeight="regular" color="text" mb={1}>
                        Step 3: Name individual components and generate a unique barcode for each combination.
                      </SoftTypography>

                      <SoftTypography variant="body2" fontWeight="regular" color="text">
                        Step 4: The barcode generated will help you inward stocks and identify the location.
                      </SoftTypography>
                    </SoftBox>
                  ) : null}
                  {activeStep == 1 ? (
                    activeStep == 1 && reverseStep[activeStep] == false && edit ? (
                      <SoftBox sx={{ display: 'flex', width: '50%', position: 'relative', left: '1rem' }}>
                        <SoftInput value={layoutName} onChange={handleLayoutName}></SoftInput>
                        <SaveIcon onClick={handleUpdateLayoutNameOnRefresh} style={{ cursor: 'pointer' }} />
                        <CancelIcon onClick={handleCancelLayoutName} style={{ cursor: 'pointer' }} />
                      </SoftBox>
                    ) : activeStep == 1 && reverseStep[activeStep] == true && layoutName.length && edit ? (
                      <SoftBox sx={{ display: 'flex', width: '50%', position: 'relative', left: '1rem' }}>
                        <SoftInput value={layoutName} onChange={handleLayoutName}></SoftInput>
                        <SaveIcon onClick={handleUpdateLayoutName} style={{ cursor: 'pointer' }} />
                        <CancelIcon onClick={handleCancelLayoutName} style={{ cursor: 'pointer' }} />
                      </SoftBox>
                    ) : activeStep == 1 && reverseStep[activeStep] == false && layoutName.length ? (
                      <SoftBox sx={{ display: 'flex', position: 'relative', left: '1rem' }}>
                        <SoftTypography variant="h4" fontWeight="medium" fontSize="1.5rem">
                          {layoutName}
                        </SoftTypography>
                        <EditIcon
                          fontSize="small"
                          style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                          onClick={handleEditLayoutName}
                        />
                      </SoftBox>
                    ) : activeStep == 1 && reverseStep[activeStep] == true && layoutName.length && !edit ? (
                      <SoftBox sx={{ display: 'flex', position: 'relative', left: '1rem' }}>
                        <SoftTypography variant="h4" fontWeight="medium" fontSize="1.5rem">
                          {layoutName}
                        </SoftTypography>
                        <EditIcon
                          fontSize="small"
                          style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                          onClick={handleEditLayoutName}
                        />
                      </SoftBox>
                    ) : (
                      <SoftBox sx={{ width: '50%' }}>
                        <SoftInput
                          placeholder="Enter your layout name"
                          value={layoutName}
                          onChange={handleLayoutName}
                        ></SoftInput>
                      </SoftBox>
                    )
                  ) : null}

                  {activeStep == 2 ? (
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
                                <SoftBox textAlign="center">
                                  <SoftButton
                                    color="secondary"
                                    variant={building ? 'contained' : 'outlined'}
                                    onClick={() => {
                                      handleSetBuilding(e.glossaryId, e.typeName);
                                    }}
                                    id={productArray.includes(e.glossaryId) ? 'blockSelectionClr' : null}
                                    sx={customButtonStyles}
                                  >
                                    <SoftTypography variant="h6" className="componentsTextBlack">
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

                  {activeStep == 3 ? (
                    <SoftBox>
                      <SoftBox width="80%" textAlign="center" mx="auto" mb={4}>
                        <SoftTypography variant="body2" fontWeight="regular" color="text">
                          Change Hierarchy order by drag & drop
                        </SoftTypography>
                      </SoftBox>
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
                          <SoftBox onClick={() => handleSave()} sx={{ color: '#fff' }}>
                            {loader ? <Spinner /> : 'Save'}
                          </SoftBox>
                        ) : (
                          <SoftBox className="skip-btn-box" sx={{ color: '#fff' }}>
                            Next
                          </SoftBox>
                        )}
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      {/* <Footer /> */}
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
}

export default Wizard;
