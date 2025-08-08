import './leveltwo.css';
import { Grid } from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import sideNavUpdate from '../../../../../components/Utility/sidenavupdate';

const Subcategory = () =>{
  sideNavUpdate();
    
  const [newRow,setNewRow] = useState([{id:1}]);

  const handleRow=(a)=>{
    setNewRow([...newRow,{id:newRow[newRow.length-1].id+a}]);
  };

  const handleRemove=(payload)=>{
    if(newRow.length>1){
      setNewRow([...newRow.filter((e)=>e.id!==payload)]);
    }
       
  };

  return (
    <DashboardLayout>
      <DashboardNavbar/>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} xl={12} m={3} className="main-card-level-box">

          <SoftTypography className="level-text">LEVEL-II</SoftTypography>
          <>
            <p className="ptext">Level one category feild</p>
            <SoftBox className="main-category-input-box">
              <SoftInput className="hoor"/>
            </SoftBox>
          </>
        </Grid>
        <Grid item xs={12} md={12} xl={12} m={3} className="main-card-level-box">
          <p className="ptext-II">Level two category feild</p>

          {newRow.map((e)=>{
            return(
              <>
                <SoftBox key={e.id} className="main-category-input-box-II">
                  <SoftInput className="hoor"/>
                  <CloseIcon className="close-iconss" onClick={()=>handleRemove(e.id)}/>
                </SoftBox>
              </>
            );
          })}

          <SoftTypography className="main-add-text-II" onClick={()=>handleRow(1)} >Add more +</SoftTypography>
                            
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Subcategory;