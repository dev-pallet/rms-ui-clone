import { Box, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import './reports.css';

import { useNavigate } from 'react-router-dom';
import SoftTypography from '../../../../../components/SoftTypography';
import { exportInventoryDataV2, getInventoryListMobile } from '../../../../../config/Services';
import { InventoryReportArray } from '../ReportsData';

const Inventoryreport = () => {
  const [data, setData] = useState();
  const [cost, setCost] = useState();

  const navigate = useNavigate();
  const onCard = (reportId) => {
    if (reportId.length) {
      navigate(`/reports/InventoryChart/${reportId}`);
    } else {
      navigate('/reports/InventoryChart');
    }
  };

  const handleAnalysis = () => {
    navigate('/reports/inventory-analaysis');
  };

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  // inventory export
  const [totalPageResult, setTotalPageResult] = useState(0);
  const [exportLoader, setExportLoader] = useState(false);
  const [anchorElExport, setAnchorElExport] = useState(null);
  const openExport = Boolean(anchorElExport);
  const handleClickExport = (event) => {
    event.stopPropagation();
    setAnchorElExport(event.currentTarget);
  };
  const handleCloseExport = () => {
    setAnchorElExport(null);
  };
  // function to export
  const handleExport = async (exportData) => {
    const username = localStorage.getItem('user_name');
    const exportPayloadInventory = {
      pageNumber: 1,
      pageSize: totalPageResult,
      locationId: locId,
      orgId: orgId,
      searchBox: '',
      outOfStock: false,
      gtinList: [],
      categoryList: [],
      brandList: [],
      storageIds: [],
      vendorIds: [],
      exportType: exportData,
      exportBy: username,
    };

    try {
      setExportLoader(true);
      const response = await exportInventoryDataV2(exportPayloadInventory);
      const newblob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = `Inventory.${exportData}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setExportLoader(false);
      setAnchorElExport(null);
    } catch (err) {}
  };

  useEffect(() => {
    const payload = {
      pageNumber: 1,
      pageSize: 10,
      locationId: locId,
      orgId: orgId,
    };
    // to get total page results of inventory
    getInventoryListMobile(payload).then(async (res) => {
      setTotalPageResult(res?.data?.data?.data?.totalResult);
    });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Grid container sx={{ marginTop: '20px' }} spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper sx={{ padding: '15px' }}>
            <SoftBox>
              <Box>
                <Box className="content-space-between">
                  <Typography variant="h6" fontWeight="550">
                    Inventory
                  </Typography>
                  {/* inventory export button -----> */}
                  {/* <----- inventory export button */}
                </Box>
                <SoftTypography width="80%" mt="10px" fontSize="14px" color="black">
                  Increase visitor engagement by knowing where your visitors are coming from and measuring the success.
                </SoftTypography>
              </Box>
            </SoftBox>
            <Box sx={{ marginTop: '25px' }}>
              <SoftTypography className="reports-text-div">Reports</SoftTypography>
              <Box>
                {InventoryReportArray?.map(({ title, key, available = true }) => (
                  <Box
                    key={key}
                    className={`reports-title-div ${!available ? 'unAvailable_Report' : ''}`}
                    onClick={() => available && onCard(key)}
                  >
                    <SoftTypography className="reports-title-text">{title}</SoftTypography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Inventoryreport;
