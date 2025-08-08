import React from "react";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from "@mui/material/Box";


export default function Spinner({size}) {
return (
    <Box sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,

          
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
        <Stack sx={{ color: '#0064FE' }} spacing={2} direction="row">      
        <CircularProgress color="inherit"  size={size} />
        </Stack>
      </Box>
    
    );
}