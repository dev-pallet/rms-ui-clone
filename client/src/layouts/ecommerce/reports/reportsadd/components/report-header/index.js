import { Card, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import SoftInput from '../../../../../../components/SoftInput';
import { useEffect, useState } from 'react';
import {
  billReportArray,
  gstReportArray,
  InventoryReportArray,
  marketingReportArray,
  OperatorReportArray,
  purchaseReportsArray,
  salesReportArray,
} from '../../../components/ReportsData';
import { useNavigate } from 'react-router-dom';

function ReportHeader() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);

  const searchReports = (searchValue) => {
    const reportSectionReports = gstReportArray?.flatMap(
      (section) => section?.reports?.map((report) => ({ ...report, source: 'Gst', subSource: section?.heading })), // Add source based on section heading
    );

    const allReports = [
      ...purchaseReportsArray?.[0]?.reports.map((report) => ({ ...report, source: 'Purchase' })),
      ...InventoryReportArray.filter((report) => report.available !== false).map((report) => ({
        ...report,
        source: 'Inventory',
      })),
      ...salesReportArray
        .filter((report) => report?.available === true)
        .map((report) => ({ ...report, source: 'Sales' })),
      ...reportSectionReports,
      ...billReportArray?.map((report) => ({ ...report, source: 'Bill&Payment' })),
      ...marketingReportArray?.map((report) => ({ ...report, source: 'Marketing' })),
      ...OperatorReportArray?.map((report) => ({ ...report, source: 'Operator' })),
    ];

    return allReports.filter((report) => report.title.toLowerCase().includes(searchValue.toLowerCase())).slice(0, 20); // Limit to 20 results
  };

  useEffect(() => {
    if (searchValue) {
      const results = searchReports(searchValue);
      setFilteredReports(results);
    } else {
      setFilteredReports([]);
    }
  }, [searchValue]);

  const handleRedirection = (report) => {
    if (!report || !report.source) return;

    const { source, subSource, onCardParam, pos, key, path } = report;

    switch (source) {
      case 'Purchase':
      case 'Bill&Payment':
        navigate(`/reports/Generalreports/${onCardParam}`);
        break;

      case 'Inventory':
        navigate(`/reports/InventoryChart/${key}`);
        break;

      case 'Sales':
        if (onCardParam) {
          const salesPath = pos ? `/reports/pos/${onCardParam}` : `/reports/Saleschart/${onCardParam}`;
          navigate(salesPath);
        } else {
          navigate('/reports/Saleschart');
        }
        break;

      case 'Gst':
        const gstPath =
          subSource === 'Sales' ? `/reports/gstchart/${onCardParam}` : `/reports/Generalreports/${onCardParam}`;
        navigate(gstPath);
        break;

      case 'Marketing':
      case 'Operator':
        navigate(path);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '60px',
          padding: '10px 5px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <Typography fontWeight="550" fontSize="1.2rem">
          Reports
        </Typography>
        <SoftInput
          size="small"
          style={{ maxWidth: '600px' }}
          icon={{ component: 'search', direction: 'right' }}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search"
        />
      </Box>
      {filteredReports?.length > 0 && (
        <>
          <Card sx={{ padding: '15px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontSize: '0.9rem', color: '#555' }}>
              Search Results:
            </Typography>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {filteredReports?.map((report, index) => (
                <li
                  key={index}
                  style={{
                    padding: '6px 0',
                    borderBottom: '1px solid #e0e0e0',
                    fontSize: '0.85rem',
                  }}
                >
                  <span
                    style={{
                      color: 'blue',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleRedirection(report)}
                  >
                    {report?.title}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <br />
        </>
      )}
    </>
  );
}

export default ReportHeader;
