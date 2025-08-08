import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../../components/SoftBox';
import './department.css';
import { CircularProgress, Grid, InputLabel, Typography } from '@mui/material';
import SoftInput from '../../../../../components/SoftInput';
import CloseIcon from '@mui/icons-material/Close';
import SoftButton from '../../../../../components/SoftButton';
import ProductCategory from '../Category';
import ProductLineOfBusiness from '../LineOfBusiness';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import {
  createHODepartment,
  createHOSubDepartment,
  editDepartment,
  editSubDepartment,
  getHOSubDepartment,
  getHoDepartment,
} from '../../../../../config/Services';
import SoftSelect from '../../../../../components/SoftSelect';
import EditIcon from '@mui/icons-material/Edit';
import UpgradeIcon from '@mui/icons-material/Upgrade';

const ProductDepartment = () => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const [loader, setLoader] = useState(false);

  const location1 = useLocation();

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const depId = params.get('depId');
    return { depId };
  };

  const { depId } = getQueryParams();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;

  const [deparmentData, setDepartmentData] = useState([
    { id: 1, departmentName: '', description: '', departmentCode: '', isNew: true },
  ]);

  const addForm = () => {
    setDepartmentData([
      ...deparmentData,
      { id: deparmentData.length + 1, departmentName: '', description: '', departmentCode: '', isNew: true },
    ]);
  };

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    setDepartmentData(deparmentData.map((form) => (form.id === id ? { ...form, [name]: value } : form)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const removeForm = (id) => {
    setDepartmentData(deparmentData.filter((form) => form.id !== id));
  };

  const getAllDept = () => {
    const payload = { sourceId: [orgId], sourceLocationId: [locId], departmentId: [depId] };
    getHoDepartment(payload)
      .then((res) => {
        const data = res?.data?.data?.results?.map((item, index) => ({
          label: item?.departmentName,
          value: item?.departmentId,
          code: item?.departmentCode,
          id: index + 1,
          departmentName: item?.departmentName,
          description: item?.departmentDescription,
          departmentCode: item?.departmentCode,
          isNew: false,
          departmentId: item?.departmentId,
        }));
        // setMainDepartmentOptions(data);
        // setAllDept(data);
        setDepartmentData(
          data.length > 0
            ? data
            : [{ id: Date.now(), departmentName: '', description: '', departmentCode: '', isNew: true }],
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    getAllDept();
  }, [depId]);

  const handleMainDepartmentCreate = () => {
    const isAnyNameEmpty = deparmentData.some((data) => !data.departmentName.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide department name for all entries', 'error');
      return;
    }
    const newDepartmentData = deparmentData.filter((data) => data.isNew);
    setLoader(true);
    const payload = newDepartmentData.map((department) => ({
      departmentImage: '',
      departmentCode: department?.departmentCode,
      departmentDescription: department?.description,
      departmentName: department?.departmentName,
      accountId: AppAccountId,
      sourceId: orgId,
      sourceLocationId: locId,
      createdBy: uidx,
      createdByName: user_name,
    }));

    createHODepartment(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
          setLoader(false);
          showSnackBar('Departments created successfully', 'success');
          navigate('/products/department');
        } else {
          showSnackBar('some Error occured', 'error');
        }
      })
      .catch((error) => {
        setLoader(false);
        showSnackBar('Error creating departments', 'error');
      });
  };

  const handleDepartmentEdit = () => {
    const isAnyNameEmpty = deparmentData.some((data) => !data.departmentName.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide department name for all entries', 'error');
      return;
    }
    const deparmentToEdit = deparmentData[0];
    const payload = {
      departmentImage: '',
      departmentCode: deparmentToEdit?.departmentCode,
      departmentDescription: deparmentToEdit?.description,
      departmentName: deparmentToEdit?.departmentName,
      accountId: AppAccountId,
      sourceId: orgId,
      sourceType: 'RETAIL',
      sourceLocationId: locId,
      updatedBy: uidx,
      updatedByName: user_name,
      departmentId: depId,
    };

    editDepartment(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
          setLoader(false);
          showSnackBar('Department Updated', 'success');
          navigate('/products/department');
        } else {
          showSnackBar('some Error occured', 'error');
        }
      })
      .catch(() => {
        showSnackBar('Error while updating department', 'error');
      });
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />

        <>
          <SoftBox className="products-new-department-form-box">
            <form onSubmit={handleSubmit}>
              {deparmentData.map((form) => (
                <Grid container spacing={2} key={form.id} style={{ marginBottom: '15px' }}>
                  <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Department name</label>
                    <SoftInput
                      placeholder="Enter Department name..."
                      type="text"
                      name="departmentName"
                      value={form.departmentName}
                      onChange={(e) => handleChange(form.id, e)}
                      size="small"
                      // className="products-department-new-form-input"
                    />
                  </Grid>
                  <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Description</label>
                    <SoftInput
                      placeholder="Enter Department desc..."
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={(e) => handleChange(form.id, e)}
                      size="small"
                      // className="products-department-new-form-input"
                    />
                  </Grid>
                  <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Department code</label>
                    <SoftInput
                      placeholder="Enter Department code..."
                      type="text"
                      name="departmentCode"
                      value={form.departmentCode}
                      onChange={(e) => handleChange(form.id, e)}
                      size="small"
                      // className="products-department-new-form-input"
                    />
                  </Grid>
                  {form.isNew && deparmentData.length > 1 && (
                    <Grid item lg={1}>
                      <CloseIcon
                        onClick={() => removeForm(form.id)}
                        style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                      />
                    </Grid>
                  )}
                </Grid>
              ))}
              {!depId && (
                <Typography type="button" onClick={addForm} className="products-new-department-addmore-btn">
                  + Add more
                </Typography>
              )}
            </form>
          </SoftBox>

          <SoftBox display="flex" justifyContent="flex-end" mt={4}>
            <SoftBox display="flex">
              <SoftButton className="vendor-second-btn" onClick={() => navigate(-1)}>
                Cancel
              </SoftButton>
              <SoftBox ml={2}>
                <SoftButton
                  color="info"
                  className="vendor-add-btn"
                  onClick={depId ? handleDepartmentEdit : handleMainDepartmentCreate}
                >
                  {loader ? (
                    <CircularProgress
                      size={18}
                      sx={{
                        color: '#fff',
                      }}
                    />
                  ) : depId ? (
                    <>Edit</>
                  ) : (
                    <>Save</>
                  )}
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </>
      </DashboardLayout>
    </div>
  );
};

export default ProductDepartment;
