import { Box, Card } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { dataGridStyles } from '../../../../Common/NewDataGridStyle';
import { fetchVendorTot } from '../../../../../../config/Services';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../components/SoftTypography';

const VendorDetailsBrands = () => {
  const [disableBrandEdit, setDisableBrandEdit] = useState(false);
  const [loader, setLoader] = useState(false);

  const [totRowData, setTotRowData] = useState([]);
  const accountId = localStorage.getItem('AppAccountId');
  const { vendorId } = useParams();
  useEffect(() => {
    setLoader(true);
    fetchVendorTot(accountId, vendorId)
      .then((res) => {
        const totData = res?.data?.data?.data;
        const mappedData = totData?.map((item, index) => ({
          id: index,
          brands: item?.entityName,
          subBrands: item?.dependents?.subBrand[0]?.label,
          salesTraget: item?.target,
          purchaseMargin: item?.margin,
          marginOnTarget: item?.marginOnTarget,
          frequency: `${item?.targetFrequency} months`,
        }));
        setTotRowData(mappedData);
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
      });
  }, []);

  const columns = [
    {
      field: 'brands',
      headerName: 'Brands',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'subBrands',
      headerName: 'Sub brand',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },

    {
      field: 'purchaseMargin',
      headerName: 'Purchase margin',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'salesTraget',
      headerName: 'Sales Target',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'marginOnTarget',
      headerName: 'Margin On Target',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'frequency',
      headerName: 'Frequency',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
  ];

  return (
    <div style={{ padding: '15px', marginTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SoftTypography fontWeight="bold" fontSize="14px" mb={0.5}>
          Brands and margins
        </SoftTypography>
        {/* <>
          <ModeEditIcon className="cursorPointer" onClick={() => setDisableBrandEdit(!disableBrandEdit)} />{' '}
        </> */}
        {/* <Button style={{ fontWeight: 'none', textTransform: 'none' }}> View Targets</Button> */}
      </div>
      <Card className="vendorTablestyle">
        <Box>
          <DataGrid
            sx={{ ...dataGridStyles.header, borderRadius: '20px' }}
            rows={totRowData || []}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={10}
            paginationMode="client"
            // pagination
            hideFooter
            // rowCount={parseInt(markDownpg || 0)}
            autoHeight
            disableSelectionOnClick
            onRowClick={(row) => handleNavigae(row?.id)}
          />
        </Box>
        {disableBrandEdit && (
          <div style={{ margin: '15px 0px 0px 0px' }}>
            <SoftBox className="form-button-customer-vendor">
              <SoftButton className="vendor-second-btn">Cancel</SoftButton>
              <SoftButton className="vendor-add-btn">Save</SoftButton>
            </SoftBox>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VendorDetailsBrands;
