import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { capitalizeFirstLetterOfWords } from '../../../Common/CommonFunction';
import { getSingleSegmentById } from '../../../../../config/Services';
import { useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftInput from '../../../../../components/SoftInput';
import Spinner from '../../../../../components/Spinner';
import fetchCsvData from './fetchCsvData';

const SingleContactPage = () => {
  const { segmentId } = useParams();
  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const name = localStorage.getItem('user_name');

  const [allContacts, setAllContacts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [csvUrl, setCsvUrl] = useState('');
  const [columns, setColumns] = useState([]);

  const getAllContacts = () => {
    setLoader(true);
    const payload = {
      segmentId: segmentId,
      reportType: 'csv',
      reportCreatedBy: uidx,
      reportCreatedByName: name,
      getCustomerReport: false,
      reportJobType: 'FIXED',
      reportFrequency: 'DAILY',
      noOfTimesToCreateReport: 10,
    };

    const modifyCsvUrl = (csvUrl) => {
      const targetUrl = 'https://storage.cloud.google.com';
      const replacementUrl = 'https://storage.googleapis.com';

      if (csvUrl?.includes(targetUrl)) {
        return csvUrl?.replace(targetUrl, replacementUrl);
      }
      return csvUrl;
    };

    try {
      setLoader(true);
      getSingleSegmentById(payload)
        .then(async (res) => {
          if (res?.data?.status === 'ERROR') {
            showSnackbar(res?.data?.message, 'error');
            setLoader(false);
            return; 
          }

          if(res?.data?.data?.reportJobStatus === 'FAILED') {
            showSnackbar('Sorry! The file could not be generated.', 'error');
            setLoader(false);
            return; 
          }

          const csvUrl = res?.data?.data?.csvFile;
          const modifiedUrl = modifyCsvUrl(csvUrl);

          setCsvUrl(modifiedUrl);

          try {
            const data = await fetchCsvData(modifiedUrl); 
            setAllContacts(data);
            if (data.length > 0) {
              const dynamicColumns = Object.keys(data[0]).map((key) => ({
                field: key,
                headerName: capitalizeFirstLetterOfWords(key.replace(/_/g, ' ').toUpperCase()),
                minWidth: 150,
                flex: 1,
                headerClassName: 'datagrid-columns',
                headerAlign: 'center',
                cellClassName: 'datagrid-rows',
                align: 'center',
              }));
              setColumns(dynamicColumns);
            }
          } catch (fetchError) {
            showSnackbar('Error while parsing CSV data', 'error');
          }

          setLoader(false);
        })
        .catch((err) => {
          setLoader(false);
          showSnackbar('Error while fetching the list', 'error');
        });
    } catch (error) {
      setLoader(false);
      showSnackbar('Error while fetching the list', 'error');
    }
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
          <SoftBox className="search-bar-filter-container">
            <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box className="all-products-filter-product" style={{ width: '350px' }}>
                <SoftInput
                  className="all-products-filter-soft-input-box"
                  placeholder="Search Audience"
                  icon={{ component: 'search', direction: 'left' }}
                />
              </Box>
              {/* <SoftButton onClick={() => window.open(csvUrl)} download>
                Download CSV
              </SoftButton> */}
            </SoftBox>
          </SoftBox>
          <SoftBox>
            <Box sx={{ height: 525, width: '100%' }}>
              {loader && <Spinner />}
              {!loader && (
                <DataGrid rows={allContacts} columns={columns} pagination pageSize={10} getRowId={(row) => row.id} />
              )}
            </Box>
          </SoftBox>
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default SingleContactPage;
