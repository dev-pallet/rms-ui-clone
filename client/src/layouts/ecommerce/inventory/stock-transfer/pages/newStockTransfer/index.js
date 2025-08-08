import './index.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
// icons
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { TextareaAutosize } from '@mui/material';
import { buttonStyles } from '../../../../Common/buttonColor';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import AddIcon from '@mui/icons-material/Add';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import EditIcon from '@mui/icons-material/Edit';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';

export const NewStockTransfer = () => {
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();

  const [shipmentMethod, setShipmentMethod] = useState('');
  const [comment, setComment] = useState('');

  const shippingOption = [
    { value: 'pay1', label: 'Company Transport' },
    { value: 'pay2', label: 'Own Transport' },
    { value: 'pay3', label: 'Third Party' },
  ];

  const [productsToTransfer, setProductsToTransfer] = useState([{ id: 1 }]);

  // Function to add a new row
  const handleAddRow = () => {
    const newRow = { id: Date.now() }; // Assign a unique id to the new row
    setProductsToTransfer([...productsToTransfer, newRow]);
  };

  // Function to remove a row by id
  const handleRemoveRow = (id) => {
    // Check if there's more than one row in the array
    if (productsToTransfer.length > 1) {
      const updatedRows = productsToTransfer.filter((row) => row.id !== id);
      setProductsToTransfer(updatedRows);
    } else {
      alert('Cannot delete the last row.');
    }
  };


  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {/* 1  */}
      <SoftBox className="container-card pickup-and-delivery-address-div">
        {/* origin/ pickup  */}
        <SoftBox>
          <SoftTypography fontSize="14px">Origin</SoftTypography>
          <SoftSelect
            mt={1.5}
            placeholder="Select Origin"
            // options={allbranches}
            // onChange={(e) => handleOrigin(e)}
          />
          <SoftBox p={2} className="address-card ">
            <SoftBox className="content-space-between">
              <SoftTypography fontSize="14px">Pickup Address</SoftTypography>
              <EditIcon />
            </SoftBox>
            <SoftTypography fontSize="14px">Line 1</SoftTypography>
            <SoftTypography fontSize="14px">Line 2</SoftTypography>
            <SoftTypography fontSize="14px">City</SoftTypography>
            <SoftTypography fontSize="14px">State</SoftTypography>
            <SoftTypography fontSize="14px">Pincode</SoftTypography>
            <SoftTypography fontSize="14px">Country</SoftTypography>
          </SoftBox>
          <br />
          <SoftTypography fontSize="14px">Pickup Date & Time</SoftTypography>
          <SoftBox mt={1.5}>
            {/* pickup date  */}
            <SoftBox>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['year', 'month', 'day']}
                  label="Select Pickup Date"
                  // value={startDate ? dayjs(startDate) : null}
                  format="DD/MM/YYYY"
                  onChange={(date) => {
                    // handleStartDate(date);
                  }}
                  sx={{
                    width: '100%',
                    '& .MuiInputLabel-formControl': {
                      fontSize: '14px',
                      top: '-0.4rem',
                      color: '#344767 !important',
                      opacity: 0.8,
                    },
                  }}
                />
              </LocalizationProvider>
            </SoftBox>
            {/* estimated pickup time  */}
            <SoftBox mt={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs} pt={2}>
                <DemoContainer
                  components={['TimePicker']}
                  sx={{
                    paddingTop: '13px',
                  }}
                >
                  <TimePicker
                    label="Select Pickup Time"
                    sx={{
                      width: '100%',
                      '& .MuiInputLabel-formControl': {
                        fontSize: '14px',
                        top: '-0.4rem',
                        color: '#344767 !important',
                        opacity: 0.8,
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </SoftBox>
          </SoftBox>
          <br />
          {/* Shipment method  */}
          <SoftTypography fontSize="14px">Shipment Method</SoftTypography>
          <SoftBox mt={1.5}>
            <SoftSelect
              value={shippingOption.find((option) => option.value === shipmentMethod) || ''}
              onChange={(option) => setShipmentMethod(option.value)}
              options={shippingOption}
            />
          </SoftBox>
        </SoftBox>

        {/* delivery address */}
        <SoftBox>
          <SoftTypography fontSize="14px">Destination</SoftTypography>
          <SoftSelect
            mt={1.5}
            placeholder="Select Destination"
            // options={allbranches}
            // onChange={(e) => handleDestinationLoc(e)}
          />
          <SoftBox p={2} className="address-card  ">
            <SoftBox className="content-space-between">
              <SoftTypography fontSize="14px">Delivery Address</SoftTypography>
              <EditIcon />
            </SoftBox>
            <SoftTypography fontSize="14px">Line 1</SoftTypography>
            <SoftTypography fontSize="14px">Line 2</SoftTypography>
            <SoftTypography fontSize="14px">City</SoftTypography>
            <SoftTypography fontSize="14px">State</SoftTypography>
            <SoftTypography fontSize="14px">Pincode</SoftTypography>
            <SoftTypography fontSize="14px">Country</SoftTypography>
          </SoftBox>
          <br />
          <SoftTypography fontSize="14px">Estimated Delivery Date & Time</SoftTypography>
          <SoftBox mt={1.5}>
            {/* estimated delivery date  */}
            <SoftBox>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['year', 'month', 'day']}
                  label="Select Delivery Date"
                  // value={startDate ? dayjs(startDate) : null}
                  format="DD/MM/YYYY"
                  onChange={(date) => {
                    // handleStartDate(date);
                  }}
                  sx={{
                    width: '100%',
                    '& .MuiInputLabel-formControl': {
                      fontSize: '14px',
                      top: '-0.4rem',
                      color: '#344767 !important',
                      opacity: 0.8,
                    },
                  }}
                />
              </LocalizationProvider>
            </SoftBox>
            {/* estimated delivery time  */}
            <SoftBox mt={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={['TimePicker']}
                  sx={{
                    paddingTop: '13px',
                  }}
                >
                  <TimePicker
                    label="Select Delivery Time"
                    sx={{
                      width: '100%',
                      '& .MuiInputLabel-formControl': {
                        fontSize: '14px',
                        top: '-0.4rem',
                        color: '#344767 !important',
                        opacity: 0.8,
                      },
                      '& .MuiStack-root': {
                        paddingTop: '16px',
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </SoftBox>

      {/* 2 */}
      <SoftBox className="container-card" my={3} sx={{ overflowX: 'auto', maxWidth: '100%' }}>
        <SoftBox>
          <SoftTypography fontSize="14px">Add Products To Transfer</SoftTypography>
          <SoftBox sx={{ overflowX: 'auto' }}>
            <table className="add-products-details-table" style={{ width: ' 100%', tableLayout: 'fixed' }}>
              <thead style={{ position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ width: '100px' }}>S No.</th>
                  <th style={{ width: '150px' }}>Barcode</th>
                  <th style={{ width: '200px' }}>Product Title</th>
                  <th style={{ width: '120px' }}>MRP</th>
                  <th style={{ width: '150px' }}>Available Qty</th>
                  <th style={{ width: '150px' }}>Transfer Units</th>
                  <th style={{ width: '150px' }}>Purchase Price</th>
                  <th style={{ width: '120px' }}>Total PP</th>
                  <th style={{ width: '120px' }}>Batch No</th>
                  <th style={{ width: '70px' }}></th>
                </tr>
              </thead>
              <tbody>    
                {
                  productsToTransfer.map((row, index)=>
                    <tr key={row.id}>
                      <td><SoftInput/></td>
                      <td><SoftInput/></td>
                      <td><SoftInput/></td>
                      <td><SoftInput/></td>
                      <td><SoftInput/></td>
                      <td><SoftInput/></td>
                      <td><SoftInput/></td>
                      <td><SoftInput/></td>
                      <td><SoftInput/></td>
                      <td><CloseIcon color='#FF0707' onClick={() => handleRemoveRow(row.id)}/></td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </SoftBox>
          <SoftBox className="add-more-box-div">
            <SoftTypography
              // className="adds add-more-text"
              className="add-more-text"
              component="label"
              variant="caption"
              fontWeight="bold"
              onClick={handleAddRow}
            >
              <AddIcon/> Add More
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>

      {/* 3 */}
      <SoftBox className="container-card content-space-between" sx={{ flexWrap: 'wrap' }}>
        <SoftBox sx={{ width: !isMobileDevice ? '50%' : '100%' }}>
          <SoftTypography fontSize="14px">Add Comments</SoftTypography>
          <TextareaAutosize
            defaultValue={comment}
            onChange={(e) => setComment(e.target.value)}
            aria-label="minimum height"
            minRows={5}
            placeholder="Will be displayed on purchased order"
            style={{
              padding: '10px',
              width: '100%',
              fontSize: '14px',
              border: '1px solid gainsboro',
              borderRadius: '0.5rem',
            }}
          />
        </SoftBox>
        <SoftBox sx={{ width: !isMobileDevice ? '30%' : '100%' }}>
          <SoftTypography fontSize="14px">Taxable Value</SoftTypography>
          <SoftTypography fontSize="14px">SGST</SoftTypography>
          <SoftTypography fontSize="14px">CGST</SoftTypography>
          <SoftTypography fontSize="14px">CESS</SoftTypography>
          <SoftTypography fontSize="14px">Total</SoftTypography>
          <SoftTypography fontSize="14px">Round Off</SoftTypography>
          <SoftTypography fontSize="14px">Additional Expense</SoftTypography>
          <SoftTypography fontSize="14px">
            <CheckBoxIcon color="primary" /> Delivery Charge
          </SoftTypography>
          <SoftTypography fontSize="14px">
            <CheckBoxIcon color="primary" /> Labour Charge
          </SoftTypography>
        </SoftBox>
      </SoftBox>
      <br />
      <SoftBox className="content-right">
        <SoftButton
          variant={buttonStyles.secondaryVariant}
          className="vendor-second-btn outlined-softbutton"
        >
          Cancel
        </SoftButton>
        <SoftBox ml={2}>
          <SoftButton
            variant={buttonStyles.primaryVariant}
            className="vendor-add-btn contained-softbutton"
          >
            Save
          </SoftButton>
        </SoftBox>
      </SoftBox>
      <br />
      <br />
    </DashboardLayout>
  );
};
