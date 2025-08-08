import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';

const CopyPasteContacts = () => {
  const [showSyntax, setShowSyntax] = useState(false);
  const inputRef = useRef(null);
  const inputRef1 = useRef(null);
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showInput, setShowInput] = useState(true);
  const [showList, setShowList] = useState(false);
  const navigate = useNavigate();

  const handleCheckData = () => {
    setShowInput(false);
    setShowData(true);
    inputRef1.current.select();
    document.execCommand('copy');

    const copiedData = inputRef1.current.value;
    const rows = copiedData.split('\n').map((row) => row.split(','));

    const headerRow = rows[0].map((header) => header.trim());

    const formattedData = rows.slice(1).map((row, index) => {
      const rowData = { id: index + 1 };
      row.forEach((column, columnIndex) => {
        rowData[headerRow[columnIndex]] = column.trim();
      });
      return rowData;
    });

    const dynamicColumns = headerRow.map((header) => ({
      field: header,
      headerName: header,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    }));

    setColumns(dynamicColumns);
    setData(formattedData);
  };

  const handleCopyClick = () => {
    inputRef.current.select();
    document.execCommand('copy');
  };

  const handleEditData = () => {
    setShowInput(true);
    setShowData(false);
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
            padding: '20px',
          }}
        >
          <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <Typography>Copy/Paste</Typography>
            <SoftButton className="vendor-add-btn" onClick={() => navigate('/marketing/contacts')}>
              Exit
            </SoftButton>
          </SoftBox>
          <hr />
          <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <div>
              <Typography> Upload your file</Typography>
              <Typography
                style={{
                  fontWeight: '200',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: '#4b524d',
                  textAlign: 'left',
                  margin: '10px 0px',
                }}
              >
                Copy/paste your contacts from a file.
              </Typography>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <SoftButton className="vendor-second-btn" onClick={() => setShowSyntax(!showSyntax)}>
                {showSyntax ? 'Hide the expected syntax' : 'Show the expected syntax'}
              </SoftButton>
            </div>
          </SoftBox>

          {showSyntax ? (
            <SoftBox className="show-syntax-box">
              <Typography
                style={{
                  fontWeight: '200',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: '#4b524d',
                  textAlign: 'left',
                  margin: '10px 0px',
                }}
              >
                Example of expected syntax.
              </Typography>
              {/* <div style={{ margin: '20px' }}>
                <textarea ref={inputRef} rows={4} cols={50} defaultValue={defaultData} />
                <br />
                <button >Copy</button>
              </div> */}
              <SoftBox className="copy-text-box">
                <div
                  onClick={handleCopyClick}
                  style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}
                >
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    <FileCopyIcon />
                    Copy
                  </Typography>
                </div>
                <hr />
                {/* <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                  ref={inputRef}
                >
                  CONTACT_ID,EMAIL,FIRSTNAME,LASTNAME,SMS,LANDLINE_NUMBER,WHATSAPP
                  123456,emma@example.com,Emma,Dubois,33612345678,33612345678,33612345678
                  789123,mickael@example.com,Mickael,Parker,15555551234,15555551234,15555551234
                  456789,ethan@example.com,Jakob,Müller,4930901820,4930901820,4930901820
                </Typography> */}
                <textarea
                  className="copy-text"
                  ref={inputRef}
                  rows={5}
                  cols={90}
                  defaultValue={
                    'CONTACT_ID,EMAIL,FIRSTNAME,LASTNAME,SMS,LANDLINE_NUMBER,WHATSAPP\n' +
                    '123456,emma@example.com,Emma,Dubois,33612345678,33612345678,33612345678\n' +
                    '789123,mickael@example.com,Mickael,Parker,15555551234,15555551234,15555551234\n' +
                    '456789,ethan@example.com,Jakob,Müller,4930901820,4930901820,4930901820'
                  }
                />
              </SoftBox>
            </SoftBox>
          ) : null}

          {showInput && (
            <SoftBox style={{ marginTop: '20px' }}>
              <textarea
                className="copy-text-input"
                ref={inputRef1}
                rows={7}
                cols={120}
                placeholder={
                  'CONTACT_ID,EMAIL,FIRSTNAME,LASTNAME,SMS,LANDLINE_NUMBER,WHATSAPP\n' +
                  '123456,emma@example.com,Emma,Dubois,33612345678,33612345678,33612345678\n' +
                  '789123,mickael@example.com,Mickael,Parker,15555551234,15555551234,15555551234\n' +
                  '456789,ethan@example.com,Jakob,Müller,4930901820,4930901820,4930901820'
                }
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <SoftButton className="vendor-add-btn" onClick={handleCheckData}>
                  Check the data
                </SoftButton>
              </div>
            </SoftBox>
          )}

          {showData && (
            <>
              <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
                <DataGrid rows={data} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '20px' }}>
                <SoftButton className="vendor-add-btn" onClick={handleEditData}>
                  Edit Data
                </SoftButton>
                <SoftButton className="vendor-second-btn" onClick={() => setShowList(true)}>
                  Confirm your Data
                </SoftButton>
              </div>
            </>
          )}

          {showList ? (
            <SoftBox style={{ marginTop: '20px' }}>
              <Typography>Create a List</Typography>
              <Typography
                style={{
                  fontWeight: '200',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: '#4b524d',
                  textAlign: 'left',
                  margin: '10px 0px',
                }}
              >
                Give name to the contacts list
              </Typography>
              <SoftBox style={{ marginTop: '10px' }}>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#0562FB',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  List Name
                </Typography>
                <SoftInput placeholder="List Name" style={{ width: '400px' }} />
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  List name Give your list an internal name to help organize and locate it easily within your account.
                  For example: 'Course_offer'
                </Typography>
              </SoftBox>
              <SoftBox display="flex" justifyContent="flex-end" mt={4}>
                <SoftBox display="flex">
                  <SoftButton className="vendor-second-btn" onClick={() => navigate('/marketing/contacts')}>
                    Cancel
                  </SoftButton>
                  <SoftBox ml={2}>
                    <SoftButton
                      // variant="gradient"
                      color="info"
                      className="vendor-add-btn"
                    >
                      Create
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </SoftBox>
          ) : null}
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default CopyPasteContacts;
