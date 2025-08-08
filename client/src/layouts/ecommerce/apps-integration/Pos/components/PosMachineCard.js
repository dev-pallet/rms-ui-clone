import { Card } from '@mui/material';
import { isSmallScreen } from '../../../Common/CommonFunction';
import { useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';

const PosMachineCard = ({ item, handleBtn, index, handleEdit, handleSave, isediting }) => {
  const [inputvalue, setInputvalue] = useState(item.licenseName);
  const { licenseType } = useParams();
  const isMobileDevice = isSmallScreen();
  return (
    <Card
      key={item?.licenseName}
      style={{
        margin: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '10px',
        flexWrap:'wrap'
      }}
      className={`${isMobileDevice && 'po-box-shadow'}`}
    >
      <SoftBox style={{ display: 'flex', alignItems: 'center' , width:'200px' }}>
        <img
          style={{ width: licenseType === 'mpos'? '30px' : '40px', marginInline: '10px' }}
          src= {licenseType === 'mpos' ? 'https://i.ibb.co/mhPRCyw/pos-terminal.png' : 'https://marketplacedesignoye.s3.ap-south-1.amazonaws.com/food-bill-counter-icon-symbol-icon-vector-logo-.png'}
          alt=""
        />
        {item?.editable ? null : (
          <SoftTypography style={{ fontSize: '0.93rem', paddingInline: '10px' }}>{item?.licenseName}</SoftTypography>
        )}
        {item?.editable ? (
          <SoftBox style={{ display: 'flex' }}>
            <SoftBox>
              <SoftInput
                value={inputvalue}
                onChange={(e) => setInputvalue(e?.target?.value)}
              ></SoftInput>
            </SoftBox>
            <SoftBox>
              <SoftButton
                style={{ marginLeft: '10px' }}
                color="info"
                variant="gradient"
                onClick={() => handleSave(inputvalue, index, item.licenseId)}
              >
                Save
              </SoftButton>
            </SoftBox>
          </SoftBox>
        ) : (
          <SoftBox
            style={{ fontSize: 'medium', marginTop: '3px' }}
            onClick={() => handleEdit(index)}
          >
            <EditIcon style={{ marginLeft: '10px' }} />
          </SoftBox>
        )}
      </SoftBox>
      {item.loader ? (
        <SoftBox style={{display:'flex' , justifyContent:'center' , paddingRight:'25px'}}>
          <Spinner size={'1.3rem'} />
        </SoftBox>
      ) : (
        <SoftBox style={{marginLeft:'auto'}}>
          <SoftButton
            onClick={() => handleBtn(item.licenseId, item?.active ? false : true)}
            color={item?.active ? 'error' : 'info' }
            variant="gradient"
            className="softbtnSize"
          >
            {item?.active ? 'Deactivate' : 'Activate'}
          </SoftButton>
        </SoftBox>
      )}
    </Card>
  );
};
export default PosMachineCard;
