import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { dataGridStyles } from '../../../Common/NewDataGridStyle';

import vegImage from '../../../../../assets/images/veg.jpg';
import nonVegImage from '../../../../../assets/images/non-veg.jpg';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const AddonDetails = ({ productDetails, selectedVariant }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (Array.isArray(selectedVariant?.addOn)) {
      const addOnDetails = selectedVariant?.addOn?.map((item, idx) => ({
        id: idx,
        title: item?.title,
        uom: `${item?.specification} ${item?.unitOfMeasure}`,
        salePrice: item?.additionalPrice || 0,
        foodType: item?.foodType || 'VEG',
        shortCode: selectedVariant?.shortCode || '',
        addOnId: item?.addOnId || '',
        foodCost: Number(item?.additionalPrice) !== 0 ? true : false,
      }));
      setRows(addOnDetails);
    } else {
      setRows([]); // fallback to avoid crashing
    }
  }, [selectedVariant]);

  const columns = [
    {
      field: 'foodType',
      headerName: '',
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        const imageUrl = params.value === 'VEG' ? vegImage : nonVegImage;
        return <img src={imageUrl} alt={params.value} style={{ width: '20px', height: '20px' }} />;
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'shortCode',
      headerName: 'Short Code',
      flex: 1,
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },

    {
      field: 'uom',
      headerName: 'UOM',
      flex: 1,
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'salePrice',
      headerName: 'Sale Price',
      flex: 1,
      minWidth: 100,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'foodCost',
      headerName: 'Food Cost',
      flex: 1,
      minWidth: 50,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) =>
        params.value ? (
          <TaskAltIcon style={{ fontSize: 'large', color: '#367df3' }} />
        ) : (
          <span style={{ color: 'red', fontWeight: 'bold' }}>✘</span>
        ),
    },
  ];

  return (
    <Box style={{ marginTop: '1rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Typography variant="h6" fontWeight="bold">
          Add On
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
          autoHeight
          sx={{ ...dataGridStyles.header, borderRadius: '24px', cursor: 'pointer' }}
        />
      </Box>
    </Box>
  );
};

export default AddonDetails;
