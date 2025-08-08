import { Dialog, DialogActions, DialogContent, DialogTitle, InputLabel } from '@mui/material';
import FormField from './formfield';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftSelect from '../../../../../components/SoftSelect';

const DailogeComponent = ({ openDialog, handleCloseDialog, handleSave, handleNewCounter }) => {
  const [newCounter, setNewCounter] = useState('');
  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [licenseType, setLicenseType] = useState('POS');
  const [list, setList] = useState([
    {
      licenseName: '',
      licenseType: 'POS',
      orgId: orgId,
      locId: locId,
      featureName: 'NO_OF_POS_USERS',
      createdBy: object.uidx,
      createdByName: object.firstName + ' ' + object.secondName,
    },
  ]);
  useEffect(() => {
    if (licenseType === 'POS') {
      setList([
        {
          licenseName: '',
          licenseType: 'POS',
          orgId: orgId,
          locId: locId,
          featureName: 'NO_OF_POS_USERS',
          createdBy: object.uidx,
          createdByName: object.firstName + ' ' + object.secondName,
        },
      ]);
    } else if (licenseType === 'MPOS') {
      setList([
        {
          licenseName: '',
          licenseType: 'MPOS',
          orgId: orgId,
          locId: locId,
          featureName: 'NO_OF_MPOS_USERS',
          createdBy: object.uidx,
          createdByName: object.firstName + ' ' + object.secondName,
        },
      ]);
    }
  }, [licenseType]);

  const handleCounterVal = (index, e) => {
    const { name, value } = e.target;
    const temp = [...list];
    temp[index][name] = value;
    setList(temp);
  };

  const handleClickMe = () => {
    if (licenseType === 'POS') {
      setList([
        ...list,
        {
          licenseName: '',
          licenseType: 'POS',
          orgId: orgId,
          locId: locId,
          featureName: 'NO_OF_POS_USERS',
          createdBy: object.uidx,
          createdByName: object.firstName + ' ' + object.secondName,
        },
      ]);
    } else if (licenseType === 'MPOS') {
      setList([
        ...list,
        {
          licenseName: '',
          licenseType: 'MPOS',
          orgId: orgId,
          locId: locId,
          featureName: 'NO_OF_MPOS_USERS',
          createdBy: object.uidx,
          createdByName: object.firstName + ' ' + object.secondName,
        },
      ]);
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '450px',
          },
        },
      }}
    >
      <DialogTitle style={{ fontSize: '0.8rem' }}>Add Counters</DialogTitle>
      <DialogContent>
        <SoftBox
          mb={1}
          ml={0.5}
          display="flex"
          flexDirection="column"
          gap={1}
          className="input-container"
          style={{ marginBotom: '30px' }}
        >
          <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
            license Type
          </InputLabel>
          <SoftSelect
            options={[
              { value: 'POS', label: 'POS' },
              { value: 'MPOS', label: 'MPOS' },
            ]}
            onChange={(e) => setLicenseType(e.value)}
          ></SoftSelect>{' '}
        </SoftBox>
        {list.map((e, i) => {
          return (
            <FormField
              autoFocus
              margin="dense"
              label="Counter Name"
              name="licenseName"
              value={list[i].licenseName}
              onChange={(e) => handleCounterVal(i, e)}
              maxWidth="sm"
              fullWidth
            />
          );
        })}

        <SoftButton onClick={handleClickMe} style={{ marginTop: '15px' }}>
          +Add more
        </SoftButton>
      </DialogContent>
      <DialogActions>
        <SoftButton onClick={handleCloseDialog}>Cancel</SoftButton>
        <SoftButton color="info" variant="gradient" onClick={() => handleNewCounter(list)}>
          Save
        </SoftButton>
      </DialogActions>
    </Dialog>
  );
};

export default DailogeComponent;
