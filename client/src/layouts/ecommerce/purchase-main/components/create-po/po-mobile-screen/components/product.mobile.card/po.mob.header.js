import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from '../../../../../../../../hooks/SnackbarProvider';

export const MoPoProductHeader = ({
  code,
  itemName,
  piNumber,
  vendorid,
  isLeftQuantZero,
  isApproved,
  index,
  row,
  onDelete,
  allData,
  rowData,
  setRowData,
  setValuechange,
  handleProductNavigation,
}) => {
  const showSnackbar = useSnackbar();
  const copyVendorName = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        showSnackbar(`Copied ${code} to clipboard`, 'success');
        // Optionally show a confirmation message
      })
      .catch((err) => {
        showSnackbar(err || 'Failed to copy text: ', 'error');
      });
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', width: '100%' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" viewBox="0 0 20 20" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1 5.25C1 4.00736 2.00736 3 3.25 3H16.75C17.9926 3 19 4.00736 19 5.25V14.75C19 15.9926 17.9926 17 16.75 17H3.25C2.00736 17 1 15.9926 1 14.75V5.25ZM2.5 11.0607V14.75C2.5 15.1642 2.83579 15.5 3.25 15.5H16.75C17.1642 15.5 17.5 15.1642 17.5 14.75V12.0607L15.2803 9.84099C14.9874 9.5481 14.5126 9.5481 14.2197 9.84099L12.3107 11.75L12.7803 12.2197C13.0732 12.5126 13.0732 12.9874 12.7803 13.2803C12.4874 13.5732 12.0126 13.5732 11.7197 13.2803L6.53033 8.09099C6.23744 7.7981 5.76256 7.7981 5.46967 8.09099L2.5 11.0607ZM12 7C12 7.55228 11.5523 8 11 8C10.4477 8 10 7.55228 10 7C10 6.44772 10.4477 6 11 6C11.5523 6 12 6.44772 12 7Z"
          fill="#0860E6"
        />
      </svg>
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div className="mob-po-product-name" onClick={() => handleProductNavigation(code)}>
            {itemName}
          </div>
          {piNumber && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                className="mob-po-product-select"
                checked={isApproved === 'Y'}
                disabled={vendorid && !isLeftQuantZero ? false : true}
                onChange={(e) => {
                  const updatedData = [...rowData];
                  updatedData[index]['isApproved'] = e.target.checked ? 'Y' : 'N';
                  setRowData(updatedData);
                  setValuechange(uuidv4());
                }}
              />
            </div>
          )}
        </div>
        <div
          className="mob-product-brand-code"
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <span>
            Code: {code} &nbsp;
            <ContentCopyIcon onClick={copyVendorName} />
          </span>
          {allData?.piType !== 'VENDOR_SPECIFIC' && piNumber && (
            <button
              style={{ border: 'none' }}
              onClick={() => onDelete(row, index)}
              disabled={vendorid && !isLeftQuantZero ? false : true}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                marginBottom="-5px"
              >
                <path
                  d="M9.82692 6L9.59615 12M6.40385 12L6.17308 6M12.8184 3.86038C13.0464 3.89481 13.2736 3.93165 13.5 3.97086M12.8184 3.86038L12.1065 13.115C12.0464 13.8965 11.3948 14.5 10.611 14.5H5.38905C4.60524 14.5 3.95358 13.8965 3.89346 13.115L3.18157 3.86038M12.8184 3.86038C12.0542 3.74496 11.281 3.65657 10.5 3.59622M2.5 3.97086C2.72638 3.93165 2.95358 3.89481 3.18157 3.86038M3.18157 3.86038C3.94585 3.74496 4.719 3.65657 5.5 3.59622M10.5 3.59622V2.98546C10.5 2.19922 9.8929 1.54282 9.10706 1.51768C8.73948 1.50592 8.37043 1.5 8 1.5C7.62957 1.5 7.26052 1.50592 6.89294 1.51768C6.1071 1.54282 5.5 2.19922 5.5 2.98546V3.59622M10.5 3.59622C9.67504 3.53247 8.84131 3.5 8 3.5C7.15869 3.5 6.32496 3.53247 5.5 3.59622"
                  stroke="#6B6B6B"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
