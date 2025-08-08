import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import SoftSelect from '../../../../../components/SoftSelect';
import { CircularProgress, Grid, Typography } from '@mui/material';
import SoftInput from '../../../../../components/SoftInput';
import SoftButton from '../../../../../components/SoftButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import {
  createHOSubDepartment,
  editSubDepartment,
  getHoDepartment,
  getHOSubDepartment,
  getHOSubDepartmentByDep,
} from '../../../../../config/Services';
import CloseIcon from '@mui/icons-material/Close';
import SoftBox from '../../../../../components/SoftBox';
import SoftAsyncPaginate from '../../../../../components/SoftSelect/SoftAsyncPaginate';

const CreateSubDep = () => {
  const [subDepartmentData, setSubDepartmentData] = useState([
    { id: 1, departmentName: '', subDepartment: '', subDepartmentCode: '', isNew: true, description: '' },
  ]);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const showSnackBar = useSnackbar();

  const location1 = useLocation();

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const subDepId = params.get('subDepId');
    return { subDepId };
  };

  const { subDepId } = getQueryParams();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;

  const addFormSub = () => {
    setSubDepartmentData([
      ...subDepartmentData,
      {
        id: subDepartmentData.length + 1,
        departmentName: '',
        departmentId: '',
        subDepartment: '',
        subDepartmentCode: '',
        isNew: true,
        description: '',
      },
    ]);
  };

  const handleChangeSub = (id, name, value) => {
    setSubDepartmentData(
      subDepartmentData.map((form) =>
        form.id === id
          ? name === 'department'
            ? { ...form, departmentId: value?.value, departmentName: value?.label }
            : { ...form, [name]: value }
          : form,
      ),
    );
  };

  const removeFormSub = (id) => {
    setSubDepartmentData(subDepartmentData?.filter((form) => form.id !== id));
  };

  const loadDepartmentOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      sortByUpdatedDate: 'DESCENDING',
      active: [true],
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
      showSnackBar('Error fetching department options', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const handleSubDepartmentCreate = () => {
    const isAnyNameEmpty = subDepartmentData.some((data) => !data.subDepartment.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide Sub-department name for all entries', 'error');
      return;
    }
    setLoader(true);
    const newDepartmentData = subDepartmentData.filter((data) => data.isNew);
    const payload = newDepartmentData.map((department) => ({
      departmentId: department?.departmentId,
      subDepartmentImage: '',
      subDepartmentCode: department?.subDepartmentCode,
      // "type": "string",
      // "subType": "string",
      subDepartmentDescription: department?.description,
      subDepartmentName: department?.subDepartment,
      accountId: AppAccountId,
      sourceId: orgId,
      sourceLocationId: locId,
      createdBy: uidx,
      createdByName: user_name,
    }));

    createHOSubDepartment(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
          setLoader(false);
          showSnackBar('Sub-departments created successfully', 'success');
          navigate('/products/department');
        } else if (res?.data?.data?.es === 1) {
          showSnackBar(res?.data?.data?.message || 'some Error occured', 'error');
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        showSnackBar('Error creating sub-departments', 'error');
      });
  };

  const allSubDepartment = () => {
    const payload = {
      page: 1,
      pageSize: 50,
      sourceId: [orgId],
      subDepartmentId: [subDepId],
      sourceLocationId: [locId],
      sortByUpdatedDate: 'ASCENDING',
    };

    getHOSubDepartmentByDep(payload)
      .then((res) => {
        const data = res?.data?.data?.subDepartmentFilterResponses?.map((item, index) => ({
          id: index + 1,
          subDepartment: item?.subDepartmentName,
          subDepartmentCode: item?.subDepartmentCode,
          description: item?.subDepartmentDescription,
          departmentId: item?.departmentId,
          departmentName: item?.departmentName,
          isNew: false,
          subDepartmentId: item?.subDepartmentId,
        }));
        setSubDepartmentData(
          data.length > 0
            ? data
            : [
                {
                  id: Date.now(),
                  departmentName: '',
                  subDepartment: '',
                  subDepartmentCode: '',
                  isNew: true,
                  description: '',
                },
              ],
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    allSubDepartment();
  }, [subDepId]);

  const handleSubDepartmentEdit = () => {
    const isAnyNameEmpty = subDepartmentData.some((data) => !data.subDepartment.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide Sub-department name for all entries', 'error');
      return;
    }
    const deparmentToEdit = subDepartmentData[0];
    const payload = {
      subDepartmentImage: '',
      subDepartmentCode: deparmentToEdit?.subDepartmentCode,
      subDepartmentName: deparmentToEdit?.subDepartment,
      subDepartmentDescription: deparmentToEdit?.description,
      accountId: AppAccountId,
      sourceId: orgId,
      sourceType: 'RETAIL',
      sourceLocationId: locId,
      updatedBy: uidx,
      updatedByName: user_name,
      subDepartmentId: subDepId,
      departmentId: deparmentToEdit?.departmentId,
    };

    editSubDepartment(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
          setLoader(false);
          showSnackBar('Sub-Department Updated', 'success');
          navigate('/products/department');
        } else if (res?.data?.data?.es === 1) {
          showSnackBar(res?.data?.data?.message || 'some Error occured', 'error');
          setLoader(false);
        }
      })
      .catch(() => {
        setLoader(false);
        showSnackBar('Error while updating line of business', 'error');
      });
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox className="products-new-department-form-box">
          <form>
            {subDepartmentData.map((form) => (
              <Grid container spacing={2} key={form.id} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Department name</label>
                  <SoftAsyncPaginate
                    className="all-products-filter-soft-input-box"
                    placeholder="Select Department..."
                    loadOptions={(searchQuery, loadedOptions, additional) =>
                      loadDepartmentOptions(searchQuery, loadedOptions, additional)
                    }
                    value={form.departmentId ? { value: form.departmentId, label: form.departmentName } : null}
                    additional={{ page: 1 }}
                    onChange={(selectedOption) => handleChangeSub(form.id, 'department', selectedOption)}
                    isClearable
                    size="small"
                    menuPortalTarget={document.body}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Sub-department name</label>
                  <SoftInput
                    placeholder="Enter sub-department name...."
                    type="text"
                    size="small"
                    name="subDepartment"
                    value={form.subDepartment}
                    onChange={(e) => handleChangeSub(form.id, 'subDepartment', e.target.value)}
                    // className="products-department-new-form-input"
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Sub-department description</label>
                  <SoftInput
                    placeholder="Enter sub-department desc..."
                    type="text"
                    size="small"
                    name="subDepartment"
                    value={form.description}
                    onChange={(e) => handleChangeSub(form.id, 'description', e.target.value)}
                    // className="products-department-new-form-input"
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Sub-department code</label>
                  <SoftInput
                    type="text"
                    placeholder="Enter sub-department code..."
                    name="subDepartmentCode"
                    size="small"
                    value={form.subDepartmentCode}
                    onChange={(e) => handleChangeSub(form.id, 'subDepartmentCode', e.target.value)}
                    // className="products-department-new-form-input"
                  />
                </Grid>
                {form.isNew && subDepartmentData.length > 1 && (
                  <Grid item lg={1}>
                    <CloseIcon
                      onClick={() => removeFormSub(form.id)}
                      style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                    />
                  </Grid>
                )}
              </Grid>
            ))}
            {!subDepId && (
              <Typography type="button" onClick={addFormSub} className="products-new-department-addmore-btn">
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
                onClick={subDepId ? handleSubDepartmentEdit : handleSubDepartmentCreate}
              >
                {loader ? (
                  <CircularProgress
                    size={18}
                    sx={{
                      color: '#fff',
                    }}
                  />
                ) : subDepId ? (
                  <>Edit</>
                ) : (
                  <>Save</>
                )}
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default CreateSubDep;
