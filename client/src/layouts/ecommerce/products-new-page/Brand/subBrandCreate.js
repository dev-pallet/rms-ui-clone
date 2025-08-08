import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import { Button, IconButton, Typography } from '@mui/material';
import { InputLabel } from '@material-ui/core';
import SoftSelect from '../../../../components/SoftSelect';
import SoftInput from '../../../../components/SoftInput';
import { getAllBrands, masterSubBrandCreation, masterSubBrandEdit, subBrandEdit } from '../../../../config/Services';
import CloseIcon from '@mui/icons-material/Close';
import SoftButton from '../../../../components/SoftButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';

const SubBrandCreate = () => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const userDetails = localStorage.getItem('user_details');
  const userInfo = userDetails ? JSON.parse(userDetails) : {};
  const appAccountId = localStorage.getItem('AppAccountId');
  const userName = localStorage.getItem('user_name');
  const [brandOptions, setBrandOptions] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState({});
  const [subBrandData, setSubBrandData] = useState([{ subBrandName: '', subBrandCode: '' }]);
  const location = useLocation();

  const fetchBrandDetails = () => {
    const payload = {
      page: 1,
      pageSize: 50,
      sourceId: [orgId],
      sortByCreatedDate: 'DESCENDING',
      sourceLocationId: [locId],
      active: [true],
    };
    if (editBrandId) {
      payload.brandId = [editBrandId];
    }
    getAllBrands(payload)
      .then((res) => {
        const results = res?.data?.data?.results;
        if (editBrandId) {
          const subBrandResult = results?.[0]?.subBrands
            ?.filter((item) => item?.subBrandId === editSubbrandID)
            ?.map((item) => ({
              subBrandId: item?.subBrandId,
              subBrandName: item?.subBrandName || '',
              subBrandCode: item?.subBrandCode || '',
            }));
          setSubBrandData(subBrandResult?.length > 0 ? subBrandResult : [{ subBrandName: '', subBrandCode: '' }]);
        }

        const data = results?.map((item) => ({ value: item?.brandId, label: item?.brandName }));
        setBrandOptions(data || []);
        setSelectedBrand(...(data || {}));
      })
      .catch(() => {});
  };
  useEffect(() => {
    fetchBrandDetails();
  }, []);

  function getBrandIdFromUrl(url) {
    const params = new URLSearchParams(url);
    const brandId = params.get('brandId');
    const subBrandId = params.get('subBrandId');
    return { brandId, subBrandId };
  }

  const { brandId, subBrandId } = getBrandIdFromUrl(location.search);
  const editBrandId = brandId;
  const editSubbrandID = subBrandId;

  const handleSubBrandChange = (index, field, value) => {
    const newData = [...subBrandData];
    newData[index][field] = value;
    setSubBrandData(newData);
  };

  const handleAddMore = () => {
    setSubBrandData([...subBrandData, { subBrandName: '', subBrandCode: '' }]);
  };

  const handleDeleteRow = (index) => {
    const newData = subBrandData?.filter((_, i) => i !== index);
    setSubBrandData(newData);
  };

  const handleCreateSubBrand = () => {
    const payload = subBrandData?.map((subBrand) => ({
      brandId: selectedBrand?.value || '',
      subBrandName: subBrand?.subBrandName || '',
      subBrandCode: subBrand?.subBrandCode || '',
      accountId: appAccountId,
      sourceId: orgId,
      sourceLocationId: locId,
      sourceType: 'RETAIL',
      createdBy: userInfo?.uidx,
      createdByName: userName,
    }));

    masterSubBrandCreation(payload)
      .then((res) => {
        showSnackbar('Sub brand create Successful', 'success');
        navigate('/products/brand');
      })
      .catch(() => {
        showSnackbar('Sub brand Create Failed', 'error');
        navigate('/products/brand');
      });
  };

  const handleEditSubBrand = () => {
    const payload = subBrandData?.map((item) => ({
      active: true,
      updatedBy: userName,
      updatedByName: userInfo?.uidx,
      createdBy: userName,
      createdByName: userInfo?.uidx,
      subBrandId: item?.subBrandId,
      brandId: selectedBrand?.value,
      subBrandCode: item?.subBrandCode,
      subBrandName: item?.subBrandName,
      subBrandDescription: '',
      sourceId: orgId,
      sourceLocationId: locId,
    }));
    const newPayload = {
      brandId: editBrandId,
      subBrandId: subBrandData?.[0]?.subBrandId,
      subBrandCode: subBrandData?.[0]?.subBrandCode,
      subBrandName: subBrandData?.[0]?.subBrandName,
      // logo: 'string',
      isActive: true,
      // deleted: true,
      updatedBy: userName,
      updatedByName: userInfo?.uidx,
      createdBy: userName,
      createdByName: userInfo?.uidx,
    };
    subBrandEdit(newPayload)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          showSnackbar('Sub brand Edit Successful', 'success');
          navigate('/products/brand');
        } else if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message || 'Something went wrong', 'error');
        }
      })
      .catch(() => {
        showSnackbar('Sub brand Edit Failed', 'error');
        navigate('/products/brand');
      });
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="products-new-department-form-box">
        <Typography className="products-department-new-form-label-2">Sub Brands</Typography>
        <div style={{ marginTop: '10px' }}>
          <label className="products-department-new-form-label" required>
            Brand
          </label>
          <SoftSelect
            size="small"
            options={brandOptions || []}
            value={selectedBrand}
            placeholder="Select brand"
            onChange={(e) => setSelectedBrand(e)}
          />
        </div>
        {subBrandData?.map((item, index) => (
          <div key={index} style={{ display: 'flex', marginTop: '10px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              {index === 0 && (
                <label className="products-department-new-form-label" required>
                  Sub brand
                </label>
              )}
              <SoftInput
                size="small"
                placeholder="Enter Sub-brand"
                value={item.subBrandName}
                onChange={(e) => handleSubBrandChange(index, 'subBrandName', e.target.value)}
              />
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>
              {index === 0 && (
                <label className="products-department-new-form-label" required>
                  Sub brand code
                </label>
              )}
              <SoftInput
                size="small"
                placeholder="Enter Sub-brand Code"
                value={item?.subBrandCode}
                onChange={(e) => handleSubBrandChange(index, 'subBrandCode', e.target.value)}
              />
            </div>
            <IconButton
              onClick={() => handleDeleteRow(index)}
              aria-label="delete"
              size="small"
              style={{ color: 'red', marginTop: index === 0 ? '30px' : '0px', marginLeft: '10px' }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        ))}
        {!editBrandId ? (
          <Button style={{ textTransform: 'none', marginTop: '10px' }} onClick={handleAddMore}>
            + Add More
          </Button>
        ) : (
          <br />
        )}
      </SoftBox>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <SoftButton className="vendor-second-btn" onClick={() => navigate(-1)}>
          Cancel
        </SoftButton>
        <SoftButton
          color="info"
          className="vendor-add-btn"
          style={{ marginLeft: '10px' }}
          onClick={editBrandId ? handleEditSubBrand : handleCreateSubBrand}
        >
          {editBrandId ? 'Edit' : 'Save'}
        </SoftButton>
      </div>
    </DashboardLayout>
  );
};

export default SubBrandCreate;
