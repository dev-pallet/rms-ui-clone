import { Checkbox } from '@mui/material';
import { format, formatISO, parse, parseISO } from 'date-fns';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import SoftBox from '../../../../../../../../../../components/SoftBox';
import { updateBatchSession } from '../../../../../../../../../../config/Services';
import { useSnackbar } from '../../../../../../../../../../hooks/SnackbarProvider';
import CommonStaticDatePicker from '../../../../../../../../Common/mobile-new-ui-components/static-datepicker';
import CustomCount from '../custom-count';
import './index.css';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const formatDateFromISO = (date) => format(parseISO(date), 'yyyy-MM-dd');
const formatDateToISO = (date) => formatISO(parse(date, 'yyyy-MM-dd', new Date()));

const ItemCount = ({ getBatchesForItems, setShowContent, selectedBatch, sessionStatus, array, setBatchList }) => {
  const dispatch = useDispatch();
  const [batchData, setBatchData] = useState({
    userQuantity: selectedBatch?.userQuantity || '',
    expirationDate: selectedBatch?.expirationDate || '',
    layoutName: selectedBatch?.layoutName || '',
    productNotFound: selectedBatch?.productNotFound || false,
  });
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const showSnackbar = useSnackbar();
  const [saveLoader, setSaveLoader] = useState(false);
  const [inputChanged, setInputChanged] = useState(false);

  const [selectDrawer, setSelectDrawer] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatchData((prev) => ({ ...prev, [name]: value }));
    setInputChanged(true);
  };

  const handleDateFunction = (value) => {
    handleChange({target:{name: 'expirationDate', value: value }})
  };  

  useEffect(() => {
    setBatchData({
      userQuantity: selectedBatch?.userQuantity || '',
      expirationDate: selectedBatch?.expirationDate || '',
      layoutName: selectedBatch?.layoutName || '',
      productNotFound: selectedBatch?.productNotFound || false,
    });
  }, [selectedBatch]);

  const isDisabled = useMemo(
    // () => selectedBatch?.status === 'COMPLETED' || selectedBatch?.status === 'APPROVAL_PENDING',
    () => selectedBatch?.status === 'COMPLETED' || selectedBatch?.status === 'APPROVAL_PENDING' || selectedBatch?.productNotFound === true,
    [selectedBatch],
  );

  const handleSave = async () => {
    if (!batchData?.userQuantity && !batchData?.productNotFound) {
      showSnackbar('Please enter item available count', 'error');
      return;
    }
    if (!batchData?.expirationDate && !batchData?.productNotFound) {
      showSnackbar('Please enter expiry date', 'error');
      return;
    }
    if(saveLoader) return;
    setSaveLoader(true);
    try {
      const payload = {
        batchSessionId: selectedBatch?.batchSessionId,
        userQuantity: batchData?.userQuantity?.toString() || '',
        expirationDate: batchData?.expirationDate,
        layoutName: batchData?.layoutName,
        updatedBy: user_details?.uidx,
        updatedByName: user_details?.firstName + ' ' + user_details?.secondName,
        // productNotFound: isChecked,
        productNotFound: batchData?.productNotFound,
      };

      const response = await updateBatchSession(payload);

      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        setSaveLoader(false);
        return;
      }

      let updatedArray = array.map((el) => {
        if (el.batchSessionId === selectedBatch?.batchSessionId) {
          return {
            ...el,
            ...response?.data?.data?.batchSession, // Spread the properties from the batchSession object
          };
        } else {
          return el; // Return the original element if batchSessionId doesn't match
        }
      });
      setBatchList(updatedArray);

      showSnackbar(response?.data?.data?.message, 'success');
      setShowContent(false);
      // getBatchesForItems();
      setSaveLoader(false);
    } catch (err) {
      setSaveLoader(false);
      console.log(err);
    }
  };
  
  const handleChecked = () => {
    setBatchData((prev) => ({
      ...prev,
      userQuantity: '',
      expirationDate: '',
      layoutName: '',
      productNotFound: !prev?.productNotFound,
    }));
    setInputChanged(true);
  };

  // useEffect(() => {
  //   if(inputChanged){
  //     handleSave();
  //     setInputChanged(false);
  //   }
  // },[inputChanged])

  return (
    <>
      <hr className="horizontal-line-app-ros"/>
      <div className='stack-row-center-between width-100 counter-gap'>
          <div className="flex-colum-align-start">
            <span className="bill-card-label">Available Units</span>
            <CustomCount 
              initialValue={batchData?.userQuantity} 
              min={0} 
              // max={10} 
              step={1} 
              onChange={(newValue) => 
                {
                  handleChange({target: {name: 'userQuantity', value: Number(newValue)}})
                }
              } 
              disabled={
                !!isDisabled ||
                batchData?.productNotFound ||
                sessionStatus === 'COMPLETED' ||
                sessionStatus === 'APPROVAL_PENDING'
              }
            />
          </div>
          <div className="flex-colum-align-start">
            <span className="bill-card-label">Expiry Date</span>
            <span className="bill-card-value">
              <div className={'expiry-date-div'}>
                <button 
                  className={`expiry-date-text ${batchData?.expirationDate ? 'expiry-date-value' : ''}`} 
                  onClick={() => setSelectDrawer(true)}
                  disabled={
                    !!isDisabled ||
                    batchData?.productNotFound ||
                    sessionStatus === 'COMPLETED' ||
                    sessionStatus === 'APPROVAL_PENDING'
                  }
                >
                  {batchData?.expirationDate ? dayjs(batchData?.expirationDate).format('DD-MM-YYYY') : 'DD/MM/YYYY'}
                </button>
              </div>
              <CommonStaticDatePicker
                openDatePicker={selectDrawer}
                onCloseFunction={() => setSelectDrawer(false)}
                datePickerOnAccpetFunction={handleDateFunction}
                value={batchData?.expirationDate}
                disablePast={true}
              />
            </span>
          </div>
          <div className="flex-colum-align-start ">
          {/* {sessionDetails?.jobType === 'OPEN' ? 'Target Products' : 'Product Counted'} */}
            <span className='bill-card-label'>Item Location</span>
            <span className='bill-card-value'>
              <div className='item-location-div'>              
                <input
                  type="text"
                  className='item-location-text'
                  value={batchData?.layoutName}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </span>
            {/* <span className='bill-card-value'>{formatDateDDMMYYYY(sessionDetails?.expectedStartDate) || 'NA'}</span> */}
          </div>
      </div> 
      <div className='stack-row-center-between width-100'>
        {
          (
            (selectedBatch?.status === 'CREATED' && (selectedBatch?.productNotFound === null || selectedBatch?.productNotFound === false)) ||
            (selectedBatch?.status === 'APPROVAL_PENDING' && selectedBatch?.productNotFound === true) ?
            (
            <SoftBox>
              <Checkbox            
                icon={<RadioButtonUncheckedIcon />} checkedIcon={<RadioButtonCheckedIcon />}
                disabled={!!isDisabled}
                //   checked={isChecked}
                checked={batchData?.productNotFound}
                onChange={() => {if(!isDisabled) handleChecked()}}
                className={isDisabled && 'disabled-input'}
              />
              <span
                onClick={() => {if(!isDisabled) handleChecked()}}
                className='bill-card-value'
              >
                Product not found
              </span>
            </SoftBox>
          ) : null)}
        {
        !isDisabled && <div className='item-count-save-btn' onClick={()=> {if(!isDisabled)handleSave()}}>
          <span className='item-count-save-btn-text'>save</span>  
        </div>
        }
      </div>
    </>
  );
};

export default ItemCount;
