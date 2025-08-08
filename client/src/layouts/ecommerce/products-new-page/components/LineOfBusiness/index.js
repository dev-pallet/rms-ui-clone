import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import { CircularProgress, Grid, Typography } from '@mui/material';
import SoftInput from '../../../../../components/SoftInput';
import CloseIcon from '@mui/icons-material/Close';
import SoftButton from '../../../../../components/SoftButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import EditIcon from '@mui/icons-material/Edit';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { createLineOfBusiness, filterLineOfBusiness, editLineOfBusiness } from '../../../../../config/Services';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';

const ProductLineOfBusiness = () => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [businessData, setBusinessData] = useState([
    { id: 1, businessName: '', description: '', businessCode: '', isNew: true },
  ]);
  const [allData, setAllData] = useState([]);
  const [editingId, setEditingId] = useState(null); // State to track currently editing item
  const location1 = useLocation();

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const lobId = params.get('lobId');
    return { lobId };
  };

  const { lobId } = getQueryParams();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;

  const addBusiness = () => {
    setBusinessData([
      ...businessData,
      { id: businessData.length + 1, businessName: '', description: '', businessCode: '', isNew: true },
    ]);
  };

  const handleBusinessChange = (id, e) => {
    const { name, value } = e.target;
    setBusinessData(businessData.map((form) => (form.id === id ? { ...form, [name]: value } : form)));
  };

  const removeBusiness = (id) => {
    setBusinessData(businessData.filter((form) => form.id !== id));
  };

  const handleLineOfBusinessCreation = () => {
    const isAnyNameEmpty = businessData.some((data) => !data.businessName.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide Line of Business name for all entries', 'error');
      return;
    }
    setLoader(true);
    const newBusinessData = businessData.filter((data) => data.isNew);
    const payload = newBusinessData.map((data) => ({
      lobImage: '',
      lobCode: data?.businessCode,
      lobDescription: data?.description,
      lobName: data?.businessName,
      accountId: AppAccountId,
      sourceId: orgId,
      sourceType: 'RETAIL',
      sourceLocationId: locId,
      createdBy: uidx,
      createdByName: user_name,
    }));

    createLineOfBusiness(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
          setLoader(false);
          showSnackBar('Line of Business Created', 'success');
          navigate('/products/department');
        } else {
          showSnackBar('some Error occurred', 'error');
        }
      })
      .catch(() => {
        setLoader(false);
        showSnackBar('Error while creating line of business', 'error');
      });
  };

  const handleLineOfBusinessEdit = () => {
    // If already in edit mode, perform the update
    const businessToEdit = businessData[0];
    const payload = {
      lobImage: '',
      lobCode: businessToEdit?.businessCode,
      lobDescription: businessToEdit?.description,
      lobName: businessToEdit?.businessName,
      accountId: AppAccountId,
      sourceId: orgId,
      sourceType: 'RETAIL',
      sourceLocationId: locId,
      updatedBy: uidx,
      updatedByName: user_name,
      lineOfBusinessId: lobId,
    };

    editLineOfBusiness(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
          setLoader(false);
          showSnackBar('Line of Business Updated', 'success');
          navigate('/products/department');
        } else {
          showSnackBar('Some error occurred', 'error');
        }
      })
      .catch(() => {
        showSnackBar('Error while updating line of business', 'error');
      });
  };

  const getAllLineofBusiness = () => {
    let payload = {
      page: 1,
      pageSize: 50,
      sourceLocationId: [locId],
      lineOfBusinessId: [lobId],
      sortByUpdatedDate: 'ASCENDING',
    };

    filterLineOfBusiness(payload).then((res) => {
      const fetchedData = res?.data?.data?.results.map((item, index) => ({
        id: index + 1,
        businessName: item?.lobName,
        description: item?.lobDescription,
        businessCode: item?.lobCode,
        isNew: false,
        lobId: item?.lineOfBusinessId,
      }));
      setBusinessData(
        fetchedData.length > 0
          ? fetchedData
          : [{ id: Date.now(), businessName: '', description: '', businessCode: '', isNew: true }],
      );
      setAllData(fetchedData);
    });
  };

  useEffect(() => {
    getAllLineofBusiness();
  }, [lobId]);

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <div>
        <SoftBox className="products-new-department-form-box">
          <form>
            {businessData.map((form) => (
              <Grid container spacing={2} key={form.id} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Line of Business name</label>
                  <SoftInput
                    type="text"
                    name="businessName"
                    placeholder="Enter Line of Business name..."
                    value={form.businessName}
                    size="small"
                    onChange={(e) => handleBusinessChange(form.id, e)}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Description</label>
                  <SoftInput
                    type="text"
                    name="description"
                    placeholder="Enter desc..."
                    value={form.description}
                    size="small"
                    onChange={(e) => handleBusinessChange(form.id, e)}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">LOB code</label>
                  <SoftInput
                    type="text"
                    name="businessCode"
                    placeholder="Enter LOB code..."
                    value={form.businessCode}
                    size="small"
                    onChange={(e) => handleBusinessChange(form.id, e)}
                  />
                </Grid>
                {form.isNew && businessData.length > 1 && (
                  <Grid item lg={1}>
                    <CloseIcon
                      onClick={() => removeBusiness(form.id)}
                      style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                    />
                  </Grid>
                )}
              </Grid>
            ))}
            {!lobId && (
              <Typography type="button" onClick={addBusiness} className="products-new-department-addmore-btn">
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
                onClick={lobId ? handleLineOfBusinessEdit : handleLineOfBusinessCreation}
              >
                {loader ? (
                  <CircularProgress
                    size={18}
                    sx={{
                      color: '#fff',
                    }}
                  />
                ) : lobId ? (
                  <>Edit</>
                ) : (
                  <>Save</>
                )}
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </div>
    </DashboardLayout>
  );
};

export default ProductLineOfBusiness;
