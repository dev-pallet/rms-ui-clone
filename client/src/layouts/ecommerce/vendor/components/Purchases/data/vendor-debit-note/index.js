import { DataGrid } from '@mui/x-data-grid';
import { dataGridStyles } from '../../../../../Common/NewDataGridStyle';
import { useParams } from 'react-router-dom';
import { vendorDebitNoteFilter } from '../../../../../../../config/Services';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import moment from 'moment';
import { noDatagif } from '../../../../../Common/CommonFunction';
const DebitNote = () => {
  const { vendorId } = useParams();
  const [loader, setLoader] = useState(false);
  const [errorTableData, setErrorTableData] = useState(false);
  const [debitNoteList, setDebitNoteList] = useState([]);

  const convertUTCDateToLocalDate = (dat) => {
    const date = moment.utc(dat).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();
    return moment(stillUtc).local().format('L, LT');
  };
  const columns = [
    {
      field: 'debitNoteId',
      headerName: 'Debit note id',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 220,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'returnId',
      headerName: 'Return id',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 220,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'createdOn',
      headerName: 'Created on',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'returnAmount',
      headerName: 'Return amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      width: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  const fetchDebitNote = async () => {
    const payload = {
      vendorId: [vendorId],
    };
    setLoader(true);
    try {
      const res = await vendorDebitNoteFilter(payload);
      if (res?.data?.data?.es == 0) {
        const result = res?.data?.data?.debitNoteList;
        if (result.length) {
          const totalList = result.map((item) => ({
            debitNoteId: item?.debitNoteId !== null ? item?.debitNoteId : '---',
            returnId: item?.returnId !== null ? item?.returnId : '---',
            status: item?.status !== null ? item?.status : '---',
            createdOn: item?.createdOn !== null ? convertUTCDateToLocalDate(item?.createdOn) : '---',
            returnAmount: item?.returnAmount ? '₹' + item?.returnAmount : '---',
          }));
          setDebitNoteList(totalList);
        }
      } else {
        setErrorTableData(true);
      }
    } catch (err) {
      setErrorTableData(true);
    }
  };

  useEffect(() => {
    fetchDebitNote();
  }, []);

  return (
    <SoftBox py={1}>
      <SoftBox className="softbox-box-shadow">
        <Box sx={{ height: 400, width: '100%' }}>
          {errorTableData ? (
            <SoftBox className="No-data-text-box">
              <SoftBox className="src-imgg-data">
                <img className="src-dummy-img" src={noDatagif} />
              </SoftBox>

              <h3 className="no-data-text-I">NO DATA FOUND</h3>
            </SoftBox>
          ) : (
            <DataGrid
              sx={{ ...dataGridStyles.header, borderRadius: '20px' }}
              rows={debitNoteList}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              // checkboxSelection
              // disableSelectionOnClick
              // onCellClick={(rows) => handleNavigation(rows)}
              getRowId={(row) => row.debitNoteId}
            />
          )}
        </Box>
      </SoftBox>
    </SoftBox>
  );
};

export default DebitNote;
