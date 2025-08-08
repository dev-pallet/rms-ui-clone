import './rejection.css';
import { Button } from '@mui/material';
import { useState } from 'react';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Grid from '@mui/material/Grid';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import { noDatagif } from '../../../../Common/CommonFunction';

const RejectionForm = () => {
  const [openmodel, setOpenmodel] = useState(false);
  const [nodataFound, setNodataFound] = useState(false);

  const handleopen = () => {
    setOpenmodel(true);
  };

  const handleClose = () => {
    setOpenmodel(false);
  };

  const [newBox, setNewbox] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [showTable, setShowTable] = useState('');

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const handlepodetails = () => {
    setNewbox(true);
    setNodataFound(true);
  };

  function handleCheckboxChange(item) {
    setSelectedData((prevData) => {
      if (prevData.includes(item)) {
        return prevData.filter((i) => i !== item);
      }
      return [...prevData, item];
    });
    if (selectedData.includes(item)) {
      sendDataToServer({ ...item, ...inputValues[item.id] });
    }
  }

  function handleInputChange(id, e) {
    setInputValues((prevValues) => {
      return { ...prevValues, [id]: { [e.target.name]: e.target.value } };
    });
  }

  const change = (key, value, id) => {
    const index = selectedData.findIndex((item) => item.id == id);
    const dumm_obj = selectedData[index];
    dumm_obj[key] = value;

    const arr = [...selectedData];
    arr[index] = dumm_obj;
    setSelectedData([...arr]);
  };

  const handleSessionchange = () => {
    setShowTable(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ overflow: 'visible' }}>
        <SoftBox p={3}>
          <SoftBox mt={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <SoftBox>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      PO Number
                    </SoftTypography>
                  </SoftBox>

                  <SoftBox className="form-flex-inward-box">
                    <Grid item xs={11} md={11} xl={11}>
                      <SoftInput
                        type="text"
                        placeholder="Eg : 77700244"
                        onChange={(e) => setPoNumber(e.target.value)}
                      />
                    </Grid>

                    <SoftBox className="wrapper-btn-box-inward">
                      <Button className="vefir-bnt" onClick={handlepodetails}>
                        Verify
                      </Button>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>

                <Grid>
                  {nodataFound ? (
                    <Grid item xs={12} sm={12}>
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Inward Sessions
                      </SoftTypography>
                      <SoftSelect
                        defaultValue={{ value: '', label: 'Session Id' }}
                        options={[
                          { value: 'ek', label: 'INW0001' },
                          { value: 'kul', label: 'INW002' },
                          { value: 'kul', label: 'INW003' },
                          { value: 'gu', label: 'INW004' },
                          { value: 'gu', label: 'INW005' },
                        ]}
                        onChange={handleSessionchange}
                      />
                    </Grid>
                  ) : (
                    <SoftBox className="middle-box-center">
                      <img className="src-imgg" src={noDatagif} alt="err" />
                    </SoftBox>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </SoftBox>
        </SoftBox>
        {showTable ? (
          <>
            <table className="styled-table">
              <thead>
                <tr>
                  <th className="th-text">
                    <Checkbox className="kalu" />
                  </th>
                  <th className="gold-text">Sku</th>
                  <th className="gold-text">Last Inward</th>
                  <th className="gold-text">Batch Id</th>
                  <th className="gold-text">Gtin</th>
                  <th className="gold-text">Rejection Reason</th>
                </tr>
              </thead>

              <>
                <tbody>
                  <tr>
                    <td className="gold-text">
                      <Checkbox
                        // onClick={handleLocation}
                        className="chekbox-main"
                        // checked={selectedData.includes(item)}
                        // onChange={() => handleCheckboxChange(item)}
                        {...label}
                      />
                    </td>
                    <td className="gold-text">Body loofah Green Apple</td>
                    <td className="gold-text">200</td>
                    <td className="gold-text">BT0001</td>
                    {/* {item.gtin === null ? (
                                  <td className="gold-text">-----</td>
                                ) : ( */}
                    <td className="gold-text">GRTSYDN000058524D</td>
                    {/* )} */}
                    <td>
                      <SoftSelect
                        defaultValue={{ value: '', label: 'Rejection Reason' }}
                        options={[
                          { value: 'DAMAGED_PACKET', label: 'DAMAGED PACKET' },
                          { value: 'POOR_QUALITY', label: 'POOR QUALITY' },
                          { value: 'USED_PRODUCT', label: 'USED PRODUCT' },
                          { value: 'MISSING_ITEM', label: 'MISSING ITEM' },
                          { value: 'LESS_QUANTITY', label: 'LESS QUANTITY' },
                        ]}
                      />
                    </td>
                  </tr>
                </tbody>
              </>
            </table>
          </>
        ) : (
          ''
        )}

        <SoftBox className="grad-info-btn">
          <SoftBox className="sm-width">
            <SoftButton>cancel</SoftButton>
            <SoftButton variant="gradient" color="info">
              save
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </Card>
    </DashboardLayout>
  );
};

export default RejectionForm;
