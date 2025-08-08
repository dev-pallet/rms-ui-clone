import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { buttonStyles } from '../../Common/buttonColor';
import { dateFormatter, textFormatter } from '../../Common/CommonFunction';
import { tagFilterdata } from '../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SellIcon from '@mui/icons-material/Sell';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';
import Status from '../../Common/Status';

const TagFilter = () => {
  const navigate = useNavigate();
  const [tagRowData, setTagRowData] = useState([]);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const columns = [
    {
      headerName: 'Tag Name',
      field: 'TagName',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 130,
      flex: 1,
    },
    {
      headerName: 'Tags',
      field: 'Tags',
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: 'gtins',
      field: 'gtins',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 160,
      flex: 1,
    },
    {
      headerName: 'Created at',
      field: 'Createdat',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 130,
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 120,
      flex: 1,
      renderCell:(cellValues)=>{
        return <><Status label={cellValues.value}/></>;
      }
    },
    {
      field: 'button',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 90,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return (
          <SoftButton
            // style={{
            //   backgroundColor: '#4caf50',
            //   color: 'white',
            //   border: 'none',
            //   borderRadius: '5px',
            //   cursor: 'pointer',
            // }}
            variant={buttonStyles.primaryVariant}
            className="contained-softbutton btnInsideTable"
            onClick={() => handleEdit(params)}
          >
            Edit
          </SoftButton>
        );
      },
    },
  ];
  useEffect(() => {
    const payload = {
      page: pageState.page,
      pageSize: pageState.pageSize,
      orgIds: [orgId],
      locationIds: [locId],

      sort: {
        creationDateSortOption: 'DESC',
        tagPriority: 'DEFAULT',
      },
    };
    tagFilterdata(payload)
      .then((res) => {
        const data = res?.data?.data?.data?.data?.map((e, i) => ({
          id: e?.tagId,
          TagName: textFormatter(e?.tagName),
          Tags: e?.tags[0]?.split('_')?.pop(),
          gtins: e?.gtins,
          Createdat: e?.createdAt
            ? // new Date(e?.createdAt).toLocaleString('en-US', {
          //     day: '2-digit',
          //     month: 'short',
          //     year: 'numeric',
          //     hour: '2-digit',
          //     minute: '2-digit',
          //     hour12: true,
          //   })
            dateFormatter(e?.createdAt)
            : 'NA',
          Status: e?.status || 'ACTIVE',
          buttons: '',
        }));
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: [],
          total: res?.data?.data?.data?.totalResults,
        }));
        setTagRowData(data);
      })
      .catch((err) => {});
  }, [pageState.page]);

  const handleEdit = (params) => {
    navigate(`/pallet-hyperlocal/customize/tags/${params?.row?.id}`);
  };
  const handleNew = (gtin) => {
    navigate('/pallet-hyperlocal/customize/tags');
  };
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
    
      <Box className="search-bar-filter-and-table-container">
        <Box className="search-bar-filter-container" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* <Card
            style={{
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          > */}
          <SoftBox style={{ display: 'flex', alignItems: 'center' }}>
            <SellIcon color="white" />
            <SoftTypography style={{ color: '#ffffff', fontSize: '1rem', marginInline: '5px' }}>Tags</SoftTypography>
          </SoftBox>
          <SoftBox style={{ marginLeft: 'auto' }}>
            <SoftButton
              variant="solidWhiteBackground"
              // color="info"
              onClick={handleNew}
              //  style={{ backgroundColor: '#0562FB' }}
            >
              + New
            </SoftButton>
          </SoftBox>
          {/* </Card> */}
        </Box>

        {/* <Card style={{ padding: '20px', marginTop: '10px' }}> */}
        {tagRowData.length ? (
          <SoftBox>
            <Box sx={{ height: 525, width: '100%' }}>
              <DataGrid
                rows={tagRowData ? tagRowData : []}
                columns={columns}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                getRowId={(row) => row.id}
                page={pageState.page - 1}
                pageSize={pageState.pageSize}
                paginationMode="server"
                onPageChange={(newPage) => {
                  setPageState((old) => ({ ...old, page: newPage + 1 }));
                }}
                onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                rowCount={parseInt(pageState.total)}
              />
            </Box>
          </SoftBox>
        ) : (
          <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '15px' }}>
            <img
              src="https://www.simsnd.in/assets/admin/no_data_found.png"
              alt="no data found"
              style={{
                minWidth: '150px',
                maxWidth: '350px',
                borderRadius: '15px',
              }}
            />
          </SoftBox>
        )}
        {/* </Card> */}
      </Box>
    </DashboardLayout>
  );
};

export default TagFilter;
