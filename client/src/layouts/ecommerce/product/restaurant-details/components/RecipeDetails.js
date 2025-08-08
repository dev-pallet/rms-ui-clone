import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box } from '@mui/material';
import { dataGridStyles } from '../../../Common/NewDataGridStyle';

import vegImage from '../../../../../assets/images/veg.jpg';
import nonVegImage from '../../../../../assets/images/non-veg.jpg';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const RecipeDetails = ({ selectedVariant, recipeDetails }) => {
  const estimatedFoodCost = 0;
  const [rows, setRows] = useState([]);

  const columns = [
    // {
    //   field: 'foodType',
    //   headerName: '',
    //   flex: 1,
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'center',
    //   renderCell: (params) => {
    //     const imageUrl = params.value === 'veg' ? vegImage : nonVegImage;
    //     return <img src={imageUrl} alt={params.value} style={{ width: '20px', height: '20px' }} />;
    //   },
    // },
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
      field: 'specification',
      headerName: 'Specification',
      flex: 1,
      minWidth: 100,
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
      field: 'targetCost',
      headerName: 'Target Cost',
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

  useEffect(() => {
    if (recipeDetails) {
      const recipeDetail = recipeDetails[0]?.ingredients || [];
      const formattedRows = recipeDetail?.map((item, index) => ({
        id: item?.ingredientId,
        // foodType: item?.ingredientType === 'veg' ? 'veg' : 'nonveg', // placeholder fallback
        title: item?.name,
        // type: item?.ingredientType || 'N/A', // Add fallback if type is missing
        specification: item?.specification,
        uom: item?.unit,
        targetCost: item?.cost,
        foodCost: item?.addToFoodCost,
      }));
      setRows(formattedRows);
    }
  }, [recipeDetails]);

  return (
    <Box style={{ marginTop: '1rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Typography variant="h6" fontWeight="bold">
          Recipe
        </Typography>
        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Typography variant="h6" fontWeight="bold">
            Estimated Food Cost Per Portion
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="green">
          ₹{estimatedFoodCost.toFixed(2)}
          </Typography>
        </div> */}
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

export default RecipeDetails;
