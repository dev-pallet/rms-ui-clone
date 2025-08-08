import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  createStoreConfig,
  getAllLicenses,
  getStoreConfig,
  updateStoreConfig,
} from '../../../../../../../config/Services';
import { setLicenses, useSoftUIController } from '../../../../../../../context';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import { initialFormState, transformApiToForm, transformFormToApi } from '../config/posSettingsConfig';

export const usePosSettingsForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const locId = localStorage.getItem('locId');
  const showSnackbar = useSnackbar();
  const [, dispatch] = useSoftUIController();
  const navigate = useNavigate();

  useEffect(() => {
    const userRoles = JSON.parse(localStorage.getItem('user_roles')) || [];
    const hasAccess = userRoles?.includes('POS_MANAGER') || userRoles?.includes('SUPER_ADMIN');

    if (!hasAccess) {
      Swal.fire({
        icon: 'error',
        title: 'You do not have access to this page',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      }).then(() => {
        navigate(-1);
      });
    }
  }, []);

  const handleChange = (setting, value) => {
    setFormData((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSave = async (formData) => {
    saveStoreConfig(formData);
  };

  const { isLoading: isFetchingConfig } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['storeConfig'],
    queryFn: async () => {
      const res = await getStoreConfig(locId);
      if (res?.data?.data?.es === 2) {
        // showSnackbar(res?.data?.data?.message, 'error');
        showSnackbar('Store config not found. Please create a new store config', 'info');
        return {};
      }
      const formattedData = transformApiToForm(res?.data?.data?.storeConfig);
      setFormData(formattedData);
      return formattedData || {};
    },
  });

  const { mutate: saveStoreConfig, isLoading: isSavingConfig } = useMutation({
    mutationKey: ['saveConfig'],
    mutationFn: async (formData) => {
      let res;
      const payload = transformFormToApi(formData);
      if (!formData?.storeConfigId) {
        res = await createStoreConfig(payload);
      } else {
        res = await updateStoreConfig(payload);
      }
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message, 'error');
        return {};
      }
      navigate(-1);
      showSnackbar('Store config saved successfully', 'success');
      return res?.data?.data;
    },
  });

  const { data: licenseList } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['licenses'],
    queryFn: async () => {
      const res = await getAllLicenses({ locId });
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message, 'error');
        return;
      }
      const licenses =
        res?.data?.data?.data?.responses?.map((license) => ({
          value: license?.licenseId,
          label: license?.licenseName,
        })) || [];
      setLicenses(dispatch, licenses);
      return res?.data?.data?.data?.responses;
    },
  });

  return { formData, handleChange, licenseList, handleSave, isFetchingConfig, isSavingConfig };
};
