import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import StraightIcon from '@mui/icons-material/Straight';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import { deleteSegmentById, getAllMarketingSegmentsList, postEmailTemplate2 } from '../../../../../config/Services';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import audience_template from './AudienceListEmail(1).html';
import fetchCsvData from './fetchCsvData';

const AllcontactsPage = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportLoader, setExportLoader] = useState(false);
  const [clickedRow, setClickedRow] = useState('')

  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);
  const markUpOpen = Boolean(anchorMarkupEl);
  const userRoles = localStorage.getItem('user_roles');
  const isSuperAdmin = userRoles.includes('SUPER_ADMIN');

  const [openAlert, setOpenAlert] = useState(false);
  const [loader, setLoader] = useState(false);
  const generateUniqueName = (id) => {
    const timestamp = Date.now();
    return `${id.replace(/ /g, '_')}_${timestamp}`;
  };

  const columns = [
    {
      field: 'listName',
      headerName: 'List Name',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'listId',
      headerName: 'List Id',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'contacts',
      headerName: 'Total Contacts',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 200,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'creationDate',
      headerName: 'Creation Date',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'modifiedDate',
      headerName: 'Last Modified Date',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'actions',
      headerName: '',
      minWidth: 40,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        const handleClick = (event) => {
          setAnchorMarkupEl(event.currentTarget);
          setClickedRow(params.row)
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleDelete = (segmentId) => {
          if (isSuperAdmin) {
            deleteSegmentById(segmentId)
              .then((res) => {
                showSnackbar('List deleted successfully', 'success');
                handleCloseOp();
                getAllLists();
              })
              .catch((error) => {
                showSnackbar('There was an error deleting the list', 'error');
              });
          } else {
            setOpenAlert(true);
          }
        };

        const handleExportToAdmin = (segmentId, segmentName, creationDate) => {
          const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
          const userEmail = JSON.parse(localStorage.getItem('user_details')).email;
          const name = localStorage.getItem('user_name');
          const clientId = localStorage.getItem('clientId');
          const locId = localStorage.getItem('locId');
          const orgId = localStorage.getItem('orgId');
          const orgName = localStorage.getItem('orgName');
          setExportLoader(true);

          const payload1 = {
            clientId: clientId,
            templateType: 'EMAIL',
            userId: uidx,
          };

          const emailPayload = {
            clientId: clientId,
            templateName: generateUniqueName('audience_listing_email_template'),
            segmentId: segmentId,
            reportType: 'CSV',
            reportCreatedBy: 'NMS',
            reportJobType: 'FIXED',
            reportFrequency: 'DAILY',
            noOfTimesToCreateReport: '10',
            subject: 'Audience List',
            senderName: orgName,
            senderEmailId: 'no-reply@palletnow.co',
            toEmail: userEmail,
            toName: name,
            ccName: 'Swagata',
            bccName: 'Nitika',
            ccEmail: 'swagata.m@palletnow.co',
            bccEmail: 'nitika.g@palletnow.co',
            firstParam: 'string',
            secondParam: orgId,
            templateType: 'EMAIL',
            templateData: {
              audienceListName: segmentName,
              insertDate: creationDate,
            },
          };

          const filePayload = new Blob([audience_template], { type: 'text/html' });
          const templatePayload = new Blob([JSON.stringify(emailPayload)], { type: 'application/json' });
          const formData = new FormData();
          formData.append('file', filePayload);
          formData.append('sendCsvAsEmail', templatePayload);

          postEmailTemplate2(formData)
            .then((res) => {
              if (res?.data?.status === 'ERROR') {
                showSnackbar(res?.data?.message, 'error');
                setExportLoader(false);
                handleCloseOp();
                return;
              }
              if (res?.data?.status === 'SUCCESS') {
                setExportLoader(false);
                handleCloseOp();
                showSnackbar('Your list has been exported to admin', 'success');
              }
            })
            .catch((error) => {
              if (error?.message?.includes('socket hang up')) {
                showSnackbar('Socket hang up error. Please try again.', 'error');
              } else {
                showSnackbar('Error while fetching the list', 'error');
              }
              setExportLoader(false);
              handleCloseOp();
            });
        };

        return (
          <div>
            <Button
              id="basic-button"
              aria-controls={markUpOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={markUpOpen ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertRoundedIcon sx={{ fontSize: '14px' }} />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorMarkupEl}
              open={markUpOpen}
              onClose={handleCloseOp}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem
                onClick={() => handleExportToAdmin(clickedRow?.listId, clickedRow?.listName, clickedRow?.creationDate)}
              >
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  {!exportLoader ? (
                    <div>
                      <OpenInBrowserIcon />
                      Export to Admin
                    </div>
                  ) : (
                    <div>
                      <CircularProgress
                        size={18}
                        sx={{
                          color: '#fff',
                        }}
                      />
                    </div>
                  )}
                </div>
              </MenuItem>
              <MenuItem onClick={() => handleDelete(clickedRow?.listId)}>
                <div
                  style={{
                    color: 'red',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <DeleteIcon /> Delete List
                </div>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getAllLists = async () => {
    setLoader(true);
    try {
      const res = await getAllMarketingSegmentsList(orgId);

      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message, 'error');
        return; 
      }

      const updatedDataRow = await Promise.all(
        res?.data?.data.map(async (item, index) => {
          setLoader(false)
          const createdOn = new Date(item?.createdDate);
          const formattedDate = `${createdOn?.getDate()} ${months[createdOn?.getMonth()]} ${createdOn?.getFullYear()}`;

          const lastSegmentRequest = item?.segmentRequest[item?.segmentRequest.length - 1];

          const modifiedOn = new Date(lastSegmentRequest?.requestTime);
          const formattedModifiedDate = `${modifiedOn?.getDate()} ${
            months[modifiedOn?.getMonth()]
          } ${modifiedOn?.getFullYear()}`;

          let contacts = '-----';
          let total = '-----';
          if (lastSegmentRequest?.url) {
            try {
              contacts = await fetchCsvData(lastSegmentRequest?.url);
              total = contacts?.length - 1;
              setLoader(false);
            } catch (error) {
              total = '-----';
              setLoader(false);
              showSnackbar(`Failed to fetch contacts for ${item?.segmentName}`, 'error');
            }
          }

          let status;
          if (lastSegmentRequest?.status === 'REPORT_COMPLETED') {
            status = 'Created';
          } else if (lastSegmentRequest?.status === 'REPORT_IN_PROGRESS') {
            status = 'In Progress';
          } else if (lastSegmentRequest?.status === 'REPORT_FAILED') {
            status = 'Failed';
          } else {
            status = '-----';
          }

          return {
            id: index + 1,
            listName: item?.segmentName,
            listId: item?.segmentId,
            contacts: lastSegmentRequest && contacts ? total : '-----',
            creationDate: formattedDate,
            modifiedDate: lastSegmentRequest ? formattedModifiedDate : '-----',
            status: lastSegmentRequest ? status : '-----',
          };
        }),
      );

      setRowData(updatedDataRow);
    } catch (err) {
      setLoader(false);
      showSnackbar('Error while getting segments list', 'error');
    }
  };

  useEffect(() => {
    getAllLists();
  }, []);

  const filteredData = rowData?.filter((row) => {
    return row?.listName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      <Dialog onClose={() => setOpenAlert(false)} open={openAlert}>
        <DialogTitle>Permission required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sorry, You do not have permission to delete a list. Contact your admin to get the permission.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAlert(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <SoftTypography style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>All Contacts</SoftTypography>
          <div style={{ display: 'flex', gap: '20px' }}>
            <SoftButton className="vendor-second-btn" onClick={() => navigate('/marketing/contacts/import')}>
              Import Audience <StraightIcon />
            </SoftButton>
            <SoftButton className="vendor-add-btn" onClick={() => navigate('/marketing/contacts/create')}>
              Create Custom Audience
            </SoftButton>
          </div>
        </SoftBox>

        {/* <SoftBox style={{ marginTop: '20px' }} className="contacts-page-no-block">
          <img
            className="src-dummy-img"
            src="https://cdn.dribbble.com/users/458522/screenshots/3571483/create.jpg?resize=800x600&vertical=center"
          />
          <Typography
            style={{
              fontWeight: '200',
              fontSize: '1.6rem',
              lineHeight: '1.5',
              color: '#4b524d',
              textAlign: 'center',
            }}
          >
            You have not added any customer yet
          </Typography>
          <div style={{ display: 'flex', gap: '20px' }}>
            <SoftButton className="vendor-second-btn" onClick={() => navigate('/marketing/contacts/import')}>
              Import Audience <StraightIcon />
            </SoftButton>
            <SoftButton className="vendor-add-btn" onClick={() => navigate('/marketing/contacts/create')}>
              Create Custom Audience
            </SoftButton>
          </div>
        </SoftBox> */}

        <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
          <SoftBox className="search-bar-filter-container">
            <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box className="all-products-filter-product" style={{ width: '350px' }}>
                <SoftInput
                  className="all-products-filter-soft-input-box"
                  placeholder="Search Audience"
                  icon={{ component: 'search', direction: 'left' }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Box>
            </SoftBox>
          </SoftBox>
          <SoftBox>
            <Box sx={{ height: 525, width: '100%' }}>
              {loader && <Spinner />}
              {!loader && (
                <DataGrid
                  rows={filteredData}
                  columns={columns}
                  pagination
                  pageSize={10}
                  getRowId={(row) => row.listId}
                  onCellClick={(params) => {
                    if (params.field !== 'actions') {
                      navigate(`/marketing/contacts/${params.row.listId}`);
                    }
                  }}
                />
              )}
            </Box>
          </SoftBox>
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default AllcontactsPage;
