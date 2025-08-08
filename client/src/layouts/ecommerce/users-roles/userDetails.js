import { Box, Grid, Modal } from '@mui/material';
import { getRetailUserLocationDetails, getRetailnames_location, userDetailsByMobile } from '../../../config/Services';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftInput from '../../../components/SoftInput';
import SoftTypography from '../../../components/SoftTypography';

const UserDetailsByMobile = ({ openDetailModal, setOpenDetailModal, userData }) => {
  const [allOrgId, setAllOrgId] = useState([]);
  const [allOrgName, setAllOrgName] = useState([]);
  const [allLocId, setAllLocId] = useState([]);
  const [allLocName, setAllLocName] = useState([]);
  const [allData, setAllData] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [retailArray, setRetailArray] = useState([]);
  const contextType = localStorage.getItem('contextType');
  const showSnackbar = useSnackbar();
  const orgName = localStorage.getItem('orgName');
  const orgId = localStorage.getItem('orgId');

  const handleClose = () => {
    setOpenDetailModal(false);
  };
  useEffect(() => {
    const payload = {
      mobile: userData.mobile,
    };
    userDetailsByMobile(payload)
      .then((res) => {
        setAllData(res?.data?.data);
        const roles = res?.data?.data?.roles?.map((role) => role?.replace(/_/g, ' ').replace(contextType + ' ', ''));
        setAllRoles(roles);
        const data = res?.data?.data?.contexts;
        const orgIdSet = new Set();
        const contextIdSet = new Set();

        Object.values(data).forEach((user) => {
          user.meta.forEach((metaItem) => {
            orgIdSet.add(metaItem.org_id);
            contextIdSet.add(metaItem.contextId);
          });
        });

        const uniqueOrgIds = Array.from(orgIdSet);
        const uniqueContextIds = Array.from(contextIdSet);
        setAllOrgId(uniqueOrgIds);
        setAllLocId(uniqueContextIds);
      })
      .catch((err) => {
        showSnackbar(err?.res?.data?.message || 'Some error occures', 'errror');
      });
    getRetailUserLocationDetails(orgId).then((res) => {
      const contextIdSet = [];
      res?.data?.data?.branches?.map((e) => {
        contextIdSet.push(e.branchId);
      });
    });
  }, []);

  useEffect(() => {
    if (allOrgId.length > 0) {
      const payload = {
        retailIds: allOrgId,
      };
      getRetailnames_location(payload).then((res) => {
        setRetailArray(res?.data?.data?.retails);

        const orgName = [];
        res?.data?.data?.retails?.map((e) => {
          orgName.push(e?.displayName);
        });
        setAllOrgName(orgName);
      });
    }
  }, [allOrgId]);

  useEffect(() => {
    if (retailArray?.length > 0) {
      function checkOrgIdMatch(array, orgId) {
        return array.filter((item) => item.retailId === orgId);
      }
      const matchedRetailIds = checkOrgIdMatch(retailArray, orgId);
      setAllLocName(getMatchingBranches(matchedRetailIds));
    }
  }, [retailArray]);

  const getMatchingBranches = (data) => {
    const matchingBranches = [];

    data.forEach((retail) => {
      retail?.branches?.forEach((branch) => {
        if (allLocId.includes(branch.branchId)) {
          matchingBranches.push(branch.displayName);
        }
      });
    });

    return matchingBranches;
  };
  return (
    <Modal
      open={openDetailModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-pi-border"
    >
      <Box
        className="pi-box-inventory"
        sx={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          width: '60vh',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          overflow: 'auto',
          maxHeight: '80vh',
        }}
      >
        <Grid container spacing={1} p={1}>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox
              width="100%"
              mb={1}
              ml={0.5}
              lineHeight={0}
              display="flex"
              alignItem="center"
              justifyContent="space-between"
            >
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="16px"
                style={{ marginBottom: '5px' }}
              >
                User Details
              </SoftTypography>
              {/* <IconButton edge="end" color="inherit" aria-label="close"> */}
              <CancelIcon color="error" cursor="pointer" onClick={handleClose} />
              {/* </IconButton> */}
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox width="100%" mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
                style={{ marginBottom: '5px' }}
              >
                Full Name
              </SoftTypography>
              <SoftInput readOnly value={allData?.firstName + ' ' + allData?.secondName} />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox width="100%" mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
                style={{ marginBottom: '5px' }}
              >
                Mobile
              </SoftTypography>
              <SoftInput readOnly value={allData?.mobileNumber} />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox width="100%" mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
                style={{ marginBottom: '5px' }}
              >
                Email
              </SoftTypography>
              <SoftInput readOnly value={allData?.email} />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox width="100%" mb={1} ml={0.5} lineHeight={0} display="flex" flexDirection="column">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
                style={{ marginBottom: '5px' }}
              >
                Roles
              </SoftTypography>
              <SoftTypography border="0.5px solid #d2d6da" borderRadius="10px" padding="10px" fontSize="13px">
                {allRoles?.join(',  ')}
              </SoftTypography>
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox width="100%" mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
                style={{ marginBottom: '5px' }}
              >
                Organization Present
              </SoftTypography>
              <SoftTypography border="0.5px solid #d2d6da" borderRadius="10px" padding="10px" fontSize="13px">
                {orgName}
              </SoftTypography>
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox width="100%" mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
                style={{ marginBottom: '5px' }}
              >
                Location Present
              </SoftTypography>
              <SoftTypography border="0.5px solid #d2d6da" borderRadius="10px" padding="10px" fontSize="13px">
                {allLocName?.join(',  ')}
              </SoftTypography>
            </SoftBox>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default UserDetailsByMobile;
